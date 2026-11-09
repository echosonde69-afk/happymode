// Joker plugin: ban  — commands: ban
// (extracted from routes/pairing.js line 5469; behaviour unchanged)
import { commandPrivileged, readJson, sf, targetNumber, writeJson } from "../core/helpers.js";

export default {
  name: "ban",
  aliases: ["ban"],
  order: 5469,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "ban");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return { __done: true, value: (true) }; }
    const list = readJson(sf(sock, "ban.json"), []).map(String);
    if (!list.includes(n)) list.push(n);
    writeJson(sf(sock, "ban.json"), list);
    await send(`🚫 Banned: +${n}`);
    return { __done: true, value: (true) };
  
  }
};
