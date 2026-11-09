// Joker plugin: autoreact  — commands: autoreact
// (extracted from routes/pairing.js line 7204; behaviour unchanged)
import { commandPrivileged, getAutoReactConfig, isGroup, parseOnOff, readJson, saveAutoReactConfig, sf, writeJson } from "../core/helpers.js";

export default {
  name: "autoreact",
  aliases: ["autoreact"],
  order: 7204,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "autoreact");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const sub = String(args[0] || "").toLowerCase();
    const value = parseOnOff(args[1]);
    const cfg = getAutoReactConfig(sock);

    // .autoreact on/off — master
    if (sub === "on" || sub === "off") {
      cfg.enabled = sub === "on";
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react master: *${cfg.enabled ? "ON" : "OFF"}*`);
      return { __done: true, value: (true) };
    }
    // .autoreact all on/off
    if (sub === "all" && value !== null) {
      cfg.all = value;
      cfg.enabled = value || cfg.enabled;
      cfg.dm = value;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react *ALL*: *${value ? "ON" : "OFF"}*`);
      return { __done: true, value: (true) };
    }
    // .autoreact dm on/off
    if (sub === "dm" && value !== null) {
      cfg.dm = value;
      cfg.enabled = value || cfg.enabled;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react *DM*: *${value ? "ON" : "OFF"}*`);
      return { __done: true, value: (true) };
    }
    // .autoreact group on/off
    if ((sub === "group" || sub === "grp") && value !== null) {
      if (!isGroup(jid)) { await send("❌ .autoreact group on/off only in a group."); return { __done: true, value: (true) }; }
      cfg.groups[jid] = value;
      cfg.enabled = value || cfg.enabled;
      saveAutoReactConfig(cfg, sock);
      await send(`✅ Auto-react *this group*: *${value ? "ON" : "OFF"}*`);
      return { __done: true, value: (true) };
    }
    // .autoreact command on/off — react on valid bot commands with menu emoji
    if ((sub === "command" || sub === "cmd" || sub === "commands") && value !== null) {
      cfg.command = value;
      saveAutoReactConfig(cfg, sock);
      await send(
        `✅ Auto-react *COMMAND*: *${value ? "ON" : "OFF"}*\n` +
        `When ON → bot reacts on every valid command with that command's menu emoji.\n` +
        `Respects mode: private = owner/sudo only; public/dm/group = as mode allows.`
      );
      return { __done: true, value: (true) };
    }

    // .autoreact status on/off — all status types (personal + group status + mentions)
    if ((sub === "status" || sub === "statuses") && value !== null) {
      cfg.status = value;
      saveAutoReactConfig(cfg, sock);
      const srFile = sf(sock, "statusreact.json");
      writeJson(srFile, { enabled: value });
      await send(
        `✅ Auto-react *STATUS*: *${value ? "ON" : "OFF"}*\n` +
        `Personal + group status + group-status mentions pe ❤️`
      );
      return { __done: true, value: (true) };
    }

    const gOn = isGroup(jid) ? (cfg.groups[jid] ? "ON" : "OFF") : "n/a";
    const srOn = readJson(sf(sock, "statusreact.json"), { enabled: false }).enabled || cfg.status;
    await send(
`*😊 Auto React*
• Master   : *${cfg.enabled ? "ON" : "OFF"}*
• ALL      : *${cfg.all ? "ON" : "OFF"}*
• DM       : *${cfg.dm ? "ON" : "OFF"}*
• Group    : *${gOn}*
• Command  : *${cfg.command ? "ON" : "OFF"}*
• Status   : *${srOn ? "ON" : "OFF"}*
• Mode     : *${cfg.reactMode || "defaults"}*

Usage:
.autoreact all on/off
.autoreact dm on/off
.autoreact group on/off
.autoreact command on/off
.autoreact status on/off
.autoreact on/off`
    );
    return { __done: true, value: (true) };
  
  }
};
