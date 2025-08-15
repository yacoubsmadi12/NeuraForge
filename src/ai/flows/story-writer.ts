'use server';

import { ai } from '@/ai/genkit';
import { StoryWriterInputSchema, StoryWriterOutputSchema, type StoryWriterInput, type StoryWriterOutput } from './schemas/story-writer';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase-admin/auth'; // Corrected import

const checkAndIncrementUsage = async (serviceId: string) => {
  const user = await getAuth().currentUser; // Corrected usage
  if (!user) {
    throw new Error("User not authenticated.");
  }

  const subscriptionRef = doc(db, 'subscriptions', user.uid);
  const subscriptionSnap = await getDoc(subscriptionRef);

  if (!subscriptionSnap.exists()) {
    throw new Error("Subscription not found for this user.");
  }

  const subscriptionData = subscriptionSnap.data();
  const usageCount = subscriptionData.usage?.[serviceId] || 0;
  const limit = subscriptionData.limit;

  if (subscriptionData.plan !== 'Unlimited' && usageCount >= limit) {
    throw new Error("Insufficient credit. Please upgrade your plan.");
  }

  await updateDoc(subscriptionRef, {
    [`usage.${serviceId}`]: increment(1),
  });
};

export async function storyWriter(input: StoryWriterInput): Promise<StoryWriterOutput> {
  return storyWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyWriterPrompt',
  input: { schema: StoryWriterInputSchema },
  output: { schema: StoryWriterOutputSchema },
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
      const serviceId = "storyWriter";
      await checkAndIncrementUsage(serviceId);
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error writing story:', error);
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
