// HeroBook Edge Functions — extraction de l'utilisateur depuis le JWT

import type { SupabaseClient, User } from "jsr:@supabase/supabase-js@2";

/**
 * Récupère l'utilisateur authentifié depuis l'en-tête Authorization.
 * (la plateforme vérifie déjà le JWT quand verify_jwt = true ;
 *  cette re-validation bloque aussi les tokens révoqués/expirés)
 */
export async function getUser(
  req: Request,
  admin: SupabaseClient,
): Promise<User | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
