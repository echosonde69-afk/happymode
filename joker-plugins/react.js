// Joker plugin: react  — commands: react, statusreact, sreact, autoreactstatus, autostatusreact
// (extracted from routes/pairing.js line 8652; behaviour unchanged)
import { commandPrivileged, getAutoReactConfig, readJson, saveAutoReactConfig, sf, writeJson } from "../core/helpers.js";

export default {
  name: "react",
  aliases: ["react","statusreact","sreact","autoreactstatus","autostatusreact"],
  order: 8652,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["react", "statusreact", "sreact", "autoreactstatus", "autostatusreact"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase().trim();
    const cfgFile = sf(sock, "statusreact.json");
    const cfg = readJson(cfgFile, { enabled: false });
    const ar = getAutoReactConfig(sock);
    if (v === "on" || v === "enable" || v === "1" || v === "true") {
      cfg.enabled = true;
      writeJson(cfgFile, cfg);
      ar.status = true;
      saveAutoReactConfig(ar, sock);
      await send(
        "❤️ *Status React* 🟢 *ON*\n\n" +
        "Will react ❤️ on:\n" +
        "• Personal statuses\n" +
        "• Group status posts\n" +
        "• Group status mentions"
      );
      return { __done: true, value: (true) };
    }
    if (v === "off" || v === "disable" || v === "0" || v === "false") {
      cfg.enabled = false;
      writeJson(cfgFile, cfg);
      ar.status = false;
      saveAutoReactConfig(ar, sock);
      await send("❤️ *Status React* 🔴 *OFF*");
      return { __done: true, value: (true) };
    }
    await send(
      `❤️ *Status React*: *${cfg.enabled ? "ON" : "OFF"}*\n\n` +
      `Usage:\n• .react on\n• .autostatusreact on\n• .react off\nAliases: .statusreact .sreact .autostatusreact`
    );
    return { __done: true, value: (true) };
  
  }
};
