/**
 * Détecte si le projet Supabase est configuré dans l'environnement.
 *
 * Le jeu Loup Solitaire (règles, lecture, Feuille d'Aventure) fonctionne sans
 * Supabase : contenu embarqué + sauvegarde navigateur. Seuls les écrans
 * « compte » (boutique, succès en ligne, profil) nécessitent la base.
 */
export const supabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
