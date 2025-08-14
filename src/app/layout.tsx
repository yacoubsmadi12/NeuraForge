
import type { Metadata } from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { AuthProvider } from '@/components/auth/auth-provider';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/context/theme-provider';

export const metadata: Metadata = {
  title: 'NeuraForge AI Toolkit',
  description: 'The AI Toolsmith of the Web',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
