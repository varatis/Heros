"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { BookOpenText, Loader2, Lock, Mail, MailCheck, ShieldCheck, User } from "lucide-react";
import GemIcon from "@/components/shared/GemIcon";

type PendingKind = "signup" | "conversion";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuestConversion, setIsGuestConversion] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [pendingKind, setPendingKind] = useState<PendingKind>("signup");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setIsGuestConversion(Boolean(user?.is_anonymous));
    });
    return () => {
      cancelled = true;
    };
  }, [supabase.auth]);

  // Retour du lien de confirmation d'email (conversion invité) :
  // /auth/callback redirige ici avec ?confirmed=1 — on rouvre le panneau
  // « définir le mot de passe » directement.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("confirmed") === "1") {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.is_anonymous) {
          setPendingKind("conversion");
          setAwaitingConfirmation(true);
        }
      });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [supabase.auth]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    // ─────────────────────────────────────────────────────────────
    // Invité → conversion du compte anonyme (même user_id = même wallet).
    // Flow conforme à la doc Supabase (auth-anonymous) :
    //   1. lier l'email à l'utilisateur anonyme (updateUser)
    //   2. si le projet exige une confirmation, l'email doit être
    //      confirmé AVANT de pouvoir définir le mot de passe
    //   3. définir le mot de passe → le compte devient permanent.
    // ─────────────────────────────────────────────────────────────
    if (currentUser?.is_anonymous) {
      // L'email est-il déjà lié à cet utilisateur invité (re-soumission
      // après un échec de mot de passe, ou retour sur le formulaire) ?
      const emailAlreadyLinked = currentUser.email === email;

      if (!emailAlreadyLinked) {
        const { data: updateData, error: emailError } = await supabase.auth.updateUser({
          email,
          data: { username },
        });

        if (emailError) {
          const msg = emailError.message.toLowerCase();
          if (msg.includes("already")) {
            setError(
              "Cet email est déjà utilisé par un compte existant. La progression invité ne peut pas y être rattachée : connectez-vous avec ce compte (la session invité sera fermée)."
            );
          } else if (msg.includes("manual linking") || msg.includes("linking")) {
            setError(
              "La liaison invité → compte n'est pas activée sur ce projet Supabase. Activez « Manual linking » dans Auth → Providers, puis réessayez."
            );
          } else {
            setError(emailError.message);
          }
          setLoading(false);
          return;
        }

        if (!updateData.user?.email_confirmed_at) {
          // L'email doit être confirmé avant de définir le mot de passe.
          setPendingKind("conversion");
          setAwaitingConfirmation(true);
          setLoading(false);
          return;
        }
      } else if (!currentUser.email_confirmed_at) {
        // Email déjà lié mais pas encore confirmé → on ré-affiche l'attente.
        setPendingKind("conversion");
        setAwaitingConfirmation(true);
        setLoading(false);
        return;
      }

      // Email lié et confirmé → définir le mot de passe.
      const { error: passwordError } = await supabase.auth.updateUser({ password });
      if (passwordError) {
        setError(passwordError.message);
        setLoading(false);
        return;
      }

      await supabase.from("profiles").update({ username }).eq("id", currentUser.id);
      router.push("/catalogue");
      router.refresh();
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // Inscription classique.
    // ─────────────────────────────────────────────────────────────
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      setError(
        msg.includes("already") || msg.includes("déjà")
          ? "Cet email est déjà utilisé. Connectez-vous plutôt."
          : signUpError.message
      );
      setLoading(false);
      return;
    }

    // Le projet exige une confirmation d'email : aucune session n'est
    // créée tant que l'email n'est pas confirmé. On ne redirige PAS vers
    // l'onboarding (sinon l'utilisateur retombe en invité / mur de login).
    if (data.user && !data.session) {
      setPendingKind("signup");
      setAwaitingConfirmation(true);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").update({ username }).eq("id", data.user.id);
      router.push("/onboarding");
      router.refresh();
    }
  }

  async function handleResend() {
    setLoading(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.resend({
      type: pendingKind === "signup" ? "signup" : "email_change",
      email,
    });
    if (error) {
      setError("Impossible de renvoyer l'email : " + error.message);
    } else {
      setNotice("Email renvoyé. Pensez à vérifier vos spams.");
    }
    setLoading(false);
  }

  async function handleCheckConfirmation() {
    setLoading(true);
    setError(null);
    setNotice(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (pendingKind === "signup") {
      // Compte créé, email confirmé → l'utilisateur peut se connecter.
      if (user && user.email_confirmed_at) {
        router.push("/login");
        router.refresh();
        return;
      }
      setNotice("Votre email n'est pas encore confirmé. Une fois la confirmation reçue, connectez-vous.");
      setLoading(false);
      return;
    }

    // Conversion : l'email doit être confirmé avant de définir le mot de passe.
    // Le mot de passe est demandé sur le panneau (après un retour du lien de
    // confirmation, l'état local est vide : on le revalide ici).
    if (password.length < 8) {
      setError("Choisissez un mot de passe d'au moins 8 caractères.");
      setLoading(false);
      return;
    }
    if (!user?.email_confirmed_at) {
      setNotice("Votre email n'est pas encore confirmé. Vérifiez votre boîte mail (et vos spams).");
      setLoading(false);
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) {
      setError(passwordError.message);
      setAwaitingConfirmation(false);
      setLoading(false);
      return;
    }

    if (user) {
      await supabase.from("profiles").update({ username }).eq("id", user.id);
    }
    router.push("/catalogue");
    router.refresh();
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
                {isGuestConversion
                  ? <>Sécurisez votre <span className="gradient-hero">légende</span></>
                  : <>Créez votre héros, <span className="gradient-hero">gardez vos trésors</span></>}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {isGuestConversion
                  ? "Convertir cette session invité conserve vos gemmes, votre progression et vos succès sous le même héros."
                  : "Un compte protège votre progression, vos gemmes, vos succès et vos futurs achats quand HeroBook passera aux vrais paiements mobile."}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[--hero-gold]/25 bg-[--hero-gold]/10 p-5">
              <div className="flex items-center gap-3 text-[--hero-gold]">
                <GemIcon size="lg" title="" className="drop-shadow-[0_0_10px_oklch(0.83_0.14_80/0.45)]" />
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
            <h1 className="text-3xl font-black">
              <span className="gradient-hero">
                {isGuestConversion ? "Sécuriser mon compte" : "Rejoindre HeroBook"}
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isGuestConversion
                ? "Vos gemmes et votre progression restent liées à ce héros."
                : "Votre légende commence ici."}
            </p>
          </div>

          {awaitingConfirmation ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-[--hero-emerald]/35 bg-[--hero-emerald]/15 text-[--hero-emerald] shadow-inner">
                <MailCheck className="size-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Confirmez votre email</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {pendingKind === "signup" ? (
                    <>Un lien de confirmation vient d'être envoyé à <span className="font-bold text-foreground">{email}</span>. Votre compte sera activé dès que vous aurez cliqué dessus.</>
                  ) : (
                    <>Un lien de confirmation vient d'être envoyé à <span className="font-bold text-foreground">{email}</span>. Une fois confirmé, votre mot de passe sera enregistré et votre progression invité deviendra permanente (même héros, mêmes gemmes).</>
                  )}
                </p>
              </div>

              {notice && <div className="rounded-2xl border border-[--hero-gold]/30 bg-[--hero-gold]/10 px-3 py-2 text-xs font-semibold text-[--hero-gold]">{notice}</div>}
              {error && <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</div>}

              {pendingKind === "conversion" && (
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="confirm-password">Choisissez votre mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="8 caractères minimum"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-2xl pl-10"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <Button
                  type="button"
                  onClick={handleCheckConfirmation}
                  disabled={loading}
                  className="h-11 w-full rounded-2xl font-black"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : pendingKind === "signup" ? "J'ai confirmé mon email" : "Email confirmé — définir mon mot de passe"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={loading}
                  className="h-11 w-full rounded-2xl border-[--hero-gold]/25 bg-[--hero-gold]/10 font-black text-foreground"
                >
                  Renvoyer l'email
                </Button>
              </div>

              {pendingKind === "signup" ? (
                <p className="text-sm text-muted-foreground">
                  Déjà confirmé ? <Link href="/login" className="font-bold text-primary hover:underline">Se connecter</Link>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  En attendant, vous pouvez{" "}
                  <Link href="/catalogue" className="font-bold text-primary hover:underline">continuer en invité</Link>
                  .
                </p>
              )}
            </div>
          ) : (
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

            <Button type="submit" className="h-11 w-full rounded-2xl font-black" disabled={loading} id="register-submit">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isGuestConversion ? (
                "Sécuriser mes achats"
              ) : (
                "Créer mon héros"
              )}
            </Button>
          </form>
          )}

          {!awaitingConfirmation && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
              </div>

              <OAuthButtons next="/catalogue" />
            </>
          )}

          {!awaitingConfirmation && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Déjà un compte ? <Link href="/login" className="font-bold text-primary hover:underline">Se connecter</Link>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
