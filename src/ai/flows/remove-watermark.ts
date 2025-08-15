'use server';

/**
 * @fileOverview Removes unimportant elements from an image.
 *
 * - removeWatermark - A function that handles the element removal process.
 * - RemoveWatermarkInput - The input type for the removeWatermark function.
 * - RemoveWatermarkOutput - The return type for the removeWatermark function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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

const RemoveWatermarkInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The source image with elements to remove, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
    ),
  userId: z.string().optional().describe("The user's ID to associate with the generated image."),
});
export type RemoveWatermarkInput = z.infer<typeof RemoveWatermarkInputSchema>;

const RemoveWatermarkOutputSchema = z.object({
  imageUrl: z.string().nullable().describe('The data URI of the image with the elements removed.'),
});
export type RemoveWatermarkOutput = z.infer<typeof RemoveWatermarkOutputSchema>;

export async function removeWatermark(input: RemoveWatermarkInput): Promise<RemoveWatermarkOutput> {
  return removeWatermarkFlow(input);
}

const removeWatermarkFlow = ai.defineFlow(
  {
    name: 'removeWatermarkFlow',
    inputSchema: RemoveWatermarkInputSchema,
    outputSchema: RemoveWatermarkOutputSchema,
  },
  async (input) => {
    const serviceId = "removeWatermark";
    
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
        prompt: [
          { media: { url: input.photoDataUri } },
          { text: 'Remove any distracting or unimportant elements from this image. Focus on the main subject and clean up the background. Only return the edited image.' },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
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

      return { imageUrl: media?.url ?? null };
    } catch (error: any) {
      console.error('Error removing elements from image:', error);
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
