
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TextToImageTool } from "./components/text-to-image-tool";
import { TextToVoiceTool } from "./components/text-to-voice-tool";
import { VoiceAssistantTool } from "./components/voice-to-text-tool";
import { EditImageTool } from './components/edit-image-tool';
import { RemoveWatermarkTool } from './components/remove-watermark-tool';
import { GenerateEmailTool } from './components/generate-email-tool';
import { StoryWriterTool } from './components/story-writer-tool';
import { LogoGeneratorTool } from './components/logo-generator-tool';
import { GenerateCvTool } from './components/generate-cv-tool';
import GalleryPage from './gallery/page';
import { Voicemail, Wand2, ImagePlay, Eraser, Mail, Loader2, BookMarked, PenTool, BrainCircuit, FileText, GalleryHorizontal } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { useLanguage } from '@/context/language-context';
import WelcomeDialog from './components/welcome-dialog';
import { getSubscription } from '@/lib/subscription-service';
import type { Subscription } from '@/lib/subscription-constants';

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const { t } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubLoading(false);
      return;
    }
    setSubLoading(true);
    try {
      const subData = await getSubscription(user.uid);
      setSubscription(subData);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setSubLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else {
      fetchSubscription();
    }
  }, [user, authLoading, router, fetchSubscription]);
  
   useEffect(() => {
    if (searchParams.get('new_user') === 'true') {
      setShowWelcome(true);
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);

  const baseTools = [
    { id: "text-to-image", name: t('home.tools.textToImage.title'), icon: <Wand2 />, component: <TextToImageTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "edit-image", name: t('home.tools.aiImageEditor.title'), icon: <ImagePlay />, component: <EditImageTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "remove-watermark", name: t('home.tools.watermarkRemover.title'), icon: <Eraser />, component: <RemoveWatermarkTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "generate-email", name: t('home.tools.aiEmailWriter.title'), icon: <Mail />, component: <GenerateEmailTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "story-writer", name: t('home.tools.storyWriter.title'), icon: <BookMarked />, component: <StoryWriterTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "logo-generator", name: t('home.tools.logoGenerator.title'), icon: <PenTool />, component: <LogoGeneratorTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "generate-cv", name: t('home.tools.generateCv.title'), icon: <FileText />, component: <GenerateCvTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "text-to-voice", name: t('home.tools.textToVoice.title'), icon: <Voicemail />, component: <TextToVoiceTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
    { id: "voice-assistant", name: t('home.tools.voiceAssistant.title'), icon: <BrainCircuit />, component: <VoiceAssistantTool subscription={subscription} refreshSubscription={fetchSubscription}/> },
  ];

  const galleryTool = { id: "gallery", name: t('dashboard.gallery.title'), icon: <GalleryHorizontal />, component: <GalleryPage /> };

  const availableTools = (subscription?.plan === 'Monthly' || subscription?.plan === 'Yearly')
    ? [...baseTools, galleryTool]
    : baseTools;

  const validTabs = availableTools.map(t => t.id);
  const [activeToolId, setActiveToolId] = useState(validTabs[0]);


  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (pathname === '/dashboard/gallery' && validTabs.includes('gallery')) {
      setActiveToolId('gallery');
    } else if (hash && validTabs.includes(hash)) {
      setActiveToolId(hash);
    } else if (validTabs.length > 0) {
      setActiveToolId(validTabs[0]);
    }
  }, [pathname, validTabs]);
  
  const handleToolSelect = (id: string) => {
    setActiveToolId(id);
    const newPath = id === 'gallery' ? '/dashboard/gallery' : `/dashboard#${id}`;
    history.pushState(null, '', newPath);
  };
  
  const activeTool = availableTools.find(tool => tool.id === activeToolId);
  const loading = authLoading || subLoading;

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <WelcomeDialog open={showWelcome} onOpenChange={setShowWelcome} />
      <Sidebar collapsible="icon">
        <SidebarMenu>
          {availableTools.map((tool) => (
            <SidebarMenuItem key={tool.id}>
              <SidebarMenuButton 
                onClick={() => handleToolSelect(tool.id)}
                isActive={activeToolId === tool.id}
                tooltip={tool.name}
              >
                {tool.icon}
                <span>{tool.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
                <SidebarTrigger className="md:hidden" />
                <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tighter">
                    {activeTool?.name || 'AI Dashboard'}
                </h1>
            </div>
            {activeTool ? activeTool.component : <TextToImageTool subscription={subscription} refreshSubscription={fetchSubscription}/>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardPageWithProvider() {
  return (
    <AuthProvider>
      <div className="flex-1">
        <DashboardContent />
      </div>
    </AuthProvider>
  )
}
