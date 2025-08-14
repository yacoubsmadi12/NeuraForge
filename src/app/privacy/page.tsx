
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setLastUpdated(new Date().toLocaleDateString('en-US'));
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-lg text-muted-foreground">{lastUpdated ? `Last Updated: ${lastUpdated}` : ' '}</p>
        </div>

        <Card className="prose prose-invert prose-headings:font-headline prose-a:text-primary max-w-none">
          <CardContent className="py-8 space-y-6">
            <section>
              <h2 className="font-headline">1. Introduction</h2>
              <p>Welcome to NeuraForge. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application.</p>
            </section>
            
            <section>
              <h2 className="font-headline">2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
              <ul>
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, that you voluntarily give to us when you register with the Service.</li>
                <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.</li>
                <li><strong>Data from AI Tools:</strong> We may store inputs you provide to our AI tools (e.g., text prompts, uploaded images, voice files) and the generated outputs to improve our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-headline">3. Use of Your Information</h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
                <ul>
                    <li>Create and manage your account.</li>
                    <li>Process your transactions and subscriptions.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                    <li>Notify you of updates to the Service.</li>
                    <li>Respond to your comments and questions and provide customer service.</li>
                </ul>
            </section>

             <section>
              <h2 className="font-headline">4. Security of Your Information</h2>
              <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            </section>

            <section>
              <h2 className="font-headline">5. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@neuraforge.com">privacy@neuraforge.com</a>.</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
