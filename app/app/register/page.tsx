"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, BookOpen, Sparkles, Compass } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit compter au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (!supabaseConfigured) {
      // Mode hors-ligne / prévisualisation locale : créer une session d'aventurier immédiate
      if (typeof window !== "undefined") {
        sessionStorage.setItem("herobook_registered_email", email);
      }
      setTimeout(() => {
        router.push("/onboarding");
      }, 400);
      return;
    }

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      setConfirmation(true);
      setLoading(false);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  function handleDirectPreview() {
    router.push("/onboarding");
  }

  if (confirmation) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#060907] -z-20" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 -z-10"
          style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-transparent to-[#060907]/90 -z-10" />

        <section className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-[#0d1410]/90 border border-emerald-900/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Scellez votre serment
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Un pigeon voyageur arcanique vous a transmis un lien de confirmation.
            Vérifiez votre boîte de messagerie (et vos spams), puis connectez-vous
            pour commencer vos aventures.
          </p>
          <div className="pt-2">
            <Link href="/login" className="action-link w-full">
              Retourner à la porte des ombres (Connexion)
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 py-12 overflow-hidden">
      {/* Fond immersif sombre forêt la nuit avec le lecteur */}
      <div className="absolute inset-0 bg-[#060907] -z-30" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 -z-20 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
      />
      {/* Voiles d'ombres et brume nocturne */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060907]/70 to-[#050806] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-[#060907]/50 to-[#060907]/80 -z-10" />

      {/* Particules d'ambiance braises/lucioles */}
      <div className="absolute top-1/4 left-1/5 w-1 h-1 rounded-full bg-emerald-400 blur-[1px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-300 blur-[1px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-teal-300 blur-[1px] animate-pulse pointer-events-none" />

      <div className="relative w-full max-w-md space-y-7 z-10">
        {/* En-tête atmosphérique dark fantasy */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1b2820] to-[#0d1511] border border-[#dfbb78]/40 shadow-[0_0_25px_rgba(223,187,120,0.15)] mb-1">
            <BookOpen className="w-7 h-7 text-[#dfbb78]" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#dfbb78] font-semibold">
            Le Pacte du Lecteur
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Créer un compte
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            Pénétrez sous la canopée nocturne. À l&apos;étape suivante, vous
            choisirez le nom de votre héros et votre marque-page de légende.
          </p>
        </div>

        {/* Panneau de saisie frosted glass 2026 */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-[#0c130f]/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          <form onSubmit={handleRegister} className="space-y-4" id="register-form">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Votre adresse des arcanes (Email)
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

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mot de passe secret
                </Label>
                <span className="text-[11px] text-muted-foreground/70">8 car. min.</span>
              </div>
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
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
              id="register-submit"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1b1509]" />
                  <span>Gravure du serment...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Créer mon compte</span>
                  <Sparkles className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Séparateur élégant */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="bg-[#0c130f] px-3">ou exploration directe</span>
            </div>
          </div>

          {/* Découverte sans compte */}
          <button
            type="button"
            onClick={handleDirectPreview}
            className="w-full h-11 border border-emerald-900/50 hover:border-emerald-700/70 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-200/90 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Découvrir sans attendre (Nom & Marque-page)</span>
          </button>
        </div>

        {/* Lien de retour vers connexion */}
        <p className="text-center text-xs text-muted-foreground">
          Vous possédez déjà un tome scellé ?{" "}
          <Link
            href="/login"
            className="text-[#dfbb78] hover:underline font-semibold ml-1"
          >
            Rejoindre la lecture
          </Link>
        </p>
      </div>
    </main>
  );
}
