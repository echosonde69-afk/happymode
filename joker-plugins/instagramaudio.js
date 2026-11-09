// Joker plugin: instagramaudio  — commands: instagramaudio, igaudio, instaaudio
// (extracted from routes/pairing.js line 9474; behaviour unchanged)
import { bufferToMp3, downloadUrlBuffer, resolveInstagram } from "../core/helpers.js";

export default {
  name: "instagramaudio",
  aliases: ["instagramaudio","igaudio","instaaudio"],
  order: 9474,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["instagramaudio", "igaudio", "instaaudio"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/instagram\.com|instagr\.am/i.test(url)) {
      await send("❌ Usage: .instagramaudio <instagram_url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const items = await resolveInstagram(url);
      const vid = items.find(x => x.type === "video" || /\.mp4/i.test(x.url)) || items[0];
      if (!vid?.url) throw new Error("No media found");
      let buf = await downloadUrlBuffer(vid.url, 120000);
      try { buf = await bufferToMp3(buf); } catch {}
      await sock.sendMessage(jid, { audio: buf, mimetype: "audio/mpeg", ptt: false }, { quoted: msg });
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
