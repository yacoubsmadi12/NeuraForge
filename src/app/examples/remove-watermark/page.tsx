
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Eraser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const examples = [
  {
    description: "Remove the text overlay from the image.",
    beforeUrl: "https://i.postimg.cc/BbtJCZ5S/befor2.png",
    afterUrl: "https://i.postimg.cc/Qx2jp3FD/after4.jpg",
    aiHintBefore: "text on image",
    aiHintAfter: "image"
  },
  {
    description: "Remove the fence from the landscape.",
    beforeUrl: "https://i.postimg.cc/cHHhxPMg/before-5.png",
    afterUrl: "https://i.postimg.cc/qvxWzVnj/after5.jpg",
    aiHintBefore: "landscape fence",
    aiHintAfter: "landscape"
  },
  {
    description: "Erase the extra boats from the water.",
    beforeUrl: "https://i.postimg.cc/Ss1hj0Bw/befor.png",
    afterUrl: "https://i.postimg.cc/VsS6M4Kj/after2.jpg",
    aiHintBefore: "boats lake",
    aiHintAfter: "boat lake"
  },
  {
    description: "Remove the cone from the street.",
    beforeUrl: "https://i.postimg.cc/wMJgrfrZ/edited-image.png",
    afterUrl: "https://i.postimg.cc/wj9gWkQ4/after3.jpg",
    aiHintBefore: "street traffic cone",
    aiHintAfter: "street"
  },
];

export default function RemoveWatermarkExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#remove-watermark" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <Eraser className="w-4 h-4" />
            <span>AI Image Cleaner Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Pristine Images, Instantly</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI intelligently erases any unwanted objects or distractions, leaving you with a clean image.
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
                {example.description}
            </p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="text-center">
                 <Image
                    src={example.beforeUrl}
                    alt="Before object removal"
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
                    alt={example.description}
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
