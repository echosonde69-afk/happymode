// Joker plugin: viewone  — commands: viewone, viewonceauto, antiviewonce
// (extracted from routes/pairing.js line 6369; behaviour unchanged)
import { commandPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "viewone",
  aliases: ["viewone","viewonceauto","antiviewonce"],
  order: 6369,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["viewone", "viewonceauto", "antiviewonce"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase();
    if (!["on", "off", "dm", "here"].includes(v)) {
      const cfg = readJson(sf(sock, "viewonce.json"), { enabled: false, mode: "dm" });
      await send(`👁️ *ANTIVIEWONCE / VIEWONE*\nStatus: *${cfg.enabled ? "ON" : "OFF"}* (mode: ${cfg.mode})\n\nUsage:\n• .antiviewonce on|off\n• .viewone on|off|dm|here\n\n*REACT (owner only, always works):* 🐲 = open here (no details) | any other emoji = owner DM with details\n\n*on* = ALSO auto-forward every view-once to owner DM\n*dm* = same as on\n*here* = open in current chat\n*off* = disable`);
      return { __done: true, value: (true) };
    }
    // .antiviewonce on  → always owner DM (exact Zain behaviour)
    // .viewone on       → keep previous mode or dm
    // .viewone dm|here  → set mode
    if (v === "on") {
      const prev = readJson(sf(sock, "viewonce.json"), { mode: "dm" });
      const mode = (cmd === "antiviewonce") ? "dm" : (prev.mode || "dm");
      writeJson(sf(sock, "viewonce.json"), { enabled: true, mode });
    } else if (v === "off") {
      const prev = readJson(sf(sock, "viewonce.json"), { mode: "dm" });
      writeJson(sf(sock, "viewonce.json"), { enabled: false, mode: prev.mode || "dm" });
    } else {
      writeJson(sf(sock, "viewonce.json"), { enabled: true, mode: v === "here" ? "here" : "dm" });
    }
    const cfg = readJson(sf(sock, "viewonce.json"), { enabled: false, mode: "dm" });
    await send(`✅ *ANTIVIEWONCE* ${cfg.enabled ? "ON" : "OFF"} — mode: *${cfg.mode}*\n${cfg.enabled && cfg.mode === "dm" ? "View-once media will now be forwarded to the owner DM instantly." : ""}`);
    return { __done: true, value: (true) };
  
  }
};
