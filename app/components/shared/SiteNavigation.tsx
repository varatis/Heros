"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Library,
  Play,
  Store,
  UserRound,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocalHeroProfile } from "@/lib/hero-profile";
import { charger } from "@/lib/lonewolf/sauvegarde";
import SignOutButton from "@/components/auth/SignOutButton";

const TABS = [
  { href: "/", label: "Accueil", icon: House, match: [""] },
  { href: "/catalogue", label: "Bibliothèque", icon: Library, match: ["catalogue"] },
  { href: "/jouer", label: "Jouer", icon: Play, match: ["jouer"], fab: true },
  { href: "/shop", label: "Boutique", icon: Store, match: ["shop"] },
  {
    href: "/character",
    label: "Héros",
    icon: UserRound,
    match: ["character", "achievements"],
  },
] as const;

const DESKTOP_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Bibliothèque" },
  { href: "/shop", label: "Boutique" },
  { href: "/achievements", label: "Succès" },
  { href: "/character", label: "Mon héros" },
];

/** Le bouton Jouer reprend la partie sauvegardée quand il y en a une. */
function useJouerHref() {
  const [href, setHref] = useState("/jouer");
  useEffect(() => {
    try {
      if (charger()) setHref("/jouer/aventure");
    } catch {
      /* localStorage indisponible : parcours de création par défaut. */
    }
  }, []);
  return href;
}

function isActiveTab(pathname: string, tab: (typeof TABS)[number]) {
  if (tab.href === "/") return pathname === "/";
  return tab.match.some(
    (m) => pathname === `/${m}` || pathname.startsWith(`/${m}/`),
  );
}

export default function SiteNavigation({
  children,
  username,
  signedIn,
  isGuest = false,
}: {
  children: React.ReactNode;
  username: string | null;
  signedIn: boolean;
  isGuest?: boolean;
}) {
  const pathname = usePathname();
  const jouerHref = useJouerHref();
  const [bookmarkEmoji, setBookmarkEmoji] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      try {
        setBookmarkEmoji(getLocalHeroProfile().bookmark?.iconEmoji ?? null);
      } catch {
        setBookmarkEmoji(null);
      }
    };
    update();
    window.addEventListener("herobook_profile_updated", update);
    return () => {
      window.removeEventListener("herobook_profile_updated", update);
    };
  }, []);

  // Lecture immersive : l'écran de jeu apporte son propre cadre.
  if (pathname.startsWith("/jouer/aventure")) {
    return (
      <>
        <a href="#contenu" className="skip-link action-link">
          Aller au récit
        </a>
        <div id="contenu">{children}</div>
      </>
    );
  }

  // Parcours guidés plein écran (création, rituel, connexion) : sans chrome.
  const immersive =
    pathname === "/jouer" ||
    pathname === "/onboarding" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.includes("/play");
  if (immersive) {
    return (
      <>
        <a href="#contenu" className="skip-link action-link">
          Aller au contenu
        </a>
        <div id="contenu" className="min-h-screen bg-[#070c0a]">
          {children}
        </div>
      </>
    );
  }

  const initial = (username ?? "?").charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070c0a] text-foreground">
      {/* Fond de forêt nocturne, fixe et discret. */}
      <div
        className="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-[0.12]"
        style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#070c0a]/60 via-transparent to-[#070c0a]"
        aria-hidden="true"
      />

      <a href="#contenu" className="skip-link action-link">
        Aller au contenu
      </a>

      {/* ----- En-tête compact ----- */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#09100d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-2 px-4 sm:h-16 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="HeroBook, accueil"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#dfbb78]/30 bg-gradient-to-b from-[#1c2921] to-[#0e1612] text-[#dfbb78]">
              <Swords className="h-[18px] w-[18px]" />
            </span>
            <span className="font-serif text-lg font-bold tracking-tight text-white sm:text-xl">
              Hero<span className="text-[#dfbb78]">Book</span>
            </span>
          </Link>

          {/* Navigation bureau */}
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 lg:flex"
          >
            {DESKTOP_LINKS.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/[0.08] font-bold text-[#dfbb78]"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-white",
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href={jouerHref}
              className="btn btn-primary btn-sm ml-2 !min-h-[40px]"
            >
              <Play size={15} />
              Jouer
            </Link>
          </nav>

          {/* Compte */}
          <div className="flex shrink-0 items-center gap-2">
            {signedIn ? (
              <SignOutButton
                isGuest={isGuest}
                className="h-9 w-9 rounded-xl p-0 hover:bg-rose-950/40"
              />
            ) : (
              <Link
                href="/login"
                className="btn btn-secondary btn-sm !min-h-[38px] !px-3.5"
              >
                Se connecter
              </Link>
            )}
            <Link
              href="/character"
              aria-label="Mon héros"
              className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[#dfbb78]/40 bg-[#18251e] text-base transition-colors hover:border-[#dfbb78]"
            >
              {bookmarkEmoji ?? (
                <span className="text-xs font-bold text-[#dfbb78]">
                  {initial}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ----- Contenu ----- */}
      <div
        id="contenu"
        className="relative flex-1 pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-10"
      >
        {children}
      </div>

      {/* ----- Barre d'onglets mobile ----- */}
      <nav aria-label="Navigation mobile" className="tabbar lg:hidden">
        <div className="tabbar-inner">
          {TABS.map((tab) => {
            const active = isActiveTab(pathname, tab);
            const Icon = tab.icon;
            if ("fab" in tab && tab.fab) {
              return (
                <Link
                  key={tab.href}
                  href={jouerHref}
                  aria-current={active ? "page" : undefined}
                  aria-label="Jouer à l'aventure"
                  className="flex flex-col items-center justify-start gap-1 pt-0.5"
                >
                  <span className="tabbar-fab">
                    <Icon className="fill-current" />
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      active ? "text-[#dfbb78]" : "text-muted-foreground",
                    )}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="tabbar-item"
              >
                <Icon />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
