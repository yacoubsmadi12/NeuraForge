
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail, type GenerateEmailOutput } from "@/ai/flows/generate-email";
import { GenerateEmailInputSchema } from "@/ai/flows/schemas/generate-email";
import { Loader2, Mail, Copy, Check, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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

type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

export function GenerateEmailTool({ subscription, refreshSubscription }: ToolProps) {
  const [generatedEmail, setGeneratedEmail] = useState<GenerateEmailOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const toolId: ToolId = "generate-email";

  const form = useForm<GenerateEmailInput>({
    resolver: zodResolver(GenerateEmailInputSchema),
    defaultValues: {
      recipient: "",
      topic: "",
      tone: "Friendly",
      notes: "",
    },
  });

  const canUseTool = () => {
    if (!subscription) return false;
    const usage = subscription.usage[toolId] || 0;
    return usage < subscription.limit;
  }

  const onSubmit = async (values: GenerateEmailInput) => {
    if (!user) return;
    if (!canUseTool()) {
      router.push('/subscriptions');
      return;
    }
    
    setIsLoading(true);
    setGeneratedEmail(null);
    setError("");

    try {
      await incrementSubscriptionUsage(user.uid, toolId);
      refreshSubscription();
      const result = await generateEmail(values);
      setGeneratedEmail(result);
    } catch (err) {
      setError(t('dashboard.generateEmail.error.general'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'subject' | 'body') => {
    navigator.clipboard.writeText(text);
    if (type === 'subject') {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };
  
  const showUpgradeAlert = !canUseTool();

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.generateEmail.title')}</CardTitle>
        <CardDescription>{t('dashboard.generateEmail.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {showUpgradeAlert && (
          <Alert variant="premium" className="mb-4 md:col-span-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('dashboard.upgrade.title')}</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
               <span>{t('dashboard.upgrade.description')}</span>
              <Button onClick={() => router.push('/subscriptions')} size="sm">{t('dashboard.upgrade.button')}</Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="p-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.generateEmail.labels.recipient')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('dashboard.generateEmail.placeholders.recipient')} {...field} disabled={isLoading || showUpgradeAlert} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.generateEmail.labels.topic')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('dashboard.generateEmail.placeholders.topic')} {...field} disabled={isLoading || showUpgradeAlert} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.generateEmail.labels.tone')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || showUpgradeAlert}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('dashboard.generateEmail.placeholders.tone')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Formal">{t('dashboard.generateEmail.tones.formal')}</SelectItem>
                          <SelectItem value="Casual">{t('dashboard.generateEmail.tones.casual')}</SelectItem>
                          <SelectItem value="Persuasive">{t('dashboard.generateEmail.tones.persuasive')}</SelectItem>
                          <SelectItem value="Friendly">{t('dashboard.generateEmail.tones.friendly')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.generateEmail.labels.notes')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('dashboard.generateEmail.placeholders.notes')} rows={4} {...field} disabled={isLoading || showUpgradeAlert} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || showUpgradeAlert}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('dashboard.generateEmail.button.loading')}
                    </>
                  ) : (
                    t('dashboard.generateEmail.button.default')
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Result */}
          <div className="bg-card rounded-lg border p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.generateEmail.generatedEmail')}</h3>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : generatedEmail ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject" className="text-muted-foreground">{t('dashboard.generateEmail.labels.subject')}</Label>
                  <div className="flex items-center gap-2">
                    <Input id="subject" readOnly value={generatedEmail.subject} className="bg-background" />
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(generatedEmail.subject, 'subject')}>
                      {copiedSubject ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label htmlFor="body" className="text-muted-foreground">{t('dashboard.generateEmail.labels.body')}</Label>
                   <div className="relative">
                    <Textarea id="body" readOnly value={generatedEmail.body} rows={12} className="bg-background pr-12" />
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleCopy(generatedEmail.body, 'body')}>
                      {copiedBody ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Mail className="w-16 h-16 mb-4" />
                <p>{t('dashboard.generateEmail.initialState')}</p>
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

    
