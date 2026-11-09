// Joker plugin: jokerhelp  — commands: jokerhelp, jokerhel, jhelp
// (extracted from routes/pairing.js line 7551; behaviour unchanged)
import { getPrefix, jokerHelpText } from "../core/helpers.js";

export default {
  name: "jokerhelp",
  aliases: ["jokerhelp","jokerhel","jhelp"],
  order: 7551,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["jokerhelp", "jokerhel", "jhelp"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, prefix, send } = __ctx;
    await send(jokerHelpText(prefix === "" ? "." : getPrefix(sock)));
    return { __done: true, value: (true) };
  
  }
};
