

"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Loader2, ScanText, AlertTriangle, Mail, BookMarked, Send, PenSquare, Languages, BrainCircuit, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import { type VoiceAssistantOutput, voiceAssistant } from "@/ai/flows/voice-assistant";
import { generateEmail } from "@/ai/flows/generate-email";
import { storyWriter } from "@/ai/flows/story-writer";
import { generateDocument } from "@/ai/flows/generate-document";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import type { Subscription, ToolId } from "@/lib/subscription-constants";
import { incrementSubscriptionUsage } from "@/lib/subscription-service";
import { useAuth } from "@/hooks/use-auth";


interface ToolProps {
  subscription: Subscription | null;
  refreshSubscription: () => void;
}
type RecordingStatus = "idle" | "permission" | "recording" | "transcribing" | "success" | "error";

function EmailResultCard({ data, transcription }: { data: any, transcription: string }) {
    const { t } = useLanguage();
    const [emailData, setEmailData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<{subject: string, body: string} | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedEmail(null);
        try {
            const result = await generateEmail({
                recipient: emailData.recipient,
                topic: emailData.topic,
                tone: 'Formal', // Default tone
                notes: transcription,
            });
            setGeneratedEmail(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary"/>
                    <CardTitle>{t('dashboard.voiceAssistant.results.email.title')}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {generatedEmail ? (
                     <div className="space-y-2">
                         <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                           <strong className="text-foreground">{generatedEmail.subject}</strong>
                           <br />
                           <br />
                           {generatedEmail.body.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-1">
                            <Label htmlFor="recipient">{t('dashboard.voiceAssistant.results.email.recipient')}</Label>
                            <Input id="recipient" value={emailData.recipient} onChange={(e) => setEmailData({...emailData, recipient: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="topic">{t('dashboard.voiceAssistant.results.email.topic')}</Label>
                            <Input id="topic" value={emailData.topic} onChange={(e) => setEmailData({...emailData, topic: e.target.value})} />
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                            {t('dashboard.voiceAssistant.results.email.generateButton')}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function StoryResultCard({ data, transcription }: { data: any, transcription: string }) {
    const { t } = useLanguage();
    const [storyData, setStoryData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedStory, setGeneratedStory] = useState<{title: string, story: string} | null>(null);
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedStory(null);
        try {
            const result = await storyWriter({
                topic: storyData.topic,
                plot: transcription
            });
            setGeneratedStory(result);
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-primary"/>
                    <CardTitle>{t('dashboard.voiceAssistant.results.story.title')}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 {generatedStory ? (
                     <div className="space-y-2">
                         <h3 className="font-bold text-lg">{generatedStory.title}</h3>
                         <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                           {generatedStory.story.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-1">
                            <Label htmlFor="topic">{t('dashboard.voiceAssistant.results.story.topic')}</Label>
                            <Input id="topic" value={storyData.topic} onChange={(e) => setStoryData({...storyData, topic: e.target.value})} />
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin" /> : <PenSquare />}
                             {t('dashboard.voiceAssistant.results.story.generateButton')}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function DocumentResultCard({ data }: { data: any }) {
    const { t } = useLanguage();
    const [docData, setDocData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedDoc, setGeneratedDoc] = useState<{ content: string } | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedDoc(null);
        try {
            const result = await generateDocument({ topic: docData.topic });
            setGeneratedDoc(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary"/>
                    <CardTitle>{t('dashboard.voiceAssistant.results.document.title')}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {generatedDoc ? (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg whitespace-pre-wrap">
                            {generatedDoc.content}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-1">
                            <Label htmlFor="doc-topic">{t('dashboard.voiceAssistant.results.document.topic')}</Label>
                            <Input id="doc-topic" value={docData.topic} onChange={(e) => setDocData({ ...docData, topic: e.target.value })} />
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin" /> : <PenSquare />}
                            {t('dashboard.voiceAssistant.results.document.generateButton')}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export function VoiceAssistantTool({ subscription, refreshSubscription }: ToolProps) {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [transcription, setTranscription] = useState("");
  const [resultData, setResultData] = useState<VoiceAssistantOutput | null>(null);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const { t, locale } = useLanguage();
  const toolId: ToolId = "voice-assistant";

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const resetState = () => {
    setStatus("idle");
    setTranscription("");
    setError("");
    setResultData(null);
    audioChunksRef.current = [];
  }

  const canUseTool = () => {
    if (!subscription) return false;
    const usage = subscription.usage[toolId] || 0;
    return usage < subscription.limit;
  }

  const startRecording = async () => {
    if (!canUseTool()) {
      router.push('/subscriptions');
      return;
    }
    resetState();
    setStatus("permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus("recording");
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(t('dashboard.voiceToText.error.micDenied'));
      setStatus("error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      // onstop event will trigger handleStop
    }
  };

  const handleStop = async () => {
    if (!user) return;
    setStatus("transcribing");
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        await incrementSubscriptionUsage(user.uid, toolId);
        refreshSubscription();
        const result = await voiceAssistant({ audioDataUri: base64Audio, languageCode: locale });
        setTranscription(result.transcription);
        setResultData(result);
        setStatus("success");
      } catch (err) {
        console.error("Transcription error:", err);
        setError(t('dashboard.voiceToText.error.transcriptionFailed'));
        setStatus("error");
      }
    };
  };

  const isRecording = status === "recording";
  const showUpgradeAlert = !canUseTool();

  const getStatusText = () => {
    switch (status) {
      case "permission": return t('dashboard.voiceToText.status.permission');
      case "recording": return t('dashboard.voiceToText.status.recording');
      case "transcribing": return t('dashboard.voiceToText.status.transcribing');
      default: return "";
    }
  }
  
  const renderResult = () => {
    if (!resultData || !resultData.action) return null;

    switch (resultData.action.name) {
        case 'generateEmail':
            return <EmailResultCard data={resultData.action.data} transcription={transcription} />;
        case 'writeStory':
            return <StoryResultCard data={resultData.action.data} transcription={transcription} />;
        case 'generateDocument':
            return <DocumentResultCard data={resultData.action.data} />;
        default:
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.voiceAssistant.results.transcription.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap p-4 bg-muted rounded-lg">{transcription}</p>
                    </CardContent>
                </Card>
            );
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.voiceAssistant.title')}</CardTitle>
        <CardDescription>{t('dashboard.voiceAssistant.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {showUpgradeAlert && (
          <Alert variant="premium" className="mb-4 w-full">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('dashboard.upgrade.title')}</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{t('dashboard.upgrade.description')}</span>
              <Button onClick={() => router.push('/subscriptions')} size="sm">{t('dashboard.upgrade.button')}</Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={status === "permission" || status === "transcribing" || showUpgradeAlert}
            className="w-48"
          >
            {isRecording ? (
              <>
                <StopCircle className="mr-2 h-5 w-5" />
                {t('dashboard.voiceToText.button.stop')}
              </>
            ) : status === 'transcribing' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                {t('dashboard.voiceToText.button.start')}
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground h-5">
            {getStatusText()}
          </p>
        </div>

        <div className="mt-6 w-full max-w-2xl">
            {status === 'transcribing' && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>{t('dashboard.voiceToText.status.processing')}</p>
                </div>
            )}
            {resultData && transcription && renderResult()}

            {!resultData && status !== 'transcribing' && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 bg-card rounded-lg border">
                    <BrainCircuit className="w-12 h-12 mx-auto mb-4" />
                    <p>{t('dashboard.voiceAssistant.initialState.p1')}</p>
                    <p className="text-xs text-muted-foreground/80 mt-2">{t('dashboard.voiceAssistant.initialState.p2')}</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        {error && status === 'error' && <p className="text-sm text-destructive">{error}</p>}
      </CardFooter>
    </Card>
  );
}

    
