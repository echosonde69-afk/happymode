// Joker plugin: mode  — commands: mode
// (extracted from routes/pairing.js line 6127; behaviour unchanged)
import { commandPrivileged, getMode, sf, writeJson } from "../core/helpers.js";

export default {
  name: "mode",
  aliases: ["mode"],
  order: 6127,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "mode");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    let v = String(args[0] || "").toLowerCase();
    if (v === "pm") v = "dm";
    if (!["private","public","dm","group"].includes(v)) {
      await send(`⚙️ Current mode: *${getMode(sock)}*\nModes:\n• private — only owner & sudo\n• public — anyone anywhere\n• dm / pm — anyone only in DM\n• group — anyone only in groups`);
      return { __done: true, value: (true) };
    }
    writeJson(sf(sock, "mode.json"), { mode: v });
    await send(`✅ Mode: *${v}*. Owner/Sudo always have access.`);
    return { __done: true, value: (true) };
  
  }
};
