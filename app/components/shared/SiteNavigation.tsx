"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Library,
  Store,
  Trophy,
  UserRound,
  ScrollText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/catalogue", label: "Bibliothèque", icon: Library },
  { href: "/shop", label: "Boutique", icon: Store },
  { href: "/achievements", label: "Badges & succès", icon: Trophy },
  { href: "/character", label: "Mon héros", icon: UserRound },
];
export default function SiteNavigation({
  children,
  username,
  signedIn,
}: {
  children: React.ReactNode;
  username: string | null;
  signedIn: boolean;
}) {
  const pathname = usePathname();
  const reading = pathname.startsWith("/jouer/aventure");
  // Dedicated reading controls replace the global mobile bar during a game.
  // The book toolbar always keeps an explicit route back to the library.
  if (reading)
    return (
      <>
        <a href="#contenu" className="skip-link action-link">
          Aller au récit
        </a>
        <div id="contenu">{children}</div>
      </>
    );
  return (
    <>
      <a href="#contenu" className="skip-link action-link">
        Aller au contenu
      </a>
      <header className="site-header border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 min-h-20 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="HeroBook, accueil"
          >
            <span className="w-8 h-8 sm:w-10 sm:h-10 border border-primary/50 rounded-xl grid place-items-center text-primary">
              <BookOpen size={22} />
            </span>
            <span className="font-serif text-xl sm:text-2xl tracking-tight">
              Hero<span className="text-primary">Book</span>
            </span>
          </Link>
          <nav
            aria-label="Navigation principale"
            className="hidden lg:flex items-center gap-7"
          >
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={cn(
                  "flex gap-2 items-center py-7 border-b-2 text-sm transition-colors",
                  pathname === href
                    ? "text-primary border-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 min-w-0">
            {signedIn ? (
              <>
                <Link
                  className="action-link action-secondary max-w-40 truncate"
                  href="/character"
                >
                  <span className="truncate">{username ?? "Mon compte"}</span>
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    aria-label="Se déconnecter"
                    title="Se déconnecter"
                    className="p-3 text-muted-foreground"
                  >
                    <LogOut size={18} />
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="action-link action-secondary">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>
      <div id="contenu" className="min-h-[70vh] pb-24 lg:pb-0">
        {children}
      </div>
      <footer className="border-t border-border px-6 py-7 pb-28 lg:pb-7 text-sm text-muted-foreground">
        <div className="max-w-[1104px] mx-auto flex flex-wrap gap-5 justify-between">
          <p>HeroBook · Des livres à lire. Des destins à choisir.</p>
          <Link href="/illustrations" className="hover:text-primary">
            Illustrations & bestiaire
          </Link>
          <Link
            href="/regles"
            className="inline-flex items-center gap-2 hover:text-primary"
          >
            <ScrollText size={16} />
            Règles de l’aventure
          </Link>
        </div>
      </footer>
      <nav
        aria-label="Navigation mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border z-40"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-around">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] min-h-16",
                pathname === href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground",
              )}
            >
              <Icon size={21} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
