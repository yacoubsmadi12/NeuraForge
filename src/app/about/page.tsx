
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Rocket, Zap, Wand2, ImagePlay, Eraser, Mail, BookMarked, PenTool, FileText, Voicemail, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";

export default function AboutPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard#text-to-image" : "/signup";

  const tools = [
    {
      title: t('about.tools.textToImage.title'),
      description: t('about.tools.textToImage.description'),
      icon: <Wand2 className="w-6 h-6 text-primary" />,
      href: "/examples/text-to-image"
    },
    {
      title: t('about.tools.aiImageEditor.title'),
      description: t('about.tools.aiImageEditor.description'),
      icon: <ImagePlay className="w-6 h-6 text-primary" />,
      href: "/examples/edit-image"
    },
    {
      title: t('about.tools.watermarkRemover.title'),
      description: t('about.tools.watermarkRemover.description'),
      icon: <Eraser className="w-6 h-6 text-primary" />,
      href: "/examples/remove-watermark"
    },
    {
      title: t('about.tools.aiEmailWriter.title'),
      description: t('about.tools.aiEmailWriter.description'),
      icon: <Mail className="w-6 h-6 text-primary" />,
      href: "/examples/generate-email"
    },
    {
      title: t('about.tools.storyWriter.title'),
      description: t('about.tools.storyWriter.description'),
      icon: <BookMarked className="w-6 h-6 text-primary" />,
      href: "/examples/story-writer"
    },
     {
      title: t('about.tools.logoGenerator.title'),
      description: t('about.tools.logoGenerator.description'),
      icon: <PenTool className="w-6 h-6 text-primary" />,
      href: "/examples/logo-generator"
    },
    {
      title: t('about.tools.generateCv.title'),
      description: t('about.tools.generateCv.description'),
      icon: <FileText className="w-6 h-6 text-primary" />,
      href: "/examples/generate-cv"
    },
    {
      title: t('about.tools.textToVoice.title'),
      description: t('about.tools.textToVoice.description'),
      icon: <Voicemail className="w-6 h-6 text-primary" />,
      href: "/examples/text-to-voice"
    },
    {
      title: t('about.tools.voiceAssistant.title'),
      description: t('about.tools.voiceAssistant.description'),
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      href: "/examples/voice-to-text"
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-center bg-card/30">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] -z-10"></div>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">{t('about.hero.title')}</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('about.vision.title')}</h2>
                    <p className="mt-4 text-muted-foreground">
                        {t('about.vision.text')}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Tools Showcase Section */}
      <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('about.tools.title')}</h2>
                <p className="text-muted-foreground mb-12">
                {t('about.tools.subtitle')}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tools.map((tool) => (
                    <Link href={tool.href} key={tool.title} className="flex items-start gap-4 p-4 rounded-lg hover:bg-card">
                        <div className="p-3 bg-primary/10 rounded-lg w-fit">
                            {tool.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{tool.title}</h3>
                            <p className="text-muted-foreground mt-1">{tool.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
          </div>
      </section>
      
      {/* Core Principles Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('about.principles.title')}</h2>
                <p className="text-muted-foreground mb-12">
                    {t('about.principles.subtitle')}
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                <Card className="bg-card/30">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-3"><Rocket className="w-8 h-8 text-primary"/></div>
                        <CardTitle className="font-headline text-xl">{t('about.principles.innovation.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        {t('about.principles.innovation.text')}
                    </CardContent>
                </Card>
                <Card className="bg-card/30">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-3"><BrainCircuit className="w-8 h-8 text-primary"/></div>
                        <CardTitle className="font-headline text-xl">{t('about.principles.accessibility.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        {t('about.principles.accessibility.text')}
                    </CardContent>
                </Card>
                <Card className="bg-card/30">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-3"><Zap className="w-8 h-8 text-primary"/></div>
                        <CardTitle className="font-headline text-xl">{t('about.principles.performance.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        {t('about.principles.performance.text')}
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{t('about.cta.title')}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t('about.cta.subtitle')}
            </p>
            <Link href={ctaLink}>
                <Button size="lg">
                    {t('about.cta.button')} <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
            </Link>
        </div>
      </section>
    </div>
  );
}
