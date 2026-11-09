// Joker plugin: setbotname  — commands: setbotname
// (extracted from routes/pairing.js line 6243; behaviour unchanged)
import { commandPrivileged, sf, writeJson } from "../core/helpers.js";

export default {
  name: "setbotname",
  aliases: ["setbotname"],
  order: 6243,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "setbotname");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const name = args.join(" ").trim();
    if (!name) { await send("❌ Usage: .setbotname New Name\n(Only changes *bot display name* used in ping/menu/alive — does NOT change WhatsApp account profile name.)"); return { __done: true, value: (true) }; }
    try {
      // Only store bot display name. Do NOT call updateProfileName —
      // WhatsApp account profile name must stay unchanged.
      writeJson(sf(sock, "bot-name.json"), { name });
      await send(`✅ Bot changed to *${name}*\n(Menu, Alive & Ping will now show this name.)`);
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
