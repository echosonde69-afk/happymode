// Joker plugin: jokerall  — commands: jokerall, ja
// (extracted from routes/pairing.js line 6727; behaviour unchanged)
import { buildSendContent, getQuotedMsg, parseDelay, setJokerJob, shouldStopJoker } from "../core/helpers.js";

export default {
  name: "jokerall",
  aliases: ["jokerall","ja"],
  order: 6727,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["jokerall", "ja"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!msg.key.fromMe) {
      await send("❌ Owner only.");
      return { __done: true, value: (true) };
    }

    const quoted = getQuotedMsg(msg);
    const isReply = !!quoted;

    if ((!isReply && args.length < 3) || (isReply && args.length < 2)) {
      await send(
`*🃏 JOKERALL Usage* (Hidetag)

*Without Delay*
.jokerall (jid) (message) (amount)

*With Delay* (500ms – 72h)
.jokerall #500ms (jid) (message) (amount)
.jokerall #1sec (jid) (message) (amount)
.jokerall #1h (jid) (message) (amount)
.jokerall #72h (jid) (message) (amount)

*Reply Mode* (image / video / sticker / voice / gif)
Reply any message →
.jokerall (jid) (amount)
.jokerall #1sec (jid) (amount)
.jokerall #1h (jid) (amount)`
      );
      return { __done: true, value: (true) };
    }

    let delay = 0;
    let startIndex = 0;
    if (args[0] && args[0].startsWith("#")) {
      const parsed = parseDelay(args[0]);
      if (!parsed.ok) {
        await send(parsed.error);
        return { __done: true, value: (true) };
      }
      delay = parsed.delay;
      startIndex = 1;
    }

    const remainingArgs = args.slice(startIndex);

    let participants = [];
    const getParticipants = async (targetJid) => {
      try {
        const groupMetadata = await sock.groupMetadata(targetJid);
        return groupMetadata.participants.map(p => p.id);
      } catch (err) {
        return null;
      }
    };

    if (isReply) {
      // Reply mode: (jid) (amount)
      if (remainingArgs.length < 2) {
        await send("❌ Reply mode: .jokerall [#delay] (jid) (amount)");
        return { __done: true, value: (true) };
      }
      const targetJid = remainingArgs[0];
      const amount = Number(remainingArgs[remainingArgs.length - 1]);

      if (!targetJid.endsWith("@g.us")) {
        await send("❌ Only group JID allowed.");
        return { __done: true, value: (true) };
      }
      if (isNaN(amount) || amount < 1 || amount > 500) {
        await send("❌ Amount must be between 1 and 500.");
        return { __done: true, value: (true) };
      }

      participants = await getParticipants(targetJid);
      if (!participants) {
        await send("❌ Failed to fetch group info.\nMake sure bot is admin/member of the group.");
        return { __done: true, value: (true) };
      }

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

      // Silent hidetag on media (no extra empty message)
      content.mentions = participants;

      setJokerJob(sock, "ja", true);
      let sent = 0;
      try {
        for (let i = 0; i < amount; i++) {
          if (shouldStopJoker(sock, "ja")) break;
          await sock.sendMessage(targetJid, content);
          sent++;
          if (i < amount - 1 && delay > 0) await new Promise(r => setTimeout(r, delay));
        }
      } finally {
        setJokerJob(sock, "ja", false);
      }
      if (sent < amount) {
        await send(`⏹ Stopped. Sent ${sent}/${amount} hidetag media to ${targetJid}`);
      } else {
        await send(`✅ ${amount} hidetag media sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
      }
      return { __done: true, value: (true) };
    }

    // Normal text mode
    if (remainingArgs.length < 3) {
      await send("❌ Missing arguments.");
      return { __done: true, value: (true) };
    }

    const targetJid = remainingArgs[0];
    const amount = Number(remainingArgs[remainingArgs.length - 1]);
    const message = remainingArgs.slice(1, -1).join(" ");

    if (!targetJid.endsWith("@g.us")) {
      await send("❌ Only group JID allowed.");
      return { __done: true, value: (true) };
    }
    if (isNaN(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be between 1 and 500.");
      return { __done: true, value: (true) };
    }

    participants = await getParticipants(targetJid);
    if (!participants) {
      await send("❌ Failed to fetch group info.\nMake sure bot is admin/member of the group.");
      return { __done: true, value: (true) };
    }

    setJokerJob(sock, "ja", true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, "ja")) break;
        await sock.sendMessage(targetJid, { text: message, mentions: participants });
        sent++;
        if (i < amount - 1 && delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      }
    } finally {
      setJokerJob(sock, "ja", false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount} hidetag messages to ${targetJid}`);
    } else {
      await send(`✅ ${amount} hidetag messages sent to ${targetJid}${delay > 0 ? `\nDelay: ${delay}ms` : "\nNo Delay"}`);
    }
    return { __done: true, value: (true) };
  
  }
};
