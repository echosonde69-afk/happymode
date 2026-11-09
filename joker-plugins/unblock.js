// Joker plugin: unblock  — commands: unblock
// (extracted from routes/pairing.js line 5533; behaviour unchanged)
import { commandPrivileged, readJson, sf, targetNumber, writeJson } from "../core/helpers.js";

export default {
  name: "unblock",
  aliases: ["unblock"],
  order: 5533,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "unblock");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply to a user or provide a number."); return { __done: true, value: (true) }; }
    try {
      const pnJid = `${n}@s.whatsapp.net`;
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
      await sock.updateBlockStatus(blockJid, "unblock");
      writeJson(sf(sock, "block.json"), readJson(sf(sock, "block.json"), []).filter(x => String(x) !== n));
      await send(`✅ WhatsApp account unblocked: +${n}`);
    } catch (e) { await send(`❌ Unblock failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
