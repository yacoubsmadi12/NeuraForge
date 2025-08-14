
"use client";

import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { useState, useEffect } from 'react';
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const { t } = useLanguage();
 
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, [])

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Logo className="h-6 w-6" />
            <span className="font-bold font-headline">NeuraForge</span>
          </div>
          <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
          </nav>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-6">
          {t('footer.copyright', { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
