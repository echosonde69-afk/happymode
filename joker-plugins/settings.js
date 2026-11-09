// Joker plugin: settings  — commands: settings, setting
// (extracted from routes/pairing.js line 7531; behaviour unchanged)
import { commandPrivileged } from "../core/helpers.js";

export default {
  name: "settings",
  aliases: ["settings","setting"],
  order: 7531,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["settings", "setting"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    const { settingsText } = __ctx.locals;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    await send(settingsText(sock, jid));
    return { __done: true, value: (true) };
  
  }
};
