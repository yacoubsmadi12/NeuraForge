
'use server';

/**
 * @fileOverview Generates a logo from a text prompt.
 *
 * - logoGenerator - A function that handles the logo generation process.
 * - LogoGeneratorInput - The input type for the logoGenerator function.
 * - LogoGeneratorOutput - The return type for the logoGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveGeneratedImage } from '@/lib/image-storage';

const LogoGeneratorInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a logo from.'),
  userId: z.string().optional().describe("The user's ID to associate with the generated image."),
});
export type LogoGeneratorInput = z.infer<typeof LogoGeneratorInputSchema>;

const LogoGeneratorOutputSchema = z.object({
  imageUrl: z.string().nullable().describe('The data URI of the generated logo.'),
});
export type LogoGeneratorOutput = z.infer<typeof LogoGeneratorOutputSchema>;

export async function logoGenerator(input: LogoGeneratorInput): Promise<LogoGeneratorOutput> {
  return logoGeneratorFlow(input);
}

const logoGeneratorFlow = ai.defineFlow(
  {
    name: 'logoGeneratorFlow',
    inputSchema: LogoGeneratorInputSchema,
    outputSchema: LogoGeneratorOutputSchema,
  },
  async (input) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A modern, minimalist logo for a company with the theme: "${input.prompt}". The logo should be simple, clean, suitable for a brand, and on a solid background.`,
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
      console.error('Error generating logo:', error.message);
      // Re-throw a more informative error to be handled by the client
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
