import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FeuilleJoueur from "@/components/lonewolf/FeuilleJoueur";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Gem, Flame, ScrollText, BookOpen, Sparkles } from "lucide-react";

export const metadata = {
  title: "Mon héros",
};

export default async function CharacterPage() {
  if (!supabaseConfigured) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-black tracking-tight">Mon héros</h1>
        <FeuilleJoueur />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Tables Loup Solitaire : pas encore dans les types générés par Supabase,
  // on les interroge via un client souple (régénérable avec la CLI Supabase).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const { data: sauvegarde } = await db
    .from("lw_sauvegardes")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: fins } = (await db
    .from("lw_fins")
    .select("fin_key, nom, type")
    .eq("user_id", user.id)) as {
    data: { fin_key: string; nom: string | null; type: string | null }[] | null;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Carte d'identité */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/80 to-background p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-4xl shadow-inner glow-purple shrink-0">
            🐺
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black tracking-tight">
                {profile?.username || "Loup Solitaire"}
              </h1>
              <Badge className="bg-[--hero-gold]/20 text-[--hero-gold] border-[--hero-gold]/30 text-[11px] font-bold">
                Seigneur Kaï
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Dernier survivant du monastère de la Montagne de Kai · Sommerlund
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <Gem className="w-3.5 h-3.5" />
                <span>{wallet?.gems || 0} Gemmes</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{profile?.streak_days || 0} jours d&apos;assiduité</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[--hero-emerald]/10 border border-[--hero-emerald]/25 text-[--hero-emerald] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{fins?.length || 0} fin(s) découverte(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feuille d'Aventure locale */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-primary" />
            Feuille d&apos;Aventure
          </h2>
          <Link href="/regles">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              Règles
            </Button>
          </Link>
        </div>
        <FeuilleJoueur />
      </section>

      {/* Fins découvertes côté serveur */}
      {fins && fins.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-black tracking-tight">
            Fins enregistrées
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {fins.map((f) => (
              <span
                key={f.fin_key}
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  f.type === "victoire"
                    ? "bg-[--hero-gold]/15 border-[--hero-gold]/40 text-[--hero-gold]"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}
              >
                {f.type === "victoire" ? "🏆" : "💀"} {f.nom ?? f.fin_key}
              </span>
            ))}
          </div>
        </section>
      )}

      {sauvegarde && (
        <p className="text-[11px] text-muted-foreground">
          Sauvegarde serveur : paragraphe {sauvegarde.paragraphe} · Habileté{" "}
          {sauvegarde.habilete} · Endurance {sauvegarde.endurance}/
          {sauvegarde.endurance_max} ·{" "}
          {sauvegarde.paragraphes_visites} paragraphes explorés.
        </p>
      )}
    </div>
  );
}
