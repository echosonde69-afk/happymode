// Joker plugin: take  — commands: take, steal
// (extracted from routes/pairing.js line 9232; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import { STICKER_PACK_AUTHOR, STICKER_PACK_NAME, addStickerExif, getQuotedMsg, makeSticker, unwrapMessage } from "../core/helpers.js";

export default {
  name: "take",
  aliases: ["take","steal"],
  order: 9232,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["take", "steal"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const quoted = getQuotedMsg(msg);
    const rawMsg = quoted?.message || {};
    const inner = unwrapMessage(rawMsg);
    const stkMsg = inner.stickerMessage || rawMsg.stickerMessage;
    if (!quoted || !stkMsg) {
      await send("❌ Reply to a *sticker*\n\nUsage:\n• `.take PackName`\n• `.take |Author`\n• `.take PackName|Author`");
      return { __done: true, value: (true) };
    }
    const swns = args.join(" ").trim();
    let pack = STICKER_PACK_NAME;
    let auth = STICKER_PACK_AUTHOR;
    if (swns) {
      if (swns.includes("|")) {
        const left = swns.split("|")[0]?.trim();
        const right = swns.split("|")[1]?.trim();
        if (left) pack = left;
        if (right) auth = right;
      } else {
        pack = swns; // only packname
      }
    }
    try {
      react("🃏").catch(() => {});
      const dlTarget = {
        key: quoted.key || msg.key,
        message: Object.keys(inner).length ? inner : rawMsg
      };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) throw new Error("Download failed");
      // Always remake / reinject EXIF so pack + author actually change
      let out;
      try {
        out = await makeSticker(buf, !!stkMsg?.isAnimated, pack, auth);
      } catch {
        out = addStickerExif(buf, pack, auth);
      }
      if (!out || out.length < 50) throw new Error("Sticker output empty");
      await sock.sendMessage(jid, { sticker: out }, { quoted: msg });
      await react("✅");
    } catch (e) {
      console.error("[take]", e?.message || e);
      await react("❌");
      await send(`❌ Take failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
