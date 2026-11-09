// Joker plugin: close  — commands: close, mute
// (extracted from routes/pairing.js line 7972; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged } from "../core/helpers.js";

export default {
  name: "close",
  aliases: ["close","mute"],
  order: 7972,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["close", "mute"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    try {
      await sock.groupSettingUpdate(jid, "announcement");
      await send("🔒 Group closed (admins only).");
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
