// Joker plugin: setwarn  — commands: setwarn
// (extracted from routes/pairing.js line 8835; behaviour unchanged)
import { commandPrivileged, getWarnLimit, sf, writeJson } from "../core/helpers.js";

export default {
  name: "setwarn",
  aliases: ["setwarn"],
  order: 8835,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "setwarn");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = parseInt(args[0], 10);
    if (!(n >= 1 && n <= 5)) { await send(`⚙️ Warn limit: *${getWarnLimit(sock)}*\nUsage: .setwarn 1-5`); return { __done: true, value: (true) }; }
    writeJson(sf(sock, "setwarn.json"), { limit: n });
    await send(`✅ Warn limit set to *${n}*`);
    return { __done: true, value: (true) };
  
  }
};
