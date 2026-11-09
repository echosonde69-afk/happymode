// Joker plugin: song  — commands: song, play, ytmp3, music
// (extracted from routes/pairing.js line 9339; behaviour unchanged)
import { cleanErr, dlAudioSupreme, downloadUrlBuffer, resolveYtQuery, sendAudioResult } from "../core/helpers.js";

export default {
  name: "song",
  aliases: ["song","play","ytmp3","music"],
  order: 9339,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["song", "play", "ytmp3", "music"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, jid, send, react } = __ctx;
    const q = args.join(" ").trim();
    if (!q) { await send(`❌ Usage: \`.${cmd} <name or YouTube link>\``); return { __done: true, value: (true) }; }
    try {
      await react("⬇️");
      const { url, title } = await resolveYtQuery(q);
      const dlUrl = await dlAudioSupreme(url);
      const buf = await downloadUrlBuffer(dlUrl, 90000);
      await sendAudioResult(sock, jid, msg, buf, title);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ .${cmd} failed: ${cleanErr(e)}`);
    }
    return { __done: true, value: (true) };
  
  }
};
