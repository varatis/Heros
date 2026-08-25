# HeroBook

Livre dont vous êtes le héros — bibliothèque de récits interactifs (Next.js + Supabase + Capacitor).

## Structure
- `app/` — application Next.js (SSR, auth Supabase par cookies)
- `app/supabase/migrations/` — schéma SQL (RLS + RPC sécurisés, 001 → 016)
- `app/supabase/functions/` — Edge Functions (Deno)
- `app/docs/AUTH.md` — auth, invité, OAuth, conversion de compte
- `app/docs/EDGE_FUNCTIONS.md` — backend monétisation
- `app/docs/MOBILE.md` — packaging Android / APK
- `app/android/` — projet natif Capacitor
- `ROADMAP.md` — état du projet et suite à faire

## Produit (état actuel)
- Onboarding : **nom + sceau** (pas de classe globale)
- Catalogue mobile : reprendre + étagère de couvertures + **rayons** (Fantasy, Aventure, Polar, SF, Horreur, Romance)
- Boutique : **achat d'histoires** + packs de gemmes (pas de vente d'objets — sacoche = loot par aventure)
- Lecteur fidèle pour *Les Maîtres des Ténèbres* (350 sections, combat, disciplines Kaï)
- Invité possible ; rien n'est sauvegardé sans compte

## Sécurité monétisation
Le client n'écrit **jamais** dans `wallets` / `transactions` /
`user_inventory` / `user_achievements`. Tout passe par les Edge Functions
et des RPC `SECURITY DEFINER`. Voir [app/docs/EDGE_FUNCTIONS.md](app/docs/EDGE_FUNCTIONS.md).

## Tests
```bash
cd app
npm run test:db   # 85 assertions sur un vrai Postgres (PGlite)
npx tsc --noEmit  # type-check
```

## Mobile
Voir [app/docs/MOBILE.md](app/docs/MOBILE.md).
