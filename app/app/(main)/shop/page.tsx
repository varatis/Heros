import Link from "next/link";
import { ShieldCheck, Gem, BookOpen } from "lucide-react";
import { getLibrary, getAccount } from "@/lib/library";
import BookCard from "@/components/shared/BookCard";
import ShopClient from "@/components/shop/ShopClient";

export const metadata = { title: "Boutique" };
export default async function ShopPage() {
  const { livres, owned, user, local, error } = await getLibrary();
  const { supabase } = await getAccount();
  const [packs, items, wallet] = supabase
    ? await Promise.all([
        supabase
          .from("gem_packs")
          .select("*")
          .eq("is_available", true)
          .order("sort_order"),
        supabase.from("items").select("*").eq("is_available", true),
        user
          ? supabase
              .from("wallets")
              .select("gems")
              .eq("user_id", user.id)
              .maybeSingle()
          : Promise.resolve(null),
      ])
    : [null, null, null];
  return (
    <main className="page-width space-y-9">
      <header className="flex flex-wrap justify-between items-end gap-5">
        <div className="space-y-3">
          <p className="eyebrow">Une nouvelle histoire à chaque livre</p>
          <h1 className="page-title">La boutique des aventures</h1>
          <p className="text-muted-foreground leading-7">
            Choisissez votre prochain voyage dans le Magnamund.
          </p>
        </div>
        {user && (
          <div className="panel px-5 py-4 flex gap-3 items-center">
            <Gem className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Votre solde</p>
              <p className="font-semibold">{wallet?.data?.gems ?? 0} gemmes</p>
            </div>
          </div>
        )}
      </header>
      <div className="flex gap-3 items-start rounded-xl border border-primary/30 bg-primary/5 p-5">
        <ShieldCheck size={21} className="text-primary shrink-0 mt-0.5" />
        <p className="text-sm leading-6 text-muted-foreground">
          Les livres gratuits sont accessibles dès maintenant. Les achats
          payants ne sont pas encore ouverts : aucun paiement ni débit de gemmes
          n’est effectué. Les futurs livres achetés seront rattachés à votre
          compte.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          Le catalogue ou vos accès n’ont pas pu être chargés complètement.
          Réessayez plus tard.
        </p>
      )}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl flex items-center gap-3">
          <BookOpen size={22} className="text-primary" />
          Les livres
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {livres.map((livre) => (
            <BookCard key={livre.slug} livre={livre} owned={owned} shop />
          ))}
        </div>
        {!livres.length && (
          <p className="panel p-8 text-muted-foreground">
            Aucun livre disponible pour le moment.
          </p>
        )}
      </section>
      <ShopClient
        gemPacks={packs?.data ?? []}
        items={items?.data ?? []}
        preview={local}
      />
      {(packs?.error || items?.error || wallet?.error) && (
        <p role="alert" className="text-destructive text-sm">
          Une partie de la boutique n’a pas pu être chargée.
        </p>
      )}
      {!user && (
        <div className="panel p-6 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-muted-foreground text-sm">
            Un compte personnel pour retrouver votre collection et vos futurs
            achats.
          </p>
          <Link href="/login" className="action-link action-secondary">
            Se connecter
          </Link>
        </div>
      )}
    </main>
  );
}
