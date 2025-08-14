
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logoGenerator } from "@/ai/flows/logo-generator";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool, AlertTriangle, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import type { Subscription, ToolId } from "@/lib/subscription-constants";
import { incrementSubscriptionUsage } from "@/lib/subscription-service";

interface ToolProps {
  subscription: Subscription | null;
  refreshSubscription: () => void;
}

export function LogoGeneratorTool({ subscription, refreshSubscription }: ToolProps) {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const toolId: ToolId = "logo-generator";

  const canUseTool = () => {
    if (!subscription) return false;
    const usage = subscription.usage[toolId] || 0;
    return usage < subscription.limit;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !user) return;

    if (!canUseTool()) {
        router.push('/subscriptions');
        return;
    }

    setIsLoading(true);
    setImageUrl("");
    setError("");

    try {
      await incrementSubscriptionUsage(user.uid, toolId);
      refreshSubscription();
      const isPaidUser = subscription?.plan === 'Monthly' || subscription?.plan === 'Yearly';
      const result = await logoGenerator({ 
        prompt,
        userId: isPaidUser ? user?.uid : undefined
       });
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      } else {
        setError(t('dashboard.logoGenerator.error.general'));
      }
    } catch (err: any) {
      setError(err.message || t('dashboard.logoGenerator.error.general'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-logo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const showUpgradeAlert = !canUseTool();

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.logoGenerator.title')}</CardTitle>
        <CardDescription>{t('dashboard.logoGenerator.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {showUpgradeAlert && (
          <Alert variant="premium" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('dashboard.upgrade.title')}</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{t('dashboard.upgrade.description')}</span>
              <Button onClick={() => router.push('/subscriptions')} size="sm">{t('dashboard.upgrade.button')}</Button>
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('dashboard.logoGenerator.placeholder')}
            disabled={isLoading || showUpgradeAlert}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !prompt || showUpgradeAlert}>
            {isLoading ? t('dashboard.logoGenerator.button.loading') : t('dashboard.logoGenerator.button.default')}
            <PenTool className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="aspect-square w-full bg-card rounded-lg flex items-center justify-center overflow-hidden border relative group">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : imageUrl ? (
            <>
              <div className="relative w-full h-full">
                  <Image src={imageUrl} alt={prompt} layout="fill" objectFit="contain" />
              </div>
              <Button 
                onClick={handleDownload}
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-5 h-5" />
                <span className="sr-only">{t('dashboard.common.download')}</span>
              </Button>
            </>
          ) : (
            <div className="text-center text-muted-foreground p-4">
              <PenTool className="w-12 h-12 mx-auto mb-4" />
              <p>{t('dashboard.logoGenerator.initialState')}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardFooter>
    </Card>
  );
}

    
