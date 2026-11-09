// Joker plugin: autostatusview  — commands: autostatusview, asv, avs, statusview
// (extracted from routes/pairing.js line 8621; behaviour unchanged)
import { commandPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "autostatusview",
  aliases: ["autostatusview","asv","avs","statusview"],
  order: 8621,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["autostatusview", "asv", "avs", "statusview"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase().trim();
    const cfgFile = sf(sock, "autostatusview.json");
    const cfg = readJson(cfgFile, { enabled: false });
    if (v === "on" || v === "enable" || v === "1" || v === "true") {
      cfg.enabled = true;
      writeJson(cfgFile, cfg);
      await send(
        "👀 *Auto Status View* 🟢 *ON*\n\n" +
        "Will mark as seen:\n" +
        "• Personal statuses\n" +
        "• Group status posts\n" +
        "• Group status mentions"
      );
      return { __done: true, value: (true) };
    }
    if (v === "off" || v === "disable" || v === "0" || v === "false") {
      cfg.enabled = false;
      writeJson(cfgFile, cfg);
      await send("👀 *Auto Status View* 🔴 *OFF*");
      return { __done: true, value: (true) };
    }
    await send(
      `👀 *Auto Status View*: *${cfg.enabled ? "ON" : "OFF"}*\n\n` +
      `Usage:\n• .autostatusview on\n• .autostatusview off\nAliases: .asv .avs`
    );
    return { __done: true, value: (true) };
  
  }
};
