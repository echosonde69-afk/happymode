// Joker plugin: lastseen  — commands: lastseen
// (extracted from routes/pairing.js line 6145; behaviour unchanged)
import { commandPrivileged } from "../core/helpers.js";

export default {
  name: "lastseen",
  aliases: ["lastseen"],
  order: 6145,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "lastseen");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const value = String(args[0] || "none").toLowerCase();
    if (!["none","all","contacts","contact_blacklist"].includes(value)) {
      await send("Usage: .lastseen none | all | contacts | contact_blacklist");
      return { __done: true, value: (true) };
    }
    if (typeof sock.updateLastSeenPrivacy !== "function") {
      await send("❌ This Baileys build does not expose last-seen privacy control.");
      return { __done: true, value: (true) };
    }
    try {
      await sock.updateLastSeenPrivacy(value);
      await send(`✅ Last seen privacy set to *${value}*.`);
    } catch (e) { await send(`❌ Failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
