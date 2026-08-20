# HeroBook (app/)

Application Next.js 15/16 (App Router, TypeScript, Tailwind, Zustand,
TanStack Query) + backend Supabase.

## Scripts utiles

```bash
npm run dev      # serveur de dev
npm run build    # build production
npm run test:db  # migrations + 47 assertions sur un vrai Postgres (PGlite)
npx tsc --noEmit # type-check
```

## Structure

- `app/` — routes App Router (SSR, auth Supabase par cookies)
- `components/` — UI (shop, story, shared, ui)
- `lib/supabase/` — clients Supabase + wrappers Edge Functions (`functions.ts`)
- `lib/game-engine/` — stats & succès (côté affichage, logique serveur en RPC)
- `stores/` — Zustand (`walletStore` = miroir d'affichage des soldes serveur)
- `supabase/migrations/` — schéma SQL. **004** verrouille la monétisation
- `supabase/functions/` — Edge Functions Deno : `make-choice`,
  `apply-item-effect`, `validate-purchase`, `grant-daily-reward`
- `scripts/test-migrations.mjs` — tests DB embarqués (`npm run test:db`)

## Sécurité monétisation

Le client n'écrit **jamais** dans `wallets` / `transactions` /
`user_inventory` / `user_achievements` (RLS lecture seule). Tous les
mouvements passent par les Edge Functions et les RPC `SECURITY DEFINER`
de la migration 004 — voir [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md).

## Docs
- [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md) — backend sécurisé & déploiement
- [docs/MOBILE.md](docs/MOBILE.md) — packaging Android (Capacitor)
