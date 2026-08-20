"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpenText, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : error.message);
      setLoading(false);
    } else {
      router.push("/catalogue");
      router.refresh();
    }
  }

  async function handleGuestPlay() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      setError("Impossible de créer une session invité.");
      setLoading(false);
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="fixed inset-0 gradient-reading-bg pointer-events-none" />
      <div className="pointer-events-none fixed -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-28 left-4 size-72 rounded-full bg-[--hero-gold]/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_25rem] lg:items-center">
        <section className="hidden premium-card rounded-[2rem] p-8 lg:block">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[--hero-gold]/30 bg-[--hero-gold]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[--hero-gold]">
              <BookOpenText className="size-4" /> HeroBook
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-5xl font-black tracking-tight">
                Ouvrez un <span className="gradient-hero">grimoire vivant</span>
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Retrouvez le plaisir de lire une dark fantasy immersive, avec les décisions, l’inventaire et la tension d’un jeu de rôle mobile.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/50 bg-background/30 p-4">
                <Sparkles className="mb-2 size-5 text-primary" />
                <p className="text-xs font-bold text-muted-foreground">Choix narratifs</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/30 p-4">
                <ShieldCheck className="mb-2 size-5 text-[--hero-emerald]" />
                <p className="text-xs font-bold text-muted-foreground">Progression sûre</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/30 p-4">
                <BookOpenText className="mb-2 size-5 text-[--hero-gold]" />
                <p className="text-xs font-bold text-muted-foreground">Lecture premium</p>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-card mx-auto w-full max-w-md rounded-[2rem] p-5 shadow-2xl sm:p-7">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl border border-primary/35 bg-primary/15 text-primary shadow-inner">
              <BookOpenText className="size-8" />
            </div>
            <h1 className="text-3xl font-black"><span className="gradient-hero">HeroBook</span></h1>
            <p className="mt-1 text-sm text-muted-foreground">Votre aventure vous attend.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="heros@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-2xl pl-10" required autoComplete="email" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-2xl pl-10" required autoComplete="current-password" />
              </div>
            </div>

            {error && <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</div>}

            <Button type="submit" className="h-11 w-full rounded-2xl font-black glow-purple" disabled={loading} id="login-submit">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Se connecter"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="h-11 w-full rounded-2xl border-[--hero-gold]/25 bg-[--hero-gold]/10 font-black" onClick={handleGuestPlay} disabled={loading} id="guest-play-btn">
            <Sparkles className="size-4 text-[--hero-gold]" /> Jouer en invité
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ? <Link href="/register" className="font-bold text-primary hover:underline">S’inscrire gratuitement</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
