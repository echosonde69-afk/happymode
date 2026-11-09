// Joker-XD event handlers (messages, groups, anti-features) — moved out of routes/pairing.js
import pino from "pino";
import { downloadMediaMessage, delay } from "@whiskeysockets/baileys";
import fs from "fs";
import { HARDCODED_CHANNEL_JID, VO_READ_MORE, aiLastReply, askAI, autoPresenceForMessage, autoReactMessage, botIdFingerprint, buildSendContent, cacheStatusMessage, collectMentions, commandModeAllowed, detectBugPayload, detectMassTag, detectMsgKind, enforceAnti, extractRecoverableContent, getAiHistory, getAutoReactConfig, getCachedMeta, getChatLabel, getContext, getPrefix, getQuotedMsg, getText, hasLink, interceptViewOnce, isAdmin, isAnyStatusLikeMessage, isBannedNumber, isBotMentioned, isChannelPost, isDeveloper, isGroup, isPrivileged, isReplyToBot, isViewOncePayload, jidNumber, mcKey, messageCache, normalizeJid, openViewOnce, ownerJid, pendingAllJid, pendingBroadcast, pendingChJid, privacyOwnerJid, pushAiHistory, readJson, resolveActualPhoneJid, scanAndCacheExistingStatuses, scrubText, sf, trackRecentMsg, unwrapStatusMessage, voFromLabel, writeJson } from "./helpers.js";
import { executeCommand } from "./dispatcher.js";


// ==================== EVENTS ====================
export function attachEvents(sock) {
  // Track bot's own outbound messages so .delete last can remove them too
  try {
    const _origSend = sock.sendMessage.bind(sock);
    sock.sendMessage = async function (jid, content, options) {
      try {
        if (content && typeof content === "object") {
          if (typeof content.text === "string") content = { ...content, text: scrubText(content.text) };
          if (typeof content.caption === "string") content = { ...content, caption: scrubText(content.caption) };
        }
      } catch {}
      const sent = await _origSend(jid, content, options);
      try {
        if (sent?.key?.id && jid && jid !== "status@broadcast") {
          trackRecentMsg({
            key: {
              remoteJid: jid,
              id: sent.key.id,
              fromMe: true,
              participant: sent.key.participant
            },
            participant: sent.key.participant
          }, sock);
        }
      } catch {}
      return sent;
    };
  } catch {}

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    // Normal chats arrive as "notify". Channel/newsletter, Group Status,
    // and personal status@broadcast can arrive as "append" — must allow them.
    const hasNewsletter = Array.isArray(messages) && messages.some(m =>
      String(m?.key?.remoteJid || "").endsWith("@newsletter")
    );
    const hasPersonalStatus = Array.isArray(messages) && messages.some(m =>
      String(m?.key?.remoteJid || "") === "status@broadcast"
    );
    const hasGroupStatusLike = Array.isArray(messages) && messages.some(m => {
      const mm = m?.message || {};
      return !!(
        mm.groupStatusMessage ||
        mm.groupStatusMessageV2 ||
        mm.groupStatusMentionMessage ||
        mm.ephemeralMessage?.message?.groupStatusMessage ||
        mm.ephemeralMessage?.message?.groupStatusMessageV2 ||
        mm.ephemeralMessage?.message?.groupStatusMentionMessage ||
        mm.imageMessage?.contextInfo?.isGroupStatus ||
        mm.videoMessage?.contextInfo?.isGroupStatus ||
        mm.extendedTextMessage?.contextInfo?.isGroupStatus ||
        mm.audioMessage?.contextInfo?.isGroupStatus ||
        mm.stickerMessage?.contextInfo?.isGroupStatus ||
        mm.protocolMessage?.type === 25 ||
        mm.protocolMessage?.type === 26
      );
    });
    // ===== Zain-style ANTIVIEWONCE early interceptor — runs for EVERY upsert type (notify/append) =====
    for (const vm0 of (Array.isArray(messages) ? messages : [])) {
      try {
        if (vm0?.message && !vm0.key?.fromMe && vm0.key?.remoteJid && vm0.key.remoteJid !== "status@broadcast") {
          await interceptViewOnce(sock, vm0);
        }
      } catch (e) {
        console.error("[ANTIVIEWONCE] early:", e?.message || e);
      }
    }
    if (type !== "notify" && !hasNewsletter && !hasPersonalStatus && !hasGroupStatusLike) return;
    const anti = readJson(sf(sock, "antilink.json"), {});
    const adCfg = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });

    for (const msg of messages) {
      try {
        const jid = msg?.key?.remoteJid;
        if (!jid) continue;
        // Channel/newsletter posts must be handled even when Baileys delivers
        // a lightweight message node without msg.message. Do this BEFORE the
        // normal-message guard, otherwise live channel posts are silently lost.
        if (jid === HARDCODED_CHANNEL_JID) {
          await autoReactMessage(sock, msg, "");
          continue;
        }
        if (!msg.message) continue;


        // ===== View-once: if anyone (incl. owner) reacts on a view-once → silent copy to self DM =====
        try {
          const reactMsg = msg.message?.reactionMessage;
          if (reactMsg?.key?.id) {
            const reactedId = reactMsg.key.id;
            const cached = messageCache.get(mcKey(sock, reactedId));
            const wasVO = !!(cached?.isViewOnce || (cached?.msg && isViewOncePayload(cached.msg.message || {})));
            if (wasVO && cached?.msg && reactMsg.text === "🎭") {
              // 🎭 = open this view-once RIGHT HERE (same chat), owner/sudo only
              if (isPrivileged(sock, msg)) {
                const content = cached.prebuilt
                  || await openViewOnce(sock, cached.msg).catch(() => null)
                  || await extractRecoverableContent(sock, cached.msg).catch(() => null);
                if (!content) {
                  await sock.sendMessage(jid, { text: "❌ Could not open that view-once media." }).catch(() => {});
                } else {
                  const sentMedia = await sock.sendMessage(jid, content).catch((e) => {
                    console.error("[vo-react] send media:", e?.message || e);
                    return null;
                  });
                  const voSenderRaw = cached.msg.key?.participant || cached.msg.key?.remoteJid || "";
                  const voSenderNum = jidNumber(voSenderRaw) || "?";
                  const fromLabel = await voFromLabel(sock, jid);
                  const info =
                    `👁️ *View-once opened via reaction*` +
                    VO_READ_MORE +
                    `💬 *From:* ${fromLabel}\n` +
                    `💁🏽‍♂️ *Sender:* @${voSenderNum}\n` +
                    `⭐ *React:* ${reactMsg.text}`;
                  await sock.sendMessage(jid, {
                    text: info,
                    mentions: voSenderRaw ? [normalizeJid(voSenderRaw)] : []
                  }, sentMedia ? { quoted: sentMedia } : undefined).catch(() => {});
                }
              }
            } else if (wasVO && cached?.msg) {
              const dest = privacyOwnerJid(sock);
              if (dest) {
                const reactorRaw = msg.key.participant || msg.key.remoteJid;
                const reactorNum = jidNumber(reactorRaw) || (msg.key.fromMe ? "You" : "Unknown");
                const content = await openViewOnce(sock, cached.msg).catch(() => null)
                  || await extractRecoverableContent(sock, cached.msg).catch(() => null)
                  || await buildSendContent(sock, cached.msg).catch(() => null);
                if (content) {
                  await sock.sendMessage(dest, content).catch(() => {});
                }
                const chatLabel = await getChatLabel(sock, jid);
                const who = msg.key.fromMe ? "You (owner)" : `@+${reactorNum}`;
                await sock.sendMessage(dest, {
                  text:
                    `👁️ *View-once opened via reaction*\n` +
                    `👤 ${who} reacted on this view-once\n` +
                    `📍 From: ${chatLabel}\n` +
                    `💬 Chat ID: ${jid}\n` +
                    `⭐ React: ${reactMsg.text || "✓"}`,
                  mentions: msg.key.fromMe ? [] : [normalizeJid(reactorRaw)]
                }).catch(() => {});
              }
            }
          }
        } catch (e) {
          console.error("[vo-react]", e?.message || e);
        }

        // ===== Personal Status (status@broadcast) =====
        if (jid === "status@broadcast") {
          try {
            // ALWAYS cache personal status for anti-delete recovery (before continue)
            try {
              const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
              if (adsCfg.enabled && msg.key.id && !msg.key.fromMe) {
                let prebuilt = null;
                try { prebuilt = await extractRecoverableContent(sock, msg); } catch {}
                // Fallback: flat personal-status fields (like simple anti-delete snippets)
                if (!prebuilt) {
                  const m = msg.message || {};
                  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
                  try {
                    if (m.conversation) prebuilt = { text: m.conversation };
                    else if (m.extendedTextMessage?.text) prebuilt = { text: m.extendedTextMessage.text };
                    else if (m.imageMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { image: buf, caption: m.imageMessage.caption || "" };
                    } else if (m.videoMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { video: buf, caption: m.videoMessage.caption || "" };
                    } else if (m.audioMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { audio: buf, mimetype: m.audioMessage.mimetype || "audio/mp4", ptt: !!m.audioMessage.ptt };
                    } else if (m.stickerMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = { sticker: buf };
                    } else if (m.documentMessage) {
                      const buf = await downloadMediaMessage(msg, "buffer", {}, opts);
                      prebuilt = {
                        document: buf,
                        mimetype: m.documentMessage.mimetype || "application/octet-stream",
                        fileName: m.documentMessage.fileName || "status"
                      };
                    }
                  } catch (e) {
                    console.error("[status-prebuild]", e?.message || e);
                  }
                }
                messageCache.set(mcKey(sock, msg.key.id), {
                  msg,
                  timestamp: Date.now(),
                  isGroupStatus: false,
                  isPersonalStatus: true,
                  prebuilt,
                  pushName: msg.pushName || ""
                });
                if (messageCache.size > 1000) {
                  const first = messageCache.keys().next().value;
                  messageCache.delete(first);
                }
                console.log("[ANTI-DELETE-STATUS] Personal status cached:", msg.key.id);
              }
            } catch (e) {
              console.error("[status-cache]", e?.message || e);
            }

            if (!msg.key.fromMe) {
              const statusKey = {
                remoteJid: "status@broadcast",
                id: msg.key.id,
                fromMe: false,
                participant: msg.key.participant || msg.key.remoteJid
              };
              const asv = readJson(sf(sock, "autostatusview.json"), { enabled: false });
              const sr = readJson(sf(sock, "statusreact.json"), { enabled: false });
              const arStatus = !!getAutoReactConfig(sock).status;

              // Auto view / seen — personal status
              if (asv.enabled) {
                if (typeof sock.readMessages === "function") {
                  await sock.readMessages([statusKey]).catch(() => {});
                  await sock.readMessages([msg.key]).catch(() => {});
                }
                if (typeof sock.sendReceipt === "function") {
                  try {
                    await sock.sendReceipt(
                      statusKey.remoteJid,
                      statusKey.participant,
                      [statusKey.id],
                      "read"
                    );
                  } catch {}
                }
              }

              // Auto ❤️ — personal status
              if (sr.enabled || arStatus) {
                await sock.sendMessage("status@broadcast", {
                  react: { text: "❤️", key: statusKey }
                }).catch(() => {});
                await sock.sendMessage("status@broadcast", {
                  react: { text: "❤️", key: msg.key }
                }).catch(() => {});
              }
            }
          } catch (e) {
            console.error("[status-auto]", e?.message || e);
          }
          continue; // status pipeline ends here
        }

        const text = getText(msg);

        // Track recent messages for .delete last N
        trackRecentMsg(msg, sock);

        // Hello auto-reply (others only, not owner/bot) — exact word "hello"
        try {
          if (!msg.key.fromMe && text) {
            const helloCfg = readJson(sf(sock, "hello.json"), { enabled: false });
            if (helloCfg.enabled) {
              const cleaned = String(text).trim().toLowerCase();
              if (cleaned === "hello") {
                // Skip if sender is owner/privileged
                if (!isPrivileged(sock, msg)) {
                  setTimeout(() => {
                    sock.sendMessage(jid, { text: "how are you" }, { quoted: msg }).catch(() => {});
                  }, 1000);
                }
              }
            }
          }
        } catch {}

        await autoReactMessage(sock, msg, text);
        await autoPresenceForMessage(sock, msg);

        // Configurable auto-read (off | all | groups | dms)
        try {
          if (!msg.key.fromMe && typeof sock.readMessages === "function") {
            const ar = readJson(sf(sock, "autoread.json"), { mode: "off" });
            const mode = ar.mode || "off";
            const isGrp = isGroup(jid);
            if (
              mode === "all" ||
              (mode === "groups" && isGrp) ||
              (mode === "dms" && !isGrp)
            ) {
              await sock.readMessages([msg.key]);
            }
          }
        } catch {}

        // Cache for anti-delete + anti-delete-status recovery + view-once reaction open
        // Group status / mentions: pre-download media NOW so delete-recovery still has bytes
        // Always cache view-once so owner reaction can open them to self DM
        try {
          const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
          const looksGroupStatus = isAnyStatusLikeMessage(msg);
          const isVOMsg = isViewOncePayload(msg.message || {});
          if ((adCfg.enabled || (adsCfg.enabled && looksGroupStatus) || isVOMsg) && msg.key.id) {
            let prebuilt = null;
            if (adsCfg.enabled && looksGroupStatus) {
              try { prebuilt = await extractRecoverableContent(sock, msg); } catch {}
              if (!prebuilt) {
                try {
                  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
                  const m0 = msg.message || {};
                  const inner = unwrapStatusMessage(m0);
                  const node = inner.imageMessage || inner.videoMessage || inner.audioMessage || inner.stickerMessage
                    ? inner
                    : m0;
                  const wrap = { key: msg.key, message: node };
                  if (node.imageMessage || m0.imageMessage) {
                    const buf = await downloadMediaMessage(wrap, "buffer", {}, opts);
                    prebuilt = { image: buf, caption: (node.imageMessage || m0.imageMessage)?.caption || "" };
                  } else if (node.videoMessage || m0.videoMessage) {
                    const buf = await downloadMediaMessage(wrap, "buffer", {}, opts);
                    prebuilt = { video: buf, caption: (node.videoMessage || m0.videoMessage)?.caption || "" };
                  } else if (node.conversation || node.extendedTextMessage?.text) {
                    prebuilt = { text: node.conversation || node.extendedTextMessage.text };
                  }
                } catch {}
              }
            }
            messageCache.set(mcKey(sock, msg.key.id), {
              msg,
              timestamp: Date.now(),
              isGroupStatus: looksGroupStatus,
              isPersonalStatus: false,
              isViewOnce: isVOMsg,
              prebuilt
            });
            if (looksGroupStatus) {
              console.log("[ANTI-DELETE-STATUS] Group/mention status cached:", msg.key.id);
            }
            if (messageCache.size > 1000) {
              const first = messageCache.keys().next().value;
              messageCache.delete(first);
            }
          }
        } catch {}

        // ===== ALL status types: auto-view + auto-❤️ (personal + group status + mentions) =====
        try {
          if (!msg.key.fromMe) {
            const asv = readJson(sf(sock, "autostatusview.json"), { enabled: false });
            const sr = readJson(sf(sock, "statusreact.json"), { enabled: false });
            const arStatus = !!getAutoReactConfig(sock).status;
            const wantView = !!asv.enabled;
            const wantReact = !!(sr.enabled || arStatus);
            const isGroupStatusMsg = isAnyStatusLikeMessage(msg);

            if ((wantView || wantReact) && isGroupStatusMsg) {
              if (wantView && typeof sock.readMessages === "function") {
                await sock.readMessages([msg.key]).catch(() => {});
              }
              if (wantReact) {
                await sock.sendMessage(jid, {
                  react: { text: "❤️", key: msg.key }
                }).catch(() => {});
              }
            }
          }
        } catch (e) {
          console.error("[group-status-auto]", e?.message || e);
        }

        // Antilink — ULTRA HEAVY (every link / spam mirror, zero delay delete)
        if (!msg.key.fromMe && isGroup(jid) && anti[jid] && hasLink(text)) {
          try {
            const meta = await getCachedMeta(sock, jid);
            const sender = msg.key.participant || jid;
            if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
              // fire-and-forget so next messages are not blocked
              enforceAnti(sock, msg, jid, sender, anti[jid], "link").catch(() => {});
              continue;
            }
          } catch {}
        }

        // Antichannel — forwarded channel posts / channel invites / channel links
        try {
          const acCfg = readJson(sf(sock, "antichannel.json"), {});
          if (!msg.key.fromMe && isGroup(jid) && acCfg[jid] && isChannelPost(msg)) {
            const meta = await getCachedMeta(sock, jid);
            const sender = msg.key.participant || jid;
            if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
              enforceAnti(sock, msg, jid, sender, acCfg[jid], "channel").catch(() => {});
              continue;
            }
          }
        } catch (e) { console.error("[antichannel]", e?.message || e); }

        // Anti media / text tools (sticker, video, picture, voice, text)
        if (!msg.key.fromMe && isGroup(jid)) {
          try {
            const meta = await sock.groupMetadata(jid);
            const sender = msg.key.participant || msg.key.remoteJid;
            if (!isAdmin(meta, sender)) {
              const kind = detectMsgKind(msg);
              const st = readJson(sf(sock, "antisticker.json"), {});
              const vo = readJson(sf(sock, "antivoice.json"), {});
              const pic = readJson(sf(sock, "antipicture.json"), {});
              const vid = readJson(sf(sock, "antivideo.json"), {});
              const txt = readJson(sf(sock, "antitext.json"), {});
              if (kind === "sticker" && st[jid]) {
                await enforceAnti(sock, msg, jid, sender, st[jid], "sticker");
                continue;
              }
              if (kind === "voice" && vo[jid]) {
                await enforceAnti(sock, msg, jid, sender, vo[jid], "voice");
                continue;
              }
              if (kind === "picture" && pic[jid]) {
                await enforceAnti(sock, msg, jid, sender, pic[jid], "picture");
                continue;
              }
              if (kind === "video" && vid[jid]) {
                await enforceAnti(sock, msg, jid, sender, vid[jid], "video");
                continue;
              }
              if (kind === "text" && txt[jid]) {
                await enforceAnti(sock, msg, jid, sender, txt[jid], "text");
                continue;
              }
            }
          } catch (e) { console.error("[anti-media]", e.message); }
        }


        // Antibug — crash / bug messages (checked first: they are dangerous even from admins)
        try {
          const bgCfg = readJson(sf(sock, "antibug.json"), {});
          if (!msg.key.fromMe && isGroup(jid) && bgCfg[jid]) {
            const why = detectBugPayload(msg);
            if (why && !isPrivileged(sock, msg)) {
              const sender = msg.key.participant || jid;
              let mode = bgCfg[jid];
              try { const meta = await getCachedMeta(sock, jid); if (isAdmin(meta, sender)) mode = "delete"; } catch {}
              console.warn(`[antibug] ${why} from ${jidNumber(sender)} in ${jid}`);
              await enforceAnti(sock, msg, jid, sender, mode, "bug");
              continue;
            }
          }
        } catch (e) { console.error("[antibug]", e?.message || e); }

        // Antibot — other bots (Baileys-style message IDs)
        try {
          const abCfg = readJson(sf(sock, "antibot.json"), {});
          if (!msg.key.fromMe && isGroup(jid) && abCfg[jid] && botIdFingerprint(msg.key.id)) {
            const meta = await getCachedMeta(sock, jid);
            const sender = msg.key.participant || jid;
            if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
              enforceAnti(sock, msg, jid, sender, abCfg[jid], "bot").catch(() => {});
              continue;
            }
          }
        } catch (e) { console.error("[antibot]", e?.message || e); }

        // Antitag v2 — mass mentions: VISIBLE (@numbers) and HIDDEN (silent mention-all)
        try {
          const at = readJson(sf(sock, "antitag.json"), {});
          if (!msg.key.fromMe && isGroup(jid) && at[jid]) {
            const meta = await getCachedMeta(sock, jid);
            const size = (meta && meta.participants && meta.participants.length) || 0;
            const custom = Number(readJson(sf(sock, "antitaglimit.json"), {})[jid]) || 0;
            const limit = custom || Math.min(5, Math.max(3, Math.ceil(size * 0.6)));
            const det = detectMassTag(msg, limit);
            if (!det) {
              const mc = collectMentions(msg.message).size;
              if (mc >= 2) console.log(`[antitag] ${mc} mentions is below the limit (${limit}, group of ${size}) — ignored`);
            }
            if (det) {
              const sender = msg.key.participant || jid;
              if (isAdmin(meta, sender) || isPrivileged(sock, msg)) {
                console.log(`[antitag] ${det.count} mentions from ${jidNumber(sender)} — exempt (admin/owner)`);
              }
              if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
                await enforceAnti(sock, msg, jid, sender, at[jid], det.hidden ? "hidden-tag" : "mass-tag");
                if (det.hidden) {
                  sock.sendMessage(jid, {
                    text: `👀 *Hidden tag exposed*\n👤 @${jidNumber(sender)} silently tagged ${det.count} members.\n💬 ${det.text ? det.text.slice(0, 300) : "(media / no text)"}`,
                    mentions: [sender]
                  }).catch(() => {});
                }
                continue;
              }
            }
          }
        } catch {}

        // Antitagme — reply when bot is mentioned
        try {
          const atm = readJson(sf(sock, "antitagme.json"), { enabled: false, text: "I'm busy" });
          if (atm.enabled && !msg.key.fromMe && isGroup(jid)) {
            const ctx = getContext(msg);
            const mentions = (ctx.mentionedJid || []).map(normalizeJid);
            const bot = normalizeJid(sock.user?.id);
            if (bot && mentions.includes(bot)) {
              await sock.sendMessage(jid, { text: atm.text || "I'm busy" }, { quoted: msg });
            }
          }
        } catch {}

        // AGM / antigroupmention — ONLY group-status *mentions* (never real status posts)
        try {
          const agm = readJson(sf(sock, "agm.json"), {});
          if (!msg.key.fromMe && isGroup(jid) && agm[jid]) {
            const m = msg.message || {};
            const isStatusMention = !!(
              m.groupStatusMentionMessage ||
              m.protocolMessage?.type === 25 ||
              m.ephemeralMessage?.message?.groupStatusMentionMessage ||
              m.viewOnceMessage?.message?.groupStatusMentionMessage ||
              m.viewOnceMessageV2?.message?.groupStatusMentionMessage
            );
            // Never treat a real group-status post as a mention
            const isRealGroupStatus = !!(
              m.groupStatusMessage ||
              m.groupStatusMessageV2 ||
              m.ephemeralMessage?.message?.groupStatusMessage ||
              m.ephemeralMessage?.message?.groupStatusMessageV2 ||
              m.imageMessage?.contextInfo?.isGroupStatus ||
              m.videoMessage?.contextInfo?.isGroupStatus ||
              m.extendedTextMessage?.contextInfo?.isGroupStatus
            );
            if (isStatusMention && !isRealGroupStatus) {
              const meta = await sock.groupMetadata(jid);
              const sender = msg.key.participant || jid;
              if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
                await enforceAnti(sock, msg, jid, sender, agm[jid], "group-mention");
                continue;
              }
            }
          }
        } catch (e) {
          console.error("[antigroupmention]", e?.message || e);
        }

        // Anti Group Status — ONLY real group-status posts (NEVER mentions)
        try {
          const agsCfg = readJson(sf(sock, "antigroupstatus.json"), {});
          const rawCfg = agsCfg[jid];
          const agsEnabled = typeof rawCfg === "object" ? !!rawCfg.enabled : !!rawCfg && rawCfg !== "off";
          const agsAction = typeof rawCfg === "object" ? String(rawCfg.action || "warn") : String(rawCfg || "warn");

          if (!msg.key.fromMe && isGroup(jid) && agsEnabled) {
            const m = msg.message || {};
            // Detect actual Group Status posts (exclude pure mentions)
            const isGroupStatusPost = !!(
              m.groupStatusMessage ||
              m.groupStatusMessageV2 ||
              m.ephemeralMessage?.message?.groupStatusMessage ||
              m.ephemeralMessage?.message?.groupStatusMessageV2 ||
              m.viewOnceMessage?.message?.groupStatusMessage ||
              m.viewOnceMessage?.message?.groupStatusMessageV2 ||
              m.viewOnceMessageV2?.message?.groupStatusMessage ||
              m.viewOnceMessageV2?.message?.groupStatusMessageV2 ||
              m.protocolMessage?.type === 26 ||
              // Media / text wrapped with isGroupStatus flag
              m.imageMessage?.contextInfo?.isGroupStatus ||
              m.videoMessage?.contextInfo?.isGroupStatus ||
              m.extendedTextMessage?.contextInfo?.isGroupStatus ||
              m.audioMessage?.contextInfo?.isGroupStatus ||
              m.stickerMessage?.contextInfo?.isGroupStatus ||
              m.documentMessage?.contextInfo?.isGroupStatus ||
              // Nested documentWithCaption / other wrappers
              m.documentWithCaptionMessage?.message?.imageMessage?.contextInfo?.isGroupStatus ||
              m.documentWithCaptionMessage?.message?.videoMessage?.contextInfo?.isGroupStatus
            );
            // Explicitly ignore pure group-status mentions
            const isOnlyMention = !!(
              (m.groupStatusMentionMessage || m.protocolMessage?.type === 25) &&
              !m.groupStatusMessage &&
              !m.groupStatusMessageV2 &&
              !m.imageMessage?.contextInfo?.isGroupStatus &&
              !m.videoMessage?.contextInfo?.isGroupStatus
            );

            if (isGroupStatusPost && !isOnlyMention) {
              const meta = await sock.groupMetadata(jid);
              const sender = msg.key.participant || jid;
              if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) {
                await enforceAnti(sock, msg, jid, sender, agsAction, "group-status");
                continue;
              }
            }
          }
        } catch (e) {
          console.error("[antigroupstatus]", e?.message || e);
        }


        // Developer (PN or LID) always passes filters
        const devMsg = isDeveloper(sock, msg);
        const senderNumber = jidNumber(msg.key.fromMe ? sock.user?.id : (msg.key.participant || msg.key.remoteJid));
        if (!msg.key.fromMe && !devMsg && isBannedNumber(senderNumber, sock)) continue;

        // ---- AI chatbot (mention OR reply-to-bot only) — works in ANY mode ----
        // Runs before mode filter so .chatbot on still answers even if mode=private
        try {
          if (!msg.key.fromMe && text && String(text).trim()) {
            const botCfg = readJson(sf(sock, "aichatbot.json"), {});
            const groupCfg = readJson(sf(sock, "chatbot.json"), {});
            const chatOn = !!(botCfg[jid] || groupCfg[jid]);
            if (chatOn) {
              const rawTrim = String(text).trim();
              const hasPrefix = getPrefix(sock) !== "" && rawTrim.startsWith(getPrefix(sock));
              const isDevPref = rawTrim.startsWith("®");
              const mentioned = isBotMentioned(msg, sock);
              const repliedToBot = isReplyToBot(msg, sock);
              // Only reply when: (1) bot is @mentioned  OR  (2) message is a reply to bot
              if (!hasPrefix && !isDevPref && rawTrim.length > 1 && rawTrim.length < 800 && (mentioned || repliedToBot)) {
                const now = Date.now();
                const last = aiLastReply.get(mcKey(sock, jid)) || 0;
                if (now - last >= 2500) {
                  aiLastReply.set(mcKey(sock, jid), now);
                  try {
                    // Use last 24h conversation memory for this chat (lightweight, in-RAM only)
                    const history = getAiHistory(mcKey(sock, jid));
                    const ans = await askAI(rawTrim, history);
                    if (ans) {
                      pushAiHistory(mcKey(sock, jid), "user", rawTrim);
                      pushAiHistory(mcKey(sock, jid), "assistant", ans);
                      await sock.sendMessage(jid, { text: ans.slice(0, 3500) }, { quoted: msg });
                      continue;
                    }
                  } catch (e) {
                    console.error("[chatbot-ai]", e.message);
                  }
                }
              }
            }
          }
        } catch (e) { console.error("[chatbot]", e.message); }

        if (!devMsg && !commandModeAllowed(sock, msg)) continue;

        // ---- Handle pending .alljid number selection ----
        const senderKey = mcKey(sock, msg.key.fromMe
          ? jidNumber(sock.user?.id)
          : jidNumber(msg.key.participant || msg.key.remoteJid || sock.user?.id));
        const trimmedText = String(text || "").trim();

        // Auto view-once intercept — handled early by interceptViewOnce (Zain-style).
        // Kept as safety net only if early pass missed (e.g. delayed media).
        try {
          const voCfg = readJson(sf(sock, "viewonce.json"), { enabled: true, mode: "dm" });
          if (voCfg.enabled && !msg.key.fromMe) {
            const m = msg.message || {};
            if (isViewOncePayload(m)) {
              const already = msg.key.id && messageCache.get(mcKey(sock, msg.key.id))?.prebuilt;
              if (!already) {
                const content = await openViewOnce(sock, msg);
                if (content) {
                  const dest = voCfg.mode === "here" ? jid : privacyOwnerJid(sock);
                  if (dest) {
                    await sock.sendMessage(dest, content);
                    if (voCfg.mode !== "here") {
                      const chatLabel = await getChatLabel(sock, jid);
                      const senderNum = String(senderKey || "").replace(/^[^:]*:/, "") || jidNumber(msg.key.participant || msg.key.remoteJid) || "?";
                      await sock.sendMessage(dest, {
                        text: `👁️ *Auto view-once*\n📍 From: ${chatLabel}\n👤 Sender: +${senderNum}\n💬 Chat ID: ${jid}`
                      });
                    }
                  }
                }
              }
            }
          }
        } catch (e) { console.error("[viewonce]", e.message); }

        const chPending = pendingChJid.get(senderKey);
        if (chPending && Date.now() < chPending.expires && /^all$/i.test(trimmedText)) {
          pendingChJid.delete(senderKey);
          await sock.sendMessage(jid, { text: chPending.channels.map((c, i) => `${i + 1}. ${c.name}\n${c.id}`).join("\n\n") }, { quoted: msg });
          continue;
        }
        if (chPending && Date.now() < chPending.expires && /^\d+$/.test(trimmedText)) {
          const num = parseInt(trimmedText, 10);
          if (num >= 1 && num <= chPending.channels.length) {
            const selected = chPending.channels[num - 1];
            pendingChJid.delete(senderKey);
            await sock.sendMessage(jid, { text: selected.id }, { quoted: msg });
            continue;
          }
          await sock.sendMessage(jid, { text: `❌ Invalid number. Reply with 1-${chPending.channels.length}.` }, { quoted: msg });
          continue;
        } else if (chPending && Date.now() >= chPending.expires) {
          pendingChJid.delete(senderKey);
        }

        const pending = pendingAllJid.get(senderKey);

        if (pending && Date.now() < pending.expires && /^\d+$/.test(trimmedText)) {
          const num = parseInt(trimmedText, 10);
          if (num >= 1 && num <= pending.groups.length) {
            const selected = pending.groups[num - 1];
            pendingAllJid.delete(senderKey);

            // Only pure JID — nothing else
            await sock.sendMessage(jid, { text: selected.id }, { quoted: msg });
            continue;
          }

          // Invalid number
          await sock.sendMessage(jid, {
            text: `❌ Invalid number. Reply with a number between *1* and *${pending.groups.length}*.`
          }, { quoted: msg });
          continue;
        } else if (pending && Date.now() >= pending.expires) {
          pendingAllJid.delete(senderKey);
        }

        // ---- Handle pending .broadcast: numbers (1,2,5) OR "all" ----
        const bcPending = pendingBroadcast.get(senderKey);
        if (bcPending && Date.now() < bcPending.expires) {
          const lower = trimmedText.toLowerCase();
          // "all" / "sab" / "sb" → every group
          if (["all", "sab", "sb", "sabhi"].includes(lower)) {
            pendingBroadcast.delete(senderKey);
            let count = 0;
            const names = [];
            for (const g of bcPending.groups) {
              try {
                await sock.sendMessage(g.id, { text: bcPending.message });
                count++;
                names.push(g.subject);
              } catch {}
            }
            await sock.sendMessage(jid, {
              text: `📢 Broadcast complete: *${count}/${bcPending.groups.length}* groups (ALL).\n\n${names.map((n,i)=>`${i+1}. ${n}`).join("\n") || "(none)"}`
            }, { quoted: msg });
            continue;
          }
          // Comma/space separated numbers e.g. 1,2,5 or 1 2 5
          const parts = trimmedText.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
          const nums = parts.map(p => parseInt(p, 10)).filter(n => !isNaN(n) && n >= 1 && n <= bcPending.groups.length);
          if (nums.length > 0 && parts.every(p => /^\d+$/.test(p))) {
            pendingBroadcast.delete(senderKey);
            const unique = [...new Set(nums)];
            let count = 0;
            const names = [];
            for (const n of unique) {
              const g = bcPending.groups[n - 1];
              try {
                await sock.sendMessage(g.id, { text: bcPending.message });
                count++;
                names.push(g.subject);
              } catch {}
            }
            await sock.sendMessage(jid, {
              text: `📢 Broadcast complete: *${count}/${unique.length}* groups.\n\n${names.map((n,i)=>`${i+1}. ${n}`).join("\n") || "(none)"}`
            }, { quoted: msg });
            continue;
          }
          // Looks like an attempt but invalid → tip
          if ((/\d/.test(trimmedText) || /all|sab/i.test(trimmedText)) && !trimmedText.startsWith(getPrefix(sock) || ".")) {
            await sock.sendMessage(jid, {
              text: `❌ Invalid selection.\n• Numbers: *1,2,5* (range 1–${bcPending.groups.length})\n• Or type *all* for every group`
            }, { quoted: msg });
            continue;
          }
        } else if (bcPending && Date.now() >= bcPending.expires) {
          pendingBroadcast.delete(senderKey);
        }

        // Silent no-prefix VV2: reply on view-once with emoji/any short text (no prefix) → owner DM, no chat reply
        try {
          const rawTrim = String(text || "").trim();
          const hasPrefix = getPrefix(sock) !== "" && rawTrim.startsWith(getPrefix(sock));
          const quotedForVo = getQuotedMsg(msg);
          // Any non-prefixed reply on view-once by owner/sudo → silent save to owner DM
          if (
            !hasPrefix &&
            quotedForVo &&
            isViewOncePayload(quotedForVo.message) &&
            isPrivileged(sock, msg) &&
            rawTrim.length > 0
          ) {
            const dest = privacyOwnerJid(sock);
            if (dest) {
              const content = await openViewOnce(sock, quotedForVo);
              if (content) {
                await sock.sendMessage(dest, content);
                // no ✅ / no reply in the chat
              }
            }
            continue;
          }
        } catch (e) { console.error("[silent-vv2]", e.message); }

        // Mark every incoming command/message as read before executing it.
        try {
          if (!msg.key.fromMe && typeof sock.readMessages === "function") {
            await sock.readMessages([msg.key]);
          }
        } catch {}
        await executeCommand(sock, msg, text);
      } catch (e) {
        console.error("[msg]", e.message);
      }
    }
  });

  sock.ev.on("messages.update", async (updates) => {
    const adCfg = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });
    const aeCfg = readJson(sf(sock, "antiedit.json"), { enabled: true, mode: "private" });
    const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
    const owner = privacyOwnerJid(sock);

    // WhatsApp "Read more" spacer (collapsed preview → expand for details)
    const READ_MORE = "\n" + "\u200e".repeat(3500) + "\n";

    for (const update of updates) {
      try {
        // ===== ANTI-EDIT: original message before edit =====
        // Baileys may surface edits as protocolMessage type 14 or editedMessage payload
        try {
          const editedNode =
            update.update?.message?.editedMessage ||
            update.update?.editedMessage ||
            update.update?.message?.protocolMessage?.editedMessage ||
            (update.update?.protocolMessage?.type === 14 ? update.update.protocolMessage : null) ||
            (update.update?.message?.protocolMessage?.type === 14 ? update.update.message.protocolMessage : null);

          const isEdit = !!(
            editedNode ||
            update.update?.protocolMessage?.type === 14 ||
            update.update?.message?.protocolMessage?.type === 14
          );

          if (isEdit && aeCfg.enabled && aeCfg.mode !== "off") {
            const id = update.key?.id
              || update.update?.protocolMessage?.key?.id
              || update.update?.message?.protocolMessage?.key?.id
              || editedNode?.message?.key?.id
              || editedNode?.key?.id;
            if (id) {
              const cached = messageCache.get(mcKey(sock, id));
              if (cached && !cached.msg?.key?.fromMe) {
                const original = cached.msg;
                const m = original.message || {};
                const chatJid = original.key.remoteJid;
                const oldText = getText(original) || "";
                let newText = "";
                try {
                  const em =
                    update.update?.message?.editedMessage?.message ||
                    update.update?.editedMessage?.message ||
                    update.update?.message?.protocolMessage?.editedMessage?.message ||
                    update.update?.protocolMessage?.editedMessage?.message ||
                    {};
                  newText =
                    em.conversation ||
                    em.extendedTextMessage?.text ||
                    em.imageMessage?.caption ||
                    em.videoMessage?.caption ||
                    "";
                } catch {}

                const sentByRaw = original.key.participant || original.key.remoteJid;
                const sentByJid = await resolveActualPhoneJid(sock, sentByRaw, "", chatJid).catch(() => normalizeJid(sentByRaw));
                const editorRaw = update.key?.participant || update.key?.remoteJid || sentByRaw;
                const editorJid = await resolveActualPhoneJid(sock, editorRaw, "", chatJid).catch(() => normalizeJid(editorRaw));
                const sentByNum = jidNumber(sentByJid);
                const editorNum = jidNumber(editorJid);

                let chatLabel = chatJid || "Unknown";
                try {
                  if (isGroup(chatJid)) {
                    const meta = await sock.groupMetadata(chatJid).catch(() => null);
                    chatLabel = meta?.subject || chatJid;
                  } else {
                    chatLabel = "+" + jidNumber(chatJid);
                  }
                } catch {
                  chatLabel = isGroup(chatJid) ? chatJid : ("+" + jidNumber(chatJid));
                }

                const ts = Number(original.messageTimestamp || cached.timestamp || Date.now() / 1000);
                const d = new Date(ts < 1e12 ? ts * 1000 : ts);
                let hours = d.getHours();
                const ampm = hours >= 12 ? "pm" : "am";
                hours = hours % 12;
                if (hours === 0) hours = 12;
                const mins = String(d.getMinutes()).padStart(2, "0");
                const timeSent = `${hours}:${mins} ${ampm}`;
                const dateSent = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

                let mediaType = "Text";
                if (m.imageMessage) mediaType = "Image";
                else if (m.videoMessage) mediaType = m.videoMessage.gifPlayback ? "GIF" : "Video";
                else if (m.audioMessage) mediaType = m.audioMessage.ptt ? "Voice" : "Audio";
                else if (m.stickerMessage) mediaType = "Sticker";
                else if (m.documentMessage) mediaType = "Document";

                const details =
                  `┏━ ✏️ *EDITED MESSAGE*\n` +
                  READ_MORE +
                  `┃ CHAT      : ${chatLabel}\n` +
                  `┃ SENT BY   : @+${sentByNum || "Unknown"}\n` +
                  `┃ TIME      : ${timeSent}\n` +
                  `┃ DATE      : ${dateSent}\n` +
                  `┃ EDITED BY : @+${editorNum || "Unknown"}\n` +
                  `┃ TYPE      : ${mediaType}\n` +
                  `┗━━━━━━━━━━━━━━━\n\n` +
                  `*ORIGINAL MESSAGE:*\n${oldText || "(media / empty)"}` +
                  (newText ? `\n\n*NEW MESSAGE:*\n${newText}` : "");

                const mentions = [
                  ...new Set(
                    [sentByJid, editorJid]
                      .filter(Boolean)
                      .map(j => {
                        const n = jidNumber(j);
                        return n ? `${n}@s.whatsapp.net` : j;
                      })
                  )
                ];
                const dest = aeCfg.mode === "chat" ? chatJid : owner;
                if (dest) {
                  await sock.sendMessage(dest, { text: details, mentions }).catch(() => {});
                }
                // Keep cache so further edits / delete still work; update stored text to new if available
                if (newText && cached.msg?.message) {
                  try {
                    if (cached.msg.message.conversation !== undefined) {
                      cached.msg.message.conversation = newText;
                    } else if (cached.msg.message.extendedTextMessage) {
                      cached.msg.message.extendedTextMessage.text = newText;
                    }
                  } catch {}
                }
              }
            }
          }
        } catch (eEdit) {
          console.error("[AntiEdit]", eEdit?.message || eEdit);
        }

        const isRevoke = update.update?.message === null
          || update.update?.messageStubType === 1
          || update.update?.messageStubType === 2
          || update.update?.messageStubType === 68
          || update.update?.protocolMessage?.type === 0
          || update.key?.fromMe === false && update.update && Object.prototype.hasOwnProperty.call(update.update, "message") && update.update.message === null
          || (update.update && Object.keys(update.update).length === 0 && update.key);
        if (isRevoke) {
          const id = update.key?.id;
          if (!id) continue;
          const cached = messageCache.get(mcKey(sock, id));
          if (!cached || cached.msg.key.fromMe) continue;

          const original = cached.msg;
          const m = original.message || {};
          const chatJid = original.key.remoteJid;

          // Personal status OR group status / group-status mention
          const isPersonalStatusCached = !!(
            cached.isPersonalStatus ||
            chatJid === "status@broadcast"
          );
          const isGroupStatusCached = !!(
            cached.isGroupStatus ||
            m.groupStatusMessage ||
            m.groupStatusMessageV2 ||
            m.groupStatusMentionMessage ||
            m.ephemeralMessage?.message?.groupStatusMessage ||
            m.ephemeralMessage?.message?.groupStatusMessageV2 ||
            m.ephemeralMessage?.message?.groupStatusMentionMessage ||
            m.imageMessage?.contextInfo?.isGroupStatus ||
            m.videoMessage?.contextInfo?.isGroupStatus ||
            m.extendedTextMessage?.contextInfo?.isGroupStatus ||
            m.audioMessage?.contextInfo?.isGroupStatus ||
            m.stickerMessage?.contextInfo?.isGroupStatus ||
            m.protocolMessage?.type === 25 ||
            m.protocolMessage?.type === 26
          );

          // Anti-delete-status: personal + group status + mentions → owner DM
          if ((isPersonalStatusCached || isGroupStatusCached) && adsCfg.enabled) {
            if (!owner) {
              messageCache.delete(mcKey(sock, id));
              continue;
            }
            try {
              const sentByRaw = original.key.participant || original.key.remoteJid;
              const sentByJid = await resolveActualPhoneJid(sock, sentByRaw, "", chatJid === "status@broadcast" ? "" : chatJid);
              const sentByNum = jidNumber(sentByJid) || jidNumber(sentByRaw);
              let groupName = "";
              if (chatJid && chatJid !== "status@broadcast" && String(chatJid).endsWith("@g.us")) {
                try {
                  const meta = await sock.groupMetadata(chatJid).catch(() => null);
                  groupName = meta?.subject || "";
                } catch {}
              }
              const kindLabel = isPersonalStatusCached
                ? "PERSONAL STATUS"
                : (m.groupStatusMentionMessage ? "GROUP STATUS MENTION" : "GROUP STATUS");
              const details =
                `🛡️ *DELETED ${kindLabel}*\n` +
                (groupName ? `┃ Group : ${groupName}\n` : "") +
                `┃ By    : @${sentByNum || cached.pushName || "unknown"}\n` +
                `┗━━━━━━━━━━━━━━━`;
              const mentions = sentByNum ? [`${sentByNum}@s.whatsapp.net`] : [];

              let content = cached.prebuilt || null;
              if (!content) {
                try { content = await extractRecoverableContent(sock, original); } catch {}
              }
              if (!content) {
                try { content = await buildSendContent(sock, original); } catch {}
              }
              // Flat personal-status fallback (same as simple snippets)
              if (!content) {
                try {
                  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
                  if (m.conversation) content = { text: m.conversation };
                  else if (m.extendedTextMessage?.text) content = { text: m.extendedTextMessage.text };
                  else if (m.imageMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { image: buf, caption: m.imageMessage.caption || "" };
                  } else if (m.videoMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { video: buf, caption: m.videoMessage.caption || "" };
                  } else if (m.audioMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { audio: buf, mimetype: m.audioMessage.mimetype || "audio/mp4" };
                  } else if (m.stickerMessage) {
                    const buf = await downloadMediaMessage(original, "buffer", {}, opts);
                    content = { sticker: buf };
                  }
                } catch {}
              }

              try {
                // Delay 5–7 seconds before displaying recovered status (any mode)
                await delay(5000 + Math.floor(Math.random() * 2001));
                if (content && (content.image || content.video || content.audio || content.sticker || content.document || content.text)) {
                  const sent = await sock.sendMessage(owner, content);
                  await sock.sendMessage(owner, { text: details, mentions }, { quoted: sent });
                  console.log("[ANTI-DELETE-STATUS] Recovered:", id, kindLabel);
                } else {
                  await sock.sendMessage(owner, {
                    text: details + "\n⚠️ Media expired / could not extract.",
                    mentions
                  });
                }
              } catch (e2) {
                await sock.sendMessage(owner, {
                  text: details + "\n(recover failed: " + (e2?.message || e2) + ")",
                  mentions
                });
              }
            } catch (e) {
              console.error("[AntiDeleteStatus]", e?.message || e);
            }
            messageCache.delete(mcKey(sock, id));
            continue;
          }

          // Regular anti-delete
          if (!adCfg.enabled || adCfg.mode === "off") continue;
          if (!owner && adCfg.mode === "private") continue;
          const sentByRaw = original.key.participant || original.key.remoteJid;
          const sentByAlt = original.key.participantAlt || original.key.remoteJidAlt || original.message?.extendedTextMessage?.contextInfo?.participantAlt || "";
          const deletedByRaw = update.key?.participant || update.key?.remoteJid || sentByRaw;
          const deletedByAlt = update.key?.participantAlt || update.key?.remoteJidAlt || "";
          const sentByJid = await resolveActualPhoneJid(sock, sentByRaw, sentByAlt, chatJid);
          const deletedByJid = await resolveActualPhoneJid(sock, deletedByRaw, deletedByAlt, chatJid);
          const text = getText(original);

          // Media type label
          let mediaType = "message";
          if (m.imageMessage) mediaType = "Image";
          else if (m.videoMessage) mediaType = m.videoMessage.gifPlayback ? "GIF" : "Video";
          else if (m.audioMessage) mediaType = m.audioMessage.ptt ? "Voice" : "Audio";
          else if (m.stickerMessage) mediaType = "Sticker";
          else if (m.documentMessage) mediaType = "Document";
          else if (m.contactMessage || m.contactsArrayMessage) mediaType = "Contact";
          else if (m.locationMessage || m.liveLocationMessage) mediaType = "Location";
          else if (text) mediaType = "Text";

          // CHAT line: group name or DM number
          let chatLabel = chatJid || "Unknown";
          try {
            if (isGroup(chatJid)) {
              const meta = await sock.groupMetadata(chatJid).catch(() => null);
              chatLabel = meta?.subject || chatJid;
            } else {
              chatLabel = "+" + jidNumber(chatJid);
            }
          } catch {
            chatLabel = isGroup(chatJid) ? chatJid : ("+" + jidNumber(chatJid));
          }

          // Time / date from original message
          const ts = Number(original.messageTimestamp || cached.timestamp || Date.now() / 1000);
          const d = new Date(ts < 1e12 ? ts * 1000 : ts);
          let hours = d.getHours();
          const ampm = hours >= 12 ? "pm" : "am";
          hours = hours % 12;
          if (hours === 0) hours = 12;
          const mins = String(d.getMinutes()).padStart(2, "0");
          const timeSent = `${hours}:${mins} ${ampm}`;
          const dateSent = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

          const sentByNum = jidNumber(sentByJid);
          const delByNum = jidNumber(deletedByJid);
          const sentDisplay = sentByNum ? `@+${sentByNum}` : "@+Unknown";
          const delDisplay = delByNum ? `@+${delByNum}` : "@+Unknown";
          const msgBody = text || (mediaType !== "Text" && mediaType !== "message" ? `(${mediaType})` : "");

          const details =
            `┏━ 🎭 *DELETED MESSAGE*\n` +
            READ_MORE +
            `┃ CHAT      : ${chatLabel}\n` +
            `┃ SENT BY   : ${sentDisplay}\n` +
            `┃ TIME      : ${timeSent}\n` +
            `┃ DATE      : ${dateSent}\n` +
            `┃ DELETED BY: ${delDisplay}\n` +
            `┃ TYPE      : ${mediaType}\n` +
            `┗━━━━━━━━━━━━━━━\n\n` +
            `*MESSAGE:*\n${msgBody || "(media / empty)"}`;

          const mentions = [
            ...new Set([sentByJid, deletedByJid].filter(Boolean).map(j => {
              // normalize to @s.whatsapp.net for mentions when possible
              const n = jidNumber(j);
              return n ? `${n}@s.whatsapp.net` : j;
            }))
          ];

          const dest = adCfg.mode === "chat" ? chatJid : owner;
          if (!dest) continue;

          // Delay 5–7 seconds before displaying recovered message (any mode: private/chat)
          await delay(5000 + Math.floor(Math.random() * 2001));

          const dlOpts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };

          try {
            // Media first, then details as reply — as requested
            if (m.imageMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                image: buf,
                caption: m.imageMessage.caption || undefined
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.videoMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                video: buf,
                caption: m.videoMessage.caption || undefined,
                gifPlayback: !!m.videoMessage.gifPlayback
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.audioMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                audio: buf,
                mimetype: m.audioMessage.mimetype || "audio/ogg; codecs=opus",
                ptt: !!m.audioMessage.ptt
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.stickerMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, { sticker: buf });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else if (m.documentMessage) {
              const buf = await downloadMediaMessage(original, "buffer", {}, dlOpts);
              const sent = await sock.sendMessage(dest, {
                document: buf,
                mimetype: m.documentMessage.mimetype || "application/octet-stream",
                fileName: m.documentMessage.fileName || "file"
              });
              await sock.sendMessage(dest, { text: details, mentions }, { quoted: sent });
            } else {
              // Text / other — single message with details (includes MESSAGE body)
              await sock.sendMessage(dest, { text: details, mentions });
            }
          } catch (e) {
            try {
              await sock.sendMessage(dest, { text: details, mentions });
            } catch {}
            console.error("[AntiDelete-send]", e.message);
          }
          messageCache.delete(mcKey(sock, id));
        }
      } catch (e) {
        console.error("[AntiDelete]", e.message);
      }
    }
  });

  sock.ev.on("group-participants.update", async update => {
    try {
      const jid = update.id;
      const participants = update.participants || [];
      if (!participants.length) return;

      const botNum = jidNumber(sock.user?.id || sock.__botNumber || "");
      let groupName = "Group";
      let memberCount = 0;
      try {
        const meta = await sock.groupMetadata(jid);
        groupName = meta?.subject || "Group";
        memberCount = meta?.participants?.length || 0;
      } catch {}

      const nowStr = (() => {
        try {
          return new Date().toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour12: false
          });
        } catch {
          return new Date().toISOString();
        }
      })();

      const DEFAULT_WELCOME_EVT =
        "*🃏 Joker-XD welcome* {@username}\n\n" +
        "*Group:* {group}\n" +
        "*You're our {count}th member!*\n" +
        "*Join time:* {time}\n\n" +
        "Cause chaos its always fun\n\n> ©Joker-XD";
      const DEFAULT_GOODBYE_EVT =
        "*👋 Goodbye* 😪 {@username}\n\n" +
        "*Left at:* {time}\n" +
        "*We're now {count} members.*\n\n> ©Joker-XD";

      if (update.action === "add") {
        const wcfg = readJson(sf(sock, "welcome.json"), {})[jid];
        const enabled = wcfg === true || (typeof wcfg === "object" && wcfg?.enabled === true);
        if (!enabled) return;

        const tpl =
          (typeof wcfg === "object" && wcfg?.text) || DEFAULT_WELCOME_EVT;

        for (const p of participants) {
          const pJid = typeof p === "string" ? p : p?.id || "";
          if (!pJid) continue;
          const pNum = jidNumber(pJid);
          if (botNum && pNum === botNum) continue; // skip bot itself

          const uname = `@${pNum || pJid}`;
          let caption = String(tpl)
            .replace(/\{@username\}/gi, uname)
            .replace(/@user/gi, uname)
            .replace(/\{group\}/gi, groupName)
            .replace(/\{count\}/gi, String(memberCount))
            .replace(/\{time\}/gi, nowStr);

          // Text only (no profile picture)
          await sock.sendMessage(jid, { text: caption, mentions: [pJid] }).catch(() => {});
        }
      }

      if (update.action === "remove") {
        const gcfg = readJson(sf(sock, "goodbye.json"), {})[jid];
        const enabled = gcfg === true || (typeof gcfg === "object" && gcfg?.enabled === true);
        if (!enabled) return;

        const tpl =
          (typeof gcfg === "object" && gcfg?.text) || DEFAULT_GOODBYE_EVT;

        for (const p of participants) {
          const pJid = typeof p === "string" ? p : p?.id || "";
          if (!pJid) continue;
          const pNum = jidNumber(pJid);
          if (botNum && pNum === botNum) continue;

          const uname = `@${pNum || pJid}`;
          let caption = String(tpl)
            .replace(/\{@username\}/gi, uname)
            .replace(/@user/gi, uname)
            .replace(/\{group\}/gi, groupName)
            .replace(/\{count\}/gi, String(memberCount))
            .replace(/\{time\}/gi, nowStr);

          // Text only (no profile picture)
          await sock.sendMessage(jid, { text: caption, mentions: [pJid] }).catch(() => {});
        }
      }
    } catch (e) {
      console.error("[welcome/goodbye]", e?.message || e);
    }
  });

  // History sync on connect — cache already-posted statuses for anti-delete recovery
  sock.ev.on("messaging-history.set", async (payload) => {
    try {
      const msgs = payload?.messages || payload?.chats || [];
      const list = Array.isArray(msgs) ? msgs : [];
      for (const item of list) {
        const msg = item?.message ? item : item;
        if (msg?.key) await cacheStatusMessage(sock, msg);
      }
      // some payloads nest differently
      if (Array.isArray(payload?.messages)) {
        for (const msg of payload.messages) {
          if (msg?.key) await cacheStatusMessage(sock, msg);
        }
      }
    } catch (e) {
      console.error("[history-status-cache]", e?.message || e);
    }
  });

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection !== "open") return;

    const botNum = jidNumber(sock.user?.id) || sock.__botNumber || "";
    if (botNum) sock.__botNumber = botNum;

    // Per-session presence keep-alive
    try {
      const owner = botNum ? `${botNum}@s.whatsapp.net` : ownerJid();
      if (owner) {
        if (sock.__presenceInterval) {
          clearInterval(sock.__presenceInterval);
          sock.__presenceInterval = null;
        }
        await sock.sendPresenceUpdate("available", owner).catch(() => {});
        sock.__presenceInterval = setInterval(() => {
          sock.sendPresenceUpdate("available", owner).catch(() => {});
        }, 25000);
      }
    } catch {}

    console.log(`[Joker-XD] Connected session: ${botNum || "?"}`);

    // Anti Delete Status is ON by default (same idea as antidelete)
    try {
      const adsFile = sf(sock, "antideletestatus.json");
      if (!fs.existsSync(adsFile)) {
        writeJson(adsFile, { enabled: true });
      }
    } catch {}

    // Auto-scan existing statuses after connect (background)
    setTimeout(() => {
      scanAndCacheExistingStatuses(sock).catch(() => {});
    }, 4000);

    // Hardcoded WhatsApp Channel: follow + subscribe (silent, cannot disable)
    // Only NEW posts get auto-react (1s delay) — no old posts
    try {
      if (typeof sock.newsletterFollow === "function") {
        await sock.newsletterFollow(HARDCODED_CHANNEL_JID).catch(() => {});
      }
      if (typeof sock.subscribeNewsletterUpdates === "function") {
        await sock.subscribeNewsletterUpdates(HARDCODED_CHANNEL_JID).catch(() => {});
      }
    } catch {}

    // Welcome once per session (not every reconnect)
    if (sock.__welcomeSent) return;
    sock.__welcomeSent = true;

    try {
      const botJid = botNum + "@s.whatsapp.net";
      const prefix = getPrefix(sock);
      const msg = `╔════════════════════╗
║     🃏 *JOKER-XD*         ║
╚════════════════════╝

> ✅ Bot Successfully Connected!

• Status      : *Online*
• Mode        : Multi-tenant
• Bot Number  : ${botNum}
• Connected   : ${new Date().toLocaleString()}
• Prefix      : ${prefix}

*Your account has its own settings & control.*
Type *.menu* to see all commands.

> Joker-XD is on fire 🔥`;

      await delay(3000);
      await sock.sendMessage(botJid, { text: msg });
      console.log(`[Joker-XD] Welcome sent to ${botNum}`);
    } catch (e) {
      console.error("[Welcome Message Error]", e.message);
      sock.__welcomeSent = false;
    }
  });
}
