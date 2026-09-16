import Link from "next/link";
import { Library, ArrowRight } from "lucide-react";
import { getLibrary, canRead } from "@/lib/library";
import BookCard from "@/components/shared/BookCard";

export const metadata = { title: "Ma bibliothèque" };
export default async function CataloguePage() {
  const { livres, owned, user, local, error } = await getLibrary();
  const available = livres.filter((livre) => canRead(livre, owned));
  return (
    <main className="page-width space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">Votre collection</p>
        <h1 className="page-title">Ma bibliothèque</h1>
        <p className="text-muted-foreground">
          Vos livres gratuits et les aventures débloquées pour votre compte.
        </p>
      </header>
      {(!user || local) && (
        <div className="panel p-5 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Vous découvrez les livres gratuits. Connectez-vous pour retrouver
            votre collection personnelle.
          </p>
          <Link href="/login" className="text-primary text-sm font-semibold">
            Se connecter →
          </Link>
        </div>
      )}
      {error && (
        <p role="alert" className="text-destructive">
          La collection n’a pas pu être chargée complètement. Aucun accès payant
          n’a été présumé.
        </p>
      )}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Library size={18} />
        {available.length} livre(s) accessible(s)
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {available.map((livre) => (
          <BookCard key={livre.slug} livre={livre} owned={owned} />
        ))}
      </div>
      {!available.length && (
        <p className="panel p-8">
          Votre bibliothèque est encore vide. Découvrez les livres en boutique.
        </p>
      )}
      <Link className="action-link action-secondary" href="/shop">
        Explorer la boutique <ArrowRight size={16} />
      </Link>
    </main>
  );
}
