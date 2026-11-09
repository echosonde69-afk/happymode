// Joker plugin: sticker  — commands: sticker, s, stick, stiker
// (extracted from routes/pairing.js line 9158; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import { STICKER_PACK_AUTHOR, STICKER_PACK_NAME, getQuotedMsg, makeSticker, unwrapMessage } from "../core/helpers.js";

export default {
  name: "sticker",
  aliases: ["sticker","s","stick","stiker"],
  order: 9158,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["sticker", "s", "stick", "stiker"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const quoted = getQuotedMsg(msg);
    const target = quoted || msg;
    const rawMsg = target?.message || {};
    const inner = unwrapMessage(rawMsg);
    const imgMsg = inner.imageMessage || rawMsg.imageMessage;
    const vidMsg = inner.videoMessage || rawMsg.videoMessage;
    const stkMsg = inner.stickerMessage || rawMsg.stickerMessage;
    const docMsg = inner.documentMessage || rawMsg.documentMessage;
    const docMime = String(docMsg?.mimetype || "").toLowerCase();
    const hasImg = !!imgMsg;
    const hasVid = !!vidMsg;
    const hasSticker = !!stkMsg;
    // GIF/image/webp as document
    const hasDocMedia = !!(
      docMsg &&
      (/image\//i.test(docMime) ||
        /gif/i.test(docMime) ||
        /webp/i.test(docMime) ||
        /video\//i.test(docMime) ||
        /\.(gif|webp|png|jpe?g|mp4|webm)$/i.test(docMsg.fileName || ""))
    );
    if (!hasImg && !hasVid && !hasSticker && !hasDocMedia) {
      await send(
        "❌ Reply to *image / video / gif / sticker* with .s\nOptional: `.s PackName|Author`"
      );
      return { __done: true, value: (true) };
    }

    // Optional custom pack|author on .s  (defaults: Joker-xd / telegram Dev Martenzain)
    const swns = args.join(" ").trim();
    const customPack = swns.includes("|") ? swns.split("|")[0]?.trim() : (swns || "");
    const customAuthor = swns.includes("|") ? swns.split("|")[1]?.trim() : "";
    const pack = customPack || STICKER_PACK_NAME;
    const auth = customAuthor || STICKER_PACK_AUTHOR;

    try {
      react("🖼️").catch(() => {});
      const isVid =
        hasVid ||
        !!vidMsg?.gifPlayback ||
        /gif|video|webp/i.test(docMime) ||
        /\.(gif|mp4|webm|webp)$/i.test(docMsg?.fileName || "") ||
        (hasSticker && !!stkMsg?.isAnimated);

      const dlTarget = {
        key: target.key || msg.key,
        message: Object.keys(inner).length ? inner : rawMsg
      };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) {
        throw new Error("Media download failed (empty buffer)");
      }
      if (buf.length > 15 * 1024 * 1024) {
        console.warn("[sticker] large media", buf.length);
      }

      const webp = await makeSticker(buf, isVid, pack, auth);
      if (!webp || webp.length < 50) throw new Error("Sticker output empty");
      await sock.sendMessage(jid, { sticker: webp }, { quoted: msg });
      await react("✅");
    } catch (e) {
      console.error("[sticker]", e?.message || e);
      await react("❌");
      await send(`❌ Sticker failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
