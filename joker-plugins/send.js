// Joker plugin: send  — commands: send, resend, extract
// (extracted from routes/pairing.js line 8583; behaviour unchanged)
import pino from "pino";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { buildSendContent, commandPrivileged, extractRecoverableContent, getQuotedMsg, unwrapStatusMessage } from "../core/helpers.js";

export default {
  name: "send",
  aliases: ["send","resend","extract"],
  order: 8583,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["send", "resend", "extract"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("📌 Reply to a status or media with `.send`\nIt will be extracted and sent here.");
      return { __done: true, value: (true) };
    }
    try {
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
      await sock.sendMessage(jid, content, { quoted: msg });
    } catch (e) {
      console.error("[send]", e?.message || e);
      await send("❌ Send failed: " + (e?.message || e));
    }
    return { __done: true, value: (true) };
  
  }
};
