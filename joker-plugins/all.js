// Joker plugin: all  — command: .all
// Tags EVERYONE in a group with WhatsApp's native @all mention. Owner / Sudo only.
//   In a group : .all [message]
//   In DM      : .all <groupJid> [message]
// (".all unfollow" still belongs to the unfollow plugin)
import { commandPrivileged } from "../core/helpers.js";

export default {
  name: "all",
  aliases: ["all"],
  order: 1240,
  match(ctx) {
    const { cmd, args } = ctx;
    return cmd === "all" && String(args?.[0] || "").toLowerCase() !== "unfollow";
  },
  async run(ctx) {
    const { sock, msg, jid, body, prefix, cmd, send } = ctx;
    if (!commandPrivileged(sock, msg, send)) return true;

    const inGroup = String(jid || "").endsWith("@g.us");
    // keep new lines / spacing exactly as typed
    let text = String(body || "").replace(/^\S+[ \t]*/, "").trim();
    let target = null;

    if (inGroup) {
      target = jid;
    } else {
      const m = text.match(/[\d-]+@g\.us/);
      if (m) {
        target = m[0];
        text = text.replace(target, "").trim();
      }
      if (!target) {
        await send(
          `📢 *ALL TAG*\n\n` +
          `*In Group:*\n*${prefix}${cmd} [message]*\n` +
          `Ex: ${prefix}${cmd} Hello guys\n\n` +
          `*In DM:*\n*${prefix}${cmd} <groupJid> [message]*\n` +
          `Ex: ${prefix}${cmd} 1234567890@g.us Hello guys`
        );
        return true;
      }
    }

    let out = text || "Hello @all";
    if (!out.toLowerCase().includes("@all")) out += "\n\n@all";

    try {
      await sock.sendMessage(target, { text: out, contextInfo: { nonJidMentions: 1 } });
      if (!inGroup) await send(`✅ All sent to ${target}`);
    } catch (e) {
      await send("❌ Failed: " + (e?.message || e));
    }
    return true;
  }
};
