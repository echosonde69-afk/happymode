// Joker plugin: allow  — commands: allow
// (extracted from routes/pairing.js line 8876; behaviour unchanged)
import { commandPrivileged, grantAllowOnce, isGroup, targetNumber } from "../core/helpers.js";

export default {
  name: "allow",
  aliases: ["allow"],
  order: 8876,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "allow");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args);
    if (!n) { await send("❌ Reply or number: .allow"); return { __done: true, value: (true) }; }
    grantAllowOnce(jid, n, sock);
    await sock.sendMessage(jid, {
      text: `🎫 @${n} got *1 allow*.\nOne free rule break — then no more.`,
      mentions: [`${n}@s.whatsapp.net`]
    }, { quoted: msg });
    return { __done: true, value: (true) };
  
  }
};
