// Joker plugin: chatbot  — commands: chatbot
// (extracted from routes/pairing.js line 9316; behaviour unchanged)
import { commandPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "chatbot",
  aliases: ["chatbot"],
  order: 9316,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "chatbot");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(sf(sock, "aichatbot.json"), {});
    if (v === "on") {
      cfg[jid] = true;
      writeJson(sf(sock, "aichatbot.json"), cfg);
      await send("✅ AI chatbot *ON* for this chat.\nBot will reply only when:\n• You *mention* the bot (@bot)\n• Or you *reply* to the bot's message\n(Works in any mode: private / public / group / dm)");
      return { __done: true, value: (true) };
    }
    if (v === "off") {
      delete cfg[jid];
      writeJson(sf(sock, "aichatbot.json"), cfg);
      await send("✅ AI chatbot *OFF* for this chat.");
      return { __done: true, value: (true) };
    }
    await send(`🤖 Chatbot: *${cfg[jid] ? "ON" : "OFF"}*\nUsage: .chatbot on|off\n\nWhen ON → replies only on @mention or reply-to-bot.`);
    return { __done: true, value: (true) };
  
  }
};
