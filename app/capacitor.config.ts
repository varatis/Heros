import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.herobook.app",
  appName: "HeroBook",
  webDir: "out",
  server: {
    androidScheme: "https",
    // En développement local sur réseau WiFi, décommenter cette ligne
    // pour faire du Live Reload direct sur smartphone :
    // url: "http://192.168.1.12:3000",
    cleartext: true,
  },
  plugins: {
    StatusBar: {
      backgroundColor: "#110e1b",
      style: "DARK",
    },
    // Deep-link / retours OAuth : permet à l'app de rouvrir HeroBook
    // lorsque Supabase / Apple / Google renvoient vers com.herobook.app://
    // (utilisé dans la variable redirectTo du client Supabase).
    App: {
      launchUrl: "com.herobook.app://auth-callback",
    },
  },
  ios: {
    // Nécessaire pour que les SFSafariViewController utilisés par
    // Supabase Auth puissent revenir dans l'app.
    scheme: "com.herobook.app",
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
