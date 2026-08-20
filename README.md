# Heros
Livre dont vous êtes le héros — interactive gamebook (Next.js + Supabase).

## Structure
- `app/` — application Next.js (SSR, auth Supabase par cookies)
- `app/supabase/migrations/` — schéma SQL (RLS + RPC sécurisés)
- `app/supabase/functions/` — Edge Functions de monétisation (Deno)
- `app/docs/EDGE_FUNCTIONS.md` — architecture backend sécurisée (monétisation)
- `app/android/` — projet natif Android (Capacitor)
- `app/docs/MOBILE.md` — guide de packaging mobile / build APK

## Sécurité monétisation (v1.0 — migration 004)
Le client n'écrit **jamais** dans `wallets` / `transactions` /
`user_inventory` / `user_achievements`. Tout passe par :
- 4 Edge Functions : `make-choice`, `apply-item-effect`,
  `validate-purchase` (webhook RevenueCat), `grant-daily-reward`
- Des RPC SQL atomiques `SECURITY DEFINER` (`purchase_item`,
  `claim_achievements`, ...)

Voir [app/docs/EDGE_FUNCTIONS.md](app/docs/EDGE_FUNCTIONS.md).

Les sessions **invité** (`signInAnonymously`) peuvent jouer gratuitement.
Les paiements réels (RevenueCat) exigent un compte : `/register` convertit
la session anonyme (même `user_id`, même wallet).

## Tests
```bash
cd app
npm run test:db   # migrations + 47 assertions sur un vrai Postgres (PGlite)
npx tsc --noEmit  # type-check de l'app
```

## Mobile
Voir [app/docs/MOBILE.md](app/docs/MOBILE.md) pour compiler l'app Android.
