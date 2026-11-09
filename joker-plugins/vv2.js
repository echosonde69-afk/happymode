// Joker plugin: vv2
// (extracted from routes/pairing.js line 6346; behaviour unchanged)
import { VV2_ALIASES, commandPrivileged, getChatLabel, getQuotedMsg, getSenderNumber, jidNumber, openViewOnce, privacyOwnerJid } from "../core/helpers.js";

export default {
  name: "vv2",
  aliases: [],
  order: 6346,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (VV2_ALIASES.has(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    // vv2 + emoji/short aliases — must reply to view-once (any media type)
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("❌ Reply to a view-once message.");
      return { __done: true, value: (true) };
    }
    const owner = privacyOwnerJid(sock);
    if (!owner) { await send("❌ Owner number not set (OWNER_NUMBER / linked account)."); return { __done: true, value: (true) }; }
    try {
      const content = await openViewOnce(sock, quoted);
      if (!content) { await send("❌ Could not open that view-once media."); return { __done: true, value: (true) }; }
      await sock.sendMessage(owner, content);
      const chatLabel = await getChatLabel(sock, jid);
      const senderNum = getSenderNumber(msg, sock) || jidNumber(quoted.key?.participant || quoted.key?.remoteJid) || "?";
      await sock.sendMessage(owner, {
        text: `👁️ *View-once opened*\n📍 From: ${chatLabel}\n👤 Sender: +${senderNum}\n💬 Chat ID: ${jid}`
      });
      await send("✅ Sent to owner self DM.");
    } catch (e) { await send(`❌ VV2 failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
