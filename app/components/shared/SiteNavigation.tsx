"use client";

import { useEffect, useState } from "react";
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
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocalHeroProfile, HeroProfile } from "@/lib/hero-profile";

const links = [
  { href: "/catalogue", label: "Bibliothèque", icon: Library },
  { href: "/shop", label: "Boutique", icon: Store },
  { href: "/achievements", label: "Badges", icon: Trophy },
  { href: "/character", label: "Mon Héros", icon: UserRound },
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
  const [profile, setProfile] = useState<HeroProfile | null>(null);

  useEffect(() => {
    // Charger le profil de héros local (nom & marque-page)
    const updateProfile = () => {
      setProfile(getLocalHeroProfile());
    };
    updateProfile();
    window.addEventListener("herobook_profile_updated", updateProfile);
    return () => {
      window.removeEventListener("herobook_profile_updated", updateProfile);
    };
  }, []);

  const displayHeroName =
    username || profile?.heroName || "Loup Solitaire";
  const bookmark = profile?.bookmark;

  // En cours de lecture dans le récit interactif : barre dédiée au livre
  if (reading) {
    return (
      <>
        <a href="#contenu" className="skip-link action-link">
          Aller au récit
        </a>
        <div id="contenu">{children}</div>
      </>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070c0a] text-foreground overflow-x-hidden">
      {/* Fond immersif persistant de forêt nocturne & lecteur */}
      <div
        className="fixed inset-0 pointer-events-none -z-20 bg-cover bg-center bg-no-repeat opacity-[0.14] scale-100"
        style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-radial-gradient from-transparent via-[#070c0a]/60 to-[#070c0a]" />

      <a href="#contenu" className="skip-link action-link">
        Aller au contenu
      </a>

      {/* Barre supérieure Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#09100d]/85 border-b border-white/[0.08] transition-all">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-18 flex items-center justify-between gap-3">
          {/* Logo Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            aria-label="HeroBook, accueil"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1c2921] to-[#0e1612] border border-[#dfbb78]/30 flex items-center justify-center text-[#dfbb78] shadow-[0_0_15px_rgba(223,187,120,0.15)] group-hover:border-[#dfbb78] group-hover:scale-105 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1">
                Hero<span className="text-[#dfbb78]">Book</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-mono hidden sm:inline-block">
                Chroniques des 19 Bibliothèques
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav
            aria-label="Navigation principale"
            className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06]"
          >
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-[#dfbb78] text-[#1c1507] font-bold shadow-[0_2px_12px_rgba(223,187,120,0.3)]"
                      : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Espace Compte / Profil Héros & Marque-page */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/character"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#dfbb78]/40 hover:bg-white/[0.06] transition-all max-w-[190px] sm:max-w-xs"
            >
              {/* Badge Marque-page */}
              <div
                className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs shrink-0 shadow-sm"
                style={{
                  backgroundColor: bookmark ? `${bookmark.accentColor}25` : "#dfbb7825",
                  borderColor: bookmark ? bookmark.accentColor : "#dfbb78",
                }}
                title={`Marque-page : ${bookmark?.name || "Kaï"}`}
              >
                <span>{bookmark?.iconEmoji || "☀️"}</span>
              </div>
              <div className="min-w-0 flex flex-col text-left">
                <span className="text-xs font-serif font-bold text-foreground truncate leading-tight">
                  {displayHeroName}
                </span>
                <span className="text-[10px] text-[#dfbb78] truncate leading-none">
                  {bookmark?.title || "Lecteur Kaï"}
                </span>
              </div>
            </Link>

            {signedIn ? (
              <form action="/api/auth/signout" method="post">
                <button
                  aria-label="Se déconnecter"
                  title="Se déconnecter"
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl border border-emerald-900/40 text-xs font-semibold text-emerald-300/90 hover:bg-emerald-950/30 transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div id="contenu" className="flex-1 pb-28 lg:pb-12">
        {children}
      </div>

      {/* Footer sombre mature */}
      <footer className="border-t border-white/[0.08] bg-[#070b09]/90 px-6 py-8 text-xs text-muted-foreground pb-32 lg:pb-8">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-serif text-sm font-semibold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <span>HeroBook</span>
              <span className="text-[#dfbb78]">✦</span>
              <span>19 Bibliothèques d&apos;Aventure</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Des livres à lire dans la pénombre des bois. Des destins à forger.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-center text-[12px]">
            <Link href="/catalogue" className="hover:text-[#dfbb78] transition-colors">
              Les 19 Bibliothèques
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/shop" className="hover:text-[#dfbb78] transition-colors">
              Boutique
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/illustrations" className="hover:text-[#dfbb78] transition-colors">
              Bestiaire & Cartes
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/regles"
              className="inline-flex items-center gap-1.5 hover:text-[#dfbb78] transition-colors"
            >
              <ScrollText size={14} />
              Règles Kaï
            </Link>
          </div>
        </div>
      </footer>

      {/* Barre de navigation mobile flottante 2026 Dock */}
      <nav
        aria-label="Navigation mobile"
        className="lg:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-50 rounded-2xl backdrop-blur-2xl bg-[#0a110e]/90 border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-1.5"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 min-h-[52px]",
                  active
                    ? "text-[#dfbb78] bg-white/[0.07] font-semibold"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                <Icon size={20} className={cn("transition-transform", active && "scale-110")} />
                <span className="text-[10px] mt-1 tracking-tight">{label}</span>
                {active && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#dfbb78] shadow-[0_0_6px_#dfbb78]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
