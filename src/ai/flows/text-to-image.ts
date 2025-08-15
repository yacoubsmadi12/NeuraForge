'use server';

/**
 * @fileOverview Generates an image from a text prompt.
 *
 * - textToImage - A function that handles the image generation process.
 * - TextToImageInput - The input type for the textToImage function.
 * - TextToImageOutput - The return type for the textToImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { saveGeneratedImage } from '@/lib/image-storage';
// --- ADDED IMPORTS ---
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// ---------------------

const TextToImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  userId: z.string().optional().describe("The user's ID to associate with the generated image."),
});
export type TextToImageInput = z.infer<typeof TextToImageInputSchema>;

const TextToImageOutputSchema = z.object({
  imageUrl: z.string().nullable().describe('The data URI of the generated image.'),
});
export type TextToImageOutput = z.infer<typeof TextToImageOutputSchema>;

export async function textToImage(input: TextToImageInput): Promise<TextToImageOutput> {
  return textToImageFlow(input);
}

const textToImageFlow = ai.defineFlow(
  {
    name: 'textToImageFlow',
    inputSchema: TextToImageInputSchema,
    outputSchema: TextToImageOutputSchema,
  },
  async (input) => {
    const serviceId = 'textToImage';

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
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_ONLY_HIGH',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_ONLY_HIGH',
            },
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_ONLY_HIGH',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_ONLY_HIGH',
            },
          ]
        },
      });

      // --- DEDUCT CREDIT AFTER SUCCESSFUL GENERATION ---
      await updateDoc(subscriptionRef, {
        [`usage.${serviceId}`]: increment(1),
      });
      // ------------------------------------------------

      if (media?.url && input.userId) {
        try {
          await saveGeneratedImage(input.userId, media.url, input.prompt);
        } catch (error) {
          console.error("Failed to save image to gallery:", error);
        }
      }

      return { imageUrl: media?.url ?? null };
    } catch (error: any) {
      console.error('Error generating image:', error);
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
