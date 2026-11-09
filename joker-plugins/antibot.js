// Joker plugin: antibot  — commands: antibot
// (extracted from routes/pairing.js line 8081; behaviour unchanged)
import { ANTI_MODE_USAGE, isGroup, parseModeToggle, readJson, sf } from "../core/helpers.js";

export default {
  name: "antibot",
  aliases: ["antibot"],
  order: 8081,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "antibot");
  },
  async run(__ctx) {
    const { sock, args, jid, send } = __ctx;
    const { xp, xtAdminOrOwner, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!(await xtAdminOrOwner())) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const cfg = readJson(sf(sock, "antibot.json"), {});
    const t = parseModeToggle(args, cfg[jid]);
    if (!t) {
      await send(`🤖 *ANTIBOT*\nCurrent: *${cfg[jid] || "off"}*\n\nDetects other WhatsApp bots in this group (by the ID pattern of their messages) and punishes them. Admins are never touched.\n\nUsage:\n${ANTI_MODE_USAGE(xp + "antibot")}\n\nNote: a bot that disguises its message ID cannot be detected.`);
      return { __done: true, value: (true) };
    }
    const nv = setAntiCfg(sf(sock, "antibot.json"), jid, t.mode);
    await send(`🤖 *ANTIBOT*\n✅ Now: *${nv}*${t.note ? "\n" + t.note : ""}`);
    return { __done: true, value: (true) };
  
  }
};
