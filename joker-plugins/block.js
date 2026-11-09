// Joker plugin: block  — commands: block
// (extracted from routes/pairing.js line 5505; behaviour unchanged)
import { commandPrivileged, readJson, sf, targetNumber, writeJson } from "../core/helpers.js";

export default {
  name: "block",
  aliases: ["block"],
  order: 5505,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "block");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return { __done: true, value: (true) }; }
    try {
      const pnJid = `${n}@s.whatsapp.net`;
      // Force LID mapping (Baileys v7 requires LID for blocklist)
      try {
        if (typeof sock.onWhatsApp === "function") {
          await sock.onWhatsApp(pnJid);
        }
      } catch {}
      let blockJid = pnJid;
      try {
        const lidMap = sock.signalRepository?.lidMapping;
        if (lidMap?.getLIDForPN) {
          const lid = await lidMap.getLIDForPN(pnJid);
          if (lid) blockJid = lid;
        }
      } catch {}
      await sock.updateBlockStatus(blockJid, "block");
      const list = readJson(sf(sock, "block.json"), []).map(String);
      if (!list.includes(n)) list.push(n);
      writeJson(sf(sock, "block.json"), list);
      await send(`🚫 WhatsApp account blocked: +${n}`);
    } catch (e) { await send(`❌ Block failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
