// Joker plugin: groups  — commands: groups
// (extracted from routes/pairing.js line 6119; behaviour unchanged)
import { commandPrivileged } from "../core/helpers.js";

export default {
  name: "groups",
  aliases: ["groups"],
  order: 6119,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "groups");
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    try {
      const list = Object.values(await sock.groupFetchAllParticipating() || {}).sort((a,b)=>(a.subject||"").localeCompare(b.subject||""));
      await send(list.length ? `👥 *Groups (${list.length})*\n\n${list.map((g,i)=>`${i+1}. ${g.subject || "Unknown Group"}`).join("\n")}` : "❌ No groups found.");
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
