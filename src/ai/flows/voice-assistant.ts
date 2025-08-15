'use server';

/**
 * @fileOverview Implements an AI voice assistant that understands user commands.
 *
 * - voiceAssistant - Understands voice commands for various tasks.
 * - VoiceAssistantInput - Input type for the voiceAssistant function.
 * - VoiceAssistantOutput - Output type for the voiceAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceAssistantInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
    ),
  languageCode: z.enum(['en', 'ar']).describe('The language of the audio.'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

const VoiceAssistantOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
  action: z.object({
    name: z.enum(['generateEmail', 'writeStory', 'generateDocument', 'none']).describe('The identified user action.'),
    data: z.any().describe('The data extracted for the action.')
  }).describe('The action identified from the user command and its associated data.')
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

export async function voiceAssistant(input: VoiceAssistantInput): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}

const voiceAssistantPrompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: {schema: VoiceAssistantInputSchema},
  output: {schema: VoiceAssistantOutputSchema},
  prompt: `You are a voice assistant that understands user commands from transcribed audio.
Your task is to analyze the transcribed text and determine the user's intent and extract relevant information.

The user is speaking in {{languageCode}}.

Here are the possible actions:
- "generateEmail": Triggered when the user wants to write an email. You must extract the 'recipient' and 'topic'.
- "writeStory": Triggered when the user wants to write a story. You must extract the 'topic' of the story.
- "generateDocument": Triggered when the user wants to write a document, an article, a letter, or a similar piece of text. You must extract the 'topic' of the document.
- "none": If the command does not match any of the above actions, or if it's just a simple transcription request.

Analyze the following audio transcription and determine the action and its data.

Audio Transcription:
{{media url=audioDataUri}}`,
});

const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async input => {
    try {
      const {output} = await voiceAssistantPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error with voice assistant:', error);
      throw new Error('The AI service is currently unavailable. Please try again later.');
    }
  },
  {
    config: {
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
    }
  }
);
