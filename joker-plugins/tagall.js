// Joker plugin: tagall  — commands: tagall
// (extracted from routes/pairing.js line 7855; behaviour unchanged)
import { buildQuotedContent, buildTagAllText, collectOnlineNumbers, findQuotedDeep, isAdmin, isGroup, isPrivileged, jidNumber } from "../core/helpers.js";

export default {
  name: "tagall",
  aliases: ["tagall"],
  order: 7855,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["tagall"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const members = meta.participants.map(p => p.id);
    let message = args.join(" ").trim();
    const quoted = findQuotedDeep(msg);
    try {
      // Replied message: media is re-sent first, replied text becomes the message
      if (quoted) {
        let content = null;
        try { content = (await buildQuotedContent(sock, quoted)).content; } catch {}
        if (content && content.text != null && !content.image && !content.video) {
          if (!message) message = String(content.text || "").trim();
        } else if (content) {
          await sock.sendMessage(jid, content, { quoted: msg });
        }
      }
      const onlineNums = await collectOnlineNumbers(sock, members);
      const onlineCount = members.filter(m => onlineNums.has(jidNumber(m))).length;
      const mentions = [...new Set([...members, sender])];
      await sock.sendMessage(jid, {
        text: buildTagAllText({ senderJid: sender, message, members, onlineCount }),
        mentions
      }, { quoted: msg });
    } catch (e) {
      await send(`❌ Tag failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
