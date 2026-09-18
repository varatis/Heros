"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, BookOpen, Compass, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabaseConfigured) {
      setTimeout(() => {
        const target = new URLSearchParams(window.location.search).get("redirectTo");
        router.push(target && /^\/(?!\/)/.test(target) && !target.includes("\\") ? target : "/catalogue");
      }, 400);
      return;
    }

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(
        loginError.message === "Invalid login credentials"
          ? "Adresse des arcanes ou mot de passe incorrect."
          : loginError.message
      );
      setLoading(false);
    } else {
      const target = new URLSearchParams(window.location.search).get("redirectTo");
      router.push(target && /^\/(?!\/)/.test(target) && !target.includes("\\") ? target : "/catalogue");
      router.refresh();
    }
  }

  function handleGuestPlay() {
    setLoading(true);
    router.push("/onboarding");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 py-12 overflow-hidden">
      {/* Fond immersif forêt sombre nocturne */}
      <div className="absolute inset-0 bg-[#060907] -z-30" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 -z-20 scale-105"
        style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060907]/75 to-[#050806] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-[#060907]/50 to-[#060907]/80 -z-10" />

      {/* Particules */}
      <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-emerald-400/80 blur-[1px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full bg-amber-300/80 blur-[1px] animate-pulse pointer-events-none" />

      <div className="relative w-full max-w-md space-y-7 z-10">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1b2820] to-[#0d1511] border border-[#dfbb78]/40 shadow-[0_0_25px_rgba(223,187,120,0.15)] mb-1">
            <BookOpen className="w-7 h-7 text-[#dfbb78]" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#dfbb78] font-semibold">
            Porte des Ombres
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Reprendre la lecture
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            Rouvrez votre grimoire personnel et retrouvez vos marques-pages.
          </p>
        </div>

        {/* Panneau de saisie */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-[#0c130f]/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfbb78]/70" />
                <Input
                  id="email"
                  type="email"
                  placeholder="lecteur@foret-sombre.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-[#121c17]/90 border-white/10 text-foreground placeholder:text-muted-foreground/50 rounded-xl focus:border-[#dfbb78] focus:ring-[#dfbb78]/20 transition-all text-sm"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfbb78]/70" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-[#121c17]/90 border-white/10 text-foreground placeholder:text-muted-foreground/50 rounded-xl focus:border-[#dfbb78] focus:ring-[#dfbb78]/20 transition-all text-sm"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-xl p-3 leading-relaxed">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#dfbb78] via-[#e5c78f] to-[#cfab65] text-[#1b1509] font-bold text-sm tracking-wide rounded-xl shadow-[0_4px_20px_rgba(223,187,120,0.3)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-2"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1b1509]" />
                  <span>Ouverture des archives...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Ouvrir ma session</span>
                  <Sparkles className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="bg-[#0c130f] px-3">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-emerald-900/50 hover:border-emerald-700/70 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-200/90 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            onClick={handleGuestPlay}
            disabled={loading}
            id="guest-play-btn"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Jouer en invité (Création express)</span>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Pas encore inscrit sous la canopée ?{" "}
          <Link
            href="/register"
            className="text-[#dfbb78] hover:underline font-semibold ml-1"
          >
            Créer un compte de lecteur
          </Link>
        </p>
      </div>
    </main>
  );
}
