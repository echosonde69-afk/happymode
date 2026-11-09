// Joker plugin: antivideo  — commands: antivideo
// (extracted from routes/pairing.js line 8814; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antivideo",
  aliases: ["antivideo"],
  order: 8814,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antivideo"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antivideo.json"), {});
    if (!v) { await send(`🎬 *ANTIVIDEO*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antivideo warn|delete|kick|off`); return { __done: true, value: (true) }; }
    const nv = setAntiCfg(sf(sock, "antivideo.json"), jid, v);
    await send(`🎬 *ANTIVIDEO*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
