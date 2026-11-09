// Joker plugin: chatbotrem  — commands: chatbotrem
// (extracted from routes/pairing.js line 5660; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "chatbotrem",
  aliases: ["chatbotrem"],
  order: 5660,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "chatbotrem");
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    if (!isGroup(jid)) { await send("❌ Use this command in a group."); return { __done: true, value: (true) }; }
    const cfg = readJson(sf(sock, "chatbot.json"), {});
    delete cfg[jid]; writeJson(sf(sock, "chatbot.json"), cfg);
    await send("✅ Chatbot disabled for this group.");
    return { __done: true, value: (true) };
  
  }
};
