// Joker plugin: tts  — commands: tts, say
// (extracted from routes/pairing.js line 8892; behaviour unchanged)
import path from "path";
import fs from "fs";
import { FFMPEG_PATH, TEMP_DIR, downloadUrlBuffer, execAsync } from "../core/helpers.js";

export default {
  name: "tts",
  aliases: ["tts","say"],
  order: 8892,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["tts", "say"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const text = args.join(" ").trim();
    if (!text) { await send("❌ Usage: .tts <text>  |  .tts ur <text>"); return { __done: true, value: (true) }; }
    try {
      await react("🗣️");
      const lang = (args[0] && /^[a-z]{2}$/i.test(args[0]) && args.length > 1) ? args[0].toLowerCase() : "en";
      const speak = (args[0] && /^[a-z]{2}$/i.test(args[0]) && args.length > 1) ? args.slice(1).join(" ") : text;
      const q = encodeURIComponent(speak.slice(0, 200));

      // Google Translate TTS (multiple endpoints)
      let buf = null;
      const urls = [
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=${lang}&client=tw-ob`,
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=${lang}&total=1&idx=0&textlen=${Math.min(speak.length, 200)}&client=tw-ob&prev=input`,
        `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q=${q}&tl=${lang}`
      ];
      for (const ttsUrl of urls) {
        try {
          buf = await downloadUrlBuffer(ttsUrl, 30000);
          if (buf && buf.length >= 500) break;
        } catch {}
      }
      if (!buf || buf.length < 500) throw new Error("empty audio from TTS (try shorter text)");

      const stamp = Date.now();
      const tmpIn = path.join(TEMP_DIR, `tts_${stamp}.mp3`);
      const tmpOut = path.join(TEMP_DIR, `tts_${stamp}.ogg`);
      fs.writeFileSync(tmpIn, buf);

      let outBuf = null;
      let mime = "audio/ogg; codecs=opus";
      // Force opus PTT so WhatsApp plays it as voice note on all clients
      try {
        await execAsync(
          `"${FFMPEG_PATH}" -y -i "${tmpIn}" -vn -c:a libopus -b:a 64k -ar 48000 -ac 1 -application voip "${tmpOut}"`,
          { timeout: 25000 }
        );
        outBuf = fs.readFileSync(tmpOut);
        if (!outBuf || outBuf.length < 200) throw new Error("opus empty");
        mime = "audio/ogg; codecs=opus";
      } catch (e1) {
        console.error("[tts] opus fail:", e1.message || e1);
        try {
          const tmpMp3 = path.join(TEMP_DIR, `tts_${stamp}_clean.mp3`);
          await execAsync(
            `"${FFMPEG_PATH}" -y -i "${tmpIn}" -vn -c:a libmp3lame -b:a 96k -ar 44100 -ac 1 "${tmpMp3}"`,
            { timeout: 20000 }
          );
          outBuf = fs.readFileSync(tmpMp3);
          mime = "audio/mpeg";
          try { fs.unlinkSync(tmpMp3); } catch {}
        } catch (e2) {
          outBuf = buf;
          mime = "audio/mpeg";
        }
      }
      try { fs.unlinkSync(tmpIn); } catch {}
      try { fs.unlinkSync(tmpOut); } catch {}

      // ptt:true = voice note (plays properly). Also set fileName for some clients.
      await sock.sendMessage(jid, {
        audio: outBuf,
        mimetype: mime,
        ptt: true,
        fileName: "tts.ogg"
      }, { quoted: msg });
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ TTS failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
