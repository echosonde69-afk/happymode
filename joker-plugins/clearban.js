// Joker plugin: clearban  — commands: clearban, clerban
// (extracted from routes/pairing.js line 5499; behaviour unchanged)
import { commandPrivileged, sf, writeJson } from "../core/helpers.js";

export default {
  name: "clearban",
  aliases: ["clearban","clerban"],
  order: 5499,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["clearban","clerban"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    writeJson(sf(sock, "ban.json"), []);
    await send("✅ Ban list cleared.");
    return { __done: true, value: (true) };
  
  }
};
