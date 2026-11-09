// Joker plugin: goodbye  — commands: goodbye, setgoodbye
// (extracted from routes/pairing.js line 6058; behaviour unchanged)
import { isAdmin, isGroup, isPrivileged, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "goodbye",
  aliases: ["goodbye","setgoodbye"],
  order: 6058,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["goodbye", "setgoodbye"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, jid, send } = __ctx;
    const { DEFAULT_GOODBYE } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Use this command inside a group."); return { __done: true, value: (true) }; }
    const metaG = await sock.groupMetadata(jid).catch(() => null);
    const senderG = msg.key.participant || msg.key.remoteJid;
    if (!isPrivileged(sock, msg) && !(metaG && isAdmin(metaG, senderG))) {
      await send("❌ Admins only.");
      return { __done: true, value: (true) };
    }
    const cfgFile = sf(sock, "goodbye.json");
    const cfg = readJson(cfgFile, {});
    const sub = (args[0] || "").toLowerCase();
    if (cmd === "goodbye" && (sub === "on" || sub === "enable" || sub === "1")) {
      const prev = cfg[jid];
      cfg[jid] = typeof prev === "object" && prev
        ? { ...prev, enabled: true }
        : { enabled: true, text: DEFAULT_GOODBYE };
      if (!cfg[jid].text) cfg[jid].text = DEFAULT_GOODBYE;
      writeJson(cfgFile, cfg);
      await send("✅ Goodbye messages *ON* for this group only.\n\n• .setgoodbye <text> — custom template\nPlaceholders: {@username} {group} {count} {time}");
      return { __done: true, value: (true) };
    }
    if (cmd === "goodbye" && (sub === "off" || sub === "disable" || sub === "0")) {
      if (cfg[jid]) {
        if (typeof cfg[jid] === "object") cfg[jid].enabled = false;
        else delete cfg[jid];
      }
      writeJson(cfgFile, cfg);
      await send("✅ Goodbye messages *OFF* for this group.");
      return { __done: true, value: (true) };
    }
    if (cmd === "setgoodbye") {
      const text = args.join(" ").trim();
      if (!text) {
        await send(
          `📝 *Set custom goodbye*\n\n` +
          `Usage:\n.setgoodbye your text here\n\n` +
          `*Placeholders:*\n` +
          `• {@username} — mention user\n` +
          `• {group} — group name\n` +
          `• {count} — current members\n` +
          `• {time} — leave time\n\n` +
          `Example:\n.setgoodbye {@username} left {group}. Now {count} members.\n\n` +
          `*Current:*\n${(typeof cfg[jid] === "object" && cfg[jid]?.text) || DEFAULT_GOODBYE}`
        );
        return { __done: true, value: (true) };
      }
      cfg[jid] = { enabled: true, text };
      writeJson(cfgFile, cfg);
      await send("✅ Goodbye template saved & enabled for this group:\n" + text);
      return { __done: true, value: (true) };
    }
    const cur = cfg[jid];
    const enabled = cur === true || (typeof cur === "object" && cur?.enabled);
    const text = (typeof cur === "object" && cur?.text) || DEFAULT_GOODBYE;
    await send(
      `👋 *Goodbye*\nStatus: *${enabled ? "ON ✅" : "OFF ❌"}* (this group only)\n\nTemplate:\n${text}\n\n` +
      `• .goodbye on\n• .goodbye off\n• .setgoodbye <text>`
    );
    return { __done: true, value: (true) };
  
  }
};
