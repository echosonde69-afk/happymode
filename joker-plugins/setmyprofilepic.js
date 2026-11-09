// Joker plugin: setmyprofilepic  — commands: setmyprofilepic, setpp, setprofilepic
// (extracted from routes/pairing.js line 5879; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import { commandOwnerOnly, getQuotedMsg, unwrapMessage } from "../core/helpers.js";

export default {
  name: "setmyprofilepic",
  aliases: ["setmyprofilepic","setpp","setprofilepic"],
  order: 5879,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["setmyprofilepic", "setpp", "setprofilepic"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, send, react } = __ctx;
    if (!commandOwnerOnly(sock, msg, send)) return { __done: true, value: (true) };
    const quoted = getQuotedMsg(msg);
    const target = quoted || msg;
    const rawMsg = target?.message || {};
    const inner = unwrapMessage(rawMsg);
    const imgMsg = inner.imageMessage || rawMsg.imageMessage;
    if (!imgMsg) {
      await send("❌ Reply to an *image* (or send image with caption)\n`.setpp` / `.setmyprofilepic`");
      return { __done: true, value: (true) };
    }
    try {
      react("📷").catch(() => {});
      const dlTarget = { key: target.key || msg.key, message: Object.keys(inner).length ? inner : rawMsg };
      const buf = await downloadMediaMessage(dlTarget, "buffer", {}, {
        logger: pino({ level: "silent" }),
        reuploadRequest: sock.updateMediaMessage
      });
      if (!buf || buf.length < 50) throw new Error("Image download failed");
      await sock.updateProfilePicture(sock.user.id, buf);
      await send("✅ Profile picture updated.");
      await react("✅");
    } catch (e) {
      await send(`❌ Failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
