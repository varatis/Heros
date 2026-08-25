# 📜 HeroBook — Nouvelles Règles Génériques

> Mise à jour : 25 août 2026 — Passage au système **Vie / Armure / Attaque** + **sacoche par aventure**

## 🎯 Objectif

Simplifier et unifier l'expérience pour toutes les nouvelles histoires, tout en conservant la fidélité absolue du livre **Les Maîtres des Ténèbres** (Loup Solitaire) qui garde son propre moteur.

## ⚔️ Le Trio Fondamental

### 1. Vie (VIE)
- **Définition** : Vos points de vie. `hp_current / hp_max`
- **Départ** : 20 / 20 pour les histoires génériques (10+hasard / 20+hasard pour Loup Solitaire)
- **Règle** : Tombe à 0 = mort = fin de partie. Ne peut jamais dépasser le max.
- **Soin** : Kits médicaux, rations, repos, effets narratifs.

### 2. Armure (ARMURE)
- **Définition** : Réduit les dégâts reçus.
- **Départ** : 0
- **Formule** : `Dégâts reçus = max(0, Attaque_ennemi - Armure_joueur + jet(0-1))`
- **Sources** : Combinaisons, exosquelettes, boucliers, améliorations.
- **Compatibilité** : Pour Loup Solitaire, `agility` est utilisé comme Armure dans l'UI générique, mais le calcul reste via Table des Coups Portés.

### 3. Attaque (ATTAQUE)
- **Définition** : Augmente les dégâts infligés.
- **Départ** : 5
- **Formule** : `Dégâts infligés = max(1, Attaque_joueur - Armure_ennemi + jet(0-2))`
- **Critique** : Sur jet 9 ou 0 (Table de Hasard), +2 dégâts.
- **Sources** : Pistolets, fusils plasma, modules IA, etc.
- **Compatibilité** : Pour Loup Solitaire, `strength` = HABILETÉ.

## 🎒 Sacoche par Aventure — La Grande Nouveauté

### Principe
> **Sacoche vide au début de chaque aventure. Elle se remplit pendant l'aventure. Si on change d'aventure → sacoche vide pour la nouvelle. Si on revient sur une ancienne → on récupère ses objets.**

### Implémentation technique (migration 017)
- `user_inventory` a désormais une colonne `story_id`
- Index uniques partiels :
  - `(user_id, story_id, item_id) WHERE story_id IS NOT NULL` → sacoche par histoire
  - `(user_id, item_id) WHERE story_id IS NULL` → boutique globale
- `init-game` avec `reset=true` purge la sacoche de cette histoire uniquement.
- Toutes les Edge Functions (`make-choice`, `apply-item-effect`, `game-setup-action`, `resolve-combat-round`, `arrival.ts`) filtrent par `story_id`.

### Parcours joueur
1. Nouvelle aventure SF → sacoche vide, stats 20/0/5
2. Trouve 2 cellules + pistolet → sacoche = 3 objets
3. Passe sur Fantasy → sacoche vide (autre story_id)
4. Revient sur SF → retrouve 3 objets + progression

## ⚔️ Combat — Deux Moteurs

### Moteur générique (Vie/Armure/Attaque) — toutes les nouvelles histoires
```
Chaque assaut :
  roll = random(0-9)
  dmg_to_enemy = max(1, player.attack - enemy.armor + (roll %3))
  dmg_to_player = max(0, enemy.attack - player.armor + (roll %2))
  if roll == 0 or 9 : critical +2 / +1
  enemy.Vie -= dmg_to_enemy
  player.Vie -= dmg_to_player
  round++
  Si Vie <=0 → mort
  Si tous ennemis morts → victoire → clear combat_state
```

Fuite : `metadata.combat.flee = {target_node_key, min_rounds}` — un dernier assaut subi sans infliger de dégâts, puis navigation serveur.

### Moteur Loup Solitaire (legacy)
- Table des Coups Portés officielle (13 bandes × 10 chiffres, token K = tué sur le coup)
- `character_stats.combat_state` persiste l'ENDURANCE ennemie (bug B1 corrigé)
- Disciplines : Puissance Psychique (+2 sauf immunité), Maîtrise d'armes (+2), Bouclier Psychique (annule -2 psychique), etc.
- Règles spéciales par ennemi : `player_skill_penalty`, `psychic_assault`, `no_torch_penalty`, etc.

## 🧩 Effets de Choix

Serveur = source de vérité (`make-choice`).

- `stat_modifier` : `hp_current`, `hp_max`, `armor`, `attack`, `strength`, `agility` (compat)
- `inventory_add` : ajoute qty dans sacoche de cette aventure
- `inventory_remove` : retire qty
- `inventory_require` : pré-condition, vérifiée par story_id
- `flag_set` / `flag_require` : drapeaux narratifs

## 📖 Histoire SF de Référence : NOVA-9

- 51 noeuds, 9 fins, 12 objets
- Utilise 100% nouveau système
- Démonstration de :
  - Sacoche vide → remplissage organique
  - Objets clés bloquant des choix (Carte d'Accès, Clé Quantique)
  - Combat générique avec Armure/Attaque
  - Flags narratifs (réacteur stabilisé, serre brûlée, etc.)
  - Fin secrète nécessitant 3 objets légendaires

## 🔄 Migration depuis l'ancien système

- `character_stats` garde `strength`/`agility` pour Loup Solitaire
- Nouvelles colonnes `armor`/`attack_power` avec défauts
- UI détecte `story.slug === 'les-maitres-des-tenebres'` pour afficher HAB/END, sinon Vie/Armure/Attaque
- Inventaire ancien (sans story_id) migré vers `items.story_id` si possible

## ✅ Checklist pour une nouvelle histoire

- [ ] Définir `starting_stats` dans rulebook : Vie 20, Armure 0, Attaque 5
- [ ] Créer items avec `stat_bonus` = `{"armor": X}` ou `{"attack": Y}` ou `{"hp": Z}`
- [ ] Nodes avec `metadata.combatants` contenant `armor` et `attack`
- [ ] Choices avec `inventory_add` / `inventory_require` (quantité via `stat_value`)
- [ ] Au moins 1 combat avec fuite possible
- [ ] 3-4 fins minimum (mort, échec, victoire, secrète)
- [ ] Cover en `public/covers/<slug>.jpg` (2:3)

## 🚀 Commandes

```bash
npm run test:db   # vérifie les migrations 001-018
npx tsc --noEmit
```
