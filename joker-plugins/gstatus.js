// Joker plugin: gstatus  — commands: gstatus, togroupstatus, togstatus
// (extracted from routes/pairing.js line 8239; behaviour unchanged)
import { buildSendContent, commandPrivileged, getQuotedMsg, isGroup } from "../core/helpers.js";

export default {
  name: "gstatus",
  aliases: ["gstatus","togroupstatus","togstatus"],
  order: 8239,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["gstatus", "togroupstatus", "togstatus"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };

    try {
      let targetJid = null;
      let textArgs = [...args];

      // First arg = group JID? (works from inside OR outside the group)
      const a0 = args[0] ? String(args[0]).trim() : "";
      if (a0 && (/@g\.us$/i.test(a0) || /^\d{10,}(-\d+)?@?g?\.?u?s?$/i.test(a0) || /^\d{15,}(-\d+)?$/.test(a0))) {
        const rawJ = a0.replace(/@g\.us$/i, "").replace(/@$/, "");
        // Only treat as JID if it looks like a group id (long number), not normal text
        if (/^\d{10,}(-\d+)?$/.test(rawJ)) {
          targetJid = `${rawJ}@g.us`;
          textArgs = args.slice(1);
        }
      }
      if (!targetJid && isGroup(jid)) {
        targetJid = jid;
      }

      if (!targetJid || !String(targetJid).endsWith("@g.us")) {
        await send(
          "📌 *Group Status Usage:*\n\n" +
          "• `.togstatus Hello world` — text (group ke andar)\n" +
          "• `.togstatus 120363xxx@g.us Hello` — text (bahar se / doosre group)\n" +
          "• Reply image/video/sticker + `.togstatus` — media (group ke andar)\n" +
          "• Reply media + `.togstatus 120363xxx@g.us` — media (bahar se)\n\n" +
          "Aliases: `.gstatus`  `.togroupstatus`"
        );
        return { __done: true, value: (true) };
      }

      const quoted = getQuotedMsg(msg);
      let content = null;

      // 1) Reply media / sticker / audio
      if (quoted) {
        try {
          content = await buildSendContent(sock, quoted);
        } catch (e) {
          console.error("[gstatus-build]", e?.message || e);
        }
      }

      // 2) Direct text: .togstatus [jid] some text
      if (!content) {
        const directText = textArgs.join(" ").trim();
        if (directText) content = { text: directText };
      }

      // 3) Quoted pure text message
      if (!content && quoted) {
        const txt =
          quoted.message?.conversation ||
          quoted.message?.extendedTextMessage?.text ||
          quoted.message?.imageMessage?.caption ||
          quoted.message?.videoMessage?.caption ||
          "";
        if (txt) content = { text: txt };
      }

      if (!content) {
        await send(
          "❌ Text, image, video, sticker or audio is required.\n\n" +
          "Examples:\n" +
          "• `.togstatus Hello world`\n" +
          "• Reply photo + `.togstatus`"
        );
        return { __done: true, value: (true) };
      }

      if (typeof sock.sendGroupStatus === "function") {
        await sock.sendGroupStatus(targetJid, content);
        await send("✅ Group Status posted successfully.");
        return { __done: true, value: (true) };
      }

      // Fallback (official Baileys — usually fails)
      await sock.sendMessage(targetJid, { ...content, groupStatus: true });
      await send("✅ Group Status attempted.");
    } catch (e) {
      console.error("[gstatus]", e?.message || e);
      await send(
        "❌ Failed to post Group Status.\n" +
        (e?.message || "Unknown error") +
        "\n\n• Make sure you are an admin of the target group."
      );
    }
    return { __done: true, value: (true) };
  
  }
};
