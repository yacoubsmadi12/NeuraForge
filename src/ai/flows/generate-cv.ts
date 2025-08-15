'use server';

import { ai } from '@/ai/genkit';
import {
  GenerateCvInputSchema,
  GenerateCvOutputSchema,
  type GenerateCvInput,
  type GenerateCvOutput,
} from './schemas/generate-cv';
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

export async function generateCv(
  input: GenerateCvInput
): Promise<GenerateCvOutput> {
  return generateCvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCvPrompt',
  input: { schema: GenerateCvInputSchema },
  output: { schema: GenerateCvOutputSchema },
  prompt: `You are an expert CV writer and career coach. Your task is to generate a professional, well-structured CV based on the user's provided information. The user is targeting a specific job role, so tailor the content to be as relevant and impactful as possible for that role.

Target Job Title: {{targetJobTitle}}

Personal Information:
- Name: {{name}}
- Email: {{email}}
- Phone: {{phone}}
- Location: {{location}}
{{#if portfolioLink}}
- Portfolio/Website: {{portfolioLink}}
{{/if}}

Professional Summary:
Write a concise, impactful professional summary (2-3 sentences) based on the user's experience and skills. It MUST be tailored to the "{{targetJobTitle}}" role, highlighting their key achievements and how they align with the job's requirements.

Experience:
{{#each experience}}
- Role: {{this.role}}
  - Company: {{this.company}}
  - Dates: {{this.dates}}
  - Responsibilities: {{{this.responsibilities}}}
  - Based on these responsibilities, rewrite them into 3-4 impactful, achievement-oriented bullet points. Each bullet point should demonstrate value and be highly relevant to the "{{targetJobTitle}}" role. Start with strong action verbs.
{{/each}}

Education:
{{#each education}}
- Degree: {{this.degree}}
  - Institution: {{this.institution}}
  - Dates: {{this.dates}}
{{/each}}

Skills:
- Analyze the user's provided experience and the "{{targetJobTitle}}".
- Based on this analysis, generate a list of the most relevant technical and soft skills for the job.
- Categorize these generated skills into relevant groups (e.g., "Technical Skills", "Languages", "Soft Skills") that are most important for the target role.

Generate a complete, polished, and professional CV. The language must be clear, concise, and optimized for the target job title. Structure the output according to the defined JSON schema.
`,
});

const generateCvFlow = ai.defineFlow(
  {
    name: 'generateCvFlow',
    inputSchema: GenerateCvInputSchema,
    outputSchema: GenerateCvOutputSchema,
  },
  async (input) => {
    try {
      const serviceId = "generateCv";
      await checkAndIncrementUsage(serviceId);
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error generating CV:', error);
      throw new Error(error.message || 'The AI service is currently unavailable. Please try again later.');
    }
  }
);
