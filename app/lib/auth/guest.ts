import type { User } from "@supabase/supabase-js";

/** Session créée via `signInAnonymously` — progression volatile. */
export function isAnonymousUser(user: User | null | undefined): boolean {
  return Boolean(user?.is_anonymous);
}
