// Joker plugin: link  — commands: link, glink, invite
// (extracted from routes/pairing.js line 7938; behaviour unchanged)
import { isGroup } from "../core/helpers.js";

export default {
  name: "link",
  aliases: ["link","glink","invite"],
  order: 7938,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["link", "glink", "invite"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    try {
      const code = await sock.groupInviteCode(jid);
      await send(`🔗 https://chat.whatsapp.com/${code}`);
    } catch (e) { await send(`❌ Bot must be admin. ${e.message || ""}`); }
    return { __done: true, value: (true) };
  
  }
};
