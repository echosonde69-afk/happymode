// Joker plugin: antivoice  — commands: antivoice, antivn, antiaudio
// (extracted from routes/pairing.js line 8794; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antivoice",
  aliases: ["antivoice","antivn","antiaudio"],
  order: 8794,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antivoice", "antivn", "antiaudio"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antivoice.json"), {});
    if (!v) { await send(`🎤 *ANTIVOICE*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antivoice warn|delete|kick|off`); return { __done: true, value: (true) }; }
    const nv = setAntiCfg(sf(sock, "antivoice.json"), jid, v);
    await send(`🎤 *ANTIVOICE*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
