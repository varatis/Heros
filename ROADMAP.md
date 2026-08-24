# 🗺️ HeroBook — État du projet & Roadmap

> Dernière mise à jour : 24 août 2026 (fin de la session « illustrations + UX + thème »)
> App : livre dont vous êtes le héros — Next.js + Supabase + Capacitor (Android)

---

## ✅ CE QUI EST EN PLACE

### 🏗️ Architecture & sécurité
- [x] **Next.js (App Router)** avec auth Supabase par cookies (SSR), sessions invité (`signInAnonymously`)
- [x] **15 migrations SQL** (schéma, RLS, RPC `SECURITY DEFINER`)
- [x] **Monétisation sécurisée** : le client n'écrit jamais dans `wallets` / `transactions` / `user_inventory` / `user_achievements`
- [x] **7 Edge Functions** : `make-choice`, `apply-item-effect`, `init-game`, `game-setup-action`, `resolve-combat-round`, `grant-daily-reward`, `validate-purchase` (webhook RevenueCat)
- [x] **RPC sécurisés** : `purchase_item`, `purchase_story`, `claim_achievements`, `claim_daily_reward`, `use_consumable` (migration 015)
- [x] **Harnais de tests DB** : `npm run test:db` → **76/76 assertions** sur un vrai Postgres (PGlite), migrations découvertes automatiquement
- [x] **Packaging Android** (Capacitor) : projet natif + doc `app/docs/MOBILE.md`
- [x] Conversion invité → compte (`/register`, même user_id / wallet)

### 📖 Contenu — « Les Maîtres des Ténèbres » (Loup Solitaire 01)
- [x] **350 sections** du livre intégrées (migration 006) + PDF source dans `content/stories/source-pdfs/`
- [x] **Moteur de combat fidèle au livre** : Quotient d'Attaque, Table de Hasard, Table des Coups Portés, END tenue côté serveur, fuite (assaut subi), morts instantanées « T », règles spéciales (Vordak psychique, immunité Puissance Psychique, noir sans torche…)
- [x] **Création du personnage** : tirages HABILETÉ/ENDURANCE, choix des 5 Disciplines Kaï, équipement de départ (Table de Hasard)
- [x] **Fidélité livre passe 2** (migrations 011-013) : repas/faim, Couronnes, Sac à Dos, verrous de conditions, jets de hasard narratifs (21 sections équipées de `hazard_consequences`)
- [x] 2 autres histoires seed : « La Forêt des Ombres » (démo), « La Crypte du Dragon Émeraude »

### 🎨 Illustrations (sessions récentes)
- [x] **20 planches pleine page** du livre extraites du PDF, restaurées (nettoyage scan, recadrage) et **colorisées** en aquarelle respectant le trait de Gary Chalk → `app/public/illustrations/les-maitres-des-tenebres/` + migration 014 (`illustration_url` sur les 20 sections)
- [x] **5 fresques d'ambiance UI** (victoire, défaite, disciplines, équipement, table de hasard) branchées dans les écrans du lecteur
- [x] **3 couvertures de livres** peintes → `app/public/covers/<slug>.jpg` + composant `StoryCover` (fallback élégant si absente)
- [x] **Fond d'écran de l'app** : fresque forêt féerique nocturne (`backdrop.jpg`)

### 🖥️ UX / UI (sessions récentes)
- [x] **Thème « médiéval féerique dark »** : palette encre de forêt + or de lanterne + émeraude (fini les violets « IA »), tous les utilitaires CSS accordés
- [x] **Journal d'aventure** : fil chronologique complet (choix, combats, jets, objets, blessures, soins, butin), bouton dans l'en-tête du lecteur
- [x] **Écran de combat refondu** : face-à-face avec jauges d'END animées des deux camps, résultat d'assaut narré, historique round par round, aide règles repliable
- [x] **Bandeau « Ce qui vient de se passer »** : collant, doré, icônes par type, cascade, 6,5 s, fermeture manuelle
- [x] **Delta d'END flottant** (+4 / −2) sur la pastille de vie
- [x] **Potions réparées** : RPC `use_consumable` en fallback de l'Edge Function ; bouton « Boire » pour tous les consommables (Laumspur inclus) avec soin réel affiché
- [x] Pages : catalogue (couvertures illustrées), détail histoire, lecteur, personnage, succès, boutique, récompense quotidienne, login/register/onboarding

### ⚠️ État Git actuel (important pour la prochaine session)
- La **PR #12 a été mergée** — mais des changements de la dernière passe (thème féerique, couvertures, potions/migration 015, bandeau d'actions) sont **encore en local non commités** sur le workspace de cette session :
  - `app/app/globals.css`, `app/components/story/StoryPlayer.tsx`, `app/components/story/StoryCover.tsx`
  - `app/app/(main)/catalogue/page.tsx`, `app/app/(main)/story/[id]/page.tsx`
  - `app/public/covers/`, `app/public/illustrations/`
  - `app/supabase/migrations/014_*.sql`, `015_*.sql`, `app/lib/supabase/types.ts`, `app/scripts/test-migrations.mjs`
- 👉 **Première action de la prochaine session : vérifier ce qui a réellement été mergé dans `main` et re-committer/pousser le delta manquant.**

---

## 📋 CE QU'IL RESTE À FAIRE

### 🔥 Priorité haute (finitions du travail en cours)
- [ ] **Vérifier le merge** : s'assurer que thème féerique + couvertures + migration 015 (potions) + bandeau d'actions sont bien dans `main` ; sinon re-livrer le delta
- [ ] **Déployer les migrations 014-015** sur le Supabase de prod (`illustration_url` + `use_consumable`)
- [ ] **Tester un playthrough complet** des Maîtres des Ténèbres avec les nouvelles UI (mobile + desktop)
- [ ] **Vignettes intermédiaires** : le PDF contient ~35 petites vignettes de sections non exploitées (seules les 20 planches le sont)

### 🎨 Design / contenu visuel
- [ ] Harmoniser les pages secondaires (personnage, succès, boutique, login/onboarding) avec le nouveau thème féerique — elles utilisent encore des classes `glow-purple` / violets par endroits
- [ ] Illustrations pour la boutique (les objets ont des emoji, pas d'images)
- [ ] Icône / splashscreen Android au nouveau thème
- [ ] Mode clair (`.light` existe dans globals.css mais n'est pas raccordé au thème féerique)

### 📖 Contenu & gameplay
- [ ] **Histoires suivantes** : « La Traversée Infernale » (Loup Solitaire 02) — la fin du livre 01 y invite explicitement
- [ ] Compléter « La Forêt des Ombres » et « La Crypte du Dragon Émeraude » (peu de contenu vs 350 sections du livre 01)
- [ ] **Sauvegarde de la Feuille d'Aventure entre les livres** (objets spéciaux conservés d'un tome à l'autre — prévu par les règles du livre)
- [ ] Système de repas/faim : vérifier l'application systématique de la perte de 3 END sans repas (hors discipline Chasse)
- [ ] Audio : ambiances sonores / bruitages de combat / narration (aucun son actuellement)

### 💰 Monétisation & mobile
- [ ] **RevenueCat en production** : clé API publique + produits configurés (actuellement mode simulation dev)
- [ ] Webhook `validate-purchase` : tester bout en bout avec de vrais achats sandbox
- [ ] Build APK/AAB signé + publication Play Store (guide dans `app/docs/MOBILE.md`)
- [ ] Version iOS (Capacitor le permet, projet non initialisé)

### 🧪 Qualité & technique
- [ ] **Tests E2E** (Playwright) : aucun test navigateur — parcours critiques à couvrir (création perso → combat → potion → fin)
- [ ] Tests des Edge Functions (Deno) — seules les RPC SQL sont testées
- [ ] CI/CD (GitHub Actions) : lancer `test:db` + `tsc --noEmit` sur chaque PR
- [ ] Optimisation images : servir en WebP/AVIF (actuellement JPEG ~250 Ko/planche), lazy-loading
- [ ] Accessibilité : audit (alt, contrastes, navigation clavier)
- [ ] `next build` de prod à valider avec les vraies variables d'env (échoue en sandbox faute de clés Supabase — normal)

### 💡 Idées / backlog
- [ ] Statistiques de fin de partie enrichies (chemin parcouru, % de sections découvertes, carte)
- [ ] Achievements spécifiques Loup Solitaire (finir sans blessure, toutes les disciplines testées…)
- [ ] Partage social d'une fin découverte
- [ ] Mode « relecture » du journal d'aventure après la fin
- [ ] Localisation EN (tout est en FR actuellement)

---

## 🚀 Commandes utiles

```bash
cd app
npm install            # dépendances
npm run dev            # dev server
npm run test:db        # 76 assertions sur Postgres réel (PGlite)
npx tsc --noEmit       # type-check
npm run cap:sync       # sync Capacitor Android
```

## 📁 Repères dans le code

| Quoi | Où |
|---|---|
| Lecteur d'histoire (journal, combat, potions, illustrations) | `app/components/story/StoryPlayer.tsx` |
| Couvertures de livres | `app/components/story/StoryCover.tsx` + `app/public/covers/` |
| Thème / palette | `app/app/globals.css` |
| Planches du livre 01 | `app/public/illustrations/les-maitres-des-tenebres/` |
| Fresques UI (fond, victoire, défaite…) | `app/public/illustrations/ui/` |
| Migrations SQL (schéma + contenu + RPC) | `app/supabase/migrations/001 → 015` |
| Edge Functions | `app/supabase/functions/` |
| Tests DB | `app/scripts/test-migrations.mjs` |
| PDF source du livre | `content/stories/source-pdfs/` |