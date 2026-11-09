// Joker plugin: online  — commands: online, alwaysonline
// (extracted from routes/pairing.js line 6162; behaviour unchanged)
import { commandPrivileged, ownerJid } from "../core/helpers.js";

export default {
  name: "online",
  aliases: ["online","alwaysonline"],
  order: 6162,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["online", "alwaysonline"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    try { await sock.sendPresenceUpdate("available", ownerJid() || jid); await send("🟢 Online presence enabled."); }
    catch (e) { await send(`❌ Presence failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
