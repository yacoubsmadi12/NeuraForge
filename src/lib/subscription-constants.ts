
export const ALL_TOOLS = [
  "text-to-image",
  "edit-image",
  "remove-watermark",
  "generate-email",
  "story-writer",
  "logo-generator",
  "text-to-voice",
  "voice-assistant",
  "generate-cv",
] as const;

export type ToolId = (typeof ALL_TOOLS)[number];

export const PLAN_LIMITS = {
    Free: 5,
    Monthly: 35,
    Yearly: Infinity
}

export interface Subscription {
  plan: 'Free' | 'Monthly' | 'Yearly';
  usage: { [key in ToolId]?: number };
  limit: number;
  renewalDate: number | null;
  status: 'active' | 'trialing' | 'incomplete' | 'past_due' | 'canceled' | string;
  priceId?: string;
  subscriptionMethod?: 'stripe' | 'paypal' | 'zain_cliq';
  lastReset?: number;
}
