// Joker plugin: tovoice  — commands: tovoice, tov, topp
// (extracted from routes/pairing.js line 7597; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import path from "path";
import fs from "fs";
import { FFMPEG_PATH, TEMP_DIR, execAsync, getQuotedMsg } from "../core/helpers.js";

export default {
  name: "tovoice",
  aliases: ["tovoice","tov","topp"],
  order: 7597,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["tovoice", "tov", "topp"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send, react } = __ctx;
    const quoted = getQuotedMsg(msg);
    if (!quoted?.message?.videoMessage && !quoted?.message?.audioMessage) {
      await send("❌ Reply to a video / audio / voice with .tovoice");
      return { __done: true, value: (true) };
    }
    try {
      await react("🎙️");
      const buf = await downloadMediaMessage(quoted, "buffer", {}, { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage });
      // Prefer opus voice-note; fallback to mpeg if ffmpeg not available
      let outBuf = buf;
      let mime = "audio/ogg; codecs=opus";
      try {
        const tmpIn = path.join(TEMP_DIR, `tov_${Date.now()}.bin`);
        const tmpOut = path.join(TEMP_DIR, `tov_${Date.now()}.ogg`);
        fs.writeFileSync(tmpIn, buf);
        await execAsync(`"${FFMPEG_PATH}" -y -i "${tmpIn}" -vn -c:a libopus -b:a 64k -ar 48000 -ac 1 "${tmpOut}"`, { timeout: 25000 });
        outBuf = fs.readFileSync(tmpOut);
        try { fs.unlinkSync(tmpIn); } catch {}
        try { fs.unlinkSync(tmpOut); } catch {}
      } catch {
        mime = "audio/mpeg";
      }
      await sock.sendMessage(jid, { audio: outBuf, mimetype: mime, ptt: true }, { quoted: msg });
    } catch (e) { await send(`❌ tovoice failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
