# 🗺️ HeroBook — État du projet & Roadmap

> Dernière mise à jour : 21 septembre 2026 — **catalogue Loup Solitaire LS01–LS05 + Vie/Armure/Attaque + sacoche par aventure**
> App : livre dont vous êtes le héros — Next.js + Supabase + Capacitor (Android)

---

## ✅ CE QUI EST EN PLACE

### 🏗️ Architecture & sécurité
- [x] **Next.js (App Router)** avec auth Supabase par cookies (SSR), sessions invité (`signInAnonymously`)
- [x] **22 migrations SQL** (schéma, RLS, RPC `SECURITY DEFINER`) — chaîne reconstruisible depuis zéro, sans histoires de démonstration ni NOVA-9
- [x] **Monétisation sécurisée** : le client n'écrit jamais dans `wallets` / `transactions` / `user_inventory` / `user_achievements`
- [x] **7 Edge Functions** : `make-choice`, `apply-item-effect`, `init-game`, `game-setup-action`, `resolve-combat-round`, `grant-daily-reward`, `validate-purchase` (webhook RevenueCat) — toutes mises à jour v2 pour Vie/Armure/Attaque + story_id
- [x] **RPC sécurisés** : `purchase_item`, `purchase_story`, `claim_achievements`, `claim_daily_reward`, `use_consumable`, `ensure_profile_and_wallet`, `purge_anonymous_user`
- [x] **Harnais de tests DB** : `npm run test:db` → **89/89 assertions** sur un vrai Postgres embarqué (PGlite) — migrations conservées + 5 seeds OK
- [x] **Packaging Android** (Capacitor) : projet natif + doc `app/docs/MOBILE.md`
- [x] Conversion invité → compte (`/register`, même user_id / wallet)

### 🎮 Nouvelles Règles Génériques — Vie / Armure / Attaque
- [x] **Trio simplifié** pour toutes les nouvelles histoires (doc `app/docs/REGLES.md`)
  - Vie = hp_current/max (20/20 au départ)
  - Armure = réduit dégâts reçus (`max(0, ATQ_ennemi - Armure + jet)`)
  - Attaque = augmente dégâts infligés (`max(1, ATQ_joueur - Armure_ennemi + jet)`)
  - Critique sur 9/0
- [x] **Sacoche par aventure** (migration 021)
  - `user_inventory.story_id` → inventaire cloisonné par histoire
  - Début = sacoche vide, se remplit pendant l'aventure
  - Changer d'aventure → sacoche vide pour la nouvelle
  - Revenir sur ancienne → retrouve ses objets + stats
  - `init-game` avec `reset=true` purge uniquement cette aventure
- [x] **Moteur de combat double**
  - Loup Solitaire : Table des Coups Portés officielle, combat_state serveur
  - Générique : formule Vie/Armure/Attaque, critique, fuite
- [x] **UI mise à jour** : StoryPlayer affiche Vie/Armure/Attaque pour générique, HAB/END pour Loup Solitaire, sacoche par story, bonus détaillés

### 📖 Contenu — « Les Maîtres des Ténèbres » (Loup Solitaire 01)
- [x] **350 sections** du livre intégrées (migration 008) + PDF source
- [x] **Moteur de combat fidèle** : Quotient, Table Hasard, Table Coups Portés, END serveur, fuite, morts T, règles spéciales
- [x] **Création personnage** : tirages HAB/END, 5 Disciplines Kaï, équipement
- [x] **Fidélité passe 2** (015-017) : repas/faim, Couronnes, Sac à Dos, verrous, jets narratifs
- [x] **Catalogue Loup Solitaire LS01–LS05** :
  - LS01 — Les Maîtres des Ténèbres
  - LS02 — La Traversée Infernale
  - LS03 — Les Grottes de Kalte
  - LS04 — Le Gouffre Maudit
  - LS05 — Le Tyran du Désert
- [x] **Seeds canoniques** régénérables depuis `app/content/lonewolf/` (volumes 01 à 05)
- [x] Le moteur générique `stories/story_nodes` reste disponible pour de futures histoires, sans catalogue de démonstration chargé

### 🪪 Identité lecteur
- [x] Plus de classe globale, règles dans chaque livre
- [x] Onboarding nom + sceau, 6 sceaux + 2 à débloquer
- [x] Profil = fiche lecteur

### 📚 Catalogue & navigation
- [x] Étagère mobile : Reprendre + grille 2 colonnes, couvertures 2:3
- [x] Fiche livre : CTA immédiat, description
- [x] Chrome natif : top bar + tab bar
- [x] Rayons et catalogue alimentés par les cinq volumes Loup Solitaire disponibles

### 🎨 Illustrations
- [x] 20 planches Maîtres des Ténèbres
- [x] Illustrations et couverture LS01 conservées ; les assets d'histoires retirées ne sont pas chargés
- [x] Fond forêt + typo Newsreader/Figtree

### 🎮 Lecteur
- [x] Journal, combat refondu Vie/Armure/Attaque, bandeau événements, delta Vie, potions par story

### 🔐 Auth
- [x] Fix fantôme, migration 020, OAuth boutons, invité doux
- [ ] Après validation de la PR, reconstruire l'environnement cible avec les migrations conservées et les 5 seeds
- [ ] Activer Manual linking + SMTP + OAuth

### ⚠️ État Git
- Branche de travail : `arena/01a0c550-heros`
- 22 migrations conservées + seeds 001-005 : ✅ rejouées et testées localement (89 contrôles)
- À déployer en prod : reconstruire la base avec `app/supabase/README.md`, puis déployer les Edge Functions

---

## 📋 CE QU'IL RESTE À FAIRE

### 🔥 Priorité haute
- [ ] Après approbation, reconstruire l'environnement cible avec `app/supabase/README.md`, puis déployer les Edge Functions
- [ ] Playthrough complet LS01–LS05 (mobile + desktop), avec vérification de la sacoche par aventure
- [ ] Vérifier les contrôles SQL post-reset et publier la version de l'application

### 🎨 Design
- [x] Boutique recentrée (livres + gemmes, style catalogue) — plus de section Reliques/potions
- [ ] Dépoussiérer login
- [ ] Icône/splash Android cohérent avec le catalogue Loup Solitaire

### 📖 Contenu
- [x] Seeds LS01 à LS05 présents et vérifiés depuis les sources disponibles
- [ ] Contrôle éditorial final et playthrough de chaque volume LS02–LS05
- [ ] Ajouter une future histoire générique uniquement après validation d'une nouvelle source et d'une migration dédiée
- [ ] Audio d'ambiance adapté aux aventures Loup Solitaire (hors périmètre de la reconstruction SQL)

### 💰 Monétisation & mobile
- [x] **Modèle v1** : achat d'histoires (gemmes) + packs de gemmes IAP — plus de vente d'objets/potions en boutique (sacoche = loot par aventure)
- [ ] RevenueCat prod, webhook, APK signé
- [ ] Idées de revenus futurs (hors scope immédiat) :
  - **Pass saison / rayon** (ex. tout le rayon SF à prix pack)
  - **Éditions collector** (couverture alt., journal annoté, fins commentées)
  - **Tips auteur** optionnels après une fin
  - **Cosmétiques lecteur** (sceaux, ex-libris, thèmes de lecture) — zéro pay-to-win
  - **Bibliothèque offline / pack voyage** (téléchargement payant)
  - **Anthologies premium** (courts récits exclusifs mensuels)

### 🧪 Qualité
- [ ] Tests E2E Playwright pour les parcours LS01–LS05
- [ ] CI : test:db + tsc sur chaque PR

---

## 🚀 Commandes utiles

```bash
cd app
npm install
npm run dev
npm run test:db        # 89/89 — 22 migrations + 5 seeds
npx tsc --noEmit
npm run cap:sync
```

## 📁 Repères dans le code

| Quoi | Où |
|---|---|
| Lecteur Vie/Armure/Attaque | `app/components/story/StoryPlayer.tsx` |
| Règles génériques | `app/docs/REGLES.md` |
| Moteur combat double | `app/supabase/functions/resolve-combat-round/index.ts` + `_shared/combat-table.ts` |
| Inventaire par story | `app/supabase/functions/_shared/arrival.ts` + `make-choice` + `init-game` |
| Stats bonuses | `app/lib/game-engine/stats.ts` |
| Types DB | `app/lib/supabase/types.ts` |
| Catalogue LS01–LS05 | `app/supabase/seed/` + `app/content/lonewolf/` |
| Migrations / reset guidé | `app/supabase/README.md` |
| Catalogue / rayons | `app/app/(main)/catalogue/page.tsx` |
| Tests DB | `app/scripts/test-migrations.mjs` |
