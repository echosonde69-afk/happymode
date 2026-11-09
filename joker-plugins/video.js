// Joker plugin: video  — commands: video, ytmp4
// (extracted from routes/pairing.js line 9357; behaviour unchanged)
import yts from "yt-search";
import { cleanErr, getYtVideoData, isYtUrl, sendMedia } from "../core/helpers.js";

export default {
  name: "video",
  aliases: ["video","ytmp4"],
  order: 9357,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["video", "ytmp4"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, jid, send, react } = __ctx;
    const q = args.join(" ").trim();
    if (!q) {
      await send(`❌ Usage: .${cmd} <name or YouTube link>`);
      return { __done: true, value: (true) };
    }
    try {
      await react("⬇️");
      let url = q, title = "", channel = "", duration = "", views = "", ago = "", thumb = "";
      if (!isYtUrl(q)) {
        const r = await yts(q);
        if (!r?.videos?.length) throw new Error("No results found");
        const v = r.videos[0];
        url = v.url;
        title = v.title || "";
        channel = v.author?.name || "";
        duration = v.timestamp || "";
        views = v.views ? (typeof v.views.toLocaleString === "function" ? v.views.toLocaleString() : String(v.views)) : "";
        ago = v.ago || "";
        thumb = v.thumbnail || "";
      }
      const data = await getYtVideoData(url);
      const finalTitle = data.title || title || "Video";
      const qualityLine = data.quality ? `\n🎬 *Quality:* ${data.quality}` : "";
      const meta = [
        duration ? `⏱️ *Duration:* ${duration}` : "",
        views ? `👁️ *Views:* ${views}` : "",
        ago ? `📅 *Uploaded:* ${ago}` : "",
        channel ? `📺 *Channel:* ${channel}` : ""
      ].filter(Boolean).join("\n");
      const cap =
        `✅ *Video ready!*\n\n🎬 *${finalTitle}*${qualityLine}` +
        (meta ? `\n${meta}` : "") +
        `\n\n🃏 *Joker-XD*`;
      await sendMedia(
        sock,
        jid,
        "video",
        data.download,
        {
          caption: cap,
          fileName: `${String(finalTitle).replace(/[^\w\s-]/gi, "").slice(0, 60) || "video"}.mp4`
        },
        msg
      );
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ *Failed to download video*\n\n${cleanErr(e)}\n\nTry again later or another query.`);
    }
    return { __done: true, value: (true) };
  
  }
};
