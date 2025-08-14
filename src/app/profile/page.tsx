
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getSubscription } from "@/lib/subscription-service";
import type { Subscription } from "@/lib/subscription-constants";
import { ALL_TOOLS, PLAN_LIMITS } from "@/lib/subscription-constants";
import { ManageSubscriptionDialog } from "./components/manage-subscription-dialog";


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      getSubscription(user.uid).then(sub => {
        setSubscription(sub);
        setLoading(false);
      });
    }
  }, [user, authLoading, router]);

  const isLoading = authLoading || loading;

  if (isLoading || !user || !subscription) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renewalDateString = subscription.renewalDate 
    ? new Date(subscription.renewalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';
  
  const getToolName = (toolId: string) => {
    return toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">User Profile</h1>
          <p className="mt-4 text-lg text-muted-foreground">Manage your account settings and subscription.</p>
        </div>

        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.photoURL || `https://placehold.co/150x150.png`} alt={user.displayName || ""} data-ai-hint="user avatar" />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-headline">{user.displayName || "User"}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>This information is managed by your Google account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.displayName || ""} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your current plan and usage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                     <div>
                       <p className="font-semibold">Current Plan: <span className="text-primary">{subscription.plan}</span></p>
                        {(subscription.plan === 'Monthly' || subscription.plan === 'Yearly') && subscription.status === 'active' && (
                         <p className="text-sm text-muted-foreground">{`Plan renews on ${renewalDateString}`}</p>
                       )}
                       {subscription.status !== 'active' && subscription.plan !== 'Free' && (
                          <p className="text-sm text-destructive">{`Status: ${subscription.status}`}</p>
                       )}
                     </div>
                      {subscription.plan === 'Free' ? (
                          <Button variant="outline" onClick={() => router.push('/subscriptions')}>
                              Upgrade Plan
                          </Button>
                      ) : (
                          <ManageSubscriptionDialog />
                      )}
                   </div>

                   <div>
                    <h4 className="text-sm font-medium mb-4">
                        {subscription.plan === 'Free' ? 'Weekly Usage' : 'Usage this cycle'}
                    </h4>
                    {subscription.limit === Infinity ? (
                       <p className="text-sm text-muted-foreground">You have unlimited usage for all tools.</p>
                    ) : (
                      <div className="space-y-4">
                        {ALL_TOOLS.map(toolId => {
                          const usage = subscription.usage[toolId] || 0;
                          const limit = subscription.limit;
                          const percentage = (usage / limit) * 100;
                          return (
                            <div key={toolId}>
                                <Label htmlFor={`usage-${toolId}`} className="text-xs font-medium">
                                    {getToolName(toolId)}
                                </Label>
                                <div className="flex items-center gap-4 mt-1">
                                    <Progress value={percentage} id={`usage-${toolId}`} className="h-2" />
                                    <span className="text-xs font-semibold text-muted-foreground">{`${usage} / ${limit}`}</span>
                                </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                     <p className="text-xs text-muted-foreground mt-4">
                        {subscription.plan === 'Free' 
                            ? `Your free usage counts reset weekly.`
                            : `Your usage counts reset on ${renewalDateString}.`
                        }
                    </p>
                   </div>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
