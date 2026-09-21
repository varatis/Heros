# Base de données Supabase

Ce dossier contient **la seule source de vérité SQL** du projet. Il n'y a plus de
copie parallèle dans `clean_sql/` : les fichiers à rejouer sont ici, avec des
préfixes uniques et un ordre explicite.

## Organisation

```text
supabase/
├── migrations/   structure, sécurité, RPC et histoires du moteur `stories`
├── seed/         contenu Loup Solitaire du moteur `lw_*`, généré depuis content/
└── operations/   opérations destructives à lancer volontairement
```

### Migrations

Les 26 migrations sont volontairement numérotées sans doublon. Cette chaîne
est destinée à une **reconstruction depuis zéro** : ne pas lancer `supabase db
push` sur l'ancienne base avant le reset, car plusieurs fichiers ont été
renommés pour supprimer les collisions. Sur une base vide, les exécuter dans
l'ordre lexical :

| Ordre | Fichier | Rôle |
| ---: | --- | --- |
| 001 | `001_initial_schema.sql` | extensions, enums, tables cœur, démo, RLS initiales |
| 002 | `002_fix_rls_and_policies.sql` | politiques et items de boutique |
| 003 | `003_story_dragon_emeraude.sql` | histoire fantasy de démonstration |
| 004 | `004_loup_solitaire_schema.sql` | tables et RLS du moteur `lw_*` |
| 005 | `005_secure_monetization.sql` | RPC et verrouillage de la monétisation |
| 006 | `006_loup_solitaire_catalogue.sql` | catalogue LS01 et succès communs |
| 007 | `007_story_purchase.sql` | RPC d'achat d'histoires |
| 008 | `008_story_maitres_des_tenebres.sql` | LS01 fidèle dans l'ancien moteur `stories` |
| 009 | `009_bibliotheque_utilisateur.sql` | bibliothèque utilisateur `lw_*` |
| 010 | `010_loup_solitaire_combat_engine.sql` | table des coups portés et règles de combat |
| 011 | `011_couverture_pdf_ls01.sql` | couverture LS01 |
| 012 | `012_fix_loup_solitaire_discipline_slugs.sql` | correction des disciplines LS01 |
| 013 | `013_fix_rls_client_writes.sql` | écritures client limitées à la progression |
| 014 | `014_fix_maitres_des_tenebres_fidelite.sql` | passe de fidélité LS01 |
| 015 | `015_livre_fidelite_passe2_enum.sql` | enum `inventory_remove` |
| 016 | `016_livre_fidelite_passe2.sql` | fidélité LS01, passe 2 |
| 017 | `017_combat_state_and_rules.sql` | état serveur et règles de combat |
| 018 | `018_illustrations_maitres_des_tenebres.sql` | illustrations LS01 |
| 019 | `019_use_consumable_rpc.sql` | RPC de consommation d'objet |
| 020 | `020_account_self_heal_and_guest_purge.sql` | auto-réparation de compte et purge invité |
| 021 | `021_new_core_rules_vie_armure_attaque.sql` | règles Vie / Armure / Attaque |
| 022 | `022_fix_fk_cascade_history.sql` | clés étrangères et suppressions sûres |
| 023 | `023_story_signal_perdu_v2.sql` | NOVA-9 — Saison 1, version actuelle |
| 024 | `024_story_nova9_saison2_andromede_v2.sql` | NOVA-9 — Saison 2, version actuelle |
| 025 | `025_illustrations_nova9_v2.sql` | branchement des illustrations NOVA-9 |
| 026 | `026_ls01_fidelite_passe3.sql` | fidélité LS01, passe 3 finale |

Les anciennes versions NOVA-9 `018` à `021` ont été retirées : elles sont
remplacées par les migrations générées `023` à `025`. Les anciens doublons de
numérotation (`004`, `005`, `007`, `008`) ont été renommés, sans modifier leur
SQL fonctionnel.

### Seeds de contenu

Les seeds sont exécutés **après toutes les migrations**, dans cet ordre :

1. `seed/001_loup_solitaire_01_adaptation_50.sql` — adaptation LS01 en 50 sections ;
2. `seed/002_loup_solitaire_02_traversee_infernale.sql` — LS02 fidèle, 350 paragraphes et étapes de combats ;
3. `seed/003_loup_solitaire_03_grottes_kalte.sql` — LS03 ;
4. `seed/004_loup_solitaire_04_gouffre_maudit.sql` — LS04 ;
5. `seed/005_loup_solitaire_05_tyran_desert.sql` — LS05.

Ils sont générés à partir de `app/content/lonewolf/` : ne pas les modifier à
la main. Depuis `app/` :

```bash
node scripts/generer-sql-contenu.cjs       # régénérer les 5 seeds
npm run check:ls02                         # vérifier l'import LS02
```

Les chemins sont déclarés dans `supabase/config.toml`, donc un reset Supabase
les rejoue automatiquement.

## Repartir de zéro sur Supabase

### 0. Sauvegarde obligatoire

Avant toute opération destructive, créer un backup dans **Supabase → Database →
Backups** ou exporter la base. Vérifier deux fois le projet et l'environnement
(dev/staging/production).

### Option A — CLI Supabase (recommandée pour dev/staging)

Depuis le dépôt (la configuration Supabase est dans `app/`) :

```bash
cd app
supabase link --project-ref <PROJECT_REF>
supabase projects list                 # vérifier le projet actuellement lié
supabase db reset --linked             # DESTRUCTIF : reset distant + migrations + seeds
```

La commande `--linked` efface la base distante liée puis rejoue les migrations
et les seeds configurés. Ne pas l'utiliser en production sans procédure de
restauration validée. Pour ne pas charger le contenu, l'option est
`--no-seed`; ici, on veut normalement conserver le seed.

Après le reset, contrôler :

```bash
supabase migration list
```

### Option B — SQL Editor Supabase

À utiliser si vous ne voulez pas installer/relier la CLI. Dans **Supabase → SQL
Editor**, exécuter les fichiers un par un :

1. `operations/00_reset_public_schema.sql` ;
2. tous les fichiers de `migrations/`, de `001_...` à `026_...` ;
3. tous les fichiers de `seed/`, de `001_...` à `005_...`.

Ne pas exécuter les seeds avant les migrations. Chaque étape doit se terminer
sans erreur avant de passer à la suivante. Dans cette option, ne pas mélanger
une exécution manuelle avec `supabase db push` : la table d'historique des
migrations de la CLI ne connaît pas forcément les fichiers exécutés à la main.

### Option C — psql, même ordre mais automatisé

Avec l'URL de connexion directe récupérée dans **Project Settings → Database**
(stockée localement dans une variable, jamais dans Git) :

```bash
export SUPABASE_DB_URL='postgresql://...'

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -f app/supabase/operations/00_reset_public_schema.sql

for file in app/supabase/migrations/*.sql; do
  echo "==> $file"
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$file" || exit 1
done

for file in app/supabase/seed/*.sql; do
  echo "==> $file"
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$file" || exit 1
done
```

## Vérifications après reconstruction

À exécuter dans SQL Editor :

```sql
-- Catalogue Loup Solitaire
SELECT numero, slug, nb_paragraphes, status
FROM public.lw_livres
ORDER BY numero;

-- Volume du contenu
SELECT livre_slug, COUNT(*) AS sections
FROM public.lw_sections
GROUP BY livre_slug
ORDER BY livre_slug;

-- Contrôle du correctif LS02 (§255)
SELECT numero, suite, choix, LEFT(texte, 100) AS extrait
FROM public.lw_sections
WHERE livre_slug = 'loup-solitaire-02' AND numero = '255';

-- Aucun choix vide dans LS02
SELECT COUNT(*) AS choix_vides
FROM public.lw_sections
WHERE livre_slug = 'loup-solitaire-02'
  AND choix @> '[{"texte":""}]'::jsonb;

-- Histoires du moteur générique
SELECT slug, status, is_free, price_gems
FROM public.stories
ORDER BY created_at;
```

Le dernier contrôle LS02 doit afficher `suite = '268'`, `choix = NULL` et
`choix_vides = 0`.

## Évolution future

- Une nouvelle modification de schéma devient une **nouvelle migration** avec un
  préfixe unique, jamais une réédition d'une migration déjà appliquée.
- Un nouveau contenu Loup Solitaire reste dans `seed/` et est régénéré par le
  script correspondant.
- Les scripts de génération NOVA-9 actifs sont `tools/generate-nova9-s1-v2.mjs`
  et `tools/generate-nova9-s2-v5.mjs`; ils écrivent directement les migrations
  `023` et `024`.
