# Confort de lecture, rencontres et objets

## Expérience livrée

- Pendant une aventure, un seul bandeau remplace les navigations superposées :
  retour à la bibliothèque, Endurance, Habileté, « Sac & héros », « Lecture » et
  « Hasard ». Les écrans hors jeu conservent la navigation générale.
- Lecture personnalisable : parchemin, clair ou nuit ; 18, 20 ou 22 px ; interligne
  1,65 ou 1,95. Les préférences sont validées et mémorisées localement sous
  `herobook:lecture:v1`. Leur absence, une valeur corrompue ou un stockage bloqué
  n’empêchent pas la lecture. Les réglages ne recolorent pas les illustrations.
- Une rencontre hostile commence par le récit, l’adversaire et son rapport de
  force. Le joueur peut inspecter son équipement puis engager le combat. Aucun
  assaut n’est lancé automatiquement.
- Bilan du dernier assaut visible et annoncé aux lecteurs d’écran. Les pertes
  d’Endurance n’ouvrent plus une fenêtre bloquante à chaque tour. La victoire
  n’efface plus les portraits sous un voile plein écran.
- Découvertes et autres notifications restent affichées jusqu’à validation.
  Les fenêtres retiennent le focus, se ferment au clavier, sont défilables et
  disposent d’actions de retour explicites. Les animations suivent la préférence
  système de réduction des mouvements ; le tirage de combat est immédiat dans
  ce mode.
- L’état de la rencontre (engagée ou non, Endurance adverse, journal, résultat)
  est enregistré dans le même fichier local que le héros. Un rechargement ne
  redonne plus toute son Endurance à l’ennemi et ne relance pas une victoire.
  Les sauvegardes anciennes sans rencontre restent compatibles. Les sauvegardes
  restent locales, non synchronisées et non isolées par compte : ceci ne modifie
  pas la gestion d’accès aux livres.

## Comprendre les objets

Le sac est une liste consultable au toucher, pas une grille d’emojis avec des
infobulles accessibles seulement à la souris. Les doublons sont regroupés avec
leur quantité ; chaque exemplaire compte toujours dans les huit emplacements.
Les icônes vectorielles restent lisibles sans police emoji.

Chaque fiche présente :
- description narrative ;
- effet réellement géré ;
- moment d’utilisation ;
- rangement ;
- bonus déjà appliqué ou impact de l’action proposée.

Les armures distinguent bien **Endurance maximale** et soin immédiat. Les
potions indiquent le soin effectif, plafonné au maximum, ainsi que le flacon
consommé. La prise d’une arme affiche la différence d’Habileté calculée par le
moteur, sans inventer de dégâts liés à sa description. Repas et objets narratifs
expliquent leurs conditions automatiques.

Les actions sont vérifiées aussi au moment de l’exécution, pas seulement via un
bouton désactivé :
- un soin demande une victoire en cours, un héros vivant, le flacon présent et
  de l’Endurance manquante ;
- le changement d’arme demande une arme possédée et est bloqué entre les assauts ;
- l’Alether et les propriétés non implémentées de certains objets spéciaux sont
  signalés comme non activés, sans faux bouton ni faux bonus.

La découverte d’un lot qui dépasse la capacité indique maintenant le nombre
réellement emporté puis les exemplaires refusés ; elle ne prétend plus qu’un
objet refusé a été ajouté ou perdu.

## Illustrations : source retrouvée et auditée

Le PDF de 175 pages a été retrouvé sur `main` puis extrait. Neuf planches et
une miniature sont mises en couleur en conservant l’encrage sombre d’origine.
Les nouveaux Gluâtre et Vordak sont intégrés aux combats. Deux rencontres
ajoutées à l’adaptation restent sans dessin identifié. La galerie permet de
consulter les 76 éléments extraits et de comparer les planches aux originaux.
Voir `illustrations-et-combats.md` pour les correspondances et limites exactes.
Le graphe adapté (50 sections) n’est pas celui du livre complet (350 sections).

## Validation

```sh
node scripts/tester-confort-lecture.cjs
node scripts/tester-illustrations.cjs
node scripts/tester-bibliotheque.cjs
node scripts/valider-aventure.mjs
node scripts/tester-aventure.cjs 1000
npx tsc --noEmit
npm run build
```

Le test de confort vérifie les soins interdits/autorisés, le plafonnement, la
non-consommation à pleine Endurance, la possession, la mort, les phases d’usage,
la Maîtrise des Armes, les aides des objets, les préférences corrompues, le lot
partiellement accepté et la sérialisation de rencontre.

Contrôles Chromium effectués en aperçu local :
- pages principales à 320, 390, 768 et 1365 px ;
- aucune largeur de page débordante ; grille de hasard défilable dans sa propre
  zone et fenêtres contenues dans l’écran ;
- préférences après rechargement, fiches imbriquées et fermeture par Échap ;
- préparation, combat, bilan, rechargement au même assaut, victoire et soin ;
- notification de découverte toujours visible après plus de trois secondes ;
- aucune erreur JavaScript dans ces parcours.

Ces tests de confort ne certifient pas les textes/règles de l’adaptation ni les
services connectés. Les vérifications d’images sont documentées séparément.
