'use server';

/**
 * @fileOverview Edits an image based on a text prompt.
 *
 * - editImage - A function that handles the image editing process.
 * - EditImageInput - The input type for the editImage function.
 * - EditImageOutput - The return type for the editImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EditImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt describing the desired edits.'),
  photoDataUri: z
    .string()
    .describe(
      "The source image to edit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
    ),
});
export type EditImageInput = z.infer<typeof EditImageInputSchema>;

const EditImageOutputSchema = z.object({
  imageUrl: z.string().nullable().describe('The data URI of the edited image.'),
});
export type EditImageOutput = z.infer<typeof EditImageOutputSchema>;

export async function editImage(input: EditImageInput): Promise<EditImageOutput> {
  return editImageFlow(input);
}

const editImageFlow = ai.defineFlow(
  {
    name: 'editImageFlow',
    inputSchema: EditImageInputSchema,
    outputSchema: EditImageOutputSchema,
  },
  async (input) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: input.prompt},
        ],
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

      return {imageUrl: media?.url ?? null};
    } catch (error: any) {
      console.error('Error editing image:', error);
      // Re-throw the original error to be handled by the client
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
