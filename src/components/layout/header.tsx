
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Globe, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/icons/logo";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "next-themes";


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const baseNavLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/subscriptions", label: t('nav.pricing') },
    { href: "/about", label: t('nav.about') },
    { href: "/contact", label: t('nav.contact') },
  ];

  const navLinks = user 
    ? [{ href: "/dashboard", label: t('nav.dashboard') }, ...baseNavLinks]
    : baseNavLinks;
    
  // Re-order for logged in users
  if (user) {
    const home = navLinks.find(link => link.href === '/');
    const dashboard = navLinks.find(link => link.href === '/dashboard');
    const others = navLinks.filter(link => link.href !== '/' && link.href !== '/dashboard');
    if(home && dashboard) {
        navLinks.splice(0, navLinks.length, home, dashboard, ...others);
    }
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Logo className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block font-headline">
                NeuraForge
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    "transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {link.label}
                </Link>
                ))}
            </nav>
        </div>
        <div className="flex items-center justify-end gap-2">
           <div className="hidden md:flex items-center gap-2">
             {!user && !loading && (
                <>
                    <Button variant="ghost" asChild>
                        <Link href="/login">{t('nav.login')}</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">{t('nav.signup')}</Link>
                    </Button>
                </>
             )}
            </div>

           <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('language.title')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('language.title')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as 'en' | 'ar')}>
                <DropdownMenuRadioItem value="en">{t('language.en')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ar">{t('language.ar')}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {loading ? (
            <div className="h-10 w-10"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || `https://placehold.co/150x150.png`} alt={user.displayName || user.email || "User"} data-ai-hint="user avatar" />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="me-2 h-4 w-4" />
                  <span>{t('userMenu.profile')}</span>
                </DropdownMenuItem>
                  <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="me-2 h-4 w-4" />
                  <span>{t('userMenu.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="flex items-center gap-2"></div>
          )}

           <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={locale === 'ar' ? 'right' : 'left'} className="pr-0">
                    <Link
                        href="/"
                        className="flex items-center space-x-2"
                      >
                      <Logo className="h-6 w-6" />
                      <span className="font-bold font-headline">
                        NeuraForge
                      </span>
                    </Link>
                    <div className="my-4 h-[calc(100vh-8rem)] pb-10 ps-6">
                      <div className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "transition-colors hover:text-primary",
                               pathname === link.href ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                         {!user && !loading && (
                            <div className="flex flex-col space-y-3 pt-4 border-t">
                                <Link href="/login" className="text-muted-foreground hover:text-primary">
                                    {t('nav.login')}
                                </Link>
                                <Link href="/signup" className="text-muted-foreground hover:text-primary">
                                    {t('nav.signup')}
                                </Link>
                            </div>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
