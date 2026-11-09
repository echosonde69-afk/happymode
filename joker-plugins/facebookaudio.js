// Joker plugin: facebookaudio  — commands: facebookaudio, fbaudio
// (extracted from routes/pairing.js line 9429; behaviour unchanged)
import { bufferToMp3, downloadUrlBuffer, resolveFacebook } from "../core/helpers.js";

export default {
  name: "facebookaudio",
  aliases: ["facebookaudio","fbaudio"],
  order: 9429,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["facebookaudio", "fbaudio"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const url = args.join(" ").trim();
    if (!url || !/facebook\.com|fb\.watch|fb\.com/i.test(url)) {
      await send("❌ Usage: .facebookaudio <facebook_url>"); return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      const vurl = await resolveFacebook(url);
      let buf = await downloadUrlBuffer(vurl, 120000);
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
