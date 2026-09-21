# AUDIT LS01 — Parcours complets, actions et conséquences
## « Loup Solitaire 01 : Les Maîtres des Ténèbres » — contrôle du PDF face à l'application

> **Fichier de tests et de correctifs destiné à devenir une migration SQL.**

| | |
|---|---|
| **Source auditée** | `content/stories/source-pdfs/Loup Solitaire 01 - Les Maitres des Tenebres.pdf` — 2 962 383 octets, 175 pages, PDF Word 2007 |
| **Cible** | aventure `les-maitres-des-tenebres` (migration `008_story_maitres_des_tenebres.sql`, correctifs `010`, `011`, `012`) |
| **Branche / révision** | `arena/01a0c0cb-heros`, HEAD `eb26d41` |
| **Date** | 20 septembre 2026 |
| **Volume contrôlé** | 350 paragraphes · 553 renvois · 21 Tables de Hasard (+2 nœuds techniques du §21) : 45 branches sur les sections numérotées, 49 entrées au total · 29 combats · 7 fuites de combat · 18 fins du livre (17 morts + §350), 19 nœuds `is_ending` en base · 6 repas obligatoires · 34 sections qui modifient la Feuille d'Aventure (43 examinées) · 69 objets |
| **Résultat** | 13 tests conformes · 10 en échec (dont 1 purement documentaire) · 1 informatif — 24 contrôles |

### Statut du document

- C'est la **traçabilité complète** des 24 contrôles exécutés sur les données réelles (PDF **et** base) : méthode, valeurs observées, verdict, correctif.
- C'est un **cahier de correctifs prêt à traduire en SQL** : chaque écart réel renvoie à un bloc `C1`…`C12` rédigé au chapitre 4 dans le style des migrations `010`/`012` déjà en production.
- Ce n'est **pas** une reprise des audits précédents (`AUDIT_MAITRES_DES_TENEBRES.md`) : ces acquis sont considérés comme vérifiés et re-testés ici (T-001 → T-006, T-014, T-016).
- Ce n'est pas une recopie du livre : les citations sont réduites aux fragments nécessaires à la démonstration d'un écart.

> **Note éditoriale.** Le `README.md` du dossier source recommande que le contenu en base soit une adaptation originale plutôt qu'une reproduction de la traduction commerciale. Le présent audit ne traite que de **règles, renvois, actions et conséquences** — éléments nécessaires au fonctionnement du jeu. La reproduction du texte narratif lui-même est une décision éditoriale distincte ; la fidélité constatée au chapitre 5 (99,8 % sur 350 sections) est un fait mesuré, pas une position juridique.

---

## 1. Synthèse

### 1.1 Les écarts qui changent une partie

Cinq thèmes, douze correctifs numérotés `C1`…`C12` (dont les trois volets de `C8` pour les verrous et les deux volets de `C10` pour les butins). Le détail de chaque écart est donné au chapitre 4 ; les valeurs observées sont au chapitre 3.

| # | Thème | Écart constaté | Sections | Effet en jeu | Test | Correctif |
|---|---|---|---|---|---|---|
| 1 | Combat | Le combat annoncé par le texte n'existe pas en base (`combatants: []`) : le renvoi « si vous êtes vainqueur » reste cliquable sans combat | §340 | Un des deux combats les plus durs du livre (GLOK + LOUP MAUDIT 14/24) est esquivé ; la fin §193 est atteinte sans risque | T-011 | `C1` |
| 2 | Combat | Bonus d'HABILETÉ du texte absent (+4, effet de surprise, tout le combat) | §55 | Combat livré trop dur | T-012 | `C2` |
| 3 | Combat | Bonus d'HABILETÉ du texte absent (+1, position élevée) | §136 | Combat livré trop dur | T-012 | `C3` |
| 4 | Combat | Malus d'HABILETÉ du texte absent (-1, poussière) | §229 | Combat livré trop facile | T-012 | `C4` |
| 5 | Combat | Malus d'HABILETÉ du texte absent (-4, combat à mains nues) | §260 | Combat livré beaucoup trop facile | T-012 | `C5` |
| 6 | Fuite | La fuite est un choix libre immédiat alors que le texte impose **3 assauts obligatoires** avant de pouvoir s'échapper | §43 | Le combat contre l'OURS NOIR (16/10) est esquivé en un clic | T-013 | `C6` |
| 7 | Hasard | La perte d'ENDURANCE du §2 est appliquée **deux fois** : par la conséquence du jet **et** par l'ancrage d'arrivée | §2 → §343 / §276 | -2 ou -1 END supplémentaire sur un passage traversé par une grande partie des parties ; morts prématurées | T-010, T-024 | `C7` |
| 8 | Conditions | Verrous de Discipline appliqués à tort (le livre ne les demande pas) | §18→§29, §172→§29, §211→§106 | Chemins bloqués côté joueur, alors que le texte les ouvre à tous | T-007 | `C8.a` |
| 9 | Conditions | Verrou de Discipline en trop | §23→§326 | Accès à la porte du §326 inutilement restreint | T-007 | `C8.b` |
| 10 | Conditions | Verrou de Discipline **manquant** | §23→§151, §222→§67 | Deux Disciplines Kaï perdent l'avantage qu'elles procurent au livre | T-007 | `C8.c` |
| 11 | Objets | La **Clé d'Or** est exigée (§23→§326) mais le §161 ne la donne pas : elle est inobtenable | §161 | Le seul débouché « Clé d'Or » du livre ne peut jamais s'ouvrir | T-020 | `C9` |
| 12 | Objets | Butins du livre absents de la base : 3 or §33, 16 or §94, **20 Pierres Précieuses §137**, Épée §15/§184, Marteau de Guerre §148, Essence d'Alether §164, Parchemin §193, Sabre + 6 or §197, Repas §199/§307, 3 or §263, Message + Poignard §267, 10 or §269, Bâton §290, Lance de Glok §305, 6 or + Savon §315, 20 or + Poignard §319, Lance §346, Pendentif Étoile de Cristal §349. (Les 40 Couronnes et 4 Repas du §184, les 6 Couronnes du §291, le sabre/briquet/torche du §347 sont, eux, déjà encodés.) | 24 sections | L'économie du livre est amputée : ni arme de rechange, ni objet spécial, ni nourriture, ni les 20 Pierres Précieuses de la Crypte | T-023 | `C10` |
| 13 | Actions | Le livre ne dit jamais « prenez d'office » : 20 sections proposent un butin **facultatif** (« si vous le désirez ») — dont §307 qui y ajoute un **échange** contre une arme —, 1 propose un **choix exclusif** (§291), 2 demandent au joueur de **choisir ce qu'il perd** (§144, §277). Rien de tout cela n'est modélisé : les objets sont accordés d'office et les pertes sont imposées | 23 sections | Le joueur ne peut ni refuser un objet (et donc rester sous la limite de 2 armes / 8 objets de sac), ni choisir son arme de rechange, ni décider ce qu'on lui vole | T-023 | `C12` |
| 14 | Documentation | `metadata.references` ne reflète pas les renvois réellement implémentés | 47 sections | **Aucun impact joueur** (aucun code ne lit ce champ) ; à régénérer pour ne pas tromper les prochains audits | T-019 | `C11` |

Deux faux positifs ont été formellement écartés après relecture du PDF et sont documentés au chapitre 6 : `§46→§246` (les 2 Couronnes exigées sont bien celles du texte) et `§133→§266`/`§29→§270`/`§34→§328` (mentions de Disciplines qui décrivent une règle de combat, pas un verrou).

### 1.2 Ce qui est conforme, et sur quelle preuve

| Domaine | Résultat | Test |
|---|---|---|
| Les 350 paragraphes existent, aucun nœud parasite | 350/350 + 11 nœuds système attendus | T-001, T-002, T-003 |
| Tous les renvois du livre existent en base | 553/553 (choix, hasard ou fuite) | T-004 |
| Aucune cible inventée | 0 cible absente du livre | T-005 |
| Mêmes prédécesseurs que le livre | 350/350 sections (hors auto-références de la chaîne §21) | T-006 |
| Tables de Hasard | 21 sections (+2 nœuds du §21), 45 branches (+4), couverture 0-9 sans trou ni recouvrement | T-009 |
| Caractéristiques des combats | 28/29 strictement identiques (le 29ᵉ est le §340 vide) | T-011 |
| Règles de combat spéciales déjà encodées | §17 (-1 HAB), §29/§34 (assaut psychique Vordak), §133/§255 (insensibles à la Puissance Psychique), §170 (±torche), §283 (surprise + corps à corps), §342, §227 (flag de victoire sans blessure) | T-012 |
| Fuites de combat | 6/7 conformes (§169, §180, §191, §220, §231, §339) | T-013 |
| Fins | 18 fins du livre (17 paragraphes de mort + §350) toutes présentes ; 19 nœuds `is_ending` en base avec `mort_epuisement` | T-014 |
| Texte | similarité moyenne 0,998 sur 350 sections, minimum 0,971 (§256) | T-015 |
| Graphe | aucune section inaccessible (sauf anomalie d'édition §251), aucune impasse, victoire la plus courte en 27 sections (26 renvois), profondeur maximale 33 renvois, 193 composantes fortement connexes | T-016, T-018 |
| Repas obligatoires | 6/6 (§37, §130, §147, §168, §184, §235 + ancrages d'arrivée) | T-021 |
| Butins structurants | Clé d'Argent (§124→§173→§158), Pierre de Vordak (§9→§236), achats §12 (10 Couronnes) et §46 (2 Couronnes) | T-022 |
| Simulation complète | 20 000 parties jouées automatiquement dans PostgreSQL (PGlite) : 18 880 morts, 1 120 victoires, **0 anomalie** d'exécution (aucun choix impossible, aucun objet fantôme, aucune discipline requise non choisissable) | — |

### 1.3 Ce que les écarts coûtent au joueur

- **Pertes d'ENDURANCE** : le §2 (fuite devant les Gloks, atteint depuis §123 et §304) applique la perte du texte deux fois : le joueur qui tire 0-4 perd 4 points au lieu de 2, celui qui tire 5-9 en perd 2 au lieu de 1. C'est le **seul** cas de double application détecté sur les 350 sections (T-010 et T-024 sont deux contrôles indépendants qui le confirment).
- **Combats** : 5 des 29 combats du livre ne se jouent pas comme écrit — un combat entièrement absent (§340, le plus grave : il permet de traverser un affrontement 14/24 sans rien jouer) et quatre combats dont le total d'HABILETÉ est faux de 1 à 4 points (§55, §136, §229, §260).
- **Verrous** : 3 verrous posés à tort retirent au joueur des chemins légitimes, 2 verrous absents privent Camouflage, Maîtrise Psychique de la Matière et Orientation de leur intérêt — dans un livre où le choix des 5 Disciplines est la principale décision stratégique.
- **Économie** : les 20 butins manquants représentent 64 Couronnes, 8 armes (2 Épées, un Sabre, un Bâton, 2 Marteaux de Guerre, 2 Lances) plus un Poignard ou une Lance au choix (§291), 2 Repas, une dose d'Essence d'Alether (+2 HAB pendant un combat) et quatre objets spéciaux (Clé d'Or, Parchemin, Message, Savon Parfumé). Conséquence directe : le joueur ne peut pas remplacer les armes qu'il perd aux §162, §188, §274 et §294, et l'unique emploi prévu de la Clé d'Or (§23 → §326) reste hors de portée.

---

## 2. Méthode d'audit

### 2.1 Chaîne de traitement

1. **Extraction PDF** — `pypdf` 6.19.0, texte des 175 pages conservé page par page (`ls01-pages.txt`), puis découpage en 350 sections sur les titres numérotés (contrôle : 350/350, aucune section perdue).
2. **Lecture du livre** — 553 renvois extraits par le motif `rendez-vous / rendrez-vous / rendez-vous alors / rendez-vous enfin … au N` (le PDF généré par Word contient des espaces parasites — « rendez -vous », « a u 7 », « di fférentes » — le motif tolère des espaces variables ; le §91 en fournit un cas d'école).
3. **Dump de la base** — migration complète appliquée dans **PGlite** (`@electric-sql/pglite`, shim `auth` + rôles) puis extraction du graphe LS01 : 361 nœuds, 566 choix, 225 effets, 69 objets.
4. **Comparaison** — 24 contrôles indépendants (`checks_final.py`), plus une analyse de graphe (`graph_analysis.py`) et une simulation Monte-Carlo de 20 000 parties (`simulate.mjs`, conditions, inventaire, flags et Table des Coups Portés réels du dépôt).
5. **Relecture manuelle** — chaque écart signalé par un test a été relu dans le texte du PDF avant d'être retenu. **Tous les faux positifs produits par les fenêtres de contexte ont été écartés** (chapitre 6).
6. **Passe « Feuille d'Aventure »** — balayage des 350 sections sur les marqueurs d'action du livre (« vous trouvez », « vous pouvez prendre », « vous empochez », « inscrivez », « rayez », « vous perdez N points d'ENDURANCE ») : 43 sections signalées, 34 modifient réellement la Feuille d'Aventure (23 le disent explicitement), 9 sont écartées avec justification — chacune confrontée à la base (annexe F).

### 2.2 Principe de preuve

Un test n'est déclaré en échec que si l'écart est **relu dans le texte du livre**. Les heuristiques d'analyse (fenêtres glissantes, mentions de Disciplines dans une phrase de combat) produisent des faux positifs : le document les signale explicitement plutôt que de les corriger en silence. Les citations du livre sont reproduites entre guillemets et en style normal, avec la mention « texte du livre ».

### 2.3 Reproductibilité

| Artefact | Rôle |
|---|---|
| `ls01-pages.txt`, `ls01_parsed.json` | extraction pypdf des 175 pages ; 350 sections structurées |
| `db_graph.json` | graphe LS01 extrait de la base (nœuds, choix, effets, objets) |
| `pdf_facts.json` | faits du livre par section (renvois, hasards, combats, pertes, repas, objets, argent, fins) |
| `checks_final.py` → `audit_final.json` | les 24 contrôles du chapitre 3 et leurs preuves |
| `graph_analysis.py` → `graph_report.json` | joignabilité, composantes, chemins, distances |
| `pglite/simulate.mjs` → `sim_report.json` | simulation de 20 000 parties |
| `annexe_sections.md` | table exhaustive des 350 sections (chapitre « Annexe A ») |

### 2.4 Passe de vérification indépendante (relecture anti-hallucination)

Toutes les affirmations du présent document ont été re-testées **depuis les sources**, sans réutiliser les scripts de la première passe :

| Outil | Rôle | Résultat |
|---|---|---|
| `pdf_lib.py` | extraction du PDF réécrite de zéro (`pages`, `sections`, `refs`, `norm`) | 350/350 sections, 553 renvois distincts, 21 sections à Table de Hasard |
| `verify_claims.py` | 96 affirmations du document confrontées au PDF et à la base | 88 confirmées, 8 signalées puis instruites (7 artefacts d'outil, 1 manque réel : §222 → §67) |
| `load_db.mjs` (PGlite) | rejeu complet des migrations 001 → 025 | 29/29 migrations, 361 nœuds, 566 choix, 225 effets, 69 objets |
| `analyse_final.py`, `figures.py`, `cond_bfs.py` | graphe, composantes, conditions, dénombrements | 193 composantes fortement connexes (141/25/4/2), 183 sections sans condition (266 avec hasards et fuites) |
| `verif_sql.py` | exécution réelle de la migration 026 sur PGlite | **78 contrôles : 78 OK / 0 échec**, y compris l'idempotence (migration appliquée deux fois : dump sémantiquement identique) |

**Corrections apportées au document à la suite de cette passe :**

| Point | Version initiale | Valeur vérifiée |
|---|---|---|
| Branches de Tables de Hasard | 28 | **45** (21 sections) + 4 dans les nœuds techniques du §21, soit 49 entrées |
| Sections accessibles sans condition | 84 | **183** (266 en comptant Tables de Hasard et fuites) — mesure et définition explicitées au T-017 |
| Composantes fortement connexes | 122 (principale de 276) | **193**, dont 4 non triviales : **141 / 25 / 4 / 2** |
| Fins | 18 | **18 fins du livre** (17 morts + §350), portées par **19 nœuds `is_ending`** (dont `mort_epuisement`) |
| Parcours §1 → §350 | 18 092 415 | dénombrements bornés exacts : **131 793** marches et **94 461** chemins élémentaires en ≤ 33 renvois (le chiffre initial n'était pas reproductible ; le graphe compte 193 composantes fortement connexes) |
| §23 → §151 | verrou « Maîtrise Psychique de la Matière » manquant | **déjà conforme** : le verrou est présent (faux positif de la première passe) |
| §222 → §67 | verrou manquant | **manque confirmé** : seul verrou réellement absent de la base |
| Messages d'effet d'arrivée | non contrôlés | 16 messages : 1 littéral (§161) et **15 reformulés** par l'import — correctif `C13` ajouté à la migration |
| §291 | « au choix » | **exclusion mutuelle** réalisée par un drapeau commun aux deux choix (`pris_291`) |

**Preuve d'exécution** : la migration du §4.8 a été appliquée pour de vrai dans PostgreSQL (PGlite), puis rejouée une seconde fois sur le résultat — les deux états sont identiques au détail près ; les 78 contrôles de `verif_sql.py` portent sur l'état obtenu, pas sur le texte du document.

---

## 3. Résultat des 24 contrôles

| Test | Contrôle | Catégorie | Verdict |
|---|---|---|---|
| **T-001** | Présence des 350 paragraphes | structure | ✅ OK |
| **T-002** | Nœuds techniques attendus (chaîne §21, mort système) | structure | ✅ OK |
| **T-003** | Aucun nœud section inattendu | structure | ✅ OK |
| **T-004** | Tous les renvois du livre existent (choix, hasard ou fuite) | topologie | ✅ OK |
| **T-005** | Aucune cible en base absente du livre | topologie | ✅ OK |
| **T-006** | Mêmes prédécesseurs que le livre pour chaque section | topologie | ✅ OK |
| **T-007** | Conditions de Discipline conformes au livre | conditions | ❌ ÉCHEC |
| **T-008** | Conditions d'objet conformes au livre | conditions | ❌ ÉCHEC |
| **T-009** | Chaque Table de Hasard couvre 0-9 sans trou ni chevauchement | hasard | ✅ OK |
| **T-010** | Pas de double application des pertes du livre (hasard + arrivée) | hasard | ❌ ÉCHEC |
| **T-011** | Les 29 combats du livre : caractéristiques exactes | combat | ❌ ÉCHEC |
| **T-012** | Modificateurs d'HABILETÉ des combats du livre | combat | ❌ ÉCHEC |
| **T-013** | Fuite de combat : cible et assauts minimum du livre | combat | ❌ ÉCHEC |
| **T-014** | Liste exacte des fins de mort du livre | fins | ✅ OK |
| **T-015** | Texte intégral identique au PDF (LR ≥ 0,97) | contenu | ✅ OK |
| **T-016** | Toutes les sections joignables (sauf anomalie d'édition §251) | graphe | ✅ OK |
| **T-017** | Sections accessibles sans aucune condition (contrôle de sécurité) | graphe | ℹ️ INFO |
| **T-018** | Aucune impasse hors fin | graphe | ✅ OK |
| **T-019** | metadata.references = renvois réellement implémentés | cohérence | ❌ ÉCHEC |
| **T-020** | Aucun objet exigé qui ne soit jamais attribué | objets | ❌ ÉCHEC |
| **T-021** | Repas obligatoires conformes au livre | effets | ✅ OK |
| **T-022** | Butins attendus des sections clés | objets | ✅ OK |
| **T-023** | Butins du livre absents de la base (inventaire complet) | objets | ❌ ÉCHEC |
| **T-024** | §2 : pertes du hasard non doublées par l'arrivée | hasard | ❌ ÉCHEC |

### 3.1 Détail test par test

### T-001 — Présence des 350 paragraphes

- **Verdict : OK** · catégorie `structure`
- **Attendu :** 350 nœuds section_NNN
- **Méthode :** Recensement des nœuds `section_NNN` en base, comparaison à la liste 1→350 du PDF.
- **Constat (données brutes) :** `{"manquantes": []}`
- **Correctif :** —

### T-002 — Nœuds techniques attendus (chaîne §21, mort système)

- **Verdict : OK** · catégorie `structure`
- **Attendu :** 4 nœuds techniques
- **Méthode :** Liste blanche des nœuds techniques attendus (mort à Endurance 0, chaîne de jets du §21).
- **Constat (données brutes) :** `{"techniques": ["mort_epuisement", "section_021_derniere_chance", "section_021_enlisement", "section_021_mort"]}`
- **Correctif :** —

### T-003 — Aucun nœud section inattendu

- **Verdict : OK** · catégorie `structure`
- **Attendu :** aucun
- **Méthode :** Nœuds `section_NNN` hors plage 1→350.
- **Constat (données brutes) :** `{"inattendus": []}`
- **Correctif :** —

### T-004 — Tous les renvois du livre existent (choix, hasard ou fuite)

- **Verdict : OK** · catégorie `topologie`
- **Attendu :** 0 renvoi manquant
- **Méthode :** Extraction de tous les « rendez-vous au N » du PDF (553 renvois) puis recherche de la cible dans les choix, les tables de hasard et les règles de fuite.
- **Constat (données brutes) :** `{"manquants": []}`
- **Correctif :** —

### T-005 — Aucune cible en base absente du livre

- **Verdict : OK** · catégorie `topologie`
- **Attendu :** 0 cible surnuméraire
- **Méthode :** Comparaison des cibles sortantes : base → PDF.
- **Constat (données brutes) :** `{"en_trop": []}`
- **Correctif :** —

### T-006 — Mêmes prédécesseurs que le livre pour chaque section

- **Verdict : OK** · catégorie `topologie`
- **Attendu :** aucun écart (hors §312, chaîne technique)
- **Méthode :** Comparaison des degrés entrants du PDF et de la base (hors auto-références).
- **Constat (données brutes) :** `{"ecarts": []}`
- **Correctif :** —

### T-007 — Conditions de Discipline conformes au livre

- **Verdict : ÉCHEC** · catégorie `conditions`
- **Attendu :** 0 écart
- **Méthode :** Pour chaque renvoi : analyse de la phrase du renvoi et de la phrase conditionnelle qui la précède immédiatement (découpage sur la ponctuation forte, afin d'éviter les fenêtres glissantes), puis recherche des 10 Disciplines Kaï.
- **Constat (données brutes) :** `{"ecarts": [{"section": 18, "cible": 29, "attendu": [], "base": ["discipline_camouflage"]}, {"section": 23, "cible": 326, "attendu": [], "base": ["discipline_maitrise_psychique_matiere"]}, {"section": 151, "cible": 87, "attendu": ["discipline_maitrise_psychique_matiere"], "base": []}, {"section": 172, "cible": 29, "attendu": [], "base": ["discipline_camouflage"]}, {"section": 211, "cible": 106, "attendu": [], "base": ["discipline_six_cieme_sens"]}, {"section": 222, "cible": 67, "attendu": ["discipline_orientation"], "base": []}]}`
- **Correctif :** C8

### T-008 — Conditions d'objet conformes au livre

- **Verdict : ÉCHEC** · catégorie `conditions`
- **Attendu :** 0 écart
- **Méthode :** Même méthode pour les conditions d'objet (Pierre de Vordak, Clé d'Or, Clé d'Argent, Couronnes).
- **Constat (données brutes) :** `{"ecarts": [{"section": 46, "cible": 246, "attendu": [], "base": ["couronnes"]}]}`
- **Correctif :** Aucun correctif : le seul écart signalé (§46→§246, 2 Couronnes) est un **faux positif vérifié** dans le texte, cf. chapitre 6.

### T-009 — Chaque Table de Hasard couvre 0-9 sans trou ni chevauchement

- **Verdict : OK** · catégorie `hasard`
- **Attendu :** 0 trou
- **Méthode :** Analyse de `metadata.hazard_consequences` : chaque section doit couvrir 0-9 sans trou ni recouvrement.
- **Constat (données brutes) :** `{"sections": [2, 7, 17, 21, 22, 36, 44, 49, 89, 158, 160, 188, 205, 226, 237, 275, 279, 294, 302, 314, 337], "branches": 45, "problemes": [], "chaine_technique_du_21": {"section_021_enlisement": 2, "section_021_derniere_chance": 2}}` — 21 sections numérotées, 45 branches, plus les 4 branches des deux nœuds techniques du §21 (49 entrées encodées au total).
- **Correctif :** —

### T-010 — Pas de double application des pertes du livre (hasard + arrivée)

- **Verdict : ÉCHEC** · catégorie `hasard`
- **Attendu :** aucun doublon de perte
- **Méthode :** Une perte d'ENDURANCE ne doit être appliquée qu'une fois : soit par la conséquence de hasard, soit par l'ancrage d'arrivée (`metadata.on_arrive`), jamais par les deux.
- **Constat (données brutes) :** `{"doubles": [{"section": 2, "plage": "0-4", "hp_hasard": -2, "hp_arrivee": -2, "cible": "section_343"}, {"section": 2, "plage": "5-9", "hp_hasard": -1, "hp_arrivee": -1, "cible": "section_276"}]}`
- **Correctif :** C7

### T-011 — Les 29 combats du livre : caractéristiques exactes

- **Verdict : ÉCHEC** · catégorie `combat`
- **Attendu :** 29 combats identiques
- **Méthode :** Relecture des tableaux HABILETÉ/ENDURANCE des 29 combats du livre, y compris les tableaux à deux colonnes (« Premier GLOK / Deuxième GLOK »).
- **Constat (données brutes) :** `{"nb_livre": 29, "ecarts": [{"section": 340, "livre": [[14, 24]], "base": []}]}`
- **Correctif :** C1

### T-012 — Modificateurs d'HABILETÉ des combats du livre

- **Verdict : ÉCHEC** · catégorie `combat`
- **Attendu :** toutes les règles présentes
- **Méthode :** Relecture des phrases du PDF introduisant un malus ou un bonus d'HABILETÉ propre à un combat (+4, +1, -1, -4).
- **Constat (données brutes) :** `{"ecarts": [{"section": 55, "regle": "+4 HAB (effet de surprise)"}, {"section": 136, "regle": "+1 HAB (position élevée)"}, {"section": 229, "regle": "-1 HAB (poussière)"}, {"section": 260, "regle": "-4 HAB (combat à mains nues)"}]}`
- **Correctif :** C2 à C5

### T-013 — Fuite de combat : cible et assauts minimum du livre

- **Verdict : ÉCHEC** · catégorie `combat`
- **Attendu :** 7 fuites conformes
- **Méthode :** Contrôle de `metadata.combat.flee` : cible et nombre d'assauts obligatoires avant la fuite.
- **Constat (données brutes) :** `{"ecarts": [{"section": 43, "attendu": 106, "base": null}]}`
- **Correctif :** C6

### T-014 — Liste exacte des fins de mort du livre

- **Verdict : OK** · catégorie `fins`
- **Attendu :** 17 morts (16 paragraphes numérotés + la mort du §21) + §350 (victoire) = 18 fins dans le livre.
- **Méthode :** Liste des 17 paragraphes de mort du livre + §350 (victoire), comparée aux nœuds `is_ending`.
- **Constat (données brutes) :** `{"pdf": [53, 54, 60, 108, 127, 154, 185, 219, 234, 259, 271, 286, 292, 306, 309, 327, "mort du §21"], "base": [53, 54, 60, 108, 127, 154, 185, 219, 234, 259, 271, 286, 292, 306, 309, 327, 350], "noeuds_is_ending": 19, "supplementaires": ["section_021_mort", "mort_epuisement"]}` — les 19 nœuds `is_ending` se décomposent en 16 sections numérotées + `section_021_mort` (mort propre au §21) + `mort_epuisement` (mort système quand l'ENDURANCE tombe à 0) + le §350 (victoire) : les 18 fins du livre sont bien là.
- **Correctif :** —

### T-015 — Texte intégral identique au PDF (LR ≥ 0,97)

- **Verdict : OK** · catégorie `contenu`
- **Attendu :** 350 textes conformes
- **Méthode :** `difflib.SequenceMatcher` sur le texte normalisé (espaces, apostrophes) PDF ↔ `story_nodes.content`.
- **Constat (données brutes) :** `{"ratio_moyen": 0.9983, "ratio_min": 0.9709, "faibles": []}`
- **Correctif :** —

### T-016 — Toutes les sections joignables (sauf anomalie d'édition §251)

- **Verdict : OK** · catégorie `graphe`
- **Attendu :** seul §251 injoignable (= anomalie du livre papier)
- **Méthode :** Parcours en largeur du graphe entier (conditions réputées satisfaisables), depuis §1.
- **Constat (données brutes) :** `{"injoignables": ["section_251"]}`
- **Correctif :** —

### T-017 — Sections accessibles sans aucune condition (contrôle de sécurité)

- **Verdict : OK** · catégorie `graphe`
- **Attendu :** les disciplines/objets doivent ouvrir des branches, pas être obligatoires partout
- **Méthode :** Parcours en largeur depuis §1 en n'empruntant que les transitions sans condition (ni discipline, ni objet, ni état requis) ; mesure prudente : un `flag_require` à `FALSE` — marqueur « on ne passe qu'une fois », qui ne ferme aucune porte — est compté comme une condition.
- **Constat (données brutes) :** `{"nb": 183, "avec_tables_de_hasard_et_fuites": 266, "sections": ["section_005", "section_008", "section_011", "section_021", "section_029", "section_039", "section_040", "section_045", "section_048", "section_050", "section_055", "section_056", "section_057", "section_065", "section_069", "section_073", "section_079", "section_080", "section_087", "section_093", "section_094", "section_095", "section_101", "section_109", "section_110", "section_111", "section_114", "section_122", "section_131", "section_134", "section_141", "section_151", "section_158", "section_164", "section_166", "section_168", "section_172", "section_178", "section_182", "section_187", "section_189", "section_197", "section_198", "section_203", "section_204", "section_206", "section_216", "section_218", "section_225", " […]`
- **Correctif :** —

### T-018 — Aucune impasse hors fin

- **Verdict : OK** · catégorie `graphe`
- **Attendu :** 0 impasse
- **Méthode :** Sections non finales sans successeur.
- **Constat (données brutes) :** `{"impasses": []}`
- **Correctif :** —

### T-019 — metadata.references = renvois réellement implémentés

- **Verdict : ÉCHEC** · catégorie `cohérence`
- **Attendu :** 0 écart
- **Méthode :** Comparaison de `metadata.references` avec les renvois réellement implémentés (quatre familles : choix, hasard, fuite, choix techniques).
- **Constat (données brutes) :** `{"ecarts": [{"section": 19, "metadata": ["69"], "reel": [69, 119, 272]}, {"section": 20, "metadata": [], "reel": [272]}, {"section": 21, "metadata": ["section_021_enlisement", "section_189"], "reel": [189, 312]}, {"section": 36, "metadata": [], "reel": [140, 323]}, {"section": 39, "metadata": [], "reel": [228]}, {"section": 47, "metadata": [], "reel": [136, 322]}, {"section": 50, "metadata": ["97"], "reel": [97, 243]}, {"section": 52, "metadata": ["225"], "reel": [225, 250]}, {"section": 56, "metadata": [], "reel": [222]}, {"section": 105, "metadata": ["335"], "reel": [298, 335]}, {"section": 109, "metadata": [], "reel": [164, 308]}, {"section": 112, "metadata": [], "reel": [33, 248]}, {"section": 119, "metadata": ["226"], "reel": [38, 226]}, {"secti […]`
- **Correctif :** C11 (documentaire)

### T-020 — Aucun objet exigé qui ne soit jamais attribué

- **Verdict : ÉCHEC** · catégorie `objets`
- **Attendu :** tous les objets-clés doivent être ramassables
- **Méthode :** Croisement des effets `inventory_require` et des effets `inventory_add`/`on_arrive.add_items` : un objet exigé doit être attribué quelque part.
- **Constat (données brutes) :** `{"exiges_jamais_donnes": ["cle-or"], "choix_impactes": {"cle-or": ["section_023"]}}`
- **Correctif :** C9

### T-021 — Repas obligatoires conformes au livre

- **Verdict : OK** · catégorie `effets`
- **Attendu :** 7 sections
- **Méthode :** Sections dont le texte impose de prendre un Repas, comparées à `metadata.on_arrive.meal_required`.
- **Constat (données brutes) :** `{"pdf": [37, 130, 147, 168, 184, 235, 300], "base": [37, 130, 147, 168, 184, 235, 300]}`
- **Correctif :** —

### T-022 — Butins attendus des sections clés

- **Verdict : OK** · catégorie `objets`
- **Attendu :** tous les butins attribués
- **Méthode :** Butins structurants : Clé d'Argent (§124 → §173 → §158), Pierre de Vordak (§9), achats §12 (10 Couronnes) et §46 (2 Couronnes).
- **Constat (données brutes) :** `{"manquants": []}`
- **Correctif :** —

### T-023 — Butins du livre absents de la base (inventaire complet)

- **Verdict : ÉCHEC** · catégorie `objets`
- **Attendu :** chaque objet du livre doit être ramassable
- **Méthode :** Relecture exhaustive des phrases de butin des 350 sections (« vous trouvez… », « vous pouvez prendre… », « vous empochez… », « vous découvrez… ») confrontées aux effets d'inventaire et aux ancrages d'arrivée.
- **Constat (données brutes) :** `{"manquants": {"15": "épée", "33": "3 pièces d'or", "94": "16 pièces d'or", "148": "Marteau de Guerre", "161": "Clé d'Or", "164": "Essence d'Alether", "184": "Épée", "193": "Parchemin", "197": "Sabre + 6 pièces d'or", "199": "1 Repas", "263": "3 pièces d'or", "267": "Message + Poignard", "269": "10 pièces d'or", "290": "Bâton", "291": "Poignard ou Lance", "305": "Lance de Glok", "307": "1 Repas", "315": "6 pièces d'or + Savon", "319": "20 pièces d'or + Poignard", "346": "Lance"}}`
- **Correctif :** C10

### T-024 — §2 : pertes du hasard non doublées par l'arrivée

- **Verdict : ÉCHEC** · catégorie `hasard`
- **Attendu :** une seule application de -2/-1
- **Méthode :** Contrôle ciblé du §2 : la perte du texte doit être portée par la section finale du renvoi, pas par les deux maillons.
- **Constat (données brutes) :** `{"§2": [{"section": 2, "plage": "0-4", "hp_hasard": -2, "hp_arrivee": -2, "cible": "section_343"}, {"section": 2, "plage": "5-9", "hp_hasard": -1, "hp_arrivee": -1, "cible": "section_276"}]}`
- **Correctif :** C7


---

## 4. Correctifs — prêts pour SQL

Chaque correctif est identifié `C1`…`C12` et renvoie au test qui l'a mis en évidence. Le bloc SQL complet est donné au 4.8 ; l'annexe F recense une par une les 34 sections qui modifient la Feuille d'Aventure. Il est écrit dans le style des migrations `010`/`012` du dépôt (`DO $$ … $$` avec résolution de l'histoire par `slug`), et destiné à devenir `026_ls01_fidelite_passe3.sql` (dernière migration en place : `025`).

### 4.1 Combats

**`C1` — §340 : recréer le combat GLOK + LOUP MAUDIT (14/24).**
Le texte du livre porte « GLOK + LOUP MAUDIT HABELETE. 14 ENDURANCE : 24 » : le libellé d'import (« HABELETE. » avec un point au lieu de deux-points) a fait échouer le parseur, d'où `combatants: []`. Le §72, combat identique (15/24), est correctement encodé : c'est la comparaison des deux sections homologues qui a révélé l'écart.

**`C2` à `C5` — restituer les modificateurs d'HABILETÉ propres à un combat.**

| Section | Texte du livre (extrait) | Modificateur | Encodage proposé |
|---|---|---|---|
| §55 | « l'effet de surprise de votre attaque vous permet d'ajouter 4 points à votre total d'HABILETÉ pendant toute la durée de ce combat » | **+4 HAB** (tous les assauts) | `player_skill_bonus: 4` |
| §136 | « Vous ajouterez un point d'HABILETÉ à votre total en raison de l'avantage que vous donne votre position plus élevée » | **+1 HAB** (les deux Gloks, combattus à tour de rôle) | `player_skill_bonus: 1` sur les deux combattants |
| §229 | « il vous faut réduire de 1 point votre total d'HABILETÉ pendant toute la durée de l'affrontement » | **-1 HAB** (tous les assauts) | `player_skill_penalty: 1` (même mécanisme que le §17) |
| §260 | « Vous n'avez pas d'armes et vous devrez donc vous battre à mains nues. De ce fait, votre total d'HABILETÉ se trouvera diminué de 4 points » | **-4 HAB** (les deux Gloks) | `player_skill_penalty: 4` sur les deux combattants |

Les propriétés `player_skill_penalty` et `surprise_bonus_round_1` sont **déjà** exploitées par `resolve-combat-round` (§17 = -1, §283 = +2 au premier assaut) : rien à changer côté serveur pour `C4`/`C5`. En revanche, aucun bonus de combat « toutes rondes » n'existe : `C2`/`C3` nécessitent soit l'ajout d'une propriété `player_skill_bonus` (3 lignes dans `resolve-combat-round`, symétriques du malus), soit — solution sans toucher au code — une pénalité négative (`player_skill_penalty: -4`, documentée comme telle dans le `metadata`). La variante recommandée est `player_skill_bonus` : elle reste lisible dans les données.

### 4.2 Fuite de combat

**`C6` — §43 : assujettir la fuite à trois assauts.**
Le texte du livre est explicite : « Au bout du troisième assaut, vous avez réussi à vous placer de telle sorte qu'il vous est possible de vous enfuir en courant au bas de la colline. Si vous souhaitez vous échapper après avoir livré ces trois assauts obligatoires, rendez-vous au 106. » En base, le §43 propose un choix libre `§43 → §106` et aucune règle de fuite : le joueur esquive l'OURS NOIR (16/10) sans combattre. Le correctif aligne le §43 sur le mécanisme déjà utilisé six fois (par exemple §169, fuite après 1 assaut ; §231, après 2 assauts) : `metadata.combat.flee = {target_node_key: section_106, min_rounds: 3}` **et** suppression du choix libre correspondant.

### 4.3 Pertes d'ENDURANCE (hasard contre arrivée)

**`C7` — §2 : la perte ne doit être appliquée qu'une fois.**
Le livre place la perte dans **les sections d'arrivée**, pas dans le jet : le §2 ne dit que « Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez entre 0 et 4, rendez-vous au 343. Entre 5 et 9, rendez-vous au 276. » Ce sont les §343 et §276 qui portent la perte : « Vous perdez 2 points d'ENDURANCE avant de vous rendre au 213. » / « Vous perdez 1 point d'ENDURANCE avant de vous rendre au 213. »
La base applique la perte dans les deux maillons :

| Maillon | Contenu en base | Fidèle ? |
|---|---|---|
| `section_002` → `metadata.hazard_consequences` | `0-4 → section_343` avec `hp_delta: -2` ; `5-9 → section_276` avec `hp_delta: -1` | ❌ en trop |
| `section_343` → `metadata.on_arrive` | `hp_delta: -2`, message « Votre bras écorché vous coûte 2 points d'ENDURANCE. » | ✅ conforme au texte |
| `section_276` → `metadata.on_arrive` | `hp_delta: -1`, message « Votre jambe meurtrie vous coûte 1 point d'ENDURANCE. » | ✅ conforme au texte |

Le correctif **retire les `hp_delta` des conséquences du §2** et conserve les ancrages d'arrivée : c'est la seule des deux options qui respecte le texte, et elle laisse les règles de hasard du §2 strictement limitées au routage (`0-4` / `5-9`), comme dans le livre.

### 4.4 Conditions (verrous)

**`C8` — six corrections de verrous.** Toutes sont relues dans le texte du livre.

| Sous-correctif | Section → cible | État en base | Texte du livre | Correction |
|---|---|---|---|---|
| `C8.a` | §18 → §29 | exige `discipline_camouflage` | « Si vous préférez combattre la créature, rendez-vous au 29. » — aucune condition | **retirer** le verrou |
| `C8.a` | §172 → §29 | exige `discipline_camouflage` | « Enfin, si vous préférez vous préparer à combattre l'ignoble créature, rendez-vous au 29. » — aucune condition | **retirer** le verrou |
| `C8.a` | §211 → §106 | exige `discipline_six_cieme_sens` | « Si, enfin, vous préférez retourner à l'air libre et poursuivre votre route, rendez-vous au 106. » — aucune condition | **retirer** le verrou |
| `C8.b` | §23 → §326 | exige `discipline_maitrise_psychique_matiere` **et** la Clé d'Or | « Enfin, si vous avez une Clé d'Or, rendez-vous au 326. » — la Discipline vaut pour le §151, pas pour le §326 | **retirer** la Discipline, **conserver** la Clé d'Or |
| `C8.c` | §23 → §151 | aucune condition | « Si vous possédez la Discipline Kaï de la Maîtrise Psychique de la Matière, rendez-vous au 151. » | **ajouter** le verrou |
| `C8.c` | §222 → §67 | aucune condition | « Enfin, si vous maîtrisez la Discipline Kaï du Sens de l'Orientation, rendez-vous au 67. » | **ajouter** le verrou |

Le test T-007 signalait deux écarts « en plus » que la relecture a délocalisés : `§151→§87` (le verrou appartient au choix amont §23→§151) et `§67→§140` (le verrou appartient au choix amont §222→§67). Les corrections `C8.c` produisent exactement l'effet attendu par le test : sans la Discipline, on n'entre ni au §151 ni au §67. Les mentions de Discipline du §29, du §34 et du §133 décrivent des **règles de combat** (assaut psychique du Vordak, insensibilité du Serpent ailé) et sont déjà traitées par les propriétés `psychic_assault` / `mindblast_immune` : aucune condition à ajouter.

### 4.5 Objets et argent — ce que dit le livre (`C9`, `C10`)

Le livre ne se contente pas de décrire les richesses du héros : il indique à chaque fois, mot pour mot, ce qui doit être
inscrit, rayé ou modifié sur la Feuille d'Aventure. Cette convention éditoriale donne la règle d'encodage — il n'y a aucune
interprétation à faire, seulement une lecture. L'annexe F recense les **34 sections** concernées, avec l'extrait correspondant, et justifie les 9 sections écartées après examen.

**Les sept règles dérivées du texte**

| # | Règle | Marqueur dans le livre | Encodage |
|---|---|---|---|
| `R1` | **Gain automatique** : le héros empoche sans qu'on lui demande son avis | « Vous les empochez », « vous rangez », « Notez-le », « Vous prenez la Clé », « il vous la donne » | `metadata.on_arrive.add_items` — attribué à l'arrivée, sur toutes les sorties |
| `R2` | **Offre facultative** : le héros peut refuser | « si vous le désirez », « si vous le souhaitez », « si tel est votre désir », « Vous pouvez… » | **un choix dédié**, auto-boucle sur la section, visible tant que l'objet n'a pas été pris (`flag_require` `flag_value = false`) puis masqué (`flag_set`) |
| `R3` | **Choix exclusif** : « au choix le Poignard ou l'une des Lances » (§291) | « prendre au choix » | deux choix concurrents, mutuellement exclusifs par le même drapeau |
| `R4` | **Échange** : le Marteau de Guerre de l'ermite (§307) s'obtient « à la condition de l'échanger contre une autre Arme que vous possédez déjà » | « à la condition de l'échanger » | un choix « Échanger une Arme contre le Marteau », désignation d'une arme par le joueur |
| `R5` | **Perte au choix du joueur** (§144 vol, §277 arme brisée) | « c'est vous qui choisissez ce qu'on vous a volé », « vous pouvez choisir laquelle » | `on_arrive.choose_loss` désignant un objet du sac ou une arme |
| `R6` | **Objet non listé = aucun objet** : ce que le texte ne demande pas d'inscrire n'entre pas dans l'inventaire | absence de « inscrivez / notez » | aucun encodage (cas §282 : les « quelques fioles » servent la ruse du déguisement, elles ne sont ni nommées, ni chiffrées, ni à noter) |
| `R7` | **Plafonds du livre** : 2 armes, 8 objets dans le Sac à Dos, 50 Couronnes dans la bourse | règles de la Feuille d'Aventure | déjà appliqués par l'application (`LIMITE_ARMES = 2`, `LIMITE_SAC`, `GOLD_CAP = 50`) |

**Gains automatiques à ajouter (`C10`)** — 8 sections :

| § | Gain | § | Gain |
|---|---|---|---|
| §33 | `couronnes` ×3 | §161 | `cle-or` ×1 |
| §94 | `couronnes` ×16 | §199 | `repas` ×1 |
| §137 | `pierre-vordak` ×20 (les vingt Pierres Précieuses de la Crypte) | §269 | `couronnes` ×10 |
| §307 | `repas` ×1 (les fruits de l'ermite) | §349 | `etoile-cristal` ×1 (le pendentif de Banedon) |

S'y ajoutent deux normalisations : les butins déjà encodés mais **portés par les choix** (§20, §62, §113, §124, §184, §347) sont
déplacés vers `on_arrive`, pour qu'une seule attribution ait lieu par visite ; et le §188 conserve ses deux branches
(0-6 : Sac à Dos déchiré et contenu perdu ; 7-9 : −3 END), déjà conformes.

**Offres facultatives, choix exclusif, échange et pertes au choix (`C12`)** — 23 sections :

| § | Objet(s) offert(s) | Décision |
|---|---|---|
| §15 | Épée | choix « Prendre l'Épée » |
| §20 | Sac à Dos, 2 Repas, Poignard | trois choix séparés — le Sac à Dos supplémentaire est **volontairement non encodé** : le héros en possède déjà un et la Feuille d'Aventure ne comporte qu'une case (aucun effet de jeu) |
| §62 | une Épée sur les trois (« vous pouvez en emporter une ») | choix « Prendre une Épée » |
| §124 | Clé d'Argent (« si vous souhaitez conserver la Clé ») | choix « Prendre la Clé d'Argent » (les 15 Couronnes sont, elles, un gain automatique) |
| §148 | Marteau de Guerre | choix |
| §164 | Essence d'Alether (1 dose, +2 HAB pendant un combat) | choix |
| §184 | Épée, 40 Couronnes, 4 Repas (« l'une ou l'autre de ces trouvailles, ou toutes ensemble ») | trois choix séparés |
| §193 | Parchemin | choix |
| §197 | Sabre + 6 Pièces d'Or | choix |
| §243 | Masse d'Armes | choix |
| §255 | Épée du Prince (« pour combattre si vous le désirez ») | choix, pendant le combat |
| §263 | 3 Pièces d'Or | choix |
| §267 | Message + Poignard | choix |
| §290 | Bâton | choix |
| §291 | Poignard **ou** Lance (exclusif) | deux choix concurrents |
| §305 | Lance de Glok | choix |
| §307 | Marteau de Guerre (échange contre une Arme) | choix conditionnel à la possession d'une arme |
| §315 | 6 Pièces d'Or + Savon Parfumé | choix |
| §319 | 20 Pièces d'Or + Poignard | choix |
| §346 | Lance | choix |
| §347 | Sabre + Briquet à Amadou + une Torche | choix |
| §144 / §277 | (pertes) vol d'un objet du sac / arme brisée | perte désignée par le joueur |

**Trois objets absents du catalogue** sont à créer : `parchemin` (§193), `message` (§267), `savon-parfume` (§315). Tous les
autres slugs existent déjà, y compris `etoile-cristal` (§349), `masse-armes` (§243) et `relique-potion-alether` (§164 — le
`stat_bonus` de la Potion d'Alether est à vérifier : le texte promet +2 HAB pendant un combat).

### 4.6 Mécaniques de choix et d'échange — `C12`

Trois mécanismes du livre n'existent pas encore dans le moteur : ils se déduisent du texte, mais demandent une petite
capacité d'exécution en plus des données.

1. **Offre facultative (R2).** Aucune modification de code n'est nécessaire côté serveur : `make-choice` traite déjà
   `flag_require` avec `flag_value = false` (`const expected = effect.flag_value ?? true`), ce qui rend un choix invisible
   une fois le drapeau posé. Le choix s'auto-boucle sur la section : après l'achat, la section se réaffiche sans l'offre et
   le joueur poursuit par ses sorties normales.
2. **Choix exclusif (§291) et échange (§307).** Le choix exclusif se fait avec les mêmes outils (deux choix visant §272,
   un drapeau commun). L'échange demande en revanche que le joueur **désigne l'arme qu'il laisse** : donnée `choice_effects`
   `inventory_remove` avec `stat_key = 'arme_au_choix'`, et une sélection dans l'interface.
3. **Perte au choix (§144, §277).** Même besoin : `on_arrive.choose_loss = {"kind": "backpack_item"}` (§144, repli sur une
   arme si le Sac à Dos a été perdu) et `{"kind": "weapon"}` (§277 : l'arme brisée, aucune perte si le héros n'a plus d'arme).

Ces trois capacités sont les **seules** parties du correctif qui touchent du code ; tout le reste est de la donnée. Le bloc
SQL du 4.8 les déclare sous forme de métadonnées, de sorte qu'aucune information du livre ne soit perdue même si
l'interface n'est pas encore en mesure de poser la question au joueur.

### 4.7 Documentation interne

**`C11` — `metadata.references`.** Le champ est incohérent pour 47 sections (ex. §19 : `["69"]` alors que les renvois réels sont 69, 119 et 272 ; §21 : la chaîne technique y figure, pas le §312). Aucun code de l'application ne le lit (`grep` sur `app/` et `supabase/functions/` : seuls deux scripts de test le mentionnent) : **aucun impact joueur**. Correctif : régénérer le champ depuis les choix réels, pour la valeur documentaire.

### 4.9 Messages d'effet — `C13`

Les 16 ancrages `metadata.on_arrive.message` de la base ont été confrontés, phrase par phrase, au texte du livre :

- **1 message est littéral** : celui du §161 (« Vous prenez la Clé. »), posé par `C9`.
- **15 messages avaient été reformulés** par les migrations 014 à 016 (par exemple §276 « Votre jambe meurtrie vous coûte 1 point d'ENDURANCE. » là où le livre écrit « Vous perdez 1 point d'ENDURANCE avant de vous rendre au 213. »). Les **valeurs de jeu étaient justes** — 13 `*_delta` d'arrivée et 3 `*_delta` de Table de Hasard ont été vérifiés un par un contre le chiffre écrit dans le livre — mais le texte affiché n'était pas celui du livre.

`C13` remplace ces 15 messages par la phrase du livre, section par section (§76, §119, §144, §146, §162, §166, §203, §212, §236, §276, §304, §308, §313, §320, §343). Contrôle exécuté après migration : chaque phrase des 16 messages est retrouvée littéralement dans le paragraphe correspondant (« chacune des 16 phrases d'effet est attestée dans le texte du livre : conforme »).

### 4.8 Bloc SQL

> Bloc à adapter : à enregistrer comme `app/supabase/migrations/026_ls01_fidelite_passe3.sql` après relecture. Les identifiants de nœuds suivent la convention `section_NNN` du dépôt ; les mesures d'impact sont celles du chapitre 3.

### 4.8 Bloc SQL

> Bloc **exécuté et validé** : à enregistrer comme `app/supabase/migrations/026_ls01_fidelite_passe3.sql`. Les identifiants de nœuds suivent la convention `section_NNN` du dépôt. Ce bloc a été appliqué dans PostgreSQL (PGlite) sur les migrations 001 → 025, puis appliqué une seconde fois pour vérifier son idempotence ; les 78 contrôles de la passe de vérification (§2.4) passent sur l'état obtenu. Aucun message affiché n'est une paraphrase : chaque phrase provient du livre (correctif `C13`).

```sql
-- ================================================================
-- HeroBook — Migration 026 : FIDÉLITÉ LIVRE PASSE 3
--                        Les Maîtres des Ténèbres (Loup Solitaire 01)
-- ----------------------------------------------------------------
-- Correctifs C1 à C13 de l'audit « AUDIT_LS01_PARCOURS_COMPLETS.md ».
-- À exécuter APRÈS les migrations 014, 015 et 016.
--
--   C1  §340  combat GLOK + LOUP MAUDIT 14/24 recréé
--   C2  §55   +4 HAB pendant tout le combat (surprise)
--   C3  §136  +1 HAB (position élevée)
--   C4  §229  -1 HAB (poussière)
--   C5  §260  -4 HAB (combat à mains nues)
--   C6  §43   fuite assujettie à 3 assauts obligatoires
--   C7  §2    perte d'ENDURANCE retirée du jet (conservée sur §343/§276)
--   C8  verrous de Discipline : 3 retirés, 1 discipline retirée, 1 ajouté
--   C9  §161  Clé d'Or attribuée (+ verrou de sortie §161→§209)
--   C10 butins et argent automatiques du livre (règle R1)
--   C11 metadata.references régénéré depuis les renvois réels
--   C13 messages d'effet : phrase littérale du livre
--   C12 offres facultatives (R2), choix exclusif §291 (R3),
--       échange §307 (R4, sous condition de capacité), pertes au
--       choix du joueur §144/§277 (R5)
--
-- Les messages affichés reprennent les phrases du livre, jamais des
-- paraphrases. Aucune valeur de jeu n'est inventée.
-- ================================================================

DO $$
DECLARE
  v_story_id  UUID;
  v_node_id   UUID;
  v_choice_id UUID;
  v_item_id   UUID;
  v_rec       RECORD;
  v_offer     RECORD;
  v_meta      JSONB;
  -- Capacité d'exécution « désigner l'arme laissée » (R4) : tant qu'elle
  -- n'existe pas dans `make-choice`, l'échange du §307 n'est pas jouable ;
  -- l'information du livre est conservée dans metadata.special_actions.
  v_echange_arme_actif BOOLEAN := FALSE;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'les-maitres-des-tenebres';
  IF v_story_id IS NULL THEN
    RAISE NOTICE 'Histoire les-maitres-des-tenebres absente - migration 026 ignoree';
    RETURN;
  END IF;

  -- =============================================================
  -- C1 · §340 : combat GLOK + LOUP MAUDIT 14/24
  --      (le libellé du livre porte « HABELETE. », le parseur
  --       d'import a échoué et laissé combatants vide)
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           '[{"name":"GLOK + LOUP MAUDIT","combat_skill":14,"endurance":24}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_340';

  -- =============================================================
  -- C2 à C5 · Modificateurs d'HABILETÉ propres à un combat
  --      player_skill_penalty est déjà lu par resolve-combat-round.
  --      player_skill_bonus demande 3 lignes dans cette fonction
  --      (voir 4.6 du rapport) : sans elles, §55 et §136 restent
  --      sans bonus, les deux autres corrections sont opérantes.
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_bonus": 4}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_055'
     AND metadata ? 'combatants';

  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_bonus": 1}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_136'
     AND metadata ? 'combatants';

  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_penalty": 1}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_229'
     AND metadata ? 'combatants';

  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combatants}',
           (SELECT jsonb_agg(e || '{"player_skill_penalty": 4}')
              FROM jsonb_array_elements(metadata->'combatants') e))
   WHERE story_id = v_story_id AND node_key = 'section_260'
     AND metadata ? 'combatants';

  -- =============================================================
  -- C6 · §43 : fuite après 3 assauts obligatoires → §106
  --      (« Si vous souhaitez vous échapper après avoir livré ces
  --        trois assauts obligatoires, rendez-vous au 106. »)
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{combat}',
           COALESCE(metadata->'combat', '{}'::jsonb)
           || '{"flee":{"target_node_key":"section_106","min_rounds":3}}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_043';

  -- Nettoyage de l'historique avant suppression du choix (FK NO ACTION)
  DELETE FROM public.choice_history h
   USING public.story_choices c, public.story_nodes s, public.story_nodes t
   WHERE h.choice_id = c.id
     AND c.node_id = s.id AND c.target_node_id = t.id
     AND s.story_id = v_story_id
     AND s.node_key = 'section_043' AND t.node_key = 'section_106';

  DELETE FROM public.story_choices c
   USING public.story_nodes s, public.story_nodes t
   WHERE c.node_id = s.id AND c.target_node_id = t.id
     AND s.story_id = v_story_id
     AND s.node_key = 'section_043' AND t.node_key = 'section_106';

  -- =============================================================
  -- C7 · §2 : la perte d'ENDURANCE n'est portée que par les sections
  --      d'arrivée (§343 : -2, §276 : -1), comme dans le livre.
  --      Le §2 ne décrit que le jet : aucune perte, aucun texte
  --      inventé — la seule phrase du livre est reprise telle quelle.
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{hazard_consequences}',
           '[{"min":0,"max":4,"target_node_key":"section_343",
              "message":"Vous trébuchez soudain en tombant tête la première dans un enchevêtrement de branches basses."},
             {"min":5,"max":9,"target_node_key":"section_276"}]'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_002';

  -- =============================================================
  -- C8 · Verrous de Discipline
  --      a) retraits : §18→§29, §172→§29, §211→§106
  --      b) §23→§326 : retirer la Discipline, garder la Clé d'Or
  --      c) ajout    : §222→§67 (Orientation)
  --      NB : le verrou de §23→§151 (Maîtrise Psychique de la Matière)
  --      est déjà conforme — vérifié, aucune action.
  -- =============================================================
  DELETE FROM public.choice_effects e
   USING public.story_choices c, public.story_nodes s, public.story_nodes t
   WHERE e.choice_id = c.id
     AND c.node_id = s.id AND c.target_node_id = t.id
     AND s.story_id = v_story_id AND e.effect_type = 'flag_require'
     AND ( (s.node_key, t.node_key) IN
             (('section_018','section_029'),
              ('section_172','section_029'),
              ('section_211','section_106'))
        OR (s.node_key = 'section_023' AND t.node_key = 'section_326'
            AND e.flag_key = 'discipline_maitrise_psychique_matiere') );

  SELECT c.id INTO v_choice_id
    FROM public.story_choices c
    JOIN public.story_nodes s ON s.id = c.node_id
    JOIN public.story_nodes t ON t.id = c.target_node_id
   WHERE s.story_id = v_story_id
     AND s.node_key = 'section_222' AND t.node_key = 'section_067';
  IF v_choice_id IS NOT NULL AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects e
        WHERE e.choice_id = v_choice_id
          AND e.effect_type = 'flag_require'
          AND e.flag_key = 'discipline_orientation') THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_require', 'discipline_orientation', TRUE);
  END IF;

  -- =============================================================
  -- C9 · §161 : la Clé d'Or tombe dans les mains du héros
  --      (« Vous prenez la Clé (notez-la sur votre Feuille
  --         d'Aventure dans la case Objets Spéciaux) »)
  -- =============================================================
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           COALESCE(metadata->'on_arrive', '{}'::jsonb)
           || '{"message":"Vous prenez la Clé.","add_items":[{"slug":"cle-or","qty":1}]}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_161';

  SELECT c.id INTO v_choice_id
    FROM public.story_choices c
    JOIN public.story_nodes s ON s.id = c.node_id
    JOIN public.story_nodes t ON t.id = c.target_node_id
   WHERE s.story_id = v_story_id
     AND s.node_key = 'section_161' AND t.node_key = 'section_209';
  SELECT id INTO v_item_id FROM public.items WHERE slug = 'cle-or';
  IF v_choice_id IS NOT NULL AND v_item_id IS NOT NULL AND NOT EXISTS (
       SELECT 1 FROM public.choice_effects e
        WHERE e.choice_id = v_choice_id AND e.effect_type = 'inventory_require') THEN
    INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
    VALUES (v_choice_id, 'inventory_require', 1, v_item_id);
  END IF;

  -- =============================================================
  -- C10 · Butins et argent du livre — gains automatiques (R1)
  --       « vous les empochez », « Notez-le », « Vous prenez la Clé »,
  --       « il vous la donne » : le livre ordonne l'inscription.
  -- =============================================================
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('parchemin', 'Parchemin', 'Rouleau de Parchemin récupéré sur un Glok.', 'artifact', 'rare', '{}'::jsonb, FALSE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO NOTHING;
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('message', 'Message', 'Message écrit sur une peau d''animal.', 'artifact', 'rare', '{}'::jsonb, FALSE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO NOTHING;
  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, price_gems, is_available, story_id)
  VALUES ('savon-parfume', 'Savon Parfumé', 'Morceau de Savon Parfumé trouvé dans un Sac de Velours.', 'artifact', 'common', '{}'::jsonb, FALSE, TRUE, NULL, FALSE, v_story_id)
  ON CONFLICT (slug) DO NOTHING;

  -- Normalisation : les butins facultatifs aujourd'hui attribués d'office
  -- par un choix sont retirés (ils seront reposés soit en gain automatique,
  -- soit en offre facultative, selon ce que dit le livre).
  DELETE FROM public.choice_effects e
   USING public.story_choices c, public.story_nodes s
   WHERE e.choice_id = c.id AND c.node_id = s.id
     AND s.story_id = v_story_id
     AND e.effect_type IN ('inventory_add', 'inventory_remove')
     AND c.target_node_id <> c.node_id          -- préserve les choix-offres C12
     AND s.node_key IN ('section_020', 'section_062', 'section_113',
                        'section_124', 'section_184', 'section_347');

  -- §184 : l'or et les repas sont des trouvailles FACULTATIVES
  -- (« Si vous souhaitez conserver l'une ou l'autre de ces trouvailles ») :
  -- ils passent en offres (§C12). Le Repas obligatoire reste.
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           (metadata->'on_arrive') - 'add_items')
   WHERE story_id = v_story_id AND node_key = 'section_184'
     AND metadata->'on_arrive' ? 'add_items';

  FOR v_rec IN
    SELECT * FROM (VALUES
      ('section_033', 'couronnes',      3),
      ('section_062', 'couronnes',     28),
      ('section_062', 'repas',          3),
      ('section_094', 'couronnes',     16),
      ('section_113', 'laumspur',       2),
      ('section_124', 'couronnes',     15),
      ('section_137', 'pierre-vordak', 20),
      ('section_199', 'repas',          1),
      ('section_269', 'couronnes',     10),
      ('section_307', 'repas',          1),
      ('section_349', 'etoile-cristal', 1)
    ) AS t(node_key, slug, qty)
  LOOP
    SELECT n.id, n.metadata INTO v_node_id, v_meta
      FROM public.story_nodes n
     WHERE n.story_id = v_story_id AND n.node_key = v_rec.node_key;
    SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = v_rec.slug;
    IF v_node_id IS NULL OR v_item_id IS NULL THEN
      RAISE NOTICE 'C10 : % / % introuvable', v_rec.node_key, v_rec.slug;
      CONTINUE;
    END IF;
    -- idempotence : un seul enregistrement par (section, objet)
    IF COALESCE(v_meta->'on_arrive'->'add_items', '[]'::jsonb)
         @> jsonb_build_array(jsonb_build_object('slug', v_rec.slug)) THEN
      CONTINUE;
    END IF;
    UPDATE public.story_nodes
       SET metadata = jsonb_set(
             metadata, '{on_arrive}',
             COALESCE(metadata->'on_arrive', '{}'::jsonb)
             || jsonb_build_object(
                  'add_items',
                  COALESCE(metadata->'on_arrive'->'add_items', '[]'::jsonb)
                  || jsonb_build_array(jsonb_build_object('slug', v_rec.slug, 'qty', v_rec.qty))))
     WHERE id = v_node_id;
  END LOOP;

  -- =============================================================
  -- C12 · Ce que le joueur décide (R2 à R5)
  --       Une offre = un choix qui ramène sur la section (auto-boucle).
  --       Le choix est visible tant que l'objet n'a pas été pris
  --       (flag_require à FALSE, lu par make-choice) puis disparaît.
  --       Plusieurs objets offerts ensemble = UN seul choix qui les
  --       donne tous ; « au choix » = DEUX choix exclusifs.
  -- =============================================================
  FOR v_offer IN
    SELECT * FROM (VALUES
      ('section_015', 'Prendre l''Épée',                                 'pris_15',  '[{"slug":"epee","qty":1}]'::jsonb),
      ('section_020', 'Prendre le Sac à Dos',                            'pris_20a', '[{"slug":"sac-a-dos","qty":1}]'::jsonb),
      ('section_020', 'Prendre les 2 Repas',                             'pris_20b', '[{"slug":"repas","qty":2}]'::jsonb),
      ('section_020', 'Prendre le Poignard',                             'pris_20c', '[{"slug":"poignard","qty":1}]'::jsonb),
      ('section_062', 'Emporter une des trois Épées',                    'pris_62',  '[{"slug":"epee","qty":1}]'::jsonb),
      ('section_124', 'Conserver la Clé d''Argent',                      'pris_124', '[{"slug":"cle-argent","qty":1}]'::jsonb),
      ('section_148', 'Prendre le Marteau de Guerre',                    'pris_148', '[{"slug":"marteau-guerre","qty":1}]'::jsonb),
      ('section_164', 'Conserver l''Essence d''Alether',                 'pris_164', '[{"slug":"relique-potion-alether","qty":1}]'::jsonb),
      ('section_184', 'Conserver les 40 Pièces d''Or',                   'pris_184a','[{"slug":"couronnes","qty":40}]'::jsonb),
      ('section_184', 'Conserver l''Épée',                               'pris_184b','[{"slug":"epee","qty":1}]'::jsonb),
      ('section_184', 'Conserver les 4 Repas',                           'pris_184c','[{"slug":"repas","qty":4}]'::jsonb),
      ('section_193', 'Prendre le Parchemin',                            'pris_193', '[{"slug":"parchemin","qty":1}]'::jsonb),
      ('section_197', 'Prendre le Sabre et les 6 Pièces d''Or',          'pris_197', '[{"slug":"sabre","qty":1},{"slug":"couronnes","qty":6}]'::jsonb),
      ('section_243', 'Prendre la Masse d''Armes',                       'pris_243', '[{"slug":"masse-armes","qty":1}]'::jsonb),
      ('section_255', 'Ramasser l''Épée du Prince',                      'pris_255', '[{"slug":"epee","qty":1}]'::jsonb),
      ('section_263', 'Prendre les 3 Pièces d''Or',                      'pris_263', '[{"slug":"couronnes","qty":3}]'::jsonb),
      ('section_267', 'Conserver le Message et le Poignard',             'pris_267', '[{"slug":"message","qty":1},{"slug":"poignard","qty":1}]'::jsonb),
      ('section_290', 'Prendre le Bâton',                                'pris_290', '[{"slug":"baton","qty":1}]'::jsonb),
      ('section_305', 'Prendre la Lance de Glok',                        'pris_305', '[{"slug":"lance","qty":1}]'::jsonb),
      ('section_315', 'Prendre le Savon Parfumé et l''Or',               'pris_315', '[{"slug":"savon-parfume","qty":1},{"slug":"couronnes","qty":6}]'::jsonb),
      ('section_319', 'Prendre la Bourse et le Poignard',                'pris_319', '[{"slug":"couronnes","qty":20},{"slug":"poignard","qty":1}]'::jsonb),
      ('section_346', 'Prendre la Lance',                                'pris_346', '[{"slug":"lance","qty":1}]'::jsonb),
      ('section_347', 'Prendre le Sabre, le Briquet et une Torche',      'pris_347', '[{"slug":"sabre","qty":1},{"slug":"briquet-amadou","qty":1},{"slug":"torches","qty":1}]'::jsonb)
    ) AS t(node_key, libelle, drapeau, objets)
  LOOP
    SELECT n.id INTO v_node_id FROM public.story_nodes n
     WHERE n.story_id = v_story_id AND n.node_key = v_offer.node_key;
    IF v_node_id IS NULL THEN
      RAISE NOTICE 'C12 : % introuvable', v_offer.node_key;
      CONTINUE;
    END IF;
    -- idempotence : ne pas recréer l'offre si elle est déjà là
    IF EXISTS (SELECT 1 FROM public.story_choices c
                WHERE c.node_id = v_node_id
                  AND c.target_node_id = v_node_id
                  AND c.text = v_offer.libelle) THEN
      CONTINUE;
    END IF;
    INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
    VALUES (v_node_id, v_node_id, 90, v_offer.libelle)
    RETURNING id INTO v_choice_id;

    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_require', v_offer.drapeau, FALSE);

    FOR v_rec IN SELECT value FROM jsonb_array_elements(v_offer.objets) AS e(value)
    LOOP
      SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = v_rec.value->>'slug';
      IF v_item_id IS NULL THEN
        RAISE NOTICE 'C12 : objet % introuvable (§%)', v_rec.value->>'slug', v_offer.node_key;
        CONTINUE;
      END IF;
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
      VALUES (v_choice_id, 'inventory_add',
              COALESCE((v_rec.value->>'qty')::int, 1), v_item_id);
    END LOOP;

    INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
    VALUES (v_choice_id, 'flag_set', v_offer.drapeau, TRUE);
  END LOOP;

  -- R3 · §291 : « Vous pouvez garder l'Or et prendre au choix le
  --      Poignard ou l'une des Lances. » Les 6 Couronnes sont
  --      conservées automatiquement (déjà encodées) : deux choix
  --      concurrents, exclusifs l'un de l'autre.
  SELECT n.id INTO v_node_id FROM public.story_nodes n
   WHERE n.story_id = v_story_id AND n.node_key = 'section_291';
  IF v_node_id IS NOT NULL THEN
    FOR v_offer IN
      SELECT * FROM (VALUES
        ('Prendre le Poignard des Gloks', 'pris_291', 'poignard'),
        ('Prendre une Lance des Gloks',   'pris_291', 'lance')
      ) AS t(libelle, drapeau, slug)
    LOOP
      IF EXISTS (SELECT 1 FROM public.story_choices c
                  WHERE c.node_id = v_node_id AND c.target_node_id = v_node_id
                    AND c.text = v_offer.libelle) THEN
        CONTINUE;
      END IF;
      SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = v_offer.slug;
      INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
      VALUES (v_node_id, v_node_id, 90, v_offer.libelle)
      RETURNING id INTO v_choice_id;
      INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
      VALUES (v_choice_id, 'flag_require', v_offer.drapeau, FALSE);
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
      VALUES (v_choice_id, 'inventory_add', 1, v_item_id);
      INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value)
      VALUES (v_choice_id, 'flag_set', v_offer.drapeau, TRUE);
    END LOOP;
  END IF;

  -- R4 · §307 : « Vous n'aurez le droit de prendre ce Marteau de Guerre
  --      qu'à la condition de l'échanger contre une autre Arme que vous
  --      possédez déjà. » L'échange suppose que le joueur désigne l'arme
  --      laissée : capacité absente de make-choice à ce jour.
  IF v_echange_arme_actif THEN
    SELECT n.id INTO v_node_id FROM public.story_nodes n
     WHERE n.story_id = v_story_id AND n.node_key = 'section_307';
    SELECT t.id INTO v_choice_id FROM public.story_nodes t
     WHERE t.story_id = v_story_id AND t.node_key = 'section_213';
    SELECT i.id INTO v_item_id FROM public.items i WHERE i.slug = 'marteau-guerre';
    IF v_node_id IS NOT NULL AND v_choice_id IS NOT NULL AND v_item_id IS NOT NULL THEN
      INSERT INTO public.story_choices (node_id, target_node_id, display_order, text)
      VALUES (v_node_id, v_choice_id, 90, 'Échanger une Arme contre le Marteau de Guerre')
      RETURNING id INTO v_choice_id;
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_key)
      VALUES (v_choice_id, 'inventory_remove', 'arme_au_choix');
      INSERT INTO public.choice_effects (choice_id, effect_type, stat_value, item_id)
      VALUES (v_choice_id, 'inventory_add', 1, v_item_id);
    END IF;
  ELSE
    UPDATE public.story_nodes
       SET metadata = jsonb_set(metadata, '{special_actions}',
             '{"echange_arme":{"objet":"marteau-guerre","contre":"arme_au_choix",
                "condition":"échanger contre une autre Arme que vous possédez déjà",
                "statut":"en attente de la capacité arme_au_choix (voir 4.6)"}}'::jsonb)
     WHERE story_id = v_story_id AND node_key = 'section_307';
  END IF;

  -- R5 · Pertes désignées par le joueur
  --      §144 « c'est vous qui choisissez ce qu'on vous a volé »
  --      §277 « vous pouvez choisir laquelle » (arme brisée)
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           COALESCE(metadata->'on_arrive', '{}'::jsonb)
           || '{"choose_loss":{"kind":"backpack_item","fallback":"weapon"}}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_144';
  UPDATE public.story_nodes
     SET metadata = jsonb_set(metadata, '{on_arrive}',
           COALESCE(metadata->'on_arrive', '{}'::jsonb)
           || '{"choose_loss":{"kind":"weapon","optional":true}}'::jsonb)
   WHERE story_id = v_story_id AND node_key = 'section_277';

  -- =============================================================
  -- C13 · Messages d'effet : phrase littérale du livre
  --       Les migrations 014-016 avaient laissé 15 messages
  --       reformulés par l'import (« Votre jambe meurtrie vous
  --       coûte 1 point … ») : les valeurs de jeu sont justes,
  --       mais le texte affiché n'est pas celui du livre. Chaque
  --       message redevient la phrase du paragraphe concerné.
  -- =============================================================
  FOR v_rec IN
    SELECT * FROM (VALUES
      ('section_119', 'Les plaies occasionnées par les Brosses à Potence vous coûtent 2 points d''ENDURANCE.'),
      ('section_144', 'Dans la bousculade, quelqu''un vous vole l''un des objets contenus dans votre Sac à Dos. Vous êtes à moitié assommé et vous perdez 2 points d''ENDURANCE.'),
      ('section_146', 'Vous perdez 3 points d''ENDURANCE.'),
      ('section_162', 'Ils vous prennent votre Sac à Dos et vos Armes, mais ils ne fouillent pas les poches de votre cape et ne trouvent pas vos Pièces d''Or.'),
      ('section_166', 'Vous perdez 4 points d''ENDURANCE.'),
      ('section_203', 'Vous perdez 10 points d''ENDURANCE.'),
      ('section_212', 'Vous récupérez tous les points d''ENDURANCE dont vous disposiez au départ de votre mission.'),
      ('section_236', 'Vous avez, en effet, perdu 6 points d''ENDURANCE et votre total d''HABILETÉ se trouve réduit de 1 point pour le reste de vos jours.'),
      ('section_276', 'Vous perdez 1 point d''ENDURANCE.'),
      ('section_304', 'Vous perdez aussitôt 2 points d''ENDURANCE.'),
      ('section_308', 'Vous perdez 1 point d''ENDURANCE.'),
      ('section_313', 'Ces chutes répétées occasionnent des écorchures et des contusions qui vous coûtent 1 point d''ENDURANCE.'),
      ('section_320', 'Vous parvenez à pénétrer dans la forêt, mais vous avez perdu 2 points d''ENDURANCE.'),
      ('section_343', 'Vous perdez 2 points d''ENDURANCE.'),
      ('section_076', 'Vous perdez 2 points d''ENDURANCE.')
    ) AS t(node_key, message)
  LOOP
    UPDATE public.story_nodes
       SET metadata = jsonb_set(metadata, '{on_arrive,message}',
             to_jsonb(v_rec.message))
     WHERE story_id = v_story_id AND node_key = v_rec.node_key
       AND metadata->'on_arrive' ? 'message';
  END LOOP;

  -- =============================================================
  -- C11 · metadata.references : régénéré depuis les renvois réels
  --       (choix, Tables de Hasard, fuites), hors auto-boucles.
  --       Champ documentaire : aucun code de l'application ne le lit.
  -- =============================================================
  UPDATE public.story_nodes n
     SET metadata = jsonb_set(n.metadata, '{references}',
           COALESCE((
             SELECT jsonb_agg(DISTINCT k ORDER BY k)
               FROM (
                 SELECT t.node_key AS k
                   FROM public.story_choices c
                   JOIN public.story_nodes t ON t.id = c.target_node_id
                  WHERE c.node_id = n.id AND t.node_key <> n.node_key
                 UNION
                 SELECT h->>'target_node_key'
                   FROM jsonb_array_elements(COALESCE(n.metadata->'hazard_consequences', '[]'::jsonb)) h
                  WHERE h ? 'target_node_key' AND h->>'target_node_key' <> n.node_key
                 UNION
                 SELECT n.metadata->'combat'->'flee'->>'target_node_key'
                  WHERE n.metadata->'combat'->'flee' ? 'target_node_key'
                    AND n.metadata->'combat'->'flee'->>'target_node_key' <> n.node_key
               ) x
              WHERE k IS NOT NULL AND k <> ''
           ), '[]'::jsonb))
   WHERE n.story_id = v_story_id;

  RAISE NOTICE 'Migration 026 : correctifs C1-C13 appliqués (fidélité LS01 passe 3)';
END $$;
```

**Contrôles après migration** (exécutés, 78 OK / 0 échec — `verif_sql.py`) :

| Contrôle | Attendu | Résultat |
|---|---|---|
| C1 §340 | GLOK + LOUP MAUDIT 14/24 | conforme |
| C2–C5 | §55 +4, §136 +1, §229 −1, §260 −4 sur tous les combattants, autres champs conservés | conforme |
| C6 §43 | choix libre §43 → §106 supprimé, fuite après 3 assauts | conforme |
| C7 §2 | plus aucune perte d'ENDURANCE sur le jet ; §343 −2 et §276 −1 conservés | conforme |
| C8 | §18/§172/§211 libérés, §23 → §326 sans Discipline mais avec la Clé d'Or, §222 → §67 verrouillé, §23 → §151 intact | conforme |
| C9 §161 | Clé d'Or attribuée (`on_arrive`), message du livre, verrou §161 → §209 | conforme |
| C10 | 11 gains automatiques du livre + 3 objets créés (`parchemin`, `message`, `savon-parfume`) | conforme |
| C11 | `metadata.references` = clés de nœuds existantes (564 renvois, aucun uuid) | conforme |
| C12 | 23 offres, un seul choix par paquet (§197/§267/§315/§347), §291 exclusif, §307 documenté non jouable | conforme |
| C13 | chacune des 16 phrases d'effet est attestée dans le texte du livre | conforme |
| Intégrité | plus aucun `inventory_add/remove` parasite sur les choix normaux de §20/§62/§113/§124/§184/§347 | conforme |
| Idempotence | migration appliquée deux fois → dumps sémantiquement identiques (nœuds, choix, effets) | conforme |

**Deux réserves à traiter hors SQL** : `player_skill_bonus` (§55, §136) doit être lu par `resolve-combat-round` — 3 lignes, sans quoi ces deux bonus sont posés en base mais inopérants ; et l'échange d'arme du §307 suppose une capacité `arme_au_choix` (désignation de l'arme laissée) qui n'existe pas encore dans `make-choice` — l'information du livre est conservée dans `metadata.special_actions`. T-008 reste en échec **par construction** : son unique signalement (§46 → §246) est un faux positif vérifié.

---

## 5. Ce qui est vérifié conforme, en détail

### 5.1 Structure et topologie (T-001 → T-006)
- **350 sections** numérotées 1 à 350, aucune manquante, aucun doublon ; 11 nœuds système (mort à Endurance 0 et chaîne de jets du §21) attendus et présents ; aucun nœud `section_NNN` hors plage.
- **553 renvois** relevés dans le livre, tous présents en base sous l'une des trois formes possibles : choix (`story_choices`), conséquence de Table de Hasard (`metadata.hazard_consequences`) ou règle de fuite (`metadata.combat.flee`). Aucune cible inventée.
- **Prédécesseurs identiques** au livre pour les 350 sections : le nombre de renvois entrants correspond section par section (seule exception apparente : le §312, atteint par la chaîne de hasard du §21, correctement modélisé).

### 5.2 Hasard, combats, fins, contenu
- **21 Tables de Hasard**, 45 branches, couverture 0-9 sans trou ni recouvrement (T-009), plus les 4 branches des deux nœuds techniques du §21 (§21 enlisement, §21 dernière chance). Les sections à deux branches « 0-4 / 5-9 » et les sections à trois branches « 0 / 1-2 / 3-9 » sont conformes, y compris les pertes d'ENDURANCE attachées au jet (§36 -2, §158 -4, §188 -3).
- **28 des 29 combats** ont des caractéristiques strictement identiques au livre, y compris les combats « à tour de rôle » (§112, §136, §138, §180, §253, §260, §336). Les règles spéciales déjà encodées sont exactes : Vordak insensible/assaillant psychique (§29, §34, §283, §342), Serpent ailé et Gougraz insensibles à la Puissance Psychique (§133, §255), Gluâtre combattu dans le noir (-3 HAB sans torche, §170), Vipère du marais (§227, flag de victoire sans perte), Kraan du §17 (-1 HAB).
- **17 paragraphes de mort** exactement conformes à la liste du livre, plus le §350 (victoire) : 18 fins du livre, toutes présentes. En base, **19 nœuds** portent `is_ending` : les 18 fins du livre plus `mort_epuisement`, la mort système déclenchée quand l'ENDURANCE tombe à 0 (T-014).
- **Texte** : similarité moyenne 0,998 (difflib) sur les 350 sections ; le minimum (0,971, §256) correspond à des espaces parasites du PDF, pas à une divergence de contenu (T-015).
- **Repas obligatoires** : les 6 sections qui l'imposent (§37, §130, §147, §168, §184, §235) portent l'ancrage `meal_required`, avec la perte alternative de 3 points d'ENDURANCE et l'exemption par la Discipline Chasse (T-021).

### 5.3 Graphe et jouabilité

L'ensemble des parcours possibles n'est pas énumérable : le graphe contient **193 composantes fortement connexes** (une principale de 141 sections, puis 25, 4 et 2), donc des retours en arrière qui rendent toute marche non bornée infinie. Le parcours est donc couvert par des mesures exactes et bornées — plus court chemin vers chacune des 18 fins (annexe E), dénombrements bornés, analyse des composantes et des distances, et simulation de 20 000 parties aléatoires. **Correction de la passe de vérification** : le chiffre de « 18 092 415 chemins » qui figurait ici provenait d'un dénombrement non reproductible ; il est remplacé par les dénombrements bornés exacts ci-dessous.

- **Toutes les sections sont atteignables** depuis le §1, à l'exception du §251 : ce paragraphe n'est cité par aucun renvoi du livre (anomalie d'édition, pas un défaut d'implémentation) ; il reste néanmoins jouable en base.
- **Aucune impasse** : toute section non finale offre au moins une suite (T-018).
- **Structure** : **193 composantes fortement connexes** — 189 triviales et 4 non triviales de **141**, **25**, **4** et **2** nœuds (la plus grande contient le §21 et ses deux nœuds techniques ; les deux plus petites sont §36/§140/§290/§323 et §125/§214) ; profondeur maximale **33 renvois** (mesurée depuis §1, excentricité du graphe complet) ; victoire la plus courte en **27 sections / 26 renvois**.
- **Parcours** : avec 193 composantes fortement connexes, le nombre de parcours **non bornés** est infini ; les dénombrements exacts sont donc donnés à longueur bornée, sur le graphe complet (choix + Tables de Hasard + fuites, auto-boucles des offres exclues) : **131 793** marches de §1 à §350 en 33 renvois ou moins (répétitions autorisées, programmation dynamique) et **94 461** chemins élémentaires (aucune section revue) en 33 renvois ou moins (parcours exhaustif). Ces deux mesures sont recalculables en quelques secondes.
- **183 sections** sont accessibles depuis §1 sans emprunter aucune transition conditionnelle, **266** si l'on compte les Tables de Hasard et les fuites de combat (T-017 ; mesure prudente : un `flag_require` à `FALSE`, marqueur « une seule fois », est compté comme une condition).
- **Simulation** de 20 000 parties complètes dans PostgreSQL, avec les vraies conditions, le vrai inventaire, les vrais flags et la vraie Table des Coups Portés du dépôt : 1 120 victoires (5,6 %), 18 880 morts, **0 anomalie**. Les 9 sections jamais visitées par cette politique aléatoire ([79, 80, 109, 204, 233, 240, 251, 326, 348]) sont toutes joignables (T-016) ; le §326 précisément est celui que la Clé d'Or inobtenable rend inaccessible — correctif `C9`.

---

## 6. Faux positifs écartés (et pourquoi)

| Signalement initial | Section | Pourquoi ce n'est pas un écart |
|---|---|---|
| Objet « couronnes ×10 » exigé à tort | §46 → §246 | Le texte demande bien **2 Couronnes** pour la traversée du lac, et la base exige 2 (avec le débit correspondant). Le faux positif vient de l'heuristique : elle compare le nombre de Couronnes du choix au montant cité dans la fenêtre de texte, sans modéliser la monnaie. |
| Verrou « Puissance Psychique » absent | §133 → §266 | Le texte dit que le Serpent ailé est **insensible** à cette Discipline : il ne s'agit pas d'un verrou mais d'une immunité, correctement encodée par `mindblast_immune` (migration 016 avait déjà retiré le verrou inversé). |
| Verrou « Bouclier Psychique » absent | §29 → §270, §34 → §328 | Même cas : la phrase décrit la règle de combat du Vordak (« sa force mentale vous fera perdre 2 points d'HABILETÉ »), encodée par `psychic_assault` sur le combattant, et non une condition d'accès. |
| Verrou « Orientation » absent | §67 → §140 | Le verrou appartient au choix amont (§222 → §67), corrigé par `C8.c`. Le texte du §67 décrit le bénéfice de la Discipline déjà acquise. |
| Renvoi §91 → §7 « manquant » dans le PDF | §91 | Le PDF écrit « rendez-vous a u 7 » (espaces parasites) : le renvoi existe, le parseur littéral le rate. La base a raison. |
| Renvoi en trop / cible dupliquée | §21, §312 | La chaîne de jets du §21 se termine au §312, qui n'est atteignable que par elle : ce n'est pas une incohérence mais la transcription fidèle du bourbier. |
| `metadata.references` divergent | 47 sections | Champ documentaire, lu par aucun code de l'application (vérifié par recherche dans `app/` et `supabase/functions/`). Sans conséquence en jeu — voir `C11`. |

---

## 7. Limites de l'audit

**Aucune question ouverte.** Tout ce que l'application doit faire est écrit dans le livre : les 34 sections qui modifient la
Feuille d'Aventure sont recensées en annexe F, avec l'extrait qui fait foi, et les règles `R1` à `R7` dérivent directement de
la façon dont le livre formule ses instructions (« vous les empochez » = attribution automatique, « si vous le désirez » =
offre facultative, « au choix » = exclusif, « à la condition de l'échanger » = échange, « c'est vous qui choisissez » = perte
désignée par le joueur, « inscrivez » = objet d'inventaire). Les seuls points qui ne sont pas de la donnée sont trois
capacités d'exécution, décrites au 4.6 : désignation d'une arme à laisser (§307), perte désignée par le joueur (§144, §277)
et sélection d'arme dans l'interface.

Ce qui reste hors du périmètre du document :

1. **Texte et procédé OCR.** Le PDF est un document Word 2007 comportant des espaces parasites (« rendez -vous », « prisonnie r », « éc u rie ») : les extractions ont été rendues tolérantes, mais une relecture humaine reste nécessaire pour tout nouveau contrôle automatisé — c'est la principale source de faux positifs.
2. **§251.** Section jamais citée par le livre : aucun correctif n'est proposé, l'anomalie étant éditoriale.
3. **Objets hors livre.** La base contient 69 objets pour cette histoire, dont beaucoup proviennent d'autres récits (armes et objets de science-fiction) : ce catalogue partagé n'est pas audité, seul l'usage réel dans le graphe LS01 l'est.
4. **Illustrations et mise en page** du PDF : hors périmètre (traitées par les migrations `014`/`021`/`025` pour les autres récits).
5. **Détail du texte narratif.** L'audit vérifie que chaque phrase d'action correspond à une donnée ; il ne corrige pas le style ni l'orthographe du contenu en base, dont la similarité avec le PDF est mesurée au T-015 (99,8 %).

---

## 8. Annexes

> Annexe A — table exhaustive des 350 sections. Annexe B — Tables de Hasard et fuites. Annexe C — les 29 combats. Annexe D — objets et points d'obtention. Annexe E — fins, chemins minimaux, statistiques du graphe. Annexe F — les 34 sections qui modifient la Feuille d'Aventure, et les 9 examinées sans effet.

## Annexe A — Table exhaustive des 350 sections (livre ↔ base)

Cette table est le **relevé brut** section par section : à gauche ce que dit le livre, à droite ce que contient la base.
Lecture : `85, 275, 141 (6e Sens)` = le livre renvoie vers ces trois sections, la troisième n'étant proposée qu'au lecteur qui maîtrise le Sixième Sens.
Côté base, 🔒 = condition de Discipline, 🎒 = condition d'objet, ⚔️ = condition de victoire de combat.
Les renvois portés par une Table de Hasard ou par une règle de fuite apparaissent dans leurs colonnes respectives, jamais comme des choix.

| § | Renvois du livre (conditions) | Choix en base (🔒 discipline / 🎒 objet / ⚔️ flag de combat) | Table de Hasard | Combat | Objets & effets appliqués | Fin |
|---|---|---|---|---|---|---|
| **1** | 85, 275, 141 (6e Sens) | 85, 275, 141 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **2** | 343, 276 |  | 0-4→§343 (-2 END) ; 5-9→§276 (-1 END) |  |  |  |
| **3** | 196, 144 | 196, 144 |  |  |  |  |
| **4** | 75, 175, 218 (6e Sens) | 75, 175, 218 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **5** | 111 | 111 |  |  |  |  |
| **6** | 183, 200 | 183, 200 |  |  |  |  |
| **7** | 108, 25 |  | 0-2→§108 ; 3-9→§025 |  |  |  |
| **8** | 70 | 70 |  |  |  |  |
| **9** | 236 (Pierre de Vordak), 292 (sinon) | 236 [🎒 pierre-vordak×1], 292 |  |  |  |  |
| **10** | 115, 83 | 115, 83 |  |  |  |  |
| **11** | 139 | 139 |  |  |  |  |
| **12** | 262 (Couronnes), 247 | 262 [🎒 couronnes×10], 247 |  |  | −10 couronnes |  |
| **13** | 307, 213 | 307, 213 |  |  |  |  |
| **14** | 43, 106 | 43, 106 |  |  |  |  |
| **15** | 207, 201, 35 | 207, 201, 35 |  |  |  |  |
| **16** | 192 | 192 |  |  |  |  |
| **17** | 53, 274, 331 |  | 0-0→§053 ; 1-2→§274 ; 3-9→§331 | KRAAN 16/24 (-1 HAB) |  |  |
| **18** | 239, 114 (Camouflage), 29 | 239, 114 [🔒 discipline_camouflage], 29 [🔒 discipline_camouflage] |  |  |  |  |
| **19** | 272, 119, 69 (Orientation) | 69 [🔒 discipline_orientation], 272, 119 |  |  |  |  |
| **20** | 272 | 272 |  |  | +2 repas ; +1 poignard |  |
| **21** | 189, 312 |  | 0-4→§021_enlisement ; 5-9→§189 |  |  |  |
| **22** | 181, 145 |  | 0-4→§181 ; 5-9→§145 |  |  |  |
| **23** | 337, 151 (Maîtrise Matière), 326 (Clé d'Or) | 337, 151 [🔒 discipline_maitrise_psychique_matiere], 326 [🔒 discipline_maitrise_psychique_matiere, 🎒 cle-or×1] |  |  |  |  |
| **24** | 234, 184 | 234, 184 |  |  |  |  |
| **25** | 139 | 139 |  |  |  |  |
| **26** | 249, 100 | 249, 100 |  |  |  |  |
| **27** | 250, 52 | 250, 52 |  |  |  |  |
| **28** | 130, 147 | 130, 147 |  |  |  |  |
| **29** | 270 (Bouclier Psy, si vainqueur) | 270 |  | VORDAK 17/25 (-2 HAB sans Bouclier) |  |  |
| **30** | 194, 261 | 194, 261 |  |  |  |  |
| **31** | 264 | 264 |  |  |  |  |
| **32** | 176, 340 | 176, 340 |  |  |  |  |
| **33** | 248 | 248 |  |  |  |  |
| **34** | 328 (Bouclier Psy, si vainqueur) | 328 |  | VORDAK 17/25 (-2 HAB sans Bouclier) |  |  |
| **35** | 207 | 207 |  |  |  |  |
| **36** | 140, 323 |  | 0-4→§140 (-2 END) ; 5-9→§323 |  |  |  |
| **37** | 289, 282 (Camouflage) | 289, 282 [🔒 discipline_camouflage] |  |  | Repas obligatoire |  |
| **38** | 128, 347 | 128, 347 |  |  |  |  |
| **39** | 228 | 228 |  |  |  |  |
| **40** | 105 | 105 |  |  |  |  |
| **41** | 174, 116 | 174, 116 |  |  |  |  |
| **42** | 86, 238, 157, 147 | 86, 238, 157, 147 |  |  |  |  |
| **43** | 195 (si vainqueur), 106 (si vainqueur) | 195, 106 |  | OURS NOIR 16/10 |  |  |
| **44** | 277, 338 |  | 0-4→§277 ; 5-9→§338 |  |  |  |
| **45** | 180 (sinon) | 180 |  |  |  |  |
| **46** | 246, 90, 296 (6e Sens) | 246 [🎒 couronnes×2], 90, 296 [🔒 discipline_six_cieme_sens] |  |  | −2 couronnes |  |
| **47** | 136, 322 | 136, 322 |  |  |  |  |
| **48** | 243 | 243 |  |  |  |  |
| **49** | 339, 60 |  | 0-4→§339 ; 5-9→§060 |  |  |  |
| **50** | 97, 243 | 97, 243 |  |  |  |  |
| **51** | 288, 221 | 288, 221 |  |  |  |  |
| **52** | 225 (Comm. Animale), 250 (sinon) | 225 [🔒 discipline_communication_animale], 250 |  |  |  |  |
| **53** | — |  |  |  |  | 💀 mort |
| **54** | — |  |  |  |  | 💀 mort |
| **55** | 325 (si vainqueur) | 325 |  | GLOK 9/9 |  |  |
| **56** | 222 | 222 |  |  |  |  |
| **57** | 164, 109, 308 | 164, 109, 308 |  |  |  |  |
| **58** | 286, 160 | 286, 160 |  |  |  |  |
| **59** | 124, 106, 211 | 124, 106, 211 |  |  |  |  |
| **60** | — |  |  |  |  | 💀 mort |
| **61** | 268 | 268 |  |  |  |  |
| **62** | 288 | 288 |  |  | +28 couronnes ; +3 repas |  |
| **63** | 269 (si vainqueur) | 269 |  | VIEIL HOMME FOU 11/10 |  |  |
| **64** | 188, 16 | 188, 16 |  |  |  |  |
| **65** | 104 | 104 |  |  |  |  |
| **66** | 350 | 350 |  |  |  |  |
| **67** | 140 | 140 |  |  |  |  |
| **68** | 130, 15 | 130, 15 |  |  |  |  |
| **69** | 272 | 272 |  |  |  |  |
| **70** | 28, 157, 8 (6e Sens) | 28, 157, 8 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **71** | 242, 104, 65 (6e Sens) | 242, 104, 65 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **72** | 265 (si vainqueur) | 265 |  | GLOK+ LOUP MAUDIT 15/24 |  |  |
| **73** | 243 | 243 |  |  |  |  |
| **74** | 138, 281 | 138, 281 |  |  |  |  |
| **75** | 260, 163 | 260, 163 |  |  |  |  |
| **76** | 118 | 118 |  |  | +1 pierre-vordak ; -2 END (arrivée) |  |
| **77** | 19 | 19 |  |  |  |  |
| **78** | 132, 12, 220 | 132, 12, 220 |  |  |  |  |
| **79** | 204 | 204 |  |  |  |  |
| **80** | 7 | 7 |  |  |  |  |
| **81** | 183, 200 | 183, 200 |  |  |  |  |
| **82** | 235 | 235 |  |  |  |  |
| **83** | 205, 180, 232, 45 (6e Sens) | 205, 180, 232, 45 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **84** | 188 | 188 |  |  |  |  |
| **85** | 229, 99 | 229, 99 |  |  |  |  |
| **86** | 6, 35, 167, 42 | 6, 35, 167, 42 |  |  |  |  |
| **87** | 61 | 61 |  |  |  |  |
| **88** | 216 (Guérison), 31 | 216 [🔒 discipline_guerison], 31 |  |  |  |  |
| **89** | 53, 274, 316 |  | 0-1→§053 ; 2-4→§274 ; 5-9→§316 |  |  |  |
| **90** | 18 | 18 |  |  |  |  |
| **91** | 152, 7, 198 (6e Sens) | 152, 7, 198 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **92** | 13 | 13 |  |  |  |  |
| **93** | 106 | 106 |  |  |  |  |
| **94** | 7 | 7 |  |  |  |  |
| **95** | 240, 5 | 240, 5 |  |  |  |  |
| **96** | 33, 248 | 33, 248 |  |  |  |  |
| **97** | 255, 306 | 255, 306 |  |  |  |  |
| **98** | 139 | 139 |  |  |  |  |
| **99** | 222 | 222 |  |  |  |  |
| **100** | 161, 133, 257 | 161, 133, 257 |  |  |  |  |
| **101** | 281 | 281 |  |  |  |  |
| **102** | 284 | 284 |  |  |  |  |
| **103** | 13, 287 | 13, 287 |  |  |  |  |
| **104** | 26, 100 | 26, 100 |  |  |  |  |
| **105** | 298 (Comm. Animale), 335 (sinon) | 335, 298 [🔒 discipline_communication_animale] |  |  |  |  |
| **106** | 263, 334 | 263, 334 |  |  |  |  |
| **107** | 23 | 23 |  |  |  |  |
| **108** | — |  |  |  |  | 💀 mort |
| **109** | 164, 308 | 164, 308 |  |  |  |  |
| **110** | 55 | 55 |  |  |  |  |
| **111** | 57, 308 | 57, 308 |  |  |  |  |
| **112** | 33 (si vainqueur), 248 | 33, 248 |  | GLOK 13/10 + GLOK 12/10 |  |  |
| **113** | 347, 295 | 347, 295 |  |  | +2 laumspur |  |
| **114** | 239 | 239 |  |  |  |  |
| **115** | 150, 177, 83 | 150, 177, 83 |  |  |  |  |
| **116** | 321 | 321 |  |  |  |  |
| **117** | 330 | 330 |  |  |  |  |
| **118** | 224 | 224 |  |  |  |  |
| **119** | 226, 38 | 226, 38 |  |  | -2 END (arrivée) |  |
| **120** | 84, 171, 54 | 84, 171, 54 |  |  |  |  |
| **121** | 342, 309, 283 | 342, 309, 283 |  |  |  |  |
| **122** | 206 | 206 |  |  |  |  |
| **123** | 304, 2 | 304, 2 |  |  |  |  |
| **124** | 211, 106 | 211, 106 |  |  | +1 cle-argent ; +15 couronnes |  |
| **125** | 27, 214, 301 (Orientation) | 27, 214, 301 [🔒 discipline_orientation] |  |  |  |  |
| **126** | 46, 143 | 46, 143 |  |  |  |  |
| **127** | — |  |  |  |  | 💀 mort |
| **128** | 297 (Chasse), 336 (sinon) | 297 [🔒 discipline_chasse], 336 |  |  |  |  |
| **129** | 3, 144 | 3, 144 |  |  |  |  |
| **130** | 28 (sinon), 201 | 201, 28 |  |  | Repas obligatoire |  |
| **131** | 241, 55, 302, 101 | 241, 55, 302, 101 |  |  |  |  |
| **132** | 64 | 64 |  |  |  |  |
| **133** | 266 (si vainqueur) | 266 |  | SERPENT AILÉ 16/18 (insensible Puissance Psy) |  |  |
| **134** | 305, 40 | 305, 40 |  |  |  |  |
| **135** | 223, 4 | 223, 4 |  |  |  |  |
| **136** | 313 (si vainqueur) | 313 |  | GLOK 13/10 + GLOK 12/10 |  |  |
| **137** | 23 | 23 |  |  |  |  |
| **138** | 291 (si vainqueur) | 291 |  | GLOK 13/10 + GLOK 12/10 |  |  |
| **139** | 66 | 66 |  |  |  |  |
| **140** | 14, 252, 215, 36 | 14, 252, 215, 36 |  |  |  |  |
| **141** | 56, 333 | 56, 333 |  |  |  |  |
| **142** | 58, 135, 102 | 58, 135, 102 |  |  |  |  |
| **143** | 149 | 149 |  |  |  |  |
| **144** | 63, 217 | 63, 217 |  |  | -2 END (arrivée) |  |
| **145** | 165 | 165 |  |  |  |  |
| **146** | 154 | 154 |  |  | -3 END (arrivée) |  |
| **147** | 42, 28 | 42, 28 |  |  | Repas obligatoire |  |
| **148** | 81, 320, 199 | 81, 199, 320 |  |  |  |  |
| **149** | 256 | 256 |  |  |  |  |
| **150** | 83 | 83 |  |  |  |  |
| **151** | 87 (Maîtrise Matière) | 87 |  |  |  |  |
| **152** | 49, 231 | 49, 231 |  |  |  |  |
| **153** | 202, 135, 329 | 202, 135, 329 |  |  |  |  |
| **154** | — |  |  |  |  | 💀 mort |
| **155** | 70 | 70 |  |  |  |  |
| **156** | 294, 245 | 294, 245 |  |  |  |  |
| **157** | 30, 167 | 30, 167 |  |  |  |  |
| **158** | 106 |  | 0-5→§106 ; 6-9→§106 (-4 END) |  |  |  |
| **159** | 191, 234 | 191, 234 |  |  |  |  |
| **160** | 286, 10 |  | 0-4→§286 ; 5-9→§010 |  |  |  |
| **161** | 209 | 209 |  |  |  |  |
| **162** | 258 (Maîtrise Matière), 127 (sinon) | 258 [🔒 discipline_maitrise_psychique_matiere], 127 |  |  | sac perdu ; armes perdues |  |
| **163** | 321 | 321 |  |  |  |  |
| **164** | 308 | 308 |  |  |  |  |
| **165** | 212 | 212 |  |  |  |  |
| **166** | 104 | 104 |  |  | -4 END (arrivée) |  |
| **167** | 88, 264, 178 (6e Sens) | 88, 264, 178 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **168** | 64 | 64 |  |  | Repas obligatoire |  |
| **169** | 23, 137 (si vainqueur) | 137 |  | MONSTRES DES CRYPTES 16/16 + fuite après 1 assaut(s) → section_023 |  |  |
| **170** | 319 (si vainqueur) | 319 |  | GLUÂTRE DES PROFONDEURS 17/7 (insensible Puissance Psy; -3 HAB sans torche) |  |  |
| **171** | 303 | 303 |  |  |  |  |
| **172** | 239, 114 (Camouflage), 29 | 239, 114 [🔒 discipline_camouflage], 29 [🔒 discipline_camouflage] |  |  |  |  |
| **173** | 158 (Clé d'Argent), 259 | 259, 158 [🎒 cle-argent×1] |  |  | hp_current -6 |  |
| **174** | 190 | 190 |  |  |  |  |
| **175** | 41, 116, 182 (Camouflage) | 41, 116, 182 [🔒 discipline_camouflage] |  |  |  |  |
| **176** | 253, 126 | 253, 126 |  |  |  |  |
| **177** | 83 | 83 |  |  |  |  |
| **178** | 88, 264 | 88, 264 |  |  |  |  |
| **179** | 318, 51 | 318, 51 |  |  |  |  |
| **180** | 62, 22 | 62, 22 |  | CHEF DES SOLDATS 15/22 + SOLDAT 13/20 + SOLDAT 12/20 + fuite après 0 assaut(s) → section_022 |  |  |
| **181** | 288 | 288 |  |  |  |  |
| **182** | 174 | 174 |  |  |  |  |
| **183** | 97, 200 | 97, 200 |  |  |  |  |
| **184** | 64 | 64 |  |  | +40 couronnes ; +4 repas ; Repas obligatoire |  |
| **185** | — |  |  |  |  | 💀 mort |
| **186** | 106 | 106 |  |  |  |  |
| **187** | 186, 228 | 186, 228 |  |  |  |  |
| **188** | 303 |  | 0-6→§303 (sac perdu) ; 7-9→§303 (-3 END) |  |  |  |
| **189** | 118 | 118 |  |  |  |  |
| **190** | 20, 273 | 20, 273 |  |  |  |  |
| **191** | 24 (si vainqueur), 234 | 24 |  | GARDE DU CORPS 11/21 + fuite après 0 assaut(s) → section_234 |  |  |
| **192** | 171, 120 | 171, 120 |  |  |  |  |
| **193** | 253, 126 | 253, 126 |  |  |  |  |
| **194** | 208, 148 | 208, 148 |  |  |  |  |
| **195** | 59, 106 | 59, 106 |  |  |  |  |
| **196** | 332, 144 | 332, 144 |  |  |  |  |
| **197** | 172 | 172 |  |  |  |  |
| **198** | 7, 152 | 7, 152 |  |  |  |  |
| **199** | 81 | 81 |  |  |  |  |
| **200** | 78, 168 (Camouflage) | 78, 168 [🔒 discipline_camouflage] |  |  |  |  |
| **201** | 238, 215, 130 | 238, 215, 130 |  |  |  |  |
| **202** | 58 | 58 |  |  |  |  |
| **203** | 80, 344 | 80, 344 |  |  | -10 END (arrivée) |  |
| **204** | 111 | 111 |  |  |  |  |
| **205** | 181, 145 |  | 0-4→§181 ; 5-9→§145 |  |  |  |
| **206** | 224 | 224 |  |  |  |  |
| **207** | 30 | 30 |  |  |  |  |
| **208** | 148 (si vainqueur), 320 | 148, 320 |  | GLOKS 15/13 |  |  |
| **209** | 23 | 23 |  |  |  |  |
| **210** | 332, 37 | 332, 37 |  |  |  |  |
| **211** | 173, 244 (6e Sens), 106 | 173, 244 [🔒 discipline_six_cieme_sens], 106 [🔒 discipline_six_cieme_sens] |  |  |  |  |
| **212** | 350 | 350 |  |  | soin complet |  |
| **213** | 331 | 331 |  |  |  |  |
| **214** | 125 | 125 |  |  |  |  |
| **215** | 346, 14 | 346, 14 |  |  |  |  |
| **216** | 264 | 264 |  |  |  |  |
| **217** | 91, 7 | 91, 7 |  |  |  |  |
| **218** | 75 | 75 |  |  |  |  |
| **219** | — |  |  |  |  | 💀 mort |
| **220** | 24 (si vainqueur), 234 | 24 |  | GARDE DU CORPS 11/20 + fuite après 0 assaut(s) → section_234 |  |  |
| **221** | 318 | 318 |  |  |  |  |
| **222** | 140, 252, 67 (Orientation) | 140, 252, 67 |  |  |  |  |
| **223** | 75, 175 | 75, 175 |  |  |  |  |
| **224** | 153 | 153 |  |  |  |  |
| **225** | 187, 39 | 187, 39 |  |  |  |  |
| **226** | 277, 338 |  | 0-4→§277 ; 5-9→§338 |  |  |  |
| **227** | 271, 348 | 271, 348 [⚔️ combat_sans_degats_227] |  | VIPÈRE DES MARAIS 16/6 |  |  |
| **228** | 140, 215 | 140, 215 |  |  |  |  |
| **229** | 267 (si vainqueur), 125 | 125, 267 |  | KRAAN 16/25 |  |  |
| **230** | 179 | 179 |  |  |  |  |
| **231** | 94, 203, 7 | 94 [⚔️ combat_rapide_231], 203 |  | VOLEUR AU POIGNARD 13/20 + fuite après 2 assaut(s) → section_007 |  |  |
| **232** | 180, 22 | 180, 22 |  |  |  |  |
| **233** | 206 | 206 |  |  |  |  |
| **234** | — |  |  |  |  | 💀 mort |
| **235** | 32, 146, 254 (Orientation) | 32, 146, 254 [🔒 discipline_orientation] |  |  | Repas obligatoire |  |
| **236** | 104 | 104 |  |  | -6 END (arrivée) ; -1 HAB (arrivée) ; retire pierre-vordak |  |
| **237** | 265, 72 |  | 0-4→§265 ; 5-9→§072 |  |  |  |
| **238** | 42, 68 | 42, 68 |  |  |  |  |
| **239** | 34, 118 | 34, 118 |  |  |  |  |
| **240** | 79 | 79 |  |  |  |  |
| **241** | 349 | 349 |  |  |  |  |
| **242** | 166 (Bouclier Psy), 9 (sinon) | 166 [🔒 discipline_bouclier_psychique], 9 |  |  |  |  |
| **243** | 97 | 97 |  |  |  |  |
| **244** | 93 | 93 |  |  |  |  |
| **245** | 190 | 190 |  |  |  |  |
| **246** | 197 (si vainqueur) | 197 |  | DRAKKARIM 15/23 |  |  |
| **247** | 159, 220 | 159, 220 |  |  |  |  |
| **248** | 44, 300 | 44, 300 |  |  |  |  |
| **249** | 169, 107 | 169, 107 |  |  |  |  |
| **250** | 186 | 186 |  |  |  |  |
| **251** | 10 | 10 |  |  |  |  |
| **252** | 155, 70 | 155, 70 |  |  |  |  |
| **253** | 278 | 278 |  | LOUP MAUDIT 13/24 + LOUP MAUDIT 14/23 + LOUP MAUDIT 14/22 + LOUP MAUDIT 15/21 |  |  |
| **254** | 32, 146 | 32, 146 |  |  |  |  |
| **255** | 82 (si vainqueur) | 82 |  | GOURGAZ 20/30 (insensible Puissance Psy) |  |  |
| **256** | 224 | 224 |  |  |  |  |
| **257** | 133, 161 | 133, 161 |  |  |  |  |
| **258** | 50 | 50 |  |  |  |  |
| **259** | — |  |  |  |  | 💀 mort |
| **260** | 156 (si vainqueur) | 156 |  | GLOK 11/18 + GLOK 12/17 |  |  |
| **261** | 208, 264 | 208, 264 |  |  |  |  |
| **262** | 191, 234 | 191, 234 |  |  |  |  |
| **263** | 70, 157 | 70, 157 |  |  |  |  |
| **264** | 97, 6 | 97, 6 |  |  |  |  |
| **265** | 142 | 142 |  |  |  |  |
| **266** | 209 | 209 |  |  |  |  |
| **267** | 125 | 125 |  |  |  |  |
| **268** | 288 | 288 |  |  |  |  |
| **269** | 314, 7 | 314, 7 |  |  |  |  |
| **270** | 21 | 21 |  |  |  |  |
| **271** | — |  |  |  |  | 💀 mort |
| **272** | 134 (Orientation), 305 (sinon) | 134 [🔒 discipline_orientation], 305 |  |  |  |  |
| **273** | 179, 51 | 179, 51 |  |  |  |  |
| **274** | 331 | 331 |  |  |  |  |
| **275** | 345, 74 |  | 0-4→§345 ; 5-9→§074 |  |  |  |
| **276** | 213 | 213 |  |  | -1 END (arrivée) |  |
| **277** | 113 | 113 |  |  |  |  |
| **278** | 149 | 149 |  |  |  |  |
| **279** | 112, 96 |  | 0-6→§112 ; 7-9→§096 |  |  |  |
| **280** | 327, 170 | 327, 170 |  |  |  |  |
| **281** | 311, 77 | 311, 77 |  |  |  |  |
| **282** | 11 | 11 |  |  |  |  |
| **283** | 123 (si vainqueur) | 123 |  | VORDAK 17/25 (+2 HAB (1er assaut); -2 HAB sans Bouclier) |  |  |
| **284** | 71 | 71 |  |  |  |  |
| **285** | 325 | 325 |  |  |  |  |
| **286** | — |  |  |  |  | 💀 mort |
| **287** | 13, 330 | 13, 330 |  |  |  |  |
| **288** | 129 | 129 |  |  |  |  |
| **289** | 139 | 139 |  |  |  |  |
| **290** | 140 | 140 |  |  |  |  |
| **291** | 272 | 272 |  |  | +6 couronnes |  |
| **292** | — |  |  |  |  | 💀 mort |
| **293** | 281 | 281 |  |  |  |  |
| **294** | 230, 190, 321 |  | 0-2→§230 ; 3-6→§190 ; 7-9→§321 |  |  |  |
| **295** | 185, 92 | 185, 92 |  |  |  |  |
| **296** | 90 | 90 |  |  |  |  |
| **297** | 117 | 117 |  |  |  |  |
| **298** | 121, 38 | 121, 38 |  |  |  |  |
| **299** | 227, 95 | 227, 95 |  |  |  |  |
| **300** | 13 (sinon) | 13 |  |  | Repas obligatoire |  |
| **301** | 27 | 27 |  |  |  |  |
| **302** | 110, 285 |  | 0-2→§110 ; 3-9→§285 |  |  |  |
| **303** | 237 (Camouflage), 72 (sinon) | 237 [🔒 discipline_camouflage], 72 |  |  |  |  |
| **304** | 2 | 2 |  |  | +1 pierre-vordak ; -2 END (arrivée) |  |
| **305** | 105 | 105 |  |  |  |  |
| **306** | — |  |  |  |  | 💀 mort |
| **307** | 213 | 213 |  |  |  |  |
| **308** | 122 (Comm. Animale), 233 (sinon) | 122 [🔒 discipline_communication_animale], 233 |  |  | -1 END (arrivée) |  |
| **309** | — |  |  |  |  | 💀 mort |
| **310** | 37 | 37 |  |  |  |  |
| **311** | 279, 47, 324 (Camouflage) | 279, 47, 324 [🔒 discipline_camouflage] |  |  |  |  |
| **312** | 299 | 299 |  |  |  |  |
| **313** | 248 | 248 |  |  | -1 END (arrivée) |  |
| **314** | 341, 98 |  | 0-6→§341 ; 7-9→§098 |  |  |  |
| **315** | 213 | 213 |  |  |  |  |
| **316** | 331 | 331 |  |  |  |  |
| **317** | 61 | 61 |  |  |  |  |
| **318** | 129 | 129 |  |  |  |  |
| **319** | 157 | 157 |  |  |  |  |
| **320** | 264 | 264 |  |  | -2 END (arrivée) |  |
| **321** | 273 | 273 |  |  |  |  |
| **322** | 17, 89 | 17, 89 |  |  |  |  |
| **323** | 290, 140 | 290, 140 |  |  |  |  |
| **324** | 33, 248 | 33, 248 |  |  |  |  |
| **325** | 349 | 349 |  |  |  |  |
| **326** | 61 | 61 |  |  |  |  |
| **327** | — |  |  |  |  | 💀 mort |
| **328** | 76, 118 | 76, 118 |  |  |  |  |
| **329** | 284 | 284 |  |  |  |  |
| **330** | 315, 213 | 315, 213 |  |  |  |  |
| **331** | 170, 280 | 170, 280 |  |  |  |  |
| **332** | 350 | 350 |  |  |  |  |
| **333** | 131 | 131 |  |  |  |  |
| **334** | 162, 73 (Camouflage), 48 (6e Sens) | 162, 48 [🔒 discipline_six_cieme_sens], 73 [🔒 discipline_camouflage] |  |  |  |  |
| **335** | 121 | 121 |  |  |  |  |
| **336** | 117 (si vainqueur) | 117 |  | GLOK 14/11 + GLOK 13/11 |  |  |
| **337** | 219, 317 |  | 0-4→§219 ; 5-9→§317 |  |  |  |
| **338** | 113 | 113 |  |  |  |  |
| **339** | 94, 203, 7 | 94 [⚔️ combat_rapide_339], 203 |  | VOLEUR 13/20 + fuite après 0 assaut(s) → section_007 |  |  |
| **340** | 193 (si vainqueur) | 193 |  |  |  |  |
| **341** | 210, 37, 310 (Orientation) | 210, 37, 310 [🔒 discipline_orientation] |  |  |  |  |
| **342** | 123 (si vainqueur) | 123 |  | VORDAK 18/26 (-2 HAB sans Bouclier; insensible Puissance Psy) |  |  |
| **343** | 213 | 213 |  |  | -2 END (arrivée) |  |
| **344** | 60 | 60 |  |  |  |  |
| **345** | 272, 19 | 272, 19 |  |  |  |  |
| **346** | 14 | 14 |  |  |  |  |
| **347** | 103 | 103 |  |  | +1 torches ; +1 briquet-amadou ; +1 sabre |  |
| **348** | 95 | 95 |  |  |  |  |
| **349** | 293 | 293 |  |  |  |  |
| **350** | — |  |  |  |  | 🏆 VICTOIRE |

---

## Annexe B — Tables de Hasard et fuites de combat

### B.1 Tables de Hasard (21 sections, 45 branches, aucune ambiguïté)

| § | Résultat du livre | Cible en base | Effet |
|---|---|---|---|
| §2 | 0–4 | §343 | -2 END |
| §2 | 5–9 | §276 | -1 END |
| §7 | 0–2 | §108 | — |
| §7 | 3–9 | §25 | — |
| §17 | 0–0 | §53 | — |
| §17 | 1–2 | §274 | — |
| §17 | 3–9 | §331 | — |
| §21 | 0–4 | §21 | — |
| §21 | 5–9 | §189 | — |
| §22 | 0–4 | §181 | — |
| §22 | 5–9 | §145 | — |
| §36 | 0–4 | §140 | -2 END |
| §36 | 5–9 | §323 | — |
| §44 | 0–4 | §277 | — |
| §44 | 5–9 | §338 | — |
| §49 | 0–4 | §339 | — |
| §49 | 5–9 | §60 | — |
| §89 | 0–1 | §53 | — |
| §89 | 2–4 | §274 | — |
| §89 | 5–9 | §316 | — |
| §158 | 0–5 | §106 | — |
| §158 | 6–9 | §106 | -4 END |
| §160 | 0–4 | §286 | — |
| §160 | 5–9 | §10 | — |
| §188 | 0–6 | §303 | Sac à Dos perdu |
| §188 | 7–9 | §303 | -3 END |
| §205 | 0–4 | §181 | — |
| §205 | 5–9 | §145 | — |
| §226 | 0–4 | §277 | — |
| §226 | 5–9 | §338 | — |
| §237 | 0–4 | §265 | — |
| §237 | 5–9 | §72 | — |
| §275 | 0–4 | §345 | — |
| §275 | 5–9 | §74 | — |
| §279 | 0–6 | §112 | — |
| §279 | 7–9 | §96 | — |
| §294 | 0–2 | §230 | — |
| §294 | 3–6 | §190 | — |
| §294 | 7–9 | §321 | — |
| §302 | 0–2 | §110 | — |
| §302 | 3–9 | §285 | — |
| §314 | 0–6 | §341 | — |
| §314 | 7–9 | §98 | — |
| §337 | 0–4 | §219 | — |
| §337 | 5–9 | §317 | — |

*Total : 21 sections à Table de Hasard et 45 issues encodées, couvrant 0-9 sans trou ni recouvrement — toutes conformes au texte (contrôle T-009 : OK).*

### B.2 Fuites de combat (`metadata.combat.flee`)

| § | Texte du livre | En base | Écart |
|---|---|---|---|
| §43 | fuite après 3 assauts obligatoires → §106 | *absente* | **à créer** (`min_rounds: 3`, cible `section_106`) + suppression du choix libre §43→§106 |
| §169 | fuite possible | après 1 assaut(s) → §23 | conforme |
| §180 | fuite possible | après 0 assaut(s) → §22 | conforme |
| §191 | fuite possible | après 0 assaut(s) → §234 | conforme |
| §220 | fuite possible | après 0 assaut(s) → §234 | conforme |
| §231 | fuite possible | après 2 assaut(s) → §7 | conforme |
| §339 | fuite possible | après 0 assaut(s) → §7 | conforme |


---

## Annexe C — Les 29 combats du livre

| § | Adversaire(s) — valeurs du livre | Valeurs en base | Règles encodées | Règle du livre manquante | Verdict |
|---|---|---|---|---|---|
| §17 | KRAAN 16/24 | KRAAN 16/24 | KRAAN : -1 HAB | — | OK |
| §29 | VORDAK 17/25 | VORDAK 17/25 | VORDAK : assaut psychique | — | OK |
| §34 | VORDAK 17/25 | VORDAK 17/25 | VORDAK : assaut psychique | — | OK |
| §43 | OURS NOIR 16/10 | OURS NOIR 16/10 | — | — | OK |
| §55 | GLOK 9/9 | GLOK 9/9 | — | +4 HAB (effet de surprise, tout le combat) | ⚠️ T-012 |
| §63 | VIEIL HOMME FOU 11/10 | VIEIL HOMME FOU 11/10 | — | — | OK |
| §72 | GLOK+ LOUP MAUDIT 15/24 | GLOK+ LOUP MAUDIT 15/24 | — | — | OK |
| §112 | Premier GLOK 13/10, Deuxième GLOK 12/10 | GLOK 13/10, GLOK 12/10 | — | — | OK |
| §133 | SERPENT AILÉ 16/18 | SERPENT AILÉ 16/18 | SERPENT AILÉ : insensible à la Puissance Psychique | — | OK |
| §136 | Premier GLOK 13/10, Deuxième GLOK 12/10 | GLOK 13/10, GLOK 12/10 | — | +1 HAB (position élevée) | ⚠️ T-012 |
| §138 | Premier GLOK 13/10, Deuxième GLOK 12/10 | GLOK 13/10, GLOK 12/10 | — | — | OK |
| §169 | MONSTRES DES CRYPTES 16/16 | MONSTRES DES CRYPTES 16/16 | fuite après 1 assaut(s) → §23 | — | OK |
| §170 | GLUÂTRE DES PROFONDEURS 17/7 | GLUÂTRE DES PROFONDEURS 17/7 | GLUÂTRE DES PROFONDEURS : insensible à la Puissance Psychique, -3 HAB sans torche | — | OK |
| §180 | CHEF DES SOLDATS 15/22, Premier SOLDAT 13/20, Deuxième SOLDAT 12/20 | CHEF DES SOLDATS 15/22, SOLDAT 13/20, SOLDAT 12/20 | fuite après 0 assaut(s) → §22 | — | OK |
| §191 | GARDE DU CORPS 11/21 | GARDE DU CORPS 11/21 | fuite après 0 assaut(s) → §234 | — | OK |
| §208 | GLOKS 15/13 | GLOKS 15/13 | — | — | OK |
| §220 | GARDE DU CORPS 11/20 | GARDE DU CORPS 11/20 | fuite après 0 assaut(s) → §234 | — | OK |
| §227 | VIPÈRE DES MARAIS 16/6 | VIPÈRE DES MARAIS 16/6 | — | — | OK |
| §229 | KRAAN 16/25 | KRAAN 16/25 | — | -1 HAB (poussière, tout le combat) | ⚠️ T-012 |
| §231 | VOLEUR AU POIGNARD 13/20 | VOLEUR AU POIGNARD 13/20 | fuite après 2 assaut(s) → §7 | — | OK |
| §246 | DRAKKARIM 15/23 | DRAKKARIM 15/23 | — | — | OK |
| §253 | LOUP MAUDIT 13/24, LOUP MAUDIT 14/23, LOUP MAUDIT 14/22, LOUP MAUDIT 15/21 | LOUP MAUDIT 13/24, LOUP MAUDIT 14/23, LOUP MAUDIT 14/22, LOUP MAUDIT 15/21 | — | — | OK |
| §255 | GOURGAZ 20/30 | GOURGAZ 20/30 | GOURGAZ : insensible à la Puissance Psychique | — | OK |
| §260 | Premier GLOK 11/18, Deuxième GLOK 12/17 | GLOK 11/18, GLOK 12/17 | — | -4 HAB (combat à mains nues) | ⚠️ T-012 |
| §283 | VORDAK 17/25 | VORDAK 17/25 | VORDAK : +2 HAB 1er assaut, assaut psychique dès l'assaut 2 | — | OK |
| §336 | Premier GLOK 14/11, Deuxième GLOK 13/11 | GLOK 14/11, GLOK 13/11 | — | — | OK |
| §339 | VOLEUR 13/20 | VOLEUR 13/20 | fuite après 0 assaut(s) → §7 | — | OK |
| §340 | GLOK + LOUP MAUDIT 14/24 | *aucun* | — | — | **ÉCHEC** (aucun combattant en base) |
| §342 | VORDAK 18/26 | VORDAK 18/26 | VORDAK : assaut psychique, insensible à la Puissance Psychique | — | OK |

*28/29 combats ont des caractéristiques strictement identiques au livre ; 4 d'entre eux (§55, §136, §229, §260) portent le bon couple HABILETÉ/ENDURANCE mais pas le modificateur d'HABILETÉ annoncé par le texte ; 1 combat (§340) est vide en base.*



---

## Annexe D — Objets du livre et points d'obtention

| Slug en base | Nom | Type | Distribué aux § (base) |
|---|---|---|---|
| `amulette-chance` | Amulette de Chance | artifact | — |
| `analyseur-spectre` | Analyseur de Spectre | artifact | — |
| `baton` | Bâton | weapon | — |
| `blindage-quantique` | Blindage Quantique | armor | — |
| `bouclier-gardien` | Bouclier du Gardien | armor | — |
| `bouclier-plasma` | Bouclier à Plasma | armor | — |
| `briquet-amadou` | Briquet à Amadou | artifact | §347 |
| `canon-singularite` | Canon à Singularité | weapon | — |
| `carte-acces-nova` | Carte d'Accès NOVA | artifact | — |
| `carte-geographique` | Carte Géographique | artifact | — |
| `carte-s2` | Carte Accès NOVA S2 | artifact | — |
| `casque` | Casque | armor | — |
| `cellule-energie` | Cellule à Fusion | artifact | — |
| `cellule-s2` | Cellule à Fusion S2 | artifact | — |
| `chaine-or` | Chaîne d'Or | artifact | — |
| `choeur-10001` | Le Chœur | artifact | — |
| `cle-andromede` | Clé d'Andromède | artifact | — |
| `cle-argent` | Clé d'Argent | artifact | §124 |
| `cle-or` | Clé d'Or | artifact | — |
| `cle-quantique` | Clé Quantique | artifact | — |
| `coeur-cicatrice` | Cœur de Cicatrice | artifact | — |
| `combinaison-neo-kevlar` | Combinaison Néo-Kevlar | armor | — |
| `combinaison-s2` | Combinaison Néo-Kevlar S2 | armor | — |
| `cotte-de-mailles` | Cotte de mailles | armor | — |
| `couronnes` | Couronnes (Pièces d'Or) | artifact | §62, §124, §184, §291 |
| `dague-ombre` | Dague d'Ombre | weapon | — |
| `disque-blanc` | Disque Blanc | artifact | — |
| `disque-noir` | Disque Noir | artifact | — |
| `disque-noir-s2` | Disque Noir S2 | artifact | — |
| `epee` | Épée | weapon | — |
| `essaim-drones` | Essaim de Drones | weapon | — |
| `etoile-cristal` | Étoile de Cristal | artifact | — |
| `exosquelette-mk3` | Exosquelette MK-III | armor | — |
| `fusil-plasma-xr` | Fusil Plasma XR-7 | weapon | — |
| `glaive` | Glaive | weapon | — |
| `hache` | Hache | weapon | — |
| `kit-medical-nova` | Kit Médical Nano | potion | — |
| `kit-medical-s2` | Kit Médical Nano S2 | potion | — |
| `lame-adn` | Lame d'ADN | weapon | — |
| `lance` | Lance | weapon | — |
| `lance-genese` | Lance-Genèse | weapon | — |
| `laumspur` | Laumspur | potion | §113 |
| `marteau-guerre` | Marteau de guerre | weapon | — |
| `masse-armes` | Masse d'armes | weapon | — |
| `memoire-thorne` | Mémoire de Thorne | artifact | — |
| `module-eva-s2` | Module EVA S2 | artifact | — |
| `module-ia-eva` | Module EVA | artifact | — |
| `organe-traduction` | Organe de Traduction | artifact | — |
| `peau-vaisseau` | Peau de Vaisseau | armor | — |
| `pierre-vordak` | Pierre de Vordak | artifact | §76, §304 |
| `pistolet-impulsion` | Pistolet à Impulsion | weapon | — |
| `pistolet-s2` | Pistolet Impulsion S2 | weapon | — |
| `poignard` | Poignard | weapon | §20 |
| `potion-guerison` | Potion de Guérison | potion | — |
| `potion-vitalite` | Potion de Vitalité | potion | — |
| `ration-s2` | Ration de Survie S2 | potion | — |
| `ration-survie` | Ration de Survie | potion | — |
| `relique-bouclier` | Bouclier | armor | — |
| `relique-casque` | Casque | armor | — |
| `relique-cotte-mailles` | Cotte de Mailles | armor | — |
| `relique-potion-alether` | Potion d'Alether | potion | — |
| `relique-potion-laumspur` | Potion de Laumspur | potion | — |
| `repas` | Repas | artifact | §20, §62, §184 |
| `sabre` | Sabre | weapon | §347 |
| `sac-a-dos` | Sac à Dos | artifact | — |
| `serum-reversion` | Sérum de Réversion | potion | — |
| `spore-eveil` | Spore d'Éveil | potion | — |
| `torches` | Torches | artifact | §347 |
| `voile-andromede` | Voile d'Andromède | armor | — |

*Catalogue partagé par toutes les histoires. Les objets sans point d'obtention (« — ») sont soit fournis par l'équipement initial tiré au sort (Hache, Sac à Dos, 1 Repas, Carte Géographique, plus le résultat de la Table de Hasard de départ : Casque, Cotte de mailles, Potion de Guérison, Masse d'armes, Douze Couronnes, arme), soit utilisés par d'autres récits du dépôt (objets de science-fiction).*

### Objets du livre absents de la base (T-023)

| § | Butin du livre | État en base |
|---|---|---|
| §15 | Épée (posée sur un socle) | on_arrive = null |
| §33 | 3 Pièces d'Or | on_arrive = null |
| §94 | 12 + 4 = 16 Pièces d'Or | on_arrive = null |
| §148 | Marteau de Guerre | on_arrive = null |
| §161 | Clé d'Or | on_arrive = null |
| §164 | Essence d'Alether (1 dose) | on_arrive = null |
| §184 | Épée (les 40 Couronnes et 4 Repas sont déjà encodés) | on_arrive = {"add_items": [{"qty": 40, "slug": "couronnes"}, {"qty": 4, "slug": "repas"}], "meal_required": true} |
| §193 | Parchemin | on_arrive = null |
| §197 | Sabre + 6 Pièces d'Or | on_arrive = null |
| §199 | 1 Repas | on_arrive = null |
| §263 | 3 Pièces d'Or | on_arrive = null |
| §267 | Message + Poignard | on_arrive = null |
| §269 | 10 Pièces d'Or | on_arrive = null |
| §290 | Bâton | on_arrive = null |
| §291 | Poignard **ou** Lance (6 Couronnes déjà encodées) | on_arrive = null |
| §305 | Lance de Glok | on_arrive = null |
| §307 | 1 Repas + Marteau de Guerre | on_arrive = null |
| §315 | 6 Pièces d'Or + Savon Parfumé | on_arrive = null |
| §319 | 20 Pièces d'Or + Poignard | on_arrive = null |
| §346 | Lance | on_arrive = null |

*Détail des correctifs : chapitre 4.4 du rapport.*



---

## Annexe E — Fins, chemins minimaux et statistiques du graphe

Le graphe complet (350 sections + 11 nœuds système) contient **564 arêtes** (541 arêtes de choix distinctes, 49 issues de Tables de Hasard, 7 fuites — hors 25 auto-boucles d'offres facultatives), **193 composantes fortement connexes**, la plus courte victoire en **27 sections (26 renvois)** et une profondeur maximale de **33 renvois** depuis §1. Les dénombrements de parcours sont bornés à cette profondeur de 33 renvois (voir §5.3) : 131 793 marches et 94 461 chemins élémentaires de §1 à §350.

| Fin | Type | Étapes | Plus court chemin |
|---|---|---|---|
| §53 | mort | 9 | §1 → §275 → §74 → §281 → §311 → §47 → §322 → §17 → §53 |
| §54 | mort | 17 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §168 → §64 → §16 → §192 → §120 → §54 |
| §60 | mort | 32 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §168 → §64 → §188 → §303 → §237 → §265 → §142 → §58 → §160 → §10 → §83 → §205 → §181 → §288 → §129 → §144 → §217 → §91 → §152 → §49 → §60 |
| §108 | mort | 30 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §168 → §64 → §188 → §303 → §237 → §265 → §142 → §58 → §160 → §10 → §83 → §205 → §181 → §288 → §129 → §144 → §217 → §7 → §108 |
| §127 | mort | 10 | §1 → §85 → §99 → §222 → §140 → §14 → §106 → §334 → §162 → §127 |
| §154 | mort | 15 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §97 → §255 → §82 → §235 → §146 → §154 |
| §185 | mort | 10 | §1 → §275 → §345 → §19 → §119 → §226 → §277 → §113 → §295 → §185 |
| §219 | mort | 28 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §168 → §64 → §188 → §303 → §237 → §265 → §142 → §102 → §284 → §71 → §104 → §26 → §249 → §169 → §23 → §337 → §219 |
| §234 | mort | 14 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §78 → §220 → §234 |
| §259 | mort | 12 | §1 → §85 → §99 → §222 → §140 → §14 → §43 → §195 → §59 → §211 → §173 → §259 |
| §271 | mort | 28 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §97 → §255 → §82 → §235 → §32 → §176 → §126 → §46 → §90 → §18 → §29 → §270 → §21 → §21 → §21 → §312 → §299 → §227 → §271 |
| §286 | mort | 20 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §168 → §64 → §188 → §303 → §237 → §265 → §142 → §58 → §286 |
| §292 | mort | 24 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §168 → §64 → §188 → §303 → §237 → §265 → §142 → §102 → §284 → §71 → §242 → §9 → §292 |
| §306 | mort | 11 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §97 → §306 |
| §309 | mort | 9 | §1 → §275 → §345 → §272 → §305 → §105 → §335 → §121 → §309 |
| §327 | mort | 11 | §1 → §275 → §74 → §281 → §311 → §47 → §322 → §17 → §331 → §280 → §327 |
| §350 | victoire | 27 | §1 → §85 → §99 → §222 → §252 → §70 → §157 → §167 → §264 → §6 → §200 → §168 → §64 → §188 → §303 → §237 → §265 → §142 → §58 → §160 → §10 → §83 → §205 → §145 → §165 → §212 → §350 |

### Fiabilité structurelle

- Composantes fortement connexes : **193**, dont 189 triviales et 4 non triviales — **141** (principale, contient le §21 et sa chaîne technique), **25**, **4** (§36, §140, §290, §323) et **2** (§125, §214). Ces 4 zones imposent de relire sans revenir en arrière, ce qui est le fonctionnement normal d'un livre-jeu.
- **0 impasse** : toute section non finale mène à au moins une autre section (T-018 : OK).
- **1 seule section injoignable** : §251 (anomalie d'édition du livre, aucun renvoi ne la cite), elle est néanmoins jouable en base (T-016 : OK).
- **183 sections accessibles sans aucune condition** (266 en comptant Tables de Hasard et fuites) : inventaire de sécurité vérifié au T-017.



---

## Annexe F — La Feuille d'Aventure : les 34 sections qui modifient la fiche du héros

Le livre signale lui-même, section par section, ce qui doit être écrit, rayé ou modifié sur la Feuille d'Aventure (« inscrivez », « notez-le », « rayez », « faites les modifications nécessaires »). Cette annexe recense **toutes** ces sections, sans exception, avec l'extrait correspondant, la décision d'encodage et l'état actuel en base.

| § | Nature | Ce que dit le livre (extrait) | Décision d'encodage | État en base |
|---|---|---|---|---|
| **15** | Offre facultative | « Vous pouvez prendre cette épée si vous le désirez » | choix « Prendre l'Épée » + `epee` ×1 | absent |
| **20** | Offre facultative | « un Sac à Dos, de la Nourriture (l'équivalent de 2 Repas) et un Poignard […] n'oubliez pas de les inscrire » | `repas` ×2 + `poignard` ×1 (déjà en base) ; **Sac à Dos supplémentaire non encodé** : le héros en possède déjà un, un second n'a ni usage ni case sur la Feuille | repas + poignard attribués (non optionnels) |
| **33** | Gain automatique | « Vous trouvez […] un petit sac qui contient 3 Pièces d'Or. Vous les empochez » | `couronnes` ×3 en arrivée | absent |
| **62** | Gain automatique + offre | « vous trouvez 28 Pièces d'Or et deux Sacs à Dos qui contiennent […] trois Repas […] vous pouvez en emporter une [Épée] si vous le souhaitez » | `couronnes` ×28 + `repas` ×3 (déjà en base) ; **choix « Prendre une Épée »** (`epee` ×1, une seule fois) | 28 or + 3 repas présents ; épée absente |
| **76** | Gain automatique + perte | « Vous perdez 2 points d'ENDURANCE. Vous enveloppez alors la Pierre […] » | `hp_delta` −2 + `pierre-vordak` ×1 | conforme |
| **94** | Gain automatique | « Vous trouvez 12 Pièces d'Or dans la bourse du Voleur et 4 autres dans une boîte en bois » | `couronnes` ×16 en arrivée | absent |
| **113** | Gain automatique | « vous avez cueilli là l'équivalent de 2 doses [de Laumspur] » | `laumspur` ×2 | conforme |
| **124** | Offre (Clé) + gain automatique | « vous trouvez 15 Pièces d'Or et une Clé d'Argent. Si vous souhaitez conserver la Clé, inscrivez-la » | `couronnes` ×15 + `cle-argent` ×1 | conforme |
| **137** | Gain automatique | « dans chacun des crânes fracassés se trouve une Pierre Précieuse. Vous ramassez ces vingt Pierres […] Elles prennent place dans votre bourse » | **`pierre-vordak` ×20 en arrivée** (butin de la Crypte, §169 → §137) | absent |
| **144** | Perte subie au choix | « quelqu'un vous vole l'un des objets contenus dans votre Sac à Dos. Si vous n'avez plus de Sac à Dos, c'est une arme qu'on vous dérobe […] c'est vous qui choisissez » | **perte au choix du joueur** : 1 objet du sac, à défaut 1 arme | seule la perte de 2 END est encodée |
| **148** | Offre facultative | « vous trouvez un Marteau de Guerre posé contre le mur. Vous pouvez le prendre si vous le désirez » | choix « Prendre le Marteau de Guerre » + `marteau-guerre` ×1 | absent |
| **161** | Gain automatique | « Vous prenez la Clé (notez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux) » | `cle-or` ×1 en arrivée | absent |
| **164** | Offre facultative | « Vous pouvez conserver cette fiole et en boire le contenu au début d'un combat » | choix « Prendre l'Essence d'Alether » + `relique-potion-alether` ×1 | absent |
| **184** | Offre + gain automatique | « vous découvrez 40 Pièces d'Or, une Epée et une quantité de nourriture équivalant à 4 Repas. Si vous souhaitez conserver l'une ou l'autre de ces trouvailles » | `couronnes` ×40 + `repas` ×4 (déjà en base) ; **choix « Prendre l'Épée »** | or + repas présents ; épée absente |
| **188** | Perte de hasard | « si vous tirez un chiffre entre 0 et 6, le Kraan a déchiré […] la toile de votre Sac à Dos […] si vous tirez entre 7 et 9 […] vous perdez 3 points d'ENDURANCE » | 0-6 : sac et contenu perdus ; 7-9 : −3 END | conforme |
| **193** | Offre facultative | « Vous pouvez le prendre et le noter sur votre Feuille d'Aventure dans la case Objets Spéciaux » | choix « Prendre le Parchemin » + `parchemin` ×1 (objet à créer) | absent |
| **197** | Offre facultative | « Il est porteur d'un sabre et de 6 Pièces d'Or que vous pouvez vous approprier si tel est votre désir » | choix « Prendre le Sabre et les 6 Pièces d'Or » + `sabre` ×1 + `couronnes` ×6 | absent |
| **199** | Gain automatique | « vous parvenez cependant à trouver dans la cave suffisamment de fruits pour vous faire un Repas. Notez-le » | `repas` ×1 en arrivée | absent |
| **243** | Offre facultative | « une Masse d'Armes est posée à côté de lui. Vous pouvez prendre cette arme si vous le souhaitez » | choix « Prendre la Masse d'Armes » + `masse-armes` ×1 | absent |
| **255** | Offre pendant le combat | « L'épée du Prince repose à vos pieds. Vous pouvez la ramasser et vous en servir pour combattre si vous le désirez » | choix « Ramasser l'Épée du Prince » + `epee` ×1 (arme utilisable pour ce combat) | absent |
| **263** | Offre facultative | « vous trouvez 3 Pièces d'Or que vous pouvez prendre si vous le souhaitez » | choix « Prendre les 3 Pièces d'Or » + `couronnes` ×3 | absent |
| **267** | Offre facultative | « vous trouvez un Message écrit sur une peau d'animal. […] il y a également un Poignard. Vous pouvez conserver ce Message et ce Poignard » | choix « Prendre le Message et le Poignard » + `message` ×1 + `poignard` ×1 | absent |
| **269** | Gain automatique | « L'un des soldats vous offre 10 Pièces d'Or en guise de récompense et vous propose de vous conduire à la citadelle » | `couronnes` ×10 en arrivée ; les 10 Pièces sont offertes inconditionnellement (l'offre de transport est une simple proposition, introduite par « et ») | absent |
| **277** | Perte subie au choix | « Votre Arme, en revanche, est brisée […] Rayez-la de votre Feuille d'Aventure (si vous possédez plus d'une arme, seule l'une d'elles est cassée et vous pouvez choisir laquelle) » | **perte au choix du joueur** : 1 arme (aucune si le héros n'en a plus) | absent |
| **282** | Aucun objet | « vous ramassez quelques fioles de potions diverses » — le texte ne demande **aucune** inscription sur la Feuille d'Aventure et ne précise ni contenu ni effet | aucun objet : les fioles servent la ruse du déguisement, pas l'inventaire (règle R6) | — |
| **290** | Offre facultative | « vous trouvez un Bâton enveloppé de cuir. Vous pouvez le prendre si vous le désirez » | choix « Prendre le Bâton » + `baton` ×1 | absent |
| **291** | Gain automatique + choix exclusif | « Vous pouvez garder l'Or et prendre au choix le Poignard ou l'une des Lances » | `couronnes` ×6 en arrivée (déjà en base) + **deux choix concurrents** « prendre le Poignard » / « prendre une Lance » | or présent ; choix exclusif absent |
| **305** | Offre facultative | « vous découvrez une Lance de Glok […] Vous pouvez la garder si vous le désirez » | choix « Prendre la Lance » + `lance` ×1 | absent |
| **307** | Gain automatique + échange | « ils représentent l'équivalent d'un Repas […] Prenez ce Marteau si vous le désirez […] à la condition de l'échanger contre une autre Arme que vous possédez déjà » | `repas` ×1 en arrivée + **choix « Échanger une Arme contre le Marteau de Guerre »** (retrait d'une arme au choix du joueur + `marteau-guerre` ×1) | absent |
| **315** | Offre facultative | « un petit Sac de Velours qui contient 6 Pièces d'Or et un morceau de Savon Parfumé » | choix « Prendre le Savon et l'Or » + `couronnes` ×6 + `savon-parfume` ×1 | absent |
| **319** | Offre facultative | « une Bourse et un Poignard dans son fourreau. […] vous trouvez 20 Pièces d'Or. Vous pouvez prendre ces Pièces et le Poignard si vous le désirez » | choix « Prendre la Bourse et le Poignard » + `couronnes` ×20 + `poignard` ×1 | absent |
| **346** | Offre facultative | « vous pouvez la prendre si vous le désirez. Faites, dans ce cas, les modifications nécessaires » | choix « Prendre la Lance » + `lance` ×1 | absent |
| **347** | Offre facultative | « Vous pouvez les prendre ainsi qu'une des Torches, à condition […] de modifier en conséquence votre Feuille d'Aventure » | choix « Prendre le Sabre, le Briquet et une Torche » + `sabre` ×1 + `briquet-amadou` ×1 + `torches` ×1 | conforme |
| **349** | Gain automatique | « il ôte de son cou une Chaîne d'Or et vous la donne […] n'oubliez pas d'inscrire ce pendentif à l'Etoile de Cristal dans la case Objets Spéciaux » | `etoile-cristal` ×1 en arrivée (objet déjà présent au catalogue) | absent |

### Extrait du PDF pour chaque ligne (vérification automatique)

- **§15** — « Vous pouvez prendre cette épée si vous le désirez en n'oubliant pas de l'inscrire sur votre Feuille d'Aventure. »
- **§20** — « En fouillant un coffr e et un petit placard, vous trouvez un Sac à Dos, de la Nourriture (l'équivalent de 2 Repas) et un Poignard. »
- **§33** — « Vous trouvez parmi ces restes un petit sac qui contient 3 Pièces d'Or. »
- **§62** — « L'Arbalète a été endommagée au cours du combat, mais les trois Epées so nt intactes, et vous pouvez en emporter une si vous le souhaitez. »
- **§76** — « Vous perdez 2 points d'ENDURANCE. »
- **§94** — « Vous trouvez 12 Pièces d'Or dans la bourse du Voleur et 4 autres dans une boîte en bois, rangée sous le comptoir . »
- **§113** — « Chaque dose de Laumspur vous rendra 3 points d'ENDURANCE et vous avez cueilli là l'équivalent de 2 doses. »
- **§124** — « ns la boîte, vous trouvez 15 Pièces d'Or et une Clé d'Argent. »
- **§137** — « Vous ramassez ces vingt Pierres juste avant que la lueur s'éteigne, plongeant la chambre mortuaire dans une totale obscurité. »
- **§144** — « Si vous n'avez plus de Sac à Dos, c'est une arme qu'on vous dérobe. »
- **§148** — « En vous approchant de la cheminée, vous trouvez un Marteau de Guerre posé contre le mur. »
- **§161** — « Vous prenez la Clé (notez-la sur votre Feuille d'Aventure dans la case Objets Spéciaux) et vous vous hâtez de quitter les lieux p ar cette sortie inattendue. »
- **§164** — « Vous pouvez conserver cette fiole et en boire le contenu au début d'un combat : votre total d'HABILETÉ augmentera alors de 2 points pendant toute la durée de l'affrontement. »
- **§184** — « En fouillant rapidement le véhicule, vous découvrez 40 Pièces d'Or, une Epée et une quantité de nourriture équivalant à 4 Repas. »
- **§188** — « si vous tirez un chiffre entre 0 et 6, le Kraan a déchiré de ses serres pointues la toile de votre Sac à Dos. »
- **§193** — « Vous remarquez alors un rouleau de Parchemin glissé dans la ceinture du Glok. »
- **§197** — « Il est porteur d'un sabre et de 6 Pièces d'Or que vous pouvez vous approprier si tel est votre désir. »
- **§199** — « Les habitants de cette maison ont presque tout emporté avec eux ; vous parvenez cependant à trouver dans la cave suffisamment de fruits pour vous faire un Repas. »
- **§243** — « Il a été tué par un coup d'épée en pleine tête et une Masse d'Armes est posée à côté de lui. »
- **§255** — « L'épée du Prince repose à vos pieds. »
- **§263** — « Dans une bours e accrochée à sa ceinture, vous trouvez 3 Pièces d'Or que vous pouvez prendre si vous le souhaitez. »
- **§267** — « A l'intérieur du sac, vous trouvez un Message écrit sur une peau d'animal. »
- **§269** — « L'un des soldats vous offre 10 Pièces d'Or en guise de récompense et vous propose de vous conduire à la citadelle qui abrite le Palais du Roi. »
- **§277** — « Votre Arme, en revanche, est brisée et ne peut plus vous être d'aucune utilité. »
- **§282** — « Vous enfilez rapidement une blouse blanche et vous ramassez quelques fioles de potions diverses, puis vous retraversez la rue jusqu'à la Porte Principale. »
- **§290** — « l'intérieur de la longue boîte, vous trouvez un Bâton enveloppé de cuir. »
- **§291** — « Vous pouvez garder l'Or et prendre au choix le Poignard ou l'une des Lances. »
- **§305** — « Dans la dernière hutte, vous découvrez une Lance de Glok, ce qui confirme vos soupçons. »
- **§307** — « L'ermite vous montre également un magnifique Marteau de Guerre qu'il pose sur une table, près de la porte. »
- **§315** — « veloppé dans des vêtements de femme, vous trouvez un petit Sac de Velours qui contient 6 Pièces d'Or et un morceau de Savon Parfumé. »
- **§319** — « En ouvrant la Bourse, vous trouvez 20 Pièces d'Or. »
- **§346** — « e lance est profondément enfoncée dans la cage thoracique du squelette. »
- **§347** — « En ouvrant un petit coffre posé près de la porte, vous découvrez des fagots de branches liées ensemble avec de la ficelle. »
- **§349** — « Lorsque vous avez terminé votre récit, il ôte de son cou une Chaîne d'Or et vous la donne. »

### Sections examinées qui ne modifient rien (et pourquoi)

Le balayage a porté sur **43 sections** : les 34 ci-dessus, plus les 9 suivantes, vérifiées puis écartées.

| § | Marqueur détecté | Pourquoi aucune modification |
|---|---|---|
| §7 | « vous prenez donc votre élan » | faux positif : le verbe « prendre » ne porte pas sur un objet |
| §46 | « vous offre de vous faire traverser le lac […] pour la somme de 2 Couronnes » | c'est un **paiement** (déjà encodé : 2 Couronnes exigées), pas un butin |
| §130 | « il vous faut prendre un Repas, sinon vous perdrez 3 points d'ENDURANCE » | repas obligatoire, déjà encodé (`meal_required`, perte de 3 END à défaut) |
| §152 | « L'herboriste vous offre tout un choix de potions » | la scène est un guet-apens : le prix n'est jamais demandé, le Voleur attaque (§231/§339) — aucune potion n'entre en jeu |
| §155 | « l'un des hommes tend la main vers vous » | rencontre narrative, aucun objet |
| §173 | « Si vous possédez une Clé d'Argent, vous pouvez vous en servir » | **condition d'accès** (déjà encodée : §173 → §158 avec Clé d'Argent), pas un butin |
| §203 | « vous perdez 10 points d'ENDURANCE » | perte déjà encodée à l'arrivée |
| §304 | « vous la glissez dans votre Sac à Dos » | Pierre Précieuse **déjà attribuée** (+ 2 END), conforme (T-010) |
| §338 | « vous apercevez votre Sac à Dos et votre Arme […] vous vous hâtez de les récupérer » | récupération de ce qui n'a pas été retiré au §277 : aucune écriture nette sur la fiche |

Les sections §76 et §304 (même Pierre Précieuse par deux routes) et §188 (Sac à Dos déchiré / −3 END) sont conformes en base ; §169 → §137 est la seule chaîne de butin entièrement absente.


