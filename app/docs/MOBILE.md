# 📱 Packaging Mobile (Capacitor → Android)

> Doc technique · v1.0 · Août 2026

Ce guide décrit comment empaqueter l'application Next.js **HeroBook** en app
Android via **Capacitor**, configurer les permissions et produire un APK/AAB
testable sur smartphone.

---

## 1. État actuel

| Élément | Statut |
|---|---|
| Projet Android natif (`android/`) | ✅ Généré (`cap add android` + `cap sync`) |
| `capacitor.config.ts` | ✅ Configuré (`com.herobook.app` / HeroBook) |
| Mode de connexion | ✅ **Mode A (hébergé)** actif — URL Vercel `https://heros-jade.vercel.app` |
| Permissions Android | ✅ `INTERNET` + `ACCESS_NETWORK_STATE` (voir §6) |
| Scripts npm de build | ✅ Ajoutés (voir §4) |
| Compilation de l'APK ici | ❌ Non possible dans le sandbox (pas de JDK/Android SDK) |
| Décision mode auth | ✅ Trancée : Mode A (voir §2) — Mode B repoussé |

---

## 2. La décision à trancher : comment l'app se connecte à Supabase ?

L'app actuelle est en **Next.js SSR** avec **auth par cookies** (`@supabase/ssr`,
middleware + server components). Une webview Capacitor peut la charger de deux
façons, avec des conséquences différentes sur l'auth.

### Mode A — Hébergé (✅ actif — 1er APK, zéro refactor)

- La webview Capacitor charge **l'app déployée sur Vercel** via `server.url`.
- L'auth par cookies fonctionne **telle quelle** : l'origin est un vrai `https`,
  donc aucun changement de code.
- **Avantages** : APK buildable immédiatement, mise à jour sans relancer l'app
  (le contenu vient du serveur), pas de migration auth.
- **Inconvénients** : nécessite une connexion réseau, pas offline-first, dépend
  du domaine Vercel.

**Mise en œuvre** (faite ✅) :
```ts
// capacitor.config.ts
server: {
  url: "https://heros-jade.vercel.app",  // ← domaine de production Vercel
}
```
```bash
npm run cap:sync          # régénère le projet Android natif
npm run android:apk:debug # ou ouvre Android Studio et Build
```

> 💡 Mise à jour du contenu : en Mode A, quand tu modifies l'app et que Vercel
> redéploie, **l'APK n'a pas besoin d'être recompilé** — la webview charge la
> nouvelle version en ligne. Tu ne rebuildes l'APK que si tu changes la config
> native (permissions, appId, URL, icônes…).

### Mode B — Bundle statique (offline-first, nécessite refactor auth)

- `output: 'export'` dans `next.config.ts` → build statique dans `out/`.
- L'auth doit être migrée vers une **SPA Supabase** (`@supabase/supabase-js`
  côté client) avec **PKCE** + **deep link** vers un schéma custom
  (`com.herobook.app://`).
- **Avantages** : app autonome, fonctionne hors-ligne (contenu embarqué),
  déployable en magasin sans serveur.
- **Inconvénients** : refactor de toute la couche auth + les pages SSR.

**Ce refactor est la phase 3 du plan d'architecture. Tant qu'il n'est pas fait,
l'app ne peut pas produire un build statique `out/` valide.**

> ✅ **Recommandation** : démarrer en **Mode A** pour obtenir un APK testable
> sur smartphone dans la foulée, puis migrer vers le **Mode B** (export statique
> + SPA auth) dans une session dédiée.

---

## 3. Prérequis (environnement local)

Pour compiler l'APK chez toi, il faut :

1. **JDK 17+** (Capacitor 8 / AGP 8.13 l'exigent) — ex. [Temurin 17 ou 21](https://adoptium.net).
2. **Android Studio** (pour le SDK Android et l'émulateur) — installé avec
   le `Android SDK Command-line Tools`, `Platform 36` et `Build-Tools 36`.
3. **Un smartphone Android** en **mode développeur** (ou un émulateur).
4. `ANDROID_HOME` défini si tu construis en CLI :
   ```bash
   export ANDROID_HOME="$HOME/Android/Sdk"
   ```

Vérification rapide :
```bash
java -version        # 17+
echo $ANDROID_HOME   # doit pointer vers le SDK
```

---

## 4. Build de l'APK

> ⚠️ Toutes les commandes se lancent depuis `app/` (racine du projet Next.js).

### 4.1 Sync du web → natif

```bash
npm install
npm run cap:sync
```
`cap:sync` copie le contenu de `out/` (build web) dans le projet Android et
régénère `capacitor.settings.gradle` + `app/capacitor.build.gradle`.

> En **Mode A** (hébergé), le contenu de `out/` n'est pas utilisé au runtime —
> seul `server.url` compte. En **Mode B**, il faut d'abord produire un build
> statique valide dans `out/` (phase 3).

### 4.2 Ouvrir dans Android Studio

```bash
npm run cap:open:android
```
Puis : **Run ▶** sur l'appareil connecté.

### 4.3 APK debug (CLI)

```bash
npm run android:apk:debug
# APK généré : android/app/build/outputs/apk/debug/app-debug.apk
```
Installer sur le téléphone :
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 4.4 Release — AAB (Play Store) & APK signé

```bash
npm run android:bundle:release
# AAB : android/app/build/outputs/bundle/release/app-release.aab
```
L'AAB Play Store doit être **signé** (Play App Signing). Génère un keystore :
```bash
keytool -genkey -v -keystore herobook-upload.jks \
  -alias herobook -keyalg RSA -keysize 2048 -validity 10000
```
Puis configure la signature dans `android/app/build.gradle` (bloc `signingConfigs`)
et utilise **Google Play App Signing** (upload key).

---

## 5. Live Reload sur smartphone (dev)

Pour itérer vite sans reconstruire l'APK à chaque fois, utilise le serveur dev
Next.js + l'URL du réseau local :

1. Récupère l'IP locale de ta machine : `ipconfig getifaddr en0` (macOS) ou
   `ip addr` (Linux).
2. Dans `capacitor.config.ts`, décommente et renseigne :
   ```ts
   server: { url: "http://192.168.X.X:3000", cleartext: true }
   ```
3. `npm run cap:sync && npm run cap:open:android`, puis Run sur le téléphone.
   Le téléphone et la machine doivent être sur le **même réseau WiFi**.
4. Pense à mettre `http://192.168.X.X:3000` dans les **URL d'authentification
   autorisées** Supabase (Auth → URL Configuration) si tu testes la connexion.

---

## 6. Permissions configurées

Fichier : `android/app/src/main/AndroidManifest.xml`

| Permission | Statut | Pourquoi |
|---|---|---|
| `INTERNET` | ✅ Active | Obligatoire (webview + API Supabase) |
| `ACCESS_NETWORK_STATE` | ✅ Active | Gestion connexion / hors-ligne |
| `POST_NOTIFICATIONS` | ⏸️ Commentée | À activer avec la feature Streak/daily reward (Phase 4, Android 13+) |

### Deep link (à activer plus tard)
Le bloc `<intent-filter>` pour le schéma `com.herobook.app` est fourni **en
commentaire** dans le manifest. Il sera nécessaire uniquement pour le **Mode B**
(auth SPA par deep link). Ne pas l'activer tant que l'auth reste par cookies.

---

## 7. Checklist avant publication Google Play

- [ ] Icon 512×512 + Feature Graphic 1024×500 dans `android/app/src/main/res/`
- [ ] Screenshots (min 2, reco 8) téléphone/tablette
- [ ] Descriptions (courte 80 car. / longue 4000 car.)
- [ ] Politique de confidentialité hébergée (RGPD)
- [ ] Data Safety (données Supabase/PostHog déclarées)
- [ ] Questionnaire de contenu IARC/PEGI (public cible enfants → COPPA)
- [ ] Google Play Billing intégré (RevenueCat) — **Phase 3**, pas encore en place
- [ ] App signée (Play App Signing + upload key)
- [ ] `versionCode` / `versionName` incrémentés (`android/app/build.gradle`)

---

## 8. Correspondance roadmap

| Phase roadmap | Contenu | État |
|---|---|---|
| Phase 0 (Setup) | Init Capacitor + projet Android | ✅ Fait (cette session) |
| — | Premier APK testable | ✅ Mode A (hébergé) actif — à builder en local (§4) |
| Phase 3 (Monétisation) | Refactor auth SPA + export statique + RevenueCat | ⏸️ À faire (Mode B) |
| Phase 4 (Polish) | Notifications streak, PWA/Serwist | ⏸️ À faire |
