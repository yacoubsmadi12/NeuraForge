/**
 * @fileOverview Schemas and types for the story writer AI agent.
 *
 * - StoryWriterInputSchema - The Zod schema for the input.
 * - StoryWriterInput - The TypeScript type for the input.
 * - StoryWriterOutputSchema - The Zod schema for the output.
 * - StoryWriterOutput - The TypeScript type for the output.
 */

import {z} from 'zod';

export const StoryWriterInputSchema = z.object({
  topic: z.string().describe('The main topic or theme of the story.'),
  characters: z.string().optional().describe('A brief description of the main characters.'),
  plot: z.string().optional().describe('Key plot points or a brief outline of the story.'),
  pages: z.number().optional().describe('The desired number of pages for the story.'),
});
export type StoryWriterInput = z.infer<typeof StoryWriterInputSchema>;

export const StoryWriterOutputSchema = z.object({
  title: z.string().describe('The generated title for the story.'),
  story: z.string().describe('The generated story content.'),
});
export type StoryWriterOutput = z.infer<typeof StoryWriterOutputSchema>;
