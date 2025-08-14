/**
 * @fileOverview Schemas and types for the CV generation AI agent.
 *
 * - GenerateCvInputSchema - The Zod schema for the input.
 * - GenerateCvInput - The TypeScript type for the input.
 * - GenerateCvOutputSchema - The Zod schema for the output.
 * - GenerateCvOutput - The TypeScript type for the output.
 */

import {z} from 'zod';

const ExperienceSchema = z.object({
  role: z.string().describe('The job title or role.'),
  company: z.string().describe('The name of the company.'),
  dates: z.string().describe('The start and end dates of the employment.'),
  responsibilities: z
    .string()
    .describe('A description of the responsibilities and achievements in the role.'),
});

const EducationSchema = z.object({
  degree: z.string().describe('The degree or qualification obtained.'),
  institution: z.string().describe('The name of the educational institution.'),
  dates: z.string().describe('The start and end dates of the education.'),
});

const ReferenceSchema = z.object({
    name: z.string().describe("The reference's full name."),
    details: z.string().describe("The reference's contact details or relationship.")
});

export const GenerateCvInputSchema = z.object({
  name: z.string().min(1, 'Name is required').describe("The user's full name."),
  email: z.string().describe("The user's email address."),
  phone: z.string().min(1, 'Phone is required').describe("The user's phone number."),
  location: z.string().min(1, 'Location is required').describe("The user's city and country."),
  portfolioLink: z.string().optional().describe("A link to the user's portfolio or personal website."),
  photoDataUri: z.string().optional().describe("An optional data URI of the user's photo."),
  targetJobTitle: z.string().min(1, 'Target job title is required').describe("The specific job title the user is applying for."),
  experience: z.array(ExperienceSchema).describe("An array of the user's work experience."),
  education: z.array(EducationSchema).describe("An array of the user's educational background."),
  hobbies: z.string().optional().describe('A comma-separated list of hobbies.'),
  volunteering: z.string().optional().describe('A description of volunteer work.'),
  references: z.array(ReferenceSchema).optional().describe('A list of professional references.')
});

export type GenerateCvInput = z.infer<typeof GenerateCvInputSchema>;

const CategorizedSkillsSchema = z.object({
    category: z.string().describe('The name of the skill category (e.g., "Programming Languages", "Software").'),
    skills: z.array(z.string()).describe('A list of skills in this category.')
});

const ProcessedExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  dates: z.string(),
  achievements: z.array(z.string()).describe('A list of achievement-oriented bullet points.'),
});

export const GenerateCvOutputSchema = z.object({
  professionalSummary: z.string().describe('The generated professional summary.'),
  processedExperience: z.array(ProcessedExperienceSchema).describe('The processed and enhanced work experience.'),
  categorizedSkills: z.array(CategorizedSkillsSchema).describe('The skills categorized into relevant groups based on the target job title and experience.'),
});

export type GenerateCvOutput = z.infer<typeof GenerateCvOutputSchema>;
