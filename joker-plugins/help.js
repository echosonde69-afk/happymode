// Joker plugin: help  — commands: help
// (extracted from routes/pairing.js line 7547; behaviour unchanged)
import { getPrefix, helpText } from "../core/helpers.js";

export default {
  name: "help",
  aliases: ["help"],
  order: 7547,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "help");
  },
  async run(__ctx) {
    const { sock, prefix, send } = __ctx;
    await send(helpText(prefix === "" ? "." : getPrefix(sock)));
    return { __done: true, value: (true) };
  
  }
};
