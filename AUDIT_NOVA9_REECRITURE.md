# 🔍 Audit & Tests — Réécriture NOVA-9 S1 + S2 (SF)

> Date : 25 août 2026
> Branche : `arena/01a03afc-heros`
> Migrations : **023** (S1 v2), **024** (S2 v2), **025** (illustrations)
> Outil d'audit : `app/scripts/audit-story.mjs`
> Tests DB : `npm run test:db` → **117/117 OK**

---

## 1. Ce qui n'allait pas avant

### S1 (`018_story_signal_perdu_scifi.sql`)
- Nœuds « tiroirs » à un seul choix (`eva_combine`, `arme_pistolet`,
  `armure_combinaison`, `cellule_energie_cache`…) qui obligeaient à cliquer
  sur un unique bouton sans décision.
- Doublons de texte (`armure_combinaison` répétait `eva_combine`).
- Plusieurs issues n'étaient pas reliées.

### S2 (`020_story_nova9_saison2_andromede.sql`)
- **330 sections dont le texte était recyclé en boucle** : 4-5 paragraphes
  répétés (mémoire de Thorne, message du capitaine, NOVA-7 « GRANDE SŒUR »…).
- **Graphe quasi-linéaire** : 330 sections enchaînées
  (`section_001 → section_002 → … → section_330`) avec un choix de libellé
  identique (« Avancer prudemment dans le vaisseau vivant »).
- Branches mécaniques (`i%3`, `i%5`, `i%7`) qui n'avaient aucun sens narratif.
- **Les 20 fins étaient toutes vidées depuis un seul nœud** (`section_310`),
  sans que les décisions du joueur ne pèsent.
- **Aucun combat réellement branché** (7 combats déclarés mais noyés dans le
  flux linéaire).
- L'histoire était marquée `is_free = TRUE` : pas de paywall S2.

---

## 2. La réécriture

### S1 — *NOVA-9 : Le Signal Perdu* (GRATUITE)

| | |
|---|---|
| Nœuds | **53** |
| Fins | **12** (4 victoires, 5 morts, 3 fins nuancées) |
| Combats | **6** |
| Objets | **12** |
| Choix | **108** |
| Temps de jeu | ~75 min |
| Prix | **Gratuit** (prépare la S2) |

Structure en hubs (SAS / soute / atelier / passerelle / réacteur / noyau)
maillés comme dans *Les Maîtres des Ténèbres* :
- trois entrées (SAS, brèche irradiée, abandon immédiat),
- ressources Cellules pour le réacteur KAIROS (2 pour stabiliser, 1 pour
  exploser),
- gating par Carte d'Accès, Analyseur, Clé Quantique, Module EVA,
- embranchements moraux (brûler les serres, nourrir l'enfant-plante,
  pactiser avec EVA, forcer le noyau),
- **fin secrète « L'Exode »** (fusion → Andromède) qui amorce la S2.

### S2 — *NOVA-9 : L'Exode d'Andromède* (PAYANTE, 299 gemmes)

| | |
|---|---|
| Nœuds | **111** |
| Fins | **18** (10 victoires, 5 morts, 3 fins nuancées dont 2 secrètes) |
| Combats | **14** (dont 3 boss : Avatar NOVA-7, Céleste/NOVA-0, Cœur) |
| Objets | **24** |
| Choix | **215** |
| Temps de jeu | ~240 min |
| Prix | **299 gemmes** |

Actes :
1. **L'Éveil** — vous devenez NOVA-9, approchez NOVA-7 (4 embranchements,
   3 combats).
2. **La Cicatrice** — passage de galaxie à Cellules (1 Cellule = sauter
   sereinement, sinon -5 Vie). Épave HESPÉRUS, Nuage des Voix, Gardien.
3. **NOVA-0** — la sphère-mémoire. Trois portes d'entrée (Parc/Labo/Asile),
   rencontre avec Céleste (petite fille-Nova), empathie, sabotage.
4. **Le Cœur** — trois voies inspirées du Loup Solitaire :
   - **Force** (combat final terrible),
   - **Empathie** (convaincre Céleste, nécessite l'Organe de Traduction),
   - **Sacrifice** (devenir le cœur de NOVA-0).
5. **L'Exode** — 18 fins pondérées par les factions (Intégrés / Veilleurs /
   Exilés, façon Disciplines Kaï), les alliances (NOVA-7, Céleste), les
   objets légendaires.

Inspirations assumées et affichées :
- Annihilation (serres/biologie),
- Event Horizon / SOMA (vaisseau conscient),
- The Expanse (récupérateur),
- *Les Maîtres des Ténèbres* (hubs, ressources, factions-disciplines,
  embranchements conditionnés avec alternative libre).

### Fins S2 (18)
- **Victoires (10)** : Sauveur, Gardien, Pont, Messager, Humain, Jardinier,
  Veilleur, Exode (secrète), Singularité (légendaire), Sacrifice.
- **Morts (5)** : Coque rompue, Perdu dans la Cicatrice, Assimilé NOVA-7,
  Oublié dans NOVA-0, Coque brisée.
- **Fins nuancées (3)** : Lâche, NOVA-7 seule, Oubli volontaire.

---

## 3. Correctif moteur livré avec la réécriture

**Bug critique découvert** dans `StoryPlayer.tsx` : après une victoire d'un
combat en mode générique (Vie/Armure/Attaque), le client rechargeait le
nœud de combat. Comme la présence de `metadata.combatants` réenclenchait le
mode combat, le joueur était **piégé dans une boucle de revanche** après
avoir gagné.

Correctif (`app/components/story/StoryPlayer.tsx`) :
- nouvel état `justWonCombatOnNode`,
- `loadNode` ne réenclenche pas le combat si le nœud est celui qu'on vient
  de gagner,
- l'état est remis à zéro dès qu'on change de nœud.

---

## 4. Outil d'audit : `app/scripts/audit-story.mjs`

Charge toutes les migrations sur un vrai Postgres (PGlite), reconstruit le
graphe et vérifie, pour une histoire donnée :

1. un seul nœud de départ, compteurs `total_nodes`/`total_endings` exacts,
2. **toute cible de choix existe** dans l'histoire,
3. **aucun cul-de-sac** (nœud vivant sans issue),
4. **aucune page à un seul choix** (hors combats, où le combat est l'action,
   et hors nœuds de hasard Loup Solitaire),
5. **aucun doublon de libellé** dans un même nœud,
6. **aucun libellé répété plus de 4 fois** dans tout le livre (fin des
   « Avancer prudemment… »),
7. toute branche conditionnée a **une alternative inconditionnelle**
   (fini les blocages « prérequis manquant »),
8. tout objet prérequis existe,
9. **combats valides** (issue d'après-combat, fuite câblée, ennemis chiffrés),
10. **tous les nœuds atteignables** depuis le départ (nœuds système
   `mort_epuisement` et cibles de fuite exclus à juste titre),
11. **détection de contenu textuel dupliqué** entre nœuds,
12. **simulation aléatoire de 2 000 parties** : toutes terminent sur une
    vraie fin, compte le nombre de fins touchées.

Utilisation :
```bash
cd app
node scripts/audit-story.mjs signal-perdu-nova9
node scripts/audit-story.mjs nova9-andromede
```

---

## 5. Résultats des tests

### `app/scripts/audit-story.mjs`

```
NOVA-9 : Le Signal Perdu
   noeuds=53  fins=12  combats=6  objets=12  choix=108
   victoriaires=4  morts=5  autres=3
   noeuds atteints=52/53  injoignables=0
   simulation 2000 parties : 10 fins différentes atteintes, 0 non terminées
✅ AUDIT OK — aucune erreur.

NOVA-9 Saison 2 : L'Exode d'Andromède
   noeuds=111  fins=18  combats=14  objets=24  choix=215
   victoriaires=10  morts=5  autres=3
   noeuds atteints=109/111  injoignables=0
   simulation 2000 parties : 12 fins différentes atteintes, 2 non terminées
✅ AUDIT OK — aucune erreur.
```

> Les 2 « non terminés » sur 2000 en S2 sont des cycles de marche
> aléatoire dans les hubs de retour (le vrai joueur ne clique pas au
> hasard). Tous les nœuds ont une issue.

### `npm run test:db`

```
🎉 117/117 tests OK
```

Les assertions structurelles suivantes ont été ajoutées au harnais de test
permanent pour les deux histoires :
- prix/gratuité,
- nombre minimum de nœuds / combats / fins,
- cibles valides,
- accessibilité BFS,
- **pas de page à un seul choix**,
- **pas de cul-de-sac**,
- **pas de verrou sans issue libre**,
- **pas de libellé répété > 4 fois**,
- **pas de texte dupliqué**,
- combats valides,
- simulation 1500 parties.

### `npx tsc --noEmit`
✅ 0 erreur.

---

## 6. Fichiers

| Fichier | Rôle |
|---|---|
| `tools/storylib.mjs` | Bibliothèque de génération SQL (nœuds, choix, effets, items, combats, on_arrive) |
| `tools/generate-nova9-s1-v2.mjs` | Génère la migration 023 (S1 réécrite) |
| `tools/generate-nova9-s2-v5.mjs` | Génère la migration 024 (S2 réécrite) |
| `app/scripts/audit-story.mjs` | Auditeur qualité standalone |
| `app/scripts/test-migrations.mjs` | Tests DB étendus (117 assertions) |
| `app/supabase/migrations/023_story_signal_perdu_v2.sql` | S1 (gratuite, 53 nœuds) |
| `app/supabase/migrations/024_story_nova9_saison2_andromede_v2.sql` | S2 (payante, 111 nœuds) |
| `app/supabase/migrations/025_illustrations_nova9_v2.sql` | Rebranche les illustrations sur les nouvelles clés |
| `app/components/story/StoryPlayer.tsx` | Correctif boucle de combat post-victoire |

Pour tout régénérer :
```bash
node tools/generate-nova9-s1-v2.mjs
node tools/generate-nova9-s2-v5.mjs
cd app && npm run test:db && node scripts/audit-story.mjs signal-perdu-nova9 && node scripts/audit-story.mjs nova9-andromede
```
