// Joker plugin: htmode  — commands: htmode, hidetagmode
// Pure edit only (send mode removed - use .tag for that)
import { commandPrivileged } from "../core/helpers.js";

export default {
  name: "htmode",
  aliases: ["htmode","hidetagmode"],
  order: 7929,
  legacy: true,
  match(__ctx) {
    const { cmd } = __ctx;
    return (["htmode", "hidetagmode"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, prefix, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    await send(`🙈 *HIDETAG MODE*: *edit*\n\nHamesha pure edit mode active hai.\nCommand message hi edit hota hai text + mentions ke saath.\nKoi empty/ghost message nahi aata.\n\nAgar naya message bhejna ho (send style) to \`.tag\` use karo.`);
    return { __done: true, value: (true) };
  }
};
