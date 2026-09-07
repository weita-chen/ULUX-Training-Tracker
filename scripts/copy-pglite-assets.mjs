#!/usr/bin/env node
/**
 * Nitro bundles @electric-sql/pglite but leaves pglite.data / .wasm next to
 * the original package. Local `vite preview` then crashes looking for them
 * beside electric-sql__pglite.mjs. Deployed apps skip this path (Neon).
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const destDir = join(
  root,
  ".vercel/output/functions/__server.func/_libs",
);

if (!existsSync(destDir)) {
  console.warn("[pglite-assets] no vercel output, skip");
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(srcDir, name);
  if (!existsSync(from)) {
    console.error(`[pglite-assets] missing ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(destDir, name));
  console.log(`[pglite-assets] copied ${name}`);
}
