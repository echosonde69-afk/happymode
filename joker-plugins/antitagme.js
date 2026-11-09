// Joker plugin: antitagme  — commands: antitagme
// (extracted from routes/pairing.js line 8196; behaviour unchanged)
import { commandPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "antitagme",
  aliases: ["antitagme"],
  order: 8196,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "antitagme");
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(sf(sock, "antitagme.json"), { enabled: false, text: "I'm busy" });
    if (v === "on") { cfg.enabled = true; writeJson(sf(sock, "antitagme.json"), cfg); await send("✅ Antitagme ON — reply: I'm busy"); return { __done: true, value: (true) }; }
    if (v === "off") { cfg.enabled = false; writeJson(sf(sock, "antitagme.json"), cfg); await send("✅ Antitagme OFF"); return { __done: true, value: (true) }; }
    if (v === "set") {
      const t = args.slice(1).join(" ").trim() || "I'm busy";
      cfg.text = t; cfg.enabled = true; writeJson(sf(sock, "antitagme.json"), cfg);
      await send(`✅ Antitagme text: *${t}*`);
      return { __done: true, value: (true) };
    }
    await send(`🏷️ Antitagme: *${cfg.enabled ? "ON" : "OFF"}*\nText: ${cfg.text}\nUsage: .antitagme on|off|set <text>`);
    return { __done: true, value: (true) };
  
  }
};
