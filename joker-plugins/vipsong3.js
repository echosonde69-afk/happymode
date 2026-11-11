// Joker-XD: .play / .vipsong3 <name> — EK hi message: asli WhatsApp audio + upar song card
// (thumbnail + title + channel). Kisi bhi size ki audio chalti hai, seek/speed/background sab asli.
import yts from "yt-search";
import axios from "axios";
import {
  resolveYtQuery,
  keithDownloadAudio,
  cleanErr,
  keithSearchYts,
  isYtUrl
} from "../core/helpers.js";

async function getThumbBuffer(url) {
  if (!url) return null;
  try {
    const r = await axios.get(url, { responseType: "arraybuffer", timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" } });
    const b = Buffer.from(r.data);
    return b.length ? b : null;
  } catch {
    return null;
  }
}

export default {
  name: "play",
  aliases: ["play", "vipsong3"],
  order: 1222,
  async run(ctx) {
    const { sock, msg, jid, args, send, react } = ctx;
    const q = args.join(" ").trim();
    if (!q) {
      await send("🎵 *VIP Play*\n\n`.play <song name>`\n`.play <youtube link>`\n\n_Ek hi message: audio + song card (poora gaana, kisi bhi size ka)_");
      return true;
    }
    try {
      if (react) await react("🎵");

      // 1) meta
      let info = { title: "Track", channel: "YouTube", duration: "", thumb: "", url: q };
      if (!isYtUrl(q)) {
        try {
          const r = await yts(q);
          if (r?.videos?.length) {
            const v = r.videos[0];
            info = { title: v.title || "Track", channel: v.author?.name || "YouTube", duration: v.timestamp || "", thumb: v.thumbnail || "", url: v.url };
          } else {
            const s = await keithSearchYts(q);
            info = { ...info, title: s.title || "Track", duration: s.duration || "", thumb: s.thumbnail || "", url: s.videoUrl };
          }
        } catch {
          const rs = await resolveYtQuery(q);
          info.title = rs.title; info.url = rs.url;
        }
      } else {
        const rs = await resolveYtQuery(q);
        info.title = rs.title || "Track"; info.url = rs.url;
        try {
          const r = await yts(rs.title);
          if (r?.videos?.length) {
            const v = r.videos[0];
            info.channel = v.author?.name || "YouTube"; info.duration = v.timestamp || ""; info.thumb = v.thumbnail || "";
          }
        } catch {}
      }

      // 2) audio link + thumbnail
      const [audioUrl, thumbBuf] = await Promise.all([keithDownloadAudio(info.url), getThumbBuffer(info.thumb)]);
      const fileName = `${String(info.title).replace(/[^\w\s-]/gi, "").slice(0, 50) || "vipsong"}.mp3`;

      const adReply = {
        title: `🎵 ${String(info.title).slice(0, 90)}`,
        body: `${info.channel}${info.duration ? " • " + info.duration : ""} • JOKER XD VIP`,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false,
        sourceUrl: String(info.url).startsWith("http") ? info.url : "https://youtube.com",
        ...(thumbBuf ? { thumbnail: thumbBuf } : {}),
        ...(info.thumb ? { thumbnailUrl: info.thumb } : {})
      };

      // 3) ek hi message: audio + card
      try {
        await sock.sendMessage(
          jid,
          {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName,
            ptt: false,
            contextInfo: { externalAdReply: adReply }
          },
          { quoted: msg }
        );
      } catch (e) {
        console.error("[play card]", e?.message || e);
        // fallback: simple audio
        await sock.sendMessage(jid, { audio: { url: audioUrl }, mimetype: "audio/mpeg", fileName, ptt: false }, { quoted: msg });
      }
      if (react) await react("✅");
    } catch (e) {
      console.error("[play]", e?.message || e);
      if (react) await react("❌");
      await send(`❌ *Play failed*\n\n${cleanErr(e)}`);
    }
    return true;
  }
};
