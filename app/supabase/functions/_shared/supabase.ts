// HeroBook Edge Functions — client admin Supabase (service_role)
// ⚠️ Ne JAMAIS exposer SUPABASE_SERVICE_ROLE_KEY côté client.

import { createClient } from "jsr:@supabase/supabase-js@2";
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";

export function createAdminClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Variables d'environnement SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquantes",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
