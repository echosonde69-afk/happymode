// Joker plugin: antiedit  — commands: antiedit, antied
// (extracted from routes/pairing.js line 6207; behaviour unchanged)
import { commandPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "antiedit",
  aliases: ["antiedit","antied"],
  order: 6207,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antiedit", "antied"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(sf(sock, "antiedit.json"), { enabled: true, mode: "private" });
    if (v === "on" || v === "enable" || v === "private" || v === "pm") {
      cfg.enabled = true;
      cfg.mode = "private";
      writeJson(sf(sock, "antiedit.json"), cfg);
      await send("✅ Anti-edit *ON* (private / pm)\nEdited messages → owner DM.");
      return { __done: true, value: (true) };
    }
    if (v === "chat" || v === "here") {
      cfg.enabled = true;
      cfg.mode = "chat";
      writeJson(sf(sock, "antiedit.json"), cfg);
      await send("✅ Anti-edit *ON* (chat)\nEdited messages → same chat.");
      return { __done: true, value: (true) };
    }
    if (v === "off" || v === "disable") {
      cfg.enabled = false;
      cfg.mode = "off";
      writeJson(sf(sock, "antiedit.json"), cfg);
      await send("✅ Anti-edit *OFF*.");
      return { __done: true, value: (true) };
    }
    const mode = cfg.enabled ? (cfg.mode || "private") : "off";
    await send(
      `✏️ Anti-edit: *${mode}*\n\n` +
      `Usage:\n` +
      `• .antiedit pm / private — owner DM (default)\n` +
      `• .antiedit chat — same chat\n` +
      `• .antiedit off — disable`
    );
    return { __done: true, value: (true) };
  
  }
};
