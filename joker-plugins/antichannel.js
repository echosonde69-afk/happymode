// Joker plugin: antichannel  — commands: antichannel, antichanel, antich
// (extracted from routes/pairing.js line 8027; behaviour unchanged)
import { commandPrivileged, isAdmin, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antichannel",
  aliases: ["antichannel","antichanel","antich"],
  order: 8027,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antichannel", "antichanel", "antich"].includes(cmd));
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
    const cfg = readJson(sf(sock, "antichannel.json"), {});
    if (!v) {
      await send(`📡 *ANTICHANNEL*\nCurrent: *${cfg[jid] || "off"}*\n\nBlocks posts forwarded from WhatsApp channels.\n\nUsage:\n.antichannel warn\n.antichannel delete\n.antichannel kick\n.antichannel off`);
      return { __done: true, value: (true) };
    }
    const nv = setAntiCfg(sf(sock, "antichannel.json"), jid, v);
    await send(`📡 *ANTICHANNEL*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
