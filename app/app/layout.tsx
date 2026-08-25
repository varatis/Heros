import type { Metadata, Viewport } from "next";
import { Figtree, Newsreader } from "next/font/google";
import "./globals.css";

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#101816",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "HeroBook — Livres dont vous êtes le héros",
    template: "%s | HeroBook",
  },
  description:
    "Plongez dans des aventures interactives à choix multiples. Incarnez un héros, faites des choix, vivez des histoires uniques.",
  keywords: ["gamebook", "livre interactif", "aventure", "fantasy", "choix"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`dark ${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground app-ambient-bg font-sans"
      >
        {children}
      </body>
    </html>
  );
}
