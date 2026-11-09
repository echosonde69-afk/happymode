// Joker plugin: antilink  — commands: antilink
// (extracted from routes/pairing.js line 8009; behaviour unchanged)
import { commandPrivileged, isAdmin, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antilink",
  aliases: ["antilink"],
  order: 8009,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "antilink");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send) && !(await (async () => {
      const meta = await sock.groupMetadata(jid);
      return isAdmin(meta, msg.key.participant || msg.key.remoteJid);
    })())) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "antilink.json"), {});
    if (!v) {
      await send(`🔗 *ANTILINK*\nCurrent: *${cfg[jid] || "off"}*\n\nUsage:\n.antilink warn\n.antilink delete\n.antilink kick\n.antilink off`);
      return { __done: true, value: (true) };
    }
    const nv = setAntiCfg(sf(sock, "antilink.json"), jid, v);
    await send(`🔗 *ANTILINK*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
