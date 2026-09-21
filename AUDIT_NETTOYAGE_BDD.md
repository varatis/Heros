# Audit de nettoyage SQL — Heros

**Mise à jour : 21 septembre 2026**

Ce document résume le nettoyage réalisé. La procédure opérationnelle à suivre
pour Supabase est maintenant dans [`app/supabase/README.md`](app/supabase/README.md).

## État avant nettoyage

Le dépôt mélangeait plusieurs générations de scripts :

- 30 fichiers de migration, avec des numéros en double (`004`, `005`, `007`,
  `008`) ;
- deux moteurs narratifs qui doivent pourtant coexister :
  - `stories` / `story_nodes` pour le catalogue générique, les histoires
    Dragon, LS01 fidèle et NOVA-9 ;
  - `lw_livres` / `lw_sections` pour le lecteur Loup Solitaire actuellement
    utilisé par `app/lib/library.ts` ;
- les anciennes versions NOVA-9 (`018` à `021`) conservées à côté des versions
  réécrites (`023` à `025`) ;
- des copies identiques des seeds dans `clean_sql/` et
  `app/supabase/seed/` ;
- aucun guide unique indiquant quoi exécuter après un reset complet.

## Nettoyage appliqué

### Migrations

Les migrations conservées sont maintenant dans
`app/supabase/migrations/001_...sql` à `026_...sql`, sans doublon de préfixe.
Les renommages sont uniquement organisationnels : le SQL fonctionnel conservé
n'a pas été réécrit.

Les fichiers supprimés car remplacés sont :

- `018_story_signal_perdu_scifi.sql` ;
- `019_illustrations_signal_perdu.sql` ;
- `020_story_nova9_saison2_andromede.sql` ;
- `021_illustrations_nova9_s2.sql`.

Les versions actuelles sont `023_story_signal_perdu_v2.sql`,
`024_story_nova9_saison2_andromede_v2.sql` et
`025_illustrations_nova9_v2.sql`.

La migration `004_loup_solitaire_schema.sql` conserve intentionnellement son
ancienne purge destructive **commentée** : elle n'est pas exécutée. Le schéma
`stories` est encore requis par le code et par les histoires Dragon/NOVA-9.

### Seeds

Les cinq seeds canoniques sont maintenant :

```text
app/supabase/seed/001_loup_solitaire_01_adaptation_50.sql
app/supabase/seed/002_loup_solitaire_02_traversee_infernale.sql
app/supabase/seed/003_loup_solitaire_03_grottes_kalte.sql
app/supabase/seed/004_loup_solitaire_04_gouffre_maudit.sql
app/supabase/seed/005_loup_solitaire_05_tyran_desert.sql
```

Ils sont générés depuis `app/content/lonewolf/` par
`app/scripts/generer-sql-contenu.cjs`. Les copies de `clean_sql/` ont été
supprimées pour éviter qu'une version ne soit régénérée dans un autre fichier.
Les chemins sont déclarés dans `app/supabase/config.toml` afin que le CLI les
rejoue après les migrations.

### Opérations et documentation

- `app/supabase/operations/00_reset_public_schema.sql` réalise le reset
  complet du schéma `public` depuis SQL Editor ;
- `app/supabase/README.md` donne les trois parcours : CLI, SQL Editor et
  `psql`, plus les vérifications SQL ;
- `README.md` et `app/README.md` renvoient vers ce guide ;
- les anciens générateurs NOVA-9 qui écrivaient vers la migration supprimée
  ont été retirés ; les générateurs actifs sont dans `tools/`.

## Points de contenu vérifiés

### LS01

- Le lecteur `lw_*` utilise l'adaptation courte de 50 sections ;
- l'ancien moteur `stories` contient la version fidèle en 350 sections et ses
  correctifs de fidélité `014`, `015`, `016` et `026` ;
- ces deux versions ne doivent pas être fusionnées sans décision produit,
  car elles n'ont pas le même graphe ni le même format de sauvegarde.

### LS02

- le seed contient 350 paragraphes officiels et les étapes techniques requises
  pour les combats séquentiels ;
- les renvois seuls sont stockés dans `suite`, pas dans un choix au libellé
  vide ;
- le contrôle critique du §255 doit donner `suite = '268'`, `choix = NULL` ;
- la requête de détection des choix vides doit retourner `0`.

Régénération et contrôle :

```bash
cd app
node scripts/generer-sql-contenu.cjs ls02
npm run check:ls02
```

## Ordre de reconstruction

Ne pas exécuter seulement les seeds : ils supposent que les tables et fonctions
existent déjà. Pour une base vide :

1. sauvegarde ;
2. `operations/00_reset_public_schema.sql` (ou `supabase db reset --linked`,
   mais pas les deux) ;
3. migrations `001` → `026` ;
4. seeds `001` → `005` ;
5. contrôles du guide `app/supabase/README.md`.

Aucun ancien fichier `clean_sql/` ne doit être recréé. Toute future évolution
du schéma doit être une nouvelle migration au préfixe unique ; toute évolution
du contenu doit passer par sa source TypeScript puis par le générateur.
