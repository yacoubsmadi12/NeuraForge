
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, User, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function GenerateCvExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#generate-cv" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <FileText className="w-4 h-4" />
            <span>AI CV Generator Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Build a Standout CV, Faster</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI analyzes your experience and the job you want, then builds a professional CV tailored to get you noticed.
        </p>
         <Link href={ctaLink} className="mt-6 inline-block">
            <Button size="lg">
                Try it Yourself <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>

      <div className="relative max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-2xl border">
         <div className="absolute -inset-2 bg-gradient-to-r from-accent to-primary rounded-lg -z-10 opacity-20 blur-xl"></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background/50 p-6 rounded-lg">
                <h3 className="font-headline text-xl mb-4 text-center">You Provide the Details...</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1"><User className="w-5 h-5 text-primary"/></div>
                        <div>
                            <h4 className="font-semibold">Personal & Job Info</h4>
                            <p className="text-sm text-muted-foreground">Your name, contact details, and the job title you're targeting.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1"><Briefcase className="w-5 h-5 text-primary"/></div>
                        <div>
                            <h4 className="font-semibold">Work Experience</h4>
                            <p className="text-sm text-muted-foreground">Your roles, companies, and key responsibilities.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1"><GraduationCap className="w-5 h-5 text-primary"/></div>
                        <div>
                            <h4 className="font-semibold">Education</h4>
                            <p className="text-sm text-muted-foreground">Your degrees and academic institutions.</p>
                        </div>
                    </div>
                </div>
            </div>
             <div className="bg-background/50 p-6 rounded-lg">
                <h3 className="font-headline text-xl mb-4 text-center">...Our AI Does the Rest</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1"><Sparkles className="w-5 h-5 text-primary"/></div>
                        <div>
                            <h4 className="font-semibold">Crafted Professional Summary</h4>
                            <p className="text-sm text-muted-foreground">An impactful summary tailored to the target role.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1"><Sparkles className="w-5 h-5 text-primary"/></div>
                        <div>
                            <h4 className="font-semibold">Achievement-Oriented Bullet Points</h4>
                            <p className="text-sm text-muted-foreground">Rewrites your responsibilities to highlight your impact and value.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg mt-1"><Sparkles className="w-5 h-5 text-primary"/></div>
                        <div>
                            <h4 className="font-semibold">Relevant Skill Suggestions</h4>
                            <p className="text-sm text-muted-foreground">Analyzes your profile to generate a categorized list of key skills.</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
         <div className="text-center mt-8">
            <p className="text-muted-foreground">The result? A polished, professional CV ready to impress recruiters.</p>
         </div>
      </div>
    </div>
  );
}
