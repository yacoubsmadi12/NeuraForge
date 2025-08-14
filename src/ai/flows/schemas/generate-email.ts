/**
 * @fileOverview Schemas and types for the email generation AI agent.
 *
 * - GenerateEmailInputSchema - The Zod schema for the input.
 * - GenerateEmailInput - The TypeScript type for the input.
 * - GenerateEmailOutputSchema - The Zod schema for the output.
 * - GenerateEmailOutput - The TypeScript type for the output.
 */

import {z} from 'zod';

export const GenerateEmailInputSchema = z.object({
  recipient: z.string().describe('The name or email of the recipient.'),
  topic: z.string().describe('The main topic or purpose of the email.'),
  tone: z.enum(['Formal', 'Casual', 'Persuasive', 'Friendly']).describe('The desired tone of the email.'),
  notes: z.string().optional().describe('Any additional notes or key points to include.'),
});
export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

export const GenerateEmailOutputSchema = z.object({
  subject: z.string().describe('The generated subject line for the email.'),
  body: z.string().describe('The generated body content of the email.'),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;
