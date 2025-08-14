
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PenTool } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const examples = [
  {
    prompt: "A minimalist, geometric logo for a tech company called 'Quantum'",
    imageUrl: "https://i.postimg.cc/SxQ9GNcB/1.jpg",
    aiHint: "tech logo"
  },
  {
    prompt: "A friendly, cute mascot logo for a coffee shop",
    imageUrl: "https://i.postimg.cc/TPpWZ77Q/2.jpg",
    aiHint: "mascot logo"
  },
  {
    prompt: "An elegant, classic logo for a luxury brand 'Aura'",
    imageUrl: "https://i.postimg.cc/JnXHhyWk/3.jpg",
    aiHint: "luxury logo"
  },
  {
    prompt: "A vibrant, playful logo for a children's toy store",
    imageUrl: "https://i.postimg.cc/nhdDSbkC/4.jpg",
    aiHint: "playful logo"
  },
  {
    prompt: "A modern logo for a streaming service",
    imageUrl: "https://i.postimg.cc/rp3tc17T/5.jpg",
    aiHint: "modern logo"
  },
  {
    prompt: "A bold emblem for a sports team",
    imageUrl: "https://i.postimg.cc/PJzLmBJf/6.jpg",
    aiHint: "sports emblem"
  },
  {
    prompt: "A nature-themed logo for an eco-friendly brand",
    imageUrl: "https://i.postimg.cc/Gt18TccS/7.jpg",
    aiHint: "nature logo"
  },
  {
    prompt: "A futuristic logo for a gaming company",
    imageUrl: "https://i.postimg.cc/bYQ2c2gX/8.jpg",
    aiHint: "gaming logo"
  },
];

export default function LogoGeneratorExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#logo-generator" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <PenTool className="w-4 h-4" />
            <span>Logo Generator Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Your Brand, Visualized</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          From a simple description, our AI can design a unique and memorable logo for your brand.
        </p>
         <Link href={ctaLink} className="mt-6 inline-block">
            <Button size="lg">
                Try it Yourself <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {examples.map((example, index) => (
          <div key={index} className="group flex flex-col items-center text-center gap-4">
            <div className="relative w-full aspect-square bg-card rounded-lg flex items-center justify-center overflow-hidden border shadow-lg">
                <Image
                  src={example.imageUrl}
                  alt={example.prompt}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={example.aiHint}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
