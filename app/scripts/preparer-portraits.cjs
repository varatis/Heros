#!/usr/bin/env node
/** Only verified PDF sources. Keep source ink and anatomy; never synthesize faces. */
const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..", "public", "lonewolf");
const crops = {
  "loup-solitaire": {
    source: "pdf/originals/p001-x4.png",
    left: 270,
    top: 941,
    width: 174,
    height: 108,
  },
  giak: {
    source: "pdf/colored/gloks.png",
    left: 233,
    top: 430,
    width: 211,
    height: 330,
  },
  giaks: {
    source: "pdf/colored/gloks.png",
    left: 15,
    top: 0,
    width: 435,
    height: 770,
  },
  "loup-maudit": {
    source: "pdf/colored/gloks.png",
    left: 23,
    top: 440,
    width: 224,
    height: 330,
  },
  gourgaz: {
    source: "pdf/colored/gourgaz.png",
    left: 10,
    top: 138,
    width: 295,
    height: 492,
  },
  kraan: {
    source: "pdf/colored/kraan.png",
    left: 12,
    top: 0,
    width: 435,
    height: 763,
  },
  vordak: {
    source: "pdf/colored/vordak.png",
    left: 28,
    top: 168,
    width: 395,
    height: 593,
  },
  gluatre: {
    source: "pdf/colored/gluatre.png",
    left: 0,
    top: 0,
    width: 462,
    height: 764,
  },
};
(async () => {
  fs.mkdirSync(path.join(root, "portraits"), { recursive: true });
  for (const [id, { source, ...extract }] of Object.entries(crops)) {
    await sharp(path.join(root, source))
      .extract(extract)
      .resize(480, 640, { fit: "contain", background: "#e9e5db" })
      .webp({ lossless: true })
      .toFile(path.join(root, "portraits", `${id}.webp`));
    console.log(`${id} ← ${source}`);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
