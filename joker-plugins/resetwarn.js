// Joker plugin: resetwarn  — commands: resetwarn, restwarn, unwarn, rw, rest, warn
// (extracted from routes/pairing.js line 8843; behaviour unchanged)
import { clearAllGroupWarns, clearWarnCount, commandPrivileged, isGroup, targetNumber } from "../core/helpers.js";

export default {
  name: "resetwarn",
  aliases: ["resetwarn","restwarn","unwarn","rw","rest","warn"],
  order: 8843,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd, args } = __ctx;
    return (["resetwarn", "restwarn", "unwarn", "rw"].includes(cmd) || (cmd === "rest" && String(args[0] || "").toLowerCase() === "warn"));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args.filter(a => String(a).toLowerCase() !== "warn"));
    if (!n) {
      const c = clearAllGroupWarns(jid, sock);
      await send(`✅ All violation warns reset (*${c}* entries).`);
      return { __done: true, value: (true) };
    }
    clearWarnCount(jid, n, null, sock);
    await send(`✅ Warns cleared for @${n}`);
    return { __done: true, value: (true) };
  
  }
};
