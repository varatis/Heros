import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gem, Lock, Check } from "lucide-react";
import { supabaseConfigured } from "@/lib/supabase/config";
import SupabaseRequis from "@/components/shared/SupabaseRequis";

export const metadata = {
  title: "Succès Loup Solitaire",
};

interface SuccesLigne {
  slug: string;
  nom: string;
  description: string | null;
  emoji: string | null;
  gemmes: number | null;
}

export default async function AchievementsPage() {
  if (!supabaseConfigured) {
    return <SupabaseRequis titre="Succès Loup Solitaire" />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Les tables de Loup Solitaire (lw_succes, lw_succes_utilisateur) ne sont pas
  // encore dans les types générés par Supabase : on passe par une lecture
  // souple, régénérable plus tard avec
  //   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const { data: succes } = (await db
    .from("lw_succes")
    .select("slug, nom, description, emoji, gemmes")
    .order("condition_value")) as { data: SuccesLigne[] | null };

  const { data: debloques } = (await db
    .from("lw_succes_utilisateur")
    .select("succes_slug")
    .eq("user_id", user.id)) as { data: { succes_slug: string }[] | null };

  const debloquesSet = new Set((debloques ?? []).map((d) => d.succes_slug));
  const liste = succes ?? [];
  const total = liste.length;
  const faits = liste.filter((s) => debloquesSet.has(s.slug)).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <header className="space-y-2">
        <Badge
          variant="outline"
          className="border-[--hero-gold]/40 text-[--hero-gold] bg-[--hero-gold]/10 text-[10px] font-black uppercase tracking-widest"
        >
          <Trophy className="w-3 h-3 mr-1" />
          Succès
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Votre <span className="gradient-hero">légende</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {faits} succès débloqué(s) sur {total}. Chaque succès rapporte des gemmes.
        </p>
        <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-[--hero-gold] transition-all"
            style={{ width: total ? `${(faits / total) * 100}%` : "0%" }}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {liste.map((s) => {
          const obtenu = debloquesSet.has(s.slug);
          return (
            <div
              key={s.slug}
              className={`glass-card rounded-2xl p-4 space-y-2 ${
                obtenu ? "border-[--hero-gold]/40" : "opacity-70"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.emoji ?? "🏅"}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{s.nom}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.description}
                  </div>
                </div>
                {obtenu ? (
                  <span className="w-6 h-6 rounded-full bg-[--hero-emerald]/20 text-[--hero-emerald] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-muted/50 text-muted-foreground flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>
              {(s.gemmes ?? 0) > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
                  <Gem className="w-3 h-3" />+{s.gemmes} gemmes
                </div>
              )}
            </div>
          );
        })}
      </div>

      {liste.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun succès en base : exécute la migration 005 pour installer les succès
          de Loup Solitaire.
        </p>
      )}
    </div>
  );
}
