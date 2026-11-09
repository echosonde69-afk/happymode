// Joker plugin: tomp4  — commands: tomp4, tovideo
// (extracted from routes/pairing.js line 7625; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { FFMPEG_PATH, MEDIA_DIR, execAsync, getQuotedMsg, makeId, stickerToVideo, unwrapMessage } from "../core/helpers.js";

export default {
  name: "tomp4",
  aliases: ["tomp4","tovideo"],
  order: 7625,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["tomp4", "tovideo"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send, react } = __ctx;
    const quoted = getQuotedMsg(msg);
    if (!quoted) {
      await send("❌ Reply to a *sticker* or *image* with .tovideo / .tomp4");
      return { __done: true, value: (true) };
    }
    const inner = unwrapMessage(quoted.message || {});
    const isSticker = !!(inner.stickerMessage || quoted.message?.stickerMessage);
    const isImage = !!(inner.imageMessage || quoted.message?.imageMessage);
    if (!isSticker && !isImage) {
      await send("❌ Reply to a *sticker* or *image* with .tovideo / .tomp4");
      return { __done: true, value: (true) };
    }
    try {
      react("🎬").catch(() => {});
      const dlTarget = {
        key: quoted.key,
        message: Object.keys(inner).length ? inner : quoted.message
      };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) throw new Error("Download failed");

      let videoBuf;
      if (isSticker) {
        videoBuf = await stickerToVideo(buf);
      } else {
        // image → short mp4
        const id = makeId();
        const input = path.join(MEDIA_DIR, `${id}_img.jpg`);
        const output = path.join(MEDIA_DIR, `${id}_img.mp4`);
        try {
          let imgBuf = buf;
          try {
            imgBuf = await sharp(buf).jpeg({ quality: 85 }).toBuffer();
          } catch {}
          fs.writeFileSync(input, imgBuf);
          await execAsync(
            `"${FFMPEG_PATH}" -y -loop 1 -i "${input}" -t 3 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" -c:v libx264 -preset ultrafast -tune zerolatency -crf 28 -pix_fmt yuv420p -movflags +faststart -an "${output}"`,
            { timeout: 18000, maxBuffer: 12 * 1024 * 1024 }
          );
          videoBuf = fs.readFileSync(output);
        } finally {
          try {
            fs.rmSync(input, { force: true });
          } catch {}
          try {
            fs.rmSync(output, { force: true });
          } catch {}
        }
      }
      if (!videoBuf || videoBuf.length < 200) throw new Error("Video conversion returned empty");
      await sock.sendMessage(
        jid,
        { video: videoBuf, caption: "🃏 Joker-XD", mimetype: "video/mp4" },
        { quoted: msg }
      );
      await react("✅");
    } catch (e) {
      console.error("[tovideo]", e?.message || e);
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
