// Joker plugin: yts  — commands: yts
// (extracted from routes/pairing.js line 9649; behaviour unchanged)
import yts from "yt-search";

export default {
  name: "yts",
  aliases: ["yts"],
  order: 9649,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "yts");
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .yts <search>"); return { __done: true, value: (true) }; }
    try {
      const r = await yts(q);
      if (!r?.videos?.length) { await send("❌ No results"); return { __done: true, value: (true) }; }
      const list = r.videos.slice(0, 6);
      let t = `📽️ *YouTube Search*\n🔎 ${q}\n\n`;
      list.forEach((v, i) => {
        t += `*${i + 1}.* ${v.title}\n📺 ${v.author?.name || ""}\n⏱ ${v.timestamp} | 👀 ${v.views?.toLocaleString?.() || v.views}\n🔗 ${v.url}\n\n`;
      });
      t += `_Use .song / .video|ytmp4 + link or name_`;
      await send(t);
    } catch (e) {
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
