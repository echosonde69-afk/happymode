// Joker plugin: hello  — commands: hello
// (extracted from routes/pairing.js line 5933; behaviour unchanged)
import { commandPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "hello",
  aliases: ["hello"],
  order: 5933,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "hello");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const sub = String(args[0] || "").toLowerCase();
    const cfgFile = sf(sock, "hello.json");
    const cfg = readJson(cfgFile, { enabled: false });
    if (sub === "on" || sub === "enable" || sub === "1") {
      cfg.enabled = true;
      writeJson(cfgFile, cfg);
      await send("✅ Hello auto-reply *ON*\nWhen others type *hello* → bot replies *how are you* (1s delay).\nOwner/bot messages ignored.");
      return { __done: true, value: (true) };
    }
    if (sub === "off" || sub === "disable" || sub === "0") {
      cfg.enabled = false;
      writeJson(cfgFile, cfg);
      await send("✅ Hello auto-reply *OFF*");
      return { __done: true, value: (true) };
    }
    await send(`👋 Hello auto-reply: *${cfg.enabled ? "ON" : "OFF"}*\n\n• .hello on\n• .hello off\n\n_Only exact command toggles this. Typing "hello" alone does nothing for owner._`);
    return { __done: true, value: (true) };
  
  }
};
