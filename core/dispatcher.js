// Joker-XD command dispatcher — prefix parsing, pre-hooks, then the plugin loader.
import { DEVELOPER_PREFIX, activeSessions, adultHandleReply, autoCommandReact, botNumberFromSock, getPrefix, getShareMeta, isBotKing, isDeveloper, isOwner, jidNumber, removeShareChild, wipeSessionData } from "./helpers.js";
import { startSession } from "../routes/pairing.js";
import { runPlugins } from "../joker-plugins/_loader.js";

export async function executeCommand(sock, msg, raw) {
  const prefix = getPrefix(sock);
  const isDev = isDeveloper(sock, msg);
  let usedDevPrefix = false;
  let body = "";
  const jidEarly = msg.key.remoteJid;
  const sendEarly = (text, extra = {}) => sock.sendMessage(jidEarly, { text, ...extra }, { quoted: msg });

  // ==================== SHARE BOT — ONLY slash "/" (not user prefix) ====================
  // /connect /c | /connect list /cl | /disconnect /dc | /disconnect all /dcall
  // Only Bot King (portal-paired) or Developer. Children cannot share further.
  {
    const rawTrim = String(raw || "").trim();
    const shareRe = /^\/(connect|c|cl|disconnect|dc|dcall|delconnect|del\s*connect)\b/i;
    if (shareRe.test(rawTrim)) {
      const kingNum = botNumberFromSock(sock) || jidNumber(sock.user?.id);
      const partsShare = rawTrim.slice(1).trim().split(/\s+/);
      const scmd = (partsShare.shift() || "").toLowerCase().replace(/\s+/g, "");
      const sargs = partsShare;

      // Normalize aliases
      const isList = (scmd === "cl") || (scmd === "connect" && String(sargs[0] || "").toLowerCase() === "list");
      const isDisconnectAll =
        scmd === "dcall" ||
        (["disconnect", "dc"].includes(scmd) && String(sargs[0] || "").toLowerCase() === "all");
      const isDisconnect = ["disconnect", "dc", "delconnect"].includes(scmd) ||
        (scmd === "del" && String(sargs[0] || "").toLowerCase() === "connect");
      const isConnect = scmd === "connect" || scmd === "c";

      // Owner of THIS session or Developer only
      if (!isOwner(sock, msg) && !isDev) {
        await sendEarly("❌ Owner / Developer only.");
        return true;
      }
      // Child sessions cannot use share commands
      if (!isDev && !isBotKing(kingNum)) {
        await sendEarly(
          "❌ *Share Bot denied*\n\n" +
          "This bot was linked via `/connect` (child session).\n" +
          "Only a *Bot King* (paired from the pairing portal) can share bots.\n" +
          "Pair your own number from the panel to become Bot King."
        );
        return true;
      }

      // ---- /connect list | /cl ----
      if (isList || (isConnect && String(sargs[0] || "").toLowerCase() === "list")) {
        const meta = getShareMeta(kingNum);
        const kids = meta.children || [];
        if (!kids.length) {
          await sendEarly("📋 *Share list empty*\nNo numbers connected via `/connect` yet.");
          return true;
        }
        let text = `📋 *Shared bots* (${kids.length})\nBot King: *${kingNum}*\n\n`;
        for (const n of kids) {
          const online = activeSessions.get(n)?.sock?.user ? "🟢 online" : "⚪ offline";
          text += `• *${n}* — ${online}\n`;
        }
        text += `\nDisconnect: /disconnect <number>\nDisconnect all: /disconnect all`;
        await sendEarly(text);
        return true;
      }

      // ---- /disconnect all | /dcall ----
      // ONLY children. Never touch Bot King / current session.
      if (isDisconnectAll) {
        const meta = getShareMeta(kingNum);
        const kids = [...(meta.children || [])].filter(t => t && t !== kingNum);
        if (!kids.length) {
          await sendEarly("📋 No shared (child) bots to disconnect.\nBot King is never disconnected by this command.");
          return true;
        }
        let ok = 0;
        let fail = 0;
        for (const target of kids) {
          if (target === kingNum) continue; // hard safety: never disconnect King
          try {
            const entry = activeSessions.get(target);
            if (entry?.sock) {
              entry.sock.__manualDisconnect = true;
              try { await entry.sock.logout?.(); } catch {}
              try { entry.sock.end?.(undefined); } catch {}
            }
            activeSessions.delete(target);
            removeShareChild(kingNum, target);
            wipeSessionData(target);
            ok++;
          } catch {
            fail++;
          }
        }
        await sendEarly(
          `✅ *Disconnect all complete* (children only)\n` +
          `Removed: *${ok}*\n` +
          (fail ? `Failed: *${fail}*\n` : "") +
          `Bot King (*${kingNum}*) is unaffected.\nAll shared child session data wiped from server.`
        );
        return true;
      }

      // ---- /disconnect | /dc | /del connect ----
      // ONLY child bots. Kingbot is never disconnected by this command.
      if (isDisconnect) {
        let target = String(sargs[0] || sargs[1] || "").replace(/\D/g, "");
        if (scmd === "del" && String(sargs[0] || "").toLowerCase() === "connect") {
          target = String(sargs[1] || "").replace(/\D/g, "");
        }
        if (!target || target.length < 8) {
          await sendEarly("❌ Usage: `/disconnect 92XXXXXXXXX`\n`/disconnect all` or `/dcall` — remove all *child* bots only");
          return true;
        }
        if (target === kingNum) {
          await sendEarly("❌ Cannot disconnect Bot King itself.\nThis command only disconnects *child bots* linked via `/connect`.");
          return true;
        }
        const meta = getShareMeta(kingNum);
        if (!isDev && !(meta.children || []).includes(target)) {
          await sendEarly("❌ That number is not in your share list (child bots only).");
          return true;
        }
        try {
          const entry = activeSessions.get(target);
          if (entry?.sock) {
            entry.sock.__manualDisconnect = true;
            try { await entry.sock.logout?.(); } catch {}
            try { entry.sock.end?.(undefined); } catch {}
          }
          activeSessions.delete(target);
          removeShareChild(kingNum, target);
          wipeSessionData(target);
          await sendEarly(`✅ Disconnected and removed *child* *${target}*\nBot King is unaffected.\nAll session data deleted from server.`);
        } catch (e) {
          await sendEarly("❌ Disconnect failed: " + (e?.message || e));
        }
        return true;
      }

      // ---- /connect | /c <number> ----
      // Progress: 1 message edited in place → then plain code as new message
      if (isConnect) {
        const target = String(sargs[0] || "").replace(/\D/g, "");
        if (!target || target.length < 8 || target.length > 15) {
          await sendEarly(
            "❌ Usage: `/connect 92XXXXXXXXX`\n" +
            "Alias: `/c 92XXXXXXXXX`\n\n" +
            "Sends a pairing code so that number can link as a shared bot."
          );
          return true;
        }
        if (target === kingNum) {
          await sendEarly("❌ Cannot connect your own Bot King number again.");
          return true;
        }
        if (activeSessions.get(target)?.sock?.user) {
          await sendEarly(`ℹ️ *${target}* is already connected on this server.`);
          return true;
        }

        // Step 1 — starting
        let progressMsg = null;
        try {
          progressMsg = await sock.sendMessage(
            jidEarly,
            { text: `⏳ Starting session for *${target}*...\nPairing code will arrive shortly.` },
            { quoted: msg }
          );
        } catch {
          await sendEarly(`⏳ Starting session for *${target}*...\nPairing code will arrive shortly.`);
        }

        const editProgress = async (text) => {
          try {
            if (progressMsg?.key) {
              await sock.sendMessage(jidEarly, { text, edit: progressMsg.key });
              return;
            }
          } catch {}
          try {
            progressMsg = await sock.sendMessage(jidEarly, { text }, { quoted: msg });
          } catch {
            await sendEarly(text);
          }
        };

        try {
          await startSession(target, {
            isRestore: false,
            shareFromKing: kingNum,
            onPairingCode: async (code, info) => {
              if (info?.error) {
                await editProgress(`❌ Failed for *${target}*\n${info.error}`);
                return;
              }
              if (info?.alreadyConnected) {
                await editProgress(`ℹ️ *${target}* is already connected on this server.`);
                return;
              }
              if (info?.alreadyRegistered) {
                // Step 3 style — reconnecting (edit same bubble)
                await editProgress(`✅ *${target}* had a saved session — reconnecting.`);
                return;
              }
              if (code) {
                // Step 2 — full pairing info (edit step 1)
                await editProgress(
                  `✅ *Pairing code for ${target}*\n\n` +
                  `🔑 *${code}*\n\n` +
                  `WhatsApp → Linked devices → Link a device → Link with phone number → enter this code.\n\n` +
                  `_This shared bot cannot use /connect (child session)._`
                );
                // Separate plain code message (easy copy)
                try {
                  await sock.sendMessage(jidEarly, { text: String(code) }, { quoted: msg });
                } catch {
                  await sendEarly(String(code));
                }
              }
            },
            onConnected: async () => {
              // When live connection opens — edit progress to final status
              await editProgress(`✅ *${target}* is now connected and online.`);
            }
          });
        } catch (e) {
          await editProgress("❌ Connect failed: " + (e?.message || e));
        }
        return true;
      }

      return true;
    }
  }

  // No-prefix helper: "What is my prefix" → reply current prefix
  {
    const rawLower = String(raw || "").trim().toLowerCase().replace(/[?.!]+$/g, "");
    if (
      rawLower === "what is my prefix" ||
      rawLower === "whats my prefix" ||
      rawLower === "what's my prefix" ||
      rawLower === "my prefix" ||
      rawLower === "prefix kya hai" ||
      rawLower === "mera prefix"
    ) {
      const p = prefix === "" ? "none (no prefix)" : prefix;
      await send(`Your prefix is *${p}*`);
      return true;
    }
  }

  // Reply to an adult search list: "1", "1,3,4", "1-4" or "all" (no prefix needed)
  try { if (await adultHandleReply(sock, msg, raw)) return true; } catch (e) { console.error("[adult-reply]", e.message); }

  // Developer exclusive prefix ® — only developer may use it
  if (raw.startsWith(DEVELOPER_PREFIX)) {
    if (!isDev) return false;
    usedDevPrefix = true;
    body = raw.slice(DEVELOPER_PREFIX.length).trim();
  } else if (prefix === "") {
    body = raw.trim();
  } else if (raw.startsWith(prefix)) {
    // Normal users (and owner/sudo) use the public prefix
    // Developer may also use public prefix, but must be developer to use ®
    body = raw.slice(prefix.length).trim();
  } else {
    return false;
  }

  // If message used normal prefix but sender is ONLY allowed via developer path? No —
  // Developer can use both. Non-developer cannot use ® (already filtered).
  // Owner/sudo/public rules still apply via isPrivileged / commandModeAllowed upstream.

  const parts = body.split(/\s+/);
  const cmd = (parts.shift() || "").toLowerCase();
  const args = parts;
  if (!cmd) return false;
  const jid = msg.key.remoteJid;
  const send = (text, extra = {}) => sock.sendMessage(jid, { text, ...extra }, { quoted: msg });
  const react = async (emoji) => {
    try { await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }); } catch {}
  };

  // Auto-react on valid commands (menu emoji) when .autoreact command on
  await autoCommandReact(sock, msg, cmd);

  // Everything below this line is handled by the plugin files in /joker-plugins
  const __ctx = { sock, msg, raw, prefix, isDev, usedDevPrefix, body, jidEarly, sendEarly, parts, cmd, args, jid, send, react };
  return await runPlugins(__ctx);
}
