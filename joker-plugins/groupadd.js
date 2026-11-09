// Joker plugin: groupadd  — commands: groupadd, groupaddprivacy, whoadd
// (extracted from routes/pairing.js line 8688; behaviour unchanged)
import { commandPrivileged, getPrefix } from "../core/helpers.js";

export default {
  name: "groupadd",
  aliases: ["groupadd","groupaddprivacy","whoadd"],
  order: 8688,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["groupadd", "groupaddprivacy", "whoadd"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const VALID = ["all", "contacts", "contact_blacklist"];
    const arg = String(args[0] || "").toLowerCase().trim();
    try {
      if (!arg || !VALID.includes(arg)) {
        let current = "unknown";
        try {
          const priv = await sock.fetchPrivacySettings(true);
          current = priv?.groupadd || priv?.groupAdd || priv?.groupAddPrivacy || "unknown";
        } catch {}
        await send(
`╭───『 👥 GROUP ADD 』───╮
│
│  Current  ›  *${String(current).toUpperCase()}*
│
│  Usage:
│  • ${getPrefix(sock)}groupadd all
│  • ${getPrefix(sock)}groupadd contacts
│  • ${getPrefix(sock)}groupadd contact_blacklist
│
│  all               → anyone can add
│  contacts          → contacts only
│  contact_blacklist → contacts except blocked
│
╰───────────────────╯`
        );
        return { __done: true, value: (true) };
      }
      if (typeof sock.updateGroupsAddPrivacy !== "function") {
        await send("❌ This Baileys build does not support updateGroupsAddPrivacy.");
        return { __done: true, value: (true) };
      }
      await sock.updateGroupsAddPrivacy(arg);
      await send(
`╭───『 👥 GROUP ADD 』───╮
│
│  Updated  ›  *${arg.toUpperCase()}*
│
╰───────────────────╯`
      );
    } catch (e) {
      await send(`❌ Error: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
