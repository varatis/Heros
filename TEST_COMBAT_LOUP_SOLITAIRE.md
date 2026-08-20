# 🧪 Script de test – Moteur de combat Loup Solitaire

## 1. Prérequis

1. Exécute la migration `007_loup_solitaire_combat_engine.sql` sur Supabase
2. Déploie la Edge Function `resolve-combat-round`
3. Lance l’application en local ou via Vercel Preview

---

## 2. Vérifications SQL (à exécuter dans Supabase SQL Editor)

```sql
-- 1. Vérifier que la table de combat existe
SELECT name, version 
FROM combat_tables 
WHERE story_id = (
  SELECT id FROM stories WHERE slug = 'les-maitres-des-tenebres'
);

-- 2. Vérifier que la Table des Coups Portés est bien dans le rulebook
SELECT 
  jsonb_pretty(rule_data->'combat_table') 
FROM story_rulebooks 
WHERE story_id = (
  SELECT id FROM stories WHERE slug = 'les-maitres-des-tenebres'
);

-- 3. Vérifier qu’il existe au moins une section avec des combatants
SELECT 
  node_key, 
  title, 
  metadata->'combatants' as enemies
FROM story_nodes 
WHERE story_id = (
  SELECT id FROM stories WHERE slug = 'les-maitres-des-tenebres'
)
AND metadata->'combatants' IS NOT NULL
LIMIT 5;
```

**Résultat attendu** : Au moins la section `section_043` avec l’Ours Noir.

---

## 3. Script Console Navigateur (le plus pratique)

Ouvre la page de jeu (`/story/[id]/play`) et colle ce script dans la **Console DevTools** (`F12` → Console).

```js
// ==============================================
// TEST COMBAT LOUP SOLITAIRE - Script Console
// ==============================================

async function testCombat() {
  console.log('%c[TEST] Démarrage du test de combat...', 'color:#f59e0b');

  // Récupère le contexte React (StoryPlayer)
  const reactRoot = document.querySelector('#__next');
  if (!reactRoot) {
    console.error('React root non trouvé');
    return;
  }

  // Force un état de combat (simulation)
  const storyPlayer = window.__STORY_PLAYER__ || null;

  if (!storyPlayer) {
    console.log('%c[INFO] Pour un test réel, joue jusqu\'à la section 43 (Ours Noir)', 'color:#64748b');
    console.log('%c[INFO] Ou force manuellement un node avec combatants', 'color:#64748b');
    return;
  }

  // Test direct de l'Edge Function
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Utilisateur non connecté');
      return;
    }

    const storyId = 'TON_STORY_ID'; // Remplace par l'ID réel

    const response = await fetch(
      `${window.location.origin}/api/supabase/functions/resolve-combat-round`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          story_id: storyId,
          enemy: {
            name: 'OURS NOIR',
            combat_skill: 16,
            endurance: 10,
          },
          enemy_index: 0,
          total_enemies: 1,
        }),
      }
    );

    const result = await response.json();
    console.log('%c[RESULTAT COMBAT]', 'color:#22c55e', result);
  } catch (err) {
    console.error('Erreur test combat:', err);
  }
}

// Lance le test
testCombat();
```

---

## 4. Test manuel rapide (recommandé)

### Étape 1 : Aller directement sur un combat

1. Connecte-toi
2. Lance **Les Maîtres des Ténèbres**
3. Dans Supabase, force ta progression sur la section 43 :

```sql
UPDATE user_story_progress
SET current_node_id = (
  SELECT id FROM story_nodes 
  WHERE story_id = (SELECT id FROM stories WHERE slug = 'les-maitres-des-tenebres')
    AND node_key = 'section_043'
)
WHERE user_id = 'TON_USER_ID'
  AND story_id = (SELECT id FROM stories WHERE slug = 'les-maitres-des-tenebres');
```

### Étape 2 : Vérifier le panneau de combat

Tu devrais voir :
- Le panneau rouge **"COMBAT EN COURS"**
- **OURS NOIR** – HAB 16 / END 10
- Boutons **Attaquer** et **Fuir**

### Étape 3 : Lancer plusieurs rounds

Clique plusieurs fois sur **Attaquer** et observe :

- Le **Quotient d’Attaque** change
- Le **jet de Hasard** est différent à chaque fois
- Les pertes d’**ENDURANCE** sont appliquées en direct dans le HUD
- Le compteur d’ennemis (si plusieurs)

### Étape 4 : Test multi-ennemis (si disponible)

Certaines sections ont plusieurs `combatants`. Le système passe automatiquement à l’ennemi suivant après victoire.

---

## 5. Checklist de validation

| Test | Résultat attendu | Statut |
|------|------------------|--------|
| Affichage du panneau de combat | Panneau rouge avec nom + stats | ⬜ |
| Calcul Quotient d’Attaque | Nombre correct (HAB + bonus – ennemi) | ⬜ |
| Jet de Hasard serveur | Valeur entre 0 et 9 | ⬜ |
| Pertes ENDURANCE | Appliquées côté serveur et HUD | ⬜ |
| Victoire sur 1 ennemi | Message + passage au suivant (si multi) | ⬜ |
| Victoire totale | Sortie du mode combat | ⬜ |
| Défaite (END = 0) | Message "Vous avez succombé" | ⬜ |
| Fuite | Ennemi ne perd rien, joueur perd des points | ⬜ |
| Bonus Maîtrise des armes | +2 HAB pris en compte | ⬜ |
| Bonus Puissance psychique | +2 HAB pris en compte | ⬜ |
| Historique combat | `choice_history` contient les rounds | ⬜ |

---

## 6. Commandes SQL utiles après test

```sql
-- Voir les derniers rounds de combat
SELECT 
  created_at,
  metadata->>'enemy' as enemy,
  metadata->>'attack_quotient' as qa,
  metadata->>'hazard_roll' as roll,
  metadata->>'player_loss' as p_loss,
  metadata->>'enemy_loss' as e_loss
FROM choice_history
WHERE metadata->>'type' = 'combat_round'
ORDER BY created_at DESC
LIMIT 10;
```

---

**Tu peux maintenant copier-coller ce fichier et suivre les étapes.**

Veux-tu que je génère aussi un **script de test automatisé** (Jest / Playwright) ?