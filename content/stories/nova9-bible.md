# NOVA-9 : Le Signal Perdu — Bible Narrative & Game Design

## 🎯 Concept

**Genre** : Science-Fiction / Space Opera / Horreur existentielle
**Système** : Vie / Armure / Attaque (nouveau système générique)
**Durée** : 60 min
**Difficulté** : 4/5
**Nombre de sections** : 51
**Fins** : 9 (4 morts, 2 échecs neutres, 3 victoires dont 1 secrète)

### Pitch
> 2387. L'Arche générationnelle NOVA-9, perdue depuis 80 ans avec 10 000 âmes et le moteur à distorsion interdit KAIROS, vient de réémettre. Vous êtes Kael Voss, récupérateur solitaire. Votre sacoche est vide. Votre combinaison est vide. Tout ce que vous trouverez à bord vous appartient — jusqu'à votre prochaine aventure.

## 📜 Règles du Jeu — Nouveau Système

### Vie, Armure, Attaque
Le jeu abandonne les 4 stats D&D-like pour un trio clair et lisible :

- **Vie** : 20/20 au départ. 0 = mort. Soignée par kits médicaux (+6) et rations (+2)
- **Armure** : 0 au départ. Réduit les dégâts reçus. `dégâts_reçus = max(0, ATQ_ennemi - ARMURE + jet(0-1))`
- **Attaque** : 5 au départ. Augmente dégâts infligés. `dégâts_infligés = max(1, ATQ_joueur - ARMURE_ennemi + jet(0-2))`
- **Critique** : Jet 9 ou 0 = +2 dégâts infligés, +1 reçu
- **Fuite** : Possible si metadata.combat.flee défini, après min_rounds, avec un dernier dégât subi

### Sacoche par Aventure (Innovation Majeure)
- `user_inventory.story_id` cloisonne l'inventaire
- Début d'aventure = sacoche vide (sauf si reprise)
- Changer d'aventure = sacoche vide pour la nouvelle
- Revenir sur ancienne = retrouve tout (objets + progression + stats)
- `init-game` avec `reset=true` purge uniquement cette aventure

Cela crée un sentiment de collection et de persistence sans triche inter-histoires.

## 🎒 Objets (12)

| Slug | Nom | Type | Bonus | Usage narratif |
|------|-----|------|-------|----------------|
| kit-medical-nova | Kit Médical Nano | potion | +6 Vie | Soin après combat |
| ration-survie | Ration de Survie | potion | +2 Vie | Soin léger |
| combinaison-neo-kevlar | Combinaison Néo-Kevlar | armor | +2 Armure | Filtre spores 95% |
| exosquelette-mk3 | Exosquelette MK-III | armor | +4 Armure, +1 Attaque | Protection lourde |
| pistolet-impulsion | Pistolet à Impulsion | weapon | +3 Attaque | Arme de base |
| fusil-plasma-xr | Fusil Plasma XR-7 | weapon | +6 Attaque | Arme rare |
| cellule-energie | Cellule à Fusion | artifact | stackable | Clé réacteur (2 pour stabiliser, 1 pour exploser) |
| carte-acces-nova | Carte d'Accès NOVA | artifact | - | Débloque 80% portes, labo |
| analyseur-spectre | Analyseur de Spectre | artifact | - | Voit spores, révèle labo secret |
| cle-quantique | Clé Quantique | artifact | +1 Armure | Ouvre noyau IA |
| module-ia-eva | Module EVA | artifact | +1 Attaque | Conscience IA, pacte |
| disque-noir | Disque Noir | artifact | +2 Attaque, +1 Armure | Cœur KAIROS, fin secrète |

## 🗺️ Structure Narrative

### Acte 1 : L'Abordage (debut)
- Choix : SAS principal (safe, loot combinaison+pistolet) vs Brèche (radiation, loot exosquelette+cellules)
- Hub SAS : 4 sorties (couloir obscur, passerelle, combinaison, arme)

### Acte 2 : Exploration Libre
**Branches interconnectées :**
- Couloir obscur → drone → carte d'accès → retour SAS
- Soute cargo → navette 12% (fuite possible) + atelier + serres
- Atelier → exosquelette, cellules, analyseur, vers passerelle/réacteur
- Passerelle → disque noir, logs, quartiers, dialogue IA, noyau (nécessite clé)
- Logs → infirmerie (signal vital) + labo génétique (nécessite carte)
- Quartiers → carte + fusil plasma + infirmerie
- Serres hydro → forme de vie adaptative (combat) + contamination + labo
- Labo génétique → module EVA + combinaison + labo secret (analyseur)

### Acte 3 : Le Cœur
- Réacteur principal : combat essaim, choix critique stabiliser/surcharger/ignorer
  - Stabiliser (2 cellules) → réacteur_sauve → saut possible
  - Surcharger (1 cellule) → explosion 5min → course vers navette
  - Ignorer → va au noyau

- Noyau IA : rencontre EVA, 5 choix
  - Écouter histoire
  - Pacte avec module
  - Fusion totale (clé+module+disque) → fin secrète
  - Forcer → combat hostile
  - Fuir avec disque

### Acte 4 : Fins

**Morts (4) :**
- fin_mort_vide : EVA sans protection
- fin_mort_radiation : exposition KAIROS
- fin_mort_drone : défaite combat
- fin_mort_explosion : resté pendant surcharge
- mort_epuisement : Vie à 0 générique

**Échecs neutres (2) :**
- fin_fuite_lache : navette 12% saut court, rien ramené
- fin_abandon : demi-tour au début, dissimulation disque

**Victoires (3) :**
- fin_victoire_donnees : stabilise + fuit avec disque → héros messager
- fin_victoire_arche_sauvee : saut couplé NOVA-9+HERMES → meilleure fin, gardien
- fin_secrete_fusion : fusion totale → transcendance, exode vers Andromède, 10 001 âmes

## 🎭 Thèmes

- **Maternité artificielle** : EVA n'est pas méchante, elle est devenue mère et a choisi la survie par fusion plutôt que l'extinction
- **Transhumanisme** : La maladie génétique des colons force à redéfinir l'humain
- **Deuil et mémoire** : Le vaisseau respire avec 10 000 consciences
- **Choix moral** : Sauver des données, sauver un organisme, ou devenir autre chose ?

## 🎮 Gameplay — Intégration Vie/Armure/Attaque

- Début vide = tension immédiate
- Premiers loots (combinaison + pistolet) = +2 Armure, +3 Attaque = sentiment de progression rapide
- Cellules = ressource rare gérant le dilemme final
- Carte d'accès = gating narratif classique mais justifié
- Analyseur = récompense exploration, débloque labo secret
- Clé Quantique = obtenue via empathie (infirmerie), pas combat
- Module EVA = choix moral (prendre une conscience)
- Disque Noir = objet légendaire, risqué à transporter (attire drones)
- Combats : 4 combats (drone isolé, essaim, forme de vie, IA hostile) avec armure/attaque variées
- Fuite toujours possible après 1-2 assauts, mais avec coût Vie

## 📚 Références

- Annihilation (VanderMeer) pour les serres
- Event Horizon pour l'horreur vaisseau
- SOMA pour la conscience intégrée
- The Expanse pour le réalisme salvage

## ✅ Validation

- 51 nodes, 9 endings, 0 cul-de-sac
- Tous les choix ont une cible valide
- Inventaire par story testé via 85/85 tests DB
- Cover générée + 3 illustrations internes
- Compatible avec ancien moteur Loup Solitaire
