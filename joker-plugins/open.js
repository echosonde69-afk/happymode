// Joker plugin: open  — commands: open, unmute
// (extracted from routes/pairing.js line 7960; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged } from "../core/helpers.js";

export default {
  name: "open",
  aliases: ["open","unmute"],
  order: 7960,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["open", "unmute"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    try {
      await sock.groupSettingUpdate(jid, "not_announcement");
      await send("🔓 Group opened.");
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
