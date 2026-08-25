# 🗺️ HeroBook — État du projet & Roadmap

> Dernière mise à jour : 25 août 2026 (session « catalogue mobile : couvertures d’abord »)
> App : livre dont vous êtes le héros — Next.js + Supabase + Capacitor (Android)

---

## ✅ CE QUI EST EN PLACE

### 🏗️ Architecture & sécurité
- [x] **Next.js (App Router)** avec auth Supabase par cookies (SSR), sessions invité (`signInAnonymously`)
- [x] **15 migrations SQL** (schéma, RLS, RPC `SECURITY DEFINER`)
- [x] **Monétisation sécurisée** : le client n'écrit jamais dans `wallets` / `transactions` / `user_inventory` / `user_achievements`
- [x] **7 Edge Functions** : `make-choice`, `apply-item-effect`, `init-game`, `game-setup-action`, `resolve-combat-round`, `grant-daily-reward`, `validate-purchase` (webhook RevenueCat)
- [x] **RPC sécurisés** : `purchase_item`, `purchase_story`, `claim_achievements`, `claim_daily_reward`, `use_consumable` (migration 015)
- [x] **Harnais de tests DB** : `npm run test:db` → **85/85 assertions** sur un vrai Postgres (PGlite), migrations découvertes automatiquement
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
- [x] **Catalogue mobile (août 2026)** : plus de bannière marketing. Bandeau « Reprendre » (tap → lecture) + étagère 2 colonnes (couvertures 2:3). Détail livre recentré. Chrome natif (barre haute / tab bar) pour l’usage au pouce.
- [x] **Identité lecteur** : plus de classe globale ; onboarding nom + sceau persisté ; profil = fiche lecteur.

### 🔐 Auth (session du 24 août)
- [x] **Fix inscription / login « compte invité fantôme »** : le login ferme la session anonyme avant `signInWithPassword` (GoTrue ≥ v2.165 tentait de lier l'identité du vrai compte à l'invité) ; conversion invité→compte refaite en 3 étapes conformes à la doc Supabase (`updateUser({email})` → confirmation → mot de passe) ; écran « Confirmez votre email » pour l'inscription quand la confirmation est exigée ; logout durci (303 + purge des cookies `sb-*`). Doc complète : `app/docs/AUTH.md` (réglages requis : **Manual linking activé** côté Supabase).
- [x] **Migration 016 — comptes fantômes** : RPC `ensure_profile_and_wallet()` (auto-réparation idempotente, appelée par le layout `(main)` et l'onboarding — fini les « héros fabriqués » avec valeurs par défaut) + RPC `purge_anonymous_user()` (suppression de l'invité à la déconnexion, garde-fou SQL anti-comptes permanents). 9 nouveaux tests → **85/85**.
- [x] **Connexion OAuth (Google/Gmail, Microsoft/Outlook, Apple, GitHub)** : boutons « Continuer avec… » sur `/login` et `/register` (`OAuthButtons`, filtrables via `NEXT_PUBLIC_AUTH_PROVIDERS`), route `/auth/callback` (PKCE + liens de confirmation `token_hash`), conversion d'invité automatique via linking. Guide de config fournisseurs : `app/docs/AUTH.md` §10.
- [x] **Parcours invité doux** : l'avatar/l'onglet « Héros » mènent au profil (plus de mur `/login`), bandeau « Mode invité » explicite (exploration, rien n'est sauvegardé, CTA création de compte) sur profil/catalogue/boutique, explication sous « Jouer en invité », note « héros temporaire » à l'onboarding, confirmation + message clair à la déconnexion d'un invité (`/login?guest=closed`). Doc : `app/docs/AUTH.md` §11.
- [ ] **Déployer la migration 016** sur le Supabase de prod (SQL Editor ou `supabase db push`, guide `app/docs/AUTH.md` §9) — indispensable pour activer l'auto-réparation et la purge des invités.
- [ ] **Activer les providers OAuth** dans le dashboard Supabase (Google en priorité) + ajouter `/auth/callback` aux Redirect URLs — guide `app/docs/AUTH.md` §10.
- [ ] **Mettre à jour les templates « Confirm signup / email change »** (liens vers `/auth/callback?token_hash=…`, nécessite le SMTP Resend) — `app/docs/AUTH.md` §10.
- [ ] (plus tard) Page « Mot de passe oublié » + OAuth Google natif pour l'APK Capacitor.

### ⚠️ État Git actuel (important pour la prochaine session)
- **Tout est mergé et propre** : le delta de la session précédente (thème féerique, couvertures, potions/migration 015, bandeau d'actions) est bien dans `main` via la PR #13 (`ab6326c`). La session en cours travaille sur la branche `arena/01a03563-heros` — **committer/pousser le fix auth avant de reprendre.**
- Migrations 014-015 : ✅ déployées sur le Supabase de prod (`illustration_url` + `use_consumable`).

---

## 📋 CE QU'IL RESTE À FAIRE

### 🔥 Priorité haute (finitions du travail en cours)
- [x] **Vérifier le merge** : thème féerique + couvertures + migration 015 (potions) + bandeau d'actions bien dans `main` (PR #13)
- [x] **Déployer les migrations 014-015** sur le Supabase de prod (`illustration_url` + `use_consumable`)
- [ ] **Activer « Manual linking » dans le dashboard Supabase** (Auth → Providers) — requis pour la conversion invité → compte (fix de cette session). Vérifier aussi la « Site URL » pour les emails de confirmation.
- [ ] **Configurer un SMTP custom (Resend…) dans Supabase** — le provider email par défaut n'envoie qu'aux membres de l'organisation (2/h) : les emails de confirmation n'arrivent jamais aux joueurs (200 OK silencieux). Guide : `app/docs/AUTH.md` §8.
- [ ] **Tester un playthrough complet** des Maîtres des Ténèbres avec les nouvelles UI (mobile + desktop)
- [ ] **Vignettes intermédiaires** : le PDF contient ~35 petites vignettes de sections non exploitées (seules les 20 planches le sont)

### 🎨 Design / contenu visuel
- [ ] Continuer le dépoussiérage « trop IA » : login, register, boutique, succès. Onboarding + profil + catalogue sont le nouveau cap.
- [ ] Harmoniser succès / boutique avec le thème féerique — encore des violets / glow par endroits
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
- [ ] Plus de sceaux liés aux livres (finir *Les Maîtres des Ténèbres* débloque un sceau propre au tome)
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
| Catalogue / étagère | `app/app/(main)/catalogue/page.tsx` + `BookCard` / `ContinueReading` |
| Couvertures de livres | `app/components/story/StoryCover.tsx` + `app/public/covers/` |
| Thème / palette | `app/app/globals.css` |
| Planches du livre 01 | `app/public/illustrations/les-maitres-des-tenebres/` |
| Fresques UI (fond, victoire, défaite…) | `app/public/illustrations/ui/` |
| Migrations SQL (schéma + contenu + RPC) | `app/supabase/migrations/001 → 015` |
| Edge Functions | `app/supabase/functions/` |
| Tests DB | `app/scripts/test-migrations.mjs` |
| PDF source du livre | `content/stories/source-pdfs/` |