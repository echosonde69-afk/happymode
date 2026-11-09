// Joker plugin: tiktokaudio  — commands: tiktokaudio, ttaudio
// (extracted from routes/pairing.js line 9519; behaviour unchanged)
import axios from "axios";
import { AXIOS_DL, bufferToMp3, downloadUrlBuffer, sendMedia } from "../core/helpers.js";

export default {
  name: "tiktokaudio",
  aliases: ["tiktokaudio","ttaudio"],
  order: 9519,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["tiktokaudio", "ttaudio"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/tiktok\.com/i.test(url)) {
      await send("❌ Usage: .tiktokaudio <tiktok_url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const { data } = await axios.get(`https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(url)}`, AXIOS_DL);
      if (!data?.status || !data?.result) throw new Error("Invalid API response");
      const r = data.result;
      let aurl = r.music || r.audio || r.alternatives?.audio;
      if (!aurl) {
        const vurl = r.alternatives?.hd || r.alternatives?.sd || r.video || r.play;
        if (!vurl) throw new Error("No media");
        let buf = await downloadUrlBuffer(vurl, 120000);
        try { buf = await bufferToMp3(buf); } catch {}
        await sock.sendMessage(jid, { audio: buf, mimetype: "audio/mpeg", ptt: false }, { quoted: msg });
      } else {
        await sendMedia(sock, jid, "audio", aurl, { mimetype: "audio/mpeg" }, msg);
      }
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
