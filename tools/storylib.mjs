// ============================================================
// HeroBook — storylib.mjs
// Bibliothèque de génération de migrations SQL pour les
// histoires Vie / Armure / Attaque.
//
// On modélise une histoire comme un graphe de noeuds :
//   node(key, title, prose, opts)
//     opts: { start, ending, kind, arrival, combat, choices: [...] }
//   choice(target, text, flavor, effects)
//     effects: { add:[slug], remove:[slug], require:[slug],
//                requireFlag:[key], setFlag:[key|{k,v}],
//                stat:{hp, armor, attack}, price }
//
// Le moteur :
//  - les objets d'armure/arme sont ajoutés à l'inventaire ET
//    appliquent leur bonus de stats via choice_effects
//    (l'inventaire n'applique pas les stat_bonus tout seul).
//  - les noeuds de combat ont `combat:[...]`. Après la victoire
//    le client recharge le même noeud : on DOIT donc y mettre les
//    choix d'après-combat. La défaite sert `mort_epuisement`.
//  - on_arrive (loot/blessure) est exécuté à l'arrivée sur le noeud
//    CIBLE (jamais au départ de l'histoire).
// ============================================================

export function q(s) {
  // Échappe une chaîne pour SQL entre simples quotes.
  return String(s).replace(/'/g, "''");
}

export function choice(target, text, flavor, effects = {}) {
  return { target, text, flavor, effects };
}

const ITEM_BONUS = {}; // rempli par registerItems

export function buildMigration({
  number,
  slug,
  title,
  tagline,
  description,
  genre,
  isFree,
  priceGems,
  playtime,
  difficulty,
  tags,
  cover,
  rulebookTitle,
  rulebookContent,
  ruleData,
  startStats = { hp: 20, armor: 0, attack: 5 },
  items = [],
  nodes = [],
}) {
  const itemBySlug = {};
  for (const it of items) {
    itemBySlug[it.slug] = it;
    if (it.stat_bonus) ITEM_BONUS[it.slug] = it.stat_bonus;
  }

  const nodeByKey = {};
  for (const n of nodes) nodeByKey[n.key] = n;

  const out = [];
  out.push(`-- ================================================================`);
  out.push(`-- HeroBook — Migration ${String(number).padStart(3, "0")} : ${title}`);
  out.push(`-- Générée par tools/nova9-*.mjs — NE PAS ÉDITER À LA MAIN`);
  out.push(`-- Système : Vie / Armure / Attaque, sacoche par aventure`);
  out.push(`-- ================================================================`);
  out.push(``);
  out.push(`DO $$`);
  out.push(`DECLARE v_story_id UUID;`);
  out.push(`BEGIN`);

  // ---- Histoire ----
  out.push(
    `  INSERT INTO public.stories (slug, title, tagline, description, genre, status, is_free, price_gems, estimated_playtime_min, difficulty, tags, cover_image_url, published_at)`,
  );
  out.push(`  VALUES (`);
  out.push(`    '${q(slug)}',`);
  out.push(`    '${q(title)}',`);
  out.push(`    '${q(tagline)}',`);
  out.push(`    E'${q(description)}',`);
  out.push(`    '${q(genre)}',`);
  out.push(`    'published',`);
  out.push(`    ${isFree ? "TRUE" : "FALSE"},`);
  out.push(`    ${priceGems == null ? "NULL" : priceGems},`);
  out.push(`    ${playtime},`);
  out.push(`    ${difficulty},`);
  out.push(`    ARRAY[${tags.map((t) => `'${q(t)}'`).join(", ")}],`);
  out.push(`    '${q(cover)}',`);
  out.push(`    NOW()`);
  out.push(`  )`);
  out.push(`  ON CONFLICT (slug) DO UPDATE SET`);
  out.push(`    title=EXCLUDED.title, tagline=EXCLUDED.tagline, description=EXCLUDED.description,`);
  out.push(`    genre=EXCLUDED.genre, status=EXCLUDED.status, is_free=${isFree ? "TRUE" : "FALSE"},`);
  out.push(`    price_gems=${priceGems == null ? "NULL" : priceGems},`);
  out.push(`    estimated_playtime_min=EXCLUDED.estimated_playtime_min, difficulty=EXCLUDED.difficulty,`);
  out.push(`    tags=EXCLUDED.tags, cover_image_url=EXCLUDED.cover_image_url, published_at=EXCLUDED.published_at`);
  out.push(`  RETURNING id INTO v_story_id;`);
  out.push(``);

  // ---- Nettoyage ----
  out.push(`  DELETE FROM public.choice_history WHERE story_id=v_story_id;`);
  out.push(`  DELETE FROM public.user_story_progress WHERE story_id=v_story_id;`);
  out.push(`  DELETE FROM public.character_stats WHERE story_id=v_story_id;`);
  out.push(`  DELETE FROM public.user_inventory WHERE story_id=v_story_id;`);
  out.push(`  DELETE FROM public.choice_effects WHERE choice_id IN (SELECT c.id FROM public.story_choices c JOIN public.story_nodes n ON n.id=c.node_id WHERE n.story_id=v_story_id);`);
  out.push(`  DELETE FROM public.story_choices WHERE node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id) OR target_node_id IN (SELECT id FROM public.story_nodes WHERE story_id=v_story_id);`);
  out.push(`  DELETE FROM public.story_nodes WHERE story_id=v_story_id;`);
  out.push(`  DELETE FROM public.items WHERE story_id=v_story_id;`);
  out.push(``);

  // ---- Items ----
  out.push(`  -- OBJETS`);
  for (const it of items) {
    const sb = JSON.stringify(it.stat_bonus || {});
    out.push(
      `  INSERT INTO public.items (slug, name, description, item_type, rarity, stat_bonus, is_consumable, is_stackable, is_available, story_id) VALUES ('${q(it.slug)}', '${q(it.name)}', E'${q(it.description)}', '${it.type}', '${it.rarity || "common"}', '${q(sb)}'::jsonb, ${it.consumable ? "TRUE" : "FALSE"}, ${it.stackable ? "TRUE" : "FALSE"}, FALSE, v_story_id);`,
    );
  }
  out.push(``);

  // ---- Rulebook ----
  if (rulebookContent) {
    out.push(`  INSERT INTO public.story_rulebooks (story_id, title, content, rule_data, source_credit)`);
    out.push(`  VALUES (v_story_id, '${q(rulebookTitle || "Règles")}', E'${q(rulebookContent)}', '${q(JSON.stringify(ruleData || {}))}'::jsonb, 'HeroBook Original')`);
    out.push(`  ON CONFLICT (story_id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, rule_data=EXCLUDED.rule_data;`);
    out.push(``);
  }

  // ---- Noeuds ----
  out.push(`  -- NOEUDS`);
  for (const n of nodes) {
    const meta = buildMetadata(n);
    out.push(
      `  INSERT INTO public.story_nodes (story_id, node_key, title, content, is_start, is_ending, ending_type, metadata) VALUES (v_story_id, '${q(n.key)}', '${q(n.title)}', E'${q(n.prose)}', ${n.start ? "TRUE" : "FALSE"}, ${n.ending ? "TRUE" : "FALSE"}, ${n.endingType ? `'${q(n.endingType)}'` : "NULL"}, '${q(JSON.stringify(meta))}'::jsonb);`,
    );
  }
  out.push(``);

  // ---- Compteurs ----
  const totalNodes = nodes.length;
  const totalEndings = nodes.filter((n) => n.ending).length;
  out.push(
    `  UPDATE public.stories SET total_nodes=${totalNodes}, total_endings=${totalEndings} WHERE id=v_story_id;`,
  );
  out.push(`END $$;`);
  out.push(``);

  // ---- Choix (bloc séparé pour récupérer les UUID) ----
  out.push(`DO $$`);
  out.push(`DECLARE v_story_id UUID; v_src UUID; v_tgt UUID; v_choice UUID; v_item UUID;`);
  out.push(`BEGIN`);
  out.push(`  SELECT id INTO v_story_id FROM public.stories WHERE slug='${q(slug)}';`);
  out.push(``);

  for (const n of nodes) {
    if (!n.choices || n.choices.length === 0) continue;
    out.push(`  -- ${n.key}`);
    out.push(
      `  SELECT id INTO v_src FROM public.story_nodes WHERE story_id=v_story_id AND node_key='${q(n.key)}';`,
    );
    n.choices.forEach((c, i) => {
      out.push(
        `  SELECT id INTO v_tgt FROM public.story_nodes WHERE story_id=v_story_id AND node_key='${q(c.target)}';`,
      );
      const values = [`v_src`, `v_tgt`, String(i), `'${q(c.text)}'`];
      if (c.flavor) values.push(`'${q(c.flavor)}'`);
      out.push(
        `  INSERT INTO public.story_choices (node_id, target_node_id, display_order, text${c.flavor ? ", flavor_text" : ""}) VALUES (${values.join(", ")}) RETURNING id INTO v_choice;`,
      );
      const effs = c.effects || {};
      // inventory_add (+stats pour armure/arme)
      for (const slug of effs.add || []) {
        out.push(
          `  SELECT id INTO v_item FROM public.items WHERE slug='${q(slug)}' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice, 'inventory_add', v_item, 1);`,
        );
        const bonus = ITEM_BONUS[slug] || itemBySlug[slug]?.stat_bonus;
        if (bonus) {
          if (bonus.armor) out.push(`  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice, 'stat_modifier', 'armor', ${bonus.armor});`);
          if (bonus.attack) out.push(`  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice, 'stat_modifier', 'attack', ${bonus.attack});`);
          if (bonus.hp_max) out.push(`  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice, 'stat_modifier', 'hp_max', ${bonus.hp_max});`);
        }
      }
      for (const slug of effs.remove || []) {
        out.push(
          `  SELECT id INTO v_item FROM public.items WHERE slug='${q(slug)}' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id, stat_value) VALUES (v_choice, 'inventory_remove', v_item, 1);`,
        );
      }
      for (const slug of effs.require || []) {
        out.push(
          `  SELECT id INTO v_item FROM public.items WHERE slug='${q(slug)}' AND story_id=v_story_id; INSERT INTO public.choice_effects (choice_id, effect_type, item_id) VALUES (v_choice, 'inventory_require', v_item);`,
        );
      }
      for (const flag of effs.requireFlag || []) {
        const [k, v] = typeof flag === "string" ? [flag, true] : [flag.k, flag.v];
        out.push(
          `  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice, 'flag_require', '${q(k)}', ${v ? "TRUE" : "FALSE"});`,
        );
      }
      for (const flag of effs.setFlag || []) {
        const [k, v] = typeof flag === "string" ? [flag, true] : [flag.k, flag.v];
        out.push(
          `  INSERT INTO public.choice_effects (choice_id, effect_type, flag_key, flag_value) VALUES (v_choice, 'flag_set', '${q(k)}', ${v ? "TRUE" : "FALSE"});`,
        );
      }
      if (effs.stat) {
        for (const [k, val] of Object.entries(effs.stat)) {
          out.push(
            `  INSERT INTO public.choice_effects (choice_id, effect_type, stat_key, stat_value) VALUES (v_choice, 'stat_modifier', '${q(k)}', ${val});`,
          );
        }
      }
    });
    out.push(``);
  }
  out.push(`END $$;`);
  out.push(``);

  return out.join("\n");
}

function buildMetadata(n) {
  const meta = { kind: n.kind || (n.ending ? "ending" : "section") };
  if (n.combat) {
    meta.combatants = n.combat.enemies;
    if (n.combat.flee) meta.combat = { flee: n.combat.flee };
  }
  if (n.arrival) meta.on_arrive = n.arrival;
  if (n.sectionNumber) meta.section_number = n.sectionNumber;
  return meta;
}

// Aide : créer un noeud
export function node(key, title, prose, opts = {}) {
  return { key, title, prose, ...opts };
}
