
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ImagePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const examples = [
  {
    prompt: "Give him a funny hat.",
    beforeUrl: "https://i.postimg.cc/9QgXTWmF/before-6.jpg",
    afterUrl: "https://i.postimg.cc/nc0nbHQY/after6.png",
    aiHintBefore: "man portrait",
    aiHintAfter: "man funny hat"
  },
  {
    prompt: "Turn the cat into a tiger.",
    beforeUrl: "https://i.postimg.cc/4335L1RQ/befor.jpg",
    afterUrl: "https://i.postimg.cc/kXdy3Cd4/after-6.png",
    aiHintBefore: "house cat",
    aiHintAfter: "tiger"
  },
  {
    prompt: "Make it a cyberpunk-style image.",
    beforeUrl: "https://i.postimg.cc/W4PV0hRV/befor-8.jpg",
    afterUrl: "https://i.postimg.cc/qR1dfwNB/after-9.png",
    aiHintBefore: "city street",
    aiHintAfter: "cyberpunk city"
  },
  {
    prompt: "Change the season to winter.",
    beforeUrl: "https://i.postimg.cc/XJYYypFJ/befor-11.jpg",
    afterUrl: "https://i.postimg.cc/Dw70KjZL/after-11.png",
    aiHintBefore: "forest summer",
    aiHintAfter: "forest winter"
  },
];

export default function EditImageExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#edit-image" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <ImagePlay className="w-4 h-4" />
            <span>Image Editing Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Transform Your Images</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Describe any change, and watch our AI bring it to life. From simple tweaks to complete transformations.
        </p>
         <Link href={ctaLink} className="mt-6 inline-block">
            <Button size="lg">
                Try it Yourself <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {examples.map((example, index) => (
          <div key={index} className="bg-card p-4 rounded-lg shadow-lg">
            <p className="text-center font-medium mb-4 pb-2 border-b">
                &ldquo;{example.prompt}&rdquo;
            </p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="text-center">
                 <Image
                    src={example.beforeUrl}
                    alt="Before editing"
                    width={512}
                    height={512}
                    className="w-full h-auto object-cover rounded-md"
                    data-ai-hint={example.aiHintBefore}
                />
                <p className="text-sm text-muted-foreground mt-2">Before</p>
              </div>
              <ArrowRight className="w-6 h-6 text-primary" />
              <div className="text-center">
                 <Image
                    src={example.afterUrl}
                    alt={example.prompt}
                    width={512}
                    height={512}
                    className="w-full h-auto object-cover rounded-md"
                    data-ai-hint={example.aiHintAfter}
                />
                 <p className="text-sm text-muted-foreground mt-2">After</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
