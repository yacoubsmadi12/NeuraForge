'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-cv.ts';
import '@/ai/flows/voice-assistant.ts';
import '@/ai/flows/text-to-voice.ts';
import '@/ai/flows/text-to-image.ts';
import '@/ai/flows/edit-image.ts';
import '@/ai/flows/remove-watermark.ts';
import '@/ai/flows/generate-email.ts';
import '@/ai/flows/story-writer.ts';
import '@/ai/flows/logo-generator.ts';
import '@/ai/flows/generate-document.ts';
