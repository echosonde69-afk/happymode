// Joker plugin: setownername  — commands: setownername
// (extracted from routes/pairing.js line 6274; behaviour unchanged)
import { commandPrivileged, sf, writeJson } from "../core/helpers.js";

export default {
  name: "setownername",
  aliases: ["setownername"],
  order: 6274,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "setownername");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const name = args.join(" ").trim();
    if (!name) { await send("❌ Usage: .setownername Name"); return { __done: true, value: (true) }; }
    writeJson(sf(sock, "owner-name.json"), { name });
    await send(`✅ Owner name set to *${name}*.`);
    return { __done: true, value: (true) };
  
  }
};
