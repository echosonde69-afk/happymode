// Joker plugin: members  — commands: members, member, tagmembers, tagmember
// (extracted from routes/pairing.js line 7903; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged, jidNumber } from "../core/helpers.js";

export default {
  name: "members",
  aliases: ["members","member","tagmembers","tagmember"],
  order: 7903,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["members", "member", "tagmembers", "tagmember"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const membersOnly = meta.participants.filter(p => !p.admin).map(p => p.id);
    if (!membersOnly.length) { await send("❌ No regular members found."); return { __done: true, value: (true) }; }
    const extraText = args.join(" ").trim();
    const tagLine = membersOnly.map(x => "@" + jidNumber(x)).join(" ");
    const body = (extraText ? extraText + "\n\n" : "👥 *Members*\n") + tagLine;
    await sock.sendMessage(jid, { text: body, mentions: membersOnly }, { quoted: msg });
    return { __done: true, value: (true) };
  
  }
};
