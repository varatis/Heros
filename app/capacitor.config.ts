import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.herobook.app",
  appName: "HeroBook",
  webDir: "out",
  server: {
    androidScheme: "https",
    // ─────────────────────────────────────────────────────────────
    // MODE A — Hébergé (actif) ✅
    // La webview Capacitor charge directement l'app déployée sur Vercel.
    // L'app Next.js est en SSR + auth par cookies, compatible avec une
    // webview Capacitor : aucune migration auth nécessaire.
    //
    // Domaine de production : https://heros-jade.vercel.app
    // (Vercel · projet varatis-projects/heros · branche main)
    //
    // NB : dans ce mode, `webDir`/`out` n'est pas utilisé au runtime ;
    // `npx cap sync` sert uniquement à régénérer le projet Android natif.
    //
    // Pour le Live Reload dev sur WiFi, remplacer temporairement par :
    //   url: "http://192.168.X.X:3000",
    // (cleartext:true ci-dessous autorise le http en dev).
    //
    // MODE B — Bundle statique (offline-first) — NON utilisé pour l'instant
    // Implique de migrer l'auth vers une SPA Supabase (PKCE + deep link)
    // et de produire un export statique dans `out/`. Décision repoussée
    // (voir docs/MOBILE.md).
    // ─────────────────────────────────────────────────────────────
    url: "https://heros-jade.vercel.app",
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

