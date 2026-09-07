#!/usr/bin/env node
/**
 * Nitro copies some packages into the Vercel function `_libs/` chunk folder
 * without their runtime deps (pglite wasm/data, tslib). Local `vite preview`
 * and Vercel then 500 looking next to those chunks.
 */
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
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
