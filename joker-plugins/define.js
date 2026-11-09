// Joker plugin: define  — commands: define, dict, dictionary
// (extracted from routes/pairing.js line 9092; behaviour unchanged)
import axios from "axios";

export default {
  name: "define",
  aliases: ["define","dict","dictionary"],
  order: 9092,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["define", "dict", "dictionary"].includes(cmd));
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    const word = args.join(" ").trim();
    if (!word) { await send("❌ Usage: .define <word>"); return { __done: true, value: (true) }; }
    try {
      const r = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
        timeout: 12000, validateStatus: () => true
      });
      if (r.status === 404 || !Array.isArray(r.data)) { await send(`❌ No definition for *${word}*`); return { __done: true, value: (true) }; }
      const e = r.data[0];
      const meanings = (e.meanings || []).slice(0, 2).map(m => {
        const defs = (m.definitions || []).slice(0, 2).map(d => `• ${d.definition}`).join("\n");
        return `*${m.partOfSpeech}*\n${defs}`;
      }).join("\n\n");
      await send(`📚 *${e.word}* ${e.phonetic || ""}\n\n${meanings}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
