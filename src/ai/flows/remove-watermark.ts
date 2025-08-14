'use server';

/**
 * @fileOverview Removes unimportant elements from an image.
 *
 * - removeWatermark - A function that handles the element removal process.
 * - RemoveWatermarkInput - The input type for the removeWatermark function.
 * - RemoveWatermarkOutput - The return type for the removeWatermark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemoveWatermarkInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The source image with elements to remove, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: 'Remove any distracting or unimportant elements from this image. Focus on the main subject and clean up the background. Only return the edited image.'},
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

      return {imageUrl: media?.url ?? null};
    } catch (error: any) {
      console.error('Error removing elements from image:', error);
      // Re-throw the original error to be handled by the client
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
