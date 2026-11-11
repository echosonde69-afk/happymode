// Joker plugin: antitagme  — commands: antitagme
// When someone tags the owner/bot account in a group, the bot replies with your saved sentence.
//   .antitagme on | off
//   .antitagme set <sentence>      (multi-line works; or reply to a message with .antitagme set)
import { commandPrivileged, getQuotedMsg, getText, readJson, sf, writeJson } from "../core/helpers.js";

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
    const { sock, msg, args, body, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const file = sf(sock, "antitagme.json");
    const v = String(args[0] || "").toLowerCase();
    const cfg = readJson(file, { enabled: false, text: "I'm busy" });
    const save = async () => {
      try { writeJson(file, cfg); return true; }
      catch (e) { await send(`❌ Save failed: ${e?.message || e}`); return false; }
    };
    if (v === "on") {
      cfg.enabled = true;
      if (await save()) await send(`✅ Antitagme ON\nReply text: ${cfg.text}`);
      return { __done: true, value: (true) };
    }
    if (v === "off") {
      cfg.enabled = false;
      if (await save()) await send("✅ Antitagme OFF");
      return { __done: true, value: (true) };
    }
    if (v === "set") {
      // Take the text from the ORIGINAL message so new lines / spacing / emojis are kept
      let t = String(body || "").replace(/^\S+\s+set\b[ \t]*/i, "").trim();
      if (!t) {
        const q = getQuotedMsg(msg);
        if (q) t = String(getText(q) || "").trim();
      }
      if (!t) { await send("❌ Sentence likho:\n.antitagme set <sentence>\n(ya kisi text message par reply karke .antitagme set)"); return { __done: true, value: (true) }; }
      if (t.length > 1000) t = t.slice(0, 1000);
      cfg.text = t;
      cfg.enabled = true;
      if (await save()) await send(`✅ Antitagme text set (ON):\n\n${t}`);
      return { __done: true, value: (true) };
    }
    await send(`🏷️ Antitagme: *${cfg.enabled ? "ON" : "OFF"}*\nText: ${cfg.text}\n\nUsage: .antitagme on|off|set <text>`);
    return { __done: true, value: (true) };
  }
};
