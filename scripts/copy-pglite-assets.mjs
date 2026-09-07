#!/usr/bin/env node
/**
 * Nitro copies some packages into the Vercel function `_libs/` chunk folder
 * without their runtime deps (pglite wasm/data, tslib). Local `vite preview`
 * and Vercel then 500 looking next to those chunks.
 */
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const funcRoot = join(root, ".vercel/output/functions/__server.func");
const libsDir = join(funcRoot, "_libs");

if (!existsSync(funcRoot)) {
  console.warn("[server-assets] no vercel output, skip");
  process.exit(0);
}

if (existsSync(libsDir)) {
  const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
  mkdirSync(libsDir, { recursive: true });
  for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
    const from = join(srcDir, name);
    if (!existsSync(from)) {
      console.error(`[server-assets] missing ${from}`);
      process.exit(1);
    }
    copyFileSync(from, join(libsDir, name));
    console.log(`[server-assets] copied ${name}`);
  }
}

const tslibSrc = join(root, "node_modules/tslib");
if (!existsSync(tslibSrc)) {
  console.error("[server-assets] missing node_modules/tslib");
  process.exit(1);
}
for (const dest of [
  join(funcRoot, "node_modules/tslib"),
  join(funcRoot, "_libs/node_modules/tslib"),
]) {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(tslibSrc, dest, { recursive: true, dereference: true });
  console.log(`[server-assets] copied tslib -> ${dest}`);
}

const tslibFile = join(tslibSrc, "tslib.es6.mjs");
if (existsSync(libsDir) && existsSync(tslibFile)) {
  copyFileSync(tslibFile, join(libsDir, "tslib.mjs"));
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith(".mjs") && !entry.name.endsWith(".js")) continue;
    const before = readFileSync(full, "utf8");
    if (!before.includes("from \"tslib\"") && !before.includes("from 'tslib'")) {
      continue;
    }
    const rel = relative(dirname(full), join(funcRoot, "node_modules/tslib/tslib.es6.mjs")).replaceAll(
      "\\",
      "/",
    );
    const spec = rel.startsWith(".") ? rel : `./${rel}`;
    const after = before
      .replaceAll("from \"tslib\"", `from "${spec}"`)
      .replaceAll("from 'tslib'", `from '${spec}'`);
    writeFileSync(full, after);
    console.log(`[server-assets] rewrote tslib import in ${relative(funcRoot, full)}`);
  }
}
walk(funcRoot);
