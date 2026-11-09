// Joker plugin: tiktok  — commands: tiktok, tt
// (extracted from routes/pairing.js line 9496; behaviour unchanged)
import axios from "axios";
import { AXIOS_DL, sendMedia } from "../core/helpers.js";

export default {
  name: "tiktok",
  aliases: ["tiktok","tt"],
  order: 9496,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["tiktok", "tt"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/tiktok\.com/i.test(url)) {
      await send("❌ Usage: .tiktok <tiktok_url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("Invalid API response");
      const r = data.result;
      const vurl = r.alternatives?.hd || r.alternatives?.sd || r.video || r.play || r.url;
      if (!vurl) throw new Error("No video link");
      const cap = r.title ? `🎵 ${r.title}\n🃏 Joker-XD` : "🎵 TikTok\n🃏 Joker-XD";
      await sendMedia(sock, jid, "video", vurl, { caption: cap }, msg);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
