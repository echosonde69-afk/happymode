// Joker plugin: getpp  — commands: getpp
// (extracted from routes/pairing.js line 5954; behaviour unchanged)
import { commandPrivileged, findParticipantJid, getProfileImageBuffer, isGroup, targetNumber } from "../core/helpers.js";

export default {
  name: "getpp",
  aliases: ["getpp"],
  order: 5954,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "getpp");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    // Support: reply to user, mention, or .getpp 92xxxxxxxx
    let n = targetNumber(msg, args);
    // Also accept bare number as first arg even if quoted exists
    if (args[0] && String(args[0]).replace(/\D/g, "").length >= 7) {
      n = String(args[0]).replace(/\D/g, "");
    }
    if (!n) { await send("❌ Reply to a user / mention / or provide a number.\nExample: .getpp 923xxxxxxxxx"); return { __done: true, value: (true) }; }
    try {
      // Try participant JID from group if available (LID-safe)
      let targetJid = `${n}@s.whatsapp.net`;
      if (isGroup(jid)) {
        try {
          const meta = await sock.groupMetadata(jid);
          const found = findParticipantJid(meta, n);
          if (found) targetJid = found;
        } catch {}
      }
      const buf = await getProfileImageBuffer(sock, targetJid);
      if (!buf) { await send("❌ No accessible profile picture."); return { __done: true, value: (true) }; }
      await sock.sendMessage(jid, { image: buf, caption: `👤 +${n}` }, { quoted: msg });
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
