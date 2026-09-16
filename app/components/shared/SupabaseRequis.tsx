import Link from "next/link";
import { ShieldCheck } from "lucide-react";
export default function SupabaseRequis({ titre }: { titre: string }) {
  return (
    <main className="page-width">
      <section className="panel max-w-xl mx-auto p-8 space-y-5">
        <ShieldCheck className="text-primary" size={32} />
        <p className="eyebrow">Votre espace personnel</p>
        <h1 className="page-title">{titre}</h1>
        <p className="text-muted-foreground leading-7">
          Le service de comptes n’est pas configuré dans cet aperçu. La
          connexion et la création de compte restent disponibles sur les
          environnements reliés à Supabase.
        </p>
        <p className="text-sm text-muted-foreground leading-6">
          Vous pouvez explorer la bibliothèque, la boutique et les badges sans
          créer de compte. Aucun achat ni succès en ligne ne sera enregistré
          dans cet aperçu.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/catalogue" className="action-link">
            Voir la bibliothèque
          </Link>
          <Link href="/" className="action-link action-secondary">
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
