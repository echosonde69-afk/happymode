// Joker plugin: bom  — commands: bom, bomall, bomtag
// (extracted from routes/pairing.js line 6893; behaviour unchanged)
import { buildSendContent, extractRecoverableContent, findParticipantJid, getQuotedMsg, isGroup, isPrivileged, normalizeJid, parseDelayBom, setJokerJob, shouldStopJoker } from "../core/helpers.js";

export default {
  name: "bom",
  aliases: ["bom","bomall","bomtag"],
  order: 6893,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["bom", "bomall", "bomtag"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, jid, send } = __ctx;
    if (!msg.key.fromMe && !isPrivileged(sock, msg)) {
      await send("❌ Owner only.");
      return { __done: true, value: (true) };
    }

    const isBomAll = cmd === "bomall";
    const isBomTag = cmd === "bomtag";
    const jobType = isBomAll ? "ba" : isBomTag ? "bt" : "bom";

    let delayMs = 0;
    let startIndex = 0;
    if (args[0] && String(args[0]).startsWith("#")) {
      const parsed = parseDelayBom(args[0]);
      if (!parsed.ok) {
        await send(parsed.error);
        return { __done: true, value: (true) };
      }
      delayMs = parsed.delay;
      startIndex = 1;
    }

    const remaining = args.slice(startIndex);
    let amount;
    let tagNumber = "";
    let textMessage = "";

    if (isBomTag) {
      // .bomtag [#delay] <number> <amount>   OR   .bomtag [#delay] <number> <message...> <amount>
      if (remaining.length < 2) {
        await send(
`*💣 BOMTAG Usage*

Reply mode:
.bomtag 92xxxxxxxxx 5
.bomtag #500ms 92xxxxxxxxx 5

Text mode:
.bomtag 92xxxxxxxxx Hello world 5
.bomtag #500ms 92xxxxxxxxx Hello world 5

↳ Reply to media/text OR put message before amount.`
        );
        return { __done: true, value: (true) };
      }
      tagNumber = String(remaining[0] || "").replace(/\D/g, "");
      if (!tagNumber || tagNumber.length < 8 || tagNumber.length > 15) {
        await send("❌ Invalid number.");
        return { __done: true, value: (true) };
      }
      amount = Number(remaining[remaining.length - 1]);
      if (remaining.length > 2) {
        textMessage = remaining.slice(1, -1).join(" ").trim();
      }
    } else {
      // .bom [#delay] <amount>                  (reply required)
      // .bom [#delay] <message...> <amount>     (text spam)
      if (remaining.length < 1) {
        await send(
`*💣 BOM Usage*

Reply mode:
.bom 5
.bom #500ms 5
.bomall 5
.bomall #500ms 5

Text mode (no reply needed):
.bom Hello world 5
.bom #500ms Hello world 5
.bomall Hello everyone 10

↳ Reply to media/text OR write message then amount (1-500).`
        );
        return { __done: true, value: (true) };
      }
      amount = Number(remaining[remaining.length - 1]);
      if (remaining.length > 1) {
        textMessage = remaining.slice(0, -1).join(" ").trim();
      }
    }

    if (!Number.isInteger(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be a whole number between 1 and 500.");
      return { __done: true, value: (true) };
    }

    // Content: prefer quoted media/text; else use textMessage
    const quoted = getQuotedMsg(msg);
    let content = null;
    if (quoted) {
      try {
        content = await buildSendContent(sock, quoted);
        if (!content) content = await extractRecoverableContent(sock, quoted);
      } catch (e) {
        console.error("[BOM] failed to build quoted content:", e?.message || e);
      }
    }
    if (!content && textMessage) {
      content = { text: textMessage };
    }
    if (!content) {
      await send("❌ Reply to a message/media OR provide a text message before the amount.\nExample: .bom Hello 10");
      return { __done: true, value: (true) };
    }

    if (isBomAll && !isGroup(jid)) {
      await send("❌ `.bomall` only works inside the current group.");
      return { __done: true, value: (true) };
    }

    let mentions = [];
    if (isBomAll) {
      try {
        const meta = await sock.groupMetadata(jid);
        mentions = (meta?.participants || [])
          .map(p => p?.id || p?.jid || p?.participant)
          .filter(Boolean);
      } catch (e) {
        await send("❌ Could not load current group members: " + (e?.message || e));
        return { __done: true, value: (true) };
      }
    } else if (isBomTag) {
      let tagJid = normalizeJid(tagNumber);
      if (isGroup(jid)) {
        try {
          const meta = await sock.groupMetadata(jid);
          const found = findParticipantJid(meta, tagNumber);
          if (found) tagJid = found;
        } catch {}
      }
      mentions = [tagJid];
    }

    const sendPayload = () => {
      const payload = { ...content };
      if (mentions.length) payload.mentions = [...mentions];
      return payload;
    };

    // Safety: if no delay, force small yield to reduce server overload / ban risk
    const effectiveDelay = delayMs > 0 ? delayMs : 80;

    setJokerJob(sock, jobType, true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, jobType)) break;
        await sock.sendMessage(jid, sendPayload());
        sent++;
        if (i < amount - 1) {
          await new Promise(resolve => setTimeout(resolve, effectiveDelay));
        }
      }
    } finally {
      setJokerJob(sock, jobType, false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount}${isBomAll ? " hidetag messages" : isBomTag ? " tagged messages" : " messages"}.`);
    } else {
      const modeText = isBomAll
        ? "hidetag messages in this group"
        : isBomTag
          ? `tagged messages for ${tagNumber}`
          : "messages in this chat";
      await send(
        `✅ ${amount} ${modeText}` +
        (delayMs > 0 ? `\nDelay: ${delayMs}ms` : "\nAuto-yield: 80ms (no delay set)")
      );
    }
    return { __done: true, value: (true) };
  
  }
};
