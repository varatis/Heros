import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import CharacterProfileView from "@/components/lonewolf/CharacterProfileView";

export const metadata = {
  title: "Mon héros & Marque-page",
  description: "Consultez votre identité de héros, votre marque-page et votre feuille d'aventure.",
};

export default async function CharacterPage() {
  let profile = null;
  let wallet = null;
  let fins: any[] = [];

  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const [profileRes, walletRes, finsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
          supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle(),
          (supabase as any).from("lw_fins").select("fin_key, nom, type").eq("user_id", user.id),
        ]);
        profile = profileRes.data;
        wallet = walletRes.data;
        fins = finsRes.data ?? [];
      }
    } catch {
      // mode local par défaut
    }
  }

  return (
    <main className="page-width py-6 max-w-4xl">
      <CharacterProfileView
        serverProfile={profile}
        serverWallet={wallet}
        serverFins={fins}
      />
    </main>
  );
}
