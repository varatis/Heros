import CatalogueClient from "@/components/catalogue/CatalogueClient";

export const metadata = {
  title: "Ma bibliothèque",
  description:
    "Retrouvez vos grimoires et explorez les 19 bibliothèques des Livres dont vous êtes le héros.",
};

export default function CataloguePage() {
  return (
    <main className="app-page">
      <CatalogueClient ownedSlugs={["loup-solitaire-01", "loup-solitaire-02"]} />
    </main>
  );
}
