// Joker plugin: welcome  — commands: welcome, setwelcome
// (extracted from routes/pairing.js line 6003; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "welcome",
  aliases: ["welcome","setwelcome"],
  order: 6003,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["welcome", "setwelcome"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, jid, send } = __ctx;
    const { DEFAULT_WELCOME, WELCOME_HINT } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Use this command inside a group."); return { __done: true, value: (true) }; }
    // Admin OR owner/sudo
    const metaW = await sock.groupMetadata(jid).catch(() => null);
    const senderW = msg.key.participant || msg.key.remoteJid;
    if (!isPrivileged(sock, msg) && !(metaW && isAdmin(metaW, senderW))) {
      await send("❌ Admins only.");
      return { __done: true, value: (true) };
    }
    const cfgFile = sf(sock, "welcome.json");
    const cfg = readJson(cfgFile, {});
    const sub = (args[0] || "").toLowerCase();
    if (cmd === "welcome" && (sub === "on" || sub === "enable" || sub === "1")) {
      const prev = cfg[jid];
      cfg[jid] = typeof prev === "object" && prev
        ? { ...prev, enabled: true }
        : { enabled: true, text: DEFAULT_WELCOME };
      if (!cfg[jid].text) cfg[jid].text = DEFAULT_WELCOME;
      writeJson(cfgFile, cfg);
      await send("✅ Welcome messages *ON* for this group only.\n\n• .setwelcome <text> — custom template\nPlaceholders: {@username} {group} {count} {time}");
      return { __done: true, value: (true) };
    }
    if (cmd === "welcome" && (sub === "off" || sub === "disable" || sub === "0")) {
      if (cfg[jid]) {
        if (typeof cfg[jid] === "object") cfg[jid].enabled = false;
        else delete cfg[jid];
      }
      writeJson(cfgFile, cfg);
      await send("✅ Welcome messages *OFF* for this group.");
      return { __done: true, value: (true) };
    }
    if (cmd === "setwelcome") {
      const text = args.join(" ").trim();
      if (!text) {
        await send(
          WELCOME_HINT +
          `\n\n*Current template:*\n${(typeof cfg[jid] === "object" && cfg[jid]?.text) || DEFAULT_WELCOME}`
        );
        return { __done: true, value: (true) };
      }
      cfg[jid] = { enabled: true, text };
      writeJson(cfgFile, cfg);
      await send("✅ Welcome template saved & enabled for this group:\n" + text);
      return { __done: true, value: (true) };
    }
    const cur = cfg[jid];
    const enabled = cur === true || (typeof cur === "object" && cur?.enabled);
    const text = (typeof cur === "object" && cur?.text) || DEFAULT_WELCOME;
    await send(
      `👋 *Welcome*\nStatus: *${enabled ? "ON ✅" : "OFF ❌"}* (this group only)\n\nTemplate:\n${text}\n\n` +
      `• .welcome on\n• .welcome off\n• .setwelcome <text>`
    );
    return { __done: true, value: (true) };
  
  }
};
