// Joker plugin: gcp  — commands: gcp, gcpp
// (extracted from routes/pairing.js line 5867; behaviour unchanged)
import { commandPrivileged, getProfileImageBuffer, isGroup } from "../core/helpers.js";

export default {
  name: "gcp",
  aliases: ["gcp","gcpp"],
  order: 5867,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["gcp", "gcpp"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    if (!isGroup(jid)) { await send("❌ Use .gcp / .gcpp inside a group."); return { __done: true, value: (true) }; }
    try {
      const meta = await sock.groupMetadata(jid);
      const buf = await getProfileImageBuffer(sock, jid);
      if (!buf) { await send("❌ No accessible group picture."); return { __done: true, value: (true) }; }
      await sock.sendMessage(jid, { image: buf, caption: `🖼️ ${meta.subject || "Group"}` }, { quoted: msg });
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
