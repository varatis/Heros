"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, getAuthRedirectUrl } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";
import { ensureAnonymousUser, isAnonymousUser } from "@/lib/auth/guest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Compass,
  Sparkles,
  LogIn,
  UserPlus,
  ArrowLeft,
  KeyRound,
  Wand2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import OAuthButtons from "@/components/auth/OAuthButtons";

type Mode = "signin" | "signup" | "reset" | "magic-sent" | "reset-sent" | "signup-sent";

/**
 * Écran d'authentification unifié (mobile-first).
 *
 * Fonctionnalités :
 *  - Connexion email / mot de passe
 *  - Création de compte avec indicateur de force du mot de passe
 *  - Connexion sans mot de passe (Magic Link)
 *  - Mot de passe oublié
 *  - Boutons sociaux (Google, Apple, Microsoft, GitHub)
 *  - Vrai mode invité persistant (signInAnonymously)
 *  - Messages de retour (oauth_error, confirmed, guest=closed...)
 *  - Optimisations clavier mobile (inputMode, autoComplete, enterKeyHint)
 */
export default function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode: Mode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const redirectTo = useMemo(() => {
    const raw = searchParams.get("redirectTo");
    if (!raw) return "/catalogue";
    if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\")) {
      return raw;
    }
    return "/catalogue";
  }, [searchParams]);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{
    tone: "success" | "error" | "warn";
    message: string;
  } | null>(null);

  useEffect(() => {
    const err = searchParams.get("oauth_error");
    const confirmed = searchParams.get("confirmed");
    const guestClosed = searchParams.get("guest");
    const resetDone = searchParams.get("reset");
    const magic = searchParams.get("magic");

    if (err) setBanner({ tone: "error", message: decodeURIComponent(err) });
    else if (confirmed === "1")
      setBanner({
        tone: "success",
        message: "Adresse confirmée — vous pouvez vous connecter.",
      });
    else if (guestClosed === "closed")
      setBanner({
        tone: "warn",
        message:
          "Session invité fermée. Créez un compte pour ne rien perdre la prochaine fois.",
      });
    else if (resetDone === "done")
      setBanner({
        tone: "success",
        message:
          "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.",
      });

    if (magic === "1") setMode("magic-sent");
  }, [searchParams]);

  const [currentIsGuest, setCurrentIsGuest] = useState(false);
  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentIsGuest(isAnonymousUser(user));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setCurrentIsGuest(isAnonymousUser(session?.user));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  function navigate(target: string) {
    router.push(target);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setBanner(null);

    if (!supabaseConfigured) {
      setTimeout(() => navigate(redirectTo), 400);
      return;
    }

    const supabase = createClient();

    try {
      if (mode === "signin") {
        if (!password.trim()) {
          // Magic Link
          const base = getAuthRedirectUrl();
          const emailRedirectTo =
            base === "com.herobook.app://auth-callback"
              ? `${base}?next=${encodeURIComponent(redirectTo)}&type=magiclink`
              : `${base}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo },
          });
          if (error) throw error;
          setMode("magic-sent");
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setBanner({ tone: "error", message: friendlyAuthError(error.message) });
          return;
        }
        navigate(redirectTo);
        return;
      }

      if (mode === "signup") {
        if (passwordStrength(password).score < 2) {
          setBanner({
            tone: "error",
            message:
              "Mot de passe trop faible : ajoutez quelques caractères, un chiffre ou une majuscule.",
          });
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.is_anonymous) {
          // Upgrade invité → compte permanent (même UUID). Un email de
          // confirmation est envoyé ; la session invité reste active.
          const { error } = await supabase.auth.updateUser({ email, password });
          if (error) {
            setBanner({
              tone: "error",
              message: friendlyAuthError(error.message),
            });
            return;
          }
          setMode("signup-sent");
          return;
        }

        const base = getAuthRedirectUrl();
        const emailRedirectTo =
          base === "com.herobook.app://auth-callback"
            ? `${base}?next=${encodeURIComponent("/onboarding")}&type=signup`
            : `${base}/auth/callback?next=${encodeURIComponent("/onboarding")}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        });
        if (error) {
          setBanner({
            tone: "error",
            message: friendlyAuthError(error.message),
          });
          return;
        }
        if (data.session) {
          // Confirmation email désactivée : le compte est actif aussitôt.
          navigate("/onboarding");
          return;
        }
        if (data.user && (data.user.identities?.length ?? 0) === 0) {
          // Email déjà enregistré (Supabase ne l'avoue pas explicitement).
          setBanner({
            tone: "warn",
            message:
              "Un compte existe déjà avec cette adresse. Connectez-vous ou recevez un lien magique.",
          });
          setMode("signin");
          setPassword("");
          return;
        }
        setMode("signup-sent");
        return;
      }

      if (mode === "reset") {
        const base = getAuthRedirectUrl();
        const redirectToForReset =
          base === "com.herobook.app://auth-callback"
            ? `${base}?type=recovery&next=/login`
            : `${base}/auth/callback?next=/login&type=recovery`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectToForReset,
        });
        if (error) throw error;
        setMode("reset-sent");
        return;
      }
    } catch (err: any) {
      setBanner({
        tone: "error",
        message: friendlyAuthError(err?.message ?? "Erreur inconnue"),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestPlay() {
    setLoading(true);
    setBanner(null);

    if (!supabaseConfigured) {
      setTimeout(() => navigate("/onboarding"), 400);
      return;
    }

    try {
      const guest = await ensureAnonymousUser();
      if (!guest) {
        // Échec (connexions anonymes désactivées sur le projet, réseau…) :
        // on reste ici avec un message clair au lieu de rebondir sur /login.
        setBanner({
          tone: "error",
          message:
            "La connexion invité est indisponible pour le moment. Créez un compte pour jouer, ou réessayez plus tard.",
        });
        setLoading(false);
        return;
      }
      navigate("/onboarding");
    } catch {
      setBanner({
        tone: "error",
        message:
          "Impossible de démarrer une session invité. Vérifiez votre connexion Internet.",
      });
      setLoading(false);
    }
  }

  if (mode === "signup-sent") {
    return (
      <EmptyState
        icon={<Mail className="w-7 h-7" />}
        title="Vérifiez votre boîte mail"
        subtitle={`Un lien de confirmation vient d'être envoyé à ${email || "votre adresse"}. Cliquez-le pour activer votre compte, puis revenez ici pour vous connecter.`}
        actions={
          <div className="space-y-2">
            <Button
              className="w-full h-12 rounded-xl font-bold"
              onClick={() => {
                setMode("signin");
                setPassword("");
              }}
            >
              J&apos;ai confirmé, me connecter
            </Button>
            {currentIsGuest && (
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl"
                onClick={() => navigate("/onboarding")}
              >
                Continuer en invité pour l&apos;instant
              </Button>
            )}
            <button
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setMode("signup")}
            >
              Changer d&apos;adresse email
            </button>
          </div>
        }
      />
    );
  }

  if (mode === "magic-sent" || mode === "reset-sent") {
    return (
      <EmptyState
        icon={<Mail className="w-7 h-7" />}
        title={
          mode === "magic-sent"
            ? "Lien de connexion envoyé"
            : "Instructions envoyées"
        }
        subtitle={
          mode === "magic-sent"
            ? `Un pigeon arcanique a déposé un lien magique sur ${email || "votre boîte"}. Cliquez-le depuis cet appareil pour vous connecter sans mot de passe.`
            : `Consultez ${email || "votre boîte mail"} : un lien vous permet de redéfinir votre mot de passe.`
        }
        actions={
          <div className="space-y-2">
            <Button
              className="w-full h-12 rounded-xl font-bold"
              onClick={() => {
                setMode("signin");
                setPassword("");
              }}
            >
              {mode === "magic-sent"
                ? "Saisir un mot de passe à la place"
                : "Retour à la connexion"}
            </Button>
            <button
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setMode(mode === "magic-sent" ? "signin" : "reset")}
            >
              Changer d'adresse email
            </button>
          </div>
        }
      />
    );
  }

  const isSignIn = mode === "signin";
  const isSignUp = mode === "signup";
  const isReset = mode === "reset";

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 py-8 overflow-hidden">
      <div className="absolute inset-0 bg-[#060907] -z-30" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 -z-20 scale-105"
        style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060907]/75 to-[#050806] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-[#060907]/40 to-[#060907]/80 -z-10" />

      <div className="relative w-full max-w-md space-y-5 z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1b2820] to-[#0d1511] border border-[#dfbb78]/40 shadow-[0_0_25px_rgba(223,187,120,0.15)] mb-1">
            <BookOpen className="w-7 h-7 text-[#dfbb78]" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#dfbb78] font-semibold">
            {isSignUp ? "Le Pacte du Lecteur" : "Porte des Ombres"}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            {isReset
              ? "Récupérer votre compte"
              : isSignUp
                ? "Créer un compte"
                : "Reprendre la lecture"}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            {isReset
              ? "Saisissez votre adresse : un lien magique vous sera envoyé."
              : isSignUp
                ? "Sauvegardez votre progression sur tous vos appareils."
                : "Rouvrez votre grimoire et retrouvez vos marques-pages."}
          </p>
        </div>

        <div className="rounded-3xl p-6 sm:p-7 backdrop-blur-2xl bg-[#0c130f]/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5">
          {currentIsGuest && !isReset && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-800/40 bg-emerald-950/30 p-3 text-xs leading-5 text-emerald-100">
              <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <p>
                Vous êtes en invité. Créez un compte ci-dessous — votre
                progression, vos gemmes et vos héros seront conservés.
              </p>
            </div>
          )}

          {banner && (
            <div
              className={cn(
                "flex items-start gap-2 rounded-xl border p-3 text-xs leading-5",
                banner.tone === "error" &&
                  "border-rose-900/50 bg-rose-950/40 text-rose-200",
                banner.tone === "success" &&
                  "border-emerald-800/50 bg-emerald-950/40 text-emerald-200",
                banner.tone === "warn" &&
                  "border-amber-800/50 bg-amber-950/40 text-amber-200",
              )}
            >
              {banner.tone === "error" ? (
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <p>{banner.message}</p>
            </div>
          )}

          {!isReset && <OAuthButtons next={redirectTo} />}

          {!isReset && (
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="bg-[#0c130f] px-3">ou avec votre email</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfbb78]/70" />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="lecteur@foret-sombre.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="pl-10 h-12 bg-[#121c17]/90 border-white/10 text-foreground placeholder:text-muted-foreground/50 rounded-xl focus:border-[#dfbb78] focus:ring-[#dfbb78]/20 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {!isReset && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Mot de passe
                  </Label>
                  {isSignIn && (
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-[11px] text-[#dfbb78] hover:underline"
                    >
                      Oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfbb78]/70" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder={
                      isSignUp
                        ? "Créez un mot de passe sécurisé"
                        : "Laisser vide → lien magique"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-[#121c17]/90 border-white/10 text-foreground placeholder:text-muted-foreground/50 rounded-xl focus:border-[#dfbb78] focus:ring-[#dfbb78]/20 transition-all text-sm"
                    required={isSignUp}
                    minLength={isSignUp ? 8 : undefined}
                    enterKeyHint={isSignUp ? "next" : "done"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Masquer le mot de passe" : "Afficher"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isSignUp && password.length > 0 && (
                  <PasswordStrengthMeter password={password} />
                )}

                {isSignIn && (
                  <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1 pt-0.5">
                    <Wand2 className="w-3 h-3 text-[#dfbb78]/80" />
                    Astuce : laissez vide pour recevoir un lien magique.
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#dfbb78] via-[#e5c78f] to-[#cfab65] text-[#1b1509] font-bold text-sm tracking-wide rounded-xl shadow-[0_4px_20px_rgba(223,187,120,0.3)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1b1509]" />
                  Enchantement en cours…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isReset ? (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Envoyer le lien
                    </>
                  ) : isSignUp ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      {currentIsGuest
                        ? "Sécuriser mon compte"
                        : "Créer mon compte"}
                    </>
                  ) : password ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      Ouvrir ma session
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Recevoir un lien magique
                    </>
                  )}
                </span>
              )}
            </Button>
          </form>

          {!isReset && (
            <p className="text-center text-xs text-muted-foreground">
              {isSignIn ? (
                <>
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setBanner(null);
                    }}
                    className="text-[#dfbb78] hover:underline font-semibold ml-1 cursor-pointer"
                  >
                    Créer un compte
                  </button>
                </>
              ) : (
                <>
                  Vous avez déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setBanner(null);
                    }}
                    className="text-[#dfbb78] hover:underline font-semibold ml-1 cursor-pointer"
                  >
                    Se connecter
                  </button>
                </>
              )}
            </p>
          )}

          {isReset && (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setBanner(null);
              }}
              className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Retour à la connexion
            </button>
          )}

          {!isReset && (
            <div className="relative pt-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="bg-[#0c130f] px-3">ou</span>
              </div>
            </div>
          )}

          {!isReset && (
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-emerald-900/50 hover:border-emerald-700/70 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-200/90 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              onClick={handleGuestPlay}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <Compass className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {currentIsGuest
                  ? "Continuer en invité"
                  : "Jouer sans compte (invité)"}
              </span>
            </Button>
          )}
        </div>

        <p className="text-center text-[11px] leading-5 text-muted-foreground/70 px-4">
          En invité, votre progression est sauvegardée sur cet appareil.
          Liez un compte à tout moment pour la retrouver partout.
        </p>
      </div>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────── */
function EmptyState({
  icon,
  title,
  subtitle,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actions: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#060907] -z-20" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 -z-10"
        style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-transparent to-[#060907]/90 -z-10" />
      <section className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-[#0d1410]/90 border border-[#dfbb78]/30 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#dfbb78]/10 border border-[#dfbb78]/30 flex items-center justify-center text-[#dfbb78]">
          {icon}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {subtitle}
        </p>
        <p className="text-[11px] text-muted-foreground/80">
          Pensez à vérifier vos courriers indésirables (spams).
        </p>
        <div className="pt-1">{actions}</div>
      </section>
    </main>
  );
}

function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label, color } = passwordStrength(password);
  return (
    <div className="pt-1 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? color : "bg-white/10",
            )}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground flex justify-between">
        <span>Force du mot de passe</span>
        <span className={cn("font-semibold", color.replace("bg-", "text-"))}>
          {label}
        </span>
      </p>
    </div>
  );
}

function passwordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  const labels = [
    { label: "Très faible", color: "bg-rose-500/80" },
    { label: "Faible", color: "bg-orange-500/80" },
    { label: "Correct", color: "bg-amber-400/80" },
    { label: "Bonne", color: "bg-emerald-500/80" },
    { label: "Excellente", color: "bg-emerald-400" },
  ];
  const l = labels[Math.min(score, 4)];
  return { score, label: l.label, color: l.color };
}

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Adresse email ou mot de passe incorrect.";
  if (m.includes("email not confirmed"))
    return "Votre adresse n'a pas été confirmée. Cliquez le lien reçu par email.";
  if (m.includes("already registered") || m.includes("user already"))
    return "Un compte existe déjà avec cette adresse. Connectez-vous ou utilisez un lien magique.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Trop de tentatives. Patientez quelques instants.";
  if (m.includes("network"))
    return "Connexion Internet indisponible. Vérifiez votre réseau.";
  return message;
}
