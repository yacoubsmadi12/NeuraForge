
"use client";

import { useState, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { generateCv, type GenerateCvOutput } from "@/ai/flows/generate-cv";
import { Loader2, AlertTriangle, PlusCircle, Trash2, Printer, UploadCloud, FileText, Download, Copy, Check, User as UserIcon, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GenerateCvInputSchema } from "@/ai/flows/schemas/generate-cv";
import { useRouter } from "next/navigation";
import type { Subscription, ToolId } from "@/lib/subscription-constants";
import { incrementSubscriptionUsage } from "@/lib/subscription-service";
import { useAuth } from "@/hooks/use-auth";

interface ToolProps {
  subscription: Subscription | null;
  refreshSubscription: () => void;
}

// Client-side validation schema
const ClientGenerateCvInputSchema = GenerateCvInputSchema.extend({
    email: z.string().email("Invalid email address."),
    portfolioLink: z.string().url("Invalid URL format.").optional().or(z.literal(''))
});

type GenerateCvInput = z.infer<typeof ClientGenerateCvInputSchema>;

function CvResult({ cvData, userInput }: { cvData: GenerateCvOutput, userInput: GenerateCvInput }) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const cvPrintRef = useRef<HTMLDivElement>(null);
    const [isCopying, setIsCopying] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = async () => {
        const element = cvPrintRef.current;
        if (!element) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${userInput.name}-CV.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate PDF.",
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopy = () => {
        if (!cvPrintRef.current) return;
        
        setIsCopying(true);
        const textToCopy = cvPrintRef.current.innerText;
        navigator.clipboard.writeText(textToCopy);
        
        toast({ title: "Copied to clipboard!" });
        setTimeout(() => setIsCopying(false), 2000);
    };

    return (
        <Card className="col-span-1 lg:col-span-3 border-none shadow-none">
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>{t('dashboard.generateCv.result.title')}</CardTitle>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" size="sm" disabled={isCopying}>
                        {isCopying ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {t('dashboard.common.copy')}
                    </Button>
                    <Button onClick={handleDownloadPdf} variant="outline" size="sm" disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {t('dashboard.common.downloadPdf')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div ref={cvPrintRef} className="bg-white text-black rounded-lg border p-8 md:p-12 font-sans">
                    <header className="text-center border-b pb-6 mb-6 flex flex-col items-center">
                        {userInput.photoDataUri && (
                             <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={userInput.photoDataUri} alt={userInput.name} />
                                <AvatarFallback><UserIcon className="w-12 h-12" /></AvatarFallback>
                            </Avatar>
                        )}
                        <h1 className="text-4xl font-bold font-headline tracking-tight">{userInput.name}</h1>
                        <p className="text-muted-foreground mt-2 text-base">
                            {userInput.location} &bull; {userInput.phone} &bull; {userInput.email}
                            {userInput.portfolioLink && ` &bull; ${userInput.portfolioLink}`}
                        </p>
                    </header>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-headline border-b-2 border-primary/50 pb-2 mb-4">{t('dashboard.generateCv.result.summary')}</h2>
                        <p className="text-muted-foreground">{cvData.professionalSummary}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-headline border-b-2 border-primary/50 pb-2 mb-4">{t('dashboard.generateCv.result.experience')}</h2>
                        <div className="space-y-6">
                            {cvData.processedExperience.map((job, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-lg font-semibold">{job.role}</h3>
                                        <p className="text-sm text-muted-foreground">{job.dates}</p>
                                    </div>
                                    <p className="text-md text-primary font-medium">{job.company}</p>
                                    <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                                        {job.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                     <section className="mb-8">
                        <h2 className="text-2xl font-bold font-headline border-b-2 border-primary/50 pb-2 mb-4">{t('dashboard.generateCv.result.education')}</h2>
                         {userInput.education.map((edu, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                                    <p className="text-sm text-muted-foreground">{edu.dates}</p>
                                </div>
                                <p className="text-md text-primary font-medium">{edu.institution}</p>
                            </div>
                        ))}
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold font-headline border-b-2 border-primary/50 pb-2 mb-4">{t('dashboard.generateCv.result.skills')}</h2>
                        <div className="space-y-4">
                            {cvData.categorizedSkills.map((skillCat, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold mb-2">{skillCat.category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillCat.skills.map((skill, i) => (
                                            <span key={i} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </CardContent>
        </Card>
    );
}


export function GenerateCvTool({ subscription, refreshSubscription }: ToolProps) {
  const [generatedCv, setGeneratedCv] = useState<GenerateCvOutput | null>(null);
  const [userInput, setUserInput] = useState<GenerateCvInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const toolId: ToolId = "generate-cv";

  const form = useForm<GenerateCvInput>({
    resolver: zodResolver(ClientGenerateCvInputSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      portfolioLink: "",
      photoDataUri: "",
      targetJobTitle: "",
      experience: [{ role: "", company: "", dates: "", responsibilities: "" }],
      education: [{ degree: "", institution: "", dates: "" }],
      hobbies: "",
      volunteering: "",
      references: [{ name: "", details: "" }],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: "education",
  });
  
  const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({
    control: form.control,
    name: "references",
  });


    const onPhotoDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                form.setValue('photoDataUri', e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [form]);

    const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps, isDragActive: isPhotoDragActive } = useDropzone({
        onDrop: onPhotoDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false,
    });
    
  const canUseTool = () => {
    if (!subscription) return false;
    const usage = subscription.usage[toolId] || 0;
    return usage < subscription.limit;
  }

  const onSubmit = async (values: GenerateCvInput) => {
    if (!user) return;
    if (!canUseTool()) {
      router.push('/subscriptions');
      return;
    }
    
    setIsLoading(true);
    setGeneratedCv(null);
    setUserInput(null);
    setError("");

    try {
      await incrementSubscriptionUsage(user.uid, toolId);
      refreshSubscription();
      const result = await generateCv(values);
      setGeneratedCv(result);
      setUserInput(values);
    } catch (err) {
      setError(t('dashboard.generateCv.error.general'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const showUpgradeAlert = !canUseTool();
  const isDisabled = isLoading || showUpgradeAlert;
  const photoValue = form.watch('photoDataUri');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form Column */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">{t('dashboard.generateCv.title')}</CardTitle>
          <CardDescription>{t('dashboard.generateCv.description')}</CardDescription>
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('dashboard.generateCv.form.personal')}</h3>
                  
                   <FormItem>
                        <FormLabel>{t('dashboard.generateCv.form.photo')}</FormLabel>
                        <div {...getPhotoRootProps()} className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 ${isPhotoDragActive ? 'border-primary' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input {...getPhotoInputProps()} disabled={isDisabled}/>
                            {photoValue && photoValue.length > 0 ? (
                                <div className="relative">
                                    <Image src={photoValue} alt="Profile preview" width={100} height={100} className="rounded-full" />
                                    <Button type="button" size="sm" variant="destructive" className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0" onClick={() => form.setValue('photoDataUri', '')}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-muted-foreground">{t('dashboard.generateCv.form.photoPrompt')}</p>
                                </div>
                            )}
                        </div>
                    </FormItem>

                  <FormField control={form.control} name="targetJobTitle" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.targetJobTitle')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} placeholder={t('dashboard.generateCv.form.targetJobTitlePlaceholder')} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.name')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.email')}</FormLabel><FormControl><Input {...field} type="email" disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.phone')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                      <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.location')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                   <FormField control={form.control} name="portfolioLink" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.portfolio')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              <Separator />
              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('dashboard.generateCv.form.experience')}</h3>
                <div className="space-y-6">
                {expFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                        <FormField control={form.control} name={`experience.${index}.role`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.role')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.company')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`experience.${index}.dates`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.dates')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`experience.${index}.responsibilities`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.responsibilities')}</FormLabel><FormControl><Textarea {...field} rows={4} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                        {index > 0 && <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeExp(index)}><Trash2 className="w-4 h-4 mr-1"/> {t('dashboard.generateCv.form.removeExperience')}</Button>}
                    </div>
                ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendExp({ role: "", company: "", dates: "", responsibilities: "" })}><PlusCircle className="w-4 h-4 mr-2"/>{t('dashboard.generateCv.form.addExperience')}</Button>
              </div>
              <Separator />
              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('dashboard.generateCv.form.education')}</h3>
                <div className="space-y-6">
                {eduFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                        <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.degree')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.institution')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name={`education.${index}.dates`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.dates')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                        {index > 0 && <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeEdu(index)}><Trash2 className="w-4 h-4 mr-1"/>{t('dashboard.generateCv.form.removeEducation')}</Button>}
                    </div>
                ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendEdu({ degree: "", institution: "", dates: "" })}><PlusCircle className="w-4 h-4 mr-2"/>{t('dashboard.generateCv.form.addEducation')}</Button>
              </div>
              <Separator />
               {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold">{t('dashboard.generateCv.form.skills')}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.generateCv.form.skillsDescription')}</p>
              </div>
              <Separator />
               {/* Hobbies */}
              <div>
                 <FormField control={form.control} name="hobbies" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.hobbies')}</FormLabel><FormControl><Textarea {...field} placeholder={t('dashboard.generateCv.form.hobbiesPlaceholder')} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              <Separator />
              {/* Volunteering */}
              <div>
                 <FormField control={form.control} name="volunteering" render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.volunteering')}</FormLabel><FormControl><Textarea {...field} placeholder={t('dashboard.generateCv.form.volunteeringPlaceholder')} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
              </div>
              <Separator />
              {/* References */}
              <div>
                 <h3 className="text-lg font-semibold mb-4">{t('dashboard.generateCv.form.references')}</h3>
                  <div className="space-y-6">
                  {refFields.map((field, index) => (
                      <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                          <FormField control={form.control} name={`references.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.referenceName')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} /></FormControl><FormMessage /></FormItem> )} />
                          <FormField control={form.control} name={`references.${index}.details`} render={({ field }) => ( <FormItem><FormLabel>{t('dashboard.generateCv.form.referenceDetails')}</FormLabel><FormControl><Input {...field} disabled={isDisabled} placeholder={t('dashboard.generateCv.form.referenceDetailsPlaceholder')} /></FormControl><FormMessage /></FormItem> )} />
                          {index > 0 && <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeRef(index)}><Trash2 className="w-4 h-4 mr-1"/> {t('dashboard.generateCv.form.removeReference')}</Button>}
                      </div>
                  ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendRef({ name: "", details: "" })}><PlusCircle className="w-4 h-4 mr-2"/>{t('dashboard.generateCv.form.addReference')}</Button>
              </div>

              <Button type="submit" disabled={isDisabled} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('dashboard.generateCv.button.loading')}</> : t('dashboard.generateCv.button.default')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Result Column */}
      <div className="col-span-1 lg:col-span-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-card rounded-lg border">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : generatedCv && userInput ? (
          <CvResult cvData={generatedCv} userInput={userInput} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-card rounded-lg border p-8">
            <FileText className="w-16 h-16 mb-4" />
            <p>{t('dashboard.generateCv.result.initialState')}</p>
          </div>
        )}
         {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      </div>
    </div>
  );
}

    
