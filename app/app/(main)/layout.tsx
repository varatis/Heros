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
        username={profile?.username ?? "Héros"}
        streakDays={profile?.streak_days ?? 0}
        isGuest={isAnonymousUser(user)}
      />
      <main className="flex-1 pb-28 pt-3 sm:pt-5">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
