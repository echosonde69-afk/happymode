// Joker plugin: alljid  — commands: alljid
// (extracted from routes/pairing.js line 7132; behaviour unchanged)
import { isPrivileged, jidNumber, mcKey, pendingAllJid } from "../core/helpers.js";

export default {
  name: "alljid",
  aliases: ["alljid"],
  order: 7132,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "alljid");
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!isPrivileged(sock, msg)) {
      await send("❌ Owner/Sudo only.");
      return { __done: true, value: (true) };
    }

    try {
      const groups = await sock.groupFetchAllParticipating();
      const list = Object.values(groups || {}).sort((a, b) =>
        (a.subject || "").localeCompare(b.subject || "")
      );
      if (!list.length) {
        await send("❌ No groups found.");
        return { __done: true, value: (true) };
      }

      // Use bot number as key when fromMe (self-chat), else real sender
      const senderKey = mcKey(sock, msg.key.fromMe
        ? jidNumber(sock.user?.id)
        : jidNumber(msg.key.participant || msg.key.remoteJid || sock.user?.id));

      pendingAllJid.set(senderKey, {
        groups: list.map(g => ({ id: g.id, subject: g.subject || "Unknown Group" })),
        expires: Date.now() + 5 * 60 * 1000 // 5 min
      });

      const lines = list.map((g, i) => `${i + 1}. ${g.subject || "Unknown Group"}`).join("\n");
      await send(
`📋 *Which group's JID do you want?*

${lines}

Reply with the number (e.g. *1*) to get the JID.`
      );
    } catch (e) {
      console.error("alljid error:", e);
      await send("❌ Failed to fetch group list.");
    }
    return { __done: true, value: (true) };
  
  }
};
