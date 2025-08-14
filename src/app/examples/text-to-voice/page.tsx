
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Voicemail, Volume2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const examples = [
  {
    text: "Hello, welcome to NeuraForge. The AI toolsmith of the web.",
    voice: "Standard Male",
  },
  {
    text: "This is an example of our text-to-voice technology, converting written text into natural-sounding speech.",
    voice: "Standard Female",
  },
  {
    text: "You can use this tool for a variety of applications, such as audiobooks, voiceovers, and accessibility tools.",
    voice: "Standard Male",
  },
  {
    text: "أهلاً بك في نيورافورج. نحن متحمسون لنرى ما ستبتكره.",
    voice: "Standard Female (Arabic)",
  },
];

export default function TextToVoiceExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#text-to-voice" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <Voicemail className="w-4 h-4" />
            <span>Text-to-Voice Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Hear the Difference</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Listen to samples of our AI-powered voice generation. Turn any text into high-quality audio.
        </p>
         <Link href={ctaLink} className="mt-6 inline-block">
            <Button size="lg">
                Try it Yourself <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {examples.map((example, index) => (
          <Card key={index} className="shadow-lg">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-lg text-foreground/90">{example.text}</p>
                <p className="text-sm text-muted-foreground mt-2">Voice: {example.voice}</p>
              </div>
               <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-full">
                  <Volume2 className="w-6 h-6 text-primary" />
                  <div className="w-32 h-1 bg-primary/30 rounded-full">
                     <div className="w-1/2 h-full bg-primary rounded-full"></div>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
