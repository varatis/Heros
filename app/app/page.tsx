import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  ShieldCheck,
  Store,
} from "lucide-react";
import { getLibrary, LIVRE_DECOUVERTE, canRead } from "@/lib/library";
import AchievementMedal from "@/components/shared/AchievementMedal";
import Reprendre from "@/components/lonewolf/Reprendre";
import succes from "@/content/catalogue/succes.json";

export const metadata = { title: "HeroBook — Votre prochaine aventure" };
export default async function AccueilPage() {
  const { livres, owned, user, local } = await getLibrary();
  const book = livres.find((l) => l.slug === LIVRE_DECOUVERTE.slug);
  return (
    <main className="page-width space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">
            Le portail des livres dont vous êtes le héros
          </p>
          <h1 className="page-title">
            L’histoire attend{" "}
            <em className="text-primary font-normal">vos choix.</em>
          </h1>
        </div>
        <Link
          href="/catalogue"
          className="text-sm text-muted-foreground inline-flex items-center gap-2 hover:text-primary"
        >
          Ma bibliothèque <ArrowRight size={16} />
        </Link>
      </div>

      <section className="panel overflow-hidden grid md:grid-cols-[1.05fr_1fr]">
        <div className="p-7 lg:p-10 flex flex-col items-start justify-center gap-5">
          <p className="eyebrow flex items-center gap-2">
            <span className="w-5 h-px bg-primary" />À la une · Loup Solitaire 01
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl leading-[1.12]">
            Les Maîtres
            <br />
            des Ténèbres
          </h2>
          <p className="text-muted-foreground leading-7 max-w-md">
            Le monastère Kaï est tombé. Vous êtes le dernier espoir du
            Sommerlund. Prenez la route, choisissez votre destin… et survivez.
          </p>
          <div className="flex gap-3 flex-wrap text-xs text-primary">
            <span className="border border-primary/30 rounded-md px-3 py-1.5">
              Fantasy
            </span>
            <span className="border border-border rounded-md px-3 py-1.5 text-muted-foreground">
              Joe Dever · Livre 1
            </span>
            {book?.is_free && (
              <span className="border border-border rounded-md px-3 py-1.5 text-muted-foreground">
                Accès gratuit
              </span>
            )}
          </div>
          <div className="pt-2 w-full">
            {book && canRead(book, owned) ? (
              <Reprendre />
            ) : (
              <Link href="/shop" className="action-link">
                Découvrir le livre <ArrowRight size={17} />
              </Link>
            )}
          </div>
          <Link
            href="/regles"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Première aventure ? Découvrez les règles.
          </Link>
        </div>
        <figure className="bg-[#101612] flex flex-col justify-center p-5 md:p-7 border-t md:border-t-0 md:border-l border-border">
          <img
            src="/lonewolf/couverture.jpg"
            alt="Illustration actuelle de l’aventure Loup Solitaire"
            className="w-full max-h-[440px] object-contain rounded-lg"
            fetchPriority="high"
          />
          <figcaption className="text-xs text-muted-foreground mt-3 text-center">
            Illustration provisoire · mise en couleur des dessins du livre à
            venir
          </figcaption>
        </figure>
      </section>

      <section
        aria-label="Votre espace d’aventure"
        className="grid sm:grid-cols-3 gap-4"
      >
        {[
          {
            href: "/catalogue",
            icon: BookOpen,
            title: "Votre bibliothèque",
            text: "Les livres accessibles à votre compte, réunis au même endroit.",
          },
          {
            href: "/shop",
            icon: Store,
            title: "La boutique",
            text: "Découvrez les aventures et agrandissez votre collection.",
          },
          {
            href: "/character",
            icon: Compass,
            title: "Votre héros",
            text: "Retrouvez votre feuille d’aventure, vos disciplines et votre équipement.",
          },
        ].map(({ href, icon: Icon, title, text }) => (
          <Link
            key={href}
            href={href}
            className="panel p-6 group hover:border-primary/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-5">
              <Icon className="text-primary" size={23} />
              <ArrowRight
                className="text-muted-foreground group-hover:text-primary"
                size={18}
              />
            </div>
            <h2 className="font-serif text-xl mb-2">{title}</h2>
            <p className="text-muted-foreground text-sm leading-6">{text}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow">Les traces de votre légende</p>
            <h2 className="font-serif text-3xl">
              Des exploits. Des badges. Votre histoire.
            </h2>
          </div>
          <Link
            href="/achievements"
            className="text-primary text-sm inline-flex items-center gap-2"
          >
            Tous les succès <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[succes[0], succes[2], succes[5], succes[8]].map((s) => (
            <Link
              href="/achievements"
              key={s.slug}
              className="panel p-5 flex flex-col items-center text-center gap-3 hover:border-primary/60"
            >
              <AchievementMedal slug={s.slug} />
              <h3 className="font-semibold text-sm">{s.nom}</h3>
              <span className="text-xs text-muted-foreground">
                Badge à collectionner
              </span>
            </Link>
          ))}
        </div>
      </section>

      {!user && (
        <section className="panel p-6 sm:p-8 flex flex-wrap justify-between items-center gap-6">
          <div className="flex gap-4 items-start">
            <ShieldCheck className="text-primary shrink-0" size={28} />
            <div>
              <h2 className="font-serif text-2xl mb-2">
                Un compte, votre propre collection.
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl leading-6">
                Gardez un espace personnel pour vos livres et vos succès. Les
                futurs achats seront associés à votre compte.
              </p>
              {local && (
                <p className="text-xs text-muted-foreground mt-2">
                  Aperçu local : connexion et achats indisponibles tant que le
                  service de comptes n’est pas configuré.
                </p>
              )}
            </div>
          </div>
          <Link href="/register" className="action-link">
            Créer mon compte <ArrowRight size={16} />
          </Link>
        </section>
      )}
      <p className="text-xs text-muted-foreground leading-6">
        Loup Solitaire est une création de Joe Dever. Adaptation jouable en
        cours de vérification avec le livre source.
      </p>
    </main>
  );
}
