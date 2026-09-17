# Illustrations du PDF et combats — audit du 16 septembre 2026, mis à jour le 17

## Source retrouvée et périmètre

Le PDF `content/stories/source-pdfs/Loup Solitaire 01 - Les Maitres des Tenebres.pdf`
(chemin depuis la racine du dépôt) a été récupéré sur **main** sans changer la
branche de travail. Il contient **175 pages**. Les vérifications précédentes
limitées au checkout/develop avaient conclu à tort qu’il était absent.

**76 références graphiques uniques** sont extraites, avec les pages de toutes
leurs occurrences. Ce nombre comprend couverture, carte, vignettes, objets,
feuilles, tables et tampon ajouté au document : ce ne sont pas 76 scènes.

Les crédits du PDF indiquent : illustrations © Gary Chalk, 1984 ; couverture
© Solar Wind Ltd, 1985 ; texte © Joe Dever, 1984 ; traduction © Gallimard, 1985.
Les couleurs ajoutées ne sont pas celles de l’édition originale. La possession
du PDF ne constitue pas une autorisation commerciale ; les droits restent à
confirmer avant diffusion commerciale, conformément au README des sources.

## Ce qui est désormais affiché

- **Vingt planches mises en couleur** : Holmgard, porte de la chambre
  mortuaire, Kraan, Gloks/Loup Maudit, Gourgaz, Vordak, Banedon, Gluâtre,
  Roi Ulnar, parchemin d’initiation Kaï, mur de rondins, vieil homme fou,
  herboriste, roulotte, homme à la coupe d’herbes, Drakkarim, message
  runique, Cimetière des Anciens et ermite.
- **Douze vignettes d’objets en couleur** (flacon de guérison, lance, masse,
  sabre, marteau de guerre, épée, hache, bâton, glaive, casque, repas, cotte
  de mailles) : l’inventaire n’affiche plus aucun objet en noir et blanc.
- Couverture et carte extraites du PDF, servies telles quelles.
- **Deux planches restent en noir et blanc** (§334 et §341, soldats) : leur
  pointillisme dense ne supporte pas une teinte procédurale sans effacer le
  grain ; elles attendent une couche de couleur alignée sur le scan, listée
  « en cours » par `tester-illustrations.cjs`.
- **Huit fichiers de portrait**, servant neuf cartes : l’emblème du héros et huit
  catégories ennemies. La meute partage le dessin d’un Loup Maudit ; il ne s’agit
  pas d’une image de deux loups inventés ou dupliqués.
- Armes/objets identifiés : miniatures du PDF dans l’inventaire. Les variantes
  sans correspondance vérifiée gardent une icône de catégorie, pas une fausse
  illustration officielle. Le flacon de guérison ne désigne pas indistinctement
  toutes les potions.
- `/illustrations` montre les origines, les pages, les paragraphes du livre,
  les réemplois dans l’adaptation, les comparaisons avec les scans et les
  **76 extractions** consultables. La lecture propose aussi un lien vers le scan.
- Les JPG générés hors livre qui subsistaient sous `public/lonewolf/` ont été
  **supprimés** le 17 septembre : aucun ne correspondait à une planche du PDF
  et plus aucun code ne les référençait. Les scènes sans dessin correspondant
  gardent un repli textuel, jamais une illustration inventée.

## Correspondances vérifiées

Les pages sont les **pages du fichier PDF**, comptées depuis 1. Les § du livre
ne sont pas automatiquement les identifiants de l’adaptation.

| Sujet | Page PDF | § du livre | Observations |
| --- | --- | --- | --- |
| Citadelle de Holmgard | 29 | 7 | Vue depuis les toits ; pas une porte sud ni une vue des collines |
| Porte sculptée | 35 | 23 | Chambre mortuaire ; pas un portrait du Rejeton ni du Premier Roi |
| Kraan | 40 | 34 | Dessin avec cavalier, silhouette ailée conservée |
| Gloks et Loup Maudit | 43 | 41 | Gloks nommés Giaks dans le jeu ; portraits du chef, du groupe et du loup |
| Gourgaz | 66 | 97 | Hache Noire ; combat source au §255 |
| Vordak | 76 | 121 | Vu de dos, robe rouge et corbeau ; identité révélée au §283 |
| Banedon | 81 | 131 | Jeune apprenti, robe bleu ciel étoilée, magie bleue |
| Gluâtre des Profondeurs | 99 | 170 | Tentacules et corps segmenté ; nom accentué vérifié dans le texte et la légende |
| Cimetière | 143 | 284 | Scan noir et blanc, sans légende dans la lecture |
| Roi Ulnar | 172 | 350 | Roi et capitaines ; pas une cérémonie spécifique à chaque fin adaptée |

Erreurs d’association explicitement évitées :
- La figure à tête de crâne p. 126 (§246) est un **Drakkarim**, pas un Vordak.
- La créature velue p. 128 est un **Kakarmi**, pas un monstre de crypte.
- Les soldats p. 163 (§334) ne sont pas un portrait de Loup Solitaire.
- Le chevalier du diplôme p. 7 n’est pas identifié comme le héros.
- La recherche sans accents de « Gluatre » ne suffisait pas : le livre écrit
  **Gluâtre**. La légende de la planche 170 confirme son identité.

## Limites honnêtement conservées

Deux portraits ne sont pas créés :

| Ennemi adapté | ID du jeu | Motif |
| --- | --- | --- |
| Rejeton de crypte | 154 | Gardien ajouté par l’adaptation ; aucun dessin correspondant identifié |
| Assassin du Roi-Sorcier | 352 | Rencontre ajoutée ; le livre source s’arrête au §350 |

Le héros utilise **l’emblème du loup de la couverture**, pas un visage humain
prétendument officiel. Le Vordak demeure de dos : aucune tête n’a été inventée.
Les deux adversaires sans correspondance gardent le repli « Portrait à
illustrer », sans 404 ni attribution d’une autre espèce.

Le graphe jouable possède **50 sections**, contre **350** dans la source. Cet
audit d’images ne certifie ni ses textes, ni ses embranchements, ni toutes ses
règles. Seules des incohérences visuelles manifestes ont été corrigées dans la
prose adaptée : jeunesse/robe de Banedon et couleur rouge de la cape du Vordak.
Les valeurs, objets, choix et IDs de sauvegarde n’ont pas été modifiés ici. Un
futur import de texte exige une correspondance éditoriale, pas un simple
remplacement par numéro.

## Encrage conservé et chaîne de fabrication

Depuis la racine du dépôt :

- `content/stories/illustrations/ls01/originals/` : extractions RGB complètes,
  avec leurs légendes lorsqu’elles font partie de l’image embarquée.
- `extractions.json` : noms, xrefs, dimensions et pages des occurrences.
- `colorization.json` : rectangles de recadrage (légendes retirées uniquement),
  pages et paragraphes sources des dix mises en couleur.
- `color-layers/` : propositions de couleur **alignées sur les scans** (mêmes
  cadrages, mêmes compositions). 20 couches IA pour les planches narratives,
  11 couches procédurales par matériau (`teinter-procedural.py`) pour les
  vignettes d’objets. Aucune couche n’est servie directement : elle passe
  toujours par le compositeur ci-dessous.
- `app/scripts/coloriser-pdf.py` : verrouille l’encrage du scan (luminance
  ≤ 150, recopié pixel par pixel) puis fond les zones claires dans la couche
  de couleur sur une rampe de 30 niveaux. Le trait, les hachures et le
  pointillisme publiés sont donc exactement ceux du livre ; la couleur vient
  de la couche, jamais d’un redessin.
- `app/scripts/teinter-procedural.py` : fabrique les couches des vignettes
  d’objets par teintes matérielles (acier, bois, cuir, or, toile) modulées par
  la luminance du scan, fond papier conservé. Déposer une couche IA du même
  nom dans `color-layers/` suffit à la remplacer sans rien changer d’autre.
- `app/public/lonewolf/pdf/colored/` : PNG sans perte aux dimensions du scan
  recadré, sans prétention de restauration haute définition.
- `app/scripts/preparer-portraits.cjs` : recadrages documentés, sans distorsion,
  export WebP sans perte en 480 × 640 avec marges (`contain`).

Reconstruction (Python avec PyMuPDF et Pillow installés ; Node dans `app`) :

```sh
# Facultatif : réextraire le PDF ; reconstruire ensuite couleurs ET portraits.
python3 app/scripts/extraire-illustrations-pdf.py
python3 app/scripts/teinter-procedural.py   # couches des vignettes d'objets
python3 app/scripts/coloriser-pdf.py
cd app
node scripts/preparer-portraits.cjs
node scripts/tester-illustrations.cjs
```

`public/lonewolf/pdf/originals/` est la copie publique des extractions, pour
les comparaisons. L’index de galerie est la copie de `extractions.json` dans
`app/content/lonewolf/ls01/pdf-extractions.json`.

## Catalogue, données et validations

La couverture publique et le catalogue local utilisent l’extraction source.
Le catalogue connecté remplace uniquement l’ancien chemin de couverture du
livre 1 à l’affichage ; aucun prix ni droit de lecture n’est changé. La migration
**008** met également ce chemin à jour en base. Elle n’a pas été exécutée contre
une base distante. Le seed de contenu a été régénéré, pas exécuté.

Validations réalisées :
- **2 220 483 pixels sombres inchangés**, sur les trente-et-une mises en couleur ;
- **76 originaux publics identiques** aux extractions de référence ;
- **95 chemins actifs** présents et décodables, dimensions des planches et
  portraits vérifiées, correspondances de tous les combats contrôlées ;
- TypeScript, build Next.js, tests de confort, bibliothèque et graphe : OK ;
- 1 000 simulations : 272 victoires, 728 morts, **aucun blocage** ;
- Chromium à 320, 390, 768 et 1365 px : pas de débordement ni erreur JS ;
- les 11 rencontres, les nouveaux portraits et l’emblème du héros vérifiés ;
- comparaison source et décodage des 76 extractions vérifiés dans le navigateur ;
- préférences, détails d’objets, reprise d’assaut et soins toujours fonctionnels.

Les services Supabase connectés, les RLS et les paiements ne sont pas validés
par ces tests locaux/mocks. L’authentification et les collections sont conservées.
