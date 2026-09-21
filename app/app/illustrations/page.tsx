import Link from "next/link";
import { ArrowLeft, ImageIcon, Swords, BookOpen } from "lucide-react";
import {
  SCENE_ILLUSTRATIONS,
  HERO_PORTRAIT,
  ENEMY_PORTRAITS,
} from "@/content/lonewolf/ls01/illustrations";
import extracts from "@/content/lonewolf/ls01/pdf-extractions.json";
import { LS01_SECTIONS } from "@/content/lonewolf/ls01";
import CombatPortrait from "@/components/lonewolf/CombatPortrait";

export const metadata = { title: "Illustrations du PDF & bestiaire" };

export default function IllustrationsPage() {
  const fighters = [HERO_PORTRAIT, ...Object.values(ENEMY_PORTRAITS)];
  const pending = fighters.filter((fighter) => !fighter.src);
  return (
    <main className="page-width space-y-10">
      <header className="space-y-4">
        <Link
          href="/catalogue"
          className="text-sm text-primary inline-flex gap-2 items-center"
        >
          <ArrowLeft size={16} />
          La bibliothèque
        </Link>
        <p className="eyebrow">Loup Solitaire · Les Maîtres des Ténèbres</p>
        <h1 className="page-title">L’encre du livre, la couleur en plus.</h1>
        <p className="text-muted-foreground max-w-3xl leading-7">
          Les dessins du PDF fourni remplacent les anciennes interprétations.
          Neuf planches et le flacon de guérison ont reçu une mise en couleur :
          l’encrage sombre du scan est conservé, sans nouvelle silhouette.
          Chaque planche peut être comparée à son original.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="panel px-4 py-2">175 pages de référence</span>
          <span className="panel px-4 py-2">76 éléments extraits</span>
          <span className="panel px-4 py-2">10 mises en couleur</span>
        </div>
        <p className="text-xs text-muted-foreground leading-6 max-w-3xl">
          Illustrations intérieures : © Gary Chalk, 1984. Couverture : © Solar
          Wind Ltd, 1985, selon les crédits du PDF. Couleurs ajoutées pour
          HeroBook, non originales. Attention : cette galerie révèle des lieux
          et des adversaires.
        </p>
        <nav
          aria-label="Sections de la galerie"
          className="flex flex-wrap gap-3"
        >
          <a href="#portraits" className="action-link action-secondary">
            <Swords size={17} />
            Héros & adversaires
          </a>
          <a href="#scenes" className="action-link action-secondary">
            <ImageIcon size={17} />
            Planches utilisées
          </a>
          <a href="#archives" className="action-link action-secondary">
            <BookOpen size={17} />
            Tous les scans
          </a>
        </nav>
      </header>

      <aside className="panel p-5 text-sm text-muted-foreground leading-7">
        <strong className="text-foreground">
          Dessin vérifié ne signifie pas récit intégral.
        </strong>{" "}
        Le jeu actuel est une adaptation de 50 paragraphes ; le livre en
        comporte 350. Les références « PDF p. » et « § du livre » ci-dessous ne
        désignent donc pas les numéros des scènes du jeu. Un dessin peut
        illustrer une espèce ou un lieu sans représenter exactement l’action
        adaptée. Les anciens visuels sans source vérifiée ont été retirés de la
        lecture, pas remplacés par des scènes inventées.
      </aside>

      <section id="portraits" className="space-y-6 scroll-mt-6">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl">Héros & adversaires</h2>
          <p className="text-sm text-muted-foreground">
            {fighters.filter((f) => f.src).length} cartes illustrées ·{" "}
            {pending.length} correspondances non identifiées.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fighters.map((fighter) => (
            <figure key={fighter.name} className="panel p-3">
              <CombatPortrait
                src={fighter.src}
                name={fighter.name}
                alt={
                  fighter === HERO_PORTRAIT
                    ? "Emblème du loup extrait de la couverture"
                    : undefined
                }
              />
              <figcaption className="p-2 pt-4 space-y-2">
                <h3 className="font-serif text-lg leading-snug">
                  {fighter.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-5">
                  {fighter.note}
                </p>
                {fighter.source && (
                  <a
                    href={fighter.source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block py-2 text-xs text-primary underline underline-offset-4"
                  >
                    Voir la planche utilisée
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="panel p-5 text-sm text-muted-foreground leading-6">
          Sans dessin correspondant identifié :{" "}
          {pending.map((p) => p.name).join(", ")}. Ces rencontres appartiennent
          à l’adaptation. Aucun Kakarmi, Drakkarim ou autre adversaire n’est
          utilisé à leur place. Loup Solitaire est représenté par l’emblème de
          sa couverture, pas par un visage inventé.
        </p>
      </section>

      <section id="scenes" className="space-y-6 scroll-mt-6">
        <h2 className="font-serif text-3xl">Les planches utilisées</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCENE_ILLUSTRATIONS.map((scene) => {
            const sections = LS01_SECTIONS.filter(
              (s) => s.image === scene.src,
            ).map((s) => s.id);
            return (
              <figure
                id={`planche-${scene.id}`}
                key={scene.src}
                className="panel overflow-hidden scroll-mt-6"
              >
                <a
                  href={scene.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ouvrir : ${scene.label}`}
                  className="block bg-[#e9e5db] p-3"
                >
                  <img
                    src={scene.src}
                    alt={scene.label}
                    width={scene.width}
                    height={scene.height}
                    loading="lazy"
                    className="w-full h-80 object-contain"
                  />
                </a>
                <figcaption className="p-5 space-y-3">
                  <p className="eyebrow">
                    {scene.origin === "pdf-colorized"
                      ? "Dessin du PDF · couleur ajoutée"
                      : "Extrait du PDF · couleurs d’origine"}
                  </p>
                  <h3 className="font-serif text-xl">{scene.label}</h3>
                  <p className="text-sm text-primary">
                    PDF p. {scene.pdfPage}
                    {scene.pdfSection ? ` · §${scene.pdfSection} du livre` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sections.length
                      ? `Utilisé dans l’adaptation : ${sections.join(", ")}`
                      : "Couverture, carte ou présentation"}
                  </p>
                  <details className="border-t border-border pt-2">
                    <summary className="cursor-pointer text-sm py-2 text-primary">
                      Voir le scan d’origine
                    </summary>
                    <a href={scene.original} target="_blank" rel="noreferrer">
                      <img
                        src={scene.original}
                        alt={`Scan d’origine : ${scene.label}, page ${scene.pdfPage}`}
                        loading="lazy"
                        className="w-full h-auto mt-3"
                      />
                    </a>
                  </details>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      <section id="archives" className="space-y-5 scroll-mt-6">
        <h2 className="font-serif text-3xl">Les autres éléments du PDF</h2>
        <p className="text-sm text-muted-foreground leading-7">
          Toutes les extractions sont conservées : dessins, petites vignettes,
          armes, carte, feuilles et tables. Ce ne sont pas 76 scènes narratives.
          Les vignettes non identifiées ne sont pas attribuées à un ennemi par
          simple proximité avec un numéro de paragraphe. Les armes et objets
          vérifiés servent aussi dans l’inventaire.
        </p>
        <figure className="panel p-5 flex items-center gap-5">
          <img
            src="/lonewolf/pdf/colored/potion.png"
            alt="Flacon de guérison du PDF, mis en couleur"
            width={86}
            height={60}
            className="w-20 h-auto shrink-0"
          />
          <figcaption className="text-sm leading-6">
            Flacon de guérison · PDF p. 16.
            <br />
            <a
              href="/lonewolf/pdf/originals/p016-x71.png"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              Voir l’original
            </a>
          </figcaption>
        </figure>
        <details className="panel p-5">
          <summary className="cursor-pointer py-2 font-serif text-xl">
            Consulter les {extracts.length} extractions
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {extracts.map((extract) => (
              <figure key={extract.file} className="min-w-0 space-y-2">
                <a
                  href={`/lonewolf/pdf/originals/${extract.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2 bg-[#e9e5db] rounded-lg"
                >
                  <img
                    src={`/lonewolf/pdf/originals/${extract.file}`}
                    alt={`Élément extrait du PDF, page ${extract.pages.join(", ")}`}
                    width={extract.width}
                    height={extract.height}
                    loading="lazy"
                    className="w-full h-44 object-contain"
                  />
                </a>
                <figcaption className="text-xs text-muted-foreground leading-5">
                  PDF p. {extract.pages.join(", ")}
                  {extract.pages[0] === 4
                    ? " · Tampon ajouté au document, hors dessins du livre"
                    : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </details>
      </section>
      <Link href="/jouer" className="action-link">
        Rejoindre l’aventure →
      </Link>
    </main>
  );
}
