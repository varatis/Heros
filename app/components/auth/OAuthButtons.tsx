"use client";

import { useEffect, useState } from "react";
import { createClient, getAuthRedirectUrl } from "@/lib/supabase/client";
import { isAnonymousUser } from "@/lib/auth/guest";
import type { Provider } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Icônes de marque (composants SVG inline, pas de dépendance externe) */
/* ------------------------------------------------------------------ */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.45 1.8 14.97.72 12 .72 7.34.72 3.36 3.4 1.44 7.3l3.66 2.84C6.05 7.32 8.79 5.04 12 5.04z" />
      <path fill="#4285F4" d="M23.28 12.25c0-.85-.08-1.67-.22-2.46H12v4.64h6.34a5.42 5.42 0 0 1-2.35 3.56v2.96h3.8c2.23-2.05 3.49-5.07 3.49-8.7z" />
      <path fill="#FBBC05" d="M5.64 14.22a6.45 6.45 0 0 1 0-4.12L1.98 7.26a10.8 10.8 0 0 0 0 9.8l3.66-2.84z" />
      <path fill="#34A853" d="M12 23.28c3.04 0 5.59-1 7.46-2.72l-3.8-2.96c-1.06.71-2.4 1.13-3.66 1.13-3.21 0-5.95-2.28-6.66-5.2l-3.66 2.84c1.92 3.9 5.9 6.58 10.32 6.58z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Liste des fournisseurs — ordre mobile-first : Apple, Google d'abord */
/* ------------------------------------------------------------------ */

type ProviderInfo = {
  id: Provider;
  label: string;
  Icon: () => React.JSX.Element;
  /** Priorité d'affichage : 0 = en haut, pleine largeur (Apple/Google) */
  priority: number;
};

const ALL_PROVIDERS: ProviderInfo[] = [
  { id: "apple", label: "Apple", Icon: AppleIcon, priority: 0 },
  { id: "google", label: "Google", Icon: GoogleIcon, priority: 0 },
  { id: "azure", label: "Microsoft", Icon: MicrosoftIcon, priority: 1 },
  { id: "github", label: "GitHub", Icon: GitHubIcon, priority: 1 },
];

const DEFAULT_ENABLED = "google,apple,azure,github";

/* ------------------------------------------------------------------ */
/* Composant                                                           */
/* ------------------------------------------------------------------ */

type OAuthButtonsProps = {
  next?: string;
  /** Mode d'authentification (adaptation du label). */
  mode?: "signin" | "signup";
  /** Affichage compact (icônes uniquement), pour une nav par exemple. */
  compact?: boolean;
};

/**
 * Boutons de connexion OAuth (mobile-first) :
 *  - Apple et Google en PREMIER, pleine largeur, comme sur Play Store / App Store.
 *  - Microsoft / GitHub dans une seconde grille.
 *  - Si une session invité est active, le clic LIE le provider à l'invité
 *    (même UUID, mêmes gemmes) grâce à `linkIdentity`.
 *  - Gestion claire des erreurs (provider non activé, annulation…).
 */
export default function OAuthButtons({
  next = "/catalogue",
  mode = "signin",
  compact = false,
}: OAuthButtonsProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const enabled = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || DEFAULT_ENABLED)
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const providers = ALL_PROVIDERS.filter((p) => enabled.includes(p.id)).sort(
    (a, b) => a.priority - b.priority,
  );

  const primary = providers.filter((p) => p.priority === 0);
  const secondary = providers.filter((p) => p.priority > 0);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setIsGuest(isAnonymousUser(user));
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!cancelled) setIsGuest(isAnonymousUser(session?.user));
    });
    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  async function handleOAuth(provider: Provider) {
    setLoading(provider);
    setError(null);

    const base = getAuthRedirectUrl();
    const redirectTo =
      base === "com.herobook.app://auth-callback"
        ? `${base}?next=${encodeURIComponent(next)}${isGuest ? "&guest_upgrade=1" : ""}`
        : `${base}/auth/callback?next=${encodeURIComponent(next)}${isGuest ? "&guest_upgrade=1" : ""}`;

    try {
      let oauthError;
      if (isGuest) {
        // Mise à niveau invité → liaison d'identité (conserve UUID + wallet).
        const { error } = await supabase.auth.linkIdentity({
          provider,
          options: { redirectTo },
        } as any);
        oauthError = error;
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo },
        });
        oauthError = error;
      }
      if (oauthError) {
        setError(friendlyProviderError(provider, oauthError.message));
        setLoading(null);
      }
    } catch (err: any) {
      setError(friendlyProviderError(provider, err?.message ?? "Erreur"));
      setLoading(null);
    }
  }

  if (providers.length === 0) return null;

  if (compact) {
    return (
      <div className="flex gap-2">
        {providers.map(({ id, Icon, label }) => (
          <Button
            key={id}
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleOAuth(id)}
            disabled={loading !== null}
            title={label}
            aria-label={label}
            className="rounded-full"
          >
            {loading === id ? <Loader2 className="size-4 animate-spin" /> : <Icon />}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {isGuest && (
        <p className="text-center text-[11px] leading-4 text-emerald-300">
          <ShieldCheck className="mr-1 inline size-3.5" />
          Votre progression invité sera conservée sur ce compte.
        </p>
      )}

      {/* Providers prioritaires : pleine largeur */}
      <div className="space-y-2">
        {primary.map(({ id, label, Icon }) => (
          <Button
            key={id}
            type="button"
            variant="outline"
            onClick={() => handleOAuth(id)}
            disabled={loading !== null}
            className="h-12 w-full gap-3 rounded-2xl border-white/15 bg-[#121c17]/70 text-foreground hover:bg-[#121c17] font-semibold text-sm"
          >
            {loading === id ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Icon />
            )}
            Continuer avec {label}
          </Button>
        ))}
      </div>

      {secondary.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {secondary.map(({ id, label, Icon }) => (
            <Button
              key={id}
              type="button"
              variant="outline"
              onClick={() => handleOAuth(id)}
              disabled={loading !== null}
              className="h-11 gap-2 rounded-2xl border-white/15 bg-[#121c17]/50 text-foreground/90 hover:bg-[#121c17] font-medium text-xs"
            >
              {loading === id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Icon />
              )}
              {label}
            </Button>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-semibold leading-5 text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}

function friendlyProviderError(provider: Provider, message: string): string {
  const m = message.toLowerCase();
  if (m.includes("provider") || m.includes("unsupported"))
    return `La connexion ${provider} n'est pas encore activée sur ce projet.`;
  if (m.includes("already linked") || m.includes("identity already"))
    return "Ce compte social est déjà lié à un autre compte HeroBook.";
  if (m.includes("access_denied") || m.includes("cancelled"))
    return "Connexion annulée.";
  return message;
}
