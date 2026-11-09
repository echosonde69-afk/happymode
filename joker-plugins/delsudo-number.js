// Joker plugin: delsudo-number  — commands: delsudo
// (extracted from routes/pairing.js line 6322; behaviour unchanged)
import { commandOwnerOnly, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "delsudo-number",
  aliases: ["delsudo"],
  order: 6322,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd.startsWith("delsudo") && /^delsudo\d+$/.test(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, send } = __ctx;
    if (!commandOwnerOnly(sock, msg, send)) return { __done: true, value: (true) };
    const n = cmd.slice(7);
    writeJson(sf(sock, "sudo.json"), readJson(sf(sock, "sudo.json"), []).map(String).filter(x => x !== n));
    await send(`✅ +${n} removed from Sudo.`);
    return { __done: true, value: (true) };
  
  }
};
