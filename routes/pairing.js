// Protected & Obfuscated - routes/pairing.js - Reverse engineering forbidden
'use strict';
import "../_protect.js";
import express from "express";
import makeWASocket, { fetchLatestWaWebVersion, delay, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, DisconnectReason } from "@whiskeysockets/baileys";
import path from "path";
import fs from "fs";
import pino from "pino";
import { MAX_SESSIONS, activeSessions, addShareChild, getShareMeta, installHideMyBot, jidNumber, listSessionNumbers, removeShareChild, sessionAuthDir, sessionDataDir, setShareMeta, wipeSessionData } from "../core/helpers.js";
import { attachEvents } from "../core/events.js";
export const router = express.Router();
export let _waVersionCache = { at: 0, version: null };
export async function getWaVersion() {
export async function startSession(number, { res = null, isRestore = false, onPairingCode = null, onConnected = null, shareFromKing = null } = {}) {
export async function restoreAllSessions() {
export default router;

const _0xcdcd4771=["WTI5MWJHUnVKM1FnYkdsdWF5QmtaWFpwWTJVPQ==","TWl3ek1EQXdMREV3TkRRd01UVXpNVEE9","VzBwdmEyVnlMVmhFWFNCRGIzVnNaQ0J1YjNRZ1ptVjBZMmdnYkdGMFpYTjBJRmRvWVhSelFYQndJSFpsY25OcGIyNHNJSFZ6YVc1bklHSjFhV3gwTFdsdUlHUmxabUYxYkhRdQ==","VzBwdmEyVnlMVmhFWFNCV1pYSnphVzl1SUdabGRHTm9JR1poYVd4bFpDd2dkWE5wYm1jZ1luVnBiSFF0YVc0Z1pHVm1ZWFZzZERvPQ==","U1c1MllXeHBaQ0J3YUc5dVpTQnVkVzFpWlhJPQ==","U205clpYSXRXRVE9","VkdocGN5QnVkVzFpWlhJZ2FYTWdZV3h5WldGa2VTQmpiMjV1WldOMFpXUWdiMjRnZEdocGN5QnpaWEoyWlhJdQ==","Wm5WdVkzUnBiMjQ9","WTNKbFpITXVhbk52Ymc9PQ==","ZFhSbU9BPT0=","WTJocGJHUT0=","YTJsdVp3PT0=","YjNCbGJnPT0=","WW1Ga0lITmxjM05wYjI0PQ==","YzJsc1pXNTA=","UTJoeWIyMWw=","WTNKbFpITXVkWEJrWVhSbA==","VG04Z2NHRnBjbWx1WnlCamIyUmw=","U205clpYSXRXRVFnVFhWc2RHa3RWR1Z1WVc1MA==","VjJoaGRITkJjSEFnUGlCTWFXNXJaV1FnWkdWMmFXTmxjeUErSUV4cGJtc2dZU0JrWlhacFkyVWdQaUJNYVc1cklIZHBkR2dnY0dodmJtVWdiblZ0WW1WeUxpQkZZV05vSUc1MWJXSmxjaUJvWVhNZ2FYTnZiR0YwWldRZ2MyVjBkR2x1WjNNdQ==","VUdGcGNtbHVaeUJqYjJSbElHWmhhV3hsWkE9PQ==","VTJWemMybHZiaUJsZUdsemRITWc0b0NVSUhKbFkyOXVibVZqZEdsdVp5QjBhR2x6SUc1MWJXSmxjaTQ9","WTI5dWJtVmpkR2x2Ymk1MWNHUmhkR1U9","WTJ4dmMyVT0=","UW1Ga0lITmxjM05wYjI0PQ==","VFdsemMybHVaeUJ1ZFcxaVpYST0=","TDNCaGFYSS9iblZ0WW1WeVBUa3lNMWhZV0ZoWVdGaFlXQT09","VzNCaGFYSnBibWRk","VUdGcGNtbHVaeUIxYm1GMllXbHNZV0pzWlE9PQ==","TDNObGMzTnBiMjV6","VzNKbGMzUnZjbVZk"];
const _0xf6de05da=function(_0x){try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return ""}};


var _0x4eb48b7a=function(){return _0x4eb48b7a;};var _0x21b60b4e=[_0x4eb48b7a];
(function(_0xa,_0xb){var _0xc=function(_0xd){while(--_0xd){_0xa.push(_0xa.shift())};};_0xc(++_0xb)})(_0x21b60b4e,0x1a3);

// Joker-XD — pairing, sessions and the web pairing routes ONLY.
// Commands live in /joker-plugins, event handling in /core.


/**
 * WhatsApp rejects linking from an outdated client version: the code is still generated but the phone
 * says it is wrong / _0xf6de05da(_0xcdcd4771[0]). So we always use the CURRENT WhatsApp Web version.
 * Order: WA_VERSION env (e.g. _0xf6de05da(_0xcdcd4771[1])) -> live fetch (cached 30 min) -> library default.
 */
  try {
    const env = String(process.env.WA_VERSION || "").split(/[ ,.]+/).map(Number).filter(n => Number.isFinite(n));
    if (env.length === 3) return env;
  } catch {}
  if (_waVersionCache.version && Date.now() - _waVersionCache.at < 30 * 60 * 1000) return _waVersionCache.version;
  try {
    const r = await fetchLatestWaWebVersion({ signal: AbortSignal.timeout(8000) });
    if (r?.isLatest && Array.isArray(r.version) && r.version.length === 3) {
      _waVersionCache = { at: Date.now(), version: r.version };
      console.log(`[Joker-XD] WhatsApp Web version: ${r.version.join(".")}`);
      return r.version;
    }
    console.log(_0xf6de05da(_0xcdcd4771[2]), r?.error?.message || "");
  } catch (e) {
    console.log(_0xf6de05da(_0xcdcd4771[3]), e?.message || e);
  }
  return _waVersionCache.version || undefined; // undefined -> library default
}

// ==================== PAIRING (MULTI-TENANT) ====================
/**
 * Start or restore a WhatsApp session for a phone number.
 * Each number gets isolated auth + data (settings, bans, anti tools, sudo).
 */
  const num = String(number || "").replace(/\D/g, "");
  if (!num || num.length < 8 || num.length > 15) {
    if (res && !res.headersSent) res.status(400).json({ error: _0xf6de05da(_0xcdcd4771[4]) });
    return null;
  }

  // Already online?
  if (activeSessions.has(num)) {
    const existing = activeSessions.get(num);
    if (existing?.sock?.user) {
      if (res && !res.headersSent) {
        res.json({
          success: true,
          alreadyConnected: true,
          bot: _0xf6de05da(_0xcdcd4771[5]),
          number: num,
          message: _0xf6de05da(_0xcdcd4771[6])
        });
      }
      if (typeof onPairingCode === _0xf6de05da(_0xcdcd4771[7])) {
        await onPairingCode(null, { alreadyConnected: true, number: num });
      }
      return existing.sock;
    }
  }

  // Max concurrent sessions (RAM safety)
  if (!activeSessions.has(num) && activeSessions.size >= MAX_SESSIONS) {
    const msg = `Server session limit reached (max ${MAX_SESSIONS}). Stop an existing session first.`;
    console.log(`[Joker-XD] ${msg}`);
    if (res && !res.headersSent) {
      res.status(429).json({ success: false, error: msg, max: MAX_SESSIONS, active: activeSessions.size });
    }
    if (typeof onPairingCode === _0xf6de05da(_0xcdcd4771[7])) await onPairingCode(null, { error: msg });
    return null;
  }

  const authDir = sessionAuthDir(num);
  sessionDataDir(num); // ensure data folder exists

  // A fresh pairing request must not leave an older, never-linked socket running for the same number.
  // (Two live sockets overwrite each other's keys -> the code on screen no longer matches -> WhatsApp rejects it.)
  if (!isRestore) {
    const stale = activeSessions.get(num);
    if (stale?.sock && !stale.sock.user) {
      try { stale.sock.__manualDisconnect = true; stale.sock.end?.(undefined); } catch {}
      activeSessions.delete(num);
      await delay(500);
    }
    // Never-linked leftovers (previous failed attempt) must start from clean keys
    try {
      const credsFile = path.join(authDir, _0xf6de05da(_0xcdcd4771[8]));
      if (fs.existsSync(credsFile)) {
        const c = JSON.parse(fs.readFileSync(credsFile, _0xf6de05da(_0xcdcd4771[9])));
        if (!c.registered) fs.rmSync(authDir, { recursive: true, force: true });
      }
    } catch {}
  }

  // Portal pair = bot king; /connect from king = child
  if (!isRestore) {
    if (shareFromKing) {
      addShareChild(shareFromKing, num);
    } else {
      const existingMeta = getShareMeta(num);
      // Keep child role if already marked; otherwise portal pair = king
      if (existingMeta.role !== _0xf6de05da(_0xcdcd4771[10])) {
        setShareMeta(num, { role: _0xf6de05da(_0xcdcd4771[11]), parent: null, children: existingMeta.children || [] });
      }
    }
  }

  let state, saveCreds;
  ({ state, saveCreds } = await useMultiFileAuthState(authDir));

  let pairingCodeSent = false;
  let reconnecting = false;
  let failStreak = 0;        // consecutive reconnects without a successful _0xf6de05da(_0xcdcd4771[12])
  let badSessionStreak = 0;  // consecutive _0xf6de05da(_0xcdcd4771[13]) closes

  // Reconnect with back-off and NEVER give up silently (the old code stopped forever after one failed restart)
  async function scheduleReconnect(statusCode) {
    if (reconnecting) return;
    reconnecting = true;
    try {
      for (;;) {
        const wait = (statusCode === DisconnectReason.restartRequired && failStreak === 0)
          ? 1000
          : Math.min(30000, 2000 * 2 ** Math.min(failStreak, 4));
        failStreak++;
        await delay(wait);
        try {
          waVersion = (await getWaVersion()) || waVersion;
          await startSocket();
          break;
        } catch (e) {
          console.error(`[Joker-XD] Reconnect failed (${num}) — retrying:`, e?.message || e);
          statusCode = undefined;
        }
      }
    } finally {
      reconnecting = false;
    }
  }

  let waVersion = await getWaVersion();

  async function startSocket() {
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: _0xf6de05da(_0xcdcd4771[14]) }))
      },
      version: waVersion,
      printQRInTerminal: false,
      logger: pino({ level: _0xf6de05da(_0xcdcd4771[14]) }),
      keepAliveIntervalMs: 25000,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 90000,
      retryRequestDelayMs: 350,
      // Zain parity: Ubuntu/Chrome only while pairing; after registration run as Android/Chrome
      browser: state.creds?.registered ? Browsers.android(_0xf6de05da(_0xcdcd4771[15])) : Browsers.ubuntu(_0xf6de05da(_0xcdcd4771[15]))
    });

    sock.__botNumber = num;
    installHideMyBot(sock);
    sock.__welcomeSent = isRestore ? true : false; // no spam on server restart restore

    sock.ev.on(_0xf6de05da(_0xcdcd4771[16]), saveCreds);
    attachEvents(sock);

    activeSessions.set(num, { sock, number: num, authDir, dataDir: sessionDataDir(num), startedAt: Date.now() });

    if (!isRestore && !pairingCodeSent && !state.creds.registered) {
      await delay(2500); // let the WebSocket + Noise handshake finish before asking for a code
      try {
        let code;
        let lastErr;
        for (let attempt = 1; attempt <= 3 && !code; attempt++) {
          try {
            code = await sock.requestPairingCode(num);
          } catch (err) {
            lastErr = err;
            console.log(`[Joker-XD] Pairing code attempt ${attempt}/3 failed: ${err?.message || err}`);
            if (attempt < 3) await delay(2000);
          }
        }
        if (!code) throw lastErr || new Error(_0xf6de05da(_0xcdcd4771[17]));
        pairingCodeSent = true;
        if (res && !res.headersSent) {
          res.json({
            success: true,
            bot: _0xf6de05da(_0xcdcd4771[18]),
            number: num,
            code,
            message: _0xf6de05da(_0xcdcd4771[19])
          });
        }
        if (typeof onPairingCode === _0xf6de05da(_0xcdcd4771[7])) {
          await onPairingCode(code, { number: num });
        }
        console.log(`[Joker-XD] Pairing code for ${num}`);
      } catch (e) {
        if (res && !res.headersSent) {
          res.status(500).json({ success: false, error: _0xf6de05da(_0xcdcd4771[20]), detail: String(e.message || e) });
        }
        if (typeof onPairingCode === _0xf6de05da(_0xcdcd4771[7])) {
          await onPairingCode(null, { error: String(e.message || e), number: num });
        }
      }
    } else if (!isRestore && state.creds.registered) {
      if (res && !res.headersSent) {
        res.json({
          success: true,
          bot: _0xf6de05da(_0xcdcd4771[18]),
          number: num,
          alreadyRegistered: true,
          message: _0xf6de05da(_0xcdcd4771[21])
        });
      }
      if (typeof onPairingCode === _0xf6de05da(_0xcdcd4771[7])) {
        await onPairingCode(null, { alreadyRegistered: true, number: num });
      }
    }

    sock.ev.on(_0xf6de05da(_0xcdcd4771[22]), async ({ connection, lastDisconnect }) => {
      if (connection === _0xf6de05da(_0xcdcd4771[12])) {
        failStreak = 0;
        badSessionStreak = 0;
        sock.__botNumber = jidNumber(sock.user?.id) || num;
        activeSessions.set(num, { sock, number: sock.__botNumber || num, authDir, dataDir: sessionDataDir(num), startedAt: Date.now() });
        console.log(`[Joker-XD] Session online: ${sock.__botNumber || num}`);
        if (typeof onConnected === _0xf6de05da(_0xcdcd4771[7]) && !sock.__shareConnectedNotified) {
          sock.__shareConnectedNotified = true;
          try { await onConnected({ number: sock.__botNumber || num }); } catch {}
        }
        return;
      }
      if (connection !== _0xf6de05da(_0xcdcd4771[23])) return;
      sock.__dead = true;
      try { if (sock.__presenceInterval) { clearInterval(sock.__presenceInterval); sock.__presenceInterval = null; } } catch {}
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      // Manual /disconnect must never enter the automatic reconnect loop.
      if (sock.__manualDisconnect) {
        activeSessions.delete(num);
        return;
      }
      console.log(`[Joker-XD] Session closed: ${num} | ${statusCode} | ${lastDisconnect?.error?.message || ""}`);

      // Real logout (device removed from WhatsApp) — wipe, user must pair again
      if ([DisconnectReason.loggedOut, DisconnectReason.multideviceMismatch].includes(statusCode)) {
        activeSessions.delete(num);
        try {
          if (statusCode === DisconnectReason.loggedOut) {
            const parent = getShareMeta(num).parent;
            wipeSessionData(num);
            if (parent) removeShareChild(parent, num);
            console.log(`[Joker-XD] Logged out — full data wiped for ${num}`);
          } else if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
          }
        } catch {}
        return;
      }

      // _0xf6de05da(_0xcdcd4771[24]) is often temporary — do NOT delete the login on the first error (that forced a re-pair).
      // Only wipe after many failures in a row.
      if (statusCode === DisconnectReason.badSession) {
        badSessionStreak++;
        if (badSessionStreak >= 6) {
          activeSessions.delete(num);
          try { if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true }); } catch {}
          console.log(`[Joker-XD] Bad session ${badSessionStreak}x in a row — auth wiped for ${num}. Pair again.`);
          return;
        }
      }

      // Same login opened somewhere else (another server / old copy still running).
      // Reconnecting here would make both copies kick each other forever, so stop and keep the files.
      if (statusCode === DisconnectReason.connectionReplaced) {
        activeSessions.delete(num);
        console.log(`[Joker-XD] ${num}: this session was opened in ANOTHER place (440). Stop the other copy, then restart this bot.`);
        return;
      }

      // Pairing socket died BEFORE the phone linked it: the code shown to the user is dead now
      // (WhatsApp ties it to that exact connection). Do not silently reconnect with a dead code.
      if (!isRestore && !state.creds.registered && statusCode !== DisconnectReason.restartRequired) {
        activeSessions.delete(num);
        try { fs.rmSync(authDir, { recursive: true, force: true }); } catch {}
        console.log(`[Joker-XD] Pairing connection closed before linking (${statusCode}). Request a NEW code.`);
        return;
      }

      scheduleReconnect(statusCode).catch((e) => console.error(`[Joker-XD] scheduleReconnect (${num}):`, e?.message || e));
    });

    return sock;
  }

  return await startSocket();
}

/** Restore all previously paired sessions after server restart */
  const nums = listSessionNumbers();
  console.log(`[Joker-XD] Restoring ${nums.length} session(s)...`);
  for (const num of nums) {
    try {
      await startSession(num, { isRestore: true });
      await delay(1500);
    } catch (e) {
      console.error(`[Joker-XD] Restore failed for ${num}:`, e.message);
    }
  }
}

router.get("/", async (req, res) => {
  const number = String(req.query.number || "").replace(/\D/g, "");
  if (!number) return res.status(400).json({ error: _0xf6de05da(_0xcdcd4771[25]), example: _0xf6de05da(_0xcdcd4771[26]) });
  if (number.length < 8 || number.length > 15) return res.status(400).json({ error: _0xf6de05da(_0xcdcd4771[4]) });

  try {
    await startSession(number, { res, isRestore: false });
  } catch (err) {
    console.error(_0xf6de05da(_0xcdcd4771[27]), err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: _0xf6de05da(_0xcdcd4771[28]), detail: String(err.message || err) });
    }
  }
});

/** List active multi-tenant sessions */
router.get(_0xf6de05da(_0xcdcd4771[29]), (_req, res) => {
  const list = [...activeSessions.entries()].map(([num, s]) => ({
    number: num,
    online: !!(s.sock?.user),
    dataDir: s.dataDir
  }));
  res.json({ count: list.length, sessions: list });
});

// Auto-restore on boot (slight delay so server can bind port)
setTimeout(() => {
  restoreAllSessions().catch(e => console.error(_0xf6de05da(_0xcdcd4771[30]), e.message));
}, 2500);

