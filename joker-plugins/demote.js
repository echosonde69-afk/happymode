// Joker plugin: demote  — commands: demote, dismiss, tomember, tomem
// (extracted from routes/pairing.js line 7827; behaviour unchanged)
import { findParticipantJid, isAdmin, isGroup, isPrivileged, jidNumber, targetNumber } from "../core/helpers.js";

export default {
  name: "demote",
  aliases: ["demote","dismiss","tomember","tomem"],
  order: 7827,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["demote", "dismiss", "tomember", "tomem"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply or number."); return { __done: true, value: (true) }; }
    try {
      const target = findParticipantJid(meta, n);
      await sock.groupParticipantsUpdate(jid, [target], "demote");
      await sock.sendMessage(jid, { text: `⬇️ Demoted @${jidNumber(target)}`, mentions: [target] }, { quoted: msg });
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
