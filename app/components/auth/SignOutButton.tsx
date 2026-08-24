"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, LogOut } from "lucide-react";

/**
 * Bouton de déconnexion 100 % client (pas de formulaire natif — le
 * composant Button de Base UI est de type "button" par défaut et ne
 * soumettait jamais le form, d'où le clic « qui ne fait rien »).
 *
 * Ordre des opérations :
 *  1. Si session invité → RPC purge_anonymous_user() (suppression en
 *     base AVANT la déconnexion, tant que auth.uid() est valide ;
 *     garde-fou SQL : ne touche jamais un compte permanent).
 *  2. signOut() local → nettoie session et cookies.
 *  3. Navigation complète vers /login (rechargement dur : le serveur
 *     re-render avec la session vide, pas de cache routeur piégé).
 */
export default function SignOutButton({
  isGuest = false,
  className,
}: {
  isGuest?: boolean;
  className?: string;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    if (loading) return;
    setLoading(true);

    try {
      if (isGuest) {
        await supabase.rpc("purge_anonymous_user");
      }
    } catch {
      // RPC absente (migration 016 pas encore déployée) — on continue.
    }

    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // Session déjà morte ou réseau indisponible — on continue.
    }

    // Rechargement complet : le proxy et le layout rendent l'état déconnecté.
    window.location.href = "/login";
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={loading}
      className={cn(
        "gap-1.5 text-xs text-muted-foreground hover:text-destructive",
        className
      )}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <LogOut className="size-3.5" />
      )}
      {loading ? "Déconnexion…" : "Déconnexion"}
    </Button>
  );
}
