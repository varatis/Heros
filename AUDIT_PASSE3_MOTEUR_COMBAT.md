# 🔍 Audit passe 3 — « Les Maîtres des Ténèbres » (Loup Solitaire 01)

> Audit indépendant réalisé le 2026-08-21 sur la branche `arena/01a02351-heros`
> (commit de base `0e51b25`, après les migrations 010/011/012 de fidélité).
>
> **Méthode** : ré-extraction *from scratch* des 350 sections du PDF de référence
> (`content/stories/source-pdfs/Loup Solitaire 01 - Les Maitres des Tenebres.pdf`,
> 175 pages, parser indépendant), reconstruction du graphe réel après exécution
> des 12 migrations sur un vrai Postgres (PGlite), comparaison automatisée
> renvoi par renvoi, relecture du moteur (`StoryPlayer.tsx`, `make-choice`,
> `game-setup-action`, `resolve-combat-round`, `_shared/arrival.ts`) et
> **simulation de parties complètes rejouant fidèlement le code de production**.
>
> Périmètre : je n'ai fait **aucune modification de code**. Ceci est un rapport.

---

## 1. Résumé exécutif

### Ce qui va bien (et qu'il faut arrêter de chercher)

La **donnée d'aventure est maintenant saine**. J'ai revérifié indépendamment
les conclusions de l'audit précédent, et elles tiennent :

| Vérification indépendante | Résultat |
|---|---|
| 350/350 sections du PDF présentes et alignées | ✅ |
| Renvois du livre présents en base (choix + hasard + fuite) | ✅ **349/350** — seul écart : §21 (cf. §4.1) |
| Cibles en base absentes du livre (renvois inventés) | ✅ **0** |
| Sections non-fin sans aucune sortie (impasse dure) | ✅ **0** |
| Fins exactement conformes au livre (17 + victoire + 2 système) | ✅ |
| Sections « Table de Hasard » sans `hazard_consequences` | ✅ **0** |
| `npm run test:db` | ✅ 74/74 |
| `npx tsc --noEmit` | ✅ 0 erreur |

**Les 25 fausses fins et les 60 renvois manquants de l'audit précédent sont bien
corrigés.** Le problème n'est plus là.

### 🔴 Le vrai problème aujourd'hui : le moteur de COMBAT

Vous constatez encore « des fins de partie alors que ça ne devrait pas ». La
cause n'est plus la donnée, c'est le **moteur de combat**, qui contient un bug
arithmétique fatal :

> ### ⛔ Aucun combat du jeu ne peut être gagné. Jamais.
>
> Le client renvoie au serveur, **à chaque assaut**, l'ENDURANCE **initiale** de
> l'ennemi (jamais décrémentée). Le serveur calcule
> `nouvelle_END_ennemi = END_reçue − perte_du_round`. L'ennemi **repart donc à
> son score de départ à chaque assaut**.
>
> La perte max infligeable en un round par le moteur actuel est de **5**.
> L'ennemi le plus faible du livre (Vipère des Marais §227) a **6** d'ENDURANCE.
> `6 − 5 = 1 > 0` → l'ennemi ne meurt jamais.
>
> Le joueur, lui, perd **au minimum 2 END par assaut** (plancher de la table
> actuelle, quel que soit le Quotient d'Attaque). Il meurt donc mécaniquement,
> en 10 à 15 assauts, contre **les 38 ennemis du jeu, sans exception**.

**Simulation sur les 29 combats du livre, 3 000 parties chacun, en rejouant le
code de production ligne à ligne : victoire du joueur = 0,0 % — mort = 100,0 %
partout.**

C'est exactement votre symptôme : le joueur joue correctement, tombe sur un
combat (le premier arrive très tôt), tape 10 fois sur « Attaquer » en voyant la
barre de l'ennemi remonter, puis meurt → écran « Dénouement tragique 💀 ».

**Sur une partie complète simulée : 99,7 % de morts, dont 66,8 % au nœud
`mort_epuisement` (mort au combat).** Pour 0,3 % de victoires.

### Hiérarchie des correctifs

| # | Gravité | Problème | Impact |
|---|---|---|---|
| **B1** | 🔴 **Bloquant** | END ennemi jamais décrémentée entre les assauts | **0 % de combats gagnables** |
| **B2** | 🔴 **Bloquant** | La « Table des Coups Portés » est **inventée**, pas celle du livre | Combats 10× trop létaux, contredit le PDF |
| B3 | 🟠 Majeur | Multi-ennemis : END du joueur non re-synchronisée entre 2 ennemis | Sous-estime les dégâts |
| B4 | 🟠 Majeur | Flags de combat (§227/§231/§339) non rechargés côté client | Mauvaise branche après combat |
| B5 | 🟠 Majeur | §17 : hasard + combat sur le même nœud → panneau hasard masqué | Section bloquante après victoire |
| B6 | 🟡 Moyen | §21 : renvoi 312 injoignable (chaîne de hasard mal branchée) | Branche du livre perdue |
| B7 | 🟡 Moyen | Discipline **Guérison** (+1 END/section) jamais implémentée | Discipline « morte » |
| B8 | 🟡 Moyen | Potions non utilisables hors du bouton d'inventaire ; `hp_max` figé | Confort / règles |
| B9 | ⚪ Mineur | Fallback client codé en dur §36, code mort `victoire`/`game_over` | Dette technique |

---

## 2. 🔴 B1 — L'ENDURANCE de l'ennemi n'est jamais décrémentée

### Preuve dans le code

**Client** — `components/story/StoryPlayer.tsx`

`currentEnemy` est posé une seule fois depuis les métadonnées du nœud (l. 405-407) :

```ts
setAllEnemies(combatants);
setCurrentEnemyIndex(0);
setCurrentEnemy(combatants[0]);   // objet figé, jamais muté ensuite
```

À chaque assaut, `enemyPayload()` (l. 790) sérialise cet objet **inchangé** :

```ts
function enemyPayload(e: any) {
  return {
    name: e.name,
    combat_skill: e.combat_skill,
    endurance: e.endurance,     // ⛔ TOUJOURS l'END initiale du livre
    ...
  };
}
```

Et `handleCombatRound` (l. 819-828) l'envoie tel quel, round après round.
**Aucun `setCurrentEnemy({...e, endurance: res.enemy_endurance})` n'existe** :
le champ `res.enemy_endurance` renvoyé par le serveur n'est stocké que dans
`combatResult` (affichage) et **jamais réinjecté dans la requête suivante**.

**Serveur** — `supabase/functions/resolve-combat-round/index.ts` (l. ~247) :

```ts
let newEnemyEndurance = body.enemy.endurance - enemyLoss;   // repart de zéro
```

La fonction est **sans état** : elle ne relit jamais l'END courante de l'ennemi
en base (elle n'est stockée nulle part), elle fait confiance au client.

### Preuve par simulation

Reproduction exacte de la boucle de production (client figé + serveur sans état),
3 000 combats par ennemi, HAB = 10+dé, END = 20+dé :

```
section / ennemi                        END   issue réelle du combat
section_017 / KRAAN                      24   victoire  0.0%  |  mort 100.0%
section_029 / VORDAK                     25   victoire  0.0%  |  mort 100.0%
section_043 / OURS NOIR                  10   victoire  0.0%  |  mort 100.0%
section_055 / GLOK                        9   victoire  0.0%  |  mort 100.0%
section_112 / GLOK                       10   victoire  0.0%  |  mort 100.0%
section_170 / GLUÂTRE DES PROFONDEURS     7   victoire  0.0%  |  mort 100.0%
section_227 / VIPÈRE DES MARAIS           6   victoire  0.0%  |  mort 100.0%
section_255 / GOURGAZ                    30   victoire  0.0%  |  mort 100.0%
...  (29 combats testés, 38 ennemis — même résultat partout)
```

- Perte max infligeable en 1 round par le moteur : **5**
- END minimale d'un ennemi du livre : **6** (Vipère §227)
- ⇒ **aucun ennemi ne peut jamais tomber à 0.**

### Correctif

Deux options, la première étant la plus sûre :

1. **Stateful serveur** (recommandé) : persister l'END courante de l'ennemi
   (colonne `character_stats.combat_state` JSONB, ou table `combat_sessions`).
   Le client n'envoie plus que `current_node_id` + `enemy_index` ; le serveur
   fait autorité. Ça ferme aussi la porte à la triche (aujourd'hui le client
   peut envoyer `endurance: 1`).
2. **A minima** : renvoyer l'END courante au client et la réinjecter —
   `setCurrentEnemy((e) => ({ ...e, endurance: res.enemy_endurance }))` dans
   `handleCombatRound`, plus la même chose dans `handleFlee`. Rapide, mais le
   client reste falsifiable.

---

## 3. 🔴 B2 — La Table des Coups Portés n'est pas celle du livre

### Ce que dit le PDF (règles de combat, p. 20-21)

> « Le Quotient d'Attaque entre le Loup Solitaire et le Diable Volant était de
> **−3**. Admettons que le chiffre donné par la Table de Hasard soit **6**. Le
> résultat du premier assaut sera alors le suivant : le Loup Solitaire perd
> **3** points d'ENDURANCE. Le Diable Volant perd **6** points d'ENDURANCE. »

### Ce que fait le moteur

`resolve-combat-round/index.ts`, quotient −3, jet 6 :

- `COMBAT_TABLE[-3][6]` → le joueur perd **2** (au lieu de 3) ;
- `getEnemyLoss(-3)` → l'ennemi perd **0** (au lieu de 6). 🔴

La table du code est un placeholder. La migration `007` l'avoue d'ailleurs
explicitement en commentaire :

```sql
"note": "Valeurs simplifiées pour MVP - à enrichir avec les vraies valeurs
         de la table officielle (E = enemy loss, LS = player loss)"
-- Note : La vraie Table des Coups Portés complète (avec les valeurs E/LS)
-- sera ajoutée dans une version ultérieure
```

Cette note est restée vraie : la « vraie » table n'a jamais été ajoutée, ni dans
`007`, ni dans `010`/`012`. Le `rule_data.combat_table` stocké en base a
d'ailleurs `"enemy": 0` sur **toutes** ses 210 cellules.

### Écarts structurels avec la table officielle

| Règle du livre | Moteur actuel |
|---|---|
| Colonnes par **bandes** de quotient (`≤−11`, `−10/−9`, … `≥+11`) | 21 colonnes unitaires |
| Le joueur peut perdre **0** END (jets élevés) | plancher codé en dur à **2** |
| Coup fatal **`K` (mort instantanée)** de l'ennemi | non implémenté |
| Pertes ennemi jusqu'à **18+** | plafonnées à **5** |
| Perte ennemi ≈ 8 à quotient 0 / jet 6 | **2** |

Le moteur ajoute aussi des règles maison absentes du livre
(`if (hazardRoll >= 8) enemyLoss += 1`, `if (hazardRoll <= 1) playerLoss += 1`).

### Impact chiffré (table officielle vs moteur actuel, 20 000 combats)

| Ennemi | Moteur actuel* | Table officielle |
|---|---|---|
| GLOK §112 (13/10) | 88,5 % (5,7 assauts) | **99,9 %** (1,7 assaut) |
| Ours Noir §43 (18/24) | 8,6 % (10,5 assauts) | **75,4 %** (4,6 assauts) |
| VORDAK §34 (17/25) | 9,8 % | **80,8 %** |
| GOURGAZ §255 (20/30) | **0,0 %** | **47,9 %** |
| Monstres des cryptes §169 (16/16) | 42,0 % | **96,1 %** |

<sub>\* en corrigeant B1 au préalable — sinon 0 % partout.</sub>

Sur une **partie complète** (choix aléatoires, moteur de production simulé) :

| | Moteur actuel | Avec la table officielle |
|---|---|---|
| Victoire §350 | **0,3 %** | **3,6 %** |
| Mort au combat (`mort_epuisement`) | **66,8 %** | 34,5 % |
| Longueur moyenne | 14 sections | 22 sections |

### Correctif

Remplacer `COMBAT_TABLE` + `getEnemyLoss()` par la vraie table 13 colonnes ×
10 lignes (bandes de quotient, couples `E/LS`, gestion du `K`), et la stocker
comme **source unique** dans `story_rulebooks.rule_data.combat_table` /
`combat_tables.data` — que la Edge Function lirait, au lieu de la dupliquer en
dur. Supprimer les ajustements maison `hazardRoll >= 8 / <= 1`.

---

## 4. 🟠 Bugs majeurs suivants

### 4.1 B6 — §21 : le renvoi 312 est injoignable

Seul écart de topologie détecté sur les 350 sections. Le livre :

- jet < 5 → cheval enlisé ; ≥ 5 → **189**
- puis ≤ 7 → enlisé jusqu'aux aisselles ; > 7 → **189**
- puis 9 → **312** ; tout autre chiffre → mort

En base, la chaîne synthétique est correcte sur les 2 premiers étages, mais
`section_021` déclare `references: [312]` alors qu'aucune de ses sorties ne mène
au 312 : seul `section_021_derniere_chance` y conduit. Le 312 reste atteignable
*via* la chaîne, mais le contrôle de complétude le voit comme manquant. À
trancher : soit corriger la métadonnée `references` du §21 (cosmétique), soit
vérifier que la chaîne est bien parcourue en jeu. **À confirmer par un test
manuel du §21.**

### 4.2 B3 — Multi-ennemis : END du joueur non re-synchronisée

Sur les 7 sections à plusieurs ennemis (§112, 136, 138, 180, 253, 260, 336), au
passage à l'ennemi suivant (l. 874-875) le client ne remet à jour ni
`combatHpStart`, ni ne recharge les stats serveur. `combatHpStart` reste l'END
d'avant le **premier** ennemi → le flag « victoire sans blessure » (§227) et les
calculs de round sont faussés. Il faudrait relire `character_stats` entre deux
ennemis.

### 4.3 B4 — Les flags posés par le combat ne sont pas rechargés

`resolve-combat-round` écrit `combat_sans_degats_227`, `combat_rapide_231`,
`combat_rapide_339` **en base**, mais la réponse JSON **ne contient pas
`narrative_flags`**, et le client ne les recharge pas après la victoire (l. 878-886 :
on sort du mode combat sans refetch des stats).

Or ces trois sections ont **toutes leurs sorties conditionnées** par ces flags
(vérifié : ce sont les seules sections du jeu dans ce cas) :

```
section_227 → 271 si combat_sans_degats_227 = FALSE
            → 348 si combat_sans_degats_227 = TRUE
```

Le client évalue `isChoiceAvailable()` sur un `stats.narrative_flags` périmé.
Comme le flag absent est traité comme `false`, le joueur voit systématiquement la
branche « perdant » (271 = **une vraie mort du livre**) et jamais 348. Après
correction de B1, ce bug deviendra visible immédiatement.

→ Correctif : renvoyer `narrative_flags` dans la réponse de
`resolve-combat-round` et faire `setStats` côté client, ou recharger le nœud.

### 4.4 B5 — §17 : hasard + combat sur le même nœud

`section_017` est le seul nœud qui porte **à la fois** `combatants` et
`hazard_consequences` (le livre : on combat le Kraan, *puis* on tire pour savoir
où l'on redescend : 0 → 53, 1-2 → 274, 3-9 → 331).

Mais le rendu du panneau de hasard est conditionné par `!isCombatMode`
(l. 1517), et `isCombatMode` n'est remis à `false` qu'après la victoire — sans
recharger le nœud. Le joueur gagne le combat, le panneau de combat disparaît…
et il se retrouve sur une section **sans bouton de dé et sans choix** (le §17
n'a aucun `story_choices`). **Blocage complet**, sans écran de fin.

Là encore, ce bug est aujourd'hui masqué par B1 (on ne gagne jamais le combat) :
**corriger B1 sans corriger B5 rendra le §17 bloquant.** À traiter dans la même
passe.

---

## 5. 🟡 Règles du livre encore absentes

### B7 — Discipline Guérison

Le livre : « le Loup Solitaire regagne **1 point d'ENDURANCE par section**
traversée sans combat ». L'UI l'annonce au joueur
(`StoryPlayer.tsx` l. 1265 : « Récupérer 1 END par paragraphe sans combat »),
mais `grep -rn "guerison" supabase/functions/` ne remonte **que** l'objet
« Potion de Guérison ». La discipline n'a **aucun effet en jeu**.

C'est la discipline la plus prise par les joueurs, et son absence aggrave
sensiblement la létalité constatée.

→ À implémenter dans `_shared/arrival.ts` (`applyArrivalEffects`) : +1 END si
le flag `discipline_guerison` est posé et que le nœud d'arrivée n'a pas de
`combatants`, plafonné à `hp_max`.

### B8 — Potions et `hp_max`

- La **Potion de Guérison** (+4 END) et le **Laumspur** (+3 END) sont bien en
  inventaire et consommables via `apply-item-effect`, mais le livre précise que
  la Potion se boit **après un combat** — aucune restriction n'est appliquée
  (mineur, plutôt permissif).
- `hp_max` n'est jamais modifié après l'initialisation : conforme au livre
  (l'ENDURANCE de départ est le plafond), ✅ rien à faire.

### B9 — Dette technique

- `StoryPlayer.tsx` l. 575-600 : **fallback local codé en dur pour le §36**
  (détection par la chaîne « vieille tour de guet »), devenu inutile depuis que
  `hazard_consequences` est généralisé. À supprimer : il peut diverger du serveur.
- l. 1220-1225 : `isEnding` teste encore `node_key === "victoire" | "game_over"`,
  clés inexistantes dans cette histoire — code mort.
- l. 1246-1248 : le détecteur textuel de hasard (`content.includes("Utilisez la
  Table de Hasard…")`) est conservé « pour compatibilité » alors que les 21
  sections concernées ont toutes leurs métadonnées. Il peut activer un panneau
  de dé sur une section qui n'en a pas la logique. À retirer.
- `readingProgress` (l. 1249) se base sur `pageNumber`, incrémenté même sur les
  allers-retours → progression trompeuse.

---

## 6. Pourquoi la suite de tests ne voit rien

`npm run test:db` passe **74/74**, et pourtant le jeu est injouable. Les
74 assertions valident **exclusivement le contenu SQL** (topologie, fins,
renvois, métadonnées). **Aucune n'exécute le moteur** : ni la Table des Coups
Portés, ni la boucle de combat, ni le cycle client↔serveur.

Le bug B1 vit précisément dans le contrat entre `StoryPlayer.tsx` et
`resolve-combat-round` — la seule zone que les tests ne couvrent pas.

### Assertions recommandées

1. **Test unitaire de la table de combat** : `(quotient −3, jet 6)` ⇒
   `{ player: 3, enemy: 6 }` — l'exemple du livre, en dur.
2. **Test d'intégration de combat** : simuler N assauts contre la Vipère §227
   (END 6) et vérifier qu'elle **meurt** ; asserter `victoire > 0 %` pour chacun
   des 38 ennemis.
3. **Test de non-régression d'état** : deux appels successifs à
   `resolve-combat-round` doivent faire **décroître** l'END de l'ennemi.
4. **Test de bout en bout** : 10 000 parties aléatoires ⇒ taux de victoire dans
   une fourchette plausible (2-10 %) et **0 blocage** (section sans sortie
   jouable), ce qui aurait attrapé B5.
5. **Test des flags de combat** : après victoire au §227 sans dégât, la sortie
   →348 doit être disponible.

---

## 7. Plan de correction proposé (par ordre d'impact)

1. **B1 — rendre le combat stateful** *(bloquant, 0 % → jouable)*
   Persister l'END de l'ennemi côté serveur ; le client cesse de l'envoyer.
2. **B2 — installer la vraie Table des Coups Portés** *(bloquant, fidélité)*
   13 bandes × 10 jets, couples E/LS, `K` = mort instantanée, plancher joueur à
   0 ; source unique en base, lue par la Edge Function.
3. **B5 + B4 + B3 — séquelles de combat** *(à faire dans la même passe, sinon
   B1 découvre de nouveaux blocages)*
   §17 hasard-après-combat, rechargement des `narrative_flags`, resync entre
   deux ennemis.
4. **B7 — discipline Guérison** dans `applyArrivalEffects`.
5. **B6 — métadonnée `references` du §21.**
6. **B9 — nettoyage** (fallback §36, code mort, détecteur textuel).
7. **Tests** — ajouter les 5 assertions du §6, en particulier les tests
   *moteur* qui manquent totalement aujourd'hui.

Après B1 + B2 + B7, la simulation prédit un taux de victoire de l'ordre de
**4-6 %** en jeu aléatoire, cohérent avec un livre-jeu où « de nombreux chemins
mènent au Palais du Roi, mais seul l'un d'eux vous fera courir un minimum de
risques ».

---

## Annexe — Reproductibilité

Tous les chiffres de ce rapport sont issus de scripts d'analyse rejouant le code
de production (table de combat transcrite depuis `resolve-combat-round/index.ts`,
boucle client transcrite depuis `StoryPlayer.tsx`, graphe dumpé après exécution
réelle des 12 migrations sur PGlite). Ils n'ont pas été commités pour ne pas
polluer le dépôt ; je peux les ajouter sous `app/scripts/` s'ils doivent devenir
des tests permanents (recommandé pour les points 1-3 du §6).

Commandes de vérification exécutées :

```bash
cd app
npm run test:db      # 74/74 ✅
npx tsc --noEmit     # 0 erreur ✅
```

---

## 8. ✅ Correctifs appliqués *(21/08/2026)*

Tous les points du §7 ont été traités. `npm test` = **128 assertions**, `tsc --noEmit` = 0 erreur, `next build` OK.

### 8.1 🔴 B1 — Combat rendu *stateful* (le bug bloquant)

L'ENDURANCE des ennemis est désormais **persistée côté serveur** dans la
nouvelle colonne `character_stats.combat_state` (migration 013) :

| Avant | Après |
|---|---|
| Le client renvoyait `enemy.endurance` (valeur **initiale**) à chaque assaut | Le client n'envoie plus que `{ story_id, current_node_id, escape? }` |
| `newEnemyEndurance = body.enemy.endurance − perte` (repart de zéro) | Le serveur charge l'état, décrémente, et le réécrit |
| Fonction sans état, client falsifiable | Serveur seule autorité — la triche par l'END est fermée |

Effet de bord corrigé au passage : `combat_state` est **purgé** quand on
change de section (`make-choice`), quand on fuit, et quand un jet de
Hasard déplace le joueur — sinon on retrouverait des ennemis à moitié
morts en repassant sur une section.

### 8.2 🔴 B2 — La vraie « Table des coups portés »

La table imprimée à la fin du livre a été **extraite du PDF** (image de la
dernière page) et transcrite dans un module partagé
`supabase/functions/_shared/combat-table.ts` : 13 bandes de Quotient × 10
chiffres, couples `E`/`LS`, et le **« T » (tué sur le coup)** qui
n'existait pas.

Elle est aussi écrite en base (`rule_data.combat_table`, `combat_tables`)
et un test vérifie que **la base et le moteur disent la même chose**.

Validation par l'exemple du livre lui-même (règles p. 20-21) :
`Quotient −3, chiffre 6 → LS −3 / E −6` ✅ (le moteur répondait `LS −2 / E −0`).

Supprimés : le placeholder MVP, `getEnemyLoss()`, et les ajustements
maison `hazardRoll >= 8 / <= 1` absents du livre.

### 8.3 🟠 B3/B4/B5 — Séquelles de combat

| Bug | Correctif |
|---|---|
| **B3** multi-ennemis | Le serveur gère la file d'ennemis et renvoie l'état complet (`enemies[]`, `enemy_index`) ; le client n'a plus à le deviner. `hp_at_start` est fixé une fois pour tout le combat. |
| **B4** flags non rechargés | `resolve-combat-round` renvoie `narrative_flags` ; le client les applique. §227/§231/§339 ouvrent enfin la bonne branche (avant : toujours §271, une vraie mort). |
| **B5** §17 bloquant | `hazard_after_combat` posé sur le §17 + rechargement de la section après victoire : le dé s'affiche une fois le Kraan vaincu, au lieu d'une section sans issue. |

### 8.4 🟡 B6/B7/B8/B9

- **B7 — Guérison** : implémentée dans `_shared/arrival.ts` (+1 END par
  section sans combat, plafonné à l'ENDURANCE initiale). Elle profite aux
  trois chemins (choix, hasard, fuite). La discipline était annoncée dans
  l'UI et n'avait **aucun effet**.
- **B6 — §21** : `references` alignée sur la chaîne d'enlisement réelle.
- **B9 — dette** : suppression du fallback §36 codé en dur (qui pouvait
  diverger du serveur) et du détecteur de hasard par texte, remplacé par
  les seules métadonnées.
- **B8** : les potions (Guérison +4, Laumspur +3) sont bien consommables
  via l'inventaire ; vérifié, rien à corriger.

### 8.5 🧪 Tests — le trou de couverture est comblé

Le bug B1 vivait dans le **contrat client↔serveur**, la seule zone que les
74 tests SQL ne touchaient pas. Trois suites désormais, câblées dans
`npm test` **et dans la CI** :

| Suite | Assertions | Ce qu'elle garantit |
|---|---|---|
| `test:db` | 74 | Contenu SQL (inchangé) |
| `test:combat` | **41** | Table des coups portés (dont l'exemple du livre), « T », monotonie, décroissance de l'END ennemie, **les 28 sections de combat sont gagnables**, schéma 013, et 10 assertions de **contrat client/serveur** |
| `test:play` | **13** | **6 000 parties complètes** : 0 blocage, 0 impasse, 0 boucle, victoire atteignable ; robustesse **sans aucune discipline**, avec **chaque discipline seule**, avec **toutes** ; accessibilité du graphe ; plages de hasard 0-9 exhaustives |

Correctif de fond sur l'harnais : `test-migrations.mjs` chargeait une
**liste de migrations codée en dur** — la 013 n'aurait pas été testée.
Les migrations sont maintenant découvertes automatiquement.

### 8.6 Résultat mesuré

| Métrique (6 000 parties, choix aléatoires) | Avant | Après |
|---|---|---|
| Combats gagnables | **0 / 38** | **38 / 38** |
| Victoire §350 | 0,3 % | **5,5 %** |
| Mort au combat (`mort_epuisement`) | 66,8 % | **25,7 %** |
| Blocages / impasses / fins injustifiées | nombreux | **0** |
| Fins distinctes atteintes | — | 18 |

Le §255 (GOURGAZ, HAB 20 / END 30 — le combat le plus dur du livre) reste
exigeant sans être impossible : ~59 % de victoire pour un héros moyen.

### 8.7 Déploiement

```bash
cd app
supabase db push                                   # migration 013
supabase functions deploy resolve-combat-round     # v3 stateful
supabase functions deploy make-choice
supabase functions deploy game-setup-action
# puis déploiement du front (Vercel)
```

⚠️ `resolve-combat-round` **change de contrat** (le client n'envoie plus
l'ennemi) : déployer la fonction **et** le front ensemble. Les parties en
cours reprennent normalement (`combat_state` NULL = combat réinitialisé à
l'entrée de la section).
