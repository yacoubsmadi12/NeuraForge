
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
import { signInWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, browserSessionPersistence, setPersistence } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "../ui/label";
import { Logo } from "../icons/logo";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (loginFn: () => Promise<any>, isNewUser: boolean = false) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await loginFn();
      if (!userCredential?.user) {
         throw new Error("Login failed, please try again.");
      }
      
      const user = userCredential.user;

      if (!user.emailVerified && userCredential.providerId === 'password') {
        await auth.signOut();
        toast({
          variant: "destructive",
          title: "Email Not Verified",
          description: "Please verify your email address before logging in.",
        });
        return;
      }
      router.push(`/dashboard${isNewUser ? '?new_user=true' : ''}`);
    } catch (error: any) {
      // Don't show an error toast if the user closes the Google sign-in popup
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Sign-in popup closed by user.");
        return;
      }
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailSubmit = (values: z.infer<typeof formSchema>) => {
    handleLogin(() => signInWithEmailAndPassword(auth, values.email, values.password));
  };
  
  const onGoogleSubmit = () => {
    const provider = new GoogleAuthProvider();
    handleLogin(() => signInWithPopup(auth, provider), true); // Assume new user for welcome
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
        toast({ variant: "destructive", title: "Email is required." });
        return;
    }
    setResetLoading(true);
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast({
            title: "Password Reset Email Sent",
            description: "Please check your inbox to reset your password.",
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to send password reset email.",
        });
    } finally {
        setResetLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-primary/20 shadow-lg animate-fade-in-up">
      <CardHeader className="text-center items-center">
        <Logo className="w-12 h-12 mb-4 animate-pulse" />
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>
          Log in to your NeuraForge account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} disabled={isLoading} />
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
                  <div className="flex justify-between items-baseline">
                    <FormLabel>Password</FormLabel>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <button type="button" className="text-sm text-muted-foreground hover:text-primary">
                            Forgot password?
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Your Password</AlertDialogTitle>
                          <AlertDialogDescription>
                            Enter your email address below and we'll send you a link to reset your password.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email Address</Label>
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="you@example.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                disabled={resetLoading}
                            />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={resetLoading}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handlePasswordReset} disabled={resetLoading}>
                            {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Link
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log In
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <Button variant="outline" className="w-full" onClick={onGoogleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
          Continue with Google
        </Button>
        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:text-primary">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
