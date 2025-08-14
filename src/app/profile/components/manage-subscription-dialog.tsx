
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StripeIcon } from "@/components/icons/stripe";
import { PayPalIcon } from "@/components/icons/paypal";
import { FaWhatsapp } from "react-icons/fa6";
import Link from 'next/link';
import { Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ManageSubscriptionDialog() {
  const stripeBillingPortalLink = "https://billing.stripe.com/p/login/7sYaEP5eI4PmdhZ5h10oM00";
  const paypalLoginLink = "https://www.paypal.com/signin";
  const zainCashNumber = '00962796734144';
  const whatsappLink = `https://wa.me/${zainCashNumber}`;
  const supportEmail = "support@neuraforge.com";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Plan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-headline text-2xl">Manage Your Subscription</DialogTitle>
          <DialogDescription className="text-center">
            Please select the payment method you used to subscribe to view management options.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
           <Tabs defaultValue="stripe" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stripe">
                  <StripeIcon className="w-5 h-5 mr-2"/> Stripe
                </TabsTrigger>
                <TabsTrigger value="paypal">
                  <PayPalIcon className="w-5 h-5 mr-2"/> PayPal
                </TabsTrigger>
                <TabsTrigger value="zaincash">
                  <FaWhatsapp className="w-5 h-5 mr-2"/> Zain/Cliq
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stripe">
                <Card className="border-none shadow-none">
                  <CardHeader className="text-center">
                    <CardTitle>Manage with Stripe</CardTitle>
                    <CardDescription>
                      Click below to access your billing portal to view invoices, update payment methods, or cancel your plan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                     <Button asChild>
                      <Link href={stripeBillingPortalLink} target="_blank">
                        <StripeIcon className="w-5 h-5 mr-2" /> Go to Stripe Billing
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="paypal">
                <Card className="border-none shadow-none">
                  <CardHeader className="text-center">
                    <CardTitle>Manage with PayPal</CardTitle>
                    <CardDescription>
                      To manage or cancel your subscription, please log in to your PayPal account and manage your pre-approved payments.
                    </CardDescription>
                  </CardHeader>
                   <CardContent className="flex justify-center">
                     <Button asChild>
                      <Link href={paypalLoginLink} target="_blank">
                        <PayPalIcon className="w-5 h-5 mr-2" /> Log in to PayPal
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
               
              <TabsContent value="zaincash">
                <Card className="border-none shadow-none">
                  <CardHeader className="text-center">
                    <CardTitle>Manage with Zain Cash / Cliq</CardTitle>
                    <CardDescription>
                      To manage your subscription, including cancellations or changes, please contact our support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                     <Button asChild className="w-full">
                        <Link href={whatsappLink} target="_blank">
                           <FaWhatsapp className="w-5 h-5 mr-2"/> Contact Support via WhatsApp
                        </Link>
                     </Button>
                      <Button asChild variant="outline" className="w-full">
                        <a href={`mailto:${supportEmail}`}>
                           <Mail className="w-5 h-5 mr-2"/> Contact Support via Email
                        </a>
                     </Button>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
