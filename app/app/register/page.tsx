"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpenText, Gem, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").update({ username }).eq("id", data.user.id);
      router.push("/onboarding");
      router.refresh();
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="fixed inset-0 gradient-reading-bg pointer-events-none" />
      <div className="pointer-events-none fixed -left-24 top-10 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-28 right-4 size-72 rounded-full bg-[--hero-gold]/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_25rem] lg:items-center">
        <section className="hidden premium-card rounded-[2rem] p-8 lg:block">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-primary">
              <ShieldCheck className="size-4" /> Nouveau héros
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-5xl font-black tracking-tight">
                Créez votre héros, <span className="gradient-hero">gardez vos trésors</span>
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Un compte protège votre progression, vos gemmes, vos succès et vos futurs achats quand HeroBook passera aux vrais paiements mobile.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[--hero-gold]/25 bg-[--hero-gold]/10 p-5">
              <div className="flex items-center gap-3 text-[--hero-gold]">
                <Gem className="size-6" />
                <div>
                  <div className="font-black">50 gemmes de bienvenue</div>
                  <p className="text-xs font-semibold text-muted-foreground">Pour démarrer les premières aventures.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-card mx-auto w-full max-w-md rounded-[2rem] p-5 shadow-2xl sm:p-7">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl border border-primary/35 bg-primary/15 text-primary shadow-inner">
              <BookOpenText className="size-8" />
            </div>
            <h1 className="text-3xl font-black"><span className="gradient-hero">Rejoindre HeroBook</span></h1>
            <p className="mt-1 text-sm text-muted-foreground">Votre légende commence ici.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4" id="register-form">
            <div className="space-y-1.5">
              <Label htmlFor="username">Nom du héros</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="username" type="text" placeholder="Morrigan" value={username} onChange={(e) => setUsername(e.target.value)} className="h-11 rounded-2xl pl-10" required minLength={3} maxLength={20} pattern="[a-zA-Z0-9_]+" autoComplete="username" />
              </div>
              <p className="text-xs text-muted-foreground">3–20 caractères, lettres, chiffres et underscores.</p>
            </div>

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
                <Input id="password" type="password" placeholder="8 caractères minimum" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-2xl pl-10" required autoComplete="new-password" />
              </div>
            </div>

            {error && <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</div>}

            <Button type="submit" className="h-11 w-full rounded-2xl font-black glow-purple" disabled={loading} id="register-submit">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Créer mon héros"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ? <Link href="/login" className="font-bold text-primary hover:underline">Se connecter</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
