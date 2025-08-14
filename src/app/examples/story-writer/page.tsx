
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookMarked } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const examples = [
  {
    title: "The Last Signal",
    genre: "Sci-Fi Mystery",
    story: "On the crimson dust of Mars, grizzled android detective Jax discovered a signal emanating from a dormant volcano. It wasn't a distress call; it was a lullaby. Inside, he found not a monster, but a single, perfectly preserved flower, humming with an energy that defied all logic. The mystery of Mars wasn't about what was lost, but what was left behind.",
  },
  {
    title: "The Clockwork Heart",
    genre: "Steampunk Romance",
    story: "Inventor Alistair created a clockwork nightingale for the silent Duchess. Each tick of its brass gears was a word he couldn't speak. One evening, as the bird sang a melody of gears and springs, the Duchess smiled. 'It sounds like a heart,' she whispered. In that moment, Alistair realized he hadn't just built a machine; he'd composed a confession.",
  },
  {
    title: "The Baker of Whispering Woods",
    genre: "Cozy Fantasy",
    story: "Elara's bakery sat on the edge of the Whispering Woods. She baked bread with laughter and cakes with sunlight. The forest creatures, from grumpy badgers to mischievous pixies, were her only customers. They paid in dewdrops and river stones, not for the food, but for the taste of a world without shadows, a world she baked into every crumb.",
  },
  {
    title: "A Debt of Salt",
    genre: "Historical Fiction",
    story: "In ancient Rome, retired legionary Marcus owed a debt not of coin, but of salt, to the family of a fallen comrade. He traveled to their seaside villa, expecting suspicion. Instead, he found a family that had already forgiven him. His debt, they explained, was not to be paid back, but to be paid forward, by living a life worthy of the one that was lost.",
  },
];

export default function StoryWriterExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#story-writer" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <BookMarked className="w-4 h-4" />
            <span>Story Writer Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Weave Worlds with Words</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          From a simple prompt, our AI can spin captivating narratives. Explore the possibilities.
        </p>
         <Link href={ctaLink} className="mt-6 inline-block">
            <Button size="lg">
                Try it Yourself <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {examples.map((example, index) => (
          <Card key={index} className="shadow-lg flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-xl">{example.title}</CardTitle>
                <p className="text-sm text-muted-foreground">Genre: {example.genre}</p>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-muted-foreground whitespace-pre-wrap">{example.story}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
