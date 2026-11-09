// Joker plugin: translate  — commands: translate, tr, tl
// (extracted from routes/pairing.js line 8966; behaviour unchanged)
import axios from "axios";

export default {
  name: "translate",
  aliases: ["translate","tr","tl"],
  order: 8966,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["translate", "tr", "tl"].includes(cmd));
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    if (args.length < 2) { await send("❌ Usage: .tr <lang> <text>\nExample: .tr ur Hello"); return { __done: true, value: (true) }; }
    const to = args[0];
    const text = args.slice(1).join(" ");
    try {
      const r = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair: `auto|${to}` },
        timeout: 15000,
        validateStatus: () => true
      });
      const out = r.data?.responseData?.translatedText;
      if (!out) { await send("❌ Translate failed."); return { __done: true, value: (true) }; }
      await send(`🌐 *${to}*\n${out}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
