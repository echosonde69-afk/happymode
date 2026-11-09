// Joker plugin: resetlink  — commands: resetlink, revoke
// (extracted from routes/pairing.js line 7947; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged } from "../core/helpers.js";

export default {
  name: "resetlink",
  aliases: ["resetlink","revoke"],
  order: 7947,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["resetlink", "revoke"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    try {
      await sock.groupRevokeInvite(jid);
      const code = await sock.groupInviteCode(jid);
      await send(`🔄 New link:\nhttps://chat.whatsapp.com/${code}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
