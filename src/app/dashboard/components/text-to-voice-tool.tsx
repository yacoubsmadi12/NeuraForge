
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { textToSpeech } from "@/ai/flows/text-to-voice";
import { Loader2, Voicemail, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import { useRouter } from "next/navigation";
import type { Subscription, ToolId } from "@/lib/subscription-constants";
import { incrementSubscriptionUsage } from "@/lib/subscription-service";
import { useAuth } from "@/hooks/use-auth";

interface ToolProps {
  subscription: Subscription | null;
  refreshSubscription: () => void;
}

export function TextToVoiceTool({ subscription, refreshSubscription }: ToolProps) {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const toolId: ToolId = "text-to-voice";

  const canUseTool = () => {
    if (!subscription) return false;
    const usage = subscription.usage[toolId] || 0;
    return usage < subscription.limit;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !user) return;

    if (!canUseTool()) {
      router.push('/subscriptions');
      return;
    }

    setIsLoading(true);
    setAudioUrl("");
    setError("");

    try {
      await incrementSubscriptionUsage(user.uid, toolId);
      refreshSubscription();
      const result = await textToSpeech({ text });
      if (result.media) {
        setAudioUrl(result.media);
      } else {
        setError(t('dashboard.textToVoice.error.general'));
      }
    } catch (err) {
      setError(t('dashboard.textToVoice.error.general'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const showUpgradeAlert = !canUseTool();

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.textToVoice.title')}</CardTitle>
        <CardDescription>{t('dashboard.textToVoice.description')}</CardDescription>
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('dashboard.textToVoice.placeholder')}
            rows={6}
            disabled={isLoading || showUpgradeAlert}
          />
          <Button type="submit" disabled={isLoading || !text || showUpgradeAlert} className="self-start">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('dashboard.textToVoice.button.loading')}
              </>
            ) : (
              t('dashboard.textToVoice.button.default')
            )}
          </Button>
        </form>

        {audioUrl && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">{t('dashboard.textToVoice.generatedAudio')}</h3>
            <audio controls src={audioUrl} className="w-full">
              {t('dashboard.textToVoice.audioNotSupported')}
            </audio>
          </div>
        )}

        {!audioUrl && !isLoading && (
            <div className="mt-6 text-center text-muted-foreground p-8 bg-card rounded-lg border">
                <Voicemail className="w-12 h-12 mx-auto mb-4" />
                <p>{t('dashboard.textToVoice.initialState')}</p>
            </div>
        )}
      </CardContent>
       <CardFooter>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardFooter>
    </Card>
  );
}

    
