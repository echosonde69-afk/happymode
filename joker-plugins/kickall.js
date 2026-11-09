// Joker plugin: kickall  — commands: kickall, removeall, kall
// (extracted from routes/pairing.js line 7791; behaviour unchanged)
import { commandPrivileged, isGroup, jidNumber } from "../core/helpers.js";

export default {
  name: "kickall",
  aliases: ["kickall","removeall","kall"],
  order: 7791,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["kickall", "removeall", "kall"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    try {
      const meta = await sock.groupMetadata(jid);
      const botN = jidNumber(sock.user?.id);
      const targets = meta.participants
        .filter(p => {
          const id = p.id || "";
          return !p.admin && jidNumber(id) !== botN;
        })
        .map(p => p.id);
      let ok = 0;
      for (const t of targets) {
        try { await sock.groupParticipantsUpdate(jid, [t], "remove"); ok++; } catch {}
      }
      await send(`🥾 Removed ${ok}/${targets.length} members.`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
