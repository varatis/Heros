# HeroBook (app/)

Application Next.js (App Router, TypeScript, Tailwind) + backend Supabase + Capacitor Android.

## Scripts utiles

```bash
npm run dev      # serveur de dev
npm run build    # build production
npm run test:db  # 85 assertions sur un vrai Postgres (PGlite)
npx tsc --noEmit # type-check
```

## Structure

- `app/` — routes App Router (SSR, auth Supabase par cookies)
- `components/` — UI (story, character, shop, auth, shared)
- `lib/seals.ts` — sceaux / ex-libris du lecteur
- `lib/stories.ts` — thèmes (Fantasy, Polar, SF…) + libellés
- `lib/supabase/` — clients + wrappers Edge Functions / RPC
- `stores/` — Zustand (`walletStore` = miroir d'affichage des soldes)
- `supabase/migrations/` — schéma SQL (001 → 016)
- `supabase/functions/` — Edge Functions Deno
- `scripts/test-migrations.mjs` — tests DB (`npm run test:db`)

## Docs
- [docs/AUTH.md](docs/AUTH.md) — invité, OAuth, conversion de compte
- [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md) — backend sécurisé
- [docs/MOBILE.md](docs/MOBILE.md) — packaging Android
- [../ROADMAP.md](../ROADMAP.md) — état du projet
