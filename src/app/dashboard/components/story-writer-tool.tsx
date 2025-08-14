
"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storyWriter, type StoryWriterOutput } from "@/ai/flows/story-writer";
import { StoryWriterInputSchema } from "@/ai/flows/schemas/story-writer";
import { Loader2, BookMarked, AlertTriangle, Download, Copy, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import type { Subscription, ToolId } from "@/lib/subscription-constants";
import { incrementSubscriptionUsage } from "@/lib/subscription-service";
import { useAuth } from "@/hooks/use-auth";

interface ToolProps {
  subscription: Subscription | null;
  refreshSubscription: () => void;
}

const StoryFormSchema = StoryWriterInputSchema.extend({
    pages: z.string().optional(),
})
type StoryWriterInput = z.infer<typeof StoryFormSchema>;


function StoryResult({ storyData }: { storyData: StoryWriterOutput }) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const storyContentRef = useRef<HTMLDivElement>(null);
    const [isCopying, setIsCopying] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const handleCopy = () => {
        const storyText = storyContentRef.current?.innerText;
        if (storyText) {
            setIsCopying(true);
            navigator.clipboard.writeText(storyText);
            toast({
                title: t('dashboard.storyWriter.toast.copied'),
            });
            setTimeout(() => setIsCopying(false), 2000);
        }
    };
    
    const handleDownload = async () => {
        const element = storyContentRef.current;
        if (!element) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(element, { 
                scale: 2,
                backgroundColor: null,
                useCORS: true 
            });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft >= 0) {
              position = heightLeft - pdfHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
              heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save(`${storyData.title}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({
                variant: "destructive",
                title: t('dashboard.storyWriter.toast.pdfErrorTitle'),
                description: t('dashboard.storyWriter.toast.pdfErrorDescription'),
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-end gap-2 mb-4">
                 <Button onClick={handleCopy} variant="outline" size="sm" disabled={isCopying}>
                    {isCopying ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {t('dashboard.common.copy')}
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm" disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    {t('dashboard.common.downloadPdf')}
                </Button>
            </div>
            <div className="bg-card text-card-foreground rounded-lg border min-h-[300px]">
                <div ref={storyContentRef} className="prose prose-sm dark:prose-invert max-w-none p-6">
                    <h1 className="text-2xl font-bold font-headline mb-4">{storyData.title}</h1>
                    <p className="whitespace-pre-wrap font-body text-base leading-relaxed">{storyData.story}</p>
                </div>
            </div>
        </div>
    );
}

export function StoryWriterTool({ subscription, refreshSubscription }: ToolProps) {
  const [generatedStory, setGeneratedStory] = useState<StoryWriterOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const toolId: ToolId = "story-writer";

  const form = useForm<StoryWriterInput>({
    resolver: zodResolver(StoryFormSchema),
    defaultValues: {
      topic: "",
      characters: "",
      plot: "",
      pages: "1",
    },
  });

  const canUseTool = () => {
    if (!subscription) return false;
    const usage = subscription.usage[toolId] || 0;
    return usage < subscription.limit;
  }

  const onSubmit = async (values: StoryWriterInput) => {
    if (!user) return;
    if (!canUseTool()) {
      router.push('/subscriptions');
      return;
    }
    
    setIsLoading(true);
    setGeneratedStory(null);
    setError("");

    try {
      await incrementSubscriptionUsage(user.uid, toolId);
      refreshSubscription();
      const result = await storyWriter({
          ...values,
          pages: values.pages ? parseInt(values.pages, 10) : undefined
      });
      setGeneratedStory(result);
    } catch (err: any) {
      const errorMessage = err.message || t('dashboard.storyWriter.error.general');
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const showUpgradeAlert = !canUseTool();

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.storyWriter.title')}</CardTitle>
        <CardDescription>{t('dashboard.storyWriter.description')}</CardDescription>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="col-span-1 lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.storyWriter.labels.topic')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('dashboard.storyWriter.placeholders.topic')} {...field} disabled={isLoading || showUpgradeAlert} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="pages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.storyWriter.labels.pages')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || showUpgradeAlert}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('dashboard.storyWriter.placeholders.pages')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="characters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.storyWriter.labels.characters')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('dashboard.storyWriter.placeholders.characters')} rows={3} {...field} disabled={isLoading || showUpgradeAlert} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.storyWriter.labels.plot')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('dashboard.storyWriter.placeholders.plot')} rows={4} {...field} disabled={isLoading || showUpgradeAlert} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || showUpgradeAlert} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('dashboard.storyWriter.button.loading')}
                    </>
                  ) : (
                    t('dashboard.storyWriter.button.default')
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Result */}
          <div className="col-span-1 lg:col-span-3">
             {isLoading ? (
              <div className="flex items-center justify-center h-full bg-card rounded-lg border">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : generatedStory ? (
                <StoryResult storyData={generatedStory} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-card rounded-lg border p-8">
                <BookMarked className="w-16 h-16 mb-4" />
                <p>{t('dashboard.storyWriter.initialState')}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardFooter>
    </Card>
  );
}

    
