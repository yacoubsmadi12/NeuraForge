'use server';

/**
 * @fileOverview An AI agent for generating documents like letters or articles.
 *
 * - generateDocument - A function that handles the document generation process.
 * - GenerateDocumentInput - The input type for the generateDocument function.
 * - GenerateDocumentOutput - The return type for the generateDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateDocumentInputSchema = z.object({
  topic: z.string().describe('The main topic or purpose of the document.'),
});
export type GenerateDocumentInput = z.infer<typeof GenerateDocumentInputSchema>;

const GenerateDocumentOutputSchema = z.object({
  content: z.string().describe('The generated content of the document.'),
});
export type GenerateDocumentOutput = z.infer<typeof GenerateDocumentOutputSchema>;

export async function generateDocument(
  input: GenerateDocumentInput
): Promise<GenerateDocumentOutput> {
  return generateDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentPrompt',
  input: {schema: GenerateDocumentInputSchema},
  output: {schema: GenerateDocumentOutputSchema},
  prompt: `You are an expert content writing assistant. Your task is to generate a professional and well-structured document based on the user's topic.

Topic: {{topic}}

Generate a well-written document based on the provided topic. It could be a formal letter, an article, a report, or any other type of document. Ensure the language is clear, concise, and appropriate for the topic.`,
});

const generateDocumentFlow = ai.defineFlow(
  {
    name: 'generateDocumentFlow',
    inputSchema: GenerateDocumentInputSchema,
    outputSchema: GenerateDocumentOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error generating document:', error);
      throw new Error(
        'The AI service is currently unavailable. Please try again later.'
      );
    }
  }
);
