// Locked & Obfuscated - _loader.js
'use strict';
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { makeLocals } from "./_locals.js";
export async function getPlugins() {
export async function reloadPlugins() {
export async function runPlugins(ctx) {
const _0x2eb322=["Y0dsdVp3PT0=","TG1weg==","Wm5WdVkzUnBiMjQ9","Ym5WdFltVnk="];const _0x8a34cd=_0x=>{try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return""}};
// Joker plugin loader.
// Every *.js file in this folder (not starting with "_") is one command plugin.
// Replace a file = upgrade that command. Add a file = add a command. Delete a file = remove it.
//
// Plugin shape (see _template.js):
//   export default {
//     name: _0x8a34cd(_0x2eb322[0]),            // file/command name
//     aliases: [_0x8a34cd(_0x2eb322[0]), "p"],  // command words
//     order: 100,              // lower runs first (optional, default 5000)
//     match(ctx) { ... }       // optional – default: ctx.cmd is one of aliases
//     async run(ctx) { ... }   // return true  => command handled, stop
//   };                         // return falsy => keep looking at other plugins

const DIR = path.dirname(fileURLToPath(import.meta.url));
let cache = null;
let loading = null;
let version = 0;

async function loadAll() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(_0x8a34cd(_0x2eb322[1])) && !f.startsWith("_")).sort();
  const list = [];
  for (const f of files) {
    try {
      const url = pathToFileURL(path.join(DIR, f)).href + (version ? `?v=${version}` : "");
      const mod = await import(url);
      const pl = mod.default;
      if (!pl || typeof pl.run !== _0x8a34cd(_0x2eb322[2])) { console.warn(`[plugins] ${f}: no default export with run() — skipped`); continue; }
      pl.file = f;
      pl.name = pl.name || f.replace(/\.js$/, "");
      pl.aliases = (pl.aliases || []).map((a) => String(a).toLowerCase());
      if (typeof pl.order !== _0x8a34cd(_0x2eb322[3])) pl.order = 5000;
      list.push(pl);
    } catch (e) {
      console.error(`[plugins] failed to load ${f}:`, e?.message || e);
    }
  }
  list.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
  return list;
}

  if (cache) return cache;
  if (!loading) loading = loadAll().then((l) => { cache = l; loading = null; return l; });
  return loading;
}

/** Re-read the folder (used by .reloadplugins) — new/changed plugin files apply without restart. */
  version = Date.now();
  cache = null; loading = null;
  const l = await getPlugins();
  return l.length;
}

  const plugins = await getPlugins();
  ctx.locals = makeLocals(ctx);
  for (const pl of plugins) {
    let hit;
    try {
      hit = typeof pl.match === _0x8a34cd(_0x2eb322[2]) ? await pl.match(ctx) : pl.aliases.includes(ctx.cmd);
    } catch (e) { console.error(`[plugins] ${pl.file} match error:`, e?.message || e); continue; }
    if (!hit) continue;
    const res = await pl.run(ctx);
    if (res === true) return true;
    if (res && res.__done) return res.value;
    // falsy / undefined => not handled, try next plugin
  }
  return false;
}
