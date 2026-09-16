import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole, Check } from "lucide-react";
import { canRead, playable, type Livre } from "@/lib/library";

export default function BookCard({
  livre,
  owned,
  shop = false,
}: {
  livre: Livre;
  owned: string[];
  shop?: boolean;
}) {
  const access = canRead(livre, owned);
  return (
    <article className="panel overflow-hidden flex flex-col sm:flex-row">
      <div className="sm:w-2/5 bg-[#101612] p-5 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border">
        {livre.illustration ? (
          <img
            src={livre.illustration}
            alt={`Illustration de ${livre.titre}`}
            className="w-full max-h-72 object-contain rounded-lg"
          />
        ) : (
          <BookOpen size={72} className="text-primary my-14" />
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col items-start gap-4">
        <p className="eyebrow">
          Loup Solitaire · Livre {String(livre.numero).padStart(2, "0")}
        </p>
        <h2 className="font-serif text-2xl">{livre.titre}</h2>
        <p className="text-muted-foreground text-sm leading-7">
          {livre.resume}
        </p>
        <p className="inline-flex gap-2 items-center text-sm text-primary">
          {access ? <Check size={16} /> : <LockKeyhole size={16} />}{" "}
          {owned.includes(livre.slug)
            ? "Dans votre collection"
            : livre.is_free
              ? "Accès gratuit"
              : livre.price_gems
                ? `${livre.price_gems} gemmes · Livre payant`
                : "Livre payant"}
        </p>
        <div className="mt-auto pt-2">
          {access && playable(livre) ? (
            <Link href="/jouer" className="action-link">
              Lire l’aventure <ArrowRight size={16} />
            </Link>
          ) : !shop ? (
            <Link href="/shop" className="action-link action-secondary">
              Voir en boutique <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              disabled
              className="action-link action-secondary opacity-70"
            >
              {access ? "Adaptation à venir" : "Achats bientôt disponibles"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
