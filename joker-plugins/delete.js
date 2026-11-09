// Joker plugin: delete  — commands: delete, del, det
// (extracted from routes/pairing.js line 5705; behaviour unchanged)
import { delay } from "@whiskeysockets/baileys";
import { commandPrivileged, getContext, getQuotedMsg, jidNumber, mcKey, recentMsgStore } from "../core/helpers.js";

export default {
  name: "delete",
  aliases: ["delete","del","det"],
  order: 5705,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["delete", "del", "det"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };

    const ctx = getContext(msg);
    const quoted = getQuotedMsg(msg);
    const rawArgs = args.map(a => String(a || "").trim()).filter(Boolean);
    const lowerArgs = rawArgs.map(a => a.toLowerCase());
    const botNum = jidNumber(sock.user?.id || sock.__botNumber || "");

    // Detect "last N" premium mode
    let lastN = 0;
    const lastIdx = lowerArgs.findIndex(a => a === "last");
    if (lastIdx >= 0) {
      const nStr = lowerArgs[lastIdx + 1] || lowerArgs.find((a, i) => i !== lastIdx && /^\d+$/.test(a));
      lastN = Math.max(0, parseInt(nStr || "0", 10) || 0);
    } else if (/^\d+$/.test(lowerArgs[0] || "") && quoted) {
      lastN = parseInt(lowerArgs[0], 10) || 0;
    }

    // Build a correct delete-key from quote context (handles bot + user msgs)
    function buildDeleteKeyFromQuote() {
      if (!ctx?.stanzaId) return quoted?.key || null;
      const key = {
        remoteJid: jid,
        id: ctx.stanzaId,
        fromMe: false
      };
      if (ctx.participant) {
        key.participant = ctx.participant;
        const pNum = jidNumber(ctx.participant);
        // Quoted message is from bot if participant matches bot number
        if (botNum && pNum === botNum) key.fromMe = true;
      } else {
        // No participant → often bot/own message in group or DM
        // Check recent store for this id
        const found = (recentMsgStore.get(mcKey(sock, jid)) || []).find(m => m.key?.id === ctx.stanzaId);
        if (found) {
          key.fromMe = !!found.fromMe;
          if (found.key.participant) key.participant = found.key.participant;
        } else {
          // Fallback: try fromMe true (bot/owner) then false
          key.fromMe = true;
        }
      }
      if (typeof ctx.fromMe === "boolean") key.fromMe = ctx.fromMe;
      return key;
    }

    if (lastN > 0) {
      const mentioned = (ctx.mentionedJid || []).map(x => String(x));
      let targetNum = "";
      let targetIsBot = false;

      if (mentioned.length) {
        targetNum = jidNumber(mentioned[0]);
      } else if (quoted || ctx.stanzaId) {
        const qKey = buildDeleteKeyFromQuote();
        if (qKey?.fromMe) {
          targetIsBot = true;
          targetNum = botNum;
        } else {
          targetNum = jidNumber(qKey?.participant || ctx.participant || "");
        }
      } else {
        for (const a of rawArgs) {
          const n = String(a).replace(/\D/g, "");
          if (n.length >= 7 && n.length <= 15) {
            targetNum = n;
            break;
          }
        }
      }

      // Explicit "me" / "bot" / "self"
      if (["me", "bot", "self", "own"].includes(lowerArgs[0]) || lowerArgs.includes("bot") || lowerArgs.includes("me")) {
        targetIsBot = true;
        targetNum = botNum;
      }

      if (!targetNum && !targetIsBot) {
        await send("❌ Premium delete:\n• Reply: `.delete last 5`\n• Bot msgs: `.delete last 5` (reply bot) or `.delete bot last 5`\n• `.delete @user last 5`");
        return { __done: true, value: (true) };
      }

      const list = (recentMsgStore.get(mcKey(sock, jid)) || []).filter(m => {
        if (m.key?.id === msg.key?.id) return false;
        if (targetIsBot || (botNum && targetNum === botNum)) {
          return !!m.fromMe || jidNumber(m.participant || m.key?.participant || "") === botNum;
        }
        const pNum = jidNumber(m.participant || m.key?.participant || "");
        return pNum && pNum === targetNum && !m.fromMe;
      });

      const toDelete = list.slice(-lastN).reverse();
      if (!toDelete.length) {
        await send("❌ No recent visible messages found for that target (bot must have seen them).");
        return { __done: true, value: (true) };
      }

      for (const item of toDelete) {
        try {
          const delKey = {
            remoteJid: jid,
            id: item.key.id,
            fromMe: !!item.fromMe
          };
          if (item.key.participant) delKey.participant = item.key.participant;
          else if (item.participant) delKey.participant = item.participant;
          await sock.sendMessage(jid, { delete: delKey });
        } catch (e) {
          console.error("[delete last]", e?.message || e);
        }
        await delay(120);
      }
      try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
      return { __done: true, value: (true) };
    }

    // Basic: reply → delete that one message
    if (!ctx?.stanzaId && !quoted) {
      await send("❌ Reply to a message to delete it.\nPremium: `.delete last 5`");
      return { __done: true, value: (true) };
    }
    try {
      const delKey = buildDeleteKeyFromQuote();
      if (!delKey?.id) throw new Error("No quoted message id");
      // Try primary key
      try {
        await sock.sendMessage(jid, { delete: delKey });
      } catch (e1) {
        // Retry flipped fromMe (bot vs user ambiguity)
        const alt = { ...delKey, fromMe: !delKey.fromMe };
        await sock.sendMessage(jid, { delete: alt });
      }
      try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
    } catch (e) {
      await send(`❌ Delete failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
