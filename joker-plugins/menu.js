// Joker plugin: menu  — commands: menu, commands
// (extracted from routes/pairing.js line 7538; behaviour unchanged)
import { menuText, sendMenu } from "../core/helpers.js";

export default {
  name: "menu",
  aliases: ["menu","commands"],
  order: 7538,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["menu", "commands"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    try {
      await sendMenu(sock, msg, send);
    } catch (e) {
      console.error("[menu]", e.message || e);
      await send(menuText(msg, sock));
    }
    return { __done: true, value: (true) };
  
  }
};
