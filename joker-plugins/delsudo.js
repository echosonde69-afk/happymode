// Joker plugin: delsudo  — commands: delsudo, del
// (extracted from routes/pairing.js line 6302; behaviour unchanged)
import { commandOwnerOnly, readJson, sf, targetNumber, writeJson } from "../core/helpers.js";

export default {
  name: "delsudo",
  aliases: ["delsudo","del"],
  order: 6302,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd, args } = __ctx;
    return (cmd === "delsudo" || (cmd === "del" && String(args[0] || "").toLowerCase() === "sudo"));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, send } = __ctx;
    if (!commandOwnerOnly(sock, msg, send)) return { __done: true, value: (true) };
    let n = "";
    if (cmd === "delsudo" && /^delsudo\d+$/.test(cmd)) {
      n = cmd.slice(7);
    } else if (cmd === "delsudo") {
      n = targetNumber(msg, args);
    } else {
      n = targetNumber(msg, args.slice(1));
    }
    if (!n) { await send("❌ Reply to the Sudo user or provide a number.\nUsage: .del sudo | .delsudo | .delsudo9200000000"); return { __done: true, value: (true) }; }
    const list = readJson(sf(sock, "sudo.json"), []).map(String);
    if (!list.includes(n)) {
      await send(`ℹ️ +${n} is not in Sudo list.`);
      return { __done: true, value: (true) };
    }
    writeJson(sf(sock, "sudo.json"), list.filter(x => x !== n));
    await send(`✅ +${n} removed from Sudo.`);
    return { __done: true, value: (true) };
  
  }
};
