// Joker plugin: ai  — commands: ai, gpt, ask
// (extracted from routes/pairing.js line 9286; behaviour unchanged)
import { askAI, getAiHistory, mcKey, pushAiHistory } from "../core/helpers.js";

export default {
  name: "ai",
  aliases: ["ai","gpt","ask"],
  order: 9286,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["ai", "gpt", "ask"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, args, jid, send, react } = __ctx;
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .ai <question>"); return { __done: true, value: (true) }; }
    try {
      await react("🧠");
      // Same chat memory as chatbot (last 24h, light)
      const history = getAiHistory(mcKey(sock, jid));
      const out = await askAI(q, history);
      pushAiHistory(mcKey(sock, jid), "user", q);
      pushAiHistory(mcKey(sock, jid), "assistant", out);
      await send(`🤖 *Joker-XD AI*\n\n${out}`);
    } catch (e) {
      await send(`❌ AI failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
