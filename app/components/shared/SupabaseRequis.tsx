import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database, Play, BookOpen } from "lucide-react";

/**
 * Écran affiché par les pages « compte » lorsque Supabase n'est pas configuré.
 * Le jeu, lui, reste entièrement jouable hors-ligne.
 */
export default function SupabaseRequis({ titre }: { titre: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-black tracking-tight">{titre}</h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cette page a besoin de la base Supabase (comptes, gemmes, succès en
          ligne). Le projet n&apos;a pas encore ses variables d&apos;environnement
          <code className="mx-1 px-1.5 py-0.5 rounded bg-muted/60 text-[11px]">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          et
          <code className="mx-1 px-1.5 py-0.5 rounded bg-muted/60 text-[11px]">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          dans <code className="text-[11px]">app/.env.local</code>.
        </p>
        <div className="rounded-xl bg-muted/40 border border-border/60 p-3 text-xs space-y-1">
          <div className="font-bold">Pour activer cette page :</div>
          <div className="text-muted-foreground">
            1. Crée (ou ouvre) ton projet sur supabase.com.
          </div>
          <div className="text-muted-foreground">
            2. Exécute les migrations <code>004</code> puis <code>005</code> dans le
            SQL Editor.
          </div>
          <div className="text-muted-foreground">
            3. Copie l&apos;URL du projet et la clé <em>anon</em> dans{" "}
            <code>app/.env.local</code>, puis redémarre l&apos;application.
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/jouer" className="flex-1">
            <Button className="w-full gap-2 font-bold glow-purple">
              <Play className="w-4 h-4 fill-current" />
              Jouer l&apos;aventure (hors-ligne)
            </Button>
          </Link>
          <Link href="/regles" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <BookOpen className="w-4 h-4" />
              Lire les règles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
