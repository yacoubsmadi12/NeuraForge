
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const examples = [
  {
    title: "Follow-up After a Meeting",
    subject: "Following Up on Our Conversation",
    body: "Hi [Name],\n\nIt was great speaking with you earlier today. I wanted to quickly follow up on our discussion about [Topic]. I've attached the document we talked about for your review.\n\nLooking forward to our next steps.\n\nBest,\n[Your Name]",
    tone: "Formal",
  },
  {
    title: "Job Application",
    subject: "Application for [Position Name] Position",
    body: "Dear [Hiring Manager Name],\n\nI am writing to express my keen interest in the [Position Name] position I saw advertised on [Platform]. With my [#] years of experience in [Field], I am confident I possess the skills and qualifications necessary to excel in this role.\n\nMy resume is attached for your consideration. Thank you for your time, and I look forward to hearing from you soon.\n\nSincerely,\n[Your Name]",
    tone: "Formal",
  },
  {
    title: "Casual Catch-up",
    subject: "Catching up!",
    body: "Hey [Name],\n\nHow have you been? It feels like it's been a while! I was just thinking about our trip to [Place] and thought I'd reach out.\n\nLet's grab coffee sometime next week if you're free.\n\nCheers,\n[Your Name]",
    tone: "Casual",
  },
  {
    title: "Persuasive Sales Email",
    subject: "A Better Way to [Solve a Problem]",
    body: "Hi [Prospect Name],\n\nAre you tired of [Common Pain Point]? Our [Product/Service] helps companies like yours achieve [Key Benefit] by [How it Works].\n\nWould you be open to a quick 15-minute call next week to explore how we can help you?\n\nBest regards,\n[Your Name]",
    tone: "Persuasive",
  },
];

export default function GenerateEmailExamplesPage() {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#generate-email" : "/signup";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <Mail className="w-4 h-4" />
            <span>AI Email Writer Showcase</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">Craft Perfect Emails, Effortlessly</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          From formal applications to friendly catch-ups, our AI generates the perfect email for any situation.
        </p>
         <Link href={ctaLink} className="mt-6 inline-block">
            <Button size="lg">
                Try it Yourself <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {examples.map((example, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl">{example.title}</CardTitle>
                <p className="text-sm text-muted-foreground">Tone: {example.tone}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm">Subject:</h4>
                        <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md mt-1">{example.subject}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm">Body:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap p-2 bg-muted/50 rounded-md mt-1">{example.body}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
