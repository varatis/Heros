import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#6d28d9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Loup Solitaire — Les Maîtres des Ténèbres",
    template: "%s | Loup Solitaire",
  },
  description:
    "Jouez le livre 1 de Loup Solitaire : Les Maîtres des Ténèbres. Habileté, Endurance, Disciplines Kaï et Table de Hasard, exactement comme dans le livre-jeu.",
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
        {children}
      </body>
    </html>
  );
}
