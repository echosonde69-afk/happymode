// Joker plugin: instagram  — commands: instagram, ig, insta
// (extracted from routes/pairing.js line 9449; behaviour unchanged)
import { delay } from "@whiskeysockets/baileys";
import { resolveInstagram, sendMedia } from "../core/helpers.js";

export default {
  name: "instagram",
  aliases: ["instagram","ig","insta"],
  order: 9449,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["instagram", "ig", "insta"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/instagram\.com|instagr\.am/i.test(url)) {
      await send("❌ Usage: .instagram <instagram_url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const items = await resolveInstagram(url);
      if (!items?.length) throw new Error("No media found");
      for (const it of items.slice(0, 6)) {
        const u = it.url;
        const isVid = it.type === "video" || /\.(mp4|mov|webm)/i.test(u) || /reel|tv\//i.test(url);
        if (isVid) await sendMedia(sock, jid, "video", u, { caption: "📸 Instagram\n🃏 Joker-XD" }, msg);
        else await sendMedia(sock, jid, "image", u, { caption: "📸 Instagram\n🃏 Joker-XD" }, msg);
        await delay(700);
      }
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
