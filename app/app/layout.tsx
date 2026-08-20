import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#151022",
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
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground app-ambient-bg"
      >
        {children}
      </body>
    </html>
  );
}
