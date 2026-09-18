import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.herobook.app",
  appName: "HeroBook",
  webDir: "out",
  server: {
    androidScheme: "https",
    // En développement local sur réseau WiFi, tu pourras décommenter cette ligne pour faire du Live Reload direct sur ton smartphone :
    // url: "http://192.168.1.12:3000",
    cleartext: true,
  },
  plugins: {
    StatusBar: {
      backgroundColor: "#110e1b",
      style: "DARK",
    },
  },
};

export default config;
