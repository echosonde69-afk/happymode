// Joker plugin: admin  — commands: admin, admins, tagadmin, tagadmins
// (extracted from routes/pairing.js line 7888; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged, jidNumber } from "../core/helpers.js";

export default {
  name: "admin",
  aliases: ["admin","admins","tagadmin","tagadmins"],
  order: 7888,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["admin", "admins", "tagadmin", "tagadmins"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const admins = meta.participants.filter(p => p.admin === "admin" || p.admin === "superadmin").map(p => p.id);
    if (!admins.length) { await send("❌ No admins found."); return { __done: true, value: (true) }; }
    const extraText = args.join(" ").trim();
    const tagLine = admins.map(x => "@" + jidNumber(x)).join(" ");
    const body = (extraText ? extraText + "\n\n" : "👑 *Admins*\n") + tagLine;
    await sock.sendMessage(jid, { text: body, mentions: admins }, { quoted: msg });
    return { __done: true, value: (true) };
  
  }
};
