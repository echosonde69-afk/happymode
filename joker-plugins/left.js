// Joker plugin: left  — commands: left, leave, exit
// (extracted from routes/pairing.js line 5845; behaviour unchanged)
import { commandPrivileged, isGroup, randomGoodbye } from "../core/helpers.js";

export default {
  name: "left",
  aliases: ["left","leave","exit"],
  order: 5845,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["left","leave","exit"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    if (!isGroup(jid)) { await send("❌ This command can only be used in groups."); return { __done: true, value: (true) }; }
    try {
      const members = (await sock.groupMetadata(jid)).participants.map(p => p.id);
      await sock.sendMessage(jid, { text: randomGoodbye(), mentions: members });
      await sock.groupLeave(jid);
    } catch (e) { await send(`❌ Leave failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
