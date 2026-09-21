# Interface, bibliothèque et illustrations — 16 septembre 2026

> Ce document décrit la première refonte. Pour les illustrations ajoutées ensuite
> et les portraits de combat, voir [Illustrations et combats](illustrations-et-combats.md).

## Interface

- Palette sombre cohérente (vert profond, ivoire, or), cartes opaques, contrastes
  renforcés ; correction des variables CSS Tailwind v4 `text-[var(--hero-gold)]`.
- Navigation commune à toutes les pages : bibliothèque, boutique, badges/succès,
  héros, connexion/déconnexion. Navigation fixe sur mobile, accès aux règles en pied.
- `/catalogue` rétabli (la connexion et l’onboarding redirigeaient vers une 404).
- Lecture sur papier clair, caractères de 18/19 px et interligne de 1,9 ; zoom
  navigateur réactivé. Illustrations entières, sans recadrage ou voile dégradé.
- Boutique et catalogue des 12 succès visibles sans session. En mode local,
  présentation explicitement identifiée comme un aperçu, sans faux badges obtenus.
- Filtres de succès : tous / débloqués / à débloquer. Les déblocages connectés
  viennent de `lw_succes_utilisateur`, jamais d’un résultat de démonstration.
- Connexion Supabase conservée ; retour après login vers la destination interne
  demandée ; confirmation d’email prise en charge à l’inscription ; déconnexion POST/303.

## Mise en service des bibliothèques par compte

Appliquer `supabase/migrations/009_bibliotheque_utilisateur.sql` après les
migrations `001` à `008` sur une installation existante. Ne pas réexécuter la
migration destructive de reset sur une base déjà migrée. Le fichier
`seed/001_loup_solitaire_01_adaptation_50.sql` est un seed facultatif, pas une
migration.

La nouvelle migration est additive et n’efface ni comptes ni sauvegardes.
`lw_livres_utilisateur` associe un utilisateur à un livre. Seul le serveur
(`service_role`, jamais exposé au navigateur) peut attribuer un accès. Chaque
utilisateur ne peut lire que ses attributions. Les livres gratuits publiés
restent accessibles à tous. La bibliothèque filtre les livres accessibles ; la
boutique montre le catalogue publié. En cas d’erreur, aucun droit payant n’est
inventé. Le layout `/jouer` vérifie aussi les accès.

La politique RLS des `lw_sections` n’autorise plus la lecture publique de tous
les paragraphes : livre publié ET gratuit ou attribution personnelle requise.

### Limites à respecter avant tout paiement réel

- Le tome 1 actuel est gratuit et son texte reste embarqué dans le bundle. **Ne
  pas le rendre payant en ne changeant que `is_free`** : un contrôle de route ne
  protège pas du texte déjà distribué au navigateur. Les prochains textes
  payants doivent être servis côté serveur sous RLS, pas importés statiquement.
- Aucun paiement n’est activé. L’ancien composant créditait directement le
  portefeuille et créait des transactions `mock_…`. Cette simulation a été
  supprimée ; gemmes/objets sont présentés mais aucun achat n’est exécutable.
- Implémenter un webhook de paiement vérifié, idempotent et une transaction
  atomique serveur avant de rendre les achats disponibles. Auditer aussi les
  anciennes politiques de portefeuilles, inventaires et transactions.
- La sauvegarde du jeu reste locale au navigateur (fonctionnement préexistant),
  pas synchronisée ni isolée par compte. Les succès sont lus depuis la base,
  mais cette intervention ne crée pas de moteur serveur d’attribution des
  succès/récompenses. Ces sujets restent à traiter pour le parcours connecté complet.

Les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` ne
sont pas configurées dans cet environnement. La migration et les parcours
connectés réels n’ont donc pas été exécutés ici. Tester avec deux comptes :
A possède le livre payant, B ne le possède pas ; B ne doit ni lire les sections,
ni consulter l’attribution de A, ni s’attribuer le livre par INSERT/UPDATE.
Tester aussi les invités, les livres non publiés, et les erreurs de base.

## PDF et images : source retrouvée, JPG hors livre retirés

Le fichier `content/stories/source-pdfs/Loup Solitaire 01 - Les Maitres des
Tenebres.pdf` est présent dans le dépôt ; ses 76 illustrations extraites servent
de seule source graphique (audit dans `docs/illustrations-et-combats.md`).

Les JPG générés hors livre qui restaient sous `public/lonewolf/` ont été
**supprimés** : ils ne représentaient aucune planche du PDF et n’étaient plus
référencés. Aucune image inventée n’est affichée ; les scènes sans dessin
correspondant gardent un repli textuel plutôt qu’une fausse illustration.

Chaîne de couleur : extraction → recadrage documenté (`colorization.json`) →
couche de couleur alignée sur le scan → composition qui verrouille l’encrage
(`app/scripts/coloriser-pdf.py`, vérifié par `tester-illustrations.cjs`).
5. Vérifier les textes et règles contre le PDF. Le graphe actuellement embarqué
   contient **50 paragraphes** : les tests du moteur ne prouvent pas la fidélité
   à l’intégralité du livre.
6. Retirer les mentions provisoires seulement après cette vérification.

## Vérifications

```sh
npm ci
npx tsc --noEmit
npm run build
node scripts/tester-bibliotheque.cjs
node scripts/valider-aventure.mjs
node scripts/tester-aventure.cjs 1000
```

Tests bibliothèque avec base simulée : gratuit, payant, attribution A/B, invité,
brouillon, indisponibilité réseau. Ils ne remplacent pas des tests RLS réels.
Tests Chromium : routes principales HTTP 200, filtres des 12 badges, affichage
390 px sans débordement horizontal, création complète d’un héros, lecture et
reprise de la sauvegarde. Correction d’une erreur d’hydratation préexistante dans
la Table de Hasard (graine aléatoire SSR différente du navigateur).
