import { redirect } from "next/navigation";
import { getLibrary, canRead, LIVRE_DECOUVERTE } from "@/lib/library";

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { livres, owned } = await getLibrary();
  const livre = livres.find((l) => l.slug === LIVRE_DECOUVERTE.slug);
  // A database failure is not a free pass to paid or unpublished content.
  if (!livre || !canRead(livre, owned)) redirect("/shop");
  return <>{children}</>;
}
