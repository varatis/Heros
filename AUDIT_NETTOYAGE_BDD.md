# Audit de reconstruction SQL — Heros

**Mise à jour : 21 septembre 2026**

Ce document décrit l'état de la reconstruction demandée pour la PR #37. La
procédure exécutable et les contrôles post-reset sont dans
[`app/supabase/README.md`](app/supabase/README.md).

## Périmètre retenu

La base reconstruite ne charge que les cinq livres Loup Solitaire disponibles :

1. LS01 — **Les Maîtres des Ténèbres** ;
2. LS02 — **La Traversée Infernale** ;
3. LS03 — **Les Grottes de Kalte** ;
4. LS04 — **Le Gouffre Maudit** ;
5. LS05 — **Le Tyran du Désert**.

Les cinq volumes `lw_*` sont chargés par les seeds canoniques. LS01 conserve en
plus son contenu fidèle dans le moteur historique `stories/story_nodes`, car les
Edge Functions et les contrôles de fidélité l'utilisent. Le schéma générique,
ses fonctions et ses RLS restent disponibles pour accueillir une future
histoire.

## Migrations supprimées du rejeu

Les fichiers suivants ont été retirés du dépôt de reconstruction :

- `003_story_dragon_emeraude.sql` — histoire Dragon de démonstration ;
- `023_story_signal_perdu_v2.sql` — NOVA-9, saison 1 ;
- `024_story_nova9_saison2_andromede_v2.sql` — NOVA-9, saison 2 ;
- `025_illustrations_nova9_v2.sql` — branchement des illustrations NOVA-9.

`001_initial_schema.sql` conserve le schéma générique, les achievements et les
packs de gemmes, mais ne contient plus l'insertion de `la-foret-des-ombres` ni
aucun node de démonstration. Les anciens assets, générateurs et brouillons
NOVA-9 restent éventuellement dans le dépôt comme matériel historique/futur ;
ils ne sont référencés par aucune migration conservée, aucun seed et aucun
rejeu standard.

Il reste **22 migrations SQL**. Les préfixes `003` et `023` à `025` sont donc
absents volontairement ; l'ordre de rejeu est l'ordre lexical des fichiers
présents, pas une liste reconstituée avec des fichiers vides.

## Seeds conservés

Les cinq seeds canoniques restent inchangés et sont déclarés dans
`app/supabase/config.toml` :

```text
app/supabase/seed/001_loup_solitaire_01_adaptation_50.sql
app/supabase/seed/002_loup_solitaire_02_traversee_infernale.sql
app/supabase/seed/003_loup_solitaire_03_grottes_kalte.sql
app/supabase/seed/004_loup_solitaire_04_gouffre_maudit.sql
app/supabase/seed/005_loup_solitaire_05_tyran_desert.sql
```

Volumes vérifiés par le harnais PGlite :

| Livre | Sections chargées |
| --- | ---: |
| LS01 | 50 |
| LS02 | 366 |
| LS03 | 360 |
| LS04 | 356 |
| LS05 | 399 |

Ils sont régénérés depuis `app/content/lonewolf/` avec
`app/scripts/generer-sql-contenu.cjs`. Ils ne doivent pas être modifiés à la
main.

## Contrôles réalisés

`cd app && npm run test:db` rejoue automatiquement tous les fichiers SQL
présents, puis les cinq seeds. Le résultat attendu après ce nettoyage est :

- **89/89 contrôles PGlite** ;
- LS01 : 350 sections, 361 nodes avec le rulebook, 591 renvois, 19 fins ;
- aucune histoire chargée hors LS01 dans `stories` (l'histoire payante créée
  par le test d'achat est une fixture temporaire du harnais) ;
- tables `stories` et `story_nodes` toujours présentes ;
- contrôles RLS, achats, wallet, succès, consommables et idempotence conservés.

Les contrôles de parcours des seeds sont exécutés par les scripts existants :

```bash
cd app
npm run test:db
npm run test:livres
npm run check:ls02
```

## Ordre de reconstruction

Pour un environnement de développement ou de staging :

1. sauvegarder la base et vérifier deux fois le projet lié ;
2. lancer `supabase db reset --linked` depuis `app/` pour un reset distant
   contrôlé ;
3. laisser la CLI rejouer les 22 migrations dans l'ordre lexical puis les cinq
   seeds configurés ;
4. exécuter les vérifications SQL de `app/supabase/README.md` ;
5. seulement après validation, déployer ou redémarrer l'application.

Alternative manuelle : exécuter `operations/00_reset_public_schema.sql`, puis
les migrations présentes dans `app/supabase/migrations/` et enfin les cinq
seeds, toujours avec `ON_ERROR_STOP=1` et sans mélanger cette procédure avec
`supabase db push`.

Aucun reset distant n'a été lancé pendant cette mise à jour de la PR.
