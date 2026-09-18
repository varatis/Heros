import { getAccount } from "@/lib/library";
import ShopClient from "@/components/shop/ShopClient";

export const metadata = {
  title: "Boutique des Aventures",
  description: "Découvrez les 19 bibliothèques LDVELH et procurez-vous vos futurs tomes de légende.",
};

export default async function ShopPage() {
  const { user, supabase } = await getAccount();

  let gemPacks: any[] = [];
  let items: any[] = [];
  let userGems = 250;

  if (supabase && user) {
    try {
      const [packsRes, itemsRes, walletRes] = await Promise.all([
        supabase
          .from("gem_packs")
          .select("*")
          .eq("is_available", true)
          .order("sort_order"),
        supabase.from("items").select("*").eq("is_available", true),
        supabase
          .from("wallets")
          .select("gems")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      if (packsRes.data?.length) gemPacks = packsRes.data;
      if (itemsRes.data?.length) items = itemsRes.data;
      if (walletRes.data?.gems != null) userGems = walletRes.data.gems;
    } catch {
      // mode local par défaut
    }
  }

  return (
    <main className="page-width py-6">
      <ShopClient
        gemPacks={gemPacks}
        items={items}
        initialGems={userGems}
      />
    </main>
  );
}
