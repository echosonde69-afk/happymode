// Joker plugin: setgroupname  — commands: setgroupname, setname, gname
// (extracted from routes/pairing.js line 7996; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged } from "../core/helpers.js";

export default {
  name: "setgroupname",
  aliases: ["setgroupname","setname","gname"],
  order: 7996,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["setgroupname", "setname", "gname"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send("❌ Admins only."); return { __done: true, value: (true) }; }
    const d = args.join(" ").trim();
    if (!d) { await send("❌ Usage: .setgroupname name"); return { __done: true, value: (true) }; }
    try { await sock.groupUpdateSubject(jid, d); await send("✅ Group name updated."); }
    catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
