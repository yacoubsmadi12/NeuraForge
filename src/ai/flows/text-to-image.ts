
'use server';

/**
 * @fileOverview Generates an image from a text prompt.
 *
 * - textToImage - A function that handles the image generation process.
 * - TextToImageInput - The input type for the textToImage function.
 * - TextToImageOutput - The return type for the textToImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveGeneratedImage } from '@/lib/image-storage';

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
    try {
      const {media} = await ai.generate({
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

      if (media?.url && input.userId) {
        try {
          await saveGeneratedImage(input.userId, media.url, input.prompt);
        } catch (error) {
            // Log the error but don't prevent the image from being returned to the user.
            console.error("Failed to save image to gallery:", error);
        }
      }
      
      return {imageUrl: media?.url ?? null};
    } catch (error: any) {
      console.error('Error generating image:', error);
      // Re-throw the original error to be handled by the client
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
