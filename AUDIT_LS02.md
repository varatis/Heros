# Loup Solitaire 02 — Reconstruction depuis le PDF

Date : **21 septembre 2026**.

## Intégration de `main` et résolution des conflits

La PR #36 a été réconciliée avec `origin/main` au commit **`3092465`**.
L'historique amont ayant été réécrit, Git signalait surtout des conflits
`add/add` sur des fichiers déjà communs. La résolution utilise l'ancienne base
`0e7f76d` pour distinguer les changements LS02 de ceux de `main`, puis une
revue des fichiers partagés ; aucun remplacement global par « ours » ou
« theirs » n'a été effectué.

Sont conservés : le registre des quatre tomes, les objets LS03/LS04, les
métadonnées de combat LS04, les générateurs SQL LS03/LS04 et les corrections,
migrations et tests de fidélité LS01 provenant de `main`.

Contrôles **réexécutés après fusion**, en complément des résultats LS02 ci-dessous :

- LS01 : **327/327 attestations**, **121/121 contrôles de fidélité**,
  **7/7 contrôles de couverture** (dépendance `pypdf` désormais fixée dans
  `app/scripts/requirements-ls01.txt`).
- LS03 : **29/29 contrôles existants**.
- LS04 : contrôles existants et **300 parties sans blocage** lors de cette
  exécution ; ce fuzz historique n'est pas déterministe et ne certifie pas le PDF.
- `npm run test:livres` : **3/3 groupes** supplémentaires protégeant le registre,
  les objets et la génération SQL multi-livres. Génération dans un dossier
  temporaire ; test explicite d'une copie SQL LS03 altérée : `--check` doit
  échouer sans la réécrire. Les sorties LS01/LS03/LS04 du dépôt n'ont pas été
  régénérées par ces contrôles.
- Types TypeScript, confort de lecture, bibliothèque et `git diff --check` : OK.

Le générateur conserve tous les filtres de tomes et vérifie maintenant la copie
`clean_sql` LS03 sans l'écraser en mode `--check`. La CI exécute également les
contrôles LS01, LS03 et d'intégration multi-livres. Ces tests protègent la fusion ;
ils n'élargissent pas la garantie de fidélité LS02 au-delà des limites documentées.

## Livrable et utilisation

**SQL à utiliser : `clean_sql/02_loup_solitaire_02_fidele_350.sql`.**
Copie strictement identique : `app/supabase/seed/007_contenu_ls02.sql`.

- 350 paragraphes numérotés, plus **16 étapes techniques** nécessaires aux combats successifs et au bras de fer : **366 lignes** SQL, et non 366 paragraphes du livre.
- Catalogue `lw_livres` et contenu `lw_sections`, conformément à l’architecture LS02 du dépôt. Ce n’est pas un import dans le moteur distinct `story_nodes` utilisé par d’autres histoires.
- Prérequis : schéma existant, notamment `004_loup_solitaire_schema.sql` et ses dépendances. Ce fichier est un **reset du contenu**, pas une installation complète de Supabase.
- Transaction `BEGIN / COMMIT`. Suppression limitée à `livre_slug = 'loup-solitaire-02'`. Aucun effacement des autres livres, utilisateurs, succès ou sauvegardes.
- Assertions SQL exécutées avant le commit : nombre de lignes, présence des 350 numéros et validité des destinations. En cas d’erreur, annuler la transaction avec `ROLLBACK` si le client SQL la garde ouverte.
- **Déployer aussi les modifications du moteur et de l’interface présentes dans cette branche.** Le SQL seul ne peut pas corriger un moteur qui ignore les conditions négatives, les dégâts psychiques par assaut ou les jeux à plusieurs tirages. Le lecteur actuel utilise le contenu TypeScript embarqué, pas directement `lw_sections`.
- **Recommencer les anciennes parties LS02.** Leurs effets et anciens identifiants techniques ne sont pas migrables de façon fiable. Le lecteur reconnaît la nouvelle révision ; il conserve une ancienne sauvegarde mais demande une nouvelle partie au lieu de poursuivre silencieusement un état incohérent.
- L’import et les réimports ont été testés dans PostgreSQL embarqué **PGlite**, pas exécutés sur votre base de production.

## Ce qui a été vérifié — et ce que cela ne prouve pas

Le texte des **350 paragraphes** a été relu, ainsi que les règles préliminaires. Le PDF comporte **191 pages**, dont des pages illustrées. La table de combat de la page 191 et la table de hasard de la page 190 sont des images : une extraction textuelle ne suffit donc pas. Les 130 cellules de combat ont un oracle de test transcrit séparément. Six enseignes en images ont également été retranscrites avec leur numéro de page.

**Je ne certifie pas une exploration exhaustive de toutes les parties possibles.** Le livre comporte des boucles, des jeux répétables et des états d’inventaire : toutes les histoires de jeu ne forment pas un ensemble fini que l’on puisse simplement énumérer. La couverture complète des paragraphes et renvois n’est pas équivalente à une preuve de toutes leurs combinaisons.

Les garanties vérifiées sont précisément :

| Contrôle | Couverture |
|---|---|
| Identité du PDF | SHA-256, 191 pages inventoriées |
| Texte | 350 textes comparés à l’extraction directe, avec les six transcriptions d’images explicitement tracées |
| Navigation | **576 occurrences de renvois imprimés**, comparées au graphe en développant les étapes techniques ; aucune destination manquante ou ajoutée |
| Accessibilité | Toutes les 366 lignes atteignables **structurellement** depuis §1 ; ce test n’est pas une preuve de faisabilité avec chaque inventaire |
| Fins | 18 morts explicites et la victoire §350 |
| Adversaires | **46** blocs de statistiques, ordre des chaînes vérifié par un oracle séparé |
| Résolution des combats | 46 × 10 Habiletés × 10 tirages × 3 assauts = **13 800 cas locaux**, plus tests ciblés des pouvoirs, fuites et défaites |
| Table de combat | **130 cellules** comparées à une transcription de l’image p.191 |
| Jets de paragraphes | **25 événements**, toutes les valeurs 0–9, bonus du §12 jusqu’à 11, formules des §21/57/116 |
| Choix | **345 choix** avec un témoin local satisfaisant la condition et exécution de ses effets ; les suites/renvois aléatoires sont vérifiés séparément |
| Conditions | Présence et absence des prérequis ; contrôle d’absence de blocage avec 1 024 ensembles de disciplines × 4 profils d’inventaire × 4 bourses |
| Hublots | **1 000 000 combinaisons** des six tirages, double zéro et égalités |
| Roulette | **5 000 cas** : 10 numéros × 10 tirages × 50 mises, selon la convention documentée ci-dessous |
| Interactions | Les 23 interactions, tous les tarifs et quantités ont un oracle transcrit séparément ; chaque offre/achat/revente est exercé, avec refus des dépenses impossibles, lots fractionnés et tests de capacité |
| Effets | Oracle séparé pour toutes les variations fixes d’Endurance et d’or, les frais au choix, repas imposés et pertes d’équipement |
| Reprise après un jet | Les 25 événements × 10 tirages sont résolus avec leur destination avant sérialisation ; pas d’état sauvegardé intermédiaire sans issue |
| Échantillonnage de parties | **5 040** parties déterministes : **252** ensembles légaux de cinq disciplines × 20 graines ; 336/350 paragraphes source et 15/16 étapes techniques rencontrés |
| Parcours complet | Un parcours légal déterministe de §1 à §350, avec le véritable moteur, les prérequis, achats, combats, jets et ressources |
| SQL | Exécution, import répété, suppression d’une ancienne ligne parasite, comparaison champ par champ avec le contenu embarqué, sauvegardes/autre livre conservés, échec volontaire et rollback |

### Résultats exécutés

- `npm run test:ls02` : **23/23 groupes de tests réussis**. Les nombres de cas ci-dessus sont des boucles à l’intérieur de ces groupes, pas un million de tests Node indépendants.
- `npm run test:db` : **118/118**.
- `npm run test:combat` : **40/40**.
- `npm run test:play` : **13/13**.
- `npx tsc --noEmit` : réussi.
- `node scripts/tester-confort-lecture.cjs` et `node scripts/tester-bibliotheque.cjs` : réussis.
- Ancien simulateur `tester-aventure.cjs` : corrigé pour arrêter une partie sur les effets mortels d’un choix/jet et respecter les jets conditionnels et défis non mortels. Contrôle additionnel de 300 parties par tome ; ce simulateur ne joue pas les boutiques/jeux, contrairement à `ls02-simulate.cjs`.
- Réextraction indépendante du PDF et comparaison des fichiers générés : réussies.

Les trois anciennes suites concernent aussi d’autres contenus, notamment LS01 : elles ne doivent pas être présentées comme une couverture additionnelle des branches LS02. Il n’y a pas, dans ce travail, de campagne exhaustive de tests navigateur/mobile.

### Résultats de l’échantillonnage LS02 (reproductibles)

`node app/scripts/ls02-simulate.cjs` joue **5 040** parties avec création légale, vrais combats/fuites, achats, butins, consommables, roulette et Hublots. Il utilise 252 groupes de cinq disciplines, sans héros omnipotent ni téléportation. Résultat : **2 victoires, 5 034 morts, 4 parties arrêtées à la borne de 400 étapes**. Cela mesure cette stratégie de test, pas la difficulté moyenne du livre pour un lecteur humain.

Les quatre limites sont publiées, pas masquées comme des parties terminées : graines **802 (§327, 3 PO), 2351 (§318, 5 PO), 2374 (§318, 4 PO), 3758 (§246, 4 PO)**. Le livre autorise ces allers-retours à Port Bax ; la simulation ne constitue pas une preuve que chaque état rencontré permet encore de gagner.

Les **15 lignes non rencontrées dans cet échantillon** sont §5, 38, 73, 92, 113, 185, 204, 219, 272, 313, 325, 328, 332, 336 et l’étape `185-b`. Elles restent couvertes par les oracles de texte/renvois et les tests locaux applicables, mais pas par cette campagne de parties. Les §113 et §219 demandent notamment l’objet hérité de LS01. **351/366 étapes vues ne signifie donc pas « toutes les possibilités testées ».**

## Source et traçabilité

PDF : `content/stories/source-pdfs/Loup Solitaire 02 - La Traversee Infernale.pdf`

SHA-256 :

```text
922d25f0fc7292d9c9d9bdafb020524eb97de5d01e522064543a1b434d1c6908
```

1. `app/scripts/ls02-extract-source.py` lit directement le PDF avec PyMuPDF, sans charger le moteur, les overrides ni le SQL. Il inventorie chaque page et conserve les règles préliminaires.
2. `content/stories/ls02-source-verifiee.json` contient les pages, textes et renvois. Ce fichier est un **oracle d’extraction**, pas une certification de toutes les interprétations mécaniques.
3. `content/stories/ls02-transcriptions-images.json` trace les six enseignes relues sur les images (§18/155/191/215/303/335). La ponctuation sépare les lignes des enseignes ; aucun prix ni renvoi n’y est inventé.
4. `app/scripts/ls02-overrides.json` contient les règles explicitement encodées et les conventions. Plus de détection de mort par une simple occurrence de « vie s’achève », ni de bonus de combat deviné.
5. `app/scripts/ls02-importer.cjs` garde le **texte complet**, y compris les phrases qui annoncent les choix, les statistiques et les instructions de ressources. Il ne prélève plus des phrases entières pour en faire un bouton au risque d’effacer leur contexte.
6. `app/scripts/generer-sql-contenu.cjs ls02` génère simultanément les deux SQL.
7. `AUDIT_LS02_PARAGRAPHES.md` donne la matrice **350 lignes : paragraphe → pages PDF → renvois → règles encodées**.

L’ancien `content/stories/ls02-texte-brut.txt` est conservé comme fichier historique mais n’est **plus** la source de génération de LS02.

## Principales erreurs corrigées

- **§7/270** : immunité à la Puissance Psychique ; +2 seulement au premier assaut.
- **§12** : +2 au tirage avec Sixième Sens ; résultats 10/11 autorisés après bonus.
- **§21/116** : gain tiré avant le paiement de la chambre, pas de coût retiré d’une bourse vide avant d’encaisser.
- **§36/103/145** : distinction entre herbe de Laumspur, potion ordinaire et fiole de Madin Rendalim ; consommation de l’herbe utilisée contre le poison.
- **§39/47/52/59/70/134 et autres** : une issue « sinon » n’est plus libre quand le prérequis de l’autre issue est rempli.
- **§60** : les deux premiers assauts sont sans dégâts reçus. Suppression d’une description qui confondait Halvorc avec le bras de fer.
- **§69/106/332** : dégâts psychiques d’**Endurance**, pas malus d’Habileté. Suppression du **+6 d’Habileté inventé** pour la Lance Magique ; elle évite aussi le malus sans arme dans un combat ordinaire quand aucune arme ordinaire n’est en main.
- **§72/342** : la bière ne coûte pas deux fois son prix.
- **§78/141** : perte de la cotte de mailles dans les deux issues du naufrage.
- **§90/131/185/282/296/298** : adversaires successifs obligatoires ; aucun bouton permettant de sauter les ennemis suivants.
- **§95/160/265/328 et autres** : conditions des disciplines et objets conservées.
- **§144** : deux Repas reçus et bourse vidée.
- **§165/196/299/338/38** : retrait effectif du Sceau ou de la Lance lorsqu’ils sont cédés/abandonnés.
- **§194** : perte intégrale de l’équipement ; nécessité de récupérer un sac pour porter à nouveau des objets de sac.
- **§238/308** : suppression des probabilités simplifiées et mises arbitrairement limitées à 1–3 ; vraies mises, choix du numéro et six tirages pour les Hublots, avec plafond.
- **§266/283** : tarifs complets, y compris les marchandises omises ; revente chez l’armurier au tarif moins une Couronne.
- **§268/348** : fuite interdite avant deux assauts ; après engagement, résolution de l’assaut de fuite sans dégâts à l’ennemi.
- **§276** : pas de Guérison sur le paragraphe parent lorsque le combat a lieu dans `276-combat` ; véritable défi 18/25, pas un jet 50/50. Défaite non mortelle, récupération de l’Endurance initiale, destination §192 ; victoire §305. Les 5 PO sont reçues une seule fois au §305.
- **§306** : pertes du garde doublées, sans dépendre du Glaive de Sommer.
- **§314** : plus de consommation automatique d’un Repas avant même de décider de manger le plat empoisonné. Refus du plat (§178) **ou détection du poison (§290)** : repas du sac ou −3 Endurance. Reconnaître un poison avec la Chasse ne fournit pas de nourriture dans le Pays Sauvage (§346).
- **§321/346** : règles spécifiques de repas (−2 au §321 ; repas du sac ou paiement de 1 PO au §346, Chasse interdite).
- **§327** : les faux documents ne sont plus un véritable laissez-passer blanc.
- **§337** : perte des armes ordinaires.
- **Moteur** : Sommer +8 et maîtrise de l’épée +2 une seule fois, pas de double/triple comptage ; mort instantanée « T » réellement appliquée à l’ennemi ; cinq cellules erronées de la table locale corrigées ; journal des morts instantanées et dégâts psychiques corrigé, toutes les fuites autorisées exercées avant/après engagement ; pas de résurrection par Guérison après un repas fatal ; les étapes techniques ne donnent pas un point de Guérison supplémentaire.
- **Interface et sauvegarde** : les jets à destination sont atomiques (plus de fenêtre de 900 ms avec jet marqué résolu mais destination non chargée) ; les potions 3/4/5 points sont toutes proposées après victoire ; l’herbe alimentaire n’est pas affichée comme un flacon à boire ; abandon d’un exemplaire d’arme/objet de sac disponible hors combat avec confirmation.
- **Butins** : les lots de repas des §15/91/302 peuvent être pris en partie, sans compter deux fois la même offre ni faire réapparaître les exemplaires déjà pris.
- **Création** : les deux objets de l’Arsenal sont choisis librement, conformément aux p.14–15 ; seule la bourse est tirée.

## Ambiguïtés, conventions et limites restantes

Ces points sont explicites pour ne pas remplacer une ancienne hallucination par une nouvelle assurance injustifiée.

1. **§238, roulette** : le PDF ne tranche pas explicitement le retour de la mise et le raccord 9–0. L’implémentation considère 0 et 9 voisins sur une roue, et des gains nets de 8/5 fois la mise, plafonnés à un bénéfice net de 40 PO. Cette convention est affichée au joueur et testée, **mais n’est pas certifiée par le texte**. Les arrivées sans argent sont possibles dans le livre malgré le droit d’entrée de 1 PO ; elles n’autorisent aucune mise et permettent de partir au §169.
2. **§298** : le PDF imprime « ENDURANCE » pour les 4 points perdus sans arme, là où le §131 et les règles générales parlent d’Habileté. Le code conserve la perte imprimée en plus du malus général sans arme. Une correction éditoriale éventuelle doit être décidée explicitement, pas faite en silence.
3. **§167** : le texte décrit une victoire au Samor sans attribuer de gain. Aucun gain de 10 PO n’est ajouté par supposition ; seuls §58 et §329 décrivent le transfert.
4. **§266** : la ligne imprimée « HACHES BÂTONS — 3 Couronnes pièce » est traitée comme deux articles à 3 PO. La page 149 a été vérifiée visuellement.
5. **Coquilles du PDF** : le texte fourni est parfois déjà altéré, notamment §151/155/197/294. Ces passages ne sont pas réécrits de mémoire. Au §82, l’enseigne annoncée manque également sur les pages 64–65 du PDF fourni ; son nom n’est pas inventé.
6. **Suite du tome 1** : le PDF autorise le transfert du héros, de son équipement et l’ajout d’une sixième discipline. **Le parcours de création existant ne propose toujours pas cet import.** Les conditions sur le Pendentif à l’Étoile de Cristal et les profils à six disciplines sont testables dans le moteur, mais cela ne remplace pas une interface de transfert LS01 → LS02. Le parcours complet testé ici part d’un héros nouveau.
7. **Ergonomie d’inventaire** : les butins interactifs sont fractionnables et on peut libérer une place hors combat. Toutefois, les octrois automatiques à l’arrivée (par exemple la fiole du §40) n’ont pas d’écran d’échange différé si le sac est déjà plein : leur refus est annoncé et l’objet non emportable n’est pas conservé à côté du héros. Les repas obligatoires sont résolus automatiquement (repas ordinaire avant Laumspur, puis paiement si prévu), pas par un écran donnant tous les arbitrages possibles. Ces limites empêchent de certifier toutes les stratégies de gestion d’inventaire du livre.
8. **Illustrations et interface** : cette reconstruction porte sur les textes et règles ; elle ne certifie pas l’emplacement de chaque illustration décorative ni tous les comportements du navigateur. Les vérifications automatiques exécutent le moteur et le SQL, et contrôlent les types de l’application.

**Conclusion :** le reset SQL est complet pour les 350 paragraphes et leurs renvois, et les erreurs identifiées ci-dessus sont couvertes par des régressions. Il serait en revanche faux d’annoncer que *toutes les possibilités du PDF sont désormais certifiées à 100 %*, notamment compte tenu des conventions et limites listées ici.

## Reproduire les contrôles

```bash
cd app
npm ci
python -m venv .venv
.venv/bin/pip install -r scripts/requirements-ls02.txt -r scripts/requirements-ls01.txt
.venv/bin/python scripts/ls02-extract-source.py --check
npm run generate:ls02
node scripts/ls02-audit.cjs
npm run check:ls02
npm run test:ls02
node scripts/ls02-simulate.cjs # même échantillonnage que le dernier groupe test:ls02
node scripts/tester-confort-lecture.cjs
npm run test:db
npm run test:combat
npm run test:play
PATH="$PWD/.venv/bin:$PATH" npm run test:ls01
npm run test:livres
(cd .. && node app/scripts/test-ls03-fidelite.mjs)
node scripts/tester-ls04.cjs
npx tsc --noEmit
```

La CI vérifie le PDF indépendamment des artefacts, puis exécute la suite LS02. Toute modification du PDF, des renvois, d’une statistique attendue ou d’un fichier généré doit ainsi être examinée au lieu d’être intégrée silencieusement.
