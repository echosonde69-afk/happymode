// Joker plugin: antitext  — commands: antitext
// (extracted from routes/pairing.js line 8824; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antitext",
  aliases: ["antitext"],
  order: 8824,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antitext"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antitext.json"), {});
    if (!v) { await send(`💬 *ANTITEXT*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antitext warn|delete|kick|off`); return { __done: true, value: (true) }; }
    const nv = setAntiCfg(sf(sock, "antitext.json"), jid, v);
    await send(`💬 *ANTITEXT*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
