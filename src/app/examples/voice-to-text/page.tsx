
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, ScanText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const examples = [
  {
    title: "Technical Support Call",
    transcription: "User: 'Hello, my internet isn't working.'\nSupport: 'Okay, have you tried restarting your router?'",
    audioHint: "A simulated audio clip of a technical support call.",
  },
  {
    title: "Business Meeting Snippet",
    transcription: "Okay team, for the next quarter, our primary focus will be on expanding into the European market. Sarah, can you give us the latest sales projections?",
    audioHint: "A simulated audio clip of a business meeting discussion.",
  },
  {
    title: "Simple Voice Memo",
    transcription: "Remind me to buy milk, eggs, and bread on the way home.",
    audioHint: "A simulated audio clip of a personal voice memo.",
  },
  {
    title: "مقطع باللغة العربية",
    transcription: "مرحباً، هذا اختبار لخدمة تحويل الصوت إلى نص باللغة العربية.",
    audioHint: "A simulated audio clip of someone speaking in Arabic.",
  },
];

export default function VoiceToTextExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#voice-assistant" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <ScanText className="w-4 h-4" />
            <span>Voice Assistant Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Precision in Every Word</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          See how our AI accurately transcribes spoken words from various audio sources into text.
        </p>
         <Link href={ctaLink} className="mt-6 inline-block">
            <Button size="lg">
                Try it Yourself <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example, index) => (
          <Card key={index} className="shadow-lg flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-headline text-lg">{example.title}</h3>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg flex-1">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{example.transcription}</p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
