
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, ScanText, Voicemail, Wand2, ImagePlay, Eraser, Mail, BookMarked, PenTool, FileText, Languages, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon } from "@/components/icons/check-circle";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const { t } = useLanguage();

  const tools = [
    {
      title: t('home.tools.textToImage.title'),
      description: t('home.tools.textToImage.description'),
      icon: <Wand2 className="w-8 h-8 text-primary" />,
      href: "/examples/text-to-image",
      pro: true,
    },
    {
      title: t('home.tools.aiImageEditor.title'),
      description: t('home.tools.aiImageEditor.description'),
      icon: <ImagePlay className="w-8 h-8 text-primary" />,
      href: "/examples/edit-image",
    },
    {
      title: t('home.tools.watermarkRemover.title'),
      description: t('home.tools.watermarkRemover.description'),
      icon: <Eraser className="w-8 h-8 text-primary" />,
      href: "/examples/remove-watermark",
    },
    {
      title: t('home.tools.aiEmailWriter.title'),
      description: t('home.tools.aiEmailWriter.description'),
      icon: <Mail className="w-8 h-8 text-primary" />,
      href: "/examples/generate-email",
    },
     {
      title: t('home.tools.storyWriter.title'),
      description: t('home.tools.storyWriter.description'),
      icon: <BookMarked className="w-8 h-8 text-primary" />,
      href: "/examples/story-writer",
    },
    {
      title: t('home.tools.logoGenerator.title'),
      description: t('home.tools.logoGenerator.description'),
      icon: <PenTool className="w-8 h-8 text-primary" />,
      href: "/examples/logo-generator",
    },
    {
      title: t('home.tools.generateCv.title'),
      description: t('home.tools.generateCv.description'),
      icon: <FileText className="w-8 h-8 text-primary" />,
      href: "/examples/generate-cv",
    },
    {
      title: t('home.tools.textToVoice.title'),
      description: t('home.tools.textToVoice.description'),
      icon: <Voicemail className="w-8 h-8 text-primary" />,
      href: "/examples/text-to-voice",
    },
    {
      title: t('home.tools.voiceAssistant.title'),
      description: t('home.tools.voiceAssistant.description'),
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      href: "/examples/voice-to-text",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <section className="relative py-20 md:py-32 text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full animate-fade-in-up">
              <BrainCircuit className="w-4 h-4" />
              <span>{t('home.hero.badge')}</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 animate-fade-in-up bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">
              NeuraForge AI Toolkit
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-300">
               "Unleash your creativity with the latest AI toolkit. From instant image generation to high-accuracy audio transcription – everything you need to bring your ideas to life with speed and professionalism."
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-500">
              <Link href="/dashboard#text-to-image">
                <Button size="lg" className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                  <span>{t('home.hero.cta')}</span>
                  <ArrowRight className="w-5 h-5 ms-2" />
                </Button>
              </Link>
               <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="hover:bg-accent/20 hover:text-foreground transition-colors duration-300">
                     <PlayCircle className="w-5 h-5 me-2" />
                      Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0">
                   <DialogTitle className="sr-only">NeuraForge Demo Video</DialogTitle>
                    <div className="aspect-video">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/nss8rdiHqXc" 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                        </iframe>
                    </div>
                </DialogContent>
               </Dialog>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-blue-400 text-transparent bg-clip-text">{t('home.explore.title')}</h2>
            <p className="text-muted-foreground mb-12">
              {t('home.explore.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.title}>
                <Card className="h-full bg-card/50 hover:bg-card/90 border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                      {tool.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-square max-w-md mx-auto">
                <Image src="https://i.postimg.cc/QdH2fxwq/generated-image-1.png" alt="AI Generated Art" width={600} height={600} className="rounded-lg shadow-2xl object-cover" />
                <div className="absolute -inset-2 bg-gradient-to-r from-accent to-primary rounded-lg -z-10 opacity-50 blur-xl"></div>
            </div>
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">{t('home.innovators.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('home.innovators.subtitle')}
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-primary" />
                  <span>{t('home.innovators.feature1')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-primary" />
                  <span>{t('home.innovators.feature2')}</span>
                </li>
                 <li className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-primary" />
                  <span>{t('home.innovators.feature3')}</span>
                </li>
              </ul>
              <Link href="/signup" className="mt-8 inline-block">
                <Button variant="outline">{t('home.innovators.cta')} <ArrowRight className="w-4 h-4 ms-2" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

    
