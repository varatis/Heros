import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.herobook.app",
  appName: "HeroBook",
  webDir: "out",
  server: {
    androidScheme: "https",
    // ─────────────────────────────────────────────────────────────
    // MODE 1 — Hébergé (recommandé pour un premier APK sans refactor)
    // L'app Next.js actuelle est en SSR + auth par cookies (compatible
    // avec une webview Capacitor). Décommente `url` et pointe vers ton
    // déploiement Vercel une fois en ligne :
    //
    //   url: "https://ton-domaine.vercel.app",
    //
    // Dans ce mode, `webDir`/`out` n'est pas utilisé au runtime : la
    // webview charge directement l'URL. `npx cap sync` reste utile pour
    // régénérer le projet Android natif.
    //
    // MODE 2 — Bundle statique (offline-first)
    // Implique de migrer l'auth vers une SPA Supabase (PKCE + deep link)
    // et de produire un export statique dans `out/`. Décision repoussée
    // (voir docs/MOBILE.md).
    // ─────────────────────────────────────────────────────────────
    cleartext: true, // autorise le http en dev local (Live Reload sur WiFi)
  },
  plugins: {
    StatusBar: {
      backgroundColor: "#110e1b",
      style: "DARK",
    },
  },
};

export default config;

