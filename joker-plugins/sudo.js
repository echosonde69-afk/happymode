// Joker plugin: sudo  — commands: sudo
// (extracted from routes/pairing.js line 6291; behaviour unchanged)
import { commandOwnerOnly, readJson, sf, targetNumber, writeJson } from "../core/helpers.js";

export default {
  name: "sudo",
  aliases: ["sudo"],
  order: 6291,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "sudo");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandOwnerOnly(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return { __done: true, value: (true) }; }
    const list = readJson(sf(sock, "sudo.json"), []).map(String);
    if (!list.includes(n)) list.push(n);
    writeJson(sf(sock, "sudo.json"), list);
    await send(`👑 +${n} is now Sudo.`);
    return { __done: true, value: (true) };
  
  }
};
