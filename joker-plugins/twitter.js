// Joker plugin: twitter  — commands: twitter
// (extracted from routes/pairing.js line 9548; behaviour unchanged)
import axios from "axios";
import { AXIOS_DL, KEITH_API, sendMedia } from "../core/helpers.js";

export default {
  name: "twitter",
  aliases: ["twitter"],
  order: 9548,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "twitter");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/(twitter\.com|x\.com)/i.test(url)) {
      await send("❌ Usage: .twitter <twitter/x url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`${KEITH_API}/download/twitter?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("Failed to fetch");
      const r = data.result;
      const vurl = r.video || r.url || r.download || (Array.isArray(r) ? r[0]?.url : null);
      if (!vurl) throw new Error("No media found");
      const isVid = /\.mp4|video/i.test(String(vurl));
      if (isVid) await sendMedia(sock, jid, "video", vurl, { caption: "🐦 Twitter/X\n🃏 Joker-XD" }, msg);
      else await sendMedia(sock, jid, "image", vurl, { caption: "🐦 Twitter/X\n🃏 Joker-XD" }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
