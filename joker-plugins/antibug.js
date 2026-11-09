// Joker plugin: antibug  — commands: antibug
// (extracted from routes/pairing.js line 8096; behaviour unchanged)
import { ANTI_MODE_USAGE, isGroup, parseModeToggle, readJson, sf } from "../core/helpers.js";

export default {
  name: "antibug",
  aliases: ["antibug"],
  order: 8096,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "antibug");
  },
  async run(__ctx) {
    const { sock, args, jid, send } = __ctx;
    const { xp, xtAdminOrOwner, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!(await xtAdminOrOwner())) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const cfg = readJson(sf(sock, "antibug.json"), {});
    const t = parseModeToggle(args, cfg[jid], "delete");
    if (!t) {
      await send(`🛡️ *ANTIBUG*\nCurrent: *${cfg[jid] || "off"}*\n\nDeletes crash / bug messages (stacked-character floods, invisible-character floods, giant texts and contact cards) before they hang members' phones.\n\nUsage:\n${xp}antibug on  (= delete)\n${ANTI_MODE_USAGE(xp + "antibug")}`);
      return { __done: true, value: (true) };
    }
    const nv = setAntiCfg(sf(sock, "antibug.json"), jid, t.mode);
    await send(`🛡️ *ANTIBUG*\n✅ Now: *${nv}*${t.note ? "\n" + t.note : ""}`);
    return { __done: true, value: (true) };
  
  }
};
