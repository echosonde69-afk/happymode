// Joker plugin: warn  — commands: warn
// (extracted from routes/pairing.js line 8735; behaviour unchanged)
import { addWarnCount, clearWarnCount, findParticipantJid, getWarnLimit, isAdmin, isGroup, isPrivileged, targetNumber } from "../core/helpers.js";

export default {
  name: "warn",
  aliases: ["warn"],
  order: 8735,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "warn");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply or number."); return { __done: true, value: (true) }; }
    const limit = getWarnLimit(sock);
    const count = addWarnCount(jid, n, "manual", sock);
    const target = findParticipantJid(meta, n);
    await sock.sendMessage(jid, { text: `⚠️ @${n} warn *${count}/${limit}*`, mentions: [target] }, { quoted: msg });
    if (count >= limit) {
      try {
        await sock.groupParticipantsUpdate(jid, [target], "remove");
        clearWarnCount(jid, n, "manual", sock);
        await sock.sendMessage(jid, { text: `🥾 @${n} removed (${limit} warns).`, mentions: [target] }, { quoted: msg });
      } catch {}
    }
    return { __done: true, value: (true) };
  
  }
};
