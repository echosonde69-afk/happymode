// Joker plugin: antipicture  — commands: antipicture, antiphoto, antiping, antimage, antipic
// (extracted from routes/pairing.js line 8804; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antipicture",
  aliases: ["antipicture","antiphoto","antiping","antimage","antipic"],
  order: 8804,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antipicture", "antiphoto", "antiping", "antimage", "antipic"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antipicture.json"), {});
    if (!v) { await send(`🖼️ *ANTIPICTURE*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage: .antipicture warn|delete|kick|off`); return { __done: true, value: (true) }; }
    const nv = setAntiCfg(sf(sock, "antipicture.json"), jid, v);
    await send(`🖼️ *ANTIPICTURE*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
