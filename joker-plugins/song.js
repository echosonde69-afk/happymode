// Joker plugin: song  — commands: song, ytmp3, music  (add "doc" at the end to get a document)
// (extracted from routes/pairing.js line 9339; behaviour unchanged)
import { bufferToMp3, cleanErr, dlAudioSupreme, downloadUrlBuffer, resolveYtQuery, sendAudioResult } from "../core/helpers.js";

export default {
  name: "song",
  aliases: ["song","ytmp3","music"],
  order: 9339,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["song", "ytmp3", "music"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, jid, send, react } = __ctx;
    const list = [...args];
    let asDoc = false;
    if (/^(doc|document)$/i.test(list[list.length - 1] || "")) { asDoc = true; list.pop(); }
    const q = list.join(" ").trim();
    if (!q) { await send(`❌ Usage: \`.${cmd} <name or YouTube link>\` (add \`doc\` at the end for document)`); return { __done: true, value: (true) }; }
    try {
      await react("⬇️");
      const { url, title } = await resolveYtQuery(q);
      const dlUrl = await dlAudioSupreme(url);
      const buf = await downloadUrlBuffer(dlUrl, 90000);
      if (asDoc) {
        let out = buf;
        try { out = await bufferToMp3(buf); } catch {}
        await sock.sendMessage(jid, {
          document: out,
          mimetype: "audio/mpeg",
          fileName: `${String(title).replace(/[^\w\s-]/gi, "").slice(0, 60) || "song"}.mp3`
        }, { quoted: msg });
      } else {
        await sendAudioResult(sock, jid, msg, buf, title);
      }
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ .${cmd} failed: ${cleanErr(e)}`);
    }
    return { __done: true, value: (true) };
  
  }
};
