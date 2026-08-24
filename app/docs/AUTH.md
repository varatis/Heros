# 🔐 Authentification HeroBook — flux, réglages et incidents

> Doc technique · v1.0 · Août 2026
> App : livre dont vous êtes le héros — Next.js + Supabase + Capacitor (Android)

Cette doc décrit les **4 flux d'authentification**, les **réglages Supabase
requis** pour qu'ils fonctionnent, et le **dépannage** des incidents connus
(notamment « on reste sur un compte invité fantôme »).

---

## 1. Les 4 flux

| Flux | Déclencheur | Comportement attendu |
|---|---|---|
| **Invité** | « Jouer en invité » sur `/login` | `signInAnonymously()` → user `is_anonymous = true`, profil + wallet créés par le trigger `handle_new_user`. Progression volatile. |
| **Inscription** | `/register` sans session | `signUp()` → si le projet exige une confirmation d'email, **aucune session n'est créée** : écran « Confirmez votre email » (renvoi possible). Sinon → onboarding → catalogue. |
| **Conversion invité → compte** | `/register` avec session anonyme | 1. `updateUser({ email })` lie l'email à l'utilisateur invité (même UUID, même wallet) → 2. confirmation de l'email (si exigée) → 3. `updateUser({ password })`. Le compte devient permanent **sans perdre gemmes/progression**. |
| **Connexion** | `/login` | Si une session invité est active, elle est **fermée d'abord** (voir §4), puis `signInWithPassword`. |
| **OAuth (Google, Microsoft, Apple, GitHub…)** | Boutons « Continuer avec… » sur `/login` / `/register` | `signInWithOAuth` → redirection vers le provider → `/auth/callback` échange le code PKCE → session. Nouveau compte → onboarding ; compte existant → catalogue ; **invité actif → conversion** (l'identité est liée au user anonyme, progression conservée). |

---

## 2. Réglages Supabase requis (Dashboard → Authentication)

| Réglage | Emplacement | Valeur requise | Pourquoi |
|---|---|---|---|
| Anonymous sign-ins | Auth → Sign In / Providers | ✅ **Activé** | Le mode invité dépend de `signInAnonymously()`. |
| **Manual linking** | Auth → Sign In / Providers | ✅ **Activé (bêta)** | Obligatoire pour convertir un invité en compte permanent (`updateUser({ email })` sur un user anonyme). Sans lui, l'erreur est `Manual linking is disabled`. |
| Email provider | Auth → Sign In / Providers → Email | ✅ Activé | Inscription par email/mot de passe. |
| Confirm email | Auth → Sign In / Providers → Email | Au choix | **Activé** : l'app gère l'écran « Confirmez votre email » (inscription ET conversion). **Désactivé** : autoconfirm, les flux vont directement au mot de passe. Les deux configs sont supportées par le code. |
| Site URL | Auth → URL Configuration | `https://heros-jade.vercel.app` | Les liens de confirmation d'email sont générés à partir de cette URL. |
| Redirect URLs | Auth → URL Configuration | + `https://heros-jade.vercel.app/auth/callback` (+ `http://localhost:3000/auth/callback` en dev) | Obligatoire pour le retour OAuth et les liens de confirmation. |
| Fournisseurs OAuth | Auth → Sign In / Providers | Ceux voulus (voir §10) | Google, Microsoft (Azure), Apple, GitHub… |

> ⚠️ Après tout changement de réglage, re-tester les 4 flux (navigateur privé
> + mode invité d'abord, car la conversion est le flux le plus sensible).

---

## 3. Pourquoi la conversion se fait en 3 étapes ?

Règles GoTrue (Supabase) à respecter :

1. **Manual linking doit être activé** pour lier une identité à un utilisateur
   anonyme — sinon `updateUser({ email })` renvoie `Manual linking is disabled`.
2. **L'email doit être confirmé avant de pouvoir définir un mot de passe** sur
   un utilisateur anonyme (doc officielle « auth-anonymous »). Un appel unique
   `updateUser({ email, password })` ne fonctionne donc pas de façon fiable
   quand « Confirm email » est activé.
3. Un email déjà utilisé par un **autre** compte ne peut pas être lié à
   l'invité : l'app l'explique et renvoie vers `/login`.

L'implémentation (`app/app/register/page.tsx`) suit donc :
`updateUser({ email })` → confirmation (écran dédié + renvoi) →
`updateUser({ password })`.

---

## 4. Pourquoi le login ferme-t-il la session invité d'abord ?

Depuis GoTrue v2.165, un `signInWithPassword` effectué **avec une session
anonyme active** déclenche la liaison d'identité : GoTrue tente de rattacher
l'email du compte existant à l'utilisateur anonyme, ce qui produit :

- `Identity is already linked to another user`, ou
- pire : le compte invité est **promu** avec l'identité du vrai compte et
  l'utilisateur se retrouve sur l'UUID invité (perte apparente de wallet,
  progression, achats) — le « compte invité fantôme ».

`app/app/login/page.tsx` détecte la session anonyme et appelle `signOut()`
**avant** `signInWithPassword`, avec un bandeau d'avertissement (la progression
invité est abandonnée ; le bouton propose d'aller la sécuriser via `/register`).

---

## 5. Déconnexion (`app/api/auth/signout/route.ts`)

- Invalide la session côté GoTrue (erreur ignorée).
- Redirige en **303** (un 307 conserverait le POST → 405 sur `/login`).
- Supprime explicitement tous les cookies `sb-*` / `*-auth-token`, pour
  qu'aucune session anonyme « fantôme » ne survive au logout.

---

## 6. Comptes invités orphelins — nettoyage

Un `signInAnonymously` crée une vraie ligne dans `auth.users` (+ profil et
wallet via le trigger). Désormais deux mécanismes empêchent l'accumulation de
« comptes fantômes » :

1. **Purge automatique à la déconnexion** (migration 016) : la route
   `/api/auth/signout` appelle la RPC `purge_anonymous_user()` qui supprime
   l'utilisateur appelant **s'il est anonyme** (garde-fou SQL : un compte
   permanent ne peut jamais être touché). Les FK `ON DELETE CASCADE` purgent
   profil, wallet, inventaire, progression, succès et transactions.
2. **Auto-réparation des comptes incomplets** (migration 016) : la RPC
   `ensure_profile_and_wallet()` (re)crée profil + wallet manquants de
   l'appelant. Elle est appelée côté serveur par le layout `(main)` à chaque
   page, et côté client par l'onboarding avant l'écriture du profil. Fini
   les « héros fabriqués » affichés avec des valeurs par défaut.

⚠️ Ces deux RPC nécessitent que la migration 016 soit déployée sur le projet
(voir §9). Sans elle, l'app continue de fonctionner en dégradation douce.

Pour nettoyer les invités orphelins **historiques** — SQL Editor (Supabase) :

```sql
-- 1. Voir les comptes anonymes existants
select id, email, created_at, last_sign_in_at
from auth.users
where is_anonymous is true
order by created_at desc;

-- 2. Supprimer les invités de plus de 30 jours
--    (la suppression en cascade purge profil, wallet, inventaire, etc.)
delete from auth.users
where is_anonymous is true
  and created_at < now() - interval '30 days';
```

> ⚠️ Ne jamais supprimer un invité **récent** : c'est peut-être un joueur
> actif qui n'a pas encore converti sa session.

---

## 7. Dépannage rapide

| Symptôme | Cause probable | Action |
|---|---|---|
| **200 OK sur `/auth/v1/resend` mais aucun email reçu** | Provider email par défaut de Supabase : il n'envoie qu'aux **membres de l'organisation du projet** (2 emails/h max). Un email perso de test est **silencieusement ignoré**. | Configurer un SMTP custom (voir §8). Vérifier Authentication → Logs. |
| **Page personnage avec « Héros Légendaire », stats 10/5/5, 0 gemme alors que rien en BDD** | Compte « fantôme » : l'utilisateur auth existe mais pas ses lignes profil/wallet (trigger absent à l'époque, ou lignes purgées). | Déployer la migration 016 : le layout auto-répare via `ensure_profile_and_wallet()`. |
| « Manual linking is disabled » à l'inscription d'un invité | Manual linking désactivé | Dashboard → Auth → Providers → activer Manual linking |
| « Identity is already linked to another user » au login | Session invité active pendant le login (ancien code) | Corrigé par le signOut préalable — mettre à jour le front |
| Retour au login juste après l'inscription | « Confirm email » activé et l'app redirigeait vers l'onboarding sans session | Corrigé — écran « Confirmez votre email » |
| On retombe sur « Invité » après un login | Ancienne session anonyme encore en cookies | Déconnexion propre (route 303 + purge cookies) — vider le site et se reconnecter |
| Lien de confirmation pointe au mauvais endroit | Site URL non configurée | Auth → URL Configuration → Site URL = URL Vercel de prod |

---

## 8. Emails de confirmation — pourquoi ils n'arrivent pas, et comment réparer

### Le piège du provider par défaut

Le service email intégré de Supabase est **réservé à la démo** :

- ❌ Il n'envoie qu'aux **adresses des membres de l'organisation du projet**
  (pas à tes joueurs, ni à un email de test perso).
- ❌ Limite de **2 emails par heure** (toutes catégories : confirmation,
  changement d'email, reset de mot de passe).
- ❌ Aucune garantie de délivrabilité.

Conséquence : l'API `/auth/v1/resend` (comme `/signup`) répond **200 OK**
(la requête est acceptée) **sans envoyer quoi que ce soit** — exactement le
symptôme « 200 mais pas de mail ». Ce n'est PAS un bug de l'app.

### La vraie solution : un SMTP custom (~10 min)

Recommended : **Resend** (gratuit : 100 emails/jour, 3 000/mois, excellente
délivrabilité). N'importe quel SMTP fonctionne aussi (Brevo, SendGrid,
Mailgun, SES…).

1. Créer un compte sur [resend.com](https://resend.com) → **API Keys** →
   créer une clé (`re_…`).
2. Domaine : soit ajouter ton domaine (vérification DNS SPF/DKIM), soit,
   pour tester, utiliser l'expéditeur d'onboarding fourni
   (`onboarding@resend.dev`) — valable uniquement pour **ton propre email**.
3. Dashboard Supabase → **Authentication → Email Templates → SMTP Settings**
   (l'emplacement a bougé selon les versions du dashboard : chercher
   « SMTP ») :
   - Enable custom SMTP : ✅
   - Host : `smtp.resend.com`
   - Port : `465` (SSL) ou `587` (STARTTLS)
   - Username : `resend`
   - Password : la clé API `re_…`
   - Sender name : `HeroBook`
   - Sender email : `HeroBook <noreply@<ton-domaine>>` (ou `onboarding@resend.dev` pour tester)
4. Sauvegarder, puis tester : inscription sur l'app → l'email doit arriver
   (vérifier aussi les spams la première fois).

> Vérif ensuite dans **Authentication → Logs** : on doit voir les tentatives
> d'envoi et leurs erreurs. Une fois remis à ton SMTP, Supabase n'a plus la
> main sur la délivrance — en cas de souci, regarder les logs de livraison
> côté Resend/Brevo/… (onglet « Emails »).

### Raccourci dev (en attendant le SMTP)

Pour tester les flux sans email du tout : **Authentication → Email →
désactiver « Confirm email »**. `signUp` renvoie alors une session
immédiatement (pas d'écran de confirmation) et la conversion invité→compte
saute l'étape email. L'app gère les deux configurations automatiquement.
⚠️ À réactiver + configurer le SMTP avant toute ouverture aux vrais joueurs.

---

## 9. Déployer la migration 016 (comptes fantômes)

Deux options, au choix :

**A. CLI Supabase** (depuis `app/`) :

```bash
supabase link --project-ref ulsspeaijxmwluiipxby
supabase db push
```

**B. SQL Editor** (Dashboard → SQL Editor) : coller le contenu de
`app/supabase/migrations/016_account_self_heal_and_guest_purge.sql` et
l'exécuter tel quel (les fonctions sont `CREATE OR REPLACE`, donc
ré-exécutables sans risque).

Le déploiement est **sans risque** : l'app appelle les RPC dans des
try/catch — avant déploiement elle dégrade doucement, après déploiement
l'auto-réparation et la purge des invités s'activent d'elles-mêmes.

---

## 10. Connexion OAuth — Google, Microsoft, Apple, GitHub…

### Côté app (déjà en place)

- `components/auth/OAuthButtons.tsx` : boutons « Continuer avec… » sur
  `/login` et `/register`. Un bouton ne s'affiche que si son id est listé
  dans `NEXT_PUBLIC_AUTH_PROVIDERS` (par défaut `google,azure,apple,github`).
- `app/auth/callback/route.ts` : échange du code PKCE + gestion des liens de
  confirmation d'email (`token_hash`). Nouveau compte → onboarding ; invité
  actif → conversion automatique (identité liée au user anonyme, progression
  conservée — requiert **Manual linking**, voir §2).
- `app/proxy.ts` : `/auth/callback` est public.

### Côté dashboard Supabase + fournisseurs

**Callback Supabase commun à tous les providers :**
`https://ulsspeaijxmwluiipxby.supabase.co/auth/v1/callback`

1. **Google (Gmail)** — le plus important :
   - [console.cloud.google.com](https://console.cloud.google.com) → projet →
     **APIs & Services → OAuth consent screen** (type Externe, publier en
     production) → **Credentials → Create OAuth client** (type Web).
   - *Authorized redirect URI* : le callback Supabase ci-dessus.
   - Dashboard Supabase → Auth → Providers → **Google** : coller le Client ID
     et le Client Secret. ✅
2. **Microsoft (Outlook/Hotmail)** — id Supabase `azure` :
   - [entra.microsoft.com](https://entra.microsoft.com) → App registrations →
     New registration → *Redirect URI : Web* = callback Supabase ci-dessus.
   - Auth → Providers → **Azure** : coller le Client ID (Application/client ID)
     et le Secret. ✅
3. **Apple (iCloud)** — demande un compte Apple Developer payant (App ID +
   Services ID + clé privée) ; config dans Auth → Providers → Apple.
   Peut attendre.
4. **GitHub** — GitHub → Settings → Developer settings → OAuth App,
   *Authorization callback URL* = callback Supabase ci-dessus.

Puis **Auth → URL Configuration → Redirect URLs** : ajouter
`https://heros-jade.vercel.app/auth/callback` (retour vers l'app).

### ⚠️ Limite Android (Capacitor)

Google **refuse l'OAuth dans les WebViews embarquées** (« disallowed_useragent »).
Sur l'app Android actuelle (WebView Capacitor), le bouton Google échouera :
prévoir le plugin `@codetrix-studio/capacitor-google-auth` (ou équivalent)
avant la sortie mobile. Sur navigateur web, tout fonctionne tel quel.

### Email/mot de passe : tous les domaines acceptés

Avec le SMTP custom (Resend — §8), l'inscription email/mot de passe accepte
**tous les fournisseurs** (gmail.com, outlook.com, yahoo, proton, iCloud,
domaines pro…). Seul le provider par défaut de Supabase restreignait aux
membres de l'organisation.

Pour que le lien de confirmation arrive dans l'app (et pas sur la racine) :
Auth → Email Templates → « Confirm signup » et « Confirm email change »,
remplacer le lien par :

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup&next=/onboarding">Confirmer</a>
```

et, pour le changement d'email (conversion invité) :

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email_change&next=/register">Confirmer</a>
```

> La personnalisation des templates nécessite le SMTP custom (Resend).

### À faire plus tard (hors scope de cette session)

- Page « Mot de passe oublié » (`resetPasswordForEmail` → lien recovery →
  page de choix d'un nouveau mot de passe) — le callback accepte déjà
  `type=recovery`, il ne manque que la page.
- OAuth Google natif pour l'APK Capacitor (plugin + deep link).

---

## 11. Parcours invité — UX (session du 24 août)

Le mode invité est un **parcours d'exploration**, pas un mur :

- **Accès libre** : les livres gratuits sont entièrement jouables en invité
  (la RLS n'exclut pas `is_anonymous` ; seuls les livres payants demandent
  le déverrouillage).
- **Profil accessible** : l'avatar et l'onglet « Héros » mènent à la page
  personnage (pas de renvoi vers /login ou /register). Un bandeau
  « Mode invité » y explique la règle : *rien n'est sauvegardé durablement,
  la progression est liée au navigateur et effacée à la déconnexion* —
  avec un CTA « Créer un compte » (idem en compact sur le catalogue et en
  version complète sur la boutique).
- **Explication à l'entrée** : le bouton « Jouer en invité » (login) est
  accompagné de « Mode exploration : rien n'est sauvegardé… », et
  l'onboarding affiche « héros temporaire » aux invités.
- **Déconnexion transparente** : un invité qui se déconnecte est prévenu
  (confirmation), purgé de la base (migration 016) et renvoyé vers
  `/login?guest=closed` — la page de login affiche alors un message clair
  (« progression effacée, créez un compte pour la conserver ») au lieu
  d'un mur silencieux.
- **Conversion à tout moment** : bandeau invité + pastille « Créer un
  compte » dans la TopBar → `/register` (conversion en 3 étapes, §3).
