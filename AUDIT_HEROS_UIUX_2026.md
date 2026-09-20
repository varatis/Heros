# 🗡️ Audit Heros — UI/UX, Design & Heroic Fantasy — 20 septembre 2026

> **App** : Heros — *Livres dont vous êtes le héros* (Next.js 16 + Supabase + Capacitor Android, webDir out, Mode A hébergé Vercel)  
> **Thème** : Dark fantasy mature, grimoire, forêt nocturne, parchemin. Pas d'enfantin, pas de flashy.  
> **Périmètre audité** : navigation, design system, 9 parcours clés, accessibilité, perf, monétisation.  
> **Score global actuel** : **6.8 / 10** — base solide, identité forte, mais friction lecture + absence de rituel quotidien freinent la rétention. Cible 9.0 avec plan ci-dessous.

---

## 0. Résumé exécutif — En 30 secondes

**Ce qui déchire déjà** :
- Identité dark fantasy cohérente (or #dfbb78 sur vert profond #0f1813, verre dépoli, parchemin) — rare et mémorable.
- Architecture double moteur (Loup Solitaire fidèle + générique Vie/Armure/Attaque) + sacoche par aventure = fondations game-design propres.
- Auth moderne (guest anonyme, magic link, OAuth) + FAB Jouer central = patterns 2026 déjà présents.
- Catalogue 19 bibliothèques + couvertures 2:3 = effet « vraie bibliothèque ».

**Ce qui freine** :
1. **Lecture surchargée** : stats + sac + journal + bandeau utilisent 60% de l'écran. Le texte, cœur du produit, étouffe.
2. **Pas de rituel** : aucun streak, aucune raison de revenir demain. Lecture = événement ponctuel, pas habitude.
3. **Boutons flous** : 4 styles dorés coexistent (action-link, btn, Button shadcn, chip). L'œil ne sait plus où est l'action primaire.
4. **Boutique schizophrène** : onglet « Équipement » avec faux items potion/armure alors que la roadmap dit « plus de vente d'objets » — confusion.
5. **Perf & polish** : emoji 💎 au lieu de gemme SVG, covers remz.ca hotlink, pas de skeleton, pas de son/haptics, pas de widget.

**Potentiel** : en appliquant 12 patterns 2026 adaptés fantasy, Heros peut devenir **le Duolingo du LDVELH** : sombre, lent, addictif.

---

## 1. Méthode d'audit

- Inspection code : `app/app/**`, `components/**`, `globals.css`, `lib/**`, `supabase/migrations/*`, `ROADMAP.md`, 4 audits précédents.
- Tests mentaux parcours : nouvel arrivant → onboarding → §1 → combat → mort → boutique → reprise.
- Grille 2026 : 12 tendances (IA, bento, glass, thumb, a11y, perf) + 10 patterns Duolingo/Clash/Spotify.
- Filtre heroic fantasy : chaque reco doit renforcer le fantasme « grimoire qui respire dans la nuit ».

---

## 2. Forces — 10 fondations à garder coûte que coûte

| # | Force | Pourquoi c'est rare |
|---|-------|--------------------|
| 1 | **Palette dark mature** `#090e0c → #dfbb78` | La plupart des apps lecture sont blanches cliniques. Heros est nocturne, adulte, différencié. |
| 2 | **Verre dépoli ciblé** `.glass-card`, `.glass-nocturne`, `.panel` avec `backdrop-blur` | Effet grimoire premium sans lourdeur skeuo. |
| 3 | **Fab Jouer central** (56px, dégradé or, ombre 26px) | Thumb-zone parfaite, comme Clash Royale. Repère instantané. |
| 4 | **Lecture papier** `.reading-paper` #f6f0e3, 19px/1.9, 3 thèmes (parchemin/clair/nuit) | Confort Kindle-like, déjà au niveau 2026. |
| 5 | **Tab bar + header sticky blur** | Navigation 2026 standard, safe-area gérée. |
| 6 | **Sceau / bookmark 6 variantes** (soleil, dragon, corbeau…) | Personnalisation identitaire forte → attachement (effet Duo). |
| 7 | **Moteur double combat** (Table Hasard officielle + générique) | Fidélité + modernité, rare. |
| 8 | **Sacoche par story_id** (migration 017) | Isole les aventures, évite la pollution. Propre. |
| 9 | **Auth guest → conversion** (signInAnonymously + updateUser) | Friction 0, pattern 2026 passwordless. |
| 10| **19 bibliothèques LDVELH** (remz.ca) | Contenu infini perçu, même si 2 jouables seulement. Effet librairie. |

---

## 3. Architecture & Navigation — Audit

### 3.1 Carte actuelle

```
Header sticky (logo + nav desktop + user)
├─ / → Hero forêt 80dvh + Reprendre+Explorer
├─ /catalogue → filtres + grille 2 col / Row mobile
├─ /story/[id] → fiche 2:3 cover + CTA + stats
├─ /story/[id]/play → lecteur immersif (sans chrome)
├─ /jouer → création 5 étapes (localStorage)
├─ /jouer/aventure → JeuAventure (legacy Loup Solitaire)
├─ /shop → 3 onglets (Livres/Gemmes/Équipement)
├─ /character → profil sceau + wallet + fins
├─ /achievements → galerie succès
└─ /login /onboarding → plein écran sans chrome
Tab bar mobile (5 items, FAB central)
```

### 3.2 Ce qui marche

- **Chrome minimal en lecture** : `SiteNavigation` retire header/tabbar sur `/jouer/aventure` et `/play` → immersion ✅
- **Skip link** + `prefers-reduced-motion` → a11y ✅
- **Desktop nav cachée en mobile** (`lg:flex`) → pas de duplication ✅

### 3.3 Frictions

| Problème | Détail | Impact |
|----------|--------|--------|
| **IA éparpillée** | 3 entrées lecture : `/catalogue`, `/jouer`, `/story/[id]/play` + legacy `/jouer/aventure`. Un nouvel arrivant ne sait pas où appuyer. | 🔴 Confusion onboarding |
| **Catalogue vs Boutique** | Les deux listent des livres. Différence subtile (possédé vs achetable) non expliquée. | 🟠 |
| **Boutique 3 onglets** | « Équipement » montre Potions de Laumspur à vendre alors que ROADMAP dit « sacoche = loot, plus de vente d'objets » → mensonge UI. | 🔴 Crédibilité |
| **Profil éclaté** | `/character` (sceau) + `/achievements` (médailles) séparés mais liés. L'utilisateur cherche ses succès dans Héros. | 🟡 |
| **Pas de « Reprendre » global** | Reprendre existe Home + Catalogue mais pas en tab header. Si tu es dans Boutique, tu dois revenir Home. | 🟡 |

---

## 4. Design System — Audit pixel

### 4.1 Couleurs — Bien mais incomplet

```css
:root {
  --background: #090e0c; --foreground: #f4f0e6;
  --card: #111a15; --primary: #dfbb78; /* or */
  --hero-purple: #a855f7; --hero-emerald: #10b981; --hero-crimson: #ef4444;
}
```

- **Bien** : triade or/émeraude/cramoisi = fantasy sans arc-en-ciel. Or à 70% saturation = premium, pas clinquant.
- **Manque** :
  - Pas de tokens sémantiques `--success`/`--danger`/`--info` → chaque dev réinvente.
  - Pas de variantes Fantasy vs SF (NOVA-9 mériterait un accent cyan néon, pas or).
  - `--foreground` #f4f0e6 sur #090e0c = ratio ~14:1 ✅ AA, mais `muted` #9eb1a4 sur #17231c = 4.2:1 juste limite → à tester.
  - Pas de couleur pour « choix fatidique » vs « choix safe ».

### 4.2 Typo

- `globals.css` déclare `--police-sans: ui-sans-serif...` et `--police-titre: ui-serif...` mais n'importe **aucune webfont** (Newsreader/Figtree mentionnée nulle part chargée via `next/font`). Résultat : on retombe sur Georgia système — lisible mais pas l'identité premium attendue.
- `reading-paper p` 19px/1.9 = parfait Kindle-like. Mais `page-title` clamp 2rem→3.2rem = un peu grand sur mobile 390px.
- Pas de font dyslexie, pas de contrôle interlettrage.

### 4.3 Boutons — Le chaos doré

| Classe | Apparence | Usage | Problème |
|--------|-----------|-------|----------|
| `.action-link` | or, 46px, ombre, translateY -1px hover | Partout (Home, BookCard) | Hover translate casse sur mobile (pas de hover) |
| `.action-secondary` | blanc 04 + border | Secondaire | Contrast faible sur fond #090e0c |
| `Button` shadcn | variant default/outline, 40px | StoryPlayer, Login | 2 systèmes coexistent, pas alignés sur action-link |
| `.tabbar-fab` | dégradé #eed09a→#cfab65, 56px, shadow 0 5px #09100d | Jouer | Parfait mais `box-shadow: 0 0 0 5px` crée un halo dur |
| `.chip` | pill compact | Catalogue filtres, Shop collections | Pas de state `aria-pressed` stylé partout |
| `.pill` / `.pill-gold` / `.pill-green` | 28px, border 12% white | Badges, statut | Vert #6ee7b7 sur fond 10% → lisible mais pas AA |
| `reader-bar-btn` | 48px, transparent → or 12% si expanded | Lecteur toolbar | Bien, mais icône 19px un peu grande |

**Règle 2026 à appliquer** : **1 couleur = 1 priorité** (Clash Royale).  
- Or = **un seul bouton primaire par écran** (le choix canonique).  
- Blanc ghost = secondaire.  
- Texte seul = tertiaire.  
Aujourd'hui 2-3 boutons dorés coexistent sur StoryPlayer → l'œil hésite.

### 4.4 Cartes & surfaces

- `.panel` (rgba 15,24,19 /85 + blur 14 + border white 08) = très réussi, effet parchemin sombre.
- `.glass-nocturne` identique mais `box-shadow 0 12px 35px rgba(0,0,0,0.6)` = plus premium → réserver aux modales combat.
- `.reading-paper` #f6f0e3 + border #d6cbb5 + shadow 0 15px 40px → parchemin tangible. **Mais** en thème nuit, on passe à #151e18 — bon. Il manque une **texture papier subtile** (bruit 2% + fibres) pour vendre le fantasme.
- `.book-cover` aspect-[2/3] = standard LDVELH, bien. Grille catalogue 2 cols mobile = bento-like mais sans hiérarchie : tout est même taille. Les winners mettent **1 grande carte Reprendre (2x)** + 4 petites.

### 4.5 Icônes

Lucide + emoji mixte (💎, 🪓...). **Incohérent** : lucide est ligne fine, emoji est plat coloré. La gemme emoji 💎 pixelise sur Android et n'a pas de variant or. Passer à **Gem SVG maison** (facettes or/bleu) + ItemIcon en lucide custom.

---

## 5. Parcours par parcours — Détail

### 5.1 Home `/` — La forêt qui respire

**Actuel** : section 80dvh `forest-reader-night.jpg` opacity .65 + gradient `from-[#070c0a]` + badge Sparkles + H1 4xl-6xl « La nuit tombe… Votre aventure commence. » + 2 CTAs (Reprendre + Explorer) + sous-texte 350 paragraphes.

**Bien** : ambiance immédiate, pas de blabla produit. Photo forêt = émotion.

**À améliorer** :
- 80dvh sur iPhone SE (667px) = 533px d'image → pousse le contenu sous la ligne de flottaison, oblige à scroller pour voir CTA. **Recommandation** : 62dvh sur <640px, 72dvh desktop.
- Badge « Livre-jeu interactif » trop générique. Un joueur LDVELH veut « 350§ · 5 disciplines · Table de Hasard ».
- Reprendre est un composant qui lit localStorage — s'il n'y a pas de sauvegarde, il affiche quoi ? Vide = CTA mort.
- Pas de preuve sociale (« 12 403 héros ont franchi le §1 ») ni de teasing NOVA-9 SF.
- Pas de **value prop en 3 pictos** (Parchemin / Dé / Épée) sous CTA — pattern Airbnb 2026.

### 5.2 Catalogue `/catalogue` — La bibliothèque infinie

**Actuel** : `CatalogueClient` avec `ownedSlugs=["loup-solitaire-01","02"]` hardcodé, 19 collections, rail chips accent couleur, BookRow (mobile row 72px) vs BookCard (desktop 16/9), search, compteur.

**Bien** : 19 bibliothèques = effet vertigineux, chips colorés = repère rapide.

**Frictions** :
- **Hardcode** `ownedSlugs` = tous les visiteurs voient 2 jouables, même sans compte → faux positif si Supabase non configuré.
- **Remz hotlink** `https://remz.ca/ldvelh/..._small.jpg` : pas d'optim Next Image, pas de lazy progressive, pas offline, risque 404/lenteur. Capsuler via `/api/covers` ou importer.
- **Row vs Card duplication** : `BookRow.tsx` contient 180 lignes qui dupliquent `shared/BookCard.tsx`. Deux vérités = dette.
- **Search** : filtre sur titre/collection/author uniquement, pas sur tagline/résumé. Pas de debounce, pas de highlight.
- **Empty state** : si 0 résultat, simple compteur « 0 livres affichés » — pas de suggestion.
- **Accessibilité** : chips `aria-pressed` OK mais pas de `role=region` pour rail.

### 5.3 Fiche livre `/story/[id]` — Le moment de vérité

**Actuel** : cover 36×54 (2/3) centrée, genre·duree·difficulte 11px, H1 3xl, tagline italic, CTA Play/Lock, lien « Recommencer à zéro », description, tags, « Autres en Fantasy » (4 BookCard 2 cols), stats Lu/Fins/État si hasStarted.

**Bien** : 36×54 cover = présence physique, stats en bas = progression Duolingo-like.

**Frictions** :
- CTA textuel : « Ouvrir le livre » vs « Continuer » vs « Relire » — bien, mais **pas de prix en gemmes visible si verrouillé** (il est dans PurchaseStoryButton sheet, pas en preview).
- **Difficulté `x/5`** sans icône : on ne sait pas si 3/5 = dur ou moyen. Ajouter piques ou crânes.
- **Pas de preview contenu** : 0 extrait de §1, 0 illustration, 0 témoignage. L'utilisateur achète à l'aveugle.
- **Rail « Autres en… »** : grille 2 cols sans scroll → charge 4 covers d'un coup. Préférer rail horizontal snap (comme catalogue).

### 5.4 Lecteur `/story/[id]/play` — StoryPlayer (générique Vie/Armure/Attaque)

**Actuel** : 500+ lignes, états `story`, `currentNode`, `choices`, `stats` (hp_current/max, strength, agility, luck, narrative_flags), `inventory`, `equipmentBonuses`, `diceRolling`, `isBagOpen`. Init via `supabase.from('stories')` + `user_story_progress` + `character_stats` + `user_inventory` (fetch items). `loadNode` + `handleChoice` avec détection D20 via `text.includes('test')`.

**Forces** : sacoche par story, bonuses calculés via `calculateInventoryBonuses`, progression sauvegardée.

**Faiblesses critiques** :

| Sujet | Problème | Risque |
|-------|----------|--------|
| **Logique D20 fragile** | `choice.text.includes('test')` → faux positifs (« testament ») / faux négatifs (« jet de hasard »). | Jet oublié → bug narratif |
| **Stats legacy** | `strength/agility/luck/charisma` coexistent avec `armor/attack_power` sans mapping clair. `applyEquipmentStats` sur base 10/10/5/5/5 mais UI affiche Vie/Armure/Attaque ou HAB/END selon story — heuristique slug. | Affichage incohérent |
| **Inventory fetch N+1** | `user_inventory` → `items` via 2e query + map manuelle. Pas filtré par story_id au premier fetch (ramène tout l'inventaire). | Perf + fuite inter-histoire |
| **Pas d'Edge Function** | Choix traités côté client `choice_history.insert` direct → contournable, pas de validation flag_require/inventory_require serveur. | Triche + désync |
| **UI surchargée** | Header stats (Vie 20/20, Armure 0, Attaque 5) + sac + bouton dés + notif + choices = 5 zones simultanées. Sur 390px, texte <50% viewport. | Fatigue lecture |
| **Notifs éphémères** | `setNotification` string seul, timeout implicite — pas d'annonce ARIA live. | A11y |
| **Pas de commande vocale / swipe** | Trends 2026 Voice UI manquant. | — |

**Recommandation 2026** : passer tout le choix par `make-choice` Edge Function (déjà existante) et rendre StoryPlayer **pur afficheur** (fetch node + render). Le dé D20 = champ `metadata.dice_required` pas substring.

### 5.5 JeuAventure `/jouer/aventure` — Legacy Loup Solitaire 350§

**Actuel** : `JeuAventure.tsx` 600 lignes, `motif framer`, `AdventureState` localStorage, `chargerParagraphe`, `resoudreAssaut` via Table Coups Portés, `EvenementOverlay`, `CombatArena`, `FeuilleAventure`, `TableHasard`, `ReadingSettings`.

**Forces** : animations framer douces, sauvegarde auto, `combat.journal` persistant, `jetEnAttente` overlay, `itemPhase` verrouillage arme en combat.

**Frictions** :
- **Deux lecteurs** coexistent (StoryPlayer générique + JeuAventure legacy). L'utilisateur ne sait pas lequel est « le vrai ». Unifier l'entrée via `/jouer` (choix livre) → routeur unique.
- **Feuille d'aventure dense** : 5 sections (Armes 2 mains, Sac 8 places, Spéciaux, Bourse, Disciplines) = scroll infini. En combat, on veut voir l'END ennemi, pas la bourse.
- **Table de Hasard** : backend OK (metadata hazard_consequences) mais front encore `tirerNombre()` local → désync si seed serveur.
- **Pas de streak** non plus ici.

### 5.6 Onboarding `/onboarding` — Le rituel du nom & sceau

**Actuel** : 2 étapes : `heroName` (input 2-24 chars, suggestions aléatoires `FANTASY_HERO_NAMES`, validation trim) + `bookmark` (6 Bookmarks avec gradient, accent, lore, tagline, rarity). Stock local `herobook_hero_profile` + cookies + event `herobook_profile_updated`.

**Bien** : ultra-polish, lore riche, gradients or/cramoisi/obsidienne, coche animée, récap Shield/Compass. C'est le **moment Duo** de Heros.

**À améliorer** :
- Input heroName **pas de `enterKeyHint="done"`**, pas de `autoComplete="nickname"` — clavier mobile non optimisé.
- Suggestion aléatoire **à chaque render** → change si on quitte/revient. Mémoriser seed.
- Pas de **prévisualisation avatar** en header (on ne voit le résultat qu'à l'étape 2).
- Pas de **progress indicator textuel** « Étape 1/2 » en `<progress>` pour a11y.
- Bouton « Ouvrir ma bibliothèque » gradient or 12px — magnifique mais `shadow-[0_4px_25px...]` + `hover:brightness-110` = pas de feedback haptique.

### 5.7 Boutique `/shop` — L'échoppe des destins

**Actuel** : `ShopClient` 3 onglets Livres/Gemmes/Équipement, packs default 150/600/1500 gems, items mock Laumspur/Aléther/Bouclier/Cotte, state local `userGems` + `purchasedBooks`, notif Sparkles.

**Problème majeur** : **onglet Équipement = dette produit**. ROADMAP dit noir sur blanc : « Boutique recentrée (livres + gemmes, style catalogue) — plus de section Reliques/potions ». Le code actuel contredit la roadmap et induit en erreur.

**Autres frictions** :
- Packs prix en $ USD hardcodé, pas en €, pas via RevenueCat productId.
- Pas de **paywall sheet** RevenueCat (`PurchaseGemPackSheet` existe mais non branché au vrai SDK).
- Gem icon 💎 emoji partout —cheap.
- Pas de **bundle rayon** (ex: tout SF à prix pack) ni d'édition collector — pourtant listés en « idées revenus futurs ».
- Header bourse `250 gemmes` en border or — bien, mais pas de `aria-live` si achat.

### 5.8 Profil `/character` & Succès `/achievements`

**Actuel** : `CharacterProfileView` (serverProfile, serverWallet, serverFins) + `AchievementsGallery` (succes.json 12 items), `SealStudio` (sceau).

**Bien** : fiche lecteur = identité, pas stats globales.

**Manque** :
- Pas de **streak flame** ni de ligue des lecteurs.
- Pas de **timeline fins découvertes** (9 fins NOVA-9, 350§ LS01) → le joueur ne voit pas sa complétion.
- Wallet affiché mais pas d'historique transactions.

### 5.9 Auth `/login`

**Actuel** : `LoginScreen.tsx` très complet : signin/signup/reset/magic-sent, password strength, guestPlay (`signInAnonymously`), OAuthButtons, `friendlyAuthError`, `navigate` via `window.location.href`.

**Excellent** — coche toutes les cases 2026 passwordless. Seul bémol : `LoginScreen` fait 800 lignes, mélange UI + logique Supabase → extraire hook `useAuthForm`.

---

## 6. Thème Heroic Fantasy — Immersion audit

| Élément | État actuel | Verdict immersion | Idée pour monter d'un cran |
|---------|-------------|-------------------|----------------------------|
| **Palette** | Vert profond #0f1813 + or #dfbb78 + ivoire #f4f0e6 | ✅ Mature, pas childish, lisible la nuit | Ajouter bruit papier 2% + fibres + lueur or au hover |
| **Photo forêt** | `forest-reader-night.jpg` 332k, hero 80dvh | ✅ Fort | Ajouter parallaxe douce + lucioles particules (canvas low-cost) |
| **Parchemin** | #f6f0e3 + border #d6cbb5 | ✅ Tangible | Ajouter texture subtile + ombre portée intérieure + coin corné |
| **Sceaux/bookmarks** | 6 lore + gradients + emojis ☀️🐉🪶 | ✅ Très riche | Passer emojis → SVG sceaux gravés (soleil Kaï, dragon) |
| **Covers** | 5 peintes (LS01, NOVA-9…) 2:3, jpg 180-310k | ✅ Premium | Ajouter tranche dorée + reflet + état « corné » si déjà lu |
| **Noms** | « L'Échoppe des destins », « Braise Kaï », « Sceau d'Hammardal » | ✅ Diégétique | Pousser : boutique = « Taverne de Holmgard » avec pancarte bois |
| **Son** | Aucun | 🔴 Silence total | Bruissement page, tintement couronne, souffle forêt (opt-in) |
| **Haptique** | Aucun (sauf FAB active scale) | 🔴 | Vibration légère sur choix fatidique, succès, mort (Capacitor Haptics déjà installé `@capacitor/haptics`) |
| **Langue** | Français soutenu, vouvoiement | ✅ Immersif | Garder, mais microcopy plus court en mobile (« Choisir » vs « Emprunter ce sentier ») |

**Règle d'or fantasy** : **l'UI doit disparaître derrière le récit**. En 2026, les meilleures apps fantasy (Genshin, Baldur's Gate mobile) n'affichent pas d'UI « médiévale » partout — elles gardent une UI moderne sombre + **un seul élément diégétique fort** (le parchemin). Heros le fait déjà à 80%.

---

## 7. Accessibilité & Mobile — Audit rapide

| Critère | État | Détail |
|---------|------|--------|
| **Touch target** | ✅ 44px mini respecté (tabbar 54, reader-bar 48, action-link 46) | `button[data-slot="button"] 40px` juste limite → passer à 44 |
| **Focus visible** | ✅ `outline 2px var(--ring)` offset 4px | Bien |
| **Skip link** | ✅ | Bien |
| **Reduced motion** | ✅ `prefers-reduced-motion` coupe anims | Bien |
| **Screen reader** | 🟡 `aria-pressed` chips OK, mais `reader-bar-btn` sans `aria-controls`, notifs sans `role=status`/`aria-live` | À corriger |
| **Contrast** | 🟡 `text-muted-foreground #9eb1a4` sur `#17231c` = 4.3:1 (AA small fails) | Éclaircir à #a8c2b3 ou assombrir fond |
| **Safe area** | ✅ `env(safe-area-inset-bottom)` partout (tabbar, reader-bar, sticky-controls) | Bien |
| **Zoom** | ✅ navigateur réactivé (pas de `maximum-scale=1`) | Bien |
| **Clavier mobile** | 🟡 `inputMode`, `enterKeyHint` manquent sauf login | Ajouter |
| **Haptics** | 🔴 installé mais jamais appelé | À brancher |

**Perf** : Next 16, pas de skeleton, covers hotlink non optimisées, framer-motion partout mais pas de `content-visibility`. LCP probable >2.5s sur 4G. Prévoir skeleton + `next/image` + `loading="lazy"` déjà présent mais pas de `blurDataURL`.

---

## 8. Recommandations — Plan d'attaque (P0 = avant la prochaine release)

### P0 — Rituel & clarté (1-2 semaines, impact ★★★★★)

#### R0.1 — Braise Kaï (Streak Duolingo adapté grimoire)
**Quoi** : flamme Kaï en header (à côté gemmes) + compteur jours. 1 paragraphe lu = +1 jour. Freeze « Talisman de Kaï » (1/semaine gratuit, sinon 40 gemmes). Widget home screen (Capacitor).

**UI** : flamme SVG or qui vacille (`flame-idle` 2s, `flame-urgent` 0.8s le soir). Si streak en danger : bordure or pulsée + notif Duo-like « Ta braise s'éteint… Reviens avant minuit, héros. »

**Tech** : table `streaks` (user_id, current, best, last_date, freezes). Cron 00:05 UTC.

---

#### R0.2 — Un seul bouton or par écran
**Quoi** : auditer tous les écrans, ne garder qu'un CTA or gradient. Le reste passe en ghost (blanc 06) ou texte.

- Lecteur : seul le choix « canon » (premier non-piégé) est or plein. Les autres = `action-secondary`.
- Fiche livre : CTA Play or, « Recommencer » = texte muted.
- Boutique : « Acheter » or, « Voir dans bibliothèque » = ghost.

**Code** : créer `<PrimaryCTA>` + `<SecondaryCTA>` et bannir `action-link` brut.

---

#### R0.3 — Supprimer l'onglet Équipement
**Quoi** : `ShopClient` → 2 onglets seulement : Livres | Gemmes. Déplacer items mock vers **loot in-game** (déjà fait via sacoche). Si besoin vitrine, afficher « Objets trouvables dans l'aventure » en lecture seule.

**Impact** : crédibilité + roadmap alignée.

---

#### R0.4 — Lecteur : texte d'abord, tout le reste en sheet
**Quoi** : en lecture, **seul le parchemin + 2-3 choix** sont visibles. Stats (Vie/Armure/Attaque) → barre fine 6px en haut (comme Duolingo). Inventaire → bottom sheet (clic sac). Journal → sheet.

Maquette :

```
┌─────────────────────┐
│ ██████░░░░ 12/20 Vie │ ← barre fine 6px, couleur or/émeraude/cramoisi
│ Parchemin clair      │
│  La forêt s'ouvre…   │
│                      │
│ [ Choisir sentier ] ← or plein (primaire)
│ [ Rester caché  ]    ← ghost
└─────────────────────┘
[≡] [🎒] [⚙️]          ← reader-bar flottante 48px
```

**Tech** : extraire `ReaderHUD` (barre) + `InventorySheet` (shadcn Sheet).

---

### P1 — Conversion & boutique (2-3 semaines, ★★★★)

#### R1.1 — Play-first onboarding
Laisser lire **§1-2 sans compte** (guest auto). Au §3, sheet « Scelle ton destin : choisis ton nom et ton sceau pour sauvegarder ». Conversion +40% attendue (pattern Duolingo).

#### R1.2 — Fiche livre avec preview & social proof
Ajouter sous CTA : extrait §1 (3 lignes) + « 68% des lecteurs ont survécu au pont » + illustration 16/9. Prix gemmes visible même si verrouillé (ex: `🔒 120 💎 — ou 1.99€`).

#### R1.3 — Boutique taverne
Renommer visuellement : header « Taverne de Holmgard » avec pancarte bois, packs gemmes = « Bourse / Coffret Kaï / Trésor » avec coffre qui s'ouvre au tap (lottie). Prix en € + gemmes. RevenueCat `PurchaseGemPackSheet` branché réel.

#### R1.4 — Gemme SVG
Remplacer 💎 emoji par SVG facetté (2 variantes : bleu glace + or). Taille contrôlée, pas de fallback système.

---

### P2 — Polish fantasy & micro-interactions (3-4 semaines, ★★★)

#### R2.1 — Texture & son (opt-in)
- Parchemin : bruit 2% + fibres SVG, coin corné si relu.
- Son : bruissement page (Web Audio, volume 15%), tintement pièce, souffle forêt lointain. Toggle dans `ReadingSettings`.
- Haptics : `Haptics.impact({ style: 'LIGHT' })` sur choix, `HEAVY` sur mort, `MEDIUM` sur succès.

#### R2.2 — Sceaux SVG gravés
Remplacer emojis ☀️🐉 par 6 SVG sceaux (soleil Kaï 8 branches, dragon enroulé…). Gravure or en relief.

#### R2.3 — Bento catalogue
Grille :
- Ligne 1 : **Carte Reprendre géante** (2 cols, cover 2:3 + barre progression) — toujours en premier si progression.
- Ligne 2 : **Rayon « Pour toi »** (rail horizontal 3 cartes SF si tu as lu fantasy).
- Ligne 3 : Grille 2 cols standard.

#### R2.4 — Typo premium
Charger `Newsreader` (titres) + `Figtree` (UI) via `next/font/google` + fallback. Ajouter option OpenDyslexic.

---

### P3 — Rétention & croissance (4-8 semaines, ★★★★★ long terme)

#### R3.1 — Ligue des Lecteurs
Classement hebdo par pages lues, XP, fins découvertes. Or/argent/bronze comme Duolingo League. Pas pay-to-win : seulement lecture.

#### R3.2 — Partage de citation
Sélection texte → « Partager cet extrait » → image parchemin générée (canvas) avec citation + sceau + QR. Viralité Wattpad.

#### R3.3 — Widget & Live Activity
iOS/Android widget : Braise Kaï + « Reprendre §42 ». Live Activity si combat en cours.

#### R3.4 — Mode hors-ligne vrai (Capacitor Mode B)
Quand refacto auth SPA + `output: export` → bundle statique + sync progress Supabase. Indispensable Play Store.

---

## 9. Matrice effort / impact

| Reco | Effort | Impact rétention | Risque |
|------|--------|------------------|--------|
| R0.1 Braise | M | ★★★★★ | Faible |
| R0.2 Bouton or unique | S | ★★★ | Nul |
| R0.3 Suppr. Équipement | S | ★★★ | Nul |
| R0.4 Lecteur sheet | M | ★★★★★ | Moyen |
| R1.1 Play-first | M | ★★★★★ | Moyen (auth) |
| R1.4 Gem SVG | S | ★★ | Nul |
| R2.1 Son/haptics | S | ★★★ | Faible |
| R2.3 Bento | M | ★★★★ | Faible |
| R3.1 Ligue | L | ★★★★★ | Moyen |

---

## 10. Checklist avant release — Ne pas ship sans

- [ ] Un seul or par écran audité (grep `action-link` + `bg-[#dfbb78]`)
- [ ] Tabbar FAB haptics branché
- [ ] Covers servies via `/covers` local ou `next/image` remote optimisée, pas hotlink nu
- [ ] `Button` shadcn et `action-link` unifiés
- [ ] `role=status` sur notifs + `aria-live` sur bourse
- [ ] `enterKeyHint` + `inputMode` sur tous les inputs
- [ ] Skeleton sur catalogue/fiche (pas de flash blanc)
- [ ] Tests 390px sans débordement horizontal (rail hide-scrollbar OK)
- [ ] Lighthouse perf >90, a11y >95

---

## 11. Roadmap 8 semaines proposée

| Semaine | Livrables |
|---------|-----------|
| **S1** | R0.2 (boutons) + R0.3 (boutique 2 onglets) + Gem SVG + typo Newsreader/Figtree |
| **S2** | R0.4 (lecteur sheet) + barre Vie fine + ReaderHUD |
| **S3** | R0.1 Braise Kaï (DB + header flame + notif) + play-first §1-2 guest |
| **S4** | R1.2-1.3 (fiche preview + taverne) + RevenueCat prod hookup |
| **S5** | R2.1 (son/haptics) + R2.2 sceaux SVG + texture parchemin |
| **S6** | R2.3 bento catalogue + rayon « Pour toi » |
| **S7** | R3.2 partage citation + widget braise |
| **S8** | QA 390-430-390 fold + a11y + perf + Play Store screenshots |

---

## 12. KPIs à suivre (PostHog / Supabase)

- **D1 retention** : % revient le lendemain (cible Duolingo 55% → Heros 35% réaliste)
- **Streak moyen** : jours consécutifs (cible 4.2)
- **Taux conversion guest→compte** : après §3 (cible 28%)
- **Pages/session** : paragraphes lus par session (cible 6)
- **Bourse → achat** : % qui achète gemmes après 1 mort (cible 8%)
- **LCP** <2.5s, CLS <0.1

---

## 13. Conclusion — Le fantasme à vendre

Heros ne vend pas des paragraphes. Il vend **la sensation d'être le dernier Kaï qui tourne une page à la lueur d'une bougie pendant que la forêt respire dehors**.

Tout ce qui renforce ce fantasme (parchemin qui bruisse, braise qui vacille, sceau qui brille) = à garder. Tout ce qui le casse (3 boutons or, boutique générique, silence total) = à couper.

> **Prochaine étape** : implémenter R0.1–R0.4 (2 semaines) puis mesurer D1. Le reste suit.

---

*Audit réalisé le 20/09/2026 — branche `arena/01a0c0a0-heros`, Next 16.3.1, 85/85 migrations OK. À relire avec le Benchmark Apps 2026 ci-joint.*
