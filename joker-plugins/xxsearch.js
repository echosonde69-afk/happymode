// Joker plugin: xxsearch  — commands: xxsearch
// (extracted from routes/pairing.js line 9746; behaviour unchanged)
import { adultSearchXvideos } from "../core/helpers.js";

export default {
  name: "xxsearch",
  aliases: ["xxsearch"],
  order: 9746,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "xxsearch");
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    const { adultSearchCmd } = __ctx.locals;
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .xxsearch <query>"); return { __done: true, value: (true) }; }
    await adultSearchCmd("xvideos", q, adultSearchXvideos, "xvideos");
    return { __done: true, value: (true) };
  
  }
};
