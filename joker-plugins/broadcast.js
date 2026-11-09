// Joker plugin: broadcast  — commands: broadcast, bc
// (extracted from routes/pairing.js line 5570; behaviour unchanged)
import { commandPrivileged, jidNumber, mcKey, pendingBroadcast } from "../core/helpers.js";

export default {
  name: "broadcast",
  aliases: ["broadcast","bc"],
  order: 5570,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["broadcast","bc"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const textToSend = args.join(" ").trim();
    if (!textToSend) { await send("❌ Usage: .broadcast your message\n\nBot will list all groups.\nReply with numbers (e.g. *1,2,5*) or type *all* to send to every group."); return { __done: true, value: (true) }; }
    try {
      const groups = Object.values(await sock.groupFetchAllParticipating() || {}).sort((a, b) =>
        (a.subject || "").localeCompare(b.subject || "")
      );
      if (!groups.length) {
        await send("❌ No groups found.");
        return { __done: true, value: (true) };
      }
      const senderKey = mcKey(sock, msg.key.fromMe
        ? jidNumber(sock.user?.id)
        : jidNumber(msg.key.participant || msg.key.remoteJid || sock.user?.id));
      pendingBroadcast.set(senderKey, {
        groups: groups.map(g => ({ id: g.id, subject: g.subject || "Unknown Group" })),
        message: textToSend,
        expires: Date.now() + 5 * 60 * 1000 // 5 min
      });
      const lines = groups.map((g, i) => `${i + 1}. ${g.subject || "Unknown Group"}`).join("\n");
      await send(
`📢 *Broadcast ready*

*Message:* ${textToSend.slice(0, 200)}${textToSend.length > 200 ? "…" : ""}

📋 *All groups:*
${lines}

Reply with group numbers *or* type *all*:
• *1,2,5* — selected groups only
• *all* — every group

(You can use commas or spaces. Reply within 5 minutes.)`
      );
    } catch (e) { await send(`❌ Broadcast failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
