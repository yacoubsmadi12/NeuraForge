"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactPage() {
  const { t } = useLanguage();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // TODO: Implement form submission logic
    alert("Form submitted! We'll get back to you soon.");
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">{t('contact.page.title')}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t('contact.page.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('contact.form.title')}</CardTitle>
            <CardDescription>{t('contact.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.form.name.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact.form.name.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.form.email.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact.form.email.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.form.message.label')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('contact.form.message.placeholder')} rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t('contact.form.submit')}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
            <p className="text-muted-foreground">
                {t('contact.page.directEmailText')} <a href="mailto:support@neuraforge.com" className="text-primary hover:underline">support@neuraforge.com</a>
            </p>
        </div>
      </div>
    </div>
  );
}
