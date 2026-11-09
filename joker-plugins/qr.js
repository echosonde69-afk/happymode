// Joker plugin: qr  — commands: qr, qrcode
// (extracted from routes/pairing.js line 9148; behaviour unchanged)
import { sendMedia } from "../core/helpers.js";

export default {
  name: "qr",
  aliases: ["qr","qrcode"],
  order: 9148,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["qr", "qrcode"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const text = args.join(" ").trim();
    if (!text) { await send("❌ Usage: .qr <text or url>"); return { __done: true, value: (true) }; }
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;
      await sendMedia(sock, jid, "image", url, { caption: "📱 QR\n🃏 Joker-XD" }, msg);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
