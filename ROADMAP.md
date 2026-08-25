# 🗺️ HeroBook — État du projet & Roadmap

> Dernière mise à jour : 25 août 2026 — **Vie/Armure/Attaque + NOVA-9 SF + sacoche par aventure**
> App : livre dont vous êtes le héros — Next.js + Supabase + Capacitor (Android)

---

## ✅ CE QUI EST EN PLACE

### 🏗️ Architecture & sécurité
- [x] **Next.js (App Router)** avec auth Supabase par cookies (SSR), sessions invité (`signInAnonymously`)
- [x] **19 migrations SQL** (schéma, RLS, RPC `SECURITY DEFINER`) — 017 = Vie/Armure/Attaque + sacoche par aventure, 018-019 = NOVA-9 SF
- [x] **Monétisation sécurisée** : le client n'écrit jamais dans `wallets` / `transactions` / `user_inventory` / `user_achievements`
- [x] **7 Edge Functions** : `make-choice`, `apply-item-effect`, `init-game`, `game-setup-action`, `resolve-combat-round`, `grant-daily-reward`, `validate-purchase` (webhook RevenueCat) — toutes mises à jour v2 pour Vie/Armure/Attaque + story_id
- [x] **RPC sécurisés** : `purchase_item`, `purchase_story`, `claim_achievements`, `claim_daily_reward`, `use_consumable`, `ensure_profile_and_wallet`, `purge_anonymous_user`
- [x] **Harnais de tests DB** : `npm run test:db` → **85/85 assertions** sur un vrai Postgres (PGlite) — migrations 001-019 OK
- [x] **Packaging Android** (Capacitor) : projet natif + doc `app/docs/MOBILE.md`
- [x] Conversion invité → compte (`/register`, même user_id / wallet)

### 🎮 Nouvelles Règles Génériques — Vie / Armure / Attaque
- [x] **Trio simplifié** pour toutes les nouvelles histoires (doc `app/docs/REGLES.md`)
  - Vie = hp_current/max (20/20 au départ)
  - Armure = réduit dégâts reçus (`max(0, ATQ_ennemi - Armure + jet)`)
  - Attaque = augmente dégâts infligés (`max(1, ATQ_joueur - Armure_ennemi + jet)`)
  - Critique sur 9/0
- [x] **Sacoche par aventure** (migration 017)
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
- [x] **350 sections** du livre intégrées (migration 006) + PDF source
- [x] **Moteur de combat fidèle** : Quotient, Table Hasard, Table Coups Portés, END serveur, fuite, morts T, règles spéciales
- [x] **Création personnage** : tirages HAB/END, 5 Disciplines Kaï, équipement
- [x] **Fidélité passe 2** (011-013) : repas/faim, Couronnes, Sac à Dos, verrous, jets narratifs
- [x] 2 histoires seed : « La Forêt des Ombres », « La Crypte du Dragon Émeraude »

### 🚀 NOUVEAU — « NOVA-9 : Le Signal Perdu » (SF)
- [x] **51 sections**, 9 fins (4 morts, 2 échecs, 3 victoires dont 1 secrète transcendante)
- [x] **12 objets SF** avec bonus Vie/Armure/Attaque : kit médical nano, combinaison néo-kevlar, exosquelette MK-III, pistolet impulsion, fusil plasma XR-7, cellule fusion, carte accès NOVA, module IA EVA, ration survie, analyseur spectre, clé quantique, disque noir légendaire
- [x] **Game design complet** : gating par objets (Carte, Clé, Analyseur), ressource rare (Cellules pour dilemme réacteur), 4 combats génériques avec Armure/Attaque, flags narratifs (réacteur stabilisé, serre brûlée), fin secrète nécessitant 3 objets légendaires
- [x] **Thèmes** : maternité artificielle (EVA), transhumanisme, deuil, conscience vaisseau
- [x] **Couverture** générée : `app/public/covers/signal-perdu-nova9.jpg`
- [x] **Illustrations** : passerelle, réacteur, noyau IA + fresques UI
- [x] **Rulebook** intégré avec nouveau système expliqué
- [x] **Bible narrative** : `content/stories/nova9-bible.md`

### 🪪 Identité lecteur
- [x] Plus de classe globale, règles dans chaque livre
- [x] Onboarding nom + sceau, 6 sceaux + 2 à débloquer
- [x] Profil = fiche lecteur

### 📚 Catalogue & navigation
- [x] Étagère mobile : Reprendre + grille 2 colonnes, couvertures 2:3
- [x] Fiche livre : CTA immédiat, description
- [x] Chrome natif : top bar + tab bar
- [x] Rayons : Tous, Fantasy, Aventure, Polar, SF, Horreur, Romance — SF a maintenant NOVA-9

### 🎨 Illustrations
- [x] 20 planches Maîtres des Ténèbres
- [x] 5 fresques UI + 3 covers + 1 nouvelle cover SF + 3 illus SF
- [x] Fond forêt + typo Newsreader/Figtree

### 🎮 Lecteur
- [x] Journal, combat refondu Vie/Armure/Attaque, bandeau événements, delta Vie, potions par story

### 🔐 Auth
- [x] Fix fantôme, migration 016, OAuth boutons, invité doux
- [ ] Déployer migrations 016-019 en prod
- [ ] Activer Manual linking + SMTP + OAuth

### ⚠️ État Git
- Branche : `arena/01a0389b-heros`
- Migrations 001-019 : ✅ testées localement (85/85)
- À déployer en prod : 016-019

---

## 📋 CE QU'IL RESTE À FAIRE

### 🔥 Priorité haute
- [ ] Déployer migrations 017-019 en prod + Edge Functions v2
- [ ] Playthrough complet NOVA-9 (mobile + desktop) avec nouveau système
- [ ] Tester sacoche par aventure en conditions réelles (2 histoires)
- [ ] Merger PR #15 si pas déjà fait, puis merger cette branche

### 🎨 Design
- [ ] Illustrations supplémentaires NOVA-9 (serres, labo, drones)
- [ ] Dépoussiérer login, boutique (objets SF en emoji)
- [ ] Icône/splash Android thème SF

### 📖 Contenu
- [x] **NOVA-9 S1 gardée comme vitrine 60 min** (51 noeuds, 9 fins) — choix produit validé
- [ ] **NOVA-9 S2 : Andromède** — 350 sections comme Maîtres des Ténèbres (outline complet `content/stories/nova9-saison2-outline.md`)
  - 5 actes, 20 fins, 35 objets, 20 combats, 25 jets Hasard, factions comme Disciplines Kaï
  - Thèmes : NOVA-7 prédatrice, cicatrice KAIROS, NOVA-0 Dyson, 10 001 consciences
- [ ] Enrichir Forêt des Ombres + Crypte avec nouveau système Vie/Armure/Attaque
- [ ] « La Traversée Infernale » (Loup Solitaire 02)
- [ ] Audio ambiance SF (vaisseau, alarme, respiration)

### 💰 Monétisation & mobile
- [ ] RevenueCat prod, webhook, APK signé

### 🧪 Qualité
- [ ] Tests E2E Playwright pour NOVA-9 (parcours 3 fins)
- [ ] CI : test:db + tsc sur chaque PR

---

## 🚀 Commandes utiles

```bash
cd app
npm install
npm run dev
npm run test:db        # 85/85 — migrations 001-019
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
| NOVA-9 story | `app/supabase/migrations/018_story_signal_perdu_scifi.sql` + `019_illustrations_signal_perdu.sql` |
| Bible NOVA-9 | `content/stories/nova9-bible.md` |
| Cover SF | `app/public/covers/signal-perdu-nova9.jpg` |
| Illus SF | `app/public/illustrations/signal-perdu-nova9/` |
| Catalogue / rayons | `app/app/(main)/catalogue/page.tsx` |
| Tests DB | `app/scripts/test-migrations.mjs` |
