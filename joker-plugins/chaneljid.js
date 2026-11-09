// Joker plugin: chaneljid  — commands: chaneljid, channeljid
// (extracted from routes/pairing.js line 5608; behaviour unchanged)
import { chErrText, chFailureText, chFormatCard, commandPrivileged, getQuotedMsg, parseChannelInput, resolveChannelInfo, scanMessageForChannel } from "../core/helpers.js";

export default {
  name: "chaneljid",
  aliases: ["chaneljid","channeljid"],
  order: 5608,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["chaneljid","channeljid"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, prefix, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const pp = prefix || ".";
    const raw = args.join(" ").trim();
    let input = parseChannelInput(raw);
    let nameHint = "";
    let jidSource = "input";

    // No usable argument → try the replied-to message (forwarded channel post / invite card / channel link)
    if (!input.code && !input.jid) {
      try {
        const q = getQuotedMsg(msg);
        const found = q && q.message ? scanMessageForChannel(q.message) : null;
        if (found && (found.jid || found.code)) {
          input = { code: found.code || "", jid: found.jid || "" };
          nameHint = found.name || "";
          if (found.jid) jidSource = "forwarded";
        }
      } catch {}
    }

    if (!input.code && !input.jid) {
      await send(raw
        ? "❌ That doesn't look like a channel link, invite code or channel JID.\n\nExpected: https://whatsapp.com/channel/XXXXXXXX"
        : `❌ No channel given.

*Ways to use it:*
• ${pp}channeljid https://whatsapp.com/channel/XXXXXXXX
• ${pp}channeljid <invite code>
• Reply to a post forwarded from a channel (or a channel link / invite card) with ${pp}channeljid
• ${pp}chjid — list the channels this account follows`);
      return { __done: true, value: (true) };
    }

    try {
      const r = await resolveChannelInfo(sock, { code: input.code, jid: input.jid, nameHint, jidSource });
      await send(chFormatCard(r));
      await send(r.jid); // pure JID in its own message — easy to long-press & copy
    } catch (e) {
      console.warn("[channeljid] failed:", chErrText(e), JSON.stringify((e && e.attempts) || []).slice(0, 600));
      await send(chFailureText("Channel lookup failed", e, input.code ? ["", `Invite code: \`${input.code}\``] : []));
    }
    return { __done: true, value: (true) };
  
  }
};
