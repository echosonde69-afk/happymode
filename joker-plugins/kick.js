// Joker plugin: kick  — commands: kick, remove, k, out, nikul, dufa
// (extracted from routes/pairing.js line 7770; behaviour unchanged)
import { findParticipantJid, isAdmin, isGroup, isPrivileged, jidNumber, targetNumber } from "../core/helpers.js";

export default {
  name: "kick",
  aliases: ["kick","remove","k","out","nikul","dufa"],
  order: 7770,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["kick", "remove", "k", "out", "nikul", "dufa"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    try {
      const meta = await sock.groupMetadata(jid);
      const sender = msg.key.participant || msg.key.remoteJid;
      if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
      const n = targetNumber(msg, args);
      if (!n) { await send("❌ Reply to user or give number."); return { __done: true, value: (true) }; }
      const target = findParticipantJid(meta, n);
      if (!target) { await send("❌ User not found in group."); return { __done: true, value: (true) }; }
      // Don't kick admins unless privileged
      if (isAdmin(meta, target) && !isPrivileged(sock, msg)) {
        await send("❌ Cannot kick admin.");
        return { __done: true, value: (true) };
      }
      await sock.groupParticipantsUpdate(jid, [target], "remove");
      await sock.sendMessage(jid, { text: `🥾 Removed @${jidNumber(target)}`, mentions: [target] }, { quoted: msg });
    } catch (e) { await send(`❌ Kick failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
