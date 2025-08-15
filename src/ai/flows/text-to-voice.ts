'use server';

/**
 * @fileOverview Converts text to speech using the Gemini 2.5 Flash Preview TTS model.
 *
 * - textToSpeech - A function that converts text to speech and returns the audio data URI.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
// --- ADDED IMPORTS ---
import { getAuth } from 'firebase-admin/auth';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase-admin';
// ---------------------

// --- ADDED HELPER FUNCTION ---
const checkAndIncrementUsage = async (serviceId: string) => {
  const user = await auth().currentUser;
  if (!user) {
    throw new Error("User not authenticated.");
  }

  const subscriptionRef = doc(db, 'subscriptions', user.uid);
  const subscriptionSnap = await getDoc(subscriptionRef);

  if (!subscriptionSnap.exists()) {
    throw new Error("Subscription not found for this user.");
  }

  const subscriptionData = subscriptionSnap.data();
  const usageCount = subscriptionData.usage?.[serviceId] || 0;
  const limit = subscriptionData.limit;

  if (subscriptionData.plan !== 'Unlimited' && usageCount >= limit) {
    throw new Error("Insufficient credit. Please upgrade your plan.");
  }

  await updateDoc(subscriptionRef, {
    [`usage.${serviceId}`]: increment(1),
  });
};
// -----------------------------

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  userId: z.string().optional().describe("The user's ID to associate with the audio file."),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The audio data URI in WAV format.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    const serviceId = "textToVoice"; // Using a consistent ID
    
    // --- ADDED CREDIT CHECK LOGIC ---
    if (!input.userId) {
      throw new Error("User not authenticated.");
    }
    
    const subscriptionRef = doc(db, 'subscriptions', input.userId);
    const subscriptionSnap = await getDoc(subscriptionRef);
    
    if (!subscriptionSnap.exists()) {
      throw new Error("Subscription not found for this user.");
    }

    const subscriptionData = subscriptionSnap.data();
    const usageCount = subscriptionData.usage?.[serviceId] || 0;
    const limit = subscriptionData.limit;
    
    if (subscriptionData.plan !== 'Unlimited' && usageCount >= limit) {
      throw new Error("Insufficient credit. Please upgrade your plan.");
    }
    // ----------------------------------

    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: input.text,
      });

      if (!media) {
        throw new Error('no media returned');
      }

      // --- DEDUCT CREDIT AFTER SUCCESSFUL GENERATION ---
      await updateDoc(subscriptionRef, {
        [`usage.${serviceId}`]: increment(1),
      });
      // ------------------------------------------------

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      return {
        media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
      };
    } catch (error: any) {
      console.error('Error generating audio:', error);
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
