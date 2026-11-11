// ATTACK BUILD ONLY — password gate for .bug / .sbug / .forceclose
// Strip this file on RV (release).
import {
  allowBugAttack,
  getBugPassword,
  isDeveloper,
  isGroup,
  requestBugAuth,
  tryConsumeBugPassword
} from "../core/helpers.js";

export default {
  name: "bugauth",
  aliases: [],
  order: 50, // early
  match(__ctx) {
    // Intercept plain password replies when auth is pending
    const { sock, msg, cmd } = __ctx;
    if (cmd) return false; // only plain messages
    return !!tryConsumeBugPassword(sock, msg);
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    const consumed = tryConsumeBugPassword(sock, msg);
    if (!consumed) return false;
    try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
    // Mark authed window already set inside tryConsumeBugPassword
    await send("🔓 Auth OK — 2 min. Ab command dubara bhejo: .bug crash | .sbug | .forceclose");
    return { __done: true, value: true };
  }
};
