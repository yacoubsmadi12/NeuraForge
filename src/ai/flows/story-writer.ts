'use server';

/**
 * @fileOverview An AI agent for writing stories.
 *
 * - storyWriter - A function that handles the story writing process.
 * - StoryWriterInput - The input type for the storyWriter function.
 * - StoryWriterOutput - The return type for the storyWriter function.
 */

import {ai} from '@/ai/genkit';
import { StoryWriterInputSchema, StoryWriterOutputSchema, type StoryWriterInput, type StoryWriterOutput } from './schemas/story-writer';

export async function storyWriter(input: StoryWriterInput): Promise<StoryWriterOutput> {
  return storyWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyWriterPrompt',
  input: {schema: StoryWriterInputSchema},
  output: {schema: StoryWriterOutputSchema},
  prompt: `You are a world-class fiction writer. Your task is to write a compelling short story based on the user's requirements.

Topic/Theme: {{topic}}
{{#if characters}}
Characters: {{{characters}}}
{{/if}}
{{#if plot}}
Plot Outline: {{{plot}}}
{{/if}}
{{#if pages}}
Desired Length: Approximately {{pages}} page(s).
{{/if}}

Generate a suitable title and a well-written, engaging story. The story should be coherent, creative, and follow the provided guidelines.
`,
});

const storyWriterFlow = ai.defineFlow(
  {
    name: 'storyWriterFlow',
    inputSchema: StoryWriterInputSchema,
    outputSchema: StoryWriterOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error writing story:', error);
      throw new Error('The AI service is currently unavailable. Please try again later.');
    }
  }
);
