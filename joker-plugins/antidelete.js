// Joker plugin: antidelete  — commands: antidelete, antidel
// (extracted from routes/pairing.js line 6169; behaviour unchanged)
import { commandPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "antidelete",
  aliases: ["antidelete","antidel"],
  order: 6169,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antidelete", "antidel"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });
    // private = owner DM | chat = same chat | off = disabled
    if (v === "on" || v === "enable" || v === "private") {
      cfg.enabled = true;
      cfg.mode = "private";
      writeJson(sf(sock, "antidelete.json"), cfg);
      await send("✅ Anti-delete *ON* (private)\nDeleted messages → owner DM.");
      return { __done: true, value: (true) };
    }
    if (v === "chat" || v === "here") {
      cfg.enabled = true;
      cfg.mode = "chat";
      writeJson(sf(sock, "antidelete.json"), cfg);
      await send("✅ Anti-delete *ON* (chat)\nDeleted messages → same chat.");
      return { __done: true, value: (true) };
    }
    if (v === "off" || v === "disable") {
      cfg.enabled = false;
      cfg.mode = "off";
      writeJson(sf(sock, "antidelete.json"), cfg);
      await send("✅ Anti-delete *OFF*.");
      return { __done: true, value: (true) };
    }
    const mode = cfg.enabled ? (cfg.mode || "private") : "off";
    await send(
      `🛡️ Anti-delete: *${mode}*\n\n` +
      `Usage:\n` +
      `• .antidelete private — owner DM\n` +
      `• .antidelete chat — same chat\n` +
      `• .antidelete off — disable`
    );
    return { __done: true, value: (true) };
  
  }
};
