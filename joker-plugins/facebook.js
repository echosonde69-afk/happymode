// Joker plugin: facebook  — commands: facebook, fb
// (extracted from routes/pairing.js line 9411; behaviour unchanged)
import { resolveFacebook, sendMedia } from "../core/helpers.js";

export default {
  name: "facebook",
  aliases: ["facebook","fb"],
  order: 9411,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["facebook", "fb"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/facebook\.com|fb\.watch|fb\.com/i.test(url)) {
      await send("❌ Usage: .facebook <facebook_url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const vurl = await resolveFacebook(url);
      await sendMedia(sock, jid, "video", vurl, { caption: "📘 Facebook\n🃏 Joker-XD" }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
