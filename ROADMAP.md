# 🗺️ HeroBook — État du projet & Roadmap

> Dernière mise à jour : 25 août 2026 (PR #15 — identité lecteur + catalogue mobile + rayons)
> App : livre dont vous êtes le héros — Next.js + Supabase + Capacitor (Android)

---

## ✅ CE QUI EST EN PLACE

### 🏗️ Architecture & sécurité
- [x] **Next.js (App Router)** avec auth Supabase par cookies (SSR), sessions invité (`signInAnonymously`)
- [x] **16 migrations SQL** (schéma, RLS, RPC `SECURITY DEFINER`) — 016 = auto-réparation profil/wallet + purge invité
- [x] **Monétisation sécurisée** : le client n'écrit jamais dans `wallets` / `transactions` / `user_inventory` / `user_achievements`
- [x] **7 Edge Functions** : `make-choice`, `apply-item-effect`, `init-game`, `game-setup-action`, `resolve-combat-round`, `grant-daily-reward`, `validate-purchase` (webhook RevenueCat)
- [x] **RPC sécurisés** : `purchase_item`, `purchase_story`, `claim_achievements`, `claim_daily_reward`, `use_consumable`, `ensure_profile_and_wallet`, `purge_anonymous_user`
- [x] **Harnais de tests DB** : `npm run test:db` → **85/85 assertions** sur un vrai Postgres (PGlite)
- [x] **Packaging Android** (Capacitor) : projet natif + doc `app/docs/MOBILE.md`
- [x] Conversion invité → compte (`/register`, même user_id / wallet)

### 📖 Contenu — « Les Maîtres des Ténèbres » (Loup Solitaire 01)
- [x] **350 sections** du livre intégrées (migration 006) + PDF source dans `content/stories/source-pdfs/`
- [x] **Moteur de combat fidèle au livre** : Quotient d'Attaque, Table de Hasard, Table des Coups Portés, END tenue côté serveur, fuite, morts instantanées « T », règles spéciales (Vordak, Puissance Psychique, noir sans torche…)
- [x] **Création du personnage (dans le livre)** : tirages HABILETÉ/ENDURANCE, 5 Disciplines Kaï, équipement de départ
- [x] **Fidélité livre passe 2** (migrations 011-013) : repas/faim, Couronnes, Sac à Dos, verrous, jets de hasard narratifs
- [x] 2 autres histoires seed : « La Forêt des Ombres » (fantasy), « La Crypte du Dragon Émeraude » (fantasy)

### 🪪 Identité lecteur (PR #15)
- [x] **Plus de classe globale** (Guerrier / Mage / …). Les règles restent **dans** chaque livre.
- [x] **Onboarding** : nom + sceau (ex-libris). 2 questions, pas de wizard RPG.
- [x] **Sceaux persistés** dans `profiles.avatar_url` (`seal:lantern`…). Visible barre, profil (changeable), livres terminés.
- [x] 6 sceaux de départ + 2 à débloquer (1 / 3 livres finis).
- [x] **Profil = fiche lecteur** (plus de PV / Force / Chance globaux).

### 📚 Catalogue & navigation (PR #15)
- [x] **Étagère mobile** : bandeau « Reprendre » (tap → lecture) + grille 2 colonnes, couvertures 2:3, carte entière cliquable.
- [x] **Fiche livre** : couverture, titre, CTA immédiat, description ensuite.
- [x] **Chrome natif** : barre haute fine + tab bar (Livres / Boutique / Héros / Succès). Plus de pilule flottante.
- [x] **Rayons** : Tous, Fantasy, Aventure, Polar, SF, Horreur, Romance — puces sur 2 lignes (pas de scroll horizontal), compteur centré, URL `?theme=`, état vide clair, lien depuis la fiche + « Autres en … ».

### 🎨 Illustrations
- [x] **20 planches** du livre 01 restaurées / colorisées → `app/public/illustrations/les-maitres-des-tenebres/`
- [x] **5 fresques UI** (victoire, défaite, disciplines, équipement, table de hasard)
- [x] **3 couvertures** → `app/public/covers/<slug>.jpg`
- [x] Fond d'écran forêt féerique (`backdrop.jpg`)
- [x] Typo éditoriale : Newsreader (titres) + Figtree (UI)

### 🎮 Lecteur
- [x] Journal d'aventure, écran de combat refondu, bandeau « Ce qui vient de se passer », delta d'END, potions (`use_consumable`)

### 🔐 Auth
- [x] Fix login / inscription « compte invité fantôme » (voir `app/docs/AUTH.md`)
- [x] Migration 016 : `ensure_profile_and_wallet` + `purge_anonymous_user`
- [x] OAuth (Google, Microsoft, Apple, GitHub) — boutons prêts, providers à activer en dashboard
- [x] Parcours invité doux (exploration possible, rien n'est sauvegardé)
- [ ] **Déployer la migration 016** sur le Supabase de prod (`app/docs/AUTH.md` §9)
- [ ] **Activer Manual linking** + providers OAuth + Redirect URL `/auth/callback`
- [ ] **SMTP custom (Resend…)** — sans ça les emails de confirmation n'arrivent qu'aux membres de l'orga
- [ ] (plus tard) Mot de passe oublié + OAuth Google natif Capacitor

### ⚠️ État Git
- **À merger** : [PR #15](https://github.com/varatis/Heros/pull/15) (`arena/01a035aa-heros` → `main`) — identité + catalogue + rayons.
- `main` actuel : jusqu'au fix auth (#14).
- Migrations 014-015 : ✅ déployées en prod. **016 pas encore.**

---

## 📋 CE QU'IL RESTE À FAIRE

### 🔥 Priorité haute
- [ ] Merger la PR #15 puis déployer
- [ ] Activer Manual linking + SMTP + OAuth (guides `app/docs/AUTH.md`)
- [ ] Playthrough complet Maîtres des Ténèbres (mobile + desktop) avec les nouvelles UI
- [ ] Vignettes intermédiaires du PDF (~35 non exploitées)

### 🎨 Design
- [ ] Dépoussiérer login, register, boutique, succès (encore trop « carte IA »)
- [ ] Illustrations boutique (objets encore en emoji)
- [ ] Icône / splash Android au thème actuel
- [ ] Mode clair (`.light` existe, non raccordé)

### 📖 Contenu
- [ ] « La Traversée Infernale » (Loup Solitaire 02)
- [ ] Enrichir Forêt des Ombres + Crypte du Dragon (peu de contenu vs 350 sections)
- [ ] Sauvegarde de la Feuille d'Aventure entre les tomes
- [ ] Vérifier la faim (−3 END sans repas, hors Chasse)
- [ ] Audio (aucun son actuellement)

### 💰 Monétisation & mobile
- [ ] RevenueCat en production
- [ ] Webhook `validate-purchase` sandbox bout en bout
- [ ] APK/AAB signé + Play Store
- [ ] iOS (Capacitor possible, projet non initialisé)

### 🧪 Qualité
- [ ] Tests E2E (Playwright)
- [ ] Tests Edge Functions (Deno)
- [ ] CI : `test:db` + `tsc --noEmit` sur chaque PR
- [ ] Images WebP/AVIF + lazy-load
- [ ] Accessibilité

### 💡 Backlog
- [ ] Sceaux propres à un tome (finir Les Maîtres des Ténèbres → sceau dédié)
- [ ] Stats de fin enrichies, succès Loup Solitaire, partage d'une fin, relecture du journal
- [ ] Localisation EN

---

## 🚀 Commandes utiles

```bash
cd app
npm install            # dépendances
npm run dev            # dev server
npm run test:db        # 85 assertions sur Postgres réel (PGlite)
npx tsc --noEmit       # type-check
npm run cap:sync       # sync Capacitor Android
```

## 📁 Repères dans le code

| Quoi | Où |
|---|---|
| Lecteur (journal, combat, potions) | `app/components/story/StoryPlayer.tsx` |
| Catalogue / étagère / rayons | `app/app/(main)/catalogue/page.tsx` + `BookCard` / `ContinueReading` / `ThemeRail` |
| Thèmes (Fantasy, Polar, SF…) | `app/lib/stories.ts` |
| Sceaux lecteur | `app/lib/seals.ts` + `ReaderSeal` + `SealStudio` |
| Onboarding | `app/app/onboarding/page.tsx` |
| Profil | `app/app/(main)/character/page.tsx` |
| Couvertures | `app/components/story/StoryCover.tsx` + `app/public/covers/` |
| Thème / palette / typo | `app/app/globals.css` + `app/app/layout.tsx` |
| Planches livre 01 | `app/public/illustrations/les-maitres-des-tenebres/` |
| Migrations SQL | `app/supabase/migrations/001 → 016` |
| Edge Functions | `app/supabase/functions/` |
| Auth | `app/docs/AUTH.md` |
| Tests DB | `app/scripts/test-migrations.mjs` |
| PDF source | `content/stories/source-pdfs/` |
