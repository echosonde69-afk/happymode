// Joker plugin: antitag  — commands: antitag
// (extracted from routes/pairing.js line 8045; behaviour unchanged)
import { ANTI_MODE_USAGE, commandPrivileged, isGroup, parseModeToggle, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "antitag",
  aliases: ["antitag"],
  order: 8045,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "antitag");
  },
  async run(__ctx) {
    const { sock, msg, prefix, args, jid, send } = __ctx;
    const { setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const cfg = readJson(sf(sock, "antitag.json"), {});
    if (String(args[0] || "").toLowerCase() === "limit") {
      const lf = sf(sock, "antitaglimit.json");
      const lim = readJson(lf, {});
      const n = parseInt(args[1], 10);
      if (String(args[1] || "").toLowerCase() === "auto") delete lim[jid];
      else if (n >= 2 && n <= 100) lim[jid] = n;
      else { await send(`🏷️ Tag limit: *${lim[jid] || "auto"}*\nUsage: ${prefix}antitag limit <2-100> | auto`); return { __done: true, value: (true) }; }
      writeJson(lf, lim);
      await send(`🏷️ Tag limit: *${lim[jid] || "auto"}*`);
      return { __done: true, value: (true) };
    }
    const t = parseModeToggle(args, cfg[jid]);
    if (!t) {
      await send(`🏷️ *ANTITAG*\nCurrent: *${cfg[jid] || "off"}*\n\nCatches mass tags — both VISIBLE (@numbers) and HIDDEN (silent mention-all / hidetag). Admins and the owner are exempt (test with a normal member).\nLimit: auto (3–5 mentions, based on group size) — change with .antitag limit <n>\n\nUsage:\n${ANTI_MODE_USAGE(".antitag")}\n.antitag limit <2-100> | auto`);
      return { __done: true, value: (true) };
    }
    const nv = setAntiCfg(sf(sock, "antitag.json"), jid, t.mode);
    await send(`🏷️ *ANTITAG*\n✅ Now: *${nv}*${t.note ? "\n" + t.note : ""}`);
    return { __done: true, value: (true) };
  
  }
};
