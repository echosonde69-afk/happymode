// Joker plugin: chatbotadd  — commands: chatbotadd, catbotadd
// (extracted from routes/pairing.js line 5652; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "chatbotadd",
  aliases: ["chatbotadd","catbotadd"],
  order: 5652,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["chatbotadd","catbotadd"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    if (!isGroup(jid)) { await send("❌ Use this command in a group."); return { __done: true, value: (true) }; }
    const cfg = readJson(sf(sock, "chatbot.json"), {});
    cfg[jid] = true; writeJson(sf(sock, "chatbot.json"), cfg);
    await send("🤖 Chatbot enabled for this group.");
    return { __done: true, value: (true) };
  
  }
};
