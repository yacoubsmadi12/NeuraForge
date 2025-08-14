'use server';

/**
 * @fileOverview An AI agent for generating email content.
 *
 * - generateEmail - A function that handles the email generation process.
 * - GenerateEmailInput - The input type for the generateEmail function.
 * - GenerateEmailOutput - The return type for the generateEmail function.
 */

import {ai} from '@/ai/genkit';
import { GenerateEmailInputSchema, GenerateEmailOutputSchema, type GenerateEmailInput, type GenerateEmailOutput } from './schemas/generate-email';

export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
  return generateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailPrompt',
  input: {schema: GenerateEmailInputSchema},
  output: {schema: GenerateEmailOutputSchema},
  prompt: `You are an expert email writing assistant. Your task is to generate a professional and effective email based on the user's requirements.

Recipient: {{recipient}}
Topic: {{topic}}
Tone: {{tone}}
{{#if notes}}
Additional Notes: {{{notes}}}
{{/if}}

Generate a concise and appropriate subject line and a well-written email body. Ensure the email is tailored to the specified tone and includes all necessary points from the notes.
`,
});

const generateEmailFlow = ai.defineFlow(
  {
    name: 'generateEmailFlow',
    inputSchema: GenerateEmailInputSchema,
    outputSchema: GenerateEmailOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error generating email:', error);
      throw new Error('The AI service is currently unavailable. Please try again later.');
    }
  }
);
