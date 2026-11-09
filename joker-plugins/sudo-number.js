// Joker plugin: sudo-number  — commands: sudo
// (extracted from routes/pairing.js line 6282; behaviour unchanged)
import { commandOwnerOnly, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "sudo-number",
  aliases: ["sudo"],
  order: 6282,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd.startsWith("sudo") && /^sudo\d+$/.test(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, send } = __ctx;
    if (!commandOwnerOnly(sock, msg, send)) return { __done: true, value: (true) };
    const n = cmd.slice(4);
    const list = readJson(sf(sock, "sudo.json"), []).map(String);
    if (!list.includes(n)) list.push(n);
    writeJson(sf(sock, "sudo.json"), list);
    await send(`👑 +${n} is now Sudo.`);
    return { __done: true, value: (true) };
  
  }
};
