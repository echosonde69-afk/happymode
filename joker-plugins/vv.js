// Joker plugin: vv  — commands: vv, viewonce, view
// (extracted from routes/pairing.js line 6332; behaviour unchanged)
import { commandPrivileged, getQuotedMsg, isViewOncePayload, openViewOnce } from "../core/helpers.js";

export default {
  name: "vv",
  aliases: ["vv","viewonce","view"],
  order: 6332,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["vv", "viewonce", "view"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const quoted = getQuotedMsg(msg);
    if (!quoted) { await send("❌ Reply to a view-once message."); return { __done: true, value: (true) }; }
    if (!isViewOncePayload(quoted.message) && !isViewOncePayload(msg.message)) {
      // still try open — some clients strip the wrapper after open
    }
    try {
      const content = await openViewOnce(sock, quoted);
      if (!content) { await send("❌ Could not open that view-once media."); return { __done: true, value: (true) }; }
      await sock.sendMessage(jid, content, { quoted: msg });
    } catch (e) { await send(`❌ VV failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
