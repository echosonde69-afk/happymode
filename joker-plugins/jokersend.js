// Joker plugin: jokersend  — commands: jokersend, jokers, js
// (extracted from routes/pairing.js line 6398; behaviour unchanged)
import { buildSendContent, getQuotedMsg, parseDelay, setJokerJob, shouldStopJoker } from "../core/helpers.js";

export default {
  name: "jokersend",
  aliases: ["jokersend","jokers","js"],
  order: 6398,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["jokersend", "jokers", "js"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!msg.key.fromMe) {
      await send("❌ Owner only.");
      return { __done: true, value: (true) };
    }

    const quoted = getQuotedMsg(msg);
    const isReply = !!quoted;

    // Usage help
    if ((!isReply && args.length < 3) || (isReply && args.length < 2)) {
      await send(
`*🃏 JOKERSEND Usage*
Alias: .js

*Without Delay*
.jokersend (jid) (message) (amount)

*With Delay* (500ms – 72h)
.jokersend #500ms (jid) (message) (amount)
.jokersend #1sec (jid) (message) (amount)
.jokersend #1h (jid) (message) (amount)

*Reply Mode* (image / video / sticker / voice / gif)
Reply any message →
.jokersend (jid) (amount)
.jokersend #1sec (jid) (amount)`
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

    if (isReply) {
      // Reply mode: (jid) (amount)
      if (remainingArgs.length < 2) {
        await send("❌ Reply mode: .jokers [#delay] (jid) (amount)");
        return { __done: true, value: (true) };
      }
      const targetJid = remainingArgs[0];
      const amount = Number(remainingArgs[remainingArgs.length - 1]);

      if (!/^[0-9]+@(g\.us|s\.whatsapp\.net|lid)$/i.test(targetJid)) {
        await send("❌ Invalid JID.\nAllowed: number@g.us | number@s.whatsapp.net | number@lid");
        return { __done: true, value: (true) };
      }
      if (isNaN(amount) || amount < 1 || amount > 500) {
        await send("❌ Amount must be between 1 and 500.");
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

      setJokerJob(sock, "js", true);
      let sent = 0;
      try {
        for (let i = 0; i < amount; i++) {
          if (shouldStopJoker(sock, "js")) break;
          await sock.sendMessage(targetJid, content);
          sent++;
          if (i < amount - 1 && delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } finally {
        setJokerJob(sock, "js", false);
      }
      if (sent < amount) {
        await send(`⏹ Stopped. Sent ${sent}/${amount} to ${targetJid}`);
      } else {
        await send(`✅ ${amount} media/messages sent to ${targetJid}${delay > 0 ? ` (Delay: ${delay}ms)` : " (No delay)"}`);
      }
      return { __done: true, value: (true) };
    }

    // Normal text mode: (jid) (message) (amount)
    if (remainingArgs.length < 3) {
      await send("❌ Usage: .jokers [#delay] (jid) (message) (amount)");
      return { __done: true, value: (true) };
    }

    const targetJid = remainingArgs[0];
    const amount = Number(remainingArgs[remainingArgs.length - 1]);
    const message = remainingArgs.slice(1, -1).join(" ");

    if (!/^[0-9]+@(g\.us|s\.whatsapp\.net|lid)$/i.test(targetJid)) {
      await send("❌ Invalid JID.\nAllowed: number@g.us | number@s.whatsapp.net | number@lid");
      return { __done: true, value: (true) };
    }
    if (isNaN(amount) || amount < 1 || amount > 500) {
      await send("❌ Amount must be between 1 and 500.");
      return { __done: true, value: (true) };
    }

    setJokerJob(sock, "js", true);
    let sent = 0;
    try {
      for (let i = 0; i < amount; i++) {
        if (shouldStopJoker(sock, "js")) break;
        await sock.sendMessage(targetJid, { text: message });
        sent++;
        if (i < amount - 1 && delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } finally {
      setJokerJob(sock, "js", false);
    }

    if (sent < amount) {
      await send(`⏹ Stopped. Sent ${sent}/${amount} to ${targetJid}`);
    } else {
      await send(`✅ ${amount} messages sent to ${targetJid}${delay > 0 ? ` (Delay: ${delay}ms)` : " (No delay)"}`);
    }
    return { __done: true, value: (true) };
  
  }
};
