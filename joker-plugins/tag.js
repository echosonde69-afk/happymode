// Joker plugin: tag  — commands: tag
// (extracted from routes/pairing.js line 7845; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged, sendHiddenTag } from "../core/helpers.js";

export default {
  name: "tag",
  aliases: ["tag"],
  order: 7845,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "tag");
  },
  async run(__ctx) {
    const { sock, msg, body, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const members = meta.participants.map(p => p.id);
    const extraText = String(body || "").replace(/^\S+\s*/, "").trim();
    return { __done: true, value: (await sendHiddenTag(sock, msg, jid, members, extraText, "tag")) };
  
  }
};
