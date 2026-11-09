// Joker plugin: ping  — commands: ping, p, pong
// (extracted from routes/pairing.js line 7555; behaviour unchanged)
import { readJson, sf } from "../core/helpers.js";

export default {
  name: "ping",
  aliases: ["ping","p","pong"],
  order: 7555,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["ping", "p", "pong"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    const start = Date.now();
    const sent = await sock.sendMessage(jid, { text: "🏓 Checking..." }, { quoted: msg });
    const ms = Date.now() - start;
    const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || sock.user?.name || "Joker-XD";
    const response = `☠️ *${botName}* *speed* ${ms}ms`;
    try { await sock.sendMessage(jid, { text: response, edit: sent.key }); }
    catch { await send(response); }
    return { __done: true, value: (true) };
  
  }
};
