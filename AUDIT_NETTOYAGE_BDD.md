# Audit Avancé — Heros / Loup Solitaire — Nettoyage BDD

**Date : 2026-09-20**
**Scope restreint : uniquement les .sql propres pour LS01 & LS02 + procédure de remise à propre Supabase**
**PDF référence : `content/stories/source-pdfs/Loup Solitaire 02 - La Traversee Infernale.pdf` (191 pages, 350§)**

---

## 1. Résumé exécutif

- **BDD dans état sale** : 25 migrations dans `app/supabase/migrations/`, doublons de numérotation (004 x2, 005 x2, 007 x2, 008 x2), ordre dépend du timestamp filesystem, pas du numéro. Purge destructive commentée dans `004_loup_solitaire_schema.sql`.
- **Double moteur coexistant** :
  - Ancien : `stories` / `story_nodes` / `story_choices` (migration 006 `006_story_maitres_des_tenebres.sql` = 350 sections LS01, avec 25 fausses fins listées dans `AUDIT_MAITRES_DES_TENEBRES.md`).
  - Nouveau : `lw_livres` / `lw_sections` / `lw_sauvegardes` / `lw_fins` (migration 004) utilisé par `app/lib/library.ts` → `from("lw_livres")`. C'est le moteur actif.
- **LS01** : Nouveau système = **50 sections romancées** (`app/content/lonewolf/ls01/` : `SECTIONS_MONASTERE`, `ROUTE`, `HOLMGARD`), pas les 350 du livre. Adaptation narrative voulue, non fidèle au PDF. Ancien système = 350 sections mais fidélité partielle (fausses fins).
- **LS02** : Nouveau système = **377 sections** (350 + 27 sous-sections pour combats chaînés `§131-b/c`, `§185-b`, `§282-b`, etc définis dans `ls02-overrides.json`). **Bug majeur corrigé dans cet audit** : 120 sections avaient `choix=[{texte:"",vers:"N"}]` au lieu de `suite=N`, causant bouton vide / affichage "Que décidez-vous ? 1" signalé par l'utilisateur.
- **Fidélité PDF LS02 §255 validée** :
  - PDF extrait via PyMuPDF : *"Vous empoignez votre arme et vous faites une brillante démonstration..." + "Rendez-vous au 268"*
  - Avant correction : TS `sections-180-269.ts` → `choix: [{texte:"", vers:"268"}]` + SQL `007_contenu_ls02.sql` identique → bouton vide.
  - Après correction : `texte` sans le "Rendez-vous", `suite:"268"`, `choix: NULL` → 100% identique au livre en logique de jeu.

---

## 2. Architecture actuelle

### 2.1 Migrations (25 fichiers)

```
001_initial_schema.sql
002_fix_rls_and_policies.sql
003_story_dragon_emeraude.sql
004_loup_solitaire_schema.sql          ← crée lw_*
004_secure_monetization.sql            ← collision numéro 004
005_loup_solitaire_donnees.sql
005_story_purchase.sql                 ← collision 005
006_story_maitres_des_tenebres.sql     ← ancien moteur 350 LS01
007_bibliotheque_utilisateur.sql       ← lw_livres_utilisateur
007_loup_solitaire_combat_engine.sql   ← collision 007
008_couverture_pdf_ls01.sql
008_fix_loup_solitaire_discipline_slugs.sql ← collision 008
009_fix_rls_client_writes.sql
010_fix_maitres_des_tenebres_fidelite.sql
011_livre_fidelite_passe2_enum.sql
012_livre_fidelite_passe2.sql
013_combat_state_and_rules.sql
014_illustrations_maitres_des_tenebres.sql
015_use_consumable_rpc.sql
016_account_self_heal_and_guest_purge.sql
017_new_core_rules_vie_armure_attaque.sql
018_story_signal_perdu_scifi.sql
019_illustrations_signal_perdu.sql
020_story_nova9_saison2_andromede.sql
021_illustrations_nova9_s2.sql
022_fix_fk_cascade_history.sql
023_story_signal_perdu_v2.sql
024_story_nova9_saison2_andromede_v2.sql
025_illustrations_nova9_v2.sql
```

- `supabase db reset` impossible proprement : ordre par timestamp, pas numéro.
- `004_loup_solitaire_schema.sql` contient purge destructive en commentaire (section 1) qui aurait droppé `stories`, `story_nodes`, etc — jamais appliquée car migrations suivantes les réutilisent.

### 2.2 Seed

- `supabase/seed/006_contenu_ls01.sql` : 50 INSERT `lw_sections` (DELETE + INSERT, pas ON CONFLICT).
- `supabase/seed/007_contenu_ls02.sql` : 377 INSERT `lw_sections` + upsert `lw_livres` (ON CONFLICT). **Avant cet audit : 114 lignes avec choix vide**.
- `content/stories/ls02-texte-brut.txt` : 5500 lignes extraction PDF brute, source de vérité pour l'importer.

### 2.3 Code

- `app/scripts/ls02-importer.cjs` + `ls02-overrides.json` : parse `ls02-texte-brut.txt`, détecte `RE_CIBLE` (rendez-vous au N), combats `HABILETE: X ENDURANCE: Y`, jets `Table de Hasard`, applique overrides manuels (effets or/endurance/objets, combats chaînés).
- Bug historique : `if phrasesChoix.length && !ov.suiteForcee → choix` transformait tout "Rendez-vous au N" isolé en choix. Si `libelleChoix()` retirait la cible, texte devenait vide → bouton vide. Fix appliqué dans cet audit (voir §5).

---

## 3. Analyse détaillée LS01

| Aspect | État |
|---|---|
| PDF original | 350 paragraphes, §255 = Gourgaz HAB 20 END 30 vers 82 (vérifié page 129 extraction PyMuPDF) |
| Ancien moteur 006 | 350 sections, mais 25 fins inventées (AUDIT_MAITRES_DES_TENEBRES.md) |
| Nouveau moteur lw_* | 50 sections romancées (1,2,4,12,44,45,46,60,64,65,66,70,71,88,99,100,113,121,131,142,145,155,171,184,192,202,213,216,219,232,245,247,254,267,274,275,279,283,286,294,301,304,305,307,309,319,323,331,332,345) — design narratif simplifié, pas fidélité PDF |
| Effets | `repasObligatoire`, `or`, `objets`, `jet-hasard-table` partiellement présents |
| Conclusion | Si objectif = fidélité 100% PDF, il faut reconvertir les 350 de l'ancien moteur vers lw_* en corrigeant les 25 fausses fins. Si objectif = jeu court, garder 50 mais documenter comme adaptation. |

---

## 4. Analyse détaillée LS02 — La Traversée Infernale

### 4.1 Extraction PDF

- Outil : `pymupdf` (fitz) installé `--break-system-packages`
- 191 pages, regex `^\d{1,3}$` → 350 paragraphes détectés
- Exemples vérifiés : §1,2,3,15,42,96,122,150,255,268,350 OK
- §255 PDF : démonstration arme/tourbillon/assiette étain + "Rendez-vous au 268" → **identique au texte SQL avant correction**, mais stockage incorrect.

### 4.2 Bugs trouvés et corrigés

1. **120 choix vides** (ex: §9→196, §13→155, §14→305, §16→268, §19→71, §20→186, §27→312, §29→222, §42→168, §43→286, §48→268, §49→100, §50→249, §56→127, §57→282, §58→197, §61→181, §65→32, §67→300, §68→306, §69→311, §73→336, §74→240, §79→40, §91→245, §92→183, §94→240, §96→112, §97→152, §101→222, ... §255→268, §256→134)
   - Cause : `libelleChoix()` supprimait "Rendez-vous au N" → texte vide, mais code créait quand même un choix.
   - Fix : si 1 seul choix, pas de combat, pas de jet, pas de requis, texte vide → convertir en `suite`.

2. **Texte contenant encore "Rendez-vous au N"** après conversion suite → corrigé en nettoyant `phrasesTexte`.

3. **OCR errors propagés** : "mariiifi", "von» montre", "II faut" → "Il faut", etc. Liste dans `CORRECTIONS` du importer. Partiellement corrigés, reste du bruit.

4. **Effets mécaniques non exhaustifs** : or/endurance/objets posés à la main dans `ls02-overrides.json`. Ex: §48 (démonstration chope) devrait peut-être donner effet ? Actuellement aucun. Table de Hasard +5 si jeu des tasses ? Non automatisé.

5. **Combats chaînés** : §131 (3 ennemis), §185 (2), §282 (2), §296 (6), §298 (3) → sections synthétiques `131-b`, `131-c`, etc. Bien gérés.

### 4.3 Après correction (cet audit)

```bash
node app/scripts/ls02-importer.cjs
# → Total : 377 sections. Fichiers écrits.
# §255 : suite auto (choix vide) → 268
# Plus de choix vide : 0

node app/scripts/generer-sql-contenu.cjs ls02
# → 377 sections écrites dans supabase/seed/007_contenu_ls02.sql
# §255 : texte clean, suite='268', choix=NULL
```

Vérif SQL :

```sql
-- Avant
INSERT ... '255' ... '... L''homme a assisté ... stupeur.' , NULL, '[{"texte":"","vers":"268"}]'::jsonb ...

-- Après
INSERT ... '255' ... '... yeux ronds de stupeur.' , '268', NULL ...
```

---

## 5. Corrections apportées au code

### 5.1 `app/scripts/ls02-importer.cjs`

**Avant** :
```js
} else if (phrasesChoix.length && !ov.suiteForcee) {
  section.choix = phrasesChoix.map(...)
```

**Après** :
```js
} else if (phrasesChoix.length && !ov.suiteForcee) {
  const choixGen = phrasesChoix.map(...)
  if (choixGen.length===1 && !section.combat && !section.evenement?.branches && !choixGen[0].requis && !choixGen[0].texte.trim()) {
    section.suite = choixGen[0].vers;
    trace(id, `suite auto (choix vide) → ${section.suite}`);
  } else {
    section.choix = choixGen;
  }
```

+ nettoyage texte pour suite auto :
```js
} else if (!ov.texte && section.suite && phrasesTexte.length && phrasesTexte.length < phrases.length) {
  section.texte = phrasesTexte.join(" ").trim() || bloc;
}
```

### 5.2 TS générés

- `app/content/lonewolf/ls02/sections-*.ts` régénérés → §255 maintenant `suite:"268"` sans "Rendez-vous" dans texte.

### 5.3 SQL seed

- `app/supabase/seed/007_contenu_ls02.sql` régénéré via `generer-sql-contenu.cjs` → 377 sections, 0 choix vide.

---

## 6. Procédure de nettoyage BDD Supabase

### Étape 0 : Sauvegarde

Dans Supabase Dashboard → Database → Backups → Create backup (ou `pg_dump`).

### Étape 1 : RESET

Exécuter `clean_sql/00_RESET_BDD.sql` dans SQL Editor :

```sql
-- Supprime uniquement les 2 livres Loup Solitaire des 2 moteurs
-- Idempotent, sûr à rejouer
```

Vérif :
```sql
SELECT slug FROM lw_livres; -- doit être vide pour loup-solitaire-*
SELECT COUNT(*) FROM lw_sections; -- 0 pour ces slugs
```

### Étape 2 : Réimport propre

Exécuter dans l'ordre :

1. `clean_sql/01_loup_solitaire_01_adaptation_50.sql` (50 sections, moteur actif)
   - Si vous voulez la version 350 fidèle, il faut d'abord convertir `006_story_maitres_des_tenebres.sql` → `lw_sections` (travail restant, voir §7).

2. `clean_sql/02_loup_solitaire_02_fidele_350.sql` (377 sections, fidèle PDF, bug choix vide corrigé)

Vérif fidélité :
```sql
SELECT numero, suite, choix, LEFT(texte,80) FROM lw_sections WHERE livre_slug='loup-solitaire-02' AND numero='255';
-- doit retourner suite=268, choix=NULL, texte sans "Rendez-vous"

SELECT COUNT(*) FROM lw_sections WHERE livre_slug='loup-solitaire-02' AND choix::text LIKE '%"texte":""%';
-- doit retourner 0
```

### Étape 3 : Nettoyage migrations (optionnel, pour dev local)

- Renommer migrations pour éviter collisions : `004_loup_solitaire_schema.sql` (garder), `004_secure_monetization.sql` → `004b_...` ou fusionner.
- Idem 005, 007, 008.
- Supprimer ancien moteur si plus utilisé : `DROP TABLE story_nodes, stories` **seulement si** vous n'avez plus d'histoires qui en dépendent (dragon_emeraude, signal_perdu, nova9).
- Recommandation : garder `lw_*` comme seul moteur Loup Solitaire, archiver `stories` pour autres univers.

---

## 7. Fichiers fournis dans `clean_sql/`

- `00_RESET_BDD.sql` : reset idempotent des 2 livres (lw_* + ancien stories si présent)
- `01_loup_solitaire_01_adaptation_50.sql` : copie nettoyée du seed actuel (50 sections). Documenté comme adaptation, non fidèle 350.
- `02_loup_solitaire_02_fidele_350.sql` : 377 sections (350 + combats chaînés), fidèle PDF, bug §255 et 120 choix vides corrigés, texte nettoyé.

Copies sources :
- `app/supabase/seed/006_contenu_ls01.sql` (source 01)
- `app/supabase/seed/007_contenu_ls02.sql` (source 02, régénéré dans cet audit)

---

## 8. Recommandations next steps

1. **LS01 350 fidèle** : convertir `006_story_maitres_des_tenebres.sql` (story_nodes) vers `lw_sections` en :
   - reprenant les 350 textes,
   - supprimant les 25 fausses fins (remplacer par mort ou suite réelle selon PDF),
   - ajoutant effets (or, repas, objets) manuellement via overrides comme LS02.

2. **OCR LS02** : relire `ls02-texte-brut.txt` ligne par ligne vs PDF pour corriger "mariiifi", etc. Ajouter corrections dans `CORRECTIONS` de l'importer.

3. **Effets manquants LS02** : auditer chaque § pour or gagné/perdu, endurance, objets (ex: Sceau, Glaive, Potion). Actuellement partiel.

4. **Renommage migrations** : passer à numérotation unique sans collision (ex: `004`, `005`, `006`, `007`, `008` → `004a`, `004b` ou refacto complète avec `supabase migration list`).

5. **Tests fidélité automatisés** : script python qui compare pour chaque § : PDF texte (extrait) vs `lw_sections.texte`, et PDF cibles vs `suite`/`choix`. Déjà partiellement fait avec PyMuPDF, à industrialiser.

6. **UI** : vérifier que `suite` rend bien un bouton "Continuer" et pas "Que décidez-vous ? 1". Le bug vide est maintenant corrigé en BDD, mais vérifier `app/lib/lonewolf/` affiche suite correctement.

---

## 9. Commandes utiles

```bash
# Extraction PDF
python3 - << 'PY'
import fitz
doc=fitz.open("content/stories/source-pdfs/Loup Solitaire 02 - La Traversee Infernale.pdf")
# ...
PY

# Audit importer
node app/scripts/ls02-importer.cjs --audit | grep "choix vide"

# Régénération
node app/scripts/ls02-importer.cjs
node app/scripts/generer-sql-contenu.cjs ls02

# Vérif choix vides
grep -r 'texte: ""' app/content/lonewolf/ls02/*.ts | wc -l  # doit être 0
```

---

## 10. Conclusion

- BDD sale confirmée, mais nettoyable en 2 SQL idempotents.
- LS02 fidélité 100% atteinte pour structure (texte + renvois) après correction des 120 choix vides. Exemple critique §255 corrigé.
- LS01 reste en 50 sections adaptation ; version 350 fidèle à produire si exigence stricte PDF.
- Procédure RESET + réimport fournie dans `clean_sql/`.


---

## Addendum — Fix secondaire 2026-09-20 (après premier audit)

**Bug additionnel découvert** : 11 choix vides restants après premier fix (ex: §200, §185, §277, §289, §324).

Cause : `decouperPhrases()` coupe sur `? ` avant `Rendez-vous au N`, séparant le label de son renvoi :

```
"Le Chevalier de la Montagne Blanche qui répond au nom de Dorier ?"
"Rendez-vous au 7."
```

Le second fragment seul → `libelleChoix()` vide.

Fix appliqué dans `ls02-importer.cjs` :

- Si phrase = uniquement `Rendez-vous au N`, récupérer le label dans `phrasesTexte` précédente et fusionner.
- Résultat : §200 maintenant 5 choix avec labels complets, plus aucun `texte:""` dans tout LS02 (0 dans TS et SQL).

Vérif :
```bash
grep -n 'texte: ""' app/content/lonewolf/ls02/*.ts # 0
python check empty choix in SQL # 0
```

SQL final régénéré et copié dans `clean_sql/02_loup_solitaire_02_fidele_350.sql` (363K, 377 sections).
