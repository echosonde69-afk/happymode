// Joker plugin: save  — commands: save, sv, statussave
// (extracted from routes/pairing.js line 8538; behaviour unchanged)
import pino from "pino";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { buildSendContent, commandPrivileged, extractRecoverableContent, getQuotedMsg, privacyOwnerJid, unwrapStatusMessage } from "../core/helpers.js";

export default {
  name: "save",
  aliases: ["save","sv","statussave"],
  order: 8538,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["save", "sv", "statussave"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("📌 Reply to a group status or media with `.save`\nIt will be sent to your private chat.");
      return { __done: true, value: (true) };
    }
    try {
      const owner = privacyOwnerJid(sock);
      if (!owner) { await send("❌ Could not resolve owner DM. Check bot number."); return { __done: true, value: (true) }; }
      let content = null;
      try { content = await extractRecoverableContent(sock, quoted); } catch {}
      if (!content) { try { content = await buildSendContent(sock, quoted); } catch {} }
      if (!content) {
        try {
          const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
          const buf = await downloadMediaMessage(quoted, "buffer", {}, opts);
          if (buf?.length) {
            const m = unwrapStatusMessage(quoted.message || {});
            if (m.imageMessage) content = { image: buf, caption: m.imageMessage.caption || "" };
            else if (m.videoMessage) content = { video: buf, caption: m.videoMessage.caption || "" };
            else if (m.audioMessage) content = { audio: buf, mimetype: m.audioMessage.mimetype || "audio/ogg; codecs=opus", ptt: !!m.audioMessage.ptt };
            else if (m.stickerMessage) content = { sticker: buf };
            else if (m.documentMessage) content = { document: buf, mimetype: m.documentMessage.mimetype || "application/octet-stream", fileName: m.documentMessage.fileName || "file" };
          }
        } catch {}
      }
      if (!content) {
        await send("❌ Could not extract media/text from that message.");
        return { __done: true, value: (true) };
      }
      if (content.text && !content.image && !content.video && !content.audio && !content.sticker && !content.document) {
        await sock.sendMessage(owner, { text: `💾 *Saved Status/Media*\n${content.text}` });
      } else {
        await sock.sendMessage(owner, content);
      }
      await send("✅ Saved to your private chat.");
    } catch (e) {
      console.error("[save]", e?.message || e);
      await send("❌ Save failed: " + (e?.message || e));
    }
    return { __done: true, value: (true) };
  
  }
};
