// Non-régression de la fusion LS02 / LS03 / LS04 : registre partagé et générateur.
// Ces tests ne constituent pas un audit de fidélité des tomes 3 et 4 au PDF.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
require('./load-lonewolf.cjs');
const { LISTE_LIVRES, livreParSlug } = require('../content/lonewolf/registre.ts');
const { ITEM_BY_ID } = require('../lib/lonewolf/rules.ts');
const { creerAventure } = require('../lib/lonewolf/engine.ts');
const app = path.resolve(__dirname, '..');

test('Les quatre tomes restent enregistrés, sélectionnables et initialisables', () => {
  for (let n = 1; n <= 4; n++) {
    const slug = `loup-solitaire-0${n}`;
    const book = LISTE_LIVRES.find(b => b.slug === slug);
    assert.ok(book, `${slug} perdu lors de la fusion`);
    assert.equal(livreParSlug(slug), book);
    assert.ok(book.sections['1']);
    assert.equal(book.sections['350'].fin, 'victoire');
    const state = creerAventure({
      book, habileteBase: 15, enduranceBase: 25, disciplines: [], orDepart: 15,
    });
    assert.equal(state.bookSlug, slug);
    assert.equal(state.paragraphe, '1');
    for (const grant of [...(book.objetsDepart ?? []), ...Object.values(book.tirageDepart ?? {}).flat()]) {
      assert.ok(ITEM_BY_ID[grant.id], `${slug} : objet de départ inconnu ${grant.id}`);
    }
  }
});

test('Les objets spécifiques LS03 et LS04 coexistent avec les objets LS02', () => {
  for (const id of [
    'gilet-cuir-matelasse', 'rations-speciales', 'disque-bleu', 'epee-os',
    'potion-sommeil', 'potion-poison', 'cle-bleue', 'potion-force-kalte',
    'cle-fer', 'cle-cuivre', 'eau-benite', 'amulette', 'medaillon-onyx',
    'poignard-vashna', 'parchemin-maaken', 'pelle',
  ]) assert.ok(ITEM_BY_ID[id], `${id} perdu lors de la fusion du catalogue`);
});

test('Générateur multi-livres : filtres conservés, copies synchronisées, --check sans écriture', t => {
  // Vrai générateur et vrais livres, mais toutes les sorties restent dans un bac
  // à sable temporaire : aucun SQL du dépôt n'est régénéré par ce test.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'heros-livres-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const scripts = path.join(root, 'app/scripts');
  fs.mkdirSync(scripts, { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'generer-sql-contenu.cjs'), path.join(scripts, 'generer-sql-contenu.cjs'));
  for (const dir of ['content', 'lib', 'node_modules']) {
    fs.symlinkSync(path.join(app, dir), path.join(root, 'app', dir), 'dir');
  }
  fs.symlinkSync(path.resolve(app, '../content'), path.join(root, 'content'), 'dir');
  const run = (...args) => spawnSync(process.execPath, [path.join(scripts, 'generer-sql-contenu.cjs'), ...args], {
    cwd: root, encoding: 'utf8',
  });
  const ok = (...args) => {
    const result = run(...args);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  };
  const outputs = [
    'app/supabase/seed/006_contenu_ls01.sql',
    'app/supabase/seed/007_contenu_ls02.sql',
    'app/supabase/seed/008_contenu_ls03.sql',
    'app/supabase/seed/009_contenu_ls04.sql',
    'clean_sql/02_loup_solitaire_02_fidele_350.sql',
    'clean_sql/03_loup_solitaire_03_fidele_350.sql',
  ];
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const snapshot = () => outputs.map(file => [read(file), fs.statSync(path.join(root, file)).mtimeMs]);
  ok();
  assert.equal(read(outputs[1]), read(outputs[4]));
  assert.equal(read(outputs[2]), read(outputs[5]));
  const initial = snapshot();
  ok('--check');
  assert.deepEqual(snapshot(), initial, '--check doit être en lecture seule');
  for (const book of ['ls01', 'ls02', 'ls03', 'ls04']) ok(book, '--check');
  assert.deepEqual(snapshot(), initial, 'les filtres ne doivent pas écrire en mode --check');

  // Une génération ciblée LS02 ne doit pas réécrire les sorties des autres tomes.
  ok('ls02');
  for (const index of [0, 2, 3, 5]) assert.deepEqual(snapshot()[index], initial[index]);

  // Cas qui régressait lors de la fusion : LS03 copiait le seed sur clean_sql
  // même avec --check, masquant ainsi une désynchronisation au lieu de la signaler.
  fs.appendFileSync(path.join(root, outputs[5]), '-- divergence volontaire\n');
  const corrupted = snapshot();
  const result = run('ls03', '--check');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /désynchronisé/);
  assert.deepEqual(snapshot(), corrupted, '--check ne doit pas réparer une divergence');
  ok('ls03');
  ok('--check');
});
