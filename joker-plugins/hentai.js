// Joker plugin: hentai  — commands: hentai
// (extracted from routes/pairing.js line 9760; behaviour unchanged)
import { adultSearchXvideos } from "../core/helpers.js";

export default {
  name: "hentai",
  aliases: ["hentai"],
  order: 9760,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "hentai");
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    const { adultSearchCmd } = __ctx.locals;
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .hentai <query>"); return { __done: true, value: (true) }; }
    await adultSearchCmd("Hentai", q, (x) => adultSearchXvideos(`hentai ${x}`), "xvideos");
    return { __done: true, value: (true) };
  
  }
};
