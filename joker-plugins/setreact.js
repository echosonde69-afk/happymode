// Joker plugin: setreact  — commands: setreact, setract
// (extracted from routes/pairing.js line 7291; behaviour unchanged)
import { ALL_REACT_EMOJIS, DEFAULT_REACT_EMOJIS, commandPrivileged, getAutoReactConfig, parseReactEmojis, saveAutoReactConfig } from "../core/helpers.js";

export default {
  name: "setreact",
  aliases: ["setreact","setract"],
  order: 7291,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "setreact" || cmd === "setract");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const sub = String(args[0] || "").toLowerCase();
    const cfg = getAutoReactConfig(sock);

    // .setreact default / defaults — heart emojis
    if (sub === "defaults" || sub === "default") {
      cfg.reactMode = "defaults";
      cfg.reactEmojis = [...DEFAULT_REACT_EMOJIS];
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *DEFAULT*\n${DEFAULT_REACT_EMOJIS.join("")}`);
      return { __done: true, value: (true) };
    }
    // .setreact ai — understand message meaning & react accordingly
    if (sub === "ai") {
      cfg.reactMode = "ai";
      cfg.reactEmojis = [];
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(
        "✅ React mode: *AI*\n" +
        "Bot reads the message meaning (English understanding) and reacts with a matching emoji.\n" +
        "Example: love → ❤️ | funny → 😂 | sad → 😢 | thanks → 🙏"
      );
      return { __done: true, value: (true) };
    }
    // .setreact all — random rotating pool
    if (sub === "all") {
      cfg.reactMode = "all";
      cfg.reactEmojis = [...ALL_REACT_EMOJIS];
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *ALL*\n${ALL_REACT_EMOJIS.length} emojis — rotate one by one.`);
      return { __done: true, value: (true) };
    }
    // .setreact custom <emojis>  OR  .setreact ❤️🧡💛
    if (sub === "custom") {
      const custom = parseReactEmojis(args.slice(1).join("") || args.slice(1).join(" "));
      if (!custom.length) {
        await send("❌ Usage: .setreact custom ❤️🔥😂👍\nAdd 1 or more emojis.");
        return { __done: true, value: (true) };
      }
      cfg.reactMode = "custom";
      cfg.reactEmojis = custom;
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *CUSTOM*\n${custom.join("")}`);
      return { __done: true, value: (true) };
    }
    // bare emojis without "custom" keyword
    const custom = parseReactEmojis(args.join("").trim() || args.join(" "));
    if (custom.length) {
      cfg.reactMode = "custom";
      cfg.reactEmojis = custom;
      cfg.reactIndex = 0;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ React mode: *CUSTOM*\n${custom.join("")}`);
      return { __done: true, value: (true) };
    }
    await send(
`*🔄 Set React*
Current: *${cfg.reactMode || "defaults"}*

.setreact default — heart emojis
.setreact ai — smart react by message meaning
.setreact all — random rotating emojis
.setreact custom ❤️🔥😂 — your own emojis
.setreact ❤️🧡💛 — same as custom`
    );
    return { __done: true, value: (true) };
  
  }
};
