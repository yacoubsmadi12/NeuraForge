
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function TermsPage() {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setLastUpdated(new Date().toLocaleDateString('en-US'));
  }, []); // Empty dependency array ensures this runs once on mount
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Terms and Conditions</h1>
          <p className="mt-4 text-lg text-muted-foreground">{lastUpdated ? `Last Updated: ${lastUpdated}` : ' '}</p>
        </div>

        <Card className="prose prose-invert prose-headings:font-headline prose-a:text-primary max-w-none">
          <CardContent className="py-8 space-y-6">
            <section>
              <h2 className="font-headline">1. Agreement to Terms</h2>
              <p>By using our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the services. We may modify the Terms at any time, and such modifications will be effective immediately upon posting.</p>
            </section>
            
            <section>
              <h2 className="font-headline">2. User Accounts</h2>
              <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
            </section>

            <section>
              <h2 className="font-headline">3. Subscriptions</h2>
              <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.</p>
            </section>
            
            <section>
              <h2 className="font-headline">4. Content</h2>
              <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
              <p>You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third-party posts on or through the Service.</p>
            </section>

            <section>
              <h2 className="font-headline">5. Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
            </section>

            <section>
              <h2 className="font-headline">6. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at: <a href="mailto:support@neuraforge.com">support@neuraforge.com</a>.</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
