// Joker plugin: modegrop  — commands: modegrop, modegroup
// (extracted from routes/pairing.js line 6139; behaviour unchanged)
import { commandPrivileged, sf, writeJson } from "../core/helpers.js";

export default {
  name: "modegrop",
  aliases: ["modegrop","modegroup"],
  order: 6139,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["modegrop","modegroup"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    writeJson(sf(sock, "mode.json"), { mode: "group" });
    await send("✅ Mode set to *group*.");
    return { __done: true, value: (true) };
  
  }
};
