import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { redirect } from "next/navigation";
import BottomNav from "@/components/shared/BottomNav";
import TopBar from "@/components/shared/TopBar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sans Supabase configuré, l'application reste utilisable en mode local :
  // on n'instancie aucun client et on n'impose pas de connexion.
  const supabase = supabaseConfigured ? await createClient() : null;

  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  if (!user && supabaseConfigured) redirect("/login");

  let wallet: { gems: number | null; coins: number | null } | null = null;
  let profile: {
    username: string | null;
    avatar_url: string | null;
    streak_days: number | null;
  } | null = null;

  if (supabase && user) {
    const { data: w } = await supabase
      .from("wallets")
      .select("gems, coins")
      .eq("user_id", user.id)
      .single();
    wallet = w;

    const { data: p } = await supabase
      .from("profiles")
      .select("username, avatar_url, streak_days")
      .eq("id", user.id)
      .single();
    profile = p;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        gems={wallet?.gems ?? 0}
        username={profile?.username ?? "Loup Solitaire"}
        streakDays={profile?.streak_days ?? 0}
      />
      <main className="flex-1 pb-20">
        {!supabaseConfigured && (
          <div className="max-w-3xl mx-auto px-4 pt-3">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-[11px] text-amber-300">
              Mode local : Supabase n&apos;est pas configuré. Le jeu et la Feuille
              d&apos;Aventure fonctionnent ; la boutique, les succès en ligne et le
              profil nécessitent la base (voir les migrations 004 et 005).
            </div>
          </div>
        )}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
