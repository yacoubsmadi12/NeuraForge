
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter }from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PayPalIcon } from '@/components/icons/paypal';
import { FaWhatsapp } from "react-icons/fa6";
import { useAuth } from '@/hooks/use-auth';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { StripeIcon } from '@/components/icons/stripe';
import Script from 'next/script';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useLanguage } from '@/context/language-context';


declare global {
    interface Window {
        paypal: any;
    }
}

function CheckoutContent({ isPayPalScriptLoaded }: { isPayPalScriptLoaded: boolean }) {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const plan = searchParams.get('plan') || 'Monthly';
  const price = searchParams.get('price') || '4.99';
  const priceAmount = parseFloat(price.replace('$', ''));
  const planId = searchParams.get('planId') || 'monthly';
  
  const zainCashNumber = '00962796734144';
  const whatsappLink = `https://wa.me/962796734144?text=${encodeURIComponent(`I have paid for the ${plan} plan. Here is the screenshot:`)}`;

  const stripeLinks = {
    monthly: "https://buy.stripe.com/7sYaEP5eI4PmdhZ5h10oM00",
    yearly: "https://buy.stripe.com/5kQ8wH9uY1Da1zh9xh0oM01",
  };

  const stripeLink = planId === 'monthly' ? stripeLinks.monthly : planId === 'yearly' ? stripeLinks.yearly : '';

  useEffect(() => {
    if (!isPayPalScriptLoaded || !window.paypal) return;
    
    const container = document.getElementById('paypal-buttons-container');
    if (!container) return;
    container.innerHTML = '';
    
    let hostedButtonId = '';
    if (planId === 'monthly') {
        hostedButtonId = "B4JSK5D7FJ7J2";
    } else if (planId === 'yearly') {
        hostedButtonId = "4ATHP8PG6JPYS";
    }

    if (hostedButtonId) {
        window.paypal.HostedButtons({ hostedButtonId }).render("#paypal-buttons-container");
    }
  }, [planId, isPayPalScriptLoaded]);

  const PaymentNote = () => (
    (planId === 'monthly' || planId === 'yearly') && (
        <Alert className="mt-4 text-center">
            <Info className="h-4 w-4" />
            <AlertDescription>
                {t('checkout.paymentNote')}
            </AlertDescription>
        </Alert>
    )
  );
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Complete Your Purchase</h1>
          <p className="mt-4 text-lg text-muted-foreground">You are one step away from unlocking premium features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your subscription details before payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">{plan}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Billed</span>
                <span className="font-semibold">{plan === 'Monthly' ? 'Per Month' : 'Per Year'}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">${priceAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-1">
             <Tabs defaultValue="paypal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paypal">
                  <PayPalIcon className="w-5 h-5 mr-2"/> PayPal
                </TabsTrigger>
                <TabsTrigger value="zaincash">
                  <FaWhatsapp className="w-5 h-5 mr-2"/> Zain/Cliq
                </TabsTrigger>
                 <TabsTrigger value="stripe" disabled={planId === 'free'}>
                  <StripeIcon className="w-5 h-5 mr-2"/> Stripe
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="paypal">
                <Card>
                  <CardHeader>
                    <CardTitle>Pay with PayPal</CardTitle>
                    <CardDescription>Click the button below to complete your purchase securely with PayPal.</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[100px] flex items-center justify-center flex-col">
                    {!isPayPalScriptLoaded && <Loader2 className="h-6 w-6 animate-spin" />}
                    <div id="paypal-buttons-container" style={{ width: '100%', display: isPayPalScriptLoaded ? 'block' : 'none' }}></div>
                    {planId === 'free' && isPayPalScriptLoaded && <p>Free plan does not require payment.</p>}
                    <PaymentNote />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="zaincash">
                <Card>
                  <CardHeader>
                    <CardTitle>Pay with Zain Cash / Cliq</CardTitle>
                     <CardDescription>Follow the instructions below to complete your payment.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <p className="text-sm">
                      1. Please transfer the amount of <strong className="text-primary">${priceAmount.toFixed(2)}</strong> to the following number:
                    </p>
                    <p className="font-mono text-lg p-2 bg-muted rounded-md">{zainCashNumber}</p>
                     <p className="text-sm">
                      2. After payment, send a screenshot of the receipt to our WhatsApp to activate your subscription.
                    </p>
                     <Button asChild className="w-full">
                        <Link href={whatsappLink} target="_blank">
                           <FaWhatsapp className="w-5 h-5 mr-2"/> Send Proof on WhatsApp
                        </Link>
                     </Button>
                    <PaymentNote />
                  </CardContent>
                </Card>
              </TabsContent>

               <TabsContent value="stripe">
                <Card>
                    <CardHeader>
                        <CardTitle>Pay with Stripe</CardTitle>
                        <CardDescription>
                            Click the button below to complete your purchase with Stripe.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                           <Link href={stripeLink} target="_blank">
                            Checkout with Stripe
                           </Link>
                        </Button>
                         <PaymentNote />
                    </CardContent>
                </Card>
               </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isPayPalScriptLoaded, setIsPayPalScriptLoaded] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <>
            <Script 
                src="https://www.paypal.com/sdk/js?client-id=BAAo2zTDFGTGvNC_XpqjZfaYt9ukRVYr6HzzI8veuzLzih_OO5L_KyDhi0MqghZ13zv5FVs1FtNhZKYfsw&components=hosted-buttons&disable-funding=venmo&currency=USD"
                strategy="lazyOnload"
                onLoad={() => setIsPayPalScriptLoaded(true)}
            />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <CheckoutContent isPayPalScriptLoaded={isPayPalScriptLoaded} />
            </Suspense>
        </>
    )
}

export default function CheckoutPageWithProvider() {
  return (
    <AuthProvider>
        <CheckoutPage />
    </AuthProvider>
  )
}
