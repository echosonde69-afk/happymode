// Joker plugin: xds  — commands: xds, xdgstatus, xd, gstatus
// (extracted from routes/pairing.js line 8338; behaviour unchanged)
import axios from "axios";
import { AXIOS_DL, commandPrivileged, downloadUrlBuffer, getYtVideoData, isGroup, isYtUrl, resolveFacebook, resolveInstagram } from "../core/helpers.js";

export default {
  name: "xds",
  aliases: ["xds","xdgstatus","xd","gstatus"],
  order: 8338,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match() {
    return true; // this block decides by itself (see run)
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, jid, send, react } = __ctx;
{
    let isXdGstatus = ["xds", "xdgstatus"].includes(cmd);
    let xdArgs = args;
    if (cmd === "xd" && String(args[0] || "").toLowerCase() === "gstatus") {
      isXdGstatus = true;
      xdArgs = args.slice(1);
    }
    if (isXdGstatus) {
      if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };

      try {
        let targetJid = null;
        let linkArgs = [...xdArgs];

        // Optional first arg = group JID
        const a0 = linkArgs[0] ? String(linkArgs[0]).trim() : "";
        if (a0 && (/@g\.us$/i.test(a0) || /^\d{10,}(-\d+)?@?g?\.?u?s?$/i.test(a0) || /^\d{15,}(-\d+)?$/.test(a0))) {
          const rawJ = a0.replace(/@g\.us$/i, "").replace(/@$/, "");
          if (/^\d{10,}(-\d+)?$/.test(rawJ)) {
            targetJid = `${rawJ}@g.us`;
            linkArgs = linkArgs.slice(1);
          }
        }
        if (!targetJid && isGroup(jid)) targetJid = jid;

        const url = linkArgs.join(" ").trim();
        if (!url || !/^https?:\/\//i.test(url)) {
          await send(
            "📌 *XD Group Status*\n\n" +
            "Download video from TikTok / YouTube / Instagram / Facebook and post as *Group Status*.\n\n" +
            "Usage:\n" +
            "• `.xds <link>` — current group\n" +
            "• `.xd gstatus <link>` — same\n" +
            "• `.xds 120363xxx@g.us <link>` — target group\n\n" +
            "Supported: TikTok, YouTube, Instagram, Facebook"
          );
          return { __done: true, value: (true) };
        }

        if (!targetJid || !String(targetJid).endsWith("@g.us")) {
          await send("❌ Group required.\nUse inside a group, or pass group JID:\n`.xds 120363xxx@g.us <link>`");
          return { __done: true, value: (true) };
        }

        await react("⬇️");

        let videoUrl = null;
        let title = "";
        let platform = "";

        // ---- detect & resolve ----
        if (/tiktok\.com|vm\.tiktok\.com/i.test(url)) {
          platform = "TikTok";
          const { data } = await axios.get(`https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(url)}`, AXIOS_DL);
          if (!data?.status || !data?.result) throw new Error("Invalid TikTok response");
          const r = data.result;
          videoUrl = r.alternatives?.hd || r.alternatives?.sd || r.video || r.play || r.url;
          title = r.title || "";
          if (!videoUrl) throw new Error("No TikTok video link");
        } else if (isYtUrl(url) || /youtube\.com|youtu\.be/i.test(url)) {
          platform = "YouTube";
          const data = await getYtVideoData(url);
          videoUrl = data.download;
          title = data.title || "";
          if (!videoUrl) throw new Error("No YouTube video link");
        } else if (/instagram\.com|instagr\.am/i.test(url)) {
          platform = "Instagram";
          const items = await resolveInstagram(url);
          if (!items?.length) throw new Error("No Instagram media found");
          const vid = items.find(x => x.type === "video" || /\.(mp4|mov|webm)/i.test(x.url || "")) || items[0];
          videoUrl = vid?.url;
          if (!videoUrl) throw new Error("No Instagram video found");
        } else if (/facebook\.com|fb\.watch|fb\.com/i.test(url)) {
          platform = "Facebook";
          videoUrl = await resolveFacebook(url);
          if (!videoUrl) throw new Error("No Facebook video link");
        } else {
          await send("❌ Unsupported link.\nOnly *TikTok, YouTube, Instagram, Facebook*.");
          return { __done: true, value: (true) };
        }

        // Download to buffer (more reliable for group status)
        await react("📥");
        const buf = await downloadUrlBuffer(videoUrl, 180000);
        if (!buf || !buf.length) throw new Error("Empty video buffer");

        const content = {
          video: buf,
          mimetype: "video/mp4",
          caption: title ? String(title).slice(0, 200) : undefined
        };

        if (typeof sock.sendGroupStatus === "function") {
          await sock.sendGroupStatus(targetJid, content);
        } else {
          await sock.sendMessage(targetJid, { ...content, groupStatus: true });
        }

        await react("✅");
        await send(
          `✅ *Group Status posted!*\n` +
          `📱 Platform: *${platform}*\n` +
          (title ? `🎬 ${String(title).slice(0, 80)}\n` : "") +
          `🃏 Joker-XD`
        );
      } catch (e) {
        console.error("[xds]", e?.message || e);
        await react("❌");
        await send(
          "❌ Failed to download / post Group Status.\n" +
          (e?.message || "Unknown error") +
          "\n\n• Link valid? Private video?\n• Bot must be admin of the group."
        );
      }
      return { __done: true, value: (true) };
    }
  }
  }
};
