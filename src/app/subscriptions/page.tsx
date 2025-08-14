"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const plans = [
    {
      name: t('subscriptions.plans.free.name'),
      price: "$0",
      priceAmount: "0",
      period: t('subscriptions.plans.free.period'),
      description: t('subscriptions.plans.free.description'),
      features: [
        t('subscriptions.plans.free.features.0'),
        t('subscriptions.plans.free.features.1'),
        t('subscriptions.plans.free.features.2'),
        t('subscriptions.plans.free.features.3'),
      ],
      cta: t('subscriptions.plans.free.cta'),
      variant: "secondary" as const,
      planId: "free"
    },
    {
      name: t('subscriptions.plans.monthly.name'),
      price: "$4.99",
      priceAmount: "4.99",
      period: t('subscriptions.plans.monthly.period'),
      description: t('subscriptions.plans.monthly.description'),
      features: [
        t('subscriptions.plans.monthly.features.0'),
        t('subscriptions.plans.monthly.features.1'),
        t('subscriptions.plans.monthly.features.2'),
        t('subscriptions.plans.monthly.features.3'),
        t('subscriptions.plans.monthly.features.4'),
      ],
      cta: t('subscriptions.plans.monthly.cta'),
      variant: "default" as const,
      planId: "monthly"
    },
    {
      name: t('subscriptions.plans.yearly.name'),
      price: "$64.99",
      priceAmount: "64.99",
      period: t('subscriptions.plans.yearly.period'),
      description: t('subscriptions.plans.yearly.description'),
      features: [
        t('subscriptions.plans.yearly.features.0'),
        t('subscriptions.plans.yearly.features.1'),
        t('subscriptions.plans.yearly.features.2'),
        t('subscriptions.plans.yearly.features.3'),
        t('subscriptions.plans.yearly.features.4'),
      ],
      cta: t('subscriptions.plans.yearly.cta'),
      variant: "outline" as const,
      planId: "yearly"
    },
  ];
  
  const handleSubscription = (planId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (planId === 'free') {
      router.push('/signup');
    } else {
      const plan = plans.find(p => p.planId === planId);
      if (plan) {
         const checkoutUrl = `/checkout?plan=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.price)}&planId=${plan.planId}`;
         router.push(checkoutUrl);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">{t('subscriptions.page.title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('subscriptions.page.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.planId === 'monthly' ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.variant} 
                  onClick={() => handleSubscription(plan.planId)}
                >
                    {plan.cta}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
