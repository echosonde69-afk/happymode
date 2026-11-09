// Joker plugin: toimage  — commands: toimage, toimg
// (extracted from routes/pairing.js line 7693; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import { getQuotedMsg, stickerToImageBuffer, unwrapMessage } from "../core/helpers.js";

export default {
  name: "toimage",
  aliases: ["toimage","toimg"],
  order: 7693,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["toimage", "toimg"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send, react } = __ctx;
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("❌ Reply to a *sticker* with .toimg");
      return { __done: true, value: (true) };
    }
    const inner = unwrapMessage(quoted.message || {});
    if (!(inner.stickerMessage || quoted.message?.stickerMessage)) {
      await send("❌ Reply to a *sticker* with .toimg");
      return { __done: true, value: (true) };
    }
    try {
      await react("🖼️");
      const dlTarget = { key: quoted.key, message: Object.keys(inner).length ? inner : quoted.message };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) throw new Error("Download failed");
      const img = await stickerToImageBuffer(buf);
      await sock.sendMessage(jid, { image: img, caption: "🃏 Joker-XD" }, { quoted: msg });
      await react("✅");
    } catch (e) {
      console.error("[toimg]", e);
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
