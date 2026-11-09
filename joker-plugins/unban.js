// Joker plugin: unban  — commands: unban
// (extracted from routes/pairing.js line 5479; behaviour unchanged)
import { commandPrivileged, readJson, sf, targetNumber, writeJson } from "../core/helpers.js";

export default {
  name: "unban",
  aliases: ["unban"],
  order: 5479,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["unban"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return { __done: true, value: (true) }; }
    writeJson(sf(sock, "ban.json"), readJson(sf(sock, "ban.json"), []).filter(x => String(x) !== n));
    await send(`✅ Unbanned: +${n}`);
    return { __done: true, value: (true) };
  
  }
};
