'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
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
  input: { schema: GenerateDocumentInputSchema },
  output: { schema: GenerateDocumentOutputSchema },
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
      const serviceId = "generateDocument";
      await checkAndIncrementUsage(serviceId);
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error generating document:', error);
      throw new Error(
        error.message || 'The AI service is currently unavailable. Please try again later.'
      );
    }
  }
);
