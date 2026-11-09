// Joker plugin: antideletestatus  — commands: antideletestatus, ads, antidelstatus
// (extracted from routes/pairing.js line 8505; behaviour unchanged)
import { commandPrivileged, readJson, scanAndCacheExistingStatuses, sf, writeJson } from "../core/helpers.js";

export default {
  name: "antideletestatus",
  aliases: ["antideletestatus","ads","antidelstatus"],
  order: 8505,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antideletestatus", "ads", "antidelstatus"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase().trim();
    const cfgFile = sf(sock, "antideletestatus.json");
    const cfg = readJson(cfgFile, { enabled: true });
    if (v === "on" || v === "enable" || v === "1" || v === "true") {
      cfg.enabled = true;
      writeJson(cfgFile, cfg);
      await send(
        "🛡️ *Anti Delete Status* 🟢 *ON* (default)\n\n" +
        "• Deleted group status posts → recovered to your private chat\n" +
        "• Deleted group status mentions → recovered to your private chat\n" +
        "• On connect, bot auto-scans & caches existing statuses\n" +
        "Mode: private (owner DM only)"
      );
      // kick a background scan
      scanAndCacheExistingStatuses(sock).catch(() => {});
      return { __done: true, value: (true) };
    }
    if (v === "off" || v === "disable" || v === "0" || v === "false") {
      cfg.enabled = false;
      writeJson(cfgFile, cfg);
      await send("🛡️ *Anti Delete Status* 🔴 *OFF*");
      return { __done: true, value: (true) };
    }
    await send(
      `🛡️ *Anti Delete Status*: *${cfg.enabled ? "ON" : "OFF"}*\n\n` +
      `Usage:\n• .antideletestatus on\n• .antideletestatus off\nAlias: .ads`
    );
    return { __done: true, value: (true) };
  
  }
};
