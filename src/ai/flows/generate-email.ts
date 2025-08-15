'use server';

import { ai } from '@/ai/genkit';
import { GenerateEmailInputSchema, GenerateEmailOutputSchema, type GenerateEmailInput, type GenerateEmailOutput } from './schemas/generate-email';
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

export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
  return generateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailPrompt',
  input: { schema: GenerateEmailInputSchema },
  output: { schema: GenerateEmailOutputSchema },
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
      const serviceId = "generateEmail";
      await checkAndIncrementUsage(serviceId);
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error generating email:', error);
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
