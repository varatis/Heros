import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAccount } from "@/lib/library";
import definitions from "@/content/catalogue/succes.json";
import AchievementsGallery, {
  type Succes,
} from "@/components/shared/AchievementsGallery";

export const metadata = { title: "Badges & succès" };
export default async function AchievementsPage() {
  const { supabase, user } = await getAccount();
  let succes: Succes[] = definitions;
  let unlocked: string[] = [];
  let failed = false;
  if (supabase) {
    const db = supabase as SupabaseClient;
    const result = await db
      .from("lw_succes")
      .select("slug, nom, description, gemmes")
      .order("condition_value");
    if (result.data) succes = result.data;
    failed = !!result.error;
    if (user) {
      const result = await db
        .from("lw_succes_utilisateur")
        .select("succes_slug")
        .eq("user_id", user.id);
      unlocked = (result.data ?? []).map(
        (s: { succes_slug: string }) => s.succes_slug,
      );
      failed ||= !!result.error;
    }
  }
  return (
    <main className="app-page space-y-6">
      <header className="page-head">
        <p className="eyebrow">Le carnet des exploits</p>
        <h1>Badges & succès</h1>
        <p className="page-sub">
          Explorez le Magnamund, surmontez ses dangers et collectionnez les
          insignes de vos aventures.
        </p>
      </header>
      {!user && (
        <p className="panel p-5 text-sm text-muted-foreground">
          Aperçu des succès du jeu. Aucun badge n’est attribué dans cet aperçu.{" "}
          <Link
            href="/login"
            className="text-primary underline underline-offset-4"
          >
            Se connecter
          </Link>
        </p>
      )}
      {failed && (
        <p role="alert" className="text-destructive">
          Les succès en ligne n’ont pas pu être chargés complètement. Les badges
          affichés ne confirment pas votre progression.
        </p>
      )}
      <AchievementsGallery
        succes={succes}
        unlocked={unlocked}
        connected={!!user}
      />
    </main>
  );
}
