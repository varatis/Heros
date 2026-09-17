import { getAccount } from "@/lib/library";
import CatalogueClient from "@/components/catalogue/CatalogueClient";

export const metadata = {
  title: "Ma bibliothèque",
  description: "Retrouvez vos grimoires et explorez les 19 bibliothèques des Livres dont vous êtes le héros.",
};

export default async function CataloguePage() {
  const { user } = await getAccount();
  const heroName = user?.user_metadata?.username;
  const bookmarkId = user?.user_metadata?.bookmark_id;

  return (
    <main className="page-width py-6">
      <CatalogueClient
        ownedSlugs={["loup-solitaire-01"]}
        initialHeroName={typeof heroName === "string" ? heroName : undefined}
        initialBookmarkId={typeof bookmarkId === "string" ? bookmarkId : undefined}
      />
    </main>
  );
}
