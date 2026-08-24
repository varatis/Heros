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

---

## 2. Réglages Supabase requis (Dashboard → Authentication)

| Réglage | Emplacement | Valeur requise | Pourquoi |
|---|---|---|---|
| Anonymous sign-ins | Auth → Sign In / Providers | ✅ **Activé** | Le mode invité dépend de `signInAnonymously()`. |
| **Manual linking** | Auth → Sign In / Providers | ✅ **Activé (bêta)** | Obligatoire pour convertir un invité en compte permanent (`updateUser({ email })` sur un user anonyme). Sans lui, l'erreur est `Manual linking is disabled`. |
| Email provider | Auth → Sign In / Providers → Email | ✅ Activé | Inscription par email/mot de passe. |
| Confirm email | Auth → Sign In / Providers → Email | Au choix | **Activé** : l'app gère l'écran « Confirmez votre email » (inscription ET conversion). **Désactivé** : autoconfirm, les flux vont directement au mot de passe. Les deux configs sont supportées par le code. |
| Site URL | Auth → URL Configuration | `https://heros-jade.vercel.app` | Les liens de confirmation d'email sont générés à partir de cette URL. |
| Redirect URLs | Auth → URL Configuration | + l'URL Vercel (et celle de prod le cas échéant) | Nécessaire pour les liens de confirmation / magic links. |

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
wallet via le trigger). Après une déconnexion ou un abandon, ces lignes
**subsistent par conception** (Supabase ne propose pas de purge automatique).

Pour nettoyer les invités inactifs — SQL Editor (Supabase) :

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
| « Manual linking is disabled » à l'inscription d'un invité | Manual linking désactivé | Dashboard → Auth → Providers → activer Manual linking |
| « Identity is already linked to another user » au login | Session invité active pendant le login (ancien code) | Corrigé par le signOut préalable — mettre à jour le front |
| Retour au login juste après l'inscription | « Confirm email » activé et l'app redirigeait vers l'onboarding sans session | Corrigé — écran « Confirmez votre email » |
| On retombe sur « Invité » après un login | Ancienne session anonyme encore en cookies | Déconnexion propre (route 303 + purge cookies) — vider le site et se reconnecter |
| Lien de confirmation pointe au mauvais endroit | Site URL non configurée | Auth → URL Configuration → Site URL = URL Vercel de prod |
