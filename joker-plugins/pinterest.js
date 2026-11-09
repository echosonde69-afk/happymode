// Joker plugin: pinterest  — commands: pinterest
// (extracted from routes/pairing.js line 9627; behaviour unchanged)
import axios from "axios";
import { AXIOS_DL, KEITH_API, sendMedia } from "../core/helpers.js";

export default {
  name: "pinterest",
  aliases: ["pinterest"],
  order: 9627,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "pinterest");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/(pinterest\.com|pin\.it)/i.test(url)) {
      await send("❌ Usage: .pinterest <pinterest url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`${KEITH_API}/download/pindl3?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("No result");
      const { image, video } = data.result;
      if (video) await sendMedia(sock, jid, "video", video, { caption: "📌 Pinterest\n🃏 Joker-XD" }, msg);
      else if (image) await sendMedia(sock, jid, "image", image, { caption: "📌 Pinterest\n🃏 Joker-XD" }, msg);
      else throw new Error("No media");
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
