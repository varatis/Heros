"use client";

import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Client Supabase pour le navigateur (web) et l'app native Capacitor.
 *
 * Adaptations mobile :
 *  - Détection de Capacitor (Android/iOS) via window.Capacitor.
 *  - En environnement natif, la session est persistée dans localStorage
 *    (plus fiable que les cookies dans le WebView Capacitor).
 *  - Le redirectTo OAuth utilise le schéma d'URL personnalisé
 *    `com.herobook.app://auth-callback` quand on est sur mobile natif,
 *    sinon `window.location.origin` (web/PWA).
 */

function isNativePlatform(): boolean {
  if (!isBrowser()) return false;
  const w = window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
  };
  return Boolean(w.Capacitor?.isNativePlatform?.());
}

export function getAuthRedirectUrl(): string {
  if (!isBrowser()) return "/";
  if (isNativePlatform()) {
    // Correspond à capacitor.config.ts (ios.scheme + Android intent-filter).
    return "com.herobook.app://auth-callback";
  }
  return window.location.origin;
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Mode preview/démo sans Supabase — on renvoie un client minimal qui
    // ne lancera pas d'exception. Les composants doivent vérifier
    // `supabaseConfigured` avant d'utiliser les méthodes d'auth.
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithPassword: async () => ({ error: null, data: null }),
        signUp: async () => ({ error: null, data: null }),
        signInWithOAuth: async () => ({ error: null }),
        signInWithOtp: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ error: null }),
        signOut: async () => {},
        signInAnonymously: async () => ({ data: { user: null }, error: null }),
        linkIdentity: async () => ({ error: null }),
        updateUser: async () => ({ data: { user: null }, error: null }),
        exchangeCodeForSession: async () => ({ error: null }),
        rpc: async () => ({ error: null, data: null }),
        from: () => ({
          select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), limit: () => ({ data: null, error: null }) }) }),
          update: () => ({ eq: async () => ({ error: null }) }),
          insert: () => ({ select: () => ({ data: null, error: null }) }),
        } as any),
      },
      functions: { invoke: async () => ({ data: null, error: null }) },
      rpc: async () => ({ data: null, error: null }),
      from: () => ({ select: () => ({ eq: () => ({ data: null, error: null }) }) } as any),
    } as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }
  return createBrowserClient<Database>(
    url,
    key,
    {
      global: {
        headers: {
          "X-Client-Info": isNativePlatform() ? "herobook/native" : "herobook/web",
        },
      },
      cookies: {
        get(name) {
          if (!isBrowser()) return "";
          if (isNativePlatform()) {
            return window.localStorage.getItem(`sb:${name}`) ?? "";
          }
          // `parse` (paquet `cookie`) retourne un objet { nom: valeur }
          // déjà URI-décodé — surtout pas un tableau.
          const cookies = parse(document.cookie) as unknown as Record<
            string,
            string | undefined
          >;
          const value = cookies?.[name];
          return typeof value === "string" ? value : "";
        },
        set(name, value, options) {
          if (!isBrowser()) return;
          if (isNativePlatform()) {
            window.localStorage.setItem(`sb:${name}`, value);
            return;
          }
          let cookie = `${name}=${encodeURIComponent(value)}; Path=${options?.path ?? "/"}; SameSite=Lax`;
          if (options?.domain) cookie += `; Domain=${options.domain}`;
          if (options?.secure) cookie += "; Secure";
          if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
          document.cookie = cookie;
        },
        remove(name, options) {
          if (!isBrowser()) return;
          if (isNativePlatform()) {
            window.localStorage.removeItem(`sb:${name}`);
            return;
          }
          document.cookie = `${name}=; Path=${options?.path ?? "/"}; Max-Age=0; SameSite=Lax`;
        },
      },
      auth: {
        // Redirection par défaut pour les flux OAuth / Magic Link.
        // Les composants peuvent surcharger via options.redirectTo.
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  );
}
