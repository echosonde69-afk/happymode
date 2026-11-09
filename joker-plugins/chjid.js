// Joker plugin: chjid  — commands: chjid
// (extracted from routes/pairing.js line 5668; behaviour unchanged)
import { chErrText, chFailureText, chFetchFollowed, chPickKind, commandPrivileged, jidNumber, mcKey, pendingChJid } from "../core/helpers.js";

export default {
  name: "chjid",
  aliases: ["chjid"],
  order: 5668,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "chjid");
  },
  async run(__ctx) {
    const { sock, msg, prefix, args, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const pp = prefix || ".";
    const filter = args.join(" ").trim().toLowerCase();
    try {
      const res = await chFetchFollowed(sock);
      let list = res.list;
      if (filter) list = list.filter(c => String(c.name || "").toLowerCase().includes(filter) || String(c.id).includes(filter));

      if (!list.length) {
        if (filter && res.list.length) {
          await send(`❌ No followed channel matches "${filter}".\n\nSend *${pp}chjid* without a filter to see all ${res.list.length}.`);
        } else if (res.liveOk) {
          await send(`❌ No followed channels found.\n\nThis account does not follow any channel yet. Follow one with the bot's number, then try *${pp}chjid* again.\nTip: you can also reply to a forwarded channel post with *${pp}channeljid*.`);
        } else {
          const kind = chPickKind(res.attempts);
          console.warn("[chjid] failed:", JSON.stringify(res.attempts).slice(0, 600));
          await send(chFailureText("Followed channels list failed", { kind, attempts: res.attempts }));
        }
        return { __done: true, value: (true) };
      }

      pendingChJid.set(mcKey(sock, jidNumber(msg.key.fromMe ? sock.user?.id : (msg.key.participant || msg.key.remoteJid || jid))), {
        channels: list.map(c => ({ id: c.id, name: c.name })),
        expires: Date.now() + 5 * 60 * 1000
      });
      let note = "";
      if (res.source === "sniffed") note = "\n\n⚠️ WhatsApp's list reply was unreadable, so these IDs were recovered from raw data (names may be missing).";
      else if (res.source === "cache") note = "\n\n⚠️ Live list is unavailable right now. Showing channels this bot resolved or saw earlier (may be incomplete).";
      await send(`📣 *Followed Channels* (${list.length})\n\n${list.map((c, i) => `${i + 1}. ${c.name}`).join("\n")}\n\nReply with a number to get its JID, or *all* to get every JID.${note}`);
    } catch (e) {
      console.warn("[chjid] error:", chErrText(e));
      await send(chFailureText("Followed channels list failed", e));
    }
    return { __done: true, value: (true) };
  
  }
};
