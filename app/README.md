# Heros — application

Application Next.js du projet Heros, avec intégration Supabase et version mobile
Capacitor.

## Développement

```bash
npm install
npm run dev
```

L'application est disponible sur <http://localhost:3000>.

## Base de données

La procédure complète de reset/reconstruction est dans
[`supabase/README.md`](supabase/README.md). Les points importants :

- `supabase/migrations/` contient 26 migrations numérotées sans doublon ;
- `supabase/seed/` contient les 5 seeds de contenu, rejoués après les migrations ;
- `supabase/config.toml` déclare l'ordre des seeds pour `supabase db reset` ;
- ne pas modifier les seeds générés à la main : utiliser
  `node scripts/generer-sql-contenu.cjs`.

## Vérifications utiles

```bash
npm run test:db
npm run check:ls02
npm run test:livres
```
