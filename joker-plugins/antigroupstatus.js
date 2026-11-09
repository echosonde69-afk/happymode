// Joker plugin: antigroupstatus  — commands: antigroupstatus, ags
// (extracted from routes/pairing.js line 8458; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "antigroupstatus",
  aliases: ["antigroupstatus","ags"],
  order: 8458,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antigroupstatus", "ags"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };

    const cfgFile = sf(sock, "antigroupstatus.json");
    const cfg = readJson(cfgFile, {});
    const raw = cfg[jid];
    const currentEnabled = typeof raw === "object" ? !!raw.enabled : !!raw && raw !== "off";
    const currentAction = typeof raw === "object" ? String(raw.action || "warn") : String(raw || "off");
    const a0 = String(args[0] || "").toLowerCase().trim();
    const a1 = String(args[1] || "").toLowerCase().trim();

    let mode = null;
    if (a0 === "off" || a1 === "off") mode = "off";
    else if (["warn", "delete", "kick"].includes(a0)) mode = a0;
    else if (a0 === "on") mode = "warn";

    if (!mode) {
      await send(
        `📢 *ANTI GROUP STATUS*\n` +
        `${currentEnabled ? "🟢 *ENABLED*" : "🔴 *DISABLED*"}\n` +
        `⚙️ Action: *${currentEnabled ? currentAction.toUpperCase() : "OFF"}*\n` +
        `🎯 Acts only on *real Group Status posts*.\n` +
        `❌ Does nothing on group-status *mentions*.\n` +
        `   (for mentions use \`.antigroupmention\` / \`.agm\`)\n\n` +
        `📌 Usage: *.antigroupstatus <action>*\n` +
        `🔹 warn  •  delete  •  kick  •  off\n` +
        `🔗 Alias: *.ags*`
      );
      return { __done: true, value: (true) };
    }

    if (mode === "off") {
      cfg[jid] = { enabled: false, action: currentAction || "warn" };
      writeJson(cfgFile, cfg);
      await send(`📢 *ANTI GROUP STATUS*\n🔴 *DISABLED*\n⚙️ Action: *${(currentAction || "warn").toUpperCase()}*`);
      return { __done: true, value: (true) };
    }

    // New mode replaces the old one; modes never stack.
    cfg[jid] = { enabled: true, action: mode };
    writeJson(cfgFile, cfg);
    await send(`📢 *ANTI GROUP STATUS*\n🟢 *ENABLED*\n⚙️ Action: *${mode.toUpperCase()}*`);
    return { __done: true, value: (true) };
  
  }
};
