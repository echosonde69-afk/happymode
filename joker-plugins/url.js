// Joker plugin: url  — commands: url, upload
// (extracted from routes/pairing.js line 8984; behaviour unchanged)
import pino from "pino";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import path from "path";
import { downloadUrlBuffer, extractUrl, getQuotedMsg, unwrapMessage, uploadCatbox } from "../core/helpers.js";

export default {
  name: "url",
  aliases: ["url","upload"],
  order: 8984,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["url", "upload"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send, react } = __ctx;
    try {
      react("⬆️").catch(() => {});
      const quoted = getQuotedMsg(msg);
      let buf = null;
      let fileName = "file.bin";
      const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };

      const pickFromMessage = async (sourceMsg) => {
        if (!sourceMsg?.message) return null;
        const m = unwrapMessage(sourceMsg.message);
        const dl = { key: sourceMsg.key, message: m };
        if (m.imageMessage) {
          return { buf: await downloadMediaMessage(dl, "buffer", {}, opts), name: "image.jpg" };
        }
        if (m.videoMessage) {
          return { buf: await downloadMediaMessage(dl, "buffer", {}, opts), name: "video.mp4" };
        }
        if (m.audioMessage) {
          const ptt = !!m.audioMessage.ptt;
          return {
            buf: await downloadMediaMessage(dl, "buffer", {}, opts),
            name: ptt ? "voice.ogg" : "audio.mp3"
          };
        }
        if (m.stickerMessage) {
          return { buf: await downloadMediaMessage(dl, "buffer", {}, opts), name: "sticker.webp" };
        }
        if (m.documentMessage) {
          return {
            buf: await downloadMediaMessage(dl, "buffer", {}, opts),
            name: m.documentMessage.fileName || "document.bin"
          };
        }
        return null;
      };

      // 1) Reply to media
      if (quoted) {
        const got = await pickFromMessage(quoted);
        if (got) { buf = got.buf; fileName = got.name; }
      }

      // 2) Message itself (image with caption .url)
      if (!buf) {
        const got = await pickFromMessage(msg);
        if (got) { buf = got.buf; fileName = got.name; }
      }

      // 3) URL argument
      if (!buf) {
        const link = extractUrl(args.join(" ")) || args[0];
        if (!link || !/^https?:\/\//i.test(String(link))) {
          await send("❌ Usage:\n• Reply to any media with `.url` / `.upload`\n• Or: `.url https://example.com/file.jpg`");
          return { __done: true, value: (true) };
        }
        buf = await downloadUrlBuffer(link, 90000);
        try {
          const u = new URL(link);
          fileName = (path.basename(u.pathname) || "file.bin").split("?")[0] || "file.bin";
        } catch { fileName = "file.bin"; }
      }

      if (!buf || buf.length < 10) throw new Error("No media to upload");
      if (buf.length > 200 * 1024 * 1024) throw new Error("File too large (max ~200MB)");

      const linkOut = await uploadCatbox(buf, fileName);
      await send(
        `✅ *Uploaded*\n\n🔗 ${linkOut}\n📁 ${fileName}\n📦 ${(buf.length / 1024).toFixed(1)} KB`
      );
      await react("✅");
    } catch (e) {
      console.error("[url]", e);
      await react("❌");
      await send(`❌ Upload failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
