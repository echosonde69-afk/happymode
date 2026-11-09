// Joker plugin: xnsearch  — commands: xnsearch
// (extracted from routes/pairing.js line 9753; behaviour unchanged)
import { adultSearchXnxx } from "../core/helpers.js";

export default {
  name: "xnsearch",
  aliases: ["xnsearch"],
  order: 9753,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "xnsearch");
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    const { adultSearchCmd } = __ctx.locals;
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .xnsearch <query>"); return { __done: true, value: (true) }; }
    await adultSearchCmd("xnxx", q, adultSearchXnxx, "xnxx");
    return { __done: true, value: (true) };
  
  }
};
