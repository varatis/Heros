import { sceneForSource } from "@/content/lonewolf/ls01/illustrations";

/** PDF page numbers and adaptation section IDs are deliberately separate. */
export default function IllustrationCredit({ src }: { src: string }) {
  const scene = sceneForSource(src);
  if (!scene) return null;
  return (
    <p className="text-xs text-muted-foreground leading-5 text-center px-3 py-2">
      <a
        href={scene.original}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4 hover:text-primary"
      >
        Voir le dessin source · PDF p. {scene.pdfPage}
        {scene.pdfSection ? ` · §${scene.pdfSection} du livre` : ""}
      </a>
      {scene.origin === "pdf-colorized" && " · Mise en couleur"}
    </p>
  );
}
