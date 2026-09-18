import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteShell from "@/components/shared/SiteShell";

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
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground"
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
