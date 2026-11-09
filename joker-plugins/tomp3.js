// Joker plugin: tomp3  — commands: tomp3
// (extracted from routes/pairing.js line 7583; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import { getQuotedMsg } from "../core/helpers.js";

export default {
  name: "tomp3",
  aliases: ["tomp3"],
  order: 7583,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "tomp3");
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    const quoted = getQuotedMsg(msg);
    if (!quoted?.message?.videoMessage && !quoted?.message?.audioMessage) {
      await send("❌ Reply to a video/audio with .tomp3");
      return { __done: true, value: (true) };
    }
    try {
      const buf = await downloadMediaMessage(quoted, "buffer", {}, { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage });
      await sock.sendMessage(jid, { audio: buf, mimetype: "audio/mpeg", ptt: false }, { quoted: msg });
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
