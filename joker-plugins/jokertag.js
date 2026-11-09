// Joker plugin: jokertag  — commands: jokertag, jt, joker
// (extracted from routes/pairing.js line 6541; behaviour unchanged)
import { buildSendContent, getQuotedMsg, parseDelay, setJokerJob, shouldStopJoker } from "../core/helpers.js";

export default {
  name: "jokertag",
  aliases: ["jokertag","jt","joker"],
  order: 6541,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["jokertag", "jt", "joker"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!msg.key.fromMe) {
      await send("❌ Owner only.");
      return { __done: true, value: (true) };
    }

    const quoted = getQuotedMsg(msg);
    const isReply = !!quoted;

    if ((!isReply && args.length < 4) || (isReply && args.length < 3)) {
      await send(
`*🃏 JOKERTAG Usage*

*Without Delay*
.jokertag (number) (jid) (message) (amount)

*With Delay* (500ms – 72h)
.jokertag (number) #500ms (jid) (message) (amount)
.jokertag (number) #1sec (jid) (message) (amount)
.jokertag (number) #1h (jid) (message) (amount)
.jokertag (number) #72h (jid) (message) (amount)

*Reply Mode* (image / video / sticker / voice / gif)
Reply any message →
.jokertag (number) (jid) (amount)
.jokertag (number) #1sec (jid) (amount)
.jokertag (number) #1h (jid) (amount)`
      );
      return { __done: true, value: (true) };
    }

    let delay = 0;
    let startIndex = 0;

    // delay can be at index 1 (after number)
    if (args[1] && args[1].startsWith("#")) {
      const parsed = parseDelay(args[1]);
      if (!parsed.ok) {
        await send(parsed.error);
        return { __done: true, value: (true) };
      }
      delay = parsed.delay;
      startIndex = 1; // we will slice after number later carefully
    }

    const remainingArgs = args.slice(0); // full args, we'll parse manually
    const number = remainingArgs[0].replace(/\D/g, "");
    let idx = 1;
    if (remainingArgs[1] && remainingArgs[1].startsWith("#")) idx = 2;

    if (isReply) {
      // Reply: (number) [#delay] (jid) (amount)
      if (remainingArgs.length < idx + 2) {
        await send("❌ Reply mode: .jokertag (number) [#delay] (jid) (amount)");
        return { __done: true, value: (true) };
      }
      const targetJid = remainingArgs[idx];
      const amount = Number(remainingArgs[remainingArgs.length - 1]);

      if (!number || number.length < 10 || number.length > 15) {
        await send("❌ Invalid number.");
        return { __done: true, value: (true) };
      }
      if (!targetJid.endsWith("@g.us")) {
        await send("❌ Only group JID allowed for tagging.");
        return { __done: true, value: (true) };
      }
      if (isNaN(amount) || amount < 1 || amount > 500) {
        await send("❌ Amount must be between 1 and 500.");
        return { __done: true, value: (true) };
      }

      const mentionJid = number + "@s.whatsapp.net";
      let content;
      try {
        content = await buildSendContent(sock, quoted);
      } catch (e) {
        await send("❌ Failed to download media from replied message.");
        return { __done: true, value: (true) };
      }
      if (!content) {
        await send("❌ Replied message has no supported content.");
        return { __done: true, value: (true) };
      }

      // Silent tag on media (no extra empty message)
      // Text → show @number, Image/Video → caption + mentions, Voice/Sticker → mentions only
      if (content.text) {
        content.text = `@${number} ${content.text}`;
        content.mentions = [mentionJid];
      } else if (content.caption !== undefined) {
        content.caption = `@${number} ${content.caption || ""}`.trim();
        content.mentions = [mentionJid];
      } else {
        // voice / sticker / document → attach mentions only (silent tag, no extra message)
        content.mentions = [mentionJid];
      }

      setJokerJob(sock, "jt", true);
      let sent = 0;
      try {
        for (let i = 0; i < amount; i++) {
          if (shouldStopJoker(sock, "jt")) break;
          await sock.sendMessage(targetJid, content);
          sent++;
          if (i < amount - 1 && delay > 0) await new Promise(r => setTimeout(r, delay));
        }
      } finally {
        setJokerJob(sock, "jt", false);
      }
      if (sent < amount) {
        await send(`⏹ Stopped. Sent ${sent}/${amount} tagged media to ${targetJid}`);
      } else {
        await send(`✅ ${amount} tagged media sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
      }
      return { __done: true, value: (true) };
    }

    // Normal text mode
    if (remainingArgs.length < idx + 3) {
      await send("❌ Missing arguments.");
      return { __done: true, value: (true) };
    }
    const targetJid = remainingArgs[idx];
    const amount = Number(remainingArgs[remainingArgs.length - 1]);
    const message = remainingArgs.slice(idx + 1, -1).join(" ");

    if (!number || number.length < 10 || number.length > 15) {
      await send("❌ Invalid number.");
      return { __done: true, value: (true) };
    }
    if (!targetJid.endsWith("@g.us")) {
      await send("❌ Only group JID allowed for tagging.");
      return { __done: true, value: (true) };
    }
    if (isNaN(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be between 1 and 500.");
      return { __done: true, value: (true) };
    }

    const mentionJid = number + "@s.whatsapp.net";
    let warnLeft = false;
    try {
      const groupMetadata = await sock.groupMetadata(targetJid);
      const participants = groupMetadata.participants.map(p => p.id);
      const isInGroup = participants.some(id => {
        const pNum = String(id).replace(/@.+$/, "").split(":")[0].replace(/\D/g, "");
        return pNum === number || pNum.endsWith(number) || number.endsWith(pNum);
      });
      if (!isInGroup) warnLeft = true;
    } catch (err) {
      await send("❌ Failed to fetch group info. Make sure bot is in the group.");
      return { __done: true, value: (true) };
    }

    if (warnLeft) {
      await send("⚠️ Number not clearly found in group list, still trying to tag...");
    }

    setJokerJob(sock, "jt", true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, "jt")) break;
        await sock.sendMessage(targetJid, {
          text: `@${number} ${message}`,
          mentions: [mentionJid]
        });
        sent++;
        if (i < amount - 1 && delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      }
    } finally {
      setJokerJob(sock, "jt", false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount} tagged messages to ${targetJid}`);
    } else {
      await send(`✅ ${amount} tagged messages sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
    }
    return { __done: true, value: (true) };
  
  }
};
