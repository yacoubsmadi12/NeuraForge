
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { removeWatermark } from "@/ai/flows/remove-watermark";
import { UploadCloud, Eraser, Image as ImageIcon, AlertTriangle, Download } from "lucide-react";
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

export function RemoveWatermarkTool({ subscription, refreshSubscription }: ToolProps) {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const toolId: ToolId = "remove-watermark";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceImage(e.target?.result as string);
        setProcessedImage(null);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: isLoading,
  });

  const canUseTool = () => {
    if (!subscription) return false;
    const usage = subscription.usage[toolId] || 0;
    return usage < subscription.limit;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceImage || !user) return;

    if (!canUseTool()) {
      router.push('/subscriptions');
      return;
    }

    setIsLoading(true);
    setProcessedImage(null);
    setError("");

    try {
      await incrementSubscriptionUsage(user.uid, toolId);
      refreshSubscription();
      const result = await removeWatermark({ photoDataUri: sourceImage });
      if (result.imageUrl) {
        setProcessedImage(result.imageUrl);
      } else {
        setError(t('dashboard.removeWatermark.error.general'));
      }
    } catch (err: any) {
      setError(err.message || t('dashboard.removeWatermark.error.general'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const showUpgradeAlert = !canUseTool();

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.removeWatermark.title')}</CardTitle>
        <CardDescription>{t('dashboard.removeWatermark.description')}</CardDescription>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-2">
             <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.removeWatermark.originalImage')}</h3>
            <div
              {...getRootProps()}
              className={`aspect-square w-full rounded-lg border-2 border-dashed flex items-center justify-center text-center p-4 transition-colors ${
                isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              } ${sourceImage ? "" : "cursor-pointer"} ${showUpgradeAlert || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} disabled={showUpgradeAlert || isLoading} />
              {sourceImage ? (
                <div className="relative w-full h-full">
                  <Image src={sourceImage} alt="Source" layout="fill" objectFit="contain" className="rounded-md"/>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="w-12 h-12" />
                  <p>{t('dashboard.removeWatermark.dropzone')}</p>
                </div>
              )}
            </div>
             {sourceImage && <Button variant="outline" size="sm" onClick={() => { setSourceImage(null); setProcessedImage(null); setError(""); }} disabled={isLoading}>{t('dashboard.removeWatermark.removeButton')}</Button>}
          </div>

          <div className="flex flex-col gap-2">
             <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.removeWatermark.processedImage')}</h3>
            <div className="aspect-square w-full bg-card rounded-lg flex items-center justify-center overflow-hidden border relative group">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : processedImage ? (
                <>
                  <div className="relative w-full h-full">
                    <Image src={processedImage} alt="Processed Image" layout="fill" objectFit="contain" />
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
                  <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                  <p>{t('dashboard.removeWatermark.initialState')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <Button type="submit" disabled={isLoading || !sourceImage || showUpgradeAlert} className="w-full md:w-auto">
            {isLoading ? t('dashboard.removeWatermark.button.loading') : t('dashboard.removeWatermark.button.default')}
            <Eraser className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </CardContent>
       <CardFooter>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardFooter>
    </Card>
  );
}

    
