import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteShell from "@/components/shared/SiteShell";

// Fonts: Google Fonts (Figtree/Newsreader) — fallback offline-safe
// En dev/online Next charge les vraies fonts ; en offline (CI/sandbox) on fallback sur system-ui
let figtree: { variable: string } = { variable: "" };
let newsreader: { variable: string } = { variable: "" };
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const g = require("next/font/google");
  figtree = g.Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
  newsreader = g.Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", style: ["normal", "italic"] });
} catch {
  // offline: keep CSS variables empty → globals.css fallback sur system-ui
}

export const viewport: Viewport = {
  themeColor: "#141b19",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Loup Solitaire — Les Maîtres des Ténèbres",
    template: "%s | HeroBook",
  },
  description:
    "Jouez le livre 1 de Loup Solitaire : Les Maîtres des Ténèbres. Habileté, Endurance, Disciplines Kaï et Table de Hasard, dans une adaptation jouable du livre-jeu.",
  keywords: [
    "loup solitaire",
    "livre dont vous êtes le héros",
    "gamebook",
    "kaï",
    "joe dever",
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`dark ${figtree.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground"
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
