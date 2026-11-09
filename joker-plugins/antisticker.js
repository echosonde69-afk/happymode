// Joker plugin: antisticker  — commands: antisticker, antistiker, antistic
// (extracted from routes/pairing.js line 8784; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antisticker",
  aliases: ["antisticker","antistiker","antistic"],
  order: 8784,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antisticker", "antistiker", "antistic"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antisticker.json"), {});
    if (!v) { await send(`🚫 *ANTISTICKER*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antisticker warn|delete|kick|off`); return { __done: true, value: (true) }; }
    const nv = setAntiCfg(sf(sock, "antisticker.json"), jid, v);
    await send(`🚫 *ANTISTICKER*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
