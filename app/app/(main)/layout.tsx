import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BottomNav from "@/components/shared/BottomNav";
import TopBar from "@/components/shared/TopBar";
import { isAnonymousUser } from "@/lib/auth/guest";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Auto-réparation : si ce compte n'a pas de profil/wallet en base
  // (anciens invités créés avant le trigger, lignes purgées...), la RPC
  // SECURITY DEFINER les (re)crée. Idempotente et silencieuse.
  try {
    await supabase.rpc("ensure_profile_and_wallet");
  } catch {
    // Migration 016 pas encore déployée → on continue (dégradation douce).
  }

  // Récupérer le wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("gems, coins")
    .eq("user_id", user.id)
    .single();

  // Récupérer le profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, streak_days")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        gems={wallet?.gems ?? 0}
        username={profile?.username ?? "Lecteur"}
        streakDays={profile?.streak_days ?? 0}
        isGuest={isAnonymousUser(user)}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <main className="flex-1 pb-28 pt-3 sm:pt-5">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
