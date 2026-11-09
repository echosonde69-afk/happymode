// Joker plugin: autoread  — commands: autoread, ar
// (extracted from routes/pairing.js line 7365; behaviour unchanged)
import { commandPrivileged, getPrefix, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "autoread",
  aliases: ["autoread","ar"],
  order: 7365,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["autoread", "ar"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const arg = String(args[0] || "").toLowerCase();
    const VALID = ["off", "all", "groups", "dms"];
    const file = sf(sock, "autoread.json");
    const cfg = readJson(file, { mode: "off" });
    if (!arg || !VALID.includes(arg)) {
      await send(
`╭───『 📖 AUTO READ 』───╮
│
│  Current  ›  *${(cfg.mode || "off").toUpperCase()}*
│
│  Usage:
│  • ${getPrefix(sock)}autoread off
│  • ${getPrefix(sock)}autoread all
│  • ${getPrefix(sock)}autoread groups
│  • ${getPrefix(sock)}autoread dms
│
╰───────────────────╯`
      );
      return { __done: true, value: (true) };
    }
    cfg.mode = arg;
    writeJson(file, cfg);
    const labels = {
      off: "Disabled — no auto-read",
      all: "ON — blue ticks in every chat",
      groups: "ON — groups only",
      dms: "ON — private chats only"
    };
    await send(
`╭───『 📖 AUTO READ 』───╮
│
│  Current  ›  *${arg.toUpperCase()}*
│  ${labels[arg] || arg}
│
╰───────────────────╯`
    );
    return { __done: true, value: (true) };
  
  }
};
