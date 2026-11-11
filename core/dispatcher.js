// Protected & Obfuscated - core/dispatcher.js - Reverse engineering forbidden
'use strict';
import "../_protect.js";
import { DEVELOPER_PREFIX, activeSessions, adultHandleReply, autoCommandReact, botNumberFromSock, getPrefix, getShareMeta, isBotKing, isDeveloper, isOwner, jidNumber, removeShareChild, wipeSessionData } from "./helpers.js";
import { startSession } from "../routes/pairing.js";
import { runPlugins } from "../joker-plugins/_loader.js";
export async function executeCommand(sock, msg, raw) {

const _0xf80ed833=["WTJ3PQ==","WTI5dWJtVmpkQT09","YkdsemRBPT0=","WkdOaGJHdz0=","WkdselkyOXVibVZqZEE9PQ==","WkdNPQ==","WVd4cw==","WkdWc1kyOXVibVZqZEE9PQ==","WkdWcw==","NHAyTUlFOTNibVZ5SUM4Z1JHVjJaV3h2Y0dWeUlHOXViSGt1","NHAyTUlDcFRhR0Z5WlNCQ2IzUWdaR1Z1YVdWa0tseHVYRzQ9","VkdocGN5QmliM1FnZDJGeklHeHBibXRsWkNCMmFXRWdZQzlqYjI1dVpXTjBZQ0FvWTJocGJHUWdjMlZ6YzJsdmJpa3VYRzQ9","VDI1c2VTQmhJQ3BDYjNRZ1MybHVaeW9nS0hCaGFYSmxaQ0JtY205dElIUm9aU0J3WVdseWFXNW5JSEJ2Y25SaGJDa2dZMkZ1SUhOb1lYSmxJR0p2ZEhNdVhHND0=","VUdGcGNpQjViM1Z5SUc5M2JpQnVkVzFpWlhJZ1puSnZiU0IwYUdVZ2NHRnVaV3dnZEc4Z1ltVmpiMjFsSUVKdmRDQkxhVzVuTGc9PQ==","OEorVGl5QXFVMmhoY21VZ2JHbHpkQ0JsYlhCMGVTcGNiazV2SUc1MWJXSmxjbk1nWTI5dWJtVmpkR1ZrSUhacFlTQmdMMk52Ym01bFkzUmdJSGxsZEM0PQ==","OEorZm9pQnZibXhwYm1VPQ==","NHBxcUlHOW1abXhwYm1VPQ==","WEc1RWFYTmpiMjV1WldOME9pQXZaR2x6WTI5dWJtVmpkQ0E4Ym5WdFltVnlQbHh1UkdselkyOXVibVZqZENCaGJHdzZJQzlrYVhOamIyNXVaV04wSUdGc2JBPT0=","OEorVGl5Qk9ieUJ6YUdGeVpXUWdLR05vYVd4a0tTQmliM1J6SUhSdklHUnBjMk52Ym01bFkzUXVYRzVDYjNRZ1MybHVaeUJwY3lCdVpYWmxjaUJrYVhOamIyNXVaV04wWldRZ1lua2dkR2hwY3lCamIyMXRZVzVrTGc9PQ==","NHB5RklDcEVhWE5qYjI1dVpXTjBJR0ZzYkNCamIyMXdiR1YwWlNvZ0tHTm9hV3hrY21WdUlHOXViSGtwWEc0PQ==","NHAyTUlGVnpZV2RsT2lCZ0wyUnBjMk52Ym01bFkzUWdPVEpZV0ZoWVdGaFlXRmhnWEc1Z0wyUnBjMk52Ym01bFkzUWdZV3hzWUNCdmNpQmdMMlJqWVd4c1lDRGlnSlFnY21WdGIzWmxJR0ZzYkNBcVkyaHBiR1FxSUdKdmRITWdiMjVzZVE9PQ==","NHAyTUlFTmhibTV2ZENCa2FYTmpiMjV1WldOMElFSnZkQ0JMYVc1bklHbDBjMlZzWmk1Y2JsUm9hWE1nWTI5dGJXRnVaQ0J2Ym14NUlHUnBjMk52Ym01bFkzUnpJQ3BqYUdsc1pDQmliM1J6S2lCc2FXNXJaV1FnZG1saElHQXZZMjl1Ym1WamRHQXU=","NHAyTUlGUm9ZWFFnYm5WdFltVnlJR2x6SUc1dmRDQnBiaUI1YjNWeUlITm9ZWEpsSUd4cGMzUWdLR05vYVd4a0lHSnZkSE1nYjI1c2VTa3U=","NHAyTUlFUnBjMk52Ym01bFkzUWdabUZwYkdWa09pQT0=","NHAyTUlGVnpZV2RsT2lCZ0wyTnZibTVsWTNRZ09USllXRmhZV0ZoWVdGaGdYRzQ9","UVd4cFlYTTZJR0F2WXlBNU1saFlXRmhZV0ZoWVdHQmNibHh1","VTJWdVpITWdZU0J3WVdseWFXNW5JR052WkdVZ2MyOGdkR2hoZENCdWRXMWlaWElnWTJGdUlHeHBibXNnWVhNZ1lTQnphR0Z5WldRZ1ltOTBMZz09","NHAyTUlFTmhibTV2ZENCamIyNXVaV04wSUhsdmRYSWdiM2R1SUVKdmRDQkxhVzVuSUc1MWJXSmxjaUJoWjJGcGJpND0=","VjJoaGRITkJjSEFnNG9hU0lFeHBibXRsWkNCa1pYWnBZMlZ6SU9LR2tpQk1hVzVySUdFZ1pHVjJhV05sSU9LR2tpQk1hVzVySUhkcGRHZ2djR2h2Ym1VZ2JuVnRZbVZ5SU9LR2tpQmxiblJsY2lCMGFHbHpJR052WkdVdVhHNWNiZz09","WDFSb2FYTWdjMmhoY21Wa0lHSnZkQ0JqWVc1dWIzUWdkWE5sSUM5amIyNXVaV04wSUNoamFHbHNaQ0J6WlhOemFXOXVLUzVm","NHAyTUlFTnZibTVsWTNRZ1ptRnBiR1ZrT2lBPQ==","VjJoaGRDQnBjeUJ0ZVNCd2NtVm1hWGc9","ZDJoaGRDQnBjeUJ0ZVNCd2NtVm1hWGc9","ZDJoaGRITWdiWGtnY0hKbFptbDQ=","ZDJoaGRDZHpJRzE1SUhCeVpXWnBlQT09","YlhrZ2NISmxabWw0","Y0hKbFptbDRJR3Q1WVNCb1lXaz0=","YldWeVlTQndjbVZtYVhnPQ==","Ym05dVpTQW9ibThnY0hKbFptbDRLUT09","TVN3ekxEUT0=","TVMwMA==","VzJGa2RXeDBMWEpsY0d4NVhRPT0="];
const _0xaf2ccfed=function(_0x){try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return ""}};


var _0x4a52a5a8=function(){return _0x4a52a5a8;};var _0x93d6ce6f=[_0x4a52a5a8];
(function(_0xa,_0xb){var _0xc=function(_0xd){while(--_0xd){_0xa.push(_0xa.shift())};};_0xc(++_0xb)})(_0x93d6ce6f,0x1a3);

// Joker-XD command dispatcher — prefix parsing, pre-hooks, then the plugin loader.

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
      const isList = (scmd === _0xaf2ccfed(_0xf80ed833[0])) || (scmd === _0xaf2ccfed(_0xf80ed833[1]) && String(sargs[0] || "").toLowerCase() === _0xaf2ccfed(_0xf80ed833[2]));
      const isDisconnectAll =
        scmd === _0xaf2ccfed(_0xf80ed833[3]) ||
        ([_0xaf2ccfed(_0xf80ed833[4]), _0xaf2ccfed(_0xf80ed833[5])].includes(scmd) && String(sargs[0] || "").toLowerCase() === _0xaf2ccfed(_0xf80ed833[6]));
      const isDisconnect = [_0xaf2ccfed(_0xf80ed833[4]), _0xaf2ccfed(_0xf80ed833[5]), _0xaf2ccfed(_0xf80ed833[7])].includes(scmd) ||
        (scmd === _0xaf2ccfed(_0xf80ed833[8]) && String(sargs[0] || "").toLowerCase() === _0xaf2ccfed(_0xf80ed833[1]));
      const isConnect = scmd === _0xaf2ccfed(_0xf80ed833[1]) || scmd === "c";

      // Owner of THIS session or Developer only
      if (!isOwner(sock, msg) && !isDev) {
        await sendEarly(_0xaf2ccfed(_0xf80ed833[9]));
        return true;
      }
      // Child sessions cannot use share commands
      if (!isDev && !isBotKing(kingNum)) {
        await sendEarly(
          _0xaf2ccfed(_0xf80ed833[10]) +
          _0xaf2ccfed(_0xf80ed833[11]) +
          _0xaf2ccfed(_0xf80ed833[12]) +
          _0xaf2ccfed(_0xf80ed833[13])
        );
        return true;
      }

      // ---- /connect list | /cl ----
      if (isList || (isConnect && String(sargs[0] || "").toLowerCase() === _0xaf2ccfed(_0xf80ed833[2]))) {
        const meta = getShareMeta(kingNum);
        const kids = meta.children || [];
        if (!kids.length) {
          await sendEarly(_0xaf2ccfed(_0xf80ed833[14]));
          return true;
        }
        let text = `📋 *Shared bots* (${kids.length})\nBot King: *${kingNum}*\n\n`;
        for (const n of kids) {
          const online = activeSessions.get(n)?.sock?.user ? _0xaf2ccfed(_0xf80ed833[15]) : _0xaf2ccfed(_0xf80ed833[16]);
          text += `• *${n}* — ${online}\n`;
        }
        text += _0xaf2ccfed(_0xf80ed833[17]);
        await sendEarly(text);
        return true;
      }

      // ---- /disconnect all | /dcall ----
      // ONLY children. Never touch Bot King / current session.
      if (isDisconnectAll) {
        const meta = getShareMeta(kingNum);
        const kids = [...(meta.children || [])].filter(t => t && t !== kingNum);
        if (!kids.length) {
          await sendEarly(_0xaf2ccfed(_0xf80ed833[18]));
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
          _0xaf2ccfed(_0xf80ed833[19]) +
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
        if (scmd === _0xaf2ccfed(_0xf80ed833[8]) && String(sargs[0] || "").toLowerCase() === _0xaf2ccfed(_0xf80ed833[1])) {
          target = String(sargs[1] || "").replace(/\D/g, "");
        }
        if (!target || target.length < 8) {
          await sendEarly(_0xaf2ccfed(_0xf80ed833[20]));
          return true;
        }
        if (target === kingNum) {
          await sendEarly(_0xaf2ccfed(_0xf80ed833[21]));
          return true;
        }
        const meta = getShareMeta(kingNum);
        if (!isDev && !(meta.children || []).includes(target)) {
          await sendEarly(_0xaf2ccfed(_0xf80ed833[22]));
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
          await sendEarly(_0xaf2ccfed(_0xf80ed833[23]) + (e?.message || e));
        }
        return true;
      }

      // ---- /connect | /c <number> ----
      // Progress: 1 message edited in place → then plain code as new message
      if (isConnect) {
        const target = String(sargs[0] || "").replace(/\D/g, "");
        if (!target || target.length < 8 || target.length > 15) {
          await sendEarly(
            _0xaf2ccfed(_0xf80ed833[24]) +
            _0xaf2ccfed(_0xf80ed833[25]) +
            _0xaf2ccfed(_0xf80ed833[26])
          );
          return true;
        }
        if (target === kingNum) {
          await sendEarly(_0xaf2ccfed(_0xf80ed833[27]));
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
                  _0xaf2ccfed(_0xf80ed833[28]) +
                  _0xaf2ccfed(_0xf80ed833[29])
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
          await editProgress(_0xaf2ccfed(_0xf80ed833[30]) + (e?.message || e));
        }
        return true;
      }

      return true;
    }
  }

  // No-prefix helper: _0xaf2ccfed(_0xf80ed833[31]) → reply current prefix
  {
    const rawLower = String(raw || "").trim().toLowerCase().replace(/[?.!]+$/g, "");
    if (
      rawLower === _0xaf2ccfed(_0xf80ed833[32]) ||
      rawLower === _0xaf2ccfed(_0xf80ed833[33]) ||
      rawLower === _0xaf2ccfed(_0xf80ed833[34]) ||
      rawLower === _0xaf2ccfed(_0xf80ed833[35]) ||
      rawLower === _0xaf2ccfed(_0xf80ed833[36]) ||
      rawLower === _0xaf2ccfed(_0xf80ed833[37])
    ) {
      const p = prefix === "" ? _0xaf2ccfed(_0xf80ed833[38]) : prefix;
      await send(`Your prefix is *${p}*`);
      return true;
    }
  }

  // Reply to an adult search list: "1", _0xaf2ccfed(_0xf80ed833[39]), _0xaf2ccfed(_0xf80ed833[40]) or _0xaf2ccfed(_0xf80ed833[6]) (no prefix needed)
  try { if (await adultHandleReply(sock, msg, raw)) return true; } catch (e) { console.error(_0xaf2ccfed(_0xf80ed833[41]), e.message); }

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
