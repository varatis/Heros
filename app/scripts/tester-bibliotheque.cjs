#!/usr/bin/env node
// Unit tests for the catalogue/access boundary, with an explicitly mocked DB.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const source = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "../lib/library.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
function load({
  configured = true,
  user = null,
  books = [],
  grants = [],
  failed = false,
} = {}) {
  const calls = [];
  const db = {
    auth: { getUser: async () => ({ data: { user } }) },
    from(table) {
      const filters = [];
      const q = {
        select() {
          return q;
        },
        eq(key, value) {
          filters.push([key, value]);
          calls.push([table, key, value]);
          return q;
        },
        order() {
          return q;
        },
        then(resolve) {
          const rows = table === "lw_livres" ? books : grants;
          return Promise.resolve({
            data: failed
              ? null
              : rows.filter((row) =>
                  filters.every(([key, value]) => row[key] === value),
                ),
            error: failed ? { message: "unavailable" } : null,
          }).then(resolve);
        },
      };
      return q;
    },
  };
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require(name) {
      if (name === "react") return { cache: (fn) => fn };
      if (name.endsWith("/config")) return { supabaseConfigured: configured };
      if (name.endsWith("/server")) return { createClient: async () => db };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return { api: exports, calls };
}
(async () => {
  const { api } = load({ configured: false });
  const local = await api.getLibrary();
  assert.equal(local.local, true);
  assert.equal(local.livres.length, 1);
  assert.equal(api.canRead(local.livres[0], []), true);
  const paid = { slug: "paid", is_free: false, status: "published" };
  assert.equal(api.canRead(paid, []), false);
  assert.equal(api.canRead(paid, ["other"]), false);
  assert.equal(api.canRead(paid, ["paid"]), true);
  assert.equal(api.playable(paid), false);
  const grants = [{ user_id: "alice", livre_slug: "paid" }];
  for (const id of ["alice", "bob"]) {
    const { api, calls } = load({
      user: { id },
      books: [paid, { ...paid, slug: "draft", status: "draft" }],
      grants,
    });
    const result = await api.getLibrary();
    assert.equal(result.livres.length, 1);
    assert.equal(api.canRead(paid, result.owned), id === "alice");
    assert.ok(
      calls.some(
        ([table, key, value]) =>
          table === "lw_livres_utilisateur" &&
          key === "user_id" &&
          value === id,
      ),
    );
  }
  const guest = await load({ books: [paid], grants }).api.getLibrary();
  assert.equal(guest.owned.length, 0);
  const failure = await load({
    user: { id: "alice" },
    books: [paid],
    grants,
    failed: true,
  }).api.getLibrary();
  assert.equal(failure.error, true);
  assert.equal(failure.owned.length, 0);
  assert.equal(failure.livres.length, 0);
  console.log(
    "✅ Bibliothèque : gratuit, payant, attribution par compte, invité, brouillon et échec réseau.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
