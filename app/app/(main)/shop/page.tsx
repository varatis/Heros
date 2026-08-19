import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gem, Sparkles, Zap, Shield, Heart, Store, Check, Star } from "lucide-react";
import ShopClient from "@/components/shop/ShopClient";

export default async function ShopPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Récupérer le solde actuel de l'utilisateur
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Récupérer les packs de gemmes disponibles
  const { data: gemPacks } = await supabase
    .from("gem_packs")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  // Récupérer les objets de la boutique
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("is_available", true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header boutique */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-purple-900/30 via-background to-amber-900/30 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" /> Échoppe de l&apos;Aventurier
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Boutique Magique
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Faites le plein de gemmes, potions et reliques pour vos futures expéditions.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/80 border border-primary/30 shadow-md">
            <Gem className="w-5 h-5 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold">Votre Solde</div>
              <div className="text-lg font-black text-primary">
                {wallet?.gems?.toLocaleString("fr-FR") || 0} 💎
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Composant interactif pour les achats de packs et objets */}
      <ShopClient
        gemPacks={gemPacks || []}
        items={items || []}
        currentGems={wallet?.gems || 0}
      />
    </div>
  );
}
