#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const sharp = require("sharp");
require.extensions[".ts"] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(result.outputText, filename);
};
const root = path.join(__dirname, "..");
const {
  LS01,
  LS01_SECTIONS,
  LS01_CHAPITRES,
} = require("../content/lonewolf/ls01/index.ts");
const {
  SCENE_ILLUSTRATIONS,
  HERO_PORTRAIT,
  ENEMY_PORTRAITS,
  ITEM_ILLUSTRATIONS,
} = require("../content/lonewolf/ls01/illustrations.ts");
const missingPortraits = new Set([
  "Rejeton de crypte",
  "Assassin du Roi-Sorcier",
]);
const extracts = require("../content/lonewolf/ls01/pdf-extractions.json");
const sourceRoot = path.join(root, "..", "content/stories/illustrations/ls01");
const colorizations = JSON.parse(
  fs.readFileSync(path.join(sourceRoot, "colorization.json"), "utf8"),
);
const paths = new Set([
  LS01.illustration,
  HERO_PORTRAIT.src,
  ...Object.values(ITEM_ILLUSTRATIONS),
]);
for (const extract of extracts)
  paths.add(`/lonewolf/pdf/originals/${extract.file}`);
const scenes = new Set(SCENE_ILLUSTRATIONS.map((s) => s.src));
for (const asset of SCENE_ILLUSTRATIONS) paths.add(asset.src);
for (const chapter of LS01_CHAPITRES) {
  assert.ok(
    scenes.has(chapter.image),
    `Chapitre hors inventaire : ${chapter.titre}`,
  );
  paths.add(chapter.image);
}
for (const section of LS01_SECTIONS) {
  if (section.image) {
    assert.ok(
      scenes.has(section.image),
      `Scène hors inventaire : §${section.id}`,
    );
    paths.add(section.image);
  }
  if (!section.combat) continue;
  const expected = ENEMY_PORTRAITS[section.combat.nom];
  assert.ok(expected, `Ennemi non inventorié : ${section.combat.nom}`);
  assert.equal(
    section.combat.image,
    expected.src,
    `Mauvais portrait au §${section.id}`,
  );
  if (expected.src) paths.add(expected.src);
  else
    assert.ok(
      missingPortraits.has(section.combat.nom),
      `Nouveau portrait manquant non documenté : ${section.combat.nom}`,
    );
}
for (const [name, portrait] of Object.entries(ENEMY_PORTRAITS)) {
  assert.equal(portrait.name, name);
  if (portrait.src) paths.add(portrait.src);
  else assert.ok(missingPortraits.has(name));
}
(async () => {
  for (const src of paths) {
    assert.ok(src.startsWith("/lonewolf/"), `Chemin inattendu : ${src}`);
    const file = path.join(root, "public", src);
    assert.ok(fs.existsSync(file), `Image absente : ${src}`);
    const meta = await sharp(file).metadata();
    assert.ok(meta.width > 0 && meta.height > 0, `Image illisible : ${src}`);
    if (src.includes("/portraits/"))
      assert.equal(
        meta.width / meta.height,
        3 / 4,
        `Ratio portrait incorrect : ${src}`,
      );
  }
  for (const scene of SCENE_ILLUSTRATIONS) {
    assert.ok(
      scene.origin.startsWith("pdf-"),
      "No unverified adaptation artwork",
    );
    const meta = await sharp(path.join(root, "public", scene.src)).metadata();
    assert.equal(meta.width, scene.width, `Width: ${scene.id}`);
    assert.equal(meta.height, scene.height, `Height: ${scene.id}`);
    assert.ok(scene.original.startsWith("/lonewolf/pdf/originals/"));
    assert.ok(scene.pdfPage >= 1 && scene.pdfPage <= 175);
    if (scene.pdfSection) assert.ok(scene.pdfSection <= 350);
  }
  assert.equal(extracts.length, 76);
  for (const entry of extracts) {
    const original = fs.readFileSync(
      path.join(sourceRoot, "originals", entry.file),
    );
    assert.deepEqual(
      fs.readFileSync(
        path.join(root, "public/lonewolf/pdf/originals", entry.file),
      ),
      original,
      `Original altered: ${entry.file}`,
    );
  }
  let lockedPixels = 0;
  const pendingColorizations = [];
  for (const entry of colorizations) {
    if (
      !fs.existsSync(
        path.join(root, "public/lonewolf/pdf/colored", `${entry.id}.png`),
      )
    ) {
      pendingColorizations.push(entry.id);
      continue;
    }
    const [left, top, right, bottom] = entry.crop;
    const before = await sharp(
      path.join(sourceRoot, "originals", entry.original),
    )
      .extract({ left, top, width: right - left, height: bottom - top })
      .removeAlpha()
      .raw()
      .toBuffer();
    const coloredFile = path.join(
      root,
      "public/lonewolf/pdf/colored",
      `${entry.id}.png`,
    );
    const after = await sharp(coloredFile).removeAlpha().raw().toBuffer();
    assert.equal(before.length, after.length, `Geometry: ${entry.id}`);
    let changed = 0;
    for (let i = 0; i < before.length; i += 3) {
      assert.equal(before[i], before[i + 1]);
      assert.equal(before[i], before[i + 2]);
      if (before[i] <= 150) {
        assert.equal(after[i], before[i], `Ink R: ${entry.id}/${i}`);
        assert.equal(after[i + 1], before[i + 1], `Ink G: ${entry.id}/${i}`);
        assert.equal(after[i + 2], before[i + 2], `Ink B: ${entry.id}/${i}`);
        lockedPixels++;
      } else if (after[i] !== after[i + 1] || after[i] !== after[i + 2])
        changed++;
    }
    assert.ok(changed > 100, `No color added: ${entry.id}`);
  }
  assert.equal(
    ENEMY_PORTRAITS["Meute de Loups Maudits"].src,
    ENEMY_PORTRAITS["Loup Maudit"].src,
    "One verified species drawing, not invented wolves",
  );
  assert.match(HERO_PORTRAIT.note, /Emblème/);
  assert.match(ENEMY_PORTRAITS.Vordak.note, /dos/);
  console.log(
    `✅ ${lockedPixels} pixels d’encrage inchangés sur ${
      colorizations.length - pendingColorizations.length
    } mises en couleur ; 76 originaux intacts.`,
  );
  if (pendingColorizations.length)
    console.log(
      `ℹ Colorisation en cours : ${pendingColorizations.join(", ")}.`,
    );
  console.log(
    `✅ ${paths.size} images présentes et décodables ; scènes, chapitres et combats reliés au bon asset.`,
  );
  console.log(
    `ℹ ${missingPortraits.size} correspondances non identifiées dans le PDF : ${[...missingPortraits].join(", ")}.`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
