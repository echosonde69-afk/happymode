// Joker plugin: join  — commands: join
// (extracted from routes/pairing.js line 5855; behaviour unchanged)
import { commandPrivileged, parseGroupLink } from "../core/helpers.js";

export default {
  name: "join",
  aliases: ["join"],
  order: 5855,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "join");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const code = parseGroupLink(args.join(" "));
    if (!code) { await send("❌ Usage: .join https://chat.whatsapp.com/XXXXXXXX"); return { __done: true, value: (true) }; }
    try {
      const groupId = await sock.groupAcceptInvite(code);
      await send(`✅ Join done.\n🆔 ${groupId}`);
    } catch (e) {
      await send(`⚠️ Join/request could not be completed by this Baileys build.\n${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
