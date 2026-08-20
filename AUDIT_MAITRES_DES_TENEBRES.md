# 🔍 Audit complet — « Les Maîtres des Ténèbres » (Loup Solitaire 01)

> Audit réalisé le 2026-08-20 sur la branche `arena/01a01fbd-heros`.
> Méthode : extraction des 350 sections du PDF de référence
> (`content/stories/source-pdfs/Loup Solitaire 01 - Les Maitres des Tenebres.pdf`),
> reconstruction du graphe complet depuis la migration `006`, comparaison
> section par section, simulation de parties, relecture du moteur de jeu
> (`StoryPlayer.tsx`, Edge Functions `make-choice`, `game-setup-action`,
> `resolve-combat-round`) et exécution de la suite de tests existante (47/47 OK).

---

## 1. Résumé exécutif

Le symptôme rapporté — **« des fins de partie alors que ça ne devrait pas »** — est
confirmé et sa cause est identifiée : **la donnée d'aventure est corrompue**, pas
le moteur. La migration `006_story_maitres_des_tenebres.sql` contient :

| Gravité | Problème | Quantité |
|---|---|---|
| 🔴 Critique | Sections marquées `is_ending=true` (mort) **alors que le livre continue** | **25** |
| 🔴 Critique | Renvois du livre absents des choix en base (branches coupées) | **60** |
| 🔴 Critique | Sections **injoignables** depuis le début dans l'état actuel | **52** |
| 🟠 Majeur | Conditions de choix erronées (inversées, doublées, ignorées) | 5 |
| 🟠 Majeur | Mécanique de Table de Hasard non implémentée (données + serveur) | 19 sections |
| 🟠 Majeur | Combat perdu = **blocage définitif**, pas d'écran de fin | 1 mécanique |
| 🟡 Moyen | Pertes d'ENDURANCE narratives (« perdez X points ») non appliquées | ~15 sections |
| 🟡 Moyen | Choix conditionnels affichés à tous → erreur 422 au clic | ~30 choix |
| ⚪ Mineur | Conditions météo du livre non modélisées (repas, objets clés) | divers |

**Preuve par la simulation** (20 000 parties à choix aléatoires depuis la
section 1, graphe actuel) :

- **85,2 % des parties se terminent sur une FAUSSE fin** (mort affichée à tort)
- 14,3 % sur une vraie fin de mort du livre
- 0,5 % atteignent la victoire (section 350)

Après correction simulée du graphe (fins et renvois du livre), **une seule
section reste injoignable : la 251** — qui l'est aussi dans le livre papier
(anomalie héritée du matériau source, cf. §10).

**Bonne nouvelle : les 350 contenus textuels sont conformes au PDF**
(aucun désalignement section/texte détecté, ratio de similarité > 0,55 partout).
Seuls la topologie (renvois, fins) et certaines mécaniques sont cassés. Les
tests existants passent parce qu'ils valident des *quantités* (« fins = 42 »),
jamais la *fidélité* au livre (cf. §11).

---

## 2. 🔴 BUG PRINCIPAL — 25 fausses fins (`is_ending=true` à tort)

Ces sections sont marquées **mort** (`ending_type='death'`) et n'ont **aucun
choix sortant**, alors que le livre leur donne des renvois. En jeu : le contenu
de la section s'affiche, puis l'écran **« Dénouement tragique » 💀** apparaît.
C'est exactement le symptôme « fins de partie injustifiées ».

| § | Ce que dit réellement le livre | Gravité spécifique |
|---|---|---|
| 020 | Fouille d'une péniche, on trouve **Sac à Dos + 2 Repas + Poignard** → **rendez-vous au 272** | Mort en ramassant du loot |
| 036 | Échelle de la vieille tour : **Table de Hasard** : ≤4 → -2 END et 140 ; >4 → **323** | Mort + hasard cassé (cf. §6) |
| 039 | Les Kakarmis vous guident, vous prenez congé → **228** | Mort en disant merci… |
| 047 | Kraan + Gloks : attendre → **136** ou grimper → **322** | Mort sur un choix stratégique |
| 056 | Vous vous cachez dans les fougères → **222** | Mort en se cachant avec succès |
| 109 | Sous le tapis : de la poussière ! → **164** (bouteilles) ou **308** (écurie) | Mort sur de la poussière |
| 112 | **COMBAT** 2 GLOKS (13/10, 12/10) ; vainqueur → **33** ou **248** | 💀+⚔️ mort même en gagnant le combat |
| 124 | Vous trouvez **15 Couronnes + la Clé d'Argent** → **211** ou **106** | Mort + objet-clé inaccessible (cf. §5) |
| 150 | Pause dans une maison, eau claire, repos → **83** | Mort en se reposant |
| 160 | **Table de Hasard** : 0-4 repéré → 286 (vraie mort) ; 5-9 non repéré → **10** | 50 % de survie supprimée → mort automatique |
| 164 | Vous trouvez une **Potion d'Adgana** → **308** | Mort en trouvant une potion |
| 199 | Vous trouvez de quoi faire **un Repas** (cave) → **81** | Mort en mangeant |
| 208 | **COMBAT** GLOKS (15/13) ; vainqueur → **148** ou **320** | 💀+⚔️ mort même en gagnant |
| 225 | Dialogue avec les Kakarmis : ami → **187** ou Seigneur Kaï → **39** | Mort en parlant |
| 229 | Le Kraan vous couvre de poussière puis s'éloigne : fouiller son sillon → **267**, ou poursuivre → **125** | Mort en étant épargné par le monstre |
| 237 | Camouflage + **Table de Hasard** : 0-4 → **265**, 5-9 → **72** | Mort automatique, hasard supprimé |
| 243 | Vous découvrez un cadavre et **une arme à prendre** → **97** | Mort en ramassant une arme |
| 263 | Cadavre de Kraan dans le cours d'eau : suite vers l'est → **70** ou vers le sud → **157** | Mort de simple exploration |
| 276 | Traversée de ronces : -1 END → **213** | Mort sur une égratignure |
| 300 | Longue marche, il faut **prendre un Repas** → **13** | Mort sur une pause casse-croûte |
| 301 | L'Orientation vous guide vers le sud → **27** | Mort grâce à une discipline qui réussit |
| 336 | **COMBAT** 2 GLOKS (14/11, 13/11) ; vainqueur → libérer le soldat **117** | 💀+⚔️ mort en sauvant un soldat |
| 343 | Traversée difficile : -2 END → **213** | Mort sur une éraflure |
| 345 | Vous restez caché sous votre capuchon : Kraan et Gloks s'éloignent → **272** ou **19** | Mort alors que la cachette réussit |
| 348 | Marais aux Kourshas, repli stratégique → **95** | Mort en faisant demi-tour prudemment |

**Effets de bord** : chaque fausse fin est enregistrée comme « fin découverte »
côté serveur (`make-choice` → endings/rewards), ce qui pollue les statistiques
de progression et les succès du joueur.

> À noter : les **17 vraies fins du livre** (53, 54, 60, 108, 127, 154, 185,
> 219, 234, 259, 271, 286, 292, 306, 309, 327 + victoire 350) sont, elles,
> **toutes correctement marquées**. Aucune fin réelle n'a été oubliée.

---

## 3. 🔴 60 renvois manquants — branches de l'aventure coupées

Le générateur a perdu des embranchements entiers. Tableau complet (sections
hors fausses fins — celles du §2 cumulent le même problème) :

| § | Renvois du livre | Choix en base | Manquant / conséquence |
|---|---|---|---|
| 019 | 272 / 119 / 69 (Orientation) | **69** (condition Orientation) | 272, 119 → **sans Orientation : blocage total** |
| 021 | 189 (cheval enlisé) + mort si ≠9 + 312 si 9 | 312 seul | Branche risque/mort absente : passage garanti |
| 050 | 97 / 243 | 97 | 243 (éviter la bataille) |
| 052 | 225 (Comm. Animale) / **250** sinon | 225 (condition CA) | **sans CA : blocage total** |
| 105 | **298** (avec CA) / 335 (sinon) | 335 **étiqueté à tort « Condition : CA »** | Condition inversée : avec CA on perd la branche 298 ; sans CA : blocage |
| 119 | 226 / 38 | 226 | 38 (chemin prudent) |
| 128 | 297 (Chasse) / **336** sinon | 297 (condition Chasse) | **sans la Chasse : blocage total** |
| 130 | 28 / 201 | 201 | 28 (sortie sud) |
| 148 | 81 / 320 / 199 | 81, 199 | 320 (refuge en forêt) |
| 169 | 23 (**fuite autorisée**) / 137 victoire | 137 | Fuite impossible |
| 173 | **158 (avec Clé d'Argent)** / 259 sinon | 259 inconditionnel | cf. §5 — mort systématique même avec la clé |
| 191 | 24 victoire / **234 fuite** | 24 | Fuite impossible |
| 196 | 332 / 144 | 332 | 144 (rebrousser chemin) |
| 200 | 78 / **168 (Camouflage)** | 78 | Branche Camouflage perdue |
| 210 | 332 / 37 | 332 | 37 (méfiance) |
| 220 | 24 / **234 fuite** | 24 | Fuite impossible |
| 231 | 94 / 203 / **7 fuite après 2 assauts** | 94, 203 | Fuite impossible |
| 262 | 191 / **234 éviter le combat** | 191 | Évitement impossible |
| 272 | 134 (Orientation) / **305 sinon** | 134 (condition Orientation) | **sans Orientation : blocage total** |
| 308 | 122 (CA) / **233 sinon** | 122 (condition CA) | **sans CA : blocage total** |
| 334 | 162 / 73 (Camouflage) / 48 (6e Sens) | 162 + 48 (exige **Camouflage ET 6e Sens**) | Double condition fausse + 73 manquant (cf. §4) |
| 339 | 94 / 203 / **7 fuite à tout moment** | 94, 203 | Fuite impossible |

**5 sections bloquent totalement un joueur sans la discipline requise**
(019, 052, 128, 272, 308) : un seul choix proposé, refusé par le serveur
(`422 requirement_not_met`), aucune alternative → la partie est *de facto*
terminée, sans même un écran de fin explicite.

---

## 4. 🟠 Conditions de choix erronées

| § | Problème | Détail |
|---|---|---|
| 105 | **Condition inversée** | Le choix → 335 porte `flag_require discipline_communication_animale=TRUE`, alors que le livre envoie au 335 *sans* la discipline (et au 298 *avec*) |
| 334 | **Double condition fausse** | Le choix → 48 exige Camouflage **ET** Sixième Sens (`flag_require` x2) ; le livre : 73 si Camouflage, 48 si Sixième Sens (2 branches distinctes, dont la 73 absente) |
| 173 | **Condition objet ignorée** | Le choix → 259 est inconditionnel (flavor « Condition d objet indiquée dans la section » mais **aucun effet**). Il manque la branche 158 avec `inventory_require` sur la `cle-argent` |
| 091 | OK finalement | Faux positif de l'audit automatisé (césure OCR « a u 7 ») — choix DB 152/7/198 conformes ✅ |

---

## 5. 🟠 Cas d'école — la Clé d'Argent (objet existant mais inutilisable)

L'objet `cle-argent` **existe en base** (migration 006) mais :
1. il n'est **jamais attribué** (aucun effet `inventory_add` nulle part) ;
2. il n'est **jamais testé** (aucun `inventory_require`) ;
3. la section qui le donne (**124**) est une fausse fin ⇒ mort en la trouvant ;
4. la section qui l'utilise (**173**) envoie tout le monde mourir en **259**.

Chaîne de conséquence : un objet clé du livre est actuellement un **pipeline de
mort garantie**. Le tableau des combats montre d'ailleurs que la clé ouvre un
chemin réel : 124 → 211 (tunnel) → … → 173 → 158 (vieillard, -6 END) → 106.

---

## 6. 🟠 Mécanique de Table de Hasard : front OK, logique absente

Le jeu affiche un bouton « 🎲 Lancer la Table de Hasard » quand le texte de la
section contient « Utilisez la Table de Hasard pour obtenir… ». Mais :

- **Aucune section n'a de métadonnées `hazard_consequences`** (mécanisme
  générique prévu dans `game-setup-action` mais jamais alimenté) ;
- le seul cas traité côté serveur est un **hack codé en dur pour la section 36**
  (id par `node_key`, libellé « vieille tour de guet ») ;
- le seul cas traité côté client est le même (fallback local) ;
- donc sur les **14 autres sections à hasard, lancer le dé ne fait rien** —
  le serveur renvoie `node: null`, aucun effet ;

et, pire :

| Comportement actuel | Sections |
|---|---|
| Hasard transformé en **choix libres** (le joueur choisit sa chance, dont éviter la branche mort) | 2, 7, 17, 22, 44, 49, 89, 205, 226, 275, 279, 294, 302, 314, 337 |
| Hasard + **fausse fin** : écran de mort ET bouton de dé affichés ensemble | 36, 160, 237 |
| §237 : libellé « Utilisez **à présent** la Table de Hasard » → qui ne matche **pas** le détecteur côté UI ⇒ pas de bouton, aucun choix, mort sèche | 237 |
| §275 : OCR conservé « pour obten**u** un chiffre » → qui ne matche pas le détecteur ⇒ pas de bouton (choix libres affichés) | 275 |

Cas notables :
- **§160** : le livre offre 50 % de chances de survie (5-9 → §10). En base :
  `is_ending=true` sans choix ⇒ **exécution automatique**, le dé ne marche pas.
- **§021** : double tirage avec risque de mort definitive — réduit à un seul
  choix → 312 (survie garantie), et la branche 189 (enlisement) est absente.
- **§017 / §089** : les branches « 0 → 53 (vraie mort) » sont des **choix
  libres** — personne ne les prendra volontairement.

---

## 7. 🟠 Combats

Moteur (`resolve-combat-round`) globalement fonctionnel (table des coups,
quotient d'attaque, multi-ennemis). Problèmes détectés :

1. **Combats sur sections faussement mortes (112, 208, 336)** : le panneau de
   combat s'affiche, le joueur **gagne**, puis l'écran 💀 apparaît quand même
   (`is_ending=true` prime sur `isCombatMode` à la fin du combat). Mort après
   victoire garantie.
2. **Défaite = blocage définitif** : quand l'END tombe à 0, le client affiche
   « Vous avez succombé au combat… » mais **ne bascule sur aucune fin** : pas
   d'écran de fin, pas de bouton recommencer. Le bouton Attaquer reste visible ;
   chaque nouveau clic renvoie `422 player_dead — « Vous êtes déjà mort »`.
   La partie est morte sans écran de mort. (Les règles du livre : END=0 ⇒ mort
   ⇒ fin de partie — l'app ne le matérialise pas.)
3. **Fuite non fonctionnelle** : le bouton « Fuir (si autorisé) » appelle
   `resolve-combat-round` avec `escape=true`, ce qui résout **un round de plus**
   (le joueur encaisse, l'ennemi non) — sans jamais **naviguer** vers la
   section de fuite du livre (169→23, 191→234, 231/339→7, *etc.*). Ces renvois
   de fuite sont par ailleurs **absents des choix** (cf. §3), donc fuir est
   impossible partout, contrairement au bouton affiché.
4. Immunités psychiques (règle Loup Solitaire : certaines créatures insensibles
   à la Puissance psychique) — non modélisées dans les métadonnées combatants.
   (À confirmer si voulu dans le rulebook `combat_table`.)

---

## 8. 🟡 ENDURANCE narrative jamais appliquée

Aucun effet `stat_modifier` dans toute la migration (0 occurrence). Toutes les
phrases « vous perdez X points d'ENDURANCE » du livre hors combat sont du texte
mort :

- §158 : -6 END (éclair du vieillard) puis -4 END conditionnels — ignorés ;
- §276 : -1 END ; §343 : -2 END ; §021/036 : -2 END chute ; §300 : repas
  obligatoire sinon -3 END ; §188 : -3 END ; §050… etc.

Conséquence : le niveau de danger réel du jeu est **plus faible** que le livre,
et les Guérison/Repas/discipline Chasse perdent leur rôle. (Seuls les combats
et les potions modifient l'END aujourd'hui.)

---

## 9. 🟡 Problèmes UI / moteur connexes

1. **Choix conditionnels affichés à tout le monde** (`StoryPlayer` n'applique
   aucun filtre client sur `flag_require`) : le joueur clique, reçoit
   `422 Condition narrative non remplie` en toast, reste sur place. Devrait
   griser/masquer ces choix (et indiquer la discipline requise) — sinon les
   sections à **choix unique conditionnel** (019, 052, 128, 272, 308) sont des
   blocages muets pour qui n'a pas la discipline.
2. **Écran de fin + panneau hasard cohabitent** (§36/160/237) : le renderer du
   hasard n'est pas inhibé par `isEnding`.
3. **`isEnding` déduit de `node_key` « victoire » / « game_over »** : code
   mort pour cette histoire (clés `section_350`), inoffensif mais à nettoyer.
4. Le détecteur de hasard compare une chaîne littérale fragile
   (« Utilisez la Table de Hasard pour obtenir un chiffre ») sensible aux
   variantes de texte (§237, §275) — à remplacer par `metadata.hazard_*`.
5. `readingProgress` utilise `pageNumber` qui s'incrémente même sur les
   allers-retours — progression trompeuse. (Mineur.)
6. Démarrage : `init-game` lance HAB=10+dé, END=20+dé ✅ (règles respectées) ;
   chaîne de setup (5 disciplines, équipement Table de Hasard) fonctionnelle ✅.

---

## 10. ⚪ Curiosité héritée du livre source

- **§251** est **injoignable aussi dans le livre papier** (aucune section ne
  renvoie à 251 ; son texte « Vous avez de la chance : ils ne semblent pas vous
  avoir repéré… » est un vestige éditorial connu des premières éditions).
  Ne pas « corriger » : conforme à la source.
- Les 17 vraies fins + la victoire §350 sont correctement marquées ✅.

---

## 11. Pourquoi vos tests n'ont rien vu

La suite `test-migrations.mjs` (47/47 ✅) vérifie :

- « tous les renvois ont une cible dans l'histoire » → vrai (aucune cible
  orpheline) mais ne vérifie pas la **complétude** (renvois absents) ;
- « fins du PDF conservées — fins=42 » → compte le nombre de fins sans valider
  **que ce sont les bonnes** (vrai livre : 17 fins de mort + 1 victoire) ;
- aucune assertion de **joignabilité** (les 52 sections injoignables passent
  inaperçues) ni de **cohérence contenu/flag** (« fin marquée mort sans phrase
  de mort dans le texte »).

**Assertions recommandées** (ajoutables à `test-migrations.mjs`) :
1. tout nœud `is_ending` a 0 choix ET son contenu contient une formule de fin
   (« Votre mission… », « Votre aventure… », liste blanche) ;
2. tout nœud non-ending a ≥ 1 renvoi, et l'ensemble des `references` de la
   metadata coïncide avec les choix créés ;
3. 100 % des sections sont joignables depuis `section_001` (sauf liste blanche
   = {251}) ;
4. chaque section avec « Utilisez la Table de Hasard » a des
   `hazard_consequences` cohérentes avec son texte ;
5. chaque combatant valide une section « HABILETÉ x / ENDURANCE y » du texte.

---

## 12. Plan de correction recommandé (par ordre)

1. **Migration 010 — données** *(bloquant, impact immédiat)* :
   - `is_ending=false, ending_type=NULL` sur les 25 fausses fins ;
   - recréer les **60 renvois** manquants (avec texte « Rendez-vous au X »,
     flavor « Renvoi du livre. », `display_order` croissant — style existant) ;
   - corriger les 3 conditions : §105 (retirer le `flag_require` sur →335,
     créer →298 avec condition CA), §334 (48 = 6e sens seul, ajouter 73 =
     Camouflage), §173 (→158 avec `inventory_require` cle-argent ; →259 sinon) ;
   - attribuer la Clé d'Argent : `inventory_add` sur le choix §59→§124 (ou sur
     les choix de sortie de §124) ;
   - ajouter les `metadata.hazard_consequences` sur les sections à hasard
     (source de vérité : le PDF) et **supprimer le hack §36** ;
   - marquer les choix de fuite de combat (flag `flee` / métadonnée
     `flee_target`) ou les créer comme choix classiques conditionnés.
2. **Moteur** :
   - `StoryPlayer` : après défaite de combat (`winner !== 'player'`), afficher
     l'écran de fin (ou rediriger vers un nœud mort) au lieu du soft-lock ;
   - filtrer/griser côté client les choix dont les `flag_require` ne sont pas
     remplis (afficher la discipline requise) ;
   - inhiber le panneau hasard quand `isEnding`.
3. **Règles** : implémenter les `stat_modifier` d'ENDURANCE narrative (repas,
   éclairs, éraflures) et l'immunité psychique.
4. **Tests** : ajouter les 5 assertions du §11 à `test-migrations.mjs` (j'ai
   les scripts d'analyse prêts à convertir en assertions).

---

## Annexe A. Données brutes de l'audit

- 350/350 sections extraites du PDF et alignées avec les contenus en base ✅
- Graphe extrait : 357 nœuds, 554 choix, 164 effets (`flag_require/flag_set`)
- 42 fins en base = 17 vraies + **25 fausses** ; 60 renvois manquants ;
  52 sections injoignables (contre 1 justifiée après correction)
- Table machine-lisible complète disponible sur demande
  (`audit_table.json`, `diff_report.json` — générés pendant l'audit).

---

## 13. ✅ Correctifs appliqués *(20/08/2026)*

L'ensemble des corrections du §12 a été appliqué. Détail :

### 13.1 Données — migration `010_fix_maitres_des_tenebres_fidelite.sql`

| Correctif | Détail |
|---|---|
| **25 fausses fins neutralisées** | `is_ending=false, ending_type=NULL` sur §20, 36, 39, 47, 56, 109, 112, 124, 150, 160, 164, 199, 208, 225, 229, 237, 243, 263, 276, 300, 301, 336, 343, 345, 348 |
| **~43 renvois recréés** | Avec le libellé « Rendez-vous au N » du livre et les conditions `flag_require` (§200→§168 Chasse, §334→§73 Camouflage, §105→§298 Communication Animale…) |
| **36 choix-hasard gratuits supprimés** | Remplacés par `metadata.hazard_consequences` sur **21 sections** (2, 7, 17, 21, 22, 36, 44, 49, 89, 158, 160, 188, 205, 226, 237, 275, 279, 294, 302, 314, 337) — les plages 0-9 recopiées du livre |
| **§21 (chaîne à 3 étages)** | Nœuds synthétiques `section_021_enlisement` / `section_021_derniere_chance` / `section_021_mort` : enlisement (0-4) → aisselles (0-7) → 9 = survie → §312, sinon noyade |
| **Clé d'Argent fonctionnelle** | `inventory_add cle-argent` sur les sorties de §124 ; §173→§158 exige la clé (sinon →§259, mort du livre) avec `-6 END` comme le texte |
| **Conditions corrigées** | §105→§335 : condition `discipline_communication_animale` **retirée** du « sinon » ; §334→§048 : ne demande plus que Camouflage ; §334→§073 créé avec Sixième Sens |
| **7 combats multi-ennemis rétablis** | `combatants` sur §112, 136, 138 (GLOK ×2), §180 (chef + 2 soldats), §253 (4 Loups Maudits), §260, §336 |
| **Fuites de combat** | `metadata.combat.flee` avec cible du livre et nombre d'assauts min. : §169→23 (1 assaut), §180→22, §191→234, §220→234, §231→7 (2 assauts), §339→7 (libre) |
| **Victoires rapides** | `victory_rules` sur §231/§339 : tuer en ≤4 assauts → §94, sinon →§203 (flags + conditions) |
| **ENDURANCE narrative (partiel)** | Dégâts du livre appliqués là où ils sont décisifs : §2 (-2/-1), §36 (-2), §158 (-4), §188 (-3) |
| **Mort à END ≤ 0** | Nœud système `mort_epuisement` (tu mènes ta quête… trop loin) ; `stories.total_endings` mis à jour (19 = 17 morts du livre + victoire §350 + mort système) |

### 13.2 Moteur de jeu

| Fichier | Correctif |
|---|---|
| `game-setup-action/index.ts` | Résolution générique de `hazard_consequences` (le **hack codé en dur §36 est supprimé**), END=0 → redirection `mort_epuisement`, nouvelle action **`combat_flee`** (assaut de fuite : dégâts sans riposte + navigation vers la cible du livre), suivi `round_count` |
| `make-choice/index.ts` | Après application des effets, **hp ≤ 0 → nœud mort** au lieu de continuer l'aventure |
| `resolve-combat-round/index.ts` | Comptage des assauts, pose des flags `combat_rapide_231/339`, défaite → progression déplacée vers `mort_epuisement` + réponse `player_died` + `death_node` (plus de `422` soft-lock) |
| `StoryPlayer.tsx` | **Écran de fin sur défaite** (au lieu du blocage), **bouton Fuir** piloté par les métadonnées (cible + assauts min. + libellé dynamique), choix à condition **grisés** « 🔒 Condition non remplie » quand la discipline/objet manque, panneau hasard masqué sur les fins |

### 13.3 Validation

| Vérification | Résultat |
|---|---|
| Suite de tests PGlite (`npm run test:db`) | **58/58 ✅** (dont 11 nouvelles assertions « Fidélité » : liste exacte des 19 fins, aucune impasse, accessibilité BFS = seul §251 injoignable comme dans le livre, renvois, hasards, multi-combats, fuites, conditions, Clé d'Argent) |
| `tsc --noEmit` | ✅ 0 erreur |
| **Simulation de 30 000 parties** sur le graphe migré | **0 mort sur les 25 anciennes fausses fins** ; 57,7 % morts prévues par le livre, 36,7 % morts au combat (END≤0), 5,7 % victoire §350 — cohérent pour des choix aléatoires |

### 13.4 Limites connues au sortir de la passe 1 — **toutes levées en passe 2 (§14)**

### 13.5 Déploiement

Les correctifs sont commitables tels quels ; pour les appliquer en production :
`supabase db push` (migrations 010 à 012) puis déploiement des 3 Edge Functions
modifiées (`game-setup-action`, `make-choice`, `resolve-combat-round`), et
déploiement du front. Les parties en cours reprendront avec des données
cohérentes (les joueurs bloqués sur une ancienne fausse fin verront la section
se débloquer au rechargement).

---

## 14. ✅ Passe 2 — règles complètes du livre *(20/08/2026)*

Relecture complète du PDF sur les mécaniques restantes. Bilan : les 4 limites
du §13.4 sont levées, et la passe a mis au jour **7 verrous de conditions
inversés supplémentaires** (même famille que §105/§334 — des sorties « sinon »
ou post-combat qui exigeaient la discipline/l'objet à l'encontre du livre).

### 14.1 🔴 Verrous inversés corrigés (7 nouveaux)

| Section | Condition aberrante | Livre |
|---|---|---|
| §9 → 292 | Exigeait la Pierre de Vordak | « Si vous possédez une Pierre → 236. **Sinon → 292** » |
| §133 → 266 | Exigeait la Puissance Psychique | Sortie post-combat libre (le Serpent est *insensible* !) |
| §255 → 82 | Exigeait la Puissance Psychique | Idem (le Gourgaz est *insensible* !) |
| §283 / §342 → 123 | Exigeaient le Bouclier Psychique | Sortie post-combat libre |
| §88 → 31 | Exigeait la Guérison | « **Sinon** → 31 » |
| §162 → 127 | Exigeait la Maîtrise Psychique de la Matière | « **Sinon** → 127 » (mort !) |
| §242 → 9 | Exigeait le Bouclier Psychique | « Dans le cas contraire → 9 » |
| §303 → 72 | Exigeait le Camouflage | « **Sinon** → 72 » |
| §173 → 259 | Exigeait la Clé d'Argent | « Si vous n'avez **pas** cette Clé → 259 » |

Sans la discipline/l'objet, **le joueur n'avait plus aucune sortie** (impasse
grisée + 422). Un test de non-régression garantit désormais qu'aucun nœud
vivant n'a toutes ses sorties conditionnées sans paire complémentaire.

### 14.2 🟠 Règles du livre implémentées

| Mécanique | Détail |
|---|---|
| **Repas obligatoires** | §§37, 130, 147, 168, 184, 235, 300 : consomme 1 Repas ; à défaut **-3 END**, sauf si discipline **Chasse** (dispense du livre) |
| **Couronnes** | Objets tracked avec **plafond 50** (règle du livre) ; butins §62 (+28), §124 (+15), §184 (+40), §291 (+6) ; achats conditionnés §12 (-10 → 262) et §46 (-2 → 246) via nouvel effet `inventory_remove` |
| **Sac à Dos** | §188 (hasard 0-6) : le Kraan le déchire, **contenu perdu** (repas, torches, briquet, laumspur) ; §162 (capture Drakkarims) : perte du Sac à Dos **et des Armes**, or conservé — jamais restitué (§258), comme dans le livre |
| **Butins d'objets** | §20 (2 Repas + Poignard), §62 (3 Repas), §113 (2 doses de Laumspur), §347 (Torche + Briquet à Amadou + Sabre), §76 et §304 (**Pierre de Vordak**) ; tirage d'équipement initial corrigé (« Deux Repas » +2, « Douze Couronnes » +12 étaient ignorés) |
| **Pierre de Vordak** | Distribuée aux §76/§304 → rend le §9→236 **jouable** ; détruite au §236 avec -6 END et **-1 HABILETÉ permanent** ; §212 : guérison complète |
| **Immunité psychique** | Gourgaz §255, Serpent Ailé §133, Gluâtre §170, Vordak §342 : la Puissance Psychique n'apporte plus le +2 (note affichée) |
| **Assauts psychiques Vordak** | §29, §34, §283, §342 : **-2 HABILETÉ sans Bouclier Psychique** pendant le combat ; §283 : dès le 2ᵉ assaut seulement, avec **+2 de surprise au 1ᵉ assaut** |
| **Conditions de combat** | §170 : **-3 HAB dans le noir sans Torche** ; §17 : -1 HAB gêné par les ailes du Kraan |
| **Vipère §227** | Tuée **sans perdre aucun point d'ENDURANCE** → 348, sinon → 271 (flag posé par le moteur de combat) |
| **Blessures narratives d'arrivée** | 13 sections appliquent enfin leurs dégâts : §76/-2, §119/-2, §144/-2, §146/-3, §166/-4, **§203/-10**, §236/-6, §276/-1, §304/-2, §308/-1, §313/-1, §320/-2, §343/-2 — la mort éventuelle redirige vers `mort_epuisement` |

### 14.3 🔧 Moteur

- Nouveau module partagé `supabase/functions/_shared/arrival.ts`
  (`metadata.on_arrive` générique : repas, blessures, soin, butins,
  destructions) est appelé par `make-choice`, le hasard **et** la fuite ;
- `make-choice` : quantités sur `inventory_add`/`inventory_require`
  (`stat_value`), nouvel effet `inventory_remove` (migration 011 — enum
  isolée, PostgreSQL interdit l'usage d'une valeur d'enum créée dans la
  même transaction) ;
- `resolve-combat-round` : **bug latent corrigé** — les bonus de
  disciplines (Puissance Psychique, Maîtrise des armes) n'étaient *jamais
  détectés* car les flags sont stockés avec le préfixe `discipline_` ;
  + règles par ennemi et flag « victoire sans blessure » ;
- Client : choix à **quantité** requise grisés (10 Couronnes…), notes de
  combat (immunités, assauts psychiques) affichées, inventaire
  resynchronisé après repas/achats/destructions ;
- Migrations `011_livre_fidelite_passe2_enum.sql` et
  `012_livre_fidelite_passe2.sql`.

### 14.4 Validation

| Vérification | Résultat |
|---|---|
| Suite PGlite (`npm run test:db`) | **74/74 ✅** (16 nouvelles assertions passe 2 : verrous, économie, butins, arrivées, combats, impasses) |
| `tsc --noEmit` | ✅ 0 erreur |
| **Simulation 30 000 parties** (avec repas, or, pierre, verrous) | ✅ **0 fausse fin, 0 blocage** ; 60,0 % morts du livre, 35,6 % morts système (combat/faim/blessures), 4,5 % victoire §350 |

### 14.5 Limites résiduelles assumées (confort, hors scope livre-strict)

- **Capacité du Sac à Dos (8 objets) et max 2 armes** non bloquants ;
- **Utilisation active** de la Potion de Guérison (+4 END) et du Laumspur
  (+3 END) : présents en inventaire avec leurs descriptions, mais sans
  bouton « utiliser » (le moteur n'a pas d'action d'usage hors combat) ;
- Bonus d'arme précis de la **Maîtrise des armes** (+2 uniquement avec
  l'arme maîtrisée) : appliqué globalement si la discipline est connue ;
- L'**Épée du Prince** (§255) est ramassable dans le texte mais ne
  confère aucun bonus chiffré dans l'édition française : non modélisée.
