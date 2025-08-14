
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Logo } from "../icons/logo";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setNeedsVerification(false);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await sendEmailVerification(userCredential.user);
      
      // Don't sign out, just redirect to a page that shows the verification message.
      // This allows us to potentially log the user in right after verification without another step.
      setNeedsVerification(true);
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and verify your email address to log in.",
      });

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard?new_user=true");
    } catch (error: any) {
      // Don't show an error toast if the user closes the Google sign-in popup
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Sign-in popup closed by user.");
        return;
      }
      console.error(error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (needsVerification) {
     return (
       <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-primary/20 shadow-lg animate-fade-in-up">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Check Your Email</CardTitle>
            <CardDescription>
                We've sent a verification link to your email address. Please click the link to continue.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
             <p className="text-sm text-muted-foreground">
                Once verified, you can log in.
            </p>
             <Button asChild className="mt-4">
              <Link href="/login">Go to Login</Link>
            </Button>
        </CardContent>
       </Card>
     );
  }

  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-primary/20 shadow-lg animate-fade-in-up">
      <CardHeader className="text-center items-center">
        <Logo className="w-12 h-12 mb-4 animate-pulse" />
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>
          Join NeuraForge and start creating with AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} disabled={isLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
         <Separator className="my-6" />
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
           Continue with Google
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground mt-4">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
        </p>
        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-primary">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
