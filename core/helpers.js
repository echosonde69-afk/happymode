// Joker-XD core helpers — shared by pairing, events and every plugin.
// (moved out of routes/pairing.js; code unchanged)
import express from "express";
import fs from "fs";
import zlib from "zlib";
import { randomBytes } from "crypto";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { pipeline } from "stream/promises";
import { Transform } from "stream";
import pino from "pino";
import axios from "axios";
import FormData from "form-data";
import yts from "yt-search";
import { igdl, fbdl, igdl2, fbdl2 } from "ruhend-scraper";
import makeWASocket, {
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  DisconnectReason,
  fetchLatestWaWebVersion,
  downloadMediaMessage,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  proto
} from "@whiskeysockets/baileys";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";



export const execAsync = promisify(exec);

/** Resolve ffmpeg: system paths first (libwebp/libx264), then bundled installer */
export const FFMPEG_PATH = (() => {
  const candidates = ["/usr/bin/ffmpeg", "/bin/ffmpeg", "/usr/local/bin/ffmpeg"];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch {}
  }
  try {
    if (ffmpegInstaller?.path && fs.existsSync(ffmpegInstaller.path)) {
      return ffmpegInstaller.path;
    }
  } catch {}
  return "ffmpeg";
})();
console.log("[ffmpeg] using:", FFMPEG_PATH);
export const TEMP_DIR = path.join(process.cwd(), "temp");
export const DATA_DIR = path.join(process.cwd(), "data");
export const MEDIA_DIR = path.join(TEMP_DIR, "media");
/** Per-user sessions: sessions/{phone}/auth + sessions/{phone}/data */
export const SESSIONS_DIR = path.join(process.cwd(), "sessions");
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(SESSIONS_DIR, { recursive: true });

/** Active multi-tenant sessions: phoneNumber -> { sock, number, authDir, dataDir, startedAt } */
export const activeSessions = new Map();
/** Max concurrent sessions (2GB RAM server → ~5 safe). Override: MAX_SESSIONS env */
export const MAX_SESSIONS = Math.max(1, Math.min(20, Number(process.env.MAX_SESSIONS) || 5));

export function botNumberFromSock(sock) {
  if (!sock) return "";
  if (sock.__botNumber) return String(sock.__botNumber).replace(/\D/g, "");
  return jidNumber(sock.user?.id || sock.user?.lid || "");
}

export function sessionDataDir(sockOrNum) {
  const num = typeof sockOrNum === "string"
    ? String(sockOrNum).replace(/\D/g, "")
    : botNumberFromSock(sockOrNum);
  const key = num || "default";
  if (!num) console.warn("[isolation] session number unknown -> using shared 'default' data folder");
  const dir = path.join(SESSIONS_DIR, key, "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function sessionAuthDir(number) {
  const num = String(number || "").replace(/\D/g, "") || "default";
  const dir = path.join(SESSIONS_DIR, num, "auth");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Per-session file path (isolates settings per paired account) */
export function sf(sockOrNum, filename) {
  return path.join(sessionDataDir(sockOrNum), filename);
}

/** Share-bot meta: king (portal-paired) can /connect children; children cannot */
export function getShareMeta(num) {
  const n = String(num || "").replace(/\D/g, "");
  return readJson(path.join(sessionDataDir(n), "share-meta.json"), {
    role: "king",
    parent: null,
    children: []
  });
}
export function setShareMeta(num, meta) {
  const n = String(num || "").replace(/\D/g, "");
  writeJson(path.join(sessionDataDir(n), "share-meta.json"), meta);
}
export function isBotKing(num) {
  const meta = getShareMeta(num);
  return meta.role !== "child";
}
export function addShareChild(kingNum, childNum) {
  const k = String(kingNum || "").replace(/\D/g, "");
  const c = String(childNum || "").replace(/\D/g, "");
  const meta = getShareMeta(k);
  meta.role = "king";
  meta.children = Array.isArray(meta.children) ? meta.children : [];
  if (!meta.children.includes(c)) meta.children.push(c);
  setShareMeta(k, meta);
  setShareMeta(c, { role: "child", parent: k, children: [] });
}
export function removeShareChild(kingNum, childNum) {
  const k = String(kingNum || "").replace(/\D/g, "");
  const c = String(childNum || "").replace(/\D/g, "");
  const meta = getShareMeta(k);
  meta.children = (meta.children || []).filter(x => x !== c);
  setShareMeta(k, meta);
}
/** Wipe full session (auth + data) from disk */
export function wipeSessionData(num) {
  const n = String(num || "").replace(/\D/g, "");
  if (!n) return;
  try { _prefixCache.delete(n); } catch {}
  try {
    const root = path.join(SESSIONS_DIR, n);
    if (fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
  } catch {}
  try {
    // also clean parent children list if any parent points here
    for (const other of listSessionNumbers()) {
      const m = getShareMeta(other);
      if ((m.children || []).includes(n)) {
        m.children = m.children.filter(x => x !== n);
        setShareMeta(other, m);
      }
    }
  } catch {}
}

export function listSessionNumbers() {
  try {
    return fs.readdirSync(SESSIONS_DIR).filter(n => {
      try {
        return fs.statSync(path.join(SESSIONS_DIR, n)).isDirectory()
          && fs.existsSync(path.join(SESSIONS_DIR, n, "auth"));
      } catch { return false; }
    });
  } catch { return []; }
}

// ==================== JOKER-XD DOWNLOAD (Keith + multi-API — no yt-dlp, no Venom) ====================
export const KEITH_API = process.env.API_BASE || "https://apiskeith2-production-3020.up.railway.app";
export const AXIOS_DL = {
  timeout: 60000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*"
  },
  validateStatus: () => true
};

// ==================== FREE AI (Joker-XD style — no personal API key) ====================
export const AI_CHATBOT_FILE = path.join(DATA_DIR, "aichatbot.json");
export const aiLastReply = new Map();

// Lightweight in-memory chat history (per chat jid). Max ~12 msgs + 24h expiry → very low RAM load
// No disk writes, no DB — auto-cleans so server stays light
export const aiChatHistory = new Map(); // jid -> { messages: [{role, content, ts}], lastActive }
export const AI_HISTORY_MAX_MSGS = 12;       // max messages kept per chat (~6 turns)
export const AI_HISTORY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const AI_HISTORY_MAX_CHARS = 400;     // truncate each message for safety

export function pruneAiHistory(entry) {
  if (!entry || !Array.isArray(entry.messages)) return;
  const cutoff = Date.now() - AI_HISTORY_TTL_MS;
  entry.messages = entry.messages.filter((m) => m.ts >= cutoff);
  if (entry.messages.length > AI_HISTORY_MAX_MSGS) {
    entry.messages = entry.messages.slice(-AI_HISTORY_MAX_MSGS);
  }
}

export function getAiHistory(jid) {
  const key = String(jid || "");
  if (!key) return [];
  const entry = aiChatHistory.get(key);
  if (!entry) return [];
  pruneAiHistory(entry);
  if (!entry.messages.length) {
    aiChatHistory.delete(key);
    return [];
  }
  return entry.messages.map((m) => ({ role: m.role, content: m.content }));
}

export function pushAiHistory(jid, role, content) {
  const key = String(jid || "");
  if (!key) return;
  let entry = aiChatHistory.get(key);
  if (!entry) {
    entry = { messages: [], lastActive: Date.now() };
    aiChatHistory.set(key, entry);
  }
  const text = String(content || "").trim().slice(0, AI_HISTORY_MAX_CHARS);
  if (!text) return;
  entry.messages.push({ role, content: text, ts: Date.now() });
  entry.lastActive = Date.now();
  pruneAiHistory(entry);
}

// Occasional cleanup of stale chats (very cheap)
setInterval(() => {
  const now = Date.now();
  for (const [k, entry] of aiChatHistory.entries()) {
    if (!entry || now - (entry.lastActive || 0) > AI_HISTORY_TTL_MS) {
      aiChatHistory.delete(k);
    } else {
      pruneAiHistory(entry);
      if (!entry.messages.length) aiChatHistory.delete(k);
    }
  }
}, 30 * 60 * 1000).unref?.();

// OpenRouter key: env OPENROUTER_API_KEY overrides; default is the key you provided
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  || "";
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/auto";

export const JOKER_AI_SYSTEM = `You are Joker-XD, a helpful WhatsApp bot assistant by Zain Marten Joker (Developer).

IDENTITY / ORIGIN:
- Your developer created you in 2011.
- Due to public demand, v1 was publicly released in 2025.
- Current version is Joker-XD multi-tenant WhatsApp bot.
- Keep replies clear, concise, friendly. Light emoji when natural.

WHAT YOU KNOW (normal user level only):
- All public bot commands, their usage, aliases, and what they do (menu, group tools, download, spam tools, settings, welcome/goodbye, getpp, antidelete, antiedit, save/send, etc.).
- How to use commands with the active prefix (usually ".").
- General help for a normal WhatsApp user of this bot.

STRICT RULES — NEVER break these:
1) NEVER share, describe, or leak any private bot source code, JavaScript files, internal code, server code, pairing logic, auth, or implementation details.
2) NEVER share API keys, tokens, endpoints that are private, OpenRouter keys, or any secret. If asked for API/key: reply exactly that you do not have permission to give that.
3) If someone asks for private/source/JS/code of this or any private bot: refuse politely — no permission.
4) If someone asks private/developer-only questions (internal config, secrets, private channels beyond public help): tell them to go to the support channel and ask the Developer.
5) Do not invent admin/owner secrets. Stay at simple end-user knowledge.
6) You may explain public commands and usage freely.`;

/** Block / rewrite sensitive AI questions before calling models */
export function guardAIQuestion(q) {
  const s = String(q || "").toLowerCase();
  // Source / code requests
  if (/\b(source\s*code|sourcecode|\.js\b|javascript file|pairing\.js|give (me )?(the )?code|bot (ka )?code|private (bot )?code|github repo|leak)\b/.test(s)) {
    return "Sorry — I don't have permission to share any private bot source code or JS files. Please use public commands only, or ask the Developer in the support channel.";
  }
  // API / keys
  if (/\b(api\s*key|apikey|token|openrouter|secret key|give (me )?(the )?api|api do|endpoint)\b/.test(s)) {
    return "Sorry — I don't have permission to share any API keys or private endpoints. Please ask the Developer in the support channel if you need access.";
  }
  // When created
  if (/\b(kab banaya|when (were|was) you (made|created|built)|who (made|created|built) you|tum (kab|ko) (bana|banaya)|origin|how old are you)\b/.test(s)) {
    return "My developer made me in *2011*. Due to public demand, they released *v1 publicly in 2025*. I'm Joker-XD — here to help with public bot commands 🙂";
  }
  return null;
}

/**
 * Ask AI with optional short conversation history (last 24h, max ~12 msgs).
 * history = [{ role: "user"|"assistant", content: string }, ...]
 * OpenRouter gets full messages array; free fallbacks get a short context prefix.
 * Very low load — history lives only in RAM and auto-expires.
 */
export async function askAI(prompt, history = []) {
  const q = String(prompt || "").trim();
  if (!q) throw new Error("empty prompt");
  const guarded = guardAIQuestion(q);
  if (guarded) return guarded;

  // Build messages for OpenRouter (system + history + current user)
  const safeHistory = Array.isArray(history)
    ? history
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
        .slice(-AI_HISTORY_MAX_MSGS)
        .map((m) => ({ role: m.role, content: String(m.content).slice(0, AI_HISTORY_MAX_CHARS) }))
    : [];

  // Short text context for single-prompt fallback APIs (last 4 turns only)
  let contextPrefix = "";
  if (safeHistory.length) {
    const recent = safeHistory.slice(-8);
    contextPrefix = recent
      .map((m) => `${m.role === "assistant" ? "Bot" : "User"}: ${m.content}`)
      .join("\n")
      .slice(0, 900);
    if (contextPrefix) contextPrefix = `[Previous chat]\n${contextPrefix}\n[Current]\nUser: `;
  }
  const qWithContext = contextPrefix ? `${contextPrefix}${q}` : q;

  const sources = [
    // 1) OpenRouter (primary — supports real multi-turn)
    async () => {
      if (!OPENROUTER_API_KEY) return null;
      const messages = [
        { role: "system", content: JOKER_AI_SYSTEM },
        ...safeHistory,
        { role: "user", content: q }
      ];
      const { data, status } = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: OPENROUTER_MODEL,
          messages
        },
        {
          timeout: 60000,
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://joker-xd.local",
            "X-Title": "Joker-XD"
          }
        }
      );
      const t = data?.choices?.[0]?.message?.content;
      if (status < 400 && t && String(t).trim()) return String(t).trim();
      return null;
    },
    // 2) Keith AI fallback (single prompt + short context)
    async () => {
      for (const model of ["gpt", "mistral", "ilama", "chatgpt4"]) {
        try {
          const { data } = await axios.get(`${KEITH_API}/ai/${model}?q=${encodeURIComponent(qWithContext)}`, {
            ...AXIOS_DL, timeout: 45000
          });
          if (data?.status && data?.result) return String(data.result).trim();
          if (typeof data?.result === "string" && data.result.trim()) return data.result.trim();
        } catch {}
      }
      return null;
    },
    // 3) Free workers
    async () => {
      const urls = [
        `https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=${encodeURIComponent(qWithContext)}`,
        `https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(qWithContext)}`
      ];
      for (const u of urls) {
        try {
          const { data } = await axios.get(u, { ...AXIOS_DL, timeout: 30000 });
          const t = data?.data?.response
            || data?.data?.choices?.[0]?.message?.content
            || data?.response
            || data?.result
            || (typeof data === "string" ? data : null);
          if (t && String(t).trim()) return String(t).trim();
        } catch {}
      }
      return null;
    },
    // 4) pollinations
    async () => {
      try {
        const r = await axios.get("https://text.pollinations.ai/" + encodeURIComponent(qWithContext), {
          timeout: 60000, validateStatus: () => true, responseType: "text"
        });
        const out = typeof r.data === "string" ? r.data : (r.data?.text || "");
        if (out && r.status < 400) return String(out).trim();
      } catch {}
      return null;
    }
  ];
  for (const fn of sources) {
    try {
      const ans = await fn();
      if (ans && ans.length > 1) return ans.slice(0, 4000);
    } catch {}
  }
  throw new Error("All AI sources failed");
}
export async function tryRequest(fn, retries = 2) {
  let last;
  for (let i = 0; i < retries; i++) {
    try { return await fn(); } catch (e) { last = e; await new Promise(r => setTimeout(r, 500 * (i + 1))); }
  }
  throw last || new Error("request failed");
}

export const isYtUrl = (u) =>
  /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/i.test(u || "");

export async function keithSearchYts(query) {
  // Prefer local yt-search (reliable). Fall back to external only if needed.
  try {
    const r = await yts(query);
    if (r?.videos?.length) {
      const v = r.videos[0];
      return {
        videoUrl: v.url,
        title: v.title || "audio",
        duration: v.timestamp || v.duration?.timestamp,
        views: v.views,
        thumbnail: v.thumbnail,
        id: v.videoId
      };
    }
  } catch {}
  try {
    const { data } = await axios.get(`${KEITH_API}/search/yts?query=${encodeURIComponent(query)}`, { ...AXIOS_DL, timeout: 12000 });
    if (!data?.status || !data?.result?.length) throw new Error(data?.message || "No results");
    const e = data.result[0];
    return {
      videoUrl: "https://youtube.com/watch?v=" + e.id,
      title: e.title || "audio",
      duration: e.duration,
      views: e.views,
      thumbnail: e.thumbnail,
      id: e.id
    };
  } catch (e) {
    throw new Error(e?.message || "No results");
  }
}

// ---------- Audio/Video downloader — ONLY Supreme API ----------
export async function dlAudioSupreme(url) {
  const res = await tryRequest(() =>
    axios.get(`https://apissupreme.vercel.app/media/ytmp3?apikey=supreme&url=${encodeURIComponent(url)}`, { ...AXIOS_DL, timeout: 30000 })
  );
  const d = res?.data;
  const link = d?.downloadUrl || d?.download || d?.result?.mp3 || d?.result?.download || d?.mp3 || d?.url || d?.link;
  if (link && String(link).startsWith("http")) return link;
  // fallback same host ytmp4 audio if ytmp3 path differs
  const res2 = await tryRequest(() =>
    axios.get(`https://apissupreme.vercel.app/media/ytmp4?apikey=supreme&url=${encodeURIComponent(url)}`, { ...AXIOS_DL, timeout: 30000 })
  );
  const d2 = res2?.data;
  const link2 = d2?.downloadUrl || d2?.download || d2?.result?.mp3 || d2?.result?.audio || d2?.mp3 || d2?.url;
  if (link2 && String(link2).startsWith("http")) return link2;
  throw new Error("Source unavailable");
}
export async function dlAudioElite(url) { return dlAudioSupreme(url); }
export async function dlAudioYupra(url) { return dlAudioSupreme(url); }
export async function dlAudioOkatsu(url) { return dlAudioSupreme(url); }
export async function dlAudioKeith(url) { return dlAudioSupreme(url); }

/** Shared helper: resolve query → yt url + title */
export async function resolveYtQuery(q) {
  let url = q, title = "audio";
  if (!isYtUrl(q)) {
    try {
      const s = await keithSearchYts(q);
      url = s.videoUrl; title = s.title;
    } catch {
      const r = await yts(q);
      if (!r?.videos?.length) throw new Error("No results");
      url = r.videos[0].url; title = r.videos[0].title;
    }
  }
  return { url, title };
}

/** Shared send audio buffer */
export async function sendAudioResult(sock, jid, msg, buf, title) {
  if (!buf?.length) throw new Error("Empty audio");
  try { buf = await bufferToMp3(buf); } catch {}
  await sock.sendMessage(jid, {
    audio: buf,
    mimetype: "audio/mpeg",
    fileName: `${String(title).slice(0, 60)}.mp3`,
    ptt: false
  }, { quoted: msg });
}

// Legacy multi-fallback (kept for any internal use)
export async function keithDownloadAudio(url) {
  const apis = [dlAudioElite, dlAudioYupra, dlAudioOkatsu, dlAudioKeith];
  let lastErr = "Audio source unavailable";
  for (const fn of apis) {
    try {
      const link = await fn(url);
      if (link && typeof link === "string" && link.startsWith("http")) return link;
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr);
}

export async function getYtVideoData(url) {
  // Live-tested cascade: Cypher → HectorManuel → Supreme
  // (David Cyril needs paid API key — skipped)
  const sources = [
    async () => {
      const { data } = await axios.get(
        `https://media.cypherxbot.space/download/youtube/video?url=${encodeURIComponent(url)}`,
        { ...AXIOS_DL, timeout: 35000 }
      );
      const download = data?.result?.download_url || data?.result?.download || data?.download_url;
      if (data?.success && download && String(download).startsWith("http")) {
        return {
          download,
          title: data.result?.title || "video",
          thumbnail: data.result?.thumbnail || null,
          quality: data.result?.quality || null
        };
      }
      throw new Error("Source unavailable");
    },
    async () => {
      const { data } = await axios.get(
        `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(url)}`,
        { ...AXIOS_DL, timeout: 35000 }
      );
      // response: { status, title, videos: { "144": url, "240": url, ... } }
      let download = null;
      let quality = null;
      const vids = data?.videos;
      if (vids && typeof vids === "object") {
        const keys = Object.keys(vids)
          .filter((k) => String(vids[k] || "").startsWith("http"))
          .sort((a, b) => (parseInt(b, 10) || 0) - (parseInt(a, 10) || 0));
        if (keys.length) {
          quality = keys[0];
          download = vids[keys[0]];
        }
      }
      if (!download) {
        download = data?.video || data?.download || data?.mp4 || data?.result?.video;
      }
      if (data?.status && download && String(download).startsWith("http")) {
        return {
          download,
          title: data?.title || "video",
          thumbnail: data?.thumbnail || null,
          quality: quality ? quality + "p" : null
        };
      }
      throw new Error("Source unavailable");
    },
    async () => {
      const { data } = await axios.get(
        `https://apissupreme.vercel.app/media/ytmp4?apikey=supreme&url=${encodeURIComponent(url)}`,
        { ...AXIOS_DL, timeout: 35000 }
      );
      const download = data?.downloadUrl || data?.download || data?.result?.mp4 || data?.result?.download || data?.mp4 || data?.url;
      if (download && String(download).startsWith("http")) {
        return {
          download,
          title: data?.title || data?.result?.title || "video",
          thumbnail: data?.thumbnail || data?.result?.thumbnail || null,
          quality: null
        };
      }
      throw new Error("Source unavailable");
    }
  ];

  let lastErr = "Video source unavailable";
  for (const fn of sources) {
    try {
      return await tryRequest(fn, 1);
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr);
}

export async function bufferToMp3(buf) {
  const inF = path.join(MEDIA_DIR, `in_${Date.now()}.bin`);
  const outF = path.join(MEDIA_DIR, `out_${Date.now()}.mp3`);
  try {
    fs.writeFileSync(inF, buf);
    await execAsync(`"${FFMPEG_PATH}" -y -i "${inF}" -vn -acodec libmp3lame -q:a 2 "${outF}"`, { timeout: 90000 });
    return fs.readFileSync(outF);
  } finally {
    try { fs.unlinkSync(inF); } catch {}
    try { fs.unlinkSync(outF); } catch {}
  }
}

/** Normalize any scraper result into a media URL string */
export function pickMediaUrl(r) {
  if (!r) return null;
  if (typeof r === "string" && r.startsWith("http")) return r;
  if (Array.isArray(r)) {
    for (const item of r) {
      if (typeof item === "string" && item.startsWith("http")) return item;
      if (item?.url && String(item.url).startsWith("http")) return item.url;
      if (item?.hd && String(item.hd).startsWith("http")) return item.hd;
      if (item?.sd && String(item.sd).startsWith("http")) return item.sd;
    }
  }
  if (typeof r === "object") {
    return r.hd || r.sd || r.url || r.video || r.download
      || r.data?.hd || r.data?.sd || r.data?.url
      || r.result?.url || r.result?.hd || r.result?.sd
      || r.result?.media?.video_hd || r.result?.media?.video_sd
      || (Array.isArray(r.data) && (r.data[0]?.url || (typeof r.data[0] === "string" ? r.data[0] : null)))
      || null;
  }
  return null;
}

/** Resolve Facebook video URL — ruhend + fb-downloader-scrapper style */
export async function resolveFacebook(url) {
  const errors = [];

  // 1) ruhend fbdl / fbdl2 → often returns string[] of CDN urls
  for (const fn of [fbdl, fbdl2]) {
    try {
      if (typeof fn !== "function") continue;
      const r = await fn(url);
      const u = pickMediaUrl(r);
      if (u) return String(u);
    } catch (e) { errors.push("ruhend:" + (e.message || e)); }
  }

  // 2) fb-downloader-scrapper (dynamic import — returns {hd, sd, url})
  try {
    const mod = await import("fb-downloader-scrapper");
    const getInfo = mod.getFbVideoInfo || mod.default?.getFbVideoInfo || mod.default;
    if (typeof getInfo === "function") {
      const r = await getInfo(url);
      const u = r?.hd || r?.sd || r?.url || pickMediaUrl(r);
      if (u) return String(u);
    }
  } catch (e) { errors.push("fbscraper:" + (e.message || e)); }

  // 3) eliteprotech
  try {
    const { data } = await axios.get(`https://eliteprotech-apis.zone.id/facebook?url=${encodeURIComponent(url)}`, AXIOS_DL);
    const u = pickMediaUrl(data);
    if (u) return String(u);
  } catch (e) { errors.push("elite:" + (e.message || e)); }

  throw new Error(errors[0] || "Facebook download failed (private/restricted link?)");
}

/** Resolve Instagram media list → [{url, type}] */
export async function resolveInstagram(url) {
  const errors = [];

  // 1) ruhend igdl / igdl2 → often string[] of CDN urls
  for (const fn of [igdl, igdl2]) {
    try {
      if (typeof fn !== "function") continue;
      const r = await fn(url);
      if (Array.isArray(r) && r.length) {
        return r.map(x => {
          const u = typeof x === "string" ? x : (x?.url || x?.download);
          return {
            url: u,
            type: (x?.type) || (/\.mp4|video/i.test(String(u)) ? "video" : "image")
          };
        }).filter(x => x.url && String(x.url).startsWith("http"));
      }
      const single = pickMediaUrl(r);
      if (single) return [{ url: single, type: /\.mp4/i.test(single) ? "video" : "image" }];
    } catch (e) { errors.push("ruhend:" + (e.message || e)); }
  }

  // 2) eliteprotech
  try {
    const { data } = await axios.get(`https://eliteprotech-apis.zone.id/igdl?url=${encodeURIComponent(url)}`, AXIOS_DL);
    const arr = data?.data || data?.result || [];
    if (Array.isArray(arr) && arr.length) {
      return arr.map(x => ({
        url: typeof x === "string" ? x : (x.url || x),
        type: x?.type || "video"
      })).filter(x => x.url && String(x.url).startsWith("http"));
    }
    const u = pickMediaUrl(data);
    if (u) return [{ url: u, type: "video" }];
  } catch (e) { errors.push("elite:" + (e.message || e)); }

  throw new Error(errors[0] || "Instagram download failed (private/deleted?)");
}

export async function downloadUrlBuffer(url, timeout = 90000) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout,
    maxRedirects: 10,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "*/*"
    },
    validateStatus: () => true
  });
  if (res.status < 200 || res.status >= 400) throw new Error("media download HTTP " + res.status);
  return Buffer.from(res.data);
}
export const ADULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function adultFetchHtml(url) {
  const res = await axios.get(url, {
    timeout: 20000,
    responseType: "text",
    headers: {
      "User-Agent": ADULT_UA,
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml"
    },
    maxRedirects: 5,
    validateStatus: (s) => s >= 200 && s < 400
  });
  return String(res.data || "");
}

export function adultDecodeEntities(s = "") {
  return String(s)
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function adultParseResults(html, base, limit = 10) {
  const map = new Map();
  const reTag = /<a\b[^>]*?href="(\/video[.\-]?[a-z0-9]+\/[^"?#\/]+)[^"]*"[^>]*>/gi;
  let m;
  while ((m = reTag.exec(html)) !== null) {
    const pth = m[1];
    const tag = m[0];
    const tAttr = tag.match(/\btitle="([^"]+)"/i);
    const after = html.slice(m.index + tag.length, m.index + tag.length + 1500);
    const stop = after.search(/<\/a>/i);
    const inner = stop >= 0 ? after.slice(0, stop) : after;
    const tm = inner.match(/(?:data-src|data-thumb_url)="(https?:\/\/[^"]+)"/i);
    let e = map.get(pth);
    if (!e) {
      if (map.size >= limit) continue;
      e = { title: "", thumb: "" };
      map.set(pth, e);
    }
    if (!e.title && tAttr) e.title = adultDecodeEntities(tAttr[1].trim());
    if (!e.thumb && tm) e.thumb = tm[1];
  }
  return [...map.entries()].map(([pth, e]) => {
    let title = e.title || adultDecodeEntities((pth.split("/").pop() || "video").replace(/_/g, " ").trim());
    if (title.length > 90) title = title.slice(0, 87) + "...";
    return { url: base + pth, title, thumb: e.thumb };
  });
}

export async function adultSearchXvideos(query) {
  const html = await adultFetchHtml(`https://www.xvideos.com/?k=${encodeURIComponent(query)}`);
  return adultParseResults(html, "https://www.xvideos.com");
}

export async function adultSearchXnxx(query) {
  const html = await adultFetchHtml(`https://www.xnxx.com/search/${encodeURIComponent(query)}`);
  return adultParseResults(html, "https://www.xnxx.com");
}

export async function adultDownloadXPage(pageUrl, site = "xvideos") {
  const html = await adultFetchHtml(pageUrl);
  const titleMatch =
    html.match(/html5player\.setVideoTitle\(['"]([^'"]+)['"]\)/i) ||
    html.match(/<title>([^<]+)<\/title>/i);
  const title = adultDecodeEntities((titleMatch?.[1] || "").replace(/\s*-\s*XVIDEOS\.COM.*/i, "").replace(/\s*-\s*XNXX\.COM.*/i, "").trim());
  const high = html.match(/html5player\.setVideoUrlHigh\(['"]([^'"]+)['"]\)/i)?.[1] || "";
  const low = html.match(/html5player\.setVideoUrlLow\(['"]([^'"]+)['"]\)/i)?.[1] || "";
  const hls = html.match(/html5player\.setVideoHLS\(['"]([^'"]+)['"]\)/i)?.[1] || "";
  const ld = html.match(/"contentUrl"\s*:\s*"([^"]+\.mp4[^"]*)"/i)?.[1] || "";
  if (!high && !low && !hls && !ld) throw new Error("Could not read this video page (site layout changed or blocked)");
  return { title: title || site, high: high || ld, low, hls, video: high || ld || low };
}

// ==================== ADULT DOWNLOADER (streams to disk, size-aware) ====================
export const ADULT_VIDEO_LIMIT = 64 * 1024 * 1024;    // up to this size -> sent as a normal video
export const ADULT_DOC_LIMIT = 400 * 1024 * 1024;     // up to this size -> sent as a document
export const ADULT_MAX_AMOUNT = 100;                  // max videos per .xxdl / .xndl / .hentaidl request
export const ADULT_MAX_IMAGES = 30;                   // max pictures per .node request
export const ADULT_TMP = path.join(TEMP_DIR, "adult");
export const ADULT_BLOCKED = /(?!)/; // never matches - add words e.g. /\b(word1|word2)\b/i
export const adultSleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function adultBlockedQuery(q) { return false; } // disabled like 0.09 — all searches allowed

export function adultEnsureTmp() { try { fs.mkdirSync(ADULT_TMP, { recursive: true }); } catch {} }

/** Remove leftover adult temp files (also the old adult-*.mp4 files that used to pile up in data/) */
export function adultSweepTmp(maxAgeMs = 10 * 60 * 1000) {
  const now = Date.now();
  const sweep = (dir, re) => {
    try {
      for (const f of fs.readdirSync(dir)) {
        if (!re.test(f)) continue;
        const p = path.join(dir, f);
        try { if (now - fs.statSync(p).mtimeMs >= maxAgeMs) fs.unlinkSync(p); } catch {}
      }
    } catch {}
  };
  sweep(ADULT_TMP, /.*/);
  sweep(DATA_DIR, /^adult-.*\.mp4$/);
}
adultEnsureTmp();
adultSweepTmp(0);

export function adultFreeBytes() {
  try { const s = fs.statfsSync(ADULT_TMP); return Number(s.bavail) * Number(s.bsize); } catch { return Infinity; }
}

/** Stream a URL to a file. Returns { file, size } or { tooBig: true } when it exceeds maxBytes. */
export async function adultStreamToFile(url, headers, dest, maxBytes) {
  const res = await axios.get(url, {
    responseType: "stream",
    timeout: 30000,
    maxRedirects: 10,
    headers,
    validateStatus: () => true,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
  if (res.status < 200 || res.status >= 400) {
    try { res.data.destroy(); } catch {}
    throw new Error("HTTP " + res.status);
  }
  const len = parseInt(res.headers?.["content-length"] || "0", 10);
  if (len && len > maxBytes) { try { res.data.destroy(); } catch {} return { tooBig: true, size: len }; }
  if (len && adultFreeBytes() < len + 80 * 1024 * 1024) {
    try { res.data.destroy(); } catch {}
    throw new Error("Not enough free disk space on the server");
  }
  let got = 0;
  let timer;
  const bump = () => { clearTimeout(timer); timer = setTimeout(() => { try { res.data.destroy(new Error("Download stalled")); } catch {} }, 60000); };
  bump();
  const counter = new Transform({
    transform(chunk, _enc, cb) {
      got += chunk.length;
      bump();
      if (got > maxBytes) return cb(Object.assign(new Error("too big"), { tooBig: true }));
      cb(null, chunk);
    }
  });
  try {
    await pipeline(res.data, counter, fs.createWriteStream(dest));
  } catch (e) {
    clearTimeout(timer);
    try { fs.unlinkSync(dest); } catch {}
    if (e?.tooBig) return { tooBig: true, size: got };
    if (e?.code === "ENOSPC") throw new Error("Server disk is full");
    throw e;
  }
  clearTimeout(timer);
  return { file: dest, size: got };
}

/** mode: "videos" (only <=64MB), "docs" (only >64MB), "combo" (both) */
export function adultPolicy(mode, size) {
  if (mode === "videos") return size <= ADULT_VIDEO_LIMIT ? "video" : "skip";
  if (mode === "docs") return size > ADULT_VIDEO_LIMIT ? "doc" : "skip";
  return size <= ADULT_VIDEO_LIMIT ? "video" : "doc";
}

/**
 * Download one video to a temp file.
 * Returns { title, file, size, action } or { title, skipped: reason } (nothing is left on disk when skipped).
 */
export async function adultFetchVideo(pageUrl, site, mode = "combo") {
  adultEnsureTmp();
  const info = await adultDownloadXPage(pageUrl, site);
  const origin = (() => { try { return new URL(pageUrl).origin + "/"; } catch { return pageUrl; } })();
  const headers = { "User-Agent": ADULT_UA, Referer: origin, Accept: "*/*" };
  const maxBytes = mode === "videos" ? ADULT_VIDEO_LIMIT : ADULT_DOC_LIMIT;
  const tmpName = () => path.join(ADULT_TMP, `v-${Date.now()}-${Math.floor(Math.random() * 99999)}.mp4`);
  const rm = (f) => { try { fs.unlinkSync(f); } catch {} };
  const urls = [...new Set([info.high, info.low].filter(Boolean))];
  let lastErr = "";
  let sawBig = false;
  let sawSmall = false;

  for (const u of urls) {
    const dest = tmpName();
    try {
      const r = await adultStreamToFile(u, headers, dest, maxBytes);
      if (r.tooBig) { sawBig = true; continue; }          // try the smaller (low) quality next
      if (r.size < 20000) { rm(dest); lastErr = "empty file"; continue; }
      const action = adultPolicy(mode, r.size);
      if (action === "skip") { rm(dest); sawSmall = true; break; }
      return { title: info.title, file: dest, size: r.size, action };
    } catch (e) {
      rm(dest);
      lastErr = e.message || String(e);
      if (/disk/i.test(lastErr)) throw e;
    }
  }
  if (sawSmall) return { title: info.title, skipped: "small" };

  if (!sawBig && info.hls) {
    const dest = tmpName();
    try {
      const hdr = `User-Agent: ${ADULT_UA}\r\nReferer: ${origin}\r\n`;
      await execAsync(
        `"${FFMPEG_PATH}" -y -headers "${hdr.replace(/"/g, '\\"')}" -i "${info.hls}" -t 600 -fs ${maxBytes} -c copy -bsf:a aac_adtstoasc -movflags +faststart "${dest}"`,
        { timeout: 300000, maxBuffer: 1024 * 1024 * 20 }
      );
      const size = fs.statSync(dest).size;
      if (size > 20000) {
        const action = adultPolicy(mode, size);
        if (action === "skip") { rm(dest); return { title: info.title, skipped: "small" }; }
        return { title: info.title, file: dest, size, action };
      }
      rm(dest);
    } catch (e) {
      rm(dest);
      lastErr = e.message || lastErr;
      if (/ENOSPC|No space left/i.test(String(lastErr))) throw new Error("Server disk is full");
    }
  }
  if (sawBig) return { title: info.title, skipped: "big" };
  throw new Error("Download failed" + (lastErr ? ` (${String(lastErr).slice(0, 80)})` : ""));
}

/** Send a downloaded file (video or document) and always delete it afterwards */
export async function adultSendFile(sock, jid, quoted, res, fallbackTitle = "video") {
  const title = res.title || fallbackTitle;
  const mb = (res.size / 1048576).toFixed(1);
  const caption = `🎬 ${title}\n📦 ${mb} MB`;
  const fileName = `${(title || "video").slice(0, 60).replace(/[^\w\- ]+/g, "").trim() || "video"}.mp4`;
  const opts = quoted ? { quoted } : {};
  try {
    if (res.action === "video") {
      try {
        await sock.sendMessage(jid, { video: { url: res.file }, mimetype: "video/mp4", caption }, opts);
      } catch {
        await sock.sendMessage(jid, { document: { url: res.file }, mimetype: "video/mp4", fileName, caption }, opts);
      }
    } else {
      await sock.sendMessage(jid, { document: { url: res.file }, mimetype: "video/mp4", fileName, caption }, opts);
    }
  } finally {
    try { fs.unlinkSync(res.file); } catch {}
  }
}

/** Single video (link / list pick): small -> video, big -> document */
export async function adultSendVideo(sock, jid, quoted, pageUrl, site, fallbackTitle = "video") {
  adultSweepTmp();
  const r = await adultFetchVideo(pageUrl, site, "combo");
  if (r.skipped) throw new Error("This video is too large to send");
  await adultSendFile(sock, jid, quoted, r, fallbackTitle);
}

// ---- paged search (lazy: next page is only fetched when more candidates are needed) ----
export function adultSearchUrl(site, query, page) {
  const q = encodeURIComponent(query);
  if (site === "xnxx") return page === 0 ? `https://www.xnxx.com/search/${q}` : `https://www.xnxx.com/search/${q}/${page}`;
  return `https://www.xvideos.com/?k=${q}&p=${page}`;
}
export function adultSiteBase(site) { return site === "xnxx" ? "https://www.xnxx.com" : "https://www.xvideos.com"; }

export async function* adultCandidates(site, query) {
  const seen = new Set();
  for (let page = 0; page < 40; page++) {
    let items = [];
    try {
      items = adultParseResults(await adultFetchHtml(adultSearchUrl(site, query, page)), adultSiteBase(site), 80);
    } catch (e) {
      if (page === 0) throw e;
      break;
    }
    const fresh = items.filter((i) => !seen.has(i.url));
    if (!fresh.length) break;
    for (const it of fresh) { seen.add(it.url); yield it; }
  }
}

// ---- bulk jobs ----
export const adultJobs = new Map();
export const ADULT_MODE_LABEL = { videos: "Only videos", docs: "Only documents", combo: "Combo" };

export async function adultRunBulk(sock, msg, jid, { site, query, amount, mode, label, prefix }) {
  const key = mcKey(sock, jid);
  const reply = (text) => sock.sendMessage(jid, { text }, { quoted: msg });
  if (adultJobs.has(key)) { await reply(`⏳ A download is already running in this chat. Send *${prefix}stopdl* to cancel it.`); return; }
  const job = { cancel: false };
  adultJobs.set(key, job);
  adultSweepTmp();
  let sent = 0, skipped = 0, failed = 0, tried = 0, diskFull = false;
  try {
    await reply(`⬇️ Starting *${label}*\n🔎 ${query}\n🔢 Target: ${amount} • ${ADULT_MODE_LABEL[mode]}\n\n_Send ${prefix}stopdl to cancel._`);
    const maxTry = Math.max(amount * 8, 40);
    for await (const item of adultCandidates(site, query)) {
      if (job.cancel || sent >= amount || tried >= maxTry) break;
      tried++;
      try {
        const r = await adultFetchVideo(item.url, site, mode);
        if (r.skipped) { skipped++; continue; }
        await adultSendFile(sock, jid, msg, r, item.title);
        sent++;
      } catch (e) {
        failed++;
        if (/disk/i.test(e.message || "")) { diskFull = true; break; }
      }
      await adultSleep(2000);
    }
  } catch (e) {
    await reply(`❌ ${e.response?.status ? "Search unavailable (HTTP " + e.response.status + ")" : (e.message || e)}`);
  } finally {
    adultJobs.delete(key);
    adultSweepTmp();
  }
  let t = `${job.cancel ? "🛑 Stopped" : sent >= amount ? "✅ Done" : "ℹ️ Finished"} — sent *${sent}/${amount}*`;
  if (skipped) t += `\n⏭️ Skipped (${mode === "docs" ? "under 64 MB" : "too long/large"}): ${skipped}`;
  if (failed) t += `\n⚠️ Failed: ${failed}`;
  if (diskFull) t += `\n❌ Server disk is full — free some space and try again.`;
  else if (!job.cancel && sent < amount) t += `\n_No more matching videos found for this search._`;
  await reply(t);
}

// ---- pending prompts the user can reply to ----
export const adultPending = new Map();
export function adultRememberList(sock, jid, id, data) {
  if (!id) return;
  const now = Date.now();
  for (const [k, v] of adultPending) if (v.expires < now) adultPending.delete(k);
  adultPending.set(mcKey(sock, jid) + ":" + id, { ...data, expires: now + 20 * 60 * 1000 });
}

export async function adultSendList(sock, msg, jid, site, label, query, list) {
  const group = String(jid || "").endsWith("@g.us");
  let t = `🔞 *${label}*\n🔎 ${query}\n\n`;
  list.forEach((v, i) => {
    t += `*${i + 1}.* ${v.title}\n`;
    if (!group) t += `🔗 ${v.url}\n`;
    t += "\n";
  });
  t += `_Reply to this message with a number (*1*), several (*1,3,4*) or *all* to download._`;
  const sent = await sock.sendMessage(jid, { text: t }, { quoted: msg });
  adultRememberList(sock, jid, sent?.key?.id, { site, label, list });
}

/** Ask "1 Only videos / 2 Only documents / 3 Combo" for a bulk request */
export async function adultAskMode(sock, msg, jid, params) {
  const t =
    `🔞 *${params.label}*\n🔎 ${params.query}\n🔢 Amount: ${params.amount}\n\n` +
    `Choose download type:\n\n` +
    `*1* — Only videos _(under 64 MB, longer ones are skipped)_\n` +
    `*2* — Only documents _(videos over 64 MB, sent as documents)_\n` +
    `*3* — Combo _(both)_\n\n` +
    `_Reply to this message with 1, 2 or 3._`;
  const sent = await sock.sendMessage(jid, { text: t }, { quoted: msg });
  adultRememberList(sock, jid, sent?.key?.id, { kind: "mode", by: msg.key.participant || msg.key.remoteJid, ...params });
}

/** Returns true when the message was a reply to a pending adult prompt */
export async function adultHandleReply(sock, msg, raw) {
  const sel = String(raw || "").trim().toLowerCase();
  if (!/^(all|sab|\d{1,2}(\s*[,\s\-.]\s*\d{1,2})*)$/.test(sel)) return false;
  const stanza = getContext(msg)?.stanzaId;
  if (!stanza) return false;
  const jid = msg.key.remoteJid;
  const pkey = mcKey(sock, jid) + ":" + stanza;
  const entry = adultPending.get(pkey);
  if (!entry || entry.expires < Date.now()) return false;
  const reply = (text) => sock.sendMessage(jid, { text }, { quoted: msg });

  // ---- download-type prompt (1 / 2 / 3) ----
  if (entry.kind === "mode") {
    if ((msg.key.participant || msg.key.remoteJid) !== entry.by) return false;
    if (!/^[123]$/.test(sel)) { await reply("❌ Reply with *1* (Only videos), *2* (Only documents) or *3* (Combo)."); return true; }
    adultPending.delete(pkey);
    const mode = sel === "1" ? "videos" : sel === "2" ? "docs" : "combo";
    await adultRunBulk(sock, msg, jid, { ...entry, mode });
    return true;
  }

  // ---- search list (1 / 1,3,4 / all) ----
  const n = entry.list.length;
  let picks = [];
  if (sel === "all" || sel === "sab") picks = entry.list.map((_, i) => i + 1);
  else if (/^\d{1,2}\s*-\s*\d{1,2}$/.test(sel)) {
    const [a, b] = sel.split("-").map((x) => parseInt(x, 10));
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) picks.push(i);
  } else picks = (sel.match(/\d{1,2}/g) || []).map((x) => parseInt(x, 10));
  picks = [...new Set(picks)].filter((x) => x >= 1 && x <= n);

  if (!picks.length) { await reply(`❌ Pick a number between 1 and ${n}, or type *all*.`); return true; }

  try { await sock.sendMessage(jid, { react: { text: "⬇️", key: msg.key } }); } catch {}
  if (picks.length > 1) await reply(`⬇️ Downloading ${picks.length} videos, please wait...`);
  for (const num of picks) {
    const item = entry.list[num - 1];
    try {
      await adultSendVideo(sock, jid, msg, item.url, entry.site, item.title);
    } catch (e) {
      await reply(`❌ #${num} failed: ${e.message || e}`);
    }
    if (picks.length > 1) await delay(1500);
  }
  try { await sock.sendMessage(jid, { react: { text: "✅", key: msg.key } }); } catch {}
  return true;
}

// ---- picture mode (.node): thumbnails/previews from xvideos + xnxx search results ----
export function adultThumbVariants(t) {
  const out = [];
  const m = String(t).match(/^(.*\/thumbs\d*)(l{0,3})(\/.+)$/);
  if (m) { out.push(m[1] + "lll" + m[3], m[1] + "ll" + m[3]); }
  out.push(t);
  return [...new Set(out)];
}
export async function adultGetThumbBuffer(thumb, referer) {
  for (const u of adultThumbVariants(thumb)) {
    try {
      const r = await axios.get(u, {
        responseType: "arraybuffer", timeout: 20000, maxRedirects: 5,
        headers: { "User-Agent": ADULT_UA, Referer: referer, Accept: "image/*" },
        validateStatus: () => true, maxContentLength: 15 * 1024 * 1024
      });
      if (r.status >= 200 && r.status < 300) {
        const b = Buffer.from(r.data);
        if (isImageBuffer(b)) return b;
      }
    } catch {}
  }
  return null;
}

export async function adultRunImages(sock, msg, jid, { query, amount, prefix }) {
  const key = mcKey(sock, jid);
  const reply = (text) => sock.sendMessage(jid, { text }, { quoted: msg });
  if (adultJobs.has(key)) { await reply(`⏳ A download is already running in this chat. Send *${prefix}stopdl* to cancel it.`); return; }
  const job = { cancel: false };
  adultJobs.set(key, job);
  let sent = 0, tried = 0;
  try {
    const sites = ["xvideos", "xnxx"];
    const gens = sites.map((s) => adultCandidates(s, query));
    const alive = [true, true];
    const seen = new Set();
    let turn = 0, errors = 0;
    const maxTry = Math.max(amount * 8, 40);
    while (sent < amount && tried < maxTry && !job.cancel && (alive[0] || alive[1])) {
      const gi = turn++ % 2;
      if (!alive[gi]) continue;
      let n;
      try { n = await gens[gi].next(); } catch { alive[gi] = false; errors++; continue; }
      if (n.done) { alive[gi] = false; continue; }
      const it = n.value;
      if (!it.thumb) continue;
      const hk = it.thumb.split("/").slice(-3).join("/");
      if (seen.has(hk)) continue;
      seen.add(hk);
      tried++;
      const buf = await adultGetThumbBuffer(it.thumb, adultSiteBase(sites[gi]) + "/");
      if (!buf) continue;
      try {
        await sock.sendMessage(jid, { image: buf, caption: `🔞 ${it.title}` }, { quoted: msg });
        sent++;
      } catch {}
      await adultSleep(1200);
    }
    if (!sent) await reply(errors >= 2 ? "❌ Search unavailable right now. Try again later." : "❌ No pictures found for this search.");
    else if (sent < amount && !job.cancel) await reply(`ℹ️ Sent ${sent}/${amount} — no more pictures found.`);
  } catch (e) {
    await reply(`❌ ${e.message || e}`);
  } finally {
    adultJobs.delete(key);
  }
}

// ==================== PINTEREST SEARCH (.pin) ====================
export const PIN_MAX = 30;
export const PIN_HEADERS = {
  "User-Agent": ADULT_UA,
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "application/json, text/javascript, */*; q=0.01",
  "X-Requested-With": "XMLHttpRequest",
  "X-Pinterest-AppState": "active",
  Referer: "https://www.pinterest.com/"
};

export function pinImageVariants(u) {
  const m = String(u).match(/^(https?:\/\/i\.pinimg\.com)\/(?:\d+x\d*|originals)\/(.+)$/i);
  if (!m) return [u];
  return [`${m[1]}/originals/${m[2]}`, `${m[1]}/736x/${m[2]}`, `${m[1]}/564x/${m[2]}`, `${m[1]}/474x/${m[2]}`];
}

export async function pinSearch(query) {
  const out = [];
  const seen = new Set();
  const add = (u) => {
    if (!u || !/pinimg\.com/i.test(u)) return;
    const m = String(u).match(/pinimg\.com\/[^\/]+\/(.+)$/i);
    const k = m ? m[1] : u;
    if (seen.has(k)) return;
    seen.add(k);
    out.push(u);
  };
  // 1) Pinterest's own search endpoint
  try {
    const data = JSON.stringify({ options: { isPrefetch: false, query, scope: "pins", no_fetch_context_on_resource: false }, context: {} });
    const url = `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=${encodeURIComponent("/search/pins/?q=" + query)}&data=${encodeURIComponent(data)}&_=${Date.now()}`;
    const r = await axios.get(url, { timeout: 20000, headers: PIN_HEADERS, validateStatus: () => true });
    const results = r.data?.resource_response?.data?.results || [];
    for (const p of results) { const im = p?.images; add(im?.orig?.url || im?.["736x"]?.url || im?.["474x"]?.url); }
  } catch {}
  // 2) search page HTML
  if (out.length < 10) {
    try {
      const html = await adultFetchHtml(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`);
      for (const mm of html.matchAll(/https:\\?\/\\?\/i\.pinimg\.com\\?\/(?:236x|474x|564x|736x|originals)\\?\/[a-f0-9\\\/]+\.(?:jpg|png|webp)/gi)) add(mm[0].replace(/\\/g, ""));
    } catch {}
  }
  // 3) image-search fallback limited to pinterest images
  if (out.length < 10) {
    try {
      const html = await adultFetchHtml(`https://www.bing.com/images/search?q=${encodeURIComponent("site:pinterest.com " + query)}&first=1`);
      for (const mm of html.matchAll(/murl&quot;:&quot;(https?:[^&]+?)&quot;/gi)) add(adultDecodeEntities(mm[1]));
    } catch {}
  }
  return out;
}

export async function pinGetImage(u) {
  for (const v of pinImageVariants(u)) {
    try {
      const r = await axios.get(v, {
        responseType: "arraybuffer", timeout: 25000, maxRedirects: 5,
        headers: { "User-Agent": ADULT_UA, Referer: "https://www.pinterest.com/", Accept: "image/*" },
        validateStatus: () => true, maxContentLength: 20 * 1024 * 1024
      });
      if (r.status >= 200 && r.status < 300) {
        const b = Buffer.from(r.data);
        if (isImageBuffer(b)) return b;
      }
    } catch {}
  }
  return null;
}

/** Media of a single pin link (image or video) */
export async function pinFromUrl(url) {
  const res = await axios.get(url, { timeout: 25000, maxRedirects: 8, headers: { "User-Agent": ADULT_UA, "Accept-Language": "en-US,en;q=0.9" }, responseType: "text", validateStatus: () => true });
  const html = String(res.data || "");
  const video = html.match(/"(https:\/\/v\d*\.pinimg\.com\/videos\/[^"]+?\.mp4)"/i)?.[1] || "";
  const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1] || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)?.[1] || "";
  return { video: video.replace(/\\u002F/g, "/"), image: adultDecodeEntities(og) };
}

// ---- free image generation with automatic fallback ----
export function isImageBuffer(b) {
  if (!b || b.length < 2000) return false;
  return (b[0] === 0xff && b[1] === 0xd8) || (b[0] === 0x89 && b[1] === 0x50) || (b.slice(0, 4).toString() === "RIFF" && b.slice(8, 12).toString() === "WEBP");
}
export async function fetchImageBuf(url, opts = {}) {
  const res = await axios.request({ url, method: opts.method || "GET", data: opts.data, responseType: "arraybuffer", timeout: 90000, maxRedirects: 8, headers: { "User-Agent": ADULT_UA, ...(opts.headers || {}) }, validateStatus: () => true });
  if (res.status < 200 || res.status >= 400) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(res.data);
  if (!isImageBuffer(buf)) throw new Error("not an image");
  return buf;
}
export async function generateImageBuffer(prompt) {
  const enc = encodeURIComponent(prompt);
  const key = process.env.POLLINATIONS_KEY || "";
  const auth = key ? { Authorization: `Bearer ${key}` } : {};
  const providers = [
    () => fetchImageBuf(`https://image.pollinations.ai/prompt/${enc}?width=1024&height=1024&nologo=true&model=flux&seed=${Math.floor(Math.random() * 999999)}`, { headers: auth }),
    () => fetchImageBuf(`https://image.pollinations.ai/prompt/${enc}?width=768&height=768&nologo=true&model=turbo&seed=${Math.floor(Math.random() * 999999)}`, { headers: auth }),
    () => fetchImageBuf(`https://pollinations.ai/p/${enc}?width=768&height=768&seed=${Math.floor(Math.random() * 999999)}`, { headers: auth }),
    async () => {
      const { data } = await axios.get(`https://hercai.onrender.com/v3/text2image?prompt=${enc}`, { timeout: 60000 });
      if (!data?.url) throw new Error("no url");
      return fetchImageBuf(data.url);
    },
    () => fetchImageBuf(`https://api.airforce/imagine2?prompt=${enc}&size=1:1&seed=${Math.floor(Math.random() * 999999)}`),
  ];
  if (process.env.HF_TOKEN) {
    providers.push(() => fetchImageBuf("https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
      method: "POST", data: { inputs: prompt }, headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, "Content-Type": "application/json", Accept: "image/png" }
    }));
  }
  const errs = [];
  for (const run of providers) {
    try { return await run(); } catch (e) { errs.push(e.message || String(e)); }
  }
  console.warn("[imagine] all providers failed:", errs.join(" | "));
  throw new Error("Image service is busy right now. Please try again in a minute.");
}

/** Send video/audio/image by URL, fallback to buffer (Joker-XD pattern) */
export async function sendMedia(sock, jid, type, mediaUrl, extra = {}, quoted) {
  const opts = quoted ? { quoted } : {};
  // direct buffer support
  if (extra && extra.buffer) {
    const buf = Buffer.isBuffer(extra.buffer) ? extra.buffer : Buffer.from(extra.buffer);
    const { buffer: _b, ...rest } = extra;
    if (type === "video") await sock.sendMessage(jid, { video: buf, mimetype: "video/mp4", ...rest }, opts);
    else if (type === "audio") await sock.sendMessage(jid, { audio: buf, mimetype: rest.mimetype || "audio/mpeg", ...rest }, opts);
    else if (type === "image") await sock.sendMessage(jid, { image: buf, ...rest }, opts);
    else if (type === "document") await sock.sendMessage(jid, { document: buf, ...rest }, opts);
    return;
  }
  if (!mediaUrl) throw new Error("No media url/buffer");
  // local file path support
  if (String(mediaUrl).startsWith("file://")) {
    const fp = mediaUrl.replace("file://", "");
    const buf = fs.readFileSync(fp);
    try { fs.unlinkSync(fp); } catch {}
    if (type === "video") await sock.sendMessage(jid, { video: buf, mimetype: "video/mp4", ...extra }, opts);
    else if (type === "audio") await sock.sendMessage(jid, { audio: buf, mimetype: extra.mimetype || "audio/mpeg", ...extra }, opts);
    else if (type === "image") await sock.sendMessage(jid, { image: buf, ...extra }, opts);
    else if (type === "document") await sock.sendMessage(jid, { document: buf, ...extra }, opts);
    return;
  }
  try {
    if (type === "video") {
      await sock.sendMessage(jid, { video: { url: mediaUrl }, mimetype: "video/mp4", ...extra }, opts);
      return;
    }
    if (type === "audio") {
      await sock.sendMessage(jid, { audio: { url: mediaUrl }, mimetype: extra.mimetype || "audio/mpeg", ...extra }, opts);
      return;
    }
    if (type === "image") {
      await sock.sendMessage(jid, { image: { url: mediaUrl }, ...extra }, opts);
      return;
    }
    if (type === "document") {
      await sock.sendMessage(jid, { document: { url: mediaUrl }, ...extra }, opts);
      return;
    }
  } catch {}
  const buf = await downloadUrlBuffer(mediaUrl);
  if (type === "video") await sock.sendMessage(jid, { video: buf, mimetype: "video/mp4", ...extra }, opts);
  else if (type === "audio") await sock.sendMessage(jid, { audio: buf, mimetype: extra.mimetype || "audio/mpeg", ...extra }, opts);
  else if (type === "image") await sock.sendMessage(jid, { image: buf, ...extra }, opts);
  else if (type === "document") await sock.sendMessage(jid, { document: buf, ...extra }, opts);
}



export const configFile = path.join(DATA_DIR, "settings.json");
export const sudoFile = path.join(DATA_DIR, "sudo.json");
export const antilinkFile = path.join(DATA_DIR, "antilink.json");
export const welcomeFile = path.join(DATA_DIR, "welcome.json");
// Process-level flags so auto-reconnect does NOT re-send welcome / stack presence intervals
export let globalWelcomeSent = false;
export let presenceIntervalId = null;
export const goodbyeFile = path.join(DATA_DIR, "goodbye.json");
export const antideleteFile = path.join(DATA_DIR, "antidelete.json");
export const banFile = path.join(DATA_DIR, "ban.json");
export const blockFile = path.join(DATA_DIR, "block.json");
export const modeFile = path.join(DATA_DIR, "mode.json");
export const chatbotFile = path.join(DATA_DIR, "chatbot.json");
export const menuImageFile = path.join(DATA_DIR, "menu-image.json");
export const ownerNameFile = path.join(DATA_DIR, "owner-name.json");
export const viewOnceFile = path.join(DATA_DIR, "viewonce.json");
export const antitagFile = path.join(DATA_DIR, "antitag.json");
export const antitagmeFile = path.join(DATA_DIR, "antitagme.json");
export const agmFile = path.join(DATA_DIR, "agm.json");
export const warnFile = path.join(DATA_DIR, "warns.json");
export const antistickerFile = path.join(DATA_DIR, "antisticker.json");
export const antivoiceFile = path.join(DATA_DIR, "antivoice.json");
export const antipicFile = path.join(DATA_DIR, "antiping.json");
export const antipictureFile = path.join(DATA_DIR, "antipicture.json");
export const antivideoFile = path.join(DATA_DIR, "antivideo.json");
export const antitextFile = path.join(DATA_DIR, "antitext.json");
export const allowFile = path.join(DATA_DIR, "allowonce.json");
export const setwarnFile = path.join(DATA_DIR, "setwarn.json");

// WhatsApp group approval ceiling used by .approve. The server may enforce a lower limit.
export const APPROVE_GROUP_LIMIT = 1025;




// ==================== AUTO REACT / PRESENCE ====================
export const autoReactFile = path.join(DATA_DIR, "autoreact.json");
export const graphemes = (s) => { try { return [...new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(String(s))].map(x=>x.segment); } catch { return Array.from(String(s)); } };
export const DEFAULT_REACT_EMOJIS = graphemes("❤️🧡💛💚💙💜🤎🖤🤍🩷🩵🩶♥️");
export const ALL_REACT_EMOJIS = graphemes("😆😂😍🫠🤩🥲🙃🫪😜😛🥺🫡😶‍🌫️😱😡😤🙄😒🫢🧐🤫😓☹️😕🫤😯😵😫😖🤯🫨😵‍💫🫩🥵🤧😇😴🤑🤡💩😈👻👽👺👹🤖☠️💀🤓😎🌚👾🌛🌜😸🌟💫🙈🙊🙉💥🎉🕳️💨🫯🎊🩷🖤❤️🩵❣️💌❤️‍🔥💋🫀🫆💦🫦👁️👅👃🏿🤟🏿🤏🏿🤌🏿🤞🏿👉🏿🤰🏿👩‍❤️‍👩🌺🌹🍀☘️🌱🌿🪾🪵🪨🌬️🌅🏞️⛅🌦️🌩️🌧️🌞🌝🌚🌏🌍🕳️✨🌠🙊🙈🐺🐰🫎🦎🦕🐈‍⬛🐀🐁🐍🐊🦥🦏🦣🦦🦝🐔🦨🐦‍⬛🦜🦉🦅🦆🪿🦐🌶️🍅🍑🌽🥭🫛🍐🥕🍒🍓🍠🍆🍇🥒🥔🫘🍗🥓🥨🌮🥙🫔🥘🍛🦞🍣🥡🍘🍰🎂🍧🍭🍬🍫🧋☕🍼🧈🥂🍺🍻🍸🥃🍾🍴🔪🍽️🛑🚧🚨⛽🚙🏍️🛵🚊🚉🚂🚋🚝🏩🛣️🌐🎀🎈🎉🎃🧧🧨🎎🎏🥎⚽📢🏅🥉🎖️🏆🏉🥌🏒🏏🛼🥊🥋🫟🎴🎰📸📷🪄🎺📼🎛️🎚️📽️🎻🎬🎟️📱☎️🖲️🔌🔋🪙🖱️💶💳⚖️🔦🛋️🚪🧻🧺👔👙⛑️👒🎒🥽👓🦯🧬👡🪓🔧⚙️🪏🛠️📃📕🗄️📌🗑️📤🗓️🕰️⌛📢🔮🔍🛡️🔑🔏🔴💬♉🩶🚱❌🚫🚱🚳🔇🉐🈲㊗️⏩🔂🔁🔽📲☢️⚠️☣️💱🈯🔚🔙ℹ️💠🔹Ⓜ️🛗🏧🚹🚼🕉️⚛️🔯🧑‍🧑‍🧒‍🧒👁️‍🗨️🎼🎶®️🔘◽🏁🇦🇬🇵🇰🇵🇫🇵🇦🇵🇬");

export function defaultAutoReactConfig() {
  return {
    enabled: false, all: false, dm: false, groups: {}, status: false,
    command: false, // react on valid bot commands
    reactMode: "defaults", reactEmojis: [...DEFAULT_REACT_EMOJIS], reactIndex: 0,
    record: { all: false, dm: false, groups: {} },
    type: { all: false, dm: false, groups: {} },
    recordtype: { all: false, dm: false, groups: {} }
  };
}
export function getAutoReactConfig(sock) {
  const file = sock ? sf(sock, "autoreact.json") : autoReactFile;
  const b = defaultAutoReactConfig(), c = readJson(file, {});
  return {
    ...b, ...c,
    groups: { ...b.groups, ...(c.groups || {}) },
    record: { ...b.record, ...(c.record || {}), groups: { ...b.record.groups, ...(c.record?.groups || {}) } },
    type: { ...b.type, ...(c.type || {}), groups: { ...b.type.groups, ...(c.type?.groups || {}) } },
    recordtype: { ...b.recordtype, ...(c.recordtype || {}), groups: { ...b.recordtype.groups, ...(c.recordtype?.groups || {}) } }
  };
}
export function saveAutoReactConfig(c, sock) { writeJson(sock ? sf(sock, "autoreact.json") : autoReactFile, c); }

export function emojiFromText(text = "") {
  try {
    for (const { segment } of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(String(text)))
      if (/\p{Extended_Pictographic}/u.test(segment)) return segment;
  } catch {
    const m = String(text).match(/\p{Extended_Pictographic}/u);
    if (m) return m[0];
  }
  return null;
}

/** AI react: understand message meaning (EN) and pick a fitting emoji */
export function aiReactionFromText(text = "") {
  const existing = emojiFromText(text);
  if (existing) return existing;
  const t = String(text || "").toLowerCase();
  // Love / heart
  if (/\b(love|miss you|i love|pyar|mohabbat|dil|❤️|janu|baby)\b/.test(t)) return "❤️";
  // Happy / laugh
  if (/\b(haha|lol|lmao|rofl|funny|joke|hehe|😂|😄|mazak|hasna)\b/.test(t)) return "😂";
  // Sad
  if (/\b(sad|cry|hurt|depressed|lonely|dukhi|rona|😢|😭)\b/.test(t)) return "😢";
  // Angry
  if (/\b(angry|mad|hate|gussa|bakar|stupid|idiot|🤬|😡)\b/.test(t)) return "😡";
  // Thanks
  if (/\b(thanks|thank you|shukriya|thx|ty)\b/.test(t)) return "🙏";
  // Hello / hi
  if (/\b(hello|hi|hey|salam|assalam|aoa|good morning|good night|gn|gm)\b/.test(t)) return "👋";
  // Fire / cool
  if (/\b(fire|lit|cool|awesome|amazing|zabardast|bohat acha|🔥)\b/.test(t)) return "🔥";
  // Prayer / religion
  if (/\b(allah|islam|namaz|quran|ramadan|inshallah|mashallah|alhamdulillah)\b/.test(t)) return "🤲";
  // Food
  if (/\b(food|khana|hungry|pizza|biryani|eat|dinner|lunch)\b/.test(t)) return "🍔";
  // Music
  if (/\b(song|music|gana|listen|spotify|rap)\b/.test(t)) return "🎵";
  // Party
  if (/\b(party|birthday|celebrate|mubarak|congrats|congratulations)\b/.test(t)) return "🎉";
  // Sleep / night
  if (/\b(sleep|tired|neend|soja|good night|gn)\b/.test(t)) return "😴";
  // Question
  if (/\?|kya|what|why|kaise|how|kab|when|where/.test(t)) return "🤔";
  // OK / yes
  if (/\b(ok|okay|yes|haan|han|sure|done|theek)\b/.test(t)) return "👍";
  // No
  if (/\b(no|nahi|nope|never)\b/.test(t)) return "👎";
  // Default positive
  return "😊";
}

export function nextConfiguredReaction(cfg, text) {
  if (cfg.reactMode === "ai") return aiReactionFromText(text);
  const pool = Array.isArray(cfg.reactEmojis) && cfg.reactEmojis.length ? cfg.reactEmojis : DEFAULT_REACT_EMOJIS;
  const i = Number.isInteger(cfg.reactIndex) ? cfg.reactIndex : 0;
  const emoji = pool[i % pool.length];
  cfg.reactIndex = (i + 1) % pool.length;
  return emoji;
}

export function scopeEnabled(cfg, jid, kind) {
  if (!cfg.enabled) return false;
  if (cfg.all) return true;
  return kind === "dm" ? !!cfg.dm : !!cfg.groups?.[jid];
}

/** Menu-style emoji for each command (+ aliases) — used by .autoreact command */
export const COMMAND_REACT_MAP = {
  // MAIN
  menu: "📋", commands: "📋", ping: "🏓", alive: "💚", runtime: "💚", uptime: "💚", up: "💚", a: "💚", help: "❓", settings: "⚙️", setting: "⚙️",
  // AI
  ai: "🧠", translate: "🌐", tr: "🌐", tl: "🌐", imagine: "🎨", chatbot: "💬",
  // JOKER / xd-Spam tools
  jokersend: "🎯", jokers: "🎯", js: "🎯", jokertag: "🏷️", jokerall: "📢", jokerhelp: "🆘",
  bom: "💣", bomall: "💣", bomtag: "💣",
  stop: "⏹", stopjs: "⏹", stopjt: "⏹", stopja: "⏹", stopjokers: "⏹", stopjokertag: "⏹", stopjokerall: "⏹", stopbom: "⏹", stopba: "⏹", stopbt: "⏹",
  // OWNER
  jid: "🆔", alljid: "📋", chjid: "📢", chaneljid: "📢",
  ban: "🚫", unban: "✅", banlist: "📋", clearban: "🗑️",
  block: "🚫", unblock: "✅", blocklist: "📋", broadcast: "📢",
  sudo: "👑", delsudo: "❌", mode: "🔄", delete: "🗑️", del: "🗑️",
  left: "👋", leave: "👋", join: "➕", groups: "📊",
  chatbotadd: "➕", chatbotrem: "❌", setbotname: "✏️", setownername: "✏️", setprefix: "🔧",
  // GROUP
  kick: "🦵", remove: "🦵", k: "🦵", out: "🦵", nikul: "🦵", dufa: "🦵",
  kickall: "👢", removeall: "👢", kall: "👢",
  promote: "⬆️", toadmin: "⬆️", demote: "⬇️", dismiss: "⬇️", tomember: "⬇️",
  tagall: "📢", tag: "📢", hidetag: "🙈", admin: "👑", members: "👥",
  link: "🔗", resetlink: "🔄", open: "🔓", close: "🔒",
  setdesc: "📝", setgroupname: "✏️", setname: "✏️", gname: "✏️",
  welcome: "👋", setwelcome: "✏️", goodbye: "👋", setgoodbye: "✏️",
  antilink: "🚫", antichannel: "🚫", antichanel: "🚫", antich: "🚫", antisticker: "🚫", antistic: "🚫", antistiker: "🚫",
  antivoice: "🚫", antipic: "🚫", antipicture: "🚫", antivideo: "🚫", antitext: "🚫",
  antibot: "🤖", antibug: "🛡️", hidemybot: "🕵️", hidemy: "🕵️", hideme: "🕵️", hidebot: "🕵️", whois: "🔍", who: "🔍",
  antitag: "🚫", antitagme: "🚫", agm: "🚫", antigroupmention: "🚫",
  gstatus: "📱", togroupstatus: "📱", togstatus: "📱",
  xds: "📱", xdgstatus: "📱", xd: "📱",
  antigroupstatus: "🚫", ags: "🚫",
  antideletestatus: "🛡️", ads: "🛡️", antidelstatus: "🛡️",
  save: "💾", sv: "💾", statussave: "💾",
  send: "📤", resend: "📤", extract: "📤",
  autostatusview: "👀", asv: "👀", avs: "👀", statusview: "👀",
  react: "❤️", statusreact: "❤️", sreact: "❤️", autoreactstatus: "❤️", autostatusreact: "❤️",
  groupadd: "👥", groupaddprivacy: "👥", whoadd: "👥",
  warn: "⚠️", setwarn: "⚠️", resetwarn: "🔄", rw: "🔄", allow: "✅",
  approve: "✅", approverequests: "✅", approveall: "✅",
  // DOWNLOAD
  song: "🎵", ytmp3: "🎵", music: "🎵", play: "🎵",
  video: "🎬", ytmp4: "🎬", yts: "🔍",
  facebook: "📘", fb: "📘", fbaudio: "🎵", facebookaudio: "🎵",
  instagram: "📸", ig: "📸", insta: "📸", igaudio: "🎵", instagramaudio: "🎵", instaaudio: "🎵",
  tiktok: "🎵", tt: "🎵", ttaudio: "🎵", tiktokaudio: "🎵",
  twitter: "🐦", pinterest: "📌", pin: "📌", node: "🔞", adultmenu: "🔞", adult: "🔞",
  // AUTO
  autoreact: "😊", setreact: "🔄", setract: "🔄",
  autostatus: "📱",
  autoread: "📖", ar: "📖",
  autorecord: "🎙️", autotype: "⌨️", autorecordtype: "🎙️",
  alwaysonline: "📶", antidelete: "🗑️", antidel: "🗑️", antiedit: "✏️", antied: "✏️", online: "📶", lastseen: "👀",
  // CONVERT
  tomp3: "🎵", tovoice: "🎤", tov: "🎤", topp: "🎤",
  sticker: "🖼️", s: "🖼️", stick: "🖼️", stiker: "🖼️", take: "🃏", steal: "🃏",
  toimg: "🖼️", toimage: "🖼️", tovideo: "🎬", tomp4: "🎬",
  setpp: "📷", setmyprofilepic: "📷", setpname: "✏️", setmyprofilename: "✏️",
  hello: "👋", det: "🗑️",
  tts: "📢", say: "📢", url: "🔗", upload: "🔗", readmore: "📖",
  // TOOLS
  define: "📚", weather: "🌤️", currency: "💱", qr: "📱",
  // MEDIA
  vv: "👁️", vv2: "👁️", viewone: "👁️", antiviewonce: "👁️", gcp: "🖼️", gcpp: "🖼️", getpp: "🖼️", setmenuimage: "🖼️", setmenuimg: "🖼️"
};

export function getCommandReactEmoji(cmd) {
  if (!cmd) return null;
  return COMMAND_REACT_MAP[String(cmd).toLowerCase()] || null;
}

/**
 * Command auto-react:
 * - Only when cfg.command is ON
 * - Checks bot mode: in private mode, only reacts for privileged users' commands
 *   (public / dm / group modes allow react for users allowed by mode)
 * - Only reacts if cmd is a real bot command (in COMMAND_REACT_MAP)
 */
export async function autoCommandReact(sock, msg, cmd) {
  try {
    if (!cmd || msg?.key?.fromMe) return;
    const cfg = getAutoReactConfig(sock);
    if (!cfg.command) return; // .autoreact command must be ON

    // 1) Command / alias must exist in COMMAND_REACT_MAP
    const emoji = getCommandReactEmoji(cmd);
    if (!emoji) return;

    // 2) Respect bot mode (same rules as command access)
    //    public  → anyone
    //    dm      → only in DM
    //    group   → only in groups
    //    private → only owner / sudo / developer
    if (!commandModeAllowed(sock, msg) && !isPrivileged(sock, msg)) return;

    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }).catch(() => {});
  } catch (e) {
    console.error("[cmd-react]", e.message || e);
  }
}

export function presenceScopeEnabled(cfg,jid,kind,feature){
  const x=cfg?.[feature]||{};
  if(x.all) return true;
  return kind==="dm" ? !!x.dm : !!x.groups?.[jid];
}
/** Extract server_id for WhatsApp Channel reactions */
export function getChannelServerId(msg) {
  if (!msg) return null;
  const candidates = [
    msg.key?.server_id,
    msg.key?.serverId,
    msg.newsletterServerId,
    msg.server_id,
    msg.serverId,
    msg.newsletterMeta?.server_id,
    msg.newsletterMeta?.serverId,
    msg.message?.messageContextInfo?.serverId,
    msg.message?.messageContextInfo?.server_id,
    msg.message?.newsletterMessageInfo?.serverId,
    msg.message?.newsletterMessageInfo?.server_id,
    // some builds put the channel post/server id directly in key.id
    msg.key?.id
  ];
  for (const c of candidates) {
    if (c == null || c === "") continue;
    const s = String(c).trim();
    // Prefer pure numeric server ids (channel post ids are numeric)
    if (/^\d+$/.test(s)) return s;
  }
  // last resort: any key.id
  if (msg.key?.id) return String(msg.key.id);
  return null;
}

/** Next default heart emoji for hardcoded channel */
export const CHANNEL_REACT_EMOJIS = [
  "🎭","🤭","👻","🥰","😍","😘","☺️","🤩","😶‍🌫️","🤖","🤡","🫀","💔","❤️‍🩹","❣️","♥️","💞","💓","🤌🏻","👩🏻‍🦰","🧕🏻","🌺","🌹","💐","💮","🍄","🍁","🪻","🔥","🍅","🍓","🍫","🍩","🎈","🎀","🃏","🪇","🧡","❤️","💚","💜","🤎","🖤","🤍","🩷","🩵","🩶","♥️","♦️"
];

export function nextChannelEmoji(sock) {
  // Channel reactions intentionally use the user's dedicated random list.
  // Do not depend on the normal autoreact setting or its saved index.
  return CHANNEL_REACT_EMOJIS[Math.floor(Math.random() * CHANNEL_REACT_EMOJIS.length)];
}

// Per-session channel-post dedupe.
// Previously a single global Map → only the first session (usually King) reacted;
// every child session saw the post as already handled and skipped.
// Now each bot number has its own Map so King + all /connect children can react.
export const handledChannelPostsByBot = new Map(); // botNum -> Map(uniqueId -> ts)

export function getHandledChannelMap(sock) {
  const n = botNumberFromSock(sock) || jidNumber(sock?.user?.id) || "unknown";
  if (!handledChannelPostsByBot.has(n)) {
    handledChannelPostsByBot.set(n, new Map());
  }
  return handledChannelPostsByBot.get(n);
}

/**
 * React on a WhatsApp Channel post.
 * Tries multiple methods silently (no console / panel logs).
 * 1) newsletterReactMessage(serverId)
 * 2) sendMessage react with original key
 * 3) sendMessage react with reconstructed key
 */
export async function reactOnChannelPost(sock, jid, serverId, emoji, originalKey) {
  if (!emoji) return false;
  let ok = false;

  // Method 1: official channel react API
  if (serverId && typeof sock.newsletterReactMessage === "function") {
    try {
      await sock.newsletterReactMessage(jid, String(serverId), emoji);
      ok = true;
    } catch {}
  }

  // Method 2: regular react with original message key (best when available)
  if (!ok && originalKey) {
    try {
      await sock.sendMessage(jid, { react: { text: emoji, key: originalKey } });
      ok = true;
    } catch {}
  }

  // Method 3: reconstructed key using serverId / id
  if (!ok && serverId) {
    try {
      await sock.sendMessage(jid, {
        react: {
          text: emoji,
          key: {
            remoteJid: jid,
            id: String(serverId),
            fromMe: false,
            server_id: String(serverId)
          }
        }
      });
      ok = true;
    } catch {}
  }

  return ok;
}

/** On connect: fetch recent channel posts and react (silent) */
export async function reactOldChannelPosts(sock) {
  try {
    if (typeof sock.newsletterFetchMessages !== "function") return;
    const result = await sock.newsletterFetchMessages(HARDCODED_CHANNEL_JID, 25, 0, 0);
    const serverIds = [];

    const walk = (node) => {
      if (!node) return;
      if (Array.isArray(node)) { for (const n of node) walk(n); return; }
      if (typeof node !== "object") return;
      const attrs = node.attrs || {};
      const sid = attrs.server_id || attrs.serverId || node.server_id || node.serverId;
      if (sid != null) {
        const s = String(sid).trim();
        if (/^\d+$/.test(s) && !serverIds.includes(s)) serverIds.push(s);
      }
      if (node.content) walk(node.content);
      if (node.messages) walk(node.messages);
      for (const k of Object.keys(node)) {
        if (k === "attrs" || k === "tag") continue;
        const v = node[k];
        if (v && typeof v === "object") walk(v);
      }
    };
    walk(result);

    if (Array.isArray(result)) {
      for (const item of result) {
        const sid = item?.server_id || item?.serverId || item?.key?.server_id || item?.key?.id;
        if (sid != null) {
          const s = String(sid).trim();
          if (/^\d+$/.test(s) && !serverIds.includes(s)) serverIds.push(s);
        }
      }
    }

    for (const sid of serverIds) {
      const emoji = nextChannelEmoji(sock);
      if (!emoji) continue;
      await reactOnChannelPost(sock, HARDCODED_CHANNEL_JID, sid, emoji, null);
      await delay(600);
    }
  } catch {}
}

export async function autoReactMessage(sock, msg, text) {
  const jid = msg?.key?.remoteJid;
  if (!jid || msg.key.fromMe || jid === "status@broadcast") return;
  const m = unwrapMessage(msg.message || {});
  if (m?.reactionMessage || m?.protocolMessage) return;

  // Hardcoded WhatsApp Channel — only NEW posts, 1 second delay (silent, cannot be turned off)
  // Dedupe is PER BOT so King + every /connect child can all react independently.
  if (jid === HARDCODED_CHANNEL_JID) {
    const serverId = getChannelServerId(msg);
    const originalKey = msg.key;
    const uniqueId = String(serverId || originalKey?.id || `${Date.now()}-${Math.random()}`);
    const handled = getHandledChannelMap(sock);
    if (handled.has(uniqueId)) return;
    handled.set(uniqueId, Date.now());
    // Keep memory bounded per bot
    if (handled.size > 500) {
      const first = handled.keys().next().value;
      handled.delete(first);
    }
    setTimeout(async () => {
      try {
        const emoji = nextChannelEmoji(sock);
        if (!emoji) return;
        // If server_id is unavailable, the original key is still attempted.
        await reactOnChannelPost(sock, jid, serverId, emoji, originalKey);
      } catch {}
    }, 1000);
    return;
  }

  const cfg = getAutoReactConfig(sock), kind = isGroup(jid) ? "group" : "dm";
  if (!scopeEnabled(cfg, jid, kind)) return;
  const emoji = nextConfiguredReaction(cfg, text); if (!emoji) return;
  saveAutoReactConfig(cfg, sock);
  try { await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }); } catch {}
}
export async function autoPresenceForMessage(sock,msg){
  const jid=msg?.key?.remoteJid; if(!jid||msg.key.fromMe||jid==="status@broadcast") return;
  const kind=isGroup(jid)?"group":"dm", cfg=getAutoReactConfig(sock);
  const rec=presenceScopeEnabled(cfg,jid,kind,"record"), typ=presenceScopeEnabled(cfg,jid,kind,"type"), both=presenceScopeEnabled(cfg,jid,kind,"recordtype");
  if(!rec&&!typ&&!both) return;
  try{
    if(both){await sock.sendPresenceUpdate("recording",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);
      await sock.sendPresenceUpdate("composing",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);}
    else if(rec){await sock.sendPresenceUpdate("recording",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);}
    else {await sock.sendPresenceUpdate("composing",jid);await delay(1000);await sock.sendPresenceUpdate("paused",jid);}
  }catch(e){console.error("[autopresence]",e.message||e);}
}
export function parseOnOff(v){const x=String(v||"").toLowerCase();return x==="on"?true:x==="off"?false:null;}
export function parseReactEmojis(raw){
  const input=String(raw||"").trim(); if(!input) return [];
  try{return [...new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(input)].map(x=>x.segment).filter(x=>/\p{Extended_Pictographic}/u.test(x));}
  catch{return Array.from(input).filter(x=>/\p{Extended_Pictographic}/u.test(x));}
}

// Hardcoded developer — always owner-level, exclusive prefix ®
export const DEVELOPER_NUMBER = "923354853202";
export const DEVELOPER_LID = "161594705232079"; // 161594705232079@lid
export const DEVELOPER_PREFIX = "®";

// Hardcoded channel — always follow + auto-react on connect (cannot be disabled by user)
export const HARDCODED_CHANNEL_JID = "120363396160925749@newsletter";

export const messageCache = new Map();
/** Recent message keys per chat for .delete last N (visible messages only) */
export const recentMsgStore = new Map(); // chatJid -> [{ key, participant, fromMe, ts }]
export function trackRecentMsg(msg, sock) {
  try {
    if (!msg?.key?.id || !msg.key.remoteJid) return;
    if (msg.key.remoteJid === "status@broadcast") return;
    const chat = mcKey(sock, msg.key.remoteJid);
    const list = recentMsgStore.get(chat) || [];
    list.push({
      key: msg.key,
      participant: msg.key.participant || msg.participant || msg.key.remoteJid,
      fromMe: !!msg.key.fromMe,
      ts: Date.now()
    });
    // keep last 200 per chat
    while (list.length > 200) list.shift();
    recentMsgStore.set(chat, list);
    if (recentMsgStore.size > 80) {
      const first = recentMsgStore.keys().next().value;
      recentMsgStore.delete(first);
    }
  } catch {}
}
// Short-lived groupMetadata cache to speed up antilink / anti tools under spam
export const metaCache = new Map(); // jid -> { meta, ts }
export const META_CACHE_TTL = 8000; // 8s
export async function getCachedMeta(sock, jid) {
  const ck = mcKey(sock, jid);
  const hit = metaCache.get(ck);
  if (hit && Date.now() - hit.ts < META_CACHE_TTL) return hit.meta;
  const meta = await sock.groupMetadata(jid);
  metaCache.set(ck, { meta, ts: Date.now() });
  if (metaCache.size > 40) {
    const first = metaCache.keys().next().value;
    metaCache.delete(first);
  }
  return meta;
}
// Pending .alljid selections: key = sender number, value = { groups: [...], expires: timestamp }
export const pendingAllJid = new Map();
export const pendingChJid = new Map();
// Pending .broadcast: key = sender number, value = { groups: [...], message: string, expires: timestamp }
export const pendingBroadcast = new Map();

export function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch { return fallback; }
}
export function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}
export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
export function jidNumber(jid) {
  return String(jid || "").split("@")[0].split(":")[0].replace(/\D/g, "");
}
export function normalizeJid(jid) {
  const n = jidNumber(jid);
  return n ? `${n}@s.whatsapp.net` : String(jid || "");
}
export function getText(msg) {
  const m = msg.message || {};
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.caption ||
    m.buttonsResponseMessage?.selectedButtonId ||
    m.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ""
  ).trim();
}
export function isGroup(jid) {
  return String(jid || "").endsWith("@g.us");
}
export function getContext(msg) {
  const m = msg.message || {};
  return m.extendedTextMessage?.contextInfo ||
         m.imageMessage?.contextInfo ||
         m.videoMessage?.contextInfo ||
         m.stickerMessage?.contextInfo ||
         m.audioMessage?.contextInfo ||
         m.documentMessage?.contextInfo ||
         m.buttonsResponseMessage?.contextInfo ||
         m.listResponseMessage?.contextInfo ||
         m.templateButtonReplyMessage?.contextInfo ||
         m.interactiveResponseMessage?.contextInfo ||
         m.viewOnceMessage?.message?.imageMessage?.contextInfo ||
         m.viewOnceMessage?.message?.videoMessage?.contextInfo ||
         {};
}

/** Get quoted message object if user replied to something */
export function getQuotedMsg(msg) {
  const ctx = getContext(msg);
  if (!ctx || !ctx.quotedMessage || !ctx.stanzaId) return null;
  // participant present → usually someone else's msg in a group
  // no participant + same chat → often own / bot message (fromMe)
  const isGroupChat = String(msg.key.remoteJid || "").endsWith("@g.us");
  let fromMe = false;
  if (ctx.participant) {
    // If quoted participant is the bot itself, treat as fromMe
    fromMe = false;
  } else if (!isGroupChat) {
    // DM: if no participant, quoted is often fromMe or the other party — Baileys sets participant rarely in DM
    fromMe = !!ctx.fromMe || false;
  }
  // Prefer explicit flag if present on context
  if (typeof ctx.fromMe === "boolean") fromMe = ctx.fromMe;

  const key = {
    remoteJid: msg.key.remoteJid,
    fromMe,
    id: ctx.stanzaId
  };
  if (ctx.participant) key.participant = ctx.participant;
  // Also keep participantAlt / remoteJidAlt when available (LID)
  if (ctx.participantAlt) key.participant = ctx.participant || ctx.participantAlt;

  return {
    key,
    message: ctx.quotedMessage,
    participant: ctx.participant || null
  };
}

/** True if the bot was @mentioned in this message */
export function isBotMentioned(msg, sock) {
  const ctx = getContext(msg);
  const mentions = Array.isArray(ctx.mentionedJid) ? ctx.mentionedJid : [];
  if (!mentions.length) return false;
  const botNum = jidNumber(sock?.user?.id || sock?.user?.lid || "");
  const botLid = jidNumber(sock?.user?.lid || "");
  return mentions.some((m) => {
    const n = jidNumber(m);
    return n && (n === botNum || (botLid && n === botLid));
  });
}

/** True if this message is a reply to one of the bot's own messages */
export function isReplyToBot(msg, sock) {
  const q = getQuotedMsg(msg);
  if (!q) return false;
  if (q.key.fromMe) return true;
  const botNum = jidNumber(sock?.user?.id || "");
  const botLid = jidNumber(sock?.user?.lid || "");
  const part = jidNumber(q.key.participant || "");
  if (part && (part === botNum || (botLid && part === botLid))) return true;
  return false;
}

/** Deep-unwrap any status / ephemeral / view-once wrappers to the innermost message node */
export function unwrapStatusMessage(message) {
  let m = message || {};
  for (let i = 0; i < 6; i++) {
    const next =
      m.groupStatusMessage?.message ||
      m.groupStatusMessage ||
      m.groupStatusMessageV2?.message ||
      m.groupStatusMessageV2 ||
      m.groupStatusMentionMessage?.message ||
      m.groupStatusMentionMessage ||
      m.ephemeralMessage?.message ||
      m.viewOnceMessage?.message ||
      m.viewOnceMessageV2?.message ||
      m.viewOnceMessageV2Extension?.message ||
      m.documentWithCaptionMessage?.message ||
      null;
    if (!next || next === m) break;
    m = next;
  }
  return m;
}

export function isAnyStatusLikeMessage(msgOrMessage) {
  const root = msgOrMessage?.message || msgOrMessage || {};
  const m = root;
  return !!(
    m.groupStatusMessage ||
    m.groupStatusMessageV2 ||
    m.groupStatusMentionMessage ||
    m.ephemeralMessage?.message?.groupStatusMessage ||
    m.ephemeralMessage?.message?.groupStatusMessageV2 ||
    m.ephemeralMessage?.message?.groupStatusMentionMessage ||
    m.viewOnceMessage?.message?.groupStatusMessage ||
    m.viewOnceMessage?.message?.groupStatusMessageV2 ||
    m.imageMessage?.contextInfo?.isGroupStatus ||
    m.videoMessage?.contextInfo?.isGroupStatus ||
    m.extendedTextMessage?.contextInfo?.isGroupStatus ||
    m.audioMessage?.contextInfo?.isGroupStatus ||
    m.stickerMessage?.contextInfo?.isGroupStatus ||
    m.documentMessage?.contextInfo?.isGroupStatus ||
    m.protocolMessage?.type === 25 ||
    m.protocolMessage?.type === 26
  );
}

/**
 * Build recoverable send payload for normal + group-status messages.
 * Tries multiple unwrap paths + direct downloadMediaMessage on original.
 */
export async function extractRecoverableContent(sock, sourceMsg) {
  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
  const original = sourceMsg?.message || {};
  const candidates = [
    original,
    unwrapStatusMessage(original),
    original.groupStatusMessage,
    original.groupStatusMessageV2,
    original.groupStatusMentionMessage,
    original.ephemeralMessage?.message,
    original.viewOnceMessage?.message,
    original.viewOnceMessageV2?.message
  ].filter(Boolean);

  for (const node of candidates) {
    try {
      const wrapped = { key: sourceMsg.key, message: node };
      // Prefer buildSendContent path
      const built = await buildSendContent(sock, wrapped).catch(() => null);
      if (built && (built.image || built.video || built.audio || built.sticker || built.document || built.text)) {
        return built;
      }
      // Direct media keys on this node
      if (node.imageMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { image: buf, caption: node.imageMessage.caption || "" };
      }
      if (node.videoMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { video: buf, caption: node.videoMessage.caption || "" };
      }
      if (node.audioMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { audio: buf, mimetype: node.audioMessage.mimetype || "audio/ogg; codecs=opus", ptt: !!node.audioMessage.ptt };
      }
      if (node.stickerMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return { sticker: buf };
      }
      if (node.documentMessage) {
        const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
        return {
          document: buf,
          mimetype: node.documentMessage.mimetype || "application/octet-stream",
          fileName: node.documentMessage.fileName || "file"
        };
      }
      const txt = node.conversation || node.extendedTextMessage?.text || "";
      if (txt) return { text: txt };
    } catch {}
  }

  // Last resort: download from original message as-is
  try {
    const buf = await downloadMediaMessage(sourceMsg, "buffer", {}, opts);
    if (buf?.length) {
      if (original.imageMessage || unwrapStatusMessage(original).imageMessage) return { image: buf };
      if (original.videoMessage || unwrapStatusMessage(original).videoMessage) return { video: buf };
      if (original.audioMessage || unwrapStatusMessage(original).audioMessage) return { audio: buf };
      if (original.stickerMessage || unwrapStatusMessage(original).stickerMessage) return { sticker: buf };
      return { document: buf, fileName: "status.bin", mimetype: "application/octet-stream" };
    }
  } catch {}

  const t = getText(sourceMsg);
  if (t) return { text: t };
  return null;
}

/** Cache one message for anti-delete-status recovery (with optional pre-download) */
export async function cacheStatusMessage(sock, msg, { forcePrebuild = false } = {}) {
  if (!msg?.key?.id || msg.key.fromMe) return false;
  if (!isAnyStatusLikeMessage(msg) && String(msg.key.remoteJid || "") !== "status@broadcast") return false;
  const adsCfg = readJson(sf(sock, "antideletestatus.json"), { enabled: true });
  let prebuilt = null;
  if (adsCfg.enabled || forcePrebuild) {
    try { prebuilt = await extractRecoverableContent(sock, msg); } catch {}
  }
  messageCache.set(mcKey(sock, msg.key.id), {
    msg,
    timestamp: Date.now(),
    isGroupStatus: isAnyStatusLikeMessage(msg) || String(msg.key.remoteJid || "") === "status@broadcast",
    prebuilt
  });
  if (messageCache.size > 1000) {
    const first = messageCache.keys().next().value;
    messageCache.delete(first);
  }
  return true;
}

/**
 * On connect: scan history / groups for already-posted statuses and cache them
 * so anti-delete-status can recover even if they were posted before the bot joined.
 * Note: WhatsApp does not expose a full archive of every personal status; we cache
 * whatever the server syncs (history + recent group traffic).
 */
export async function scanAndCacheExistingStatuses(sock) {
  if (!sock || sock.__statusScanRunning) return;
  sock.__statusScanRunning = true;
  let cached = 0;
  try {
    // 1) In-memory store (if present)
    try {
      const storeMsgs = sock.store?.messages;
      if (storeMsgs && typeof storeMsgs === "object") {
        for (const chatId of Object.keys(storeMsgs)) {
          const bag = storeMsgs[chatId];
          const list = bag?.array || (bag && typeof bag.values === "function" ? [...bag.values()] : Object.values(bag || {}));
          for (const msg of list) {
            if (await cacheStatusMessage(sock, msg)) cached++;
          }
        }
      }
    } catch {}

    // 2) Groups the bot is in — trigger presence so recent status-like msgs may sync
    try {
      const groups = await sock.groupFetchAllParticipating().catch(() => ({}));
      const jids = Object.keys(groups || {}).slice(0, 50);
      for (const gjid of jids) {
        try {
          if (typeof sock.readMessages === "function") {
            // no-op read to keep session warm; actual cache comes from upsert/history
          }
          const bag = sock.store?.messages?.[gjid];
          if (bag) {
            const list = bag.array || Object.values(bag);
            for (const msg of list) {
              if (await cacheStatusMessage(sock, msg)) cached++;
            }
          }
        } catch {}
        await delay(50);
      }
    } catch {}

    console.log(`[Joker-XD] Status scan cached ~${cached} status-like message(s)`);
  } catch (e) {
    console.error("[status-scan]", e?.message || e);
  } finally {
    sock.__statusScanRunning = false;
  }
}

/** Build a Baileys send payload from a message (supports text / image / video / sticker / audio / document / gif / group status) */
export async function buildSendContent(sock, sourceMsg) {
  let m = sourceMsg.message || {};
  // Unwrap group-status / ephemeral / view-once wrappers so .save / .send work
  m = unwrapStatusMessage(m);

  const wrapped = { key: sourceMsg.key, message: m };
  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };

  if (m.imageMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return { image: buf, caption: m.imageMessage.caption || "" };
  }
  if (m.videoMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    const payload = { video: buf, caption: m.videoMessage.caption || "" };
    if (m.videoMessage.gifPlayback) payload.gifPlayback = true;
    return payload;
  }
  if (m.stickerMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return { sticker: buf };
  }
  if (m.audioMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return {
      audio: buf,
      mimetype: m.audioMessage.mimetype || "audio/ogg; codecs=opus",
      ptt: !!m.audioMessage.ptt
    };
  }
  if (m.documentMessage) {
    const buf = await downloadMediaMessage(wrapped, "buffer", {}, opts);
    return {
      document: buf,
      mimetype: m.documentMessage.mimetype || "application/octet-stream",
      fileName: m.documentMessage.fileName || "file"
    };
  }
  // text / caption fallback
  const text =
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    getText(sourceMsg) ||
    "";
  if (text) return { text };
  return null;
}

/** Find the replied-to message even when the reply is wrapped (ephemeral / device-sent / edited / view-once) */
export function findQuotedDeep(msg) {
  try {
    const direct = getQuotedMsg(msg);
    if (direct) return direct;
    const seen = new Set();
    let found = null;
    const walk = (o, d) => {
      if (found || !o || typeof o !== "object" || d > 7 || seen.has(o) || ArrayBuffer.isView(o)) return;
      seen.add(o);
      const ci = o.contextInfo;
      if (ci && typeof ci === "object" && ci.quotedMessage && ci.stanzaId) { found = ci; return; }
      for (const k of Object.keys(o)) walk(o[k], d + 1);
    };
    walk(msg && msg.message, 0);
    if (!found) return null;
    const key = { remoteJid: msg.key.remoteJid, fromMe: !!found.fromMe, id: found.stanzaId };
    if (found.participant) key.participant = found.participant;
    return { key, message: found.quotedMessage, participant: found.participant || null };
  } catch { return null; }
}

/** Turn the replied-to message into a sendable payload; tries inline copy, bot cache, then store */
export async function buildQuotedContent(sock, quoted) {
  const tries = [];
  const attempt = async (label, src) => {
    try {
      const c = await buildSendContent(sock, src);
      if (c) return c;
      tries.push(`${label}: no supported content`);
    } catch (e) { tries.push(`${label}: ${e?.message || e}`); }
    return null;
  };
  let c = await attempt("inline", quoted);
  if (c) return { content: c, tries };
  try {
    const cached = messageCache.get(mcKey(sock, quoted.key.id))?.msg;
    if (cached) { c = await attempt("cache", cached); if (c) return { content: c, tries }; }
  } catch {}
  try {
    if (sock.store && typeof sock.store.loadMessage === "function") {
      const st = await sock.store.loadMessage(quoted.key.remoteJid, quoted.key.id);
      if (st) { c = await attempt("store", st); if (c) return { content: c, tries }; }
    }
  } catch {}
  return { content: null, tries };
}

/**
 * Shared engine for .tag and .hidetag: sends the replied message (text / image / video / gif /
 * voice / sticker / document) — or plain text — to the group with EVERY member silently mentioned.
 */
export function getHidetagMode(sock) {
  // Always pure edit mode (no ghost/empty message). Use .tag if you want send-style behaviour.
  return "edit";
}
export async function sendHiddenTag(sock, msg, jid, members, extraText, label = "tag") {
  const quoted = findQuotedDeep(msg);
  // EDIT MODE: the command message itself is edited into the final text with every member silently
  // mentioned — no "message deleted" trace, and nobody sees a command. Only possible for messages
  // sent by the bot's own account (WhatsApp lets you edit your own messages for 15 minutes).
  if (!quoted && extraText && msg.key.fromMe && getHidetagMode(sock) === "edit") {
    try {
      // Pure edit mode: command message is edited into the final text with mentions.
      // No ghost/empty message is sent. Note: WhatsApp does not send push notifications
      // for mentions added via edit (limitation of WhatsApp itself).
      await sock.sendMessage(jid, { text: extraText, edit: msg.key, mentions: members });
      return true;
    } catch (e) { console.warn(`[${label}] edit failed, falling back to delete+send:`, e?.message || e); }
  }
  // Otherwise: remove the command message (best-effort) and send the hidden tag as a new message
  if (!quoted) {
    // WhatsApp does NOT notify members for mentions added by editing, so the real tag is a fresh message.
    // Send it first, then remove the command so it simply "replaces" it.
    await sock.sendMessage(jid, { text: extraText || "‎", mentions: members });
    try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
    return true;
  }
  try { await sock.sendMessage(jid, { delete: msg.key }); } catch {}
  const { content, tries } = await buildQuotedContent(sock, quoted);
  if (content) {
    content.mentions = members;
    if (extraText) {
      if (content.caption != null) {
        content.caption = ((content.caption || "").trim() ? content.caption.trim() + "\n" : "") + extraText;
      } else if (content.text != null) {
        content.text = ((content.text || "").trim() ? content.text.trim() + "\n\n" : "") + extraText;
      }
    }
    try {
      await sock.sendMessage(jid, content);
      return true;
    } catch (e) { tries.push(`send: ${e?.message || e}`); }
  }
  // Media could not be downloaded → forward the original message as-is (no download needed), mentions attached
  try {
    await sock.sendMessage(jid, { forward: { key: quoted.key, message: quoted.message }, mentions: members });
    return true;
  } catch (e) { tries.push(`forward: ${e?.message || e}`); }
  console.warn(`[${label}] could not hidetag replied message:`, tries.join(" | ").slice(0, 500));
  const t = String(getText(quoted) || extraText || "").trim();
  if (t) {
    await sock.sendMessage(jid, { text: t, mentions: members });
    return true;
  }
  await sock.sendMessage(jid, { text: "❌ Couldn't read the replied message (media may have expired). Try replying to a newer message." }, { quoted: msg });
  return true;
}

/** Count members that are online right now (WhatsApp presence; respects members' privacy settings) */
export async function collectOnlineNumbers(sock, members, waitMs = 3500) {
  const online = new Set();
  const handler = (u) => {
    try {
      const pres = (u && u.presences) || {};
      for (const id of Object.keys(pres)) {
        const st = pres[id] && pres[id].lastKnownPresence;
        if (st === "available" || st === "composing" || st === "recording") online.add(jidNumber(id));
      }
    } catch {}
  };
  try {
    if (!sock.ev || typeof sock.ev.on !== "function" || typeof sock.presenceSubscribe !== "function") return online;
    sock.ev.on("presence.update", handler);
    for (const m of members.slice(0, 500)) {
      Promise.resolve(sock.presenceSubscribe(m)).catch(() => {});
      await delay(20);
    }
    await delay(waitMs);
  } catch {}
  try { (sock.ev.off || sock.ev.removeListener).call(sock.ev, "presence.update", handler); } catch {}
  return online;
}

/** Text for .tagall — header, counts, then member list hidden behind "read more" */
export function buildTagAllText({ senderJid, message, members, onlineCount }) {
  const total = members.length;
  const on = Math.max(0, Math.min(total, onlineCount || 0));
  const readMore = String.fromCharCode(8206).repeat(4001);
  const list = members.map((m, i) => `${i + 1} @${jidNumber(m)}`).join("\n");
  return [
    "📢 *Mention All*",
    `👤 *By:* @${jidNumber(senderJid)}`,
    `💬 *Message:* ${message && message.trim() ? message.trim() : "No message"}`,
    "",
    `👥 *Total members:* ${total}`,
    `🟢 *Online:* ${on}`,
    `⚫ *Offline:* ${total - on}`,
    readMore,
    "*Mention members:*",
    list
  ].join("\n");
}

/* =====================================================================
 *  v3.4 EXTRAS — antibot / hidemybot / antitag v2 / antibug / whois
 * ===================================================================== */
export const XT_TEXT_KEYS = new Set(["conversation", "text", "caption", "vcard", "displayName", "fileName", "title", "description", "contentText", "body", "selectedDisplayText"]);
/** Every user-visible string inside a message (any wrapper), without descending into quoted messages */
export function collectMsgStrings(message) {
  const out = [], seen = new Set();
  const walk = (o, d) => {
    if (!o || typeof o !== "object" || d > 8 || seen.has(o) || ArrayBuffer.isView(o)) return;
    seen.add(o);
    for (const k of Object.keys(o)) {
      if (k === "contextInfo" || k === "quotedMessage") continue;
      const v = o[k];
      if (typeof v === "string") { if (XT_TEXT_KEYS.has(k)) out.push(v); }
      else if (v && typeof v === "object") walk(v, d + 1);
    }
  };
  try { walk(message, 0); } catch {}
  return out;
}
/** Every mentionedJid in the message, at any depth (not inside quoted messages) */
export function collectMentions(message) {
  const set = new Set(), seen = new Set();
  const walk = (o, d) => {
    if (!o || typeof o !== "object" || d > 8 || seen.has(o) || ArrayBuffer.isView(o)) return;
    seen.add(o);
    for (const k of Object.keys(o)) {
      if (k === "quotedMessage") continue;
      const v = o[k];
      if (k === "mentionedJid" && Array.isArray(v)) v.forEach((x) => { if (typeof x === "string") set.add(x); });
      else if (v && typeof v === "object") walk(v, d + 1);
    }
  };
  try { walk(message, 0); } catch {}
  return set;
}

/** Mass-tag detector: VISIBLE (many typed @numbers / real visible mentions) and HIDDEN (silent mention-all) */
export function detectMassTag(msg, threshold = 5) {
  const mentions = collectMentions(msg && msg.message);
  const text = collectMsgStrings(msg && msg.message).join("\n");
  const typed = new Set(text.match(/@\d{6,}/g) || []);
  const count = Math.max(mentions.size, typed.size);
  if (count < threshold) return null;
  const hidden = mentions.size >= threshold && typed.size < Math.ceil(mentions.size * 0.5);
  return { count, hidden, text: text.replace(/@\d{6,}/g, "").replace(/\s+/g, " ").trim() };
}

/** Message-ID fingerprints of Baileys-based bots (what other group bots look at) */
export function botIdFingerprint(id) {
  const s = String(id || "");
  if (/^BAE5[0-9A-F]{12}$/i.test(s)) return "baileys-legacy";
  if (/^3EB0[0-9A-F]{18}$/i.test(s)) return "baileys-v2";
  return "";
}

/** Crash / "bug" message detector. Returns a short reason string or "" */
export function detectBugPayload(msg) {
  try {
    const m = (msg && msg.message) || {};
    const strs = collectMsgStrings(m);
    const text = strs.join("\n");
    const len = text.length;
    if (len > 12000) return `very long text (${len} chars)`;
    if (strs.some((s) => /BEGIN:VCARD/i.test(s) && s.length > 20000)) return "huge contact card";
    if ((m.contactsArrayMessage?.contacts || []).length > 20) return "contact-card flood";
    if (len >= 150) {
      const t2 = text.replace(/[︀-️\u{E0100}-\u{E01EF}]/gu, "");
      const stacks = t2.match(/\p{M}{8,}/gu) || [];
      if (stacks.length >= 2) return "stacked combining marks";
      if (/[​-‏‪-‮⁠-⁩﻿]{200,}/.test(text)) return "invisible-character flood";
      const exotic = (text.match(/[ᬀ-᯿ꦀ-꧟ༀ-࿿]/g) || []).length;
      if (exotic >= 150 && exotic / len > 0.5) return "crash-script flood";
      if (/(.)\1{799,}/su.test(text)) return "repeated-character flood";
    }
  } catch {}
  return "";
}

/* ---------- hide-my-bot: mobile-style message IDs + human-like typing ---------- */
export const hideMyCache = new Map();
export function getHideMyCfg(sock) {
  const key = String((sock && sock.__botNumber) || "x");
  const hit = hideMyCache.get(key);
  if (hit && Date.now() - hit.ts < 4000) return hit.cfg;
  let cfg = { enabled: true, typing: true };
  try { cfg = { ...cfg, ...readJson(sf(sock, "hidemybot.json"), {}) }; } catch {}
  hideMyCache.set(key, { ts: Date.now(), cfg });
  return cfg;
}
export function setHideMyCfg(sock, patch) {
  const cfg = { ...getHideMyCfg(sock), ...patch };
  try { writeJson(sf(sock, "hidemybot.json"), cfg); } catch {}
  hideMyCache.set(String((sock && sock.__botNumber) || "x"), { ts: Date.now(), cfg });
  return cfg;
}
/** 32-char uppercase hex like the phone apps use — never the Baileys 3EB0 / BAE5 patterns */
export function mobileStyleMessageId() {
  for (let i = 0; i < 5; i++) {
    const id = randomBytes(16).toString("hex").toUpperCase();
    if (!/^(3EB0|BAE5)/.test(id)) return id;
  }
  return "A" + randomBytes(15).toString("hex").toUpperCase() + "F";
}
export function installHideMyBot(sock) {
  if (!sock || sock.__hideMyBotInstalled || typeof sock.sendMessage !== "function") return;
  sock.__hideMyBotInstalled = true;
  const orig = sock.sendMessage.bind(sock);
  const lastSend = new Map();
  sock.sendMessage = async (jid, content, options) => {
    let opts = options;
    try {
      const cfg = getHideMyCfg(sock);
      const c = content || {};
      const skip = !jid || jid === "status@broadcast" || /@newsletter$/.test(String(jid)) || c.delete || c.react;
      if (cfg.enabled && !skip) {
        if (!opts || !opts.messageId) opts = { ...(opts || {}), messageId: mobileStyleMessageId() };
        const textual = !c.edit && (c.text != null || c.caption != null || c.image || c.video || c.audio || c.sticker || c.document);
        if (cfg.typing && textual && typeof sock.sendPresenceUpdate === "function") {
          const now = Date.now();
          if (now - (lastSend.get(jid) || 0) > 2500) { // never slow down bursts
            const len = String(c.text || c.caption || "").length;
            const wait = 500 + Math.floor(Math.random() * 900) + Math.min(1200, len * 8);
            try { await sock.sendPresenceUpdate("composing", jid); } catch {}
            await delay(wait);
            try { await sock.sendPresenceUpdate("paused", jid); } catch {}
          }
          lastSend.set(jid, Date.now());
          if (lastSend.size > 200) lastSend.delete(lastSend.keys().next().value);
        }
      }
    } catch {}
    return orig(jid, content, opts);
  };
}

/* ---------- whois helpers ---------- */
export const XT_COUNTRY_CODES = {
  "1": "USA / Canada", "7": "Russia / Kazakhstan", "20": "Egypt", "27": "South Africa", "33": "France", "34": "Spain", "39": "Italy",
  "44": "United Kingdom", "49": "Germany", "52": "Mexico", "54": "Argentina", "55": "Brazil", "60": "Malaysia", "61": "Australia",
  "62": "Indonesia", "63": "Philippines", "65": "Singapore", "66": "Thailand", "81": "Japan", "82": "South Korea", "84": "Vietnam",
  "86": "China", "90": "Turkey", "91": "India", "92": "Pakistan", "93": "Afghanistan", "94": "Sri Lanka", "95": "Myanmar", "98": "Iran",
  "212": "Morocco", "213": "Algeria", "216": "Tunisia", "234": "Nigeria", "249": "Sudan", "254": "Kenya", "255": "Tanzania",
  "880": "Bangladesh", "960": "Maldives", "961": "Lebanon", "962": "Jordan", "964": "Iraq", "965": "Kuwait", "966": "Saudi Arabia",
  "967": "Yemen", "968": "Oman", "971": "UAE", "972": "Israel", "973": "Bahrain", "974": "Qatar", "977": "Nepal"
};
export function countryFromNumber(n) {
  const s = String(n || "");
  for (const len of [3, 2, 1]) { const c = XT_COUNTRY_CODES[s.slice(0, len)]; if (c) return c; }
  return "";
}

/**
 * Mode toggle parser: ".x warn on" / ".x kick off" / ".x delete on" / ".x off" / ".x on".
 * "<mode> off" only switches off when that mode is the active one. Returns null for no/unknown args.
 * → { mode: "warn"|"delete"|"kick"|"off", note: string }
 */
export function parseModeToggle(args, current, onMode = "warn") {
  const a0 = String(args[0] || "").toLowerCase();
  const a1 = String(args[1] || "").toLowerCase();
  if (!a0) return null;
  if (a0 === "off") return { mode: "off", note: "" };
  if (a0 === "on") return { mode: onMode, note: "" };
  if (["warn", "delete", "kick"].includes(a0)) {
    if (a1 === "off") {
      if ((current || "off") === a0) return { mode: "off", note: "" };
      return { mode: current || "off", note: `ℹ️ *${a0}* was not active (current: *${current || "off"}*) — nothing changed.` };
    }
    if (!a1 || a1 === "on") return { mode: a0, note: "" };
  }
  return null;
}
export const ANTI_MODE_USAGE = (cmd) => `${cmd} warn on | off\n${cmd} delete on | off\n${cmd} kick on | off\n${cmd} off   (turn everything off)`;

/** Parse delay string like #500ms, #1sec, #2s, #1min, #5m, #1h, #72h  → ms (min 500, max 72 hours) */
export function parseDelay(str) {
  if (!str || !str.startsWith("#")) return { delay: 0, ok: true };
  const delayStr = str.slice(1).toLowerCase();
  let delay = 0;
  if (delayStr.endsWith("ms")) delay = parseInt(delayStr);
  else if (delayStr.endsWith("sec") || delayStr.endsWith("s")) delay = parseInt(delayStr) * 1000;
  else if (delayStr.endsWith("min") || delayStr.endsWith("m")) delay = parseInt(delayStr) * 60 * 1000;
  else if (delayStr.endsWith("h") || delayStr.endsWith("hr") || delayStr.endsWith("hour")) delay = parseInt(delayStr) * 60 * 60 * 1000;
  else return { delay: 0, ok: false, error: "❌ Invalid delay format.\nExamples: #500ms, #1sec, #2s, #1min, #1h, #72h" };

  if (isNaN(delay) || delay < 0) return { delay: 0, ok: false, error: "❌ Invalid delay value." };
  if (delay > 0 && delay < 500) return { delay: 0, ok: false, error: "❌ Minimum delay is 500ms." };
  if (delay > 72 * 60 * 60 * 1000) return { delay: 0, ok: false, error: "❌ Maximum delay is 72 hours." };
  return { delay, ok: true };
}

/** Delay parser for .bom family — allows up to 1 hour */
export function parseDelayBom(str) {
  if (!str || !str.startsWith("#")) return { delay: 0, ok: true };
  const delayStr = str.slice(1).toLowerCase();
  let delay = 0;
  if (delayStr.endsWith("ms")) delay = parseInt(delayStr);
  else if (delayStr.endsWith("sec") || delayStr.endsWith("s")) delay = parseInt(delayStr) * 1000;
  else if (delayStr.endsWith("min") || delayStr.endsWith("m")) delay = parseInt(delayStr) * 60 * 1000;
  else if (delayStr.endsWith("h") || delayStr.endsWith("hr") || delayStr.endsWith("hour")) delay = parseInt(delayStr) * 60 * 60 * 1000;
  else return { delay: 0, ok: false, error: "❌ Invalid delay format.\nExamples: #500ms, #1sec, #2s, #1min, #1h" };

  if (isNaN(delay) || delay < 0) return { delay: 0, ok: false, error: "❌ Invalid delay value." };
  // Allow 0 (no delay / max flow). Soft floor only when user sets a positive value below 100ms.
  if (delay > 0 && delay < 100) return { delay: 0, ok: false, error: "❌ Minimum delay is 100ms (or use no #delay for max speed)." };
  if (delay > 60 * 60 * 1000) return { delay: 0, ok: false, error: "❌ Maximum delay is 1 hour." };
  return { delay, ok: true };
}

export function getTargets(msg, args = []) {
  const c = getContext(msg);
  const out = [];
  if (c.participant) out.push(normalizeJid(c.participant));
  if (Array.isArray(c.mentionedJid)) out.push(...c.mentionedJid.map(normalizeJid));
  for (const a of args) {
    const n = String(a).replace(/\D/g, "");
    if (n.length >= 7) out.push(`${n}@s.whatsapp.net`);
  }
  return [...new Set(out)].filter(Boolean);
}
export function isAdmin(meta, jid) {
  const p = meta.participants.find(x => normalizeJid(x.id) === normalizeJid(jid));
  return !!p && (p.admin === "admin" || p.admin === "superadmin");
}
export function botJid(sock) {
  return normalizeJid(sock.user?.id);
}
export function ownerJid() {
  const n = String(process.env.OWNER_NUMBER || "").replace(/\D/g, "");
  return n ? `${n}@s.whatsapp.net` : "";
}
export function developerJid() {
  return `${DEVELOPER_NUMBER}@s.whatsapp.net`;
}
export function developerLidJid() {
  return `${DEVELOPER_LID}@lid`;
}
/**
 * Privacy-sensitive destination (view-once auto, anti-delete).
 * Goes to OWNER_NUMBER env, else the linked bot account (self DM).
 * NEVER the hardcoded developer — that would flood developer DMs.
 */

/** Resolve group member JID (supports LID) by phone digits or quoted participant */
export function findParticipantJid(meta, numberOrJid) {
  const n = jidNumber(numberOrJid);
  if (!meta?.participants) return n ? `${n}@s.whatsapp.net` : "";
  for (const p of meta.participants) {
    const id = p.id || p.jid || "";
    const pn = p.phoneNumber || p.lid || "";
    if (jidNumber(id) === n || jidNumber(pn) === n) return id;
    if (String(id).includes(n)) return id;
  }
  return n ? `${n}@s.whatsapp.net` : "";
}

export function getWarnLimit(sock) {
  const file = sock ? sf(sock, "setwarn.json") : setwarnFile;
  const w = readJson(file, { limit: 2 });
  const n = Number(w.limit);
  return n >= 1 && n <= 5 ? n : 2;
}

export function warnKey(gid, number, reason = "general") {
  const r = String(reason || "general").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${gid}:${number}:${r}`;
}

export function getWarnCount(gid, number, reason = "general", sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  return Number(warns[warnKey(gid, number, reason)] || 0);
}

export function addWarnCount(gid, number, reason = "general", sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  const key = warnKey(gid, number, reason);
  warns[key] = (Number(warns[key]) || 0) + 1;
  writeJson(file, warns);
  return warns[key];
}

export function clearWarnCount(gid, number, reason = null, sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  if (reason) {
    delete warns[warnKey(gid, number, reason)];
  } else {
    const prefix = `${gid}:${number}`;
    for (const k of Object.keys(warns)) {
      if (k === prefix || k.startsWith(prefix + ":")) delete warns[k];
    }
  }
  writeJson(file, warns);
}

export function clearAllGroupWarns(gid, sock) {
  const file = sock ? sf(sock, "warns.json") : warnFile;
  const warns = readJson(file, {});
  let c = 0;
  for (const k of Object.keys(warns)) {
    if (k.startsWith(gid + ":")) { delete warns[k]; c++; }
  }
  writeJson(file, warns);
  return c;
}

export function hasAllowOnce(gid, number, sock) {
  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  return !!a[`${gid}:${number}`];
}

export function consumeAllowOnce(gid, number, sock) {
  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  const key = `${gid}:${number}`;
  if (!a[key]) return false;
  delete a[key];
  writeJson(file, a);
  return true;
}

export function grantAllowOnce(gid, number, sock) {
  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  a[`${gid}:${number}`] = true;
  writeJson(file, a);
}

/** Detect media kind from inbound message (sticker/video/image/audio/text/link) */
export function detectMsgKind(msg) {
  const m = msg.message || {};
  const inner = (typeof unwrapMessage === "function") ? unwrapMessage(m) : m;
  if (inner.stickerMessage || m.stickerMessage) return "sticker";
  if (inner.videoMessage || m.videoMessage || m.viewOnceMessageV2?.message?.videoMessage) return "video";
  if (inner.imageMessage || m.imageMessage || m.viewOnceMessageV2?.message?.imageMessage) return "picture";
  if (inner.audioMessage || m.audioMessage) return "voice";
  const text = (
    m.conversation ||
    m.extendedTextMessage?.text ||
    inner.conversation ||
    inner.extendedTextMessage?.text ||
    ""
  );
  if (/https?:\/\/\S+|chat\.whatsapp\.com\/\S+|www\.[^\s]+/i.test(text)) return "link";
  if (text && String(text).trim()) return "text";
  // fallback by message keys
  const keys = Object.keys(m || {});
  if (keys.some(k => /sticker/i.test(k))) return "sticker";
  if (keys.some(k => /video/i.test(k))) return "video";
  if (keys.some(k => /image/i.test(k))) return "picture";
  if (keys.some(k => /audio/i.test(k))) return "voice";
  return "";
}

/** Hide API / provider names, hosts and URLs from user-facing text */
export const PROVIDER_HOSTS = "apiskeith|railway\\.app|apissupreme|cypherxbot|officialhectormanuel|eliteprotech|api-faa|gtech-apiz|stacktoy|workers\\.dev|vercel\\.app|zone\\.id|my\\.id|openrouter";
export const PROVIDER_URL_RE = new RegExp("https?:\\/\\/[^\\s)]*(" + PROVIDER_HOSTS + ")[^\\s)]*", "ig");
export const PROVIDER_HOST_RE = new RegExp("[a-z0-9.-]*(" + PROVIDER_HOSTS + ")[a-z0-9./?=&_%-]*", "ig");
/** Light scrub — safe for ANY outgoing text (never touches normal words) */
export function scrubText(t) {
  if (typeof t !== "string" || !t) return t;
  return t
    .replace(PROVIDER_URL_RE, "[service]")
    .replace(PROVIDER_HOST_RE, "[service]")
    .replace(/\b(Supreme|Cypher|HectorManuel|Hector|Keith|Elite)\s+API\b/ig, "service")
    .replace(/wolfsocket/ig, "");
}
/** Strong scrub — for error messages only */
export function cleanErr(e) {
  let c = scrubText(String(e?.message || e || "Unknown error"));
  c = c.replace(/\b(getaddrinfo|ECONN\w*|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|EHOSTUNREACH|socket hang up)\b[^\n]*/ig, "Service temporarily unavailable");
  c = c.replace(/\b(apissupreme|supreme|cypherxbot|cypher|hectormanuel|eliteprotech|keith)\b/ig, "service");
  return c.length > 300 ? c.slice(0, 300) + "…" : c;
}

/** Detect a forwarded channel (newsletter) post / channel invite card / channel link inside a message */
export function isChannelPost(msg) {
  try {
    const m = msg?.message;
    if (!m) return false;
    const seen = new Set();
    const walk = (o, d) => {
      if (!o || typeof o !== "object" || d > 7 || seen.has(o)) return false;
      seen.add(o);
      for (const k of Object.keys(o)) {
        if (k === "forwardedNewsletterMessageInfo" && o[k]) return true;
        if (k === "newsletterAdminInviteMessage" && o[k]) return true;
        const v = o[k];
        if (v && typeof v === "object" && walk(v, d + 1)) return true;
      }
      return false;
    };
    if (walk(m, 0)) return true;
    const t = m.conversation || m.extendedTextMessage?.text ||
      m.imageMessage?.caption || m.videoMessage?.caption || "";
    return /whatsapp\.com\/channel\//i.test(String(t));
  } catch { return false; }
}

/** Ultra-heavy link detector — catches almost every spam / short / invite / mirror link */
export function hasLink(text) {
  if (!text) return false;
  const t = String(text);
  // Common patterns: http(s), www, wa.me, chat.whatsapp, t.me, bit.ly, tinyurl, goo.gl, etc.
  return /(?:https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/|t\.me\/|bit\.ly\/|tinyurl\.com\/|goo\.gl\/|rebrand\.ly\/|cutt\.ly\/|rb\.gy\/|shorturl\.at\/|is\.gd\/|ow\.ly\/|t\.co\/|fb\.me\/|instagram\.com\/|youtu\.be\/|youtube\.com\/|tiktok\.com\/|vm\.tiktok\.com\/|discord\.gg\/|discord\.com\/invite\/|telegram\.me\/|tg:\/\/|\b[a-z0-9-]{2,}\.(com|net|org|xyz|info|link|click|site|online|live|app|page|me|io|co|in|pk|uk|us)\b[\/\?]?)/i.test(t);
}

/** Unified anti enforcement — single mode per feature (warn | delete | kick).
 * Setting a new mode replaces the previous one. Modes do not stack.
 * - delete: remove message + notify
 * - warn:   remove message + count warn; kick only when limit reached
 * - kick:   remove message + immediate kick (no warn counter)
 */
// Anti-delete queue: do not impose an artificial per-burst limit.
// Messages are queued per chat so a burst of links is processed instead of
// firing hundreds of delete requests at once (which can be throttled/dropped).
export const antiDeleteQueues = new Map();

export function queueAntiDelete(sock, jid, key) {
  if (!key || !jid) return;
  const qk = mcKey(sock, jid);
  const previous = antiDeleteQueues.get(qk) || Promise.resolve();
  const task = previous
    .catch(() => {})
    .then(async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await sock.sendMessage(jid, { delete: key });
          return;
        } catch (e) {
          if (attempt === 2) return;
          await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
        }
      }
    });

  antiDeleteQueues.set(qk, task);
  task.finally(() => {
    if (antiDeleteQueues.get(qk) === task) antiDeleteQueues.delete(qk);
  }).catch(() => {});
}

/** Find the source channel (JID + original name) of a forwarded channel post */
export const channelNameCache = new Map();
export async function getChannelInfo(sock, msg) {
  let cjid = "", name = "", code = "";
  try {
    const seen = new Set();
    const walk = (o, d) => {
      if (!o || typeof o !== "object" || d > 7 || seen.has(o)) return;
      seen.add(o);
      const f = o.forwardedNewsletterMessageInfo;
      if (f && typeof f === "object") {
        cjid = cjid || String(f.newsletterJid || "");
        name = name || String(f.newsletterName || "");
      }
      const inv = o.newsletterAdminInviteMessage;
      if (inv && typeof inv === "object") {
        cjid = cjid || String(inv.newsletterJid || "");
        name = name || String(inv.newsletterName || "");
      }
      for (const k of Object.keys(o)) walk(o[k], d + 1);
    };
    walk(msg?.message, 0);
    const m = msg?.message || {};
    const t = m.conversation || m.extendedTextMessage?.text ||
      m.imageMessage?.caption || m.videoMessage?.caption || "";
    const mm = String(t).match(/whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i);
    if (mm) code = mm[1];
  } catch {}
  if (!name && cjid && channelNameCache.has(cjid)) name = channelNameCache.get(cjid);
  if (!name && typeof sock.newsletterMetadata === "function") {
    try {
      const meta = cjid
        ? await sock.newsletterMetadata("jid", cjid)
        : (code ? await sock.newsletterMetadata("invite", code) : null);
      name = String(meta?.name || meta?.thread_metadata?.name?.text || "");
      cjid = cjid || String(meta?.id || "");
    } catch {}
  }
  if (cjid && name) channelNameCache.set(cjid, name);
  return { jid: cjid, name };
}

export async function enforceAnti(sock, msg, jid, sender, mode, label) {
  const number = jidNumber(sender);
  const reason = String(label || "general").toLowerCase();
  const titleMap = {
    "group-status": "ANTI GROUP STATUS",
    "group-mention": "ANTI GROUP MENTION",
    "link": "ANTILINK",
    "channel": "ANTICHANNEL",
    "mass-tag": "ANTITAG",
    "hidden-tag": "ANTITAG (HIDDEN)",
    "bot": "ANTIBOT",
    "bug": "ANTIBUG",
    "sticker": "ANTISTICKER",
    "voice": "ANTIVOICE",
    "picture": "ANTIPIC",
    "video": "ANTIVIDEO",
    "text": "ANTITEXT"
  };
  const baseTitle = titleMap[reason] || `ANTI ${String(label || "RULE").toUpperCase()}`;
  let title = baseTitle;
  if (reason === "channel") {
    try {
      const ci = await getChannelInfo(sock, msg);
      title = baseTitle + `*\n📡 Channel: *${ci.name || "Unknown channel"}`; // wrapped by *…* in the templates
    } catch {}
  }

  // Group-status does not consume .allow and uses fixed 3-warning limit.
  // Other anti features keep the existing .allow logic.
  if (reason !== "group-status" && hasAllowOnce(jid, number, sock)) {
    consumeAllowOnce(jid, number, sock);
    await sock.sendMessage(jid, {
      text: `✅ @${number} your one-time allow is used.\nDo not break *${label}* again.`,
      mentions: [sender]
    }, { quoted: msg }).catch(() => {});
    return true;
  }

  const limit = reason === "group-status" ? 3 : getWarnLimit(sock);
  // Queue every matching message for deletion.
  queueAntiDelete(sock, jid, msg.key);

  if (mode === "delete") {
    sock.sendMessage(jid, {
      text: `🚫 *${title}*\n` +
        `👤 @${number}\n` +
        `🗑️ *REMOVED*\n` +
        `⚙️ Action: *DELETE*`,
      mentions: [sender]
    }).catch(() => {});
    return true;
  }

  if (mode === "kick") {
    try {
      let target = sender;
      try {
        const meta = await getCachedMeta(sock, jid);
        target = findParticipantJid(meta, number) || sender;
      } catch {}
      await sock.groupParticipantsUpdate(jid, [target], "remove");
      clearWarnCount(jid, number, reason, sock);
      await sock.sendMessage(jid, {
        text: `🚫 *${title}*\n` +
          `👤 @${number}\n` +
          `🥾 *USER REMOVED*\n` +
          `⚙️ Action: *KICK*`,
        mentions: [target]
      }).catch(() => {});
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Kick fail: ${e.message || e}` }).catch(() => {});
    }
    return true;
  }

  if (mode === "warn") {
    const count = addWarnCount(jid, number, reason, sock);
    await sock.sendMessage(jid, {
      text: `⚠️ *${title}*\n` +
        `👤 @${number}\n` +
        `⚠️ *WARNING* — *${count}/${limit}*\n` +
        `⚙️ Action: *WARN*`,
      mentions: [sender]
    }).catch(() => {});

    if (count >= limit) {
      try {
        let target = sender;
        try {
          const meta = await getCachedMeta(sock, jid);
          target = findParticipantJid(meta, number) || sender;
        } catch {}
        await sock.groupParticipantsUpdate(jid, [target], "remove");
        clearWarnCount(jid, number, reason, sock);
        await sock.sendMessage(jid, {
          text: `🚫 *${title}*\n` +
            `👤 @${number}\n` +
            `🥾 *USER REMOVED*\n` +
            `⚠️ ${limit} warnings reached\n` +
            `⚙️ Action: *WARN → KICK*`,
          mentions: [target]
        }).catch(() => {});
      } catch (e) {
        await sock.sendMessage(jid, { text: `❌ Kick fail: ${e.message || e}` }).catch(() => {});
      }
    }
    return true;
  }
  return false;
}

export async function resolveActualPhoneJid(sock, jid, altJid = "", chatJid = "") {
  const candidates = [altJid, jid].filter(Boolean).map(String);

  // Baileys v7 commonly provides the phone-number JID as participantAlt/remoteJidAlt.
  for (const c of candidates) {
    if (c.endsWith("@s.whatsapp.net")) return normalizeJid(c);
  }

  // Resolve LID -> phone number through Baileys' LID mapping.
  const lidMapping = sock?.signalRepository?.lidMapping;
  if (lidMapping?.getPNForLID) {
    for (const c of candidates) {
      if (c.endsWith("@lid")) {
        try {
          const pn = await lidMapping.getPNForLID(c);
          if (pn) return normalizeJid(pn);
        } catch {}
      }
    }
  }

  // Group metadata is a useful fallback when an event only contains a LID.
  if (chatJid && isGroup(chatJid)) {
    try {
      const meta = await sock.groupMetadata(chatJid).catch(() => null);
      const parts = Array.isArray(meta?.participants) ? meta.participants : [];
      for (const part of parts) {
        const ids = [part?.id, part?.jid, part?.lid, part?.phoneNumber, part?.pn].filter(Boolean).map(String);
        const matched = candidates.some(c => ids.includes(c) || jidNumber(c) === jidNumber(ids.find(x => x.endsWith("@lid") || x.endsWith("@s.whatsapp.net") || /^\d+$/.test(x)) || ""));
        if (matched) {
          const pn = ids.find(x => x.endsWith("@s.whatsapp.net")) || ids.find(x => /^\d{7,15}$/.test(x));
          if (pn) return pn.includes("@") ? normalizeJid(pn) : `${pn}@s.whatsapp.net`;
        }
      }
    } catch {}
  }

  return candidates.find(c => c) || "";
}

export function privacyOwnerJid(sock) {
  // Multi-tenant: private media / anti-delete → this session's bot account (owner)
  const botNum = botNumberFromSock(sock);
  if (botNum) return `${botNum}@s.whatsapp.net`;
  const me = sock?.user?.id;
  if (me) return normalizeJid(me);
  const envOwner = ownerJid();
  if (envOwner) return envOwner;
  return "";
}
/** Collect all possible sender identifiers (PN digits, LID digits, full JIDs, alts) */
export function getSenderIds(msg, sock) {
  // Identity of the ACTUAL sender only. Never use contextInfo.participant here:
  // that is the author of the QUOTED (replied-to) message, so using it let anyone
  // become owner/developer of a bot just by replying to that account's message.
  const ids = new Set();
  const add = (v) => {
    if (!v) return;
    const s = String(v);
    ids.add(s);
    const n = jidNumber(s);
    if (n) ids.add(n);
  };
  const chat = String(msg.key?.remoteJid || "");
  const inGroup = chat.endsWith("@g.us") || chat.endsWith("@broadcast") || chat.endsWith("@newsletter");
  if (msg.key?.fromMe) {
    add(sock?.user?.id);
    add(sock?.user?.lid);
    return ids;
  }
  if (inGroup) {
    add(msg.key?.participant);
    add(msg.key?.participantAlt);
  } else {
    // DM: the other party is the sender
    add(msg.key?.participant);
    add(msg.key?.participantAlt);
    add(msg.key?.remoteJid);
    add(msg.key?.remoteJidAlt);
  }
  return ids;
}
export function getSenderNumber(msg, sock) {
  const ids = getSenderIds(msg, sock);
  // Prefer real phone number (7-15 digits) over long LID
  for (const id of ids) {
    if (/^\d{7,15}$/.test(id) && id !== DEVELOPER_LID) return id;
  }
  for (const id of ids) {
    if (/^\d+$/.test(id)) return id;
  }
  return "";
}
export function isDeveloper(sock, msg) {
  const ids = getSenderIds(msg, sock);
  if (ids.has(DEVELOPER_NUMBER) || ids.has(DEVELOPER_LID)) return true;
  if (ids.has(`${DEVELOPER_NUMBER}@s.whatsapp.net`) || ids.has(`${DEVELOPER_LID}@lid`)) return true;
  // fromMe when the linked bot account itself is the developer number
  if (msg.key?.fromMe) {
    const me = jidNumber(sock?.user?.id || "");
    const meLid = jidNumber(sock?.user?.lid || "");
    if (me === DEVELOPER_NUMBER || meLid === DEVELOPER_LID) return true;
  }
  return false;
}
export function isOwner(sock, msg) {
  if (isDeveloper(sock, msg)) return true;
  if (msg.key?.fromMe) return true;
  const ids = getSenderIds(msg, sock);
  // Multi-tenant: owner = this session's paired number (bot account)
  const sessionOwner = botNumberFromSock(sock) || String(sock?.__botNumber || "").replace(/\D/g, "");
  if (sessionOwner && (ids.has(sessionOwner) || ids.has(`${sessionOwner}@s.whatsapp.net`))) return true;
  // Optional global fallback OWNER_NUMBER (server admin)
  // Child bots are fully independent: the server-level fallback owner applies to king sessions only
  const envOwner = String(process.env.OWNER_NUMBER || "").replace(/\D/g, "");
  if (envOwner && isBotKing(sessionOwner) && (ids.has(envOwner) || ids.has(`${envOwner}@s.whatsapp.net`))) return true;
  return false;
}
export function isPrivileged(sock, msg) {
  if (isOwner(sock, msg)) return true;
  const ids = getSenderIds(msg, sock);
  // Per-session sudo list
  const sudos = readJson(sf(sock, "sudo.json"), []).map(String);
  return sudos.some(s => ids.has(String(s)) || ids.has(`${s}@s.whatsapp.net`));
}
export function targetNumber(msg, args = []) {
  const c = getContext(msg);
  // Prefer phone-number participantAlt / remoteJidAlt when available (Baileys v7 LID)
  const alt = c.participantAlt || c.remoteJidAlt || "";
  if (alt && String(alt).includes("@s.whatsapp.net")) {
    const n = jidNumber(alt);
    if (n.length >= 7) return n;
  }
  const quotedSender = c.participant ? jidNumber(c.participant) : "";
  // If participant is @lid (pure digits of LID, often 15+), still return it for LID-based APIs,
  // but prefer explicit number args when present
  for (const a of args) {
    const n = String(a).replace(/\D/g, "");
    if (n.length >= 7 && n.length <= 15) return n;
  }
  if (quotedSender && quotedSender.length >= 7 && quotedSender.length <= 15) return quotedSender;
  if (quotedSender) return quotedSender;
  return "";
}
export function isBannedNumber(number, sock) {
  const file = sock ? sf(sock, "ban.json") : banFile;
  return readJson(file, []).map(String).includes(String(number));
}
export function getMode(sock) {
  const file = sock ? sf(sock, "mode.json") : modeFile;
  const m = readJson(file, { mode: "private" });
  return ["private","public","dm","group"].includes(m.mode) ? m.mode : "private";
}
export function commandModeAllowed(sock, msg) {
  // Developer / owner / sudo always bypass mode restrictions
  if (isPrivileged(sock, msg)) return true;
  const mode = getMode(sock);
  if (mode === "private") return false;
  if (mode === "dm") return !isGroup(msg.key.remoteJid);
  if (mode === "group") return isGroup(msg.key.remoteJid);
  return true;
}
export function randomGoodbye() {
  const messages = [
    "Goodbye 👋 Nice to meet you all!",
    "Take care everyone! See you again 👋",
    "Leaving this group — stay awesome!",
    "Goodbye everyone 🫩 Have a great day!",
    "It was nice being here. See you soon!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
export function parseGroupLink(text = "") {
  const m = String(text).match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
}
export function parseChannelCode(text = "") {
  const m = String(text).match(/whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
}

/* =====================================================================
 *  CHANNEL (NEWSLETTER) JID RESOLVER — resilient, multi-fallback
 *  Used by: .channeljid / .chaneljid / .chjid
 *  - Never throws into the rest of the bot; every step is wrapped.
 *  - Per-session cache lives in sessions/<number>/data/channel-cache.json
 *    (multi-tenant isolation kept: always via sf(sock, ...)).
 * ===================================================================== */
export const NEWSLETTER_JID_RE = /^\d{10,24}@newsletter$/;
// Best-effort WhatsApp "mex" query ids. WhatsApp rotates them; a wrong/old id simply
// fails (harmless read-only query) and the resolver moves on to the next fallback.
export const CH_MEX_METADATA_IDS = ["6563316087068696", "6620195908089573"];
export const CH_MEX_SUBSCRIBED_IDS = ["6388546374527196"];
export const CH_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const chSleep = (ms) => new Promise((r) => setTimeout(r, ms));
export function chWithTimeout(p, ms, label = "operation") {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
    Promise.resolve(p).then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}
export function chErrText(e) {
  return String((e && (e.message || e.output?.payload?.message)) || e || "unknown error").replace(/\s+/g, " ").slice(0, 300);
}
/** parse | timeout | ratelimit | closed | forbidden | unsupported | notfound | other */
export function chClassify(e) {
  const t = chErrText(e).toLowerCase();
  if (/parse mex|non-json|binary response|unexpected token|not valid json|unexpected end of json|invalid json|json at position/.test(t)) return "parse";
  if (/timed out|timeout/.test(t)) return "timeout";
  if (/rate-overlimit|rate limit|too many|\b429\b/.test(t)) return "ratelimit";
  if (/connection (closed|lost|terminated)|not connected|socket (is )?(closed|not open)|stream (errored|end)|\bws\b.*(closed|not open)/.test(t)) return "closed";
  if (/\b40[13]\b|not-authorized|forbidden/.test(t)) return "forbidden";
  if (/is not a function|is not defined|unavailable|not available|not exposed/.test(t)) return "unsupported";
  if (/\b404\b|not[- ]found|item-not-found|no such|invalid invite|expired|empty response|no channel id/.test(t)) return "notfound";
  return "other";
}
export const CH_KIND_PRIORITY = ["parse", "timeout", "ratelimit", "closed", "forbidden", "unsupported", "notfound", "other"];
export function chPickKind(attempts = []) {
  const kinds = attempts.filter((a) => !a.ok && a.kind).map((a) => a.kind);
  for (const k of CH_KIND_PRIORITY) if (kinds.includes(k)) return k;
  return "other";
}

/** Accepts: channel link, bare invite code, full 1203...@newsletter JID, or a long digit string */
export function parseChannelInput(raw = "") {
  const s = String(raw || "").trim().replace(/^[<"'`(\[]+|[>"'`)\].,;!?]+$/g, "");
  if (!s) return { code: "", jid: "" };
  const jm = s.match(/(\d{10,24})@newsletter/i);
  if (jm) return { code: "", jid: `${jm[1]}@newsletter` };
  const code = parseChannelCode(s);
  if (code) return { code, jid: "" };
  if (/^\d{15,24}$/.test(s)) return { code: "", jid: `${s}@newsletter` };
  if (/^[A-Za-z0-9_-]{10,40}$/.test(s)) return { code: s, jid: "" };
  return { code: "", jid: "" };
}

/** Dig a channel JID / name / invite code out of any WhatsApp message object (no network needed) */
export function scanMessageForChannel(message) {
  const out = { jid: "", name: "", code: "" };
  const seen = new Set();
  const walk = (o, d) => {
    if (!o || typeof o !== "object" || d > 9 || seen.has(o) || ArrayBuffer.isView(o)) return;
    seen.add(o);
    for (const k of Object.keys(o)) {
      const v = o[k];
      if ((k === "forwardedNewsletterMessageInfo" || k === "newsletterAdminInviteMessage") && v && typeof v === "object") {
        const j = String(v.newsletterJid || "");
        if (!out.jid && NEWSLETTER_JID_RE.test(j)) {
          out.jid = j;
          out.name = String(v.newsletterName || "");
        }
        if (!out.code) {
          const inv = String(v.inviteCode || v.code || "");
          if (/^[A-Za-z0-9_-]{10,40}$/.test(inv)) out.code = inv;
        }
      } else if (typeof v === "string") {
        if (!out.code) { const c = parseChannelCode(v); if (c) out.code = c; }
        if (!out.jid) { const m = v.match(/(\d{10,24})@newsletter/); if (m) out.jid = `${m[1]}@newsletter`; }
      } else if (v && typeof v === "object") {
        walk(v, d + 1);
      }
    }
  };
  try { walk(message, 0); } catch {}
  return out;
}

// ---------- per-session persistent cache ----------
export function chCacheFile(sock) { return sf(sock, "channel-cache.json"); }
export function chCacheLoad(sock) {
  try {
    const d = readJson(chCacheFile(sock), {});
    return { byJid: (d && d.byJid) || {}, byCode: (d && d.byCode) || {} };
  } catch { return { byJid: {}, byCode: {} }; }
}
export function chCacheSave(sock, { jid, name, code }) {
  if (!jid || !NEWSLETTER_JID_RE.test(jid)) return;
  if (name) { try { channelNameCache.set(jid, name); } catch {} }
  try {
    const d = chCacheLoad(sock);
    const prev = d.byJid[jid] || {};
    const nm = name || prev.name || "";
    const cd = code || prev.code || "";
    d.byJid[jid] = { name: nm, code: cd, ts: Date.now() };
    if (cd) d.byCode[cd] = { jid, name: nm, ts: Date.now() };
    const trim = (o, n) => {
      const keys = Object.keys(o);
      if (keys.length > n) keys.sort((a, b) => (o[a].ts || 0) - (o[b].ts || 0)).slice(0, keys.length - n).forEach((k) => delete o[k]);
    };
    trim(d.byJid, 300); trim(d.byCode, 300);
    writeJson(chCacheFile(sock), d);
  } catch {}
}
export function chNameFromCache(sock, jid) {
  try {
    const n = chCacheLoad(sock).byJid[jid]?.name;
    if (n) return n;
    return channelNameCache.get(jid) || "";
  } catch { return ""; }
}

// ---------- payload decoding (JSON, gzip/deflate/brotli, or raw binary scan) ----------
export function chNodeContentToBuffer(c) {
  if (c == null) return null;
  if (Buffer.isBuffer(c)) return c;
  if (c instanceof Uint8Array) return Buffer.from(c);
  if (typeof c === "string") return Buffer.from(c, "utf8");
  return null;
}
export function chPick(v) {
  if (v && typeof v === "object") return String(v.text || v.value || "");
  return typeof v === "string" ? v : "";
}
export function chEntryFrom(o, id) {
  const tm = (o && (o.thread_metadata || o.threadMetadata)) || {};
  const subs = Number(o?.subscribers ?? o?.subscribers_count ?? tm.subscribers_count ?? tm.subscribers ?? 0);
  return {
    id,
    name: chPick(o?.name) || chPick(tm.name) || "",
    invite: String(o?.invite || tm.invite || ""),
    subscribers: Number.isFinite(subs) ? subs : 0
  };
}
/** Walk any object and collect every channel-looking entry {id,name,invite,subscribers} */
export function chDeepCollect(obj, out = [], seen = new Set(), depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 10 || seen.has(obj) || ArrayBuffer.isView(obj)) return out;
  seen.add(obj);
  if (Array.isArray(obj)) { for (const v of obj) chDeepCollect(v, out, seen, depth + 1); return out; }
  const id = [obj.id, obj.jid, obj.newsletterJid].find((x) => typeof x === "string" && NEWSLETTER_JID_RE.test(x));
  if (id) out.push(chEntryFrom(obj, id));
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    // map shaped like { "1203...@newsletter": {...} }
    if (NEWSLETTER_JID_RE.test(k) && v && typeof v === "object" && !Array.isArray(v) && !id) {
      const hasOwnId = [v.id, v.jid, v.newsletterJid].some((x) => typeof x === "string" && NEWSLETTER_JID_RE.test(x));
      if (!hasOwnId) out.push(chEntryFrom(v, k));
    }
    chDeepCollect(v, out, seen, depth + 1);
  }
  return out;
}
/** Deep search for a channel name in any JSON (name.text / name / newsletter_name / title) */
export function chFindNameDeep(obj, depth = 0, seen = new Set()) {
  if (!obj || typeof obj !== "object" || depth > 10 || seen.has(obj) || ArrayBuffer.isView(obj)) return "";
  seen.add(obj);
  if (!Array.isArray(obj)) {
    for (const k of ["name", "newsletter_name", "newsletterName", "title"]) {
      const v = chPick(obj[k]);
      if (v && v.trim()) return v.trim();
    }
  }
  for (const k of Object.keys(obj)) {
    const r = chFindNameDeep(obj[k], depth + 1, seen);
    if (r) return r;
  }
  return "";
}
export function chDecodePayload(buf) {
  const variants = [buf];
  for (const fn of [zlib.gunzipSync, zlib.inflateSync, zlib.inflateRawSync, zlib.brotliDecompressSync]) {
    try { const b = fn(buf); if (b && b.length) variants.push(b); } catch {}
  }
  let json = null, nameHint = "";
  const jids = new Set(), loose = new Set();
  for (const b of variants) {
    const t = b.toString("utf8");
    if (!json) {
      try { json = JSON.parse(t); } catch {
        const i = t.indexOf("{"), j = t.lastIndexOf("}");
        if (i >= 0 && j > i) { try { json = JSON.parse(t.slice(i, j + 1)); } catch {} }
      }
    }
    if (!nameHint) {
      const m = t.match(/"name"\s*:\s*\{\s*"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (m) { try { nameHint = JSON.parse(`"${m[1]}"`); } catch { nameHint = m[1]; } }
    }
    const l = b.toString("latin1");
    for (const s of [t, l]) {
      for (const m of s.matchAll(/(\d{12,24})@newsletter/g)) jids.add(`${m[1]}@newsletter`);
    }
    for (const m of l.matchAll(/(?<!\d)(120363\d{12})(?!\d)/g)) loose.add(`${m[1]}@newsletter`);
  }
  const channels = json ? chDeepCollect(json) : [];
  channels.forEach((c) => jids.add(c.id));
  if (!nameHint && json) nameHint = chFindNameDeep(json);
  return { json, channels, jids: [...jids], loose: [...loose].filter((x) => !jids.has(x)), nameHint, bytes: buf.length };
}

// ---------- raw frame sniffer: keeps the binary mex reply even when the library fails to parse it ----------
export function chStartSniffer(sock) {
  const frames = [];
  let stop = () => {};
  try {
    const ws = sock && sock.ws;
    if (ws && typeof ws.on === "function") {
      const onFrame = (f) => {
        try {
          if (f && typeof f === "object" && f.tag === "iq" && Array.isArray(f.content) &&
              f.content.some((c) => c && c.tag === "result" && c.content != null)) {
            frames.push(f);
            if (frames.length > 30) frames.shift();
          }
        } catch {}
      };
      ws.on("frame", onFrame);
      stop = () => { try { (ws.off || ws.removeListener).call(ws, "frame", onFrame); } catch {} };
    }
  } catch {}
  return { frames, stop };
}
export function chSniffSummary(frames) {
  const ids = new Map(), loose = new Set();
  let nameHint = "";
  for (const f of frames) {
    try {
      const res = f.content.find((c) => c && c.tag === "result");
      const buf = chNodeContentToBuffer(res && res.content);
      if (!buf) continue;
      const d = chDecodePayload(buf);
      d.channels.forEach((c) => { const p = ids.get(c.id); if (!p || (!p.name && c.name)) ids.set(c.id, c); });
      d.jids.forEach((j) => { if (!ids.has(j)) ids.set(j, { id: j, name: "", invite: "", subscribers: 0 }); });
      d.loose.forEach((j) => loose.add(j));
      if (d.nameHint && !nameHint) nameHint = d.nameHint;
    } catch {}
  }
  return { ids: [...ids.values()], loose: [...loose], nameHint };
}

// ---------- raw mex query (bypasses the library's strict JSON parser) ----------
export async function chRawMex(sock, queryId, variables, timeoutMs = 15000) {
  if (!sock || typeof sock.query !== "function") throw new Error("raw query is not available (sock.query missing)");
  const res = await chWithTimeout(sock.query({
    tag: "iq",
    attrs: { type: "get", to: "s.whatsapp.net", xmlns: "w:mex" },
    content: [{ tag: "query", attrs: { query_id: queryId }, content: Buffer.from(JSON.stringify({ variables }), "utf8") }]
  }), timeoutMs, "raw mex query");
  const child = Array.isArray(res && res.content) ? res.content.find((c) => c && c.tag === "result") : null;
  const buf = chNodeContentToBuffer(child && child.content);
  if (!buf) throw new Error("mex: empty result");
  const d = chDecodePayload(buf);
  if (d.json && Array.isArray(d.json.errors) && d.json.errors.length && !d.channels.length) {
    const er = d.json.errors[0] || {};
    throw new Error(`mex error ${er.extensions?.error_code || er.code || ""} ${er.message || ""}`.trim());
  }
  return d;
}

// ---------- followed channels ----------
export async function chFetchFollowed(sock) {
  const attempts = [];
  const found = new Map();
  const add = (arr) => {
    for (const e of arr || []) {
      if (!e || !e.id) continue;
      const p = found.get(e.id);
      if (!p) found.set(e.id, { ...e });
      else { if (!p.name && e.name) p.name = e.name; if (!p.invite && e.invite) p.invite = e.invite; if (!p.subscribers && e.subscribers) p.subscribers = e.subscribers; }
    }
  };
  const sniffer = chStartSniffer(sock);
  let source = "none";
  let liveOk = false;
  try {
    // 1) library functions
    for (const fn of ["newsletterSubscribed", "newsletterFetchAllParticipating"]) {
      if (typeof sock[fn] !== "function") continue;
      try {
        const data = await chWithTimeout(sock[fn](), 20000, fn);
        const arr = chDeepCollect(data);
        add(arr);
        attempts.push({ step: "library list", ok: true, n: arr.length });
        liveOk = true; source = "library";
        break;
      } catch (e) {
        attempts.push({ step: "library list", ok: false, err: chErrText(e), kind: chClassify(e) });
      }
    }
    const afterLibrary = chSniffSummary(sniffer.frames);

    // 2) raw mex query (library parser bypassed)
    if (!liveOk) {
      for (const qid of CH_MEX_SUBSCRIBED_IDS) {
        try {
          const d = await chRawMex(sock, qid, {});
          if (d.channels.length || d.jids.length) {
            add(d.channels.length ? d.channels : d.jids.map((id) => ({ id, name: "", invite: "", subscribers: 0 })));
            attempts.push({ step: "raw query", ok: true, n: found.size });
            liveOk = true; source = "raw";
            break;
          }
          attempts.push({ step: "raw query", ok: false, err: "empty reply", kind: "notfound" });
        } catch (e) {
          attempts.push({ step: "raw query", ok: false, err: chErrText(e), kind: chClassify(e) });
        }
      }
    }

    // 3) ids recovered from the raw binary reply the library choked on
    if (!found.size && !liveOk) {
      const ids = afterLibrary.ids.length ? afterLibrary.ids : afterLibrary.loose.map((id) => ({ id, name: "", invite: "", subscribers: 0 }));
      if (ids.length) {
        add(ids);
        source = "sniffed";
        attempts.push({ step: "raw reply scan", ok: true, n: ids.length });
      } else {
        attempts.push({ step: "raw reply scan", ok: false, err: "no JIDs in raw reply", kind: "notfound" });
      }
    }

    // 4) channels this bot already resolved / saw before (names + JIDs)
    if (!found.size && !liveOk) {
      const cache = chCacheLoad(sock);
      const cached = Object.entries(cache.byJid).map(([id, v]) => ({ id, name: v.name || "", invite: v.code || "", subscribers: 0 }));
      for (const [id, name] of channelNameCache.entries()) if (!cache.byJid[id]) cached.push({ id, name, invite: "", subscribers: 0 });
      if (cached.length) {
        add(cached);
        source = "cache";
        attempts.push({ step: "saved cache", ok: true, n: cached.length });
      } else {
        attempts.push({ step: "saved cache", ok: false, err: "nothing saved yet", kind: "notfound" });
      }
    }
  } finally {
    sniffer.stop();
  }

  const list = [...found.values()].map((e) => ({
    ...e,
    name: e.name || chNameFromCache(sock, e.id) || "Unknown Channel"
  }));
  list.sort((a, b) => a.name.localeCompare(b.name));
  if (source === "library" || source === "raw") {
    for (const e of list) chCacheSave(sock, { jid: e.id, name: e.name === "Unknown Channel" ? "" : e.name, code: e.invite });
  }
  return { list, attempts, source, liveOk };
}

// ---------- single channel lookup ----------
export const CH_SOURCE_LABEL = {
  input: "JID you provided",
  forwarded: "forwarded channel post (no lookup needed)",
  cache: "saved cache",
  library: "WhatsApp lookup",
  raw: "WhatsApp lookup (raw query)",
  followed: "your followed channels list",
  sniffed: "raw WhatsApp reply (recovered)"
};
export async function resolveChannelInfoCore(sock, { code = "", jid = "", nameHint = "", jidSource = "input" } = {}) {
  const attempts = [];
  const done = (o) => {
    chCacheSave(sock, { jid: o.jid, name: o.name, code: o.invite || code });
    return { attempts, code, subscribers: 0, invite: "", confidence: "exact", note: "", ...o, sourceLabel: CH_SOURCE_LABEL[o.source] || o.source };
  };

  // A) JID already known (typed by user, or taken from a forwarded post) — just try to add a name
  if (jid) {
    let name = nameHint || chNameFromCache(sock, jid);
    let meta = null;
    if (!name && typeof sock.newsletterMetadata === "function") {
      try {
        meta = chDeepCollect(await chWithTimeout(sock.newsletterMetadata("jid", jid), 12000, "name lookup"))[0] || null;
        name = (meta && meta.name) || "";
      } catch (e) {
        attempts.push({ step: "name lookup", ok: false, err: chErrText(e), kind: chClassify(e) });
      }
    }
    return done({ jid, name, subscribers: meta?.subscribers || 0, invite: meta?.invite || "", source: jidSource });
  }
  if (!code) throw Object.assign(new Error("no channel link, code or JID given"), { attempts, kind: "other" });

  // B) cache (JIDs never change for a channel)
  try {
    const c = chCacheLoad(sock).byCode[code];
    if (c && c.jid && Date.now() - (c.ts || 0) < CH_CACHE_TTL_MS) {
      return done({ jid: c.jid, name: c.name || "", source: "cache" });
    }
  } catch {}

  const sniffer = chStartSniffer(sock);
  let errRaw = null; // raw bytes the (patched) library attaches to its parse error
  try {
    // C) library lookup (retry once on transient problems)
    if (typeof sock.newsletterMetadata === "function") {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const raw = await chWithTimeout(sock.newsletterMetadata("invite", code), 20000, "channel lookup");
          const ch = chDeepCollect(raw)[0];
          if (!ch) throw new Error("empty response (no channel id)");
          attempts.push({ step: "library lookup", ok: true });
          return done({ jid: ch.id, name: ch.name, subscribers: ch.subscribers, invite: ch.invite || code, source: "library" });
        } catch (e) {
          const kind = chClassify(e);
          try { if (e && e.data && e.data.rawBase64) errRaw = Buffer.from(String(e.data.rawBase64), "base64"); } catch {}
          if (attempt === 2 || !["timeout", "closed", "ratelimit"].includes(kind)) {
            attempts.push({ step: "library lookup", ok: false, err: chErrText(e), kind });
            break;
          }
          await chSleep(kind === "ratelimit" ? 3000 : 1500);
        }
      }
    } else {
      attempts.push({ step: "library lookup", ok: false, err: "newsletterMetadata is not exposed by this Baileys build", kind: "unsupported" });
    }
    const afterLibrary = chSniffSummary(sniffer.frames);
    if (errRaw && !afterLibrary.ids.length) {
      try {
        const d = chDecodePayload(errRaw);
        d.channels.forEach((c) => afterLibrary.ids.push(c));
        d.jids.forEach((j) => { if (!afterLibrary.ids.some((x) => x.id === j)) afterLibrary.ids.push({ id: j, name: "", invite: "", subscribers: 0 }); });
        d.loose.forEach((j) => afterLibrary.loose.push(j));
        if (d.nameHint && !afterLibrary.nameHint) afterLibrary.nameHint = d.nameHint;
      } catch {}
    }

    // D) raw mex query with our own tolerant parser
    for (const qid of CH_MEX_METADATA_IDS) {
      try {
        const d = await chRawMex(sock, qid, {
          input: { key: code, type: "INVITE", view_role: "GUEST" },
          fetch_viewer_metadata: true, fetch_full_image: true, fetch_creation_time: true
        });
        const ch = d.channels[0] || (d.jids[0] ? { id: d.jids[0], name: d.nameHint || "", invite: "", subscribers: 0 } : null);
        if (ch) {
          if (!(ch.name || d.nameHint)) console.warn("[channeljid] raw reply had no name field:", JSON.stringify(d.json || {}).slice(0, 700));
          attempts.push({ step: "raw query", ok: true });
          return done({ jid: ch.id, name: ch.name || d.nameHint || "", subscribers: ch.subscribers, invite: ch.invite || code, source: "raw" });
        }
        attempts.push({ step: "raw query", ok: false, err: "reply had no channel id", kind: "notfound" });
      } catch (e) {
        attempts.push({ step: "raw query", ok: false, err: chErrText(e), kind: chClassify(e) });
      }
    }

    // E) match the invite code against channels this account already follows
    try {
      const fl = await chFetchFollowed(sock);
      const hit = fl.list.find((c) => c.invite && c.invite === code);
      if (hit) {
        attempts.push({ step: "followed list match", ok: true });
        return done({ jid: hit.id, name: hit.name === "Unknown Channel" ? "" : hit.name, subscribers: hit.subscribers, invite: code, source: "followed" });
      }
      attempts.push({ step: "followed list match", ok: false, err: fl.liveOk ? "this account does not follow that channel" : "list unavailable", kind: "notfound" });
    } catch (e) {
      attempts.push({ step: "followed list match", ok: false, err: chErrText(e), kind: chClassify(e) });
    }

    // F) last resort: the binary reply the library could not parse (only if it clearly points to ONE channel)
    if (afterLibrary.ids.length === 1) {
      const one = afterLibrary.ids[0];
      attempts.push({ step: "raw reply scan", ok: true });
      return done({
        jid: one.id, name: one.name || afterLibrary.nameHint || "", subscribers: one.subscribers, invite: code, source: "sniffed",
        confidence: "recovered", note: "Recovered from a binary reply the library could not parse. Please double-check this JID before relying on it."
      });
    }
    if (!afterLibrary.ids.length && afterLibrary.loose.length === 1) {
      attempts.push({ step: "raw reply scan", ok: true });
      return done({
        jid: afterLibrary.loose[0], name: afterLibrary.nameHint || "", invite: code, source: "sniffed",
        confidence: "low", note: "Low confidence: this ID was pulled from unreadable binary data. Verify it before using it."
      });
    }
    attempts.push({ step: "raw reply scan", ok: false, err: afterLibrary.ids.length > 1 ? "reply held several different channel IDs, refusing to guess" : "no channel ID found in raw reply", kind: "notfound" });
  } finally {
    sniffer.stop();
  }
  throw Object.assign(new Error("Channel lookup failed"), { attempts, kind: chPickKind(attempts) });
}

// ---------- name fallbacks ----------
export function chDecodeEntities(t) {
  return String(t || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ""; } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch { return ""; } })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
/** Read the public channel page (whatsapp.com/channel/<code>) and pull the name from its og:title */
export async function chNameFromWebPage(code) {
  if (!code) return "";
  try {
    const res = await axios.get(`https://whatsapp.com/channel/${encodeURIComponent(code)}`, {
      timeout: 9000,
      maxContentLength: 2 * 1024 * 1024,
      responseType: "text",
      validateStatus: (s) => s >= 200 && s < 400,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "Accept-Language": "en" }
    });
    const html = String(res.data || "");
    const m = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ||
              html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*property=["']og:title["']/i) ||
              html.match(/<title>([^<]*)<\/title>/i);
    let name = chDecodeEntities(m && m[1]).replace(/\s*[|\-–—]\s*WhatsApp( Channel)?\s*$/i, "").trim();
    if (!name || /^whatsapp( channel)?$/i.test(name)) return "";
    return name.slice(0, 120);
  } catch { return ""; }
}
/** Public entry: resolve a channel, then make sure it has a name (library by JID → public page) */
export async function resolveChannelInfo(sock, opts = {}) {
  const r = await resolveChannelInfoCore(sock, opts);
  if (!r.name) {
    const code = r.invite || r.code || opts.code || "";
    try {
      if (typeof sock.newsletterMetadata === "function") {
        const m = chDeepCollect(await chWithTimeout(sock.newsletterMetadata("jid", r.jid), 10000, "name lookup"))[0];
        if (m && m.name) { r.name = m.name; if (!r.subscribers) r.subscribers = m.subscribers || 0; }
      }
    } catch {}
    if (!r.name) r.name = await chNameFromWebPage(code);
    if (!r.name) console.warn("[channeljid] name not found for", r.jid, "via", r.source);
    if (r.name) chCacheSave(sock, { jid: r.jid, name: r.name, code });
  }
  return r;
}

// ---------- user-facing text ----------
export const CH_KIND_REASON = {
  parse: "WhatsApp answered in a binary / non-JSON format that this Baileys build cannot read (the channel query format changed on WhatsApp's side).",
  timeout: "WhatsApp did not answer in time.",
  ratelimit: "WhatsApp is rate-limiting channel lookups for this account.",
  closed: "The bot's WhatsApp connection was not ready / was closed during the request.",
  forbidden: "WhatsApp refused the request for this account.",
  unsupported: "This Baileys build does not expose the channel API needed for this.",
  notfound: "WhatsApp returned nothing for this channel. The link may be wrong, expired, reset by the admin, or the channel was removed / is unavailable.",
  other: "An unexpected error happened while asking WhatsApp."
};
export const CH_KIND_TIPS = {
  parse: [
    "Reply to ANY post forwarded from that channel with *.channeljid* — the JID is read straight from the message, no lookup needed.",
    "Or forward a post from the channel to this chat first, then reply to it with *.channeljid*.",
    "Follow the channel with the bot's number, then try *.channeljid <link>* again (a followed-list match may work even when the direct lookup is broken).",
    "Long-term fix: update the channel / mex query code inside your custom Baileys fork (newsletterMetadata)."
  ],
  timeout: ["Wait a minute and try again.", "If it keeps happening, restart the bot so the WhatsApp connection is refreshed."],
  ratelimit: ["Wait 1–2 minutes before trying again and avoid repeating the command.", "Replying to a forwarded channel post with *.channeljid* does not use any lookup."],
  closed: ["Wait until the bot shows as connected, then try again.", "Replying to a forwarded channel post with *.channeljid* works without a lookup."],
  forbidden: ["Try again later, or run the command from the main (older) account.", "Replying to a forwarded channel post with *.channeljid* works without a lookup."],
  unsupported: ["Reply to a forwarded post from the channel with *.channeljid* (works without the channel API).", "Add channel support to the Baileys fork (newsletterMetadata / newsletterSubscribed)."],
  notfound: [
    "Open the link in WhatsApp to confirm the channel still exists.",
    "Make sure you copied the full link: https://whatsapp.com/channel/XXXXXXXX",
    "Or reply to a forwarded post from that channel with *.channeljid*."
  ],
  other: ["Try again in a minute.", "Or reply to a forwarded post from that channel with *.channeljid*."]
};
export function chTriedLine(attempts = []) {
  const seen = new Set(), parts = [];
  for (const a of attempts) {
    const key = `${a.step}:${a.ok}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parts.push(`${a.step} ${a.ok ? "✔" : "✖"}`);
  }
  return parts.join(" · ");
}
export function chFailureText(title, err, extraLines = []) {
  const kind = (err && err.kind) || chClassify(err);
  const attempts = (err && err.attempts) || [];
  const firstErr = attempts.find((a) => !a.ok && a.err && a.err !== "nothing saved yet");
  const lines = [`❌ *${title}*`, "", `*Reason:* ${CH_KIND_REASON[kind] || CH_KIND_REASON.other}`];
  if (attempts.length) lines.push(`*Tried:* ${chTriedLine(attempts)}`);
  if (firstErr) lines.push(`*Details:* ${String(firstErr.err).slice(0, 160)}`);
  lines.push("", "*What you can do now:*");
  (CH_KIND_TIPS[kind] || CH_KIND_TIPS.other).forEach((t, i) => lines.push(`${i + 1}. ${t}`));
  extraLines.forEach((l) => lines.push(l));
  return lines.join("\n");
}
export function chFormatCard(r) {
  const lines = [`📣 *${r.name || "Channel"}*`, `🆔 ${r.jid}`];
  if (r.subscribers) lines.push(`👥 Followers: ${Number(r.subscribers).toLocaleString("en-US")}`);
  const inv = r.invite || r.code;
  if (inv) lines.push(`🔗 https://whatsapp.com/channel/${inv}`);
  if (r.confidence !== "exact" && r.note) lines.push("", `⚠️ ${r.note}`);
  return lines.join("\n");
}
/* ===================== end of channel JID resolver ===================== */
export function commandOwnerOnly(sock, msg, send) {
  if (!isOwner(sock, msg)) { send("❌ Owner only."); return false; }
  return true;
}
export function commandPrivileged(sock, msg, send) {
  if (!isPrivileged(sock, msg)) { send("❌ Owner/Sudo only."); return false; }
  return true;
}
export function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
}
export function extractUrl(text = "") {
  const m = String(text).match(/(https?:\/\/[^\s]+)/i);
  return m ? m[1].replace(/[)\]}>.,!?]+$/g, "") : null;
}

export function cleanTemp() {
  try {
    const files = fs.readdirSync(MEDIA_DIR);
    const now = Date.now();
    for (const f of files) {
      const p = path.join(MEDIA_DIR, f);
      const stat = fs.statSync(p);
      if (now - stat.mtimeMs > 10 * 60 * 1000) fs.rmSync(p, { force: true });
    }
  } catch {}
}
setInterval(cleanTemp, 5 * 60 * 1000);

// ==================== PREMIUM MENU ====================
export function menuText(msg, sock) {
  const prefix = getPrefix(sock);
  const uptime = formatUptime(process.uptime() * 1000);
  const name = msg.pushName || "User";
  const ownerName = readJson(sf(sock || "default", "owner-name.json"), { name: "Not Set" }).name || "Not Set";
  const botName = readJson(sf(sock || "default", "bot-name.json"), { name: "" }).name || "Joker-XD";
  const mode = getMode(sock);
  return `
┏┅┅┅┅┅┅┅┓
┇ 🃏*${botName}*
┗┅┅┅┅┅┅┅┛

✦ *Bot*       : ${botName}
✦ *Owner*     : ${ownerName}
✦ *Version*   : v2.0.7
✦ *Prefix*    : ${prefix === "" ? "none" : prefix}
✦ *Mode*      : ${mode}
✦ *User*      : @${name}
✦ *Uptime*    : ${uptime}
✦ *Developer* : 𝓩ₐᵢₙ ₘₐᵣₜₑₙ ⱼₒₖₑᵣ

─────────────
─────────────

┏━⚡ MAIN
┃ ➤ 📋 menu
┃ ➤ 🏓 ping
┃ ➤ 💚 alive
┃ ➤ ❓ help
┃ ➤ ⚙️ settings
┃ ➤ ⚙️ setting
┗━━━━━━━━━━━━━━━━

┏━🔗 SHARE BOT
┃ ➤ /connect
┃ ➤ /connect list
┃ ➤ /disconnect
┃ ➤ /disconnect all
┗━━━━━━━━━━━━━━━━

┏━🤖 AI
┃ ➤ 🧠 ai
┃ ➤ 🌐 translate
┃ ➤ 🎨 imagine
┃ ➤ 💬 chatbot
┗━━━━━━━━━━━━━━━━

┏━🃏 xd-Spam tools
┃ ➤ 🎯 jokersend
┃ ➤ 🏷️ jokertag
┃ ➤ 📢 jokerall
┃ ➤ 💣 bom
┃ ➤ 💣 bomall
┃ ➤ 💣 bomtag
┃ ➤ ⏹ stop
┃ ➤ 🆘 jokerhelp
┗━━━━━━━━━━━━━━━━

┏━👑 OWNER
┃ ➤ 🆔 jid
┃ ➤ 📋 alljid
┃ ➤ 📢 chjid
┃ ➤ 📢 chaneljid
┃ ➤ 🚫 ban
┃ ➤ ✅ unban
┃ ➤ 📋 banlist
┃ ➤ 🗑️ clearban
┃ ➤ 🚫 block
┃ ➤ ✅ unblock
┃ ➤ 📋 blocklist
┃ ➤ 📢 broadcast
┃ ➤ 👑 sudo
┃ ➤ ❌ delsudo
┃ ➤ 🔄 mode
┃ ➤ 🗑️ delete
┃ ➤ 👋 left
┃ ➤ ➕ join
┃ ➤ 📊 groups
┃ ➤ ➕ chatbotadd
┃ ➤ ❌ chatbotrem
┃ ➤ ✏️ setbotname
┃ ➤ ✏️ setownername
┃ ➤ 🔧 setprefix
┗━━━━━━━━━━━━━━━━

┏━👥 GROUP
┃ ➤ 🦵 kick
┃ ➤ 👢 kickall
┃ ➤ ⬆️ promote
┃ ➤ ⬇️ demote
┃ ➤ 📢 tagall
┃ ➤ 👑 admin
┃ ➤ 👥 members
┃ ➤ 🙈 hidetag
┃ ➤ 🔗 link
┃ ➤ 🔄 resetlink
┃ ➤ 🔓 open
┃ ➤ 🔒 close
┃ ➤ 📝 setdesc
┃ ➤ ✏️ setname
┃ ➤ 👋 welcome
┃ ➤ ✏️ setwelcome
┃ ➤ 👋 goodbye
┃ ➤ ✏️ setgoodbye
┃ ➤ 🚫 antilink
┃ ➤ 🚫 antichannel
┃ ➤ 🚫 antistic
┃ ➤ 🚫 antivoice
┃ ➤ 🚫 antipic
┃ ➤ 🚫 antivideo
┃ ➤ 🚫 antitext
┃ ➤ 🚫 antitag
┃ ➤ 🚫 antitagme
┃ ➤ 🤖 antibot
┃ ➤ 🛡️ antibug
┃ ➤ 🕵️ hidemybot
┃ ➤ 🔍 whois
┃ ➤ 🚫 antigroupmention / agm
┃ ➤ 📱 gstatus / togstatus
┃ ➤ 📱 xds / xd gstatus
┃ ➤ 🚫 antigroupstatus / ags
┃ ➤ 🛡️ antideletestatus
┃ ➤ 💾 save
┃ ➤ 📤 send
┃ ➤ 👀 autostatusview
┃ ➤ ❤️ react
┃ ➤ 👥 groupadd
┃ ➤ 🖼️ getpp
┃ ➤ 🖼️ gcpp / gcp
┃ ➤ ⚠️ warn
┃ ➤ ⚠️ setwarn
┃ ➤ 🔄 resetwarn
┃ ➤ ✅ allow
┃ ➤ ✅ approve
┃ ➤ ✅ approveall
┗━━━━━━━━━━━━━━━━

┏━📥 DOWNLOAD
┃ ➤ 🎵 song
┃ ➤ 🎬 video
┃ ➤ 🔍 yts
┃ ➤ 📘 facebook
┃ ➤ 🎵 fbaudio
┃ ➤ 📸 instagram
┃ ➤ 🎵 igaudio
┃ ➤ 🎵 tiktok
┃ ➤ 🎵 ttaudio
┃ ➤ 🐦 twitter
┃ ➤ 📌 pinterest
┃ ➤ 📌 pin
┃ ➤ 🔞 adultmenu
┗━━━━━━━━━━━━━━━━

┏━✨ AUTO
┃ ➤ 😊 autoreact
┃ ➤ 🔄 setreact
┃ ➤ 📱 autostatus
┃ ➤ 📖 autoread
┃ ➤ 🎙️ autorecord
┃ ➤ ⌨️ autotype
┃ ➤ 🎙️ autorectype
┃ ➤ 📶 alwaysonline
┃ ➤ 🗑️ antidelete
┃ ➤ ✏️ antiedit
┃ ➤ 📶 online
┃ ➤ 👀 lastseen
┗━━━━━━━━━━━━━━━━

┏━🔄 CONVERT
┃ ➤ 🎵 tomp3
┃ ➤ 🎤 tovoice
┃ ➤ 🖼️ sticker
┃ ➤ 🖼️ toimg
┃ ➤ 🎬 tovideo
┃ ➤ 📢 tts
┃ ➤ 🔗 url
┃ ➤ 📖 readmore
┗━━━━━━━━━━━━━━━━

══════════════
💡 Type ${prefix}help for short usage
🃏 JOKER-XD v2.0.5
`.trim();
}

export function helpText(prefix) {
  const p = prefix || ".";
  return `
*📖 HELP — short usage*

*MAIN*
• ${p}menu — full menu
• ${p}ping — bot speed
• ${p}alive — uptime / status
• ${p}help — this list

*SHARE BOT* (slash / only — Bot King / Owner / Developer)
• /connect <number> — pair a shared bot (pairing code)
• /connect list — list numbers you shared
• /disconnect <number> — remove *child* bot only (King never affected)
• /disconnect all — remove all *child* bots only (King never affected)

*AI*
• ${p}ai <question> — ask AI
• ${p}translate / tr <lang> <text>
• ${p}imagine <prompt> — AI image
• ${p}chatbot on|off — AI reply only on @mention or reply-to-bot (any mode)

*xd-Spam tools*
• ${p}jokersend [delay] jid text amount — spam target
• ${p}jokertag num [delay] jid text amount — tag+spam
• ${p}jokerall [delay] jid text amount — group hidetag spam
• ${p}bom [#delay] amount — reply spam (max 500)
• ${p}bom [#delay] message amount — text spam without reply
• ${p}bomall [#delay] amount|message amount — group hidetag spam
• ${p}bomtag [#delay] number amount|message amount — tag spam
• ${p}stop bom|ba|bt|all — stop running bom/joker jobs
• ${p}jokerhelp — full guide


*CONVERT*
• ${p}sticker / s — image/video/gif/sticker → sticker (Joker-xd)
• ${p}take Pack|Author — change sticker pack/author (either ok)
• ${p}tag <text> — delete cmd + silent hidetag (or reply any msg)
• ${p}setpp — set profile picture (owner, reply image)
• ${p}setpname <name> — set profile name (owner)
• ${p}hello on|off — auto-reply "how are you" to others' hello
• ${p}toimage — reply sticker → image
• ${p}tomp3 — reply video/audio → mp3
• ${p}tovoice / tov / topp — reply video/audio/voice → voice note
• ${p}tomp4 — reply sticker/image

*TOOLS*
• ${p}tts <text> — text to speech
• ${p}translate / tr <lang> <text> — translate
• ${p}url / upload — reply media → Catbox link
• ${p}readmore visible.hidden — spoiler (dot separator)
• ${p}define <word> — dictionary
• ${p}weather <city> — weather
• ${p}currency <amount> <from> <to> — exchange
• ${p}qr <text> — QR code image

*GROUP*
• ${p}kick / k / out / nikul / dufa / remove — kick member (reply/num)
• ${p}kickall — kick non-admins (owner)
• ${p}promote / toadmin — make admin
• ${p}demote / dismiss / tomember — remove admin
• ${p}tag — silent hidetag (text or reply any media/text/sticker/voice)
• ${p}tagall — tag all with numbers visible
• ${p}admin — tag only admins + numbers
• ${p}members — tag only members + numbers
• ${p}hidetag / ht — same as .tag (silent + reply support)
• ${p}link / resetlink — invite link
• ${p}open / close — unlock / lock group
• ${p}setdesc / setgroupname — edit group
• ${p}antilink warn|delete|kick|off — link protection (one mode, switches)
• ${p}antichannel warn|delete|kick|off — block forwarded channel posts
• ${p}antisticker|antipic|antivideo|antivoice|antitext warn|delete|kick|off
• ${p}antitag warn|delete|kick on|off — mass tag protection (visible + hidden tags)
• ${p}antitagme on|off|set text
• ${p}antibot warn|delete|kick|off — detect & punish other bots
• ${p}antibug on|warn|kick|off — crash/bug message shield
• ${p}hidemybot on|off|typing on|off — make this bot look like a phone user
• ${p}whois [number|@user|reply] — profile card
• ${p}antigroupmention / agm warn|delete|kick|off — anti group-status *mentions* only
• ${p}gstatus / togroupstatus / togstatus [jid] text|reply — post group status
• ${p}xds / xd gstatus [jid] <tiktok|yt|ig|fb link> — download video → group status
• ${p}antigroupstatus / ags warn|delete|kick|off — anti real group-status posts only
• ${p}antideletestatus / ads on|off — recover deleted group status/mention → your private
• ${p}save — reply group status/media → send to your private
• ${p}send — reply status/media → extract & send same content here
• ${p}autostatusview / asv on|off — auto-seen ALL status (personal + group + mentions)
• ${p}react / autostatusreact on|off — auto ❤️ ALL status types
• ${p}autoreact status on|off — same as status react via autoreact
• ${p}groupadd all|contacts|contact_blacklist — who can add bot to groups
• ${p}welcome on|off — enable/disable welcome for this group
• ${p}setwelcome <text> — set welcome template ({@username} {group})
• ${p}goodbye on|off — enable/disable goodbye for this group
• ${p}setgoodbye <text> — set goodbye template ({@username} {group})
• ${p}getpp — get user profile picture (reply/mention/number)
• ${p}gcpp / gcp — get current group profile picture + name
• ${p}warn — warn user (limit → kick)
• ${p}setwarn 1-5 — warn limit
• ${p}resetwarn / rw — clear warns
• ${p}allow — 1 free violation
• ${p}approve all — approve pending join requests up to the 1025-member ceiling
• ${p}approve <amount> — approve a specific number of pending requests

*DOWNLOAD* (direct media, no loading text)
• ${p}song <name/url> — YT audio
• ${p}play <name/url> — YT audio
• ${p}ytmp3 <name/url> — YT audio
• ${p}music <name/url> — YT audio
• ${p}video|ytmp4 <name/url> — YouTube video
• ${p}yts <query> — YouTube search
• ${p}facebook|fb <url> — Facebook video
• ${p}facebookaudio|fbaudio <url>
• ${p}instagram|ig|insta <url>
• ${p}instagramaudio|igaudio|instaaudio <url>
• ${p}tiktok|tt <url>
• ${p}tiktokaudio|ttaudio <url>
• ${p}twitter <url>
• ${p}pinterest <url>
• ${p}pin <amount> <query> — Pinterest pictures
• ${p}adultmenu — adult commands

*MEDIA*
• ${p}vv — open view-once here
• ${p}vv2 — view-once → owner DM (silent no-prefix reply)
• ${p}viewone / antiviewonce on|off|dm|here — auto view-once (Zain-style)
• ${p}gcp / gcpp / getpp — group / user photo
• ${p}setmenuimage — reply image as menu pic

*AUTO*
• ${p}autoreact all|dm|group|command on|off
• ${p}autoreact on|off — master switch
• ${p}setreact default|ai|all|custom <emojis>
• ${p}setreact ❤️🔥😂 — custom pool

• ${p}autorecord dm|group on|off
• ${p}autotype dm|group on|off
• ${p}autorecordtype dm|group on|off
• ${p}antidelete private|chat|off — recover deleted messages
• ${p}antiedit pm|chat|off — recover original text of edited messages (default ON → owner DM)

*MODE*
• ${p}mode public|dm|group|private

*OWNER*
• ${p}ban / unban / banlist / clearban
• ${p}block / unblock / blocklist
• ${p}broadcast / bc <msg> — list groups, reply *1,2,5* or *all*
• ${p}sudo / delsudo
• ${p}delete / del / det — reply delete; premium: .delete last N
• ${p}left / join <link> / groups
• ${p}jid / alljid / chjid / chaneljid
• ${p}chatbotadd / chatbotrem
• ${p}setbotname / setownername / setprefix
• ${p}online / lastseen

Developer prefix: *®* (always works)
`.trim();
}

export function jokerHelpText(prefix) {
  const p = prefix || ".";
  return `
*🃏 JOKER TOOLS GUIDE*

*Delay* (optional): #500ms → #72h
Examples: #500ms  #1sec  #2s  #1min

*${p}jokersend* — send text or media to a target
Without delay:
  ${p}jokersend (jid) (message) (amount)
With delay:
  ${p}jokersend #1sec (jid) (message) (amount)
Reply media:
  ${p}jokersend (jid) (amount)
  ${p}jokersend #1sec (jid) (amount)

*${p}jokertag* — tag a number while sending
Without delay:
  ${p}jokertag (number) (jid) (message) (amount)
With delay:
  ${p}jokertag (number) #1sec (jid) (message) (amount)
Reply media:
  ${p}jokertag (number) (jid) (amount)

*${p}jokerall* — hidetag everyone in a group
Without delay:
  ${p}jokerall (jid) (message) (amount)
With delay:
  ${p}jokerall #1sec (jid) (message) (amount)
Reply media:
  ${p}jokerall (jid) (amount)

*${p}stop* — cancel a running joker job
  ${p}stop js   — stop jokers
  ${p}stop jt   — stop jokertag
  ${p}stop ja   — stop jokerall
  ${p}stop all  — stop everything
Aliases: ${p}stopjs ${p}stopjt ${p}stopja

JID formats: number@g.us | number@s.whatsapp.net | number@lid
`.trim();
}


// ==================== STICKER ====================
/** Default sticker pack branding — Joker-XD */
export const STICKER_PACK_NAME = "Joker-xd";
export const STICKER_PACK_AUTHOR = "telegram Dev Martenzain";

/**
 * Inject WhatsApp sticker EXIF (pack name + author) into a WebP buffer.
 * Pure JS — no extra dependency required.
 */
export function addStickerExif(webpBuffer, packname = STICKER_PACK_NAME, author = STICKER_PACK_AUTHOR) {
  const json = JSON.stringify({
    "sticker-pack-id": "com.jokerxd.bot",
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
    "android-app-store-link": "https://t.me/martenzain",
    "ios-app-store-link": "https://t.me/martenzain",
    emojis: [""]
  });
  const jsonBuf = Buffer.from(json, "utf8");
  // EXIF header for WhatsApp stickers
  const exif = Buffer.concat([
    Buffer.from([
      0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
      0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]),
    jsonBuf
  ]);
  exif.writeUIntLE(jsonBuf.length, 14, 4);

  // Build a VALID extended WebP (VP8X + image data + EXIF).
  // WhatsApp shows a blank / "Can't view sticker information" sticker when the file has an EXIF chunk
  // but no VP8X header with the EXIF flag set — that was the cause of broken .s / .take stickers.
  if (!webpBuffer || webpBuffer.length < 20 ||
      webpBuffer.toString("ascii", 0, 4) !== "RIFF" || webpBuffer.toString("ascii", 8, 12) !== "WEBP") {
    return webpBuffer;
  }
  const chunks = [];
  let offset = 12;
  while (offset + 8 <= webpBuffer.length) {
    const fourcc = webpBuffer.toString("ascii", offset, offset + 4);
    const size = webpBuffer.readUInt32LE(offset + 4);
    const end = Math.min(offset + 8 + size, webpBuffer.length);
    chunks.push({ fourcc, data: webpBuffer.subarray(offset + 8, end) });
    offset += 8 + size + (size % 2);
  }
  const mkChunk = (fourcc, data) => {
    const head = Buffer.alloc(8);
    head.write(fourcc, 0, "ascii");
    head.writeUInt32LE(data.length, 4);
    return Buffer.concat([head, data, data.length % 2 ? Buffer.from([0]) : Buffer.alloc(0)]);
  };
  let vp8x = chunks.find((c) => c.fourcc === "VP8X");
  if (vp8x) {
    const d = Buffer.from(vp8x.data);
    d[0] |= 0x08; // EXIF present flag
    vp8x = { fourcc: "VP8X", data: d };
  } else {
    const img = chunks.find((c) => c.fourcc === "VP8 " || c.fourcc === "VP8L");
    if (!img) return webpBuffer;
    let w = 512, h = 512, alpha = false;
    const d = img.data;
    if (img.fourcc === "VP8 " && d.length >= 10) {
      w = d.readUInt16LE(6) & 0x3fff;
      h = d.readUInt16LE(8) & 0x3fff;
    } else if (img.fourcc === "VP8L" && d.length >= 5) {
      const bits = d.readUInt32LE(1);
      w = (bits & 0x3fff) + 1;
      h = ((bits >> 14) & 0x3fff) + 1;
      alpha = !!((bits >> 28) & 1);
    }
    if (chunks.some((c) => c.fourcc === "ALPH")) alpha = true;
    const v = Buffer.alloc(10);
    v[0] = 0x08 | (alpha ? 0x10 : 0);
    v.writeUIntLE(Math.max(0, w - 1), 4, 3);
    v.writeUIntLE(Math.max(0, h - 1), 7, 3);
    vp8x = { fourcc: "VP8X", data: v };
  }
  const rest = chunks.filter((c) => c.fourcc !== "VP8X" && c.fourcc !== "EXIF");
  const body = Buffer.concat([
    mkChunk("VP8X", vp8x.data),
    ...rest.map((c) => mkChunk(c.fourcc, c.data)),
    mkChunk("EXIF", exif)
  ]);
  const out = Buffer.alloc(12 + body.length);
  out.write("RIFF", 0);
  out.writeUInt32LE(body.length + 4, 4);
  out.write("WEBP", 8);
  body.copy(out, 12);
  return out;
}

/**
 * Make WhatsApp sticker from image / video / gif / existing sticker.
 * WhatsApp animated stickers must be WebP ≤512×512 (platform limit — not optional).
 */
export async function makeSticker(buffer, isVideo = false, packname = STICKER_PACK_NAME, author = STICKER_PACK_AUTHOR) {
  const id = makeId();
  const output = path.join(MEDIA_DIR, `${id}.webp`);
  const pack = packname || STICKER_PACK_NAME;
  const auth = author || STICKER_PACK_AUTHOR;

  // Magic-byte detect
  let ext = isVideo ? ".mp4" : ".jpg";
  let isAnim = !!isVideo;
  if (buffer.length >= 12) {
    if (buffer[0] === 0x89 && buffer[1] === 0x50) ext = ".png";
    else if (buffer[0] === 0xff && buffer[1] === 0xd8) ext = ".jpg";
    else if (buffer[0] === 0x47 && buffer[1] === 0x49) {
      ext = ".gif";
      isAnim = true;
    } else if (buffer.toString("ascii", 4, 8) === "ftyp") {
      ext = ".mp4";
      isAnim = true;
    } else if (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
      ext = ".webp";
      // animated webp (sticker) if ANIM/ANMF present
      if (
        buffer.includes(Buffer.from("ANIM")) ||
        buffer.includes(Buffer.from("ANMF"))
      ) {
        isAnim = true;
      }
    }
  }

  try {
    // Static image (not gif/webp-anim) → sharp first
    if (!isAnim && ext !== ".gif" && ext !== ".mp4") {
      try {
        // Keep static stickers under ~100 KB (WhatsApp refuses to render bigger ones)
        let webp = null;
        for (const q of [85, 70, 55, 40, 25]) {
          webp = await sharp(buffer)
            .rotate()
            .resize(512, 512, {
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp({ quality: q, effort: 2 })
            .toBuffer();
          if (webp.length <= 95 * 1024) break;
        }
        if (webp && webp.length > 50) {
          return addStickerExif(webp, pack, auth);
        }
      } catch (eSharp) {
        console.warn("[sticker] sharp failed, ffmpeg:", eSharp.message || eSharp);
      }
    }

    // Animated WebP (existing sticker) → sharp (ffmpeg cannot decode ANIM/ANMF)
    if (isAnim && ext === ".webp") {
      try {
        const meta = await sharp(buffer, { animated: true }).metadata();
        const pages = Math.max(1, meta.pages || 1);
        // Limit frames for WhatsApp (~6s @ 15fps)
        const maxPages = Math.min(pages, 90);
        const webp = await sharp(buffer, {
          animated: true,
          pages: maxPages
        })
          .resize(512, 512, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .webp({
            quality: 55,
            effort: 2,
            loop: 0,
            delay: meta.delay || 67 // ~15fps fallback
          })
          .toBuffer();
        if (webp && webp.length > 50) {
          return addStickerExif(webp, pack, auth);
        }
      } catch (eSharpAnim) {
        console.warn("[sticker] sharp animated webp failed:", eSharpAnim.message || eSharpAnim);
        // fall through to ffmpeg (will likely fail, but try)
      }
    }

    // Animated gif / video / fallback → ffmpeg
    const input = path.join(MEDIA_DIR, `${id}_in${ext}`);
    fs.writeFileSync(input, buffer);
    try {
      if (isAnim || ext === ".gif" || ext === ".mp4" || ext === ".webp") {
        // WhatsApp animated sticker: max ~512, short duration, webp
        // Note: ffmpeg native webp demuxer often fails on animated webp (ANIM/ANMF)
        await execAsync(
          `"${FFMPEG_PATH}" -y -i "${input}" -t 6 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" -c:v libwebp -lossless 0 -q:v 55 -loop 0 -an -fps_mode passthrough "${output}"`,
          { timeout: 90000, maxBuffer: 40 * 1024 * 1024 }
        );
      } else {
        await execAsync(
          `"${FFMPEG_PATH}" -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0" -c:v libwebp -lossless 0 -q:v 80 -an "${output}"`,
          { timeout: 45000, maxBuffer: 20 * 1024 * 1024 }
        );
      }
      if (!fs.existsSync(output) || fs.statSync(output).size < 100) {
        throw new Error(
          "Empty output — host ffmpeg may lack libwebp (need: apt install ffmpeg)"
        );
      }
      const webp = fs.readFileSync(output);
      return addStickerExif(webp, pack, auth);
    } finally {
      try {
        fs.rmSync(input, { force: true });
      } catch {}
      try {
        fs.rmSync(output, { force: true });
      } catch {}
    }
  } catch (e) {
    throw new Error("Sticker failed: " + (e.message || e));
  }
}

/** Mutex — only 1 conversion at a time */
export let _tovideoBusy = false;
export const _tovideoWaiters = [];
export function acquireTovideoLock() {
  return new Promise((resolve) => {
    if (!_tovideoBusy) {
      _tovideoBusy = true;
      resolve();
    } else {
      _tovideoWaiters.push(resolve);
    }
  });
}
export function releaseTovideoLock() {
  const next = _tovideoWaiters.shift();
  if (next) next();
  else _tovideoBusy = false;
}


/**
 * LOCAL method (Sharp frames → FFmpeg)
 * Joker-XD style — used by .tovideo / .tomp4
 * No size limit — original sticker width/height kept as-is.
 * Only makes dimensions even (libx264 / yuv420p requirement).
 */
export async function stickerToVideoLocal(buffer) {
  const id = makeId();
  const input = path.join(MEDIA_DIR, `${id}_sticker.webp`);
  const framesDir = path.join(MEDIA_DIR, `${id}_frames`);
  const output = path.join(MEDIA_DIR, `${id}_sticker.mp4`);
  fs.writeFileSync(input, buffer);
  fs.mkdirSync(framesDir, { recursive: true });
  try {
    const meta = await sharp(buffer, { animated: true }).metadata();
    const pages = Math.max(1, meta.pages || 1);
    const delays = meta.delay || [];
    let avgDelay = delays.length
      ? delays.reduce((a, b) => a + b, 0) / delays.length
      : 100;
    avgDelay = Math.max(20, Math.min(500, avgDelay));
    const fps = Math.max(5, Math.min(30, Math.round(1000 / avgDelay))) || 10;

    let written = 0;
    for (let i = 0; i < pages; i++) {
      const framePath = path.join(
        framesDir,
        `frame_${String(i).padStart(4, "0")}.jpg`
      );
      try {
        // Single page extract — avoids stacked full-animation height bug
        const pageMeta = await sharp(buffer, {
          page: i,
          animated: false
        }).metadata();
        let w = pageMeta.width || meta.width || 512;
        let h = pageMeta.height || meta.height || 512;

        // Even dimensions only (encoder need) — NO max size cap
        const ew = w % 2 === 0 ? w : w + 1;
        const eh = h % 2 === 0 ? h : h + 1;

        const frameBuf = await sharp(buffer, { page: i, animated: false })
          .resize(ew, eh, {
            fit: "fill",
            background: { r: 0, g: 0, b: 0, alpha: 1 }
          })
          .flatten({ background: { r: 0, g: 0, b: 0 } })
          .jpeg({ quality: 90 })
          .toBuffer();

        fs.writeFileSync(framePath, frameBuf);
        written++;
      } catch (fe) {
        console.warn(`[tovideo] frame ${i} skip:`, fe.message || fe);
      }
    }

    if (written < 1) throw new Error("local: no frames extracted");

    // Original size kept; only even scale for yuv420p
    const vf = "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p";
    await execAsync(
      `"${FFMPEG_PATH}" -y -framerate ${fps} -i "${framesDir}/frame_%04d.jpg" -vf "${vf}" -c:v libx264 -preset ultrafast -crf 23 -pix_fmt yuv420p -movflags +faststart -an "${output}"`,
      { timeout: 90000, maxBuffer: 80 * 1024 * 1024 }
    );
    if (!fs.existsSync(output) || fs.statSync(output).size < 200) {
      throw new Error("local: empty mp4");
    }
    return fs.readFileSync(output);
  } finally {
    try {
      fs.rmSync(input, { force: true });
    } catch {}
    try {
      fs.rmSync(output, { force: true });
    } catch {}
    try {
      fs.rmSync(framesDir, { recursive: true, force: true });
    } catch {}
  }
}

/** .tovideo / .tomp4 — local Sharp frames → FFmpeg (no size limit) */
export async function stickerToVideo(buffer) {
  await acquireTovideoLock();
  try {
    const buf = await stickerToVideoLocal(buffer);
    if (!buf || buf.length < 200) throw new Error("Sticker→video conversion failed");
    console.log("[tovideo] OK via local-sharp, size=", buf.length);
    return buf;
  } finally {
    releaseTovideoLock();
  }
}

/** Convert WebP sticker → PNG image (sharp first, ffmpeg fallback) */
export async function stickerToImageBuffer(buffer) {
  try {
    return await sharp(buffer)
      .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  } catch (e1) {
    const id = makeId();
    const input = path.join(MEDIA_DIR, `${id}_sticker.webp`);
    const output = path.join(MEDIA_DIR, `${id}_sticker.png`);
    fs.writeFileSync(input, buffer);
    try {
      await execAsync(
        `"${FFMPEG_PATH}" -y -i "${input}" -frames:v 1 "${output}"`,
        { timeout: 20000, maxBuffer: 10 * 1024 * 1024 }
      );
      if (!fs.existsSync(output) || fs.statSync(output).size < 100) {
        throw new Error("Sticker→image conversion failed");
      }
      return fs.readFileSync(output);
    } finally {
      try { fs.rmSync(input, { force: true }); } catch {}
      try { fs.rmSync(output, { force: true }); } catch {}
    }
  }
}

// ==================== JOKER-XD ADMIN HELPERS ====================
export function guessMime(fileName = "") {
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  const map = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif",
    mp4: "video/mp4", mkv: "video/x-matroska", webm: "video/webm", mov: "video/quicktime",
    mp3: "audio/mpeg", ogg: "audio/ogg", opus: "audio/ogg", m4a: "audio/mp4", aac: "audio/aac",
    pdf: "application/pdf", zip: "application/zip", bin: "application/octet-stream"
  };
  return map[ext] || "application/octet-stream";
}

/** Upload buffer to Catbox (primary) with multiple fallback hosts */
export async function uploadCatbox(buffer, fileName = "joker-xd.jpg") {
  if (!Buffer.isBuffer(buffer) || buffer.length < 10) throw new Error("Empty or invalid buffer");

  const mime = guessMime(fileName);
  const hosts = [
    { url: "https://catbox.moe/user/api.php", name: "catbox" },
    { url: "https://litterbox.catbox.moe/resources/internals/api.php", name: "litterbox", extra: { time: "72h" } },
    { url: "https://upload.satoru.click/user/api.php", name: "satoru" }
  ];

  let lastErr = null;
  for (const host of hosts) {
    try {
      const form = new FormData();
      form.append("reqtype", "fileupload");
      if (host.extra) {
        for (const [k, v] of Object.entries(host.extra)) form.append(k, v);
      }
      form.append("fileToUpload", buffer, { filename: fileName, contentType: mime });

      const res = await axios.post(host.url, form, {
        headers: form.getHeaders ? form.getHeaders() : { "Content-Type": "multipart/form-data" },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true
      });

      const url = String(res.data || "").trim();
      // Accept catbox, litterbox, satoru, files.catbox etc.
      if (res.status >= 200 && res.status < 300 && /^https?:\/\//i.test(url) && !url.includes("<html") && url.length < 500) {
        return url;
      }
      lastErr = new Error(`${host.name} returned: ${url.slice(0, 120) || res.status}`);
    } catch (e) {
      lastErr = e;
      console.warn(`[upload] ${host.name} failed:`, e.message || e);
    }
  }
  throw new Error("Upload failed on all hosts: " + (lastErr?.message || "unknown"));
}

/** Detect if a message (or its quoted content) is view-once */
export function isViewOncePayload(message) {
  const m = message || {};
  if (m.viewOnceMessage || m.viewOnceMessageV2 || m.viewOnceMessageV2Extension) return true;
  if (m.ephemeralMessage?.message) return isViewOncePayload(m.ephemeralMessage.message);
  if (m.documentWithCaptionMessage?.message) return isViewOncePayload(m.documentWithCaptionMessage.message);
  if (m.imageMessage?.viewOnce || m.videoMessage?.viewOnce || m.audioMessage?.viewOnce) return true;
  return false;
}

/** Unwrap nested WA message wrappers to the inner media message object */
export function unwrapMessage(message) {
  let m = message || {};
  for (let i = 0; i < 6; i++) {
    if (m.viewOnceMessage?.message) { m = m.viewOnceMessage.message; continue; }
    if (m.viewOnceMessageV2?.message) { m = m.viewOnceMessageV2.message; continue; }
    if (m.viewOnceMessageV2Extension?.message) { m = m.viewOnceMessageV2Extension.message; continue; }
    if (m.ephemeralMessage?.message) { m = m.ephemeralMessage.message; continue; }
    if (m.documentWithCaptionMessage?.message) { m = m.documentWithCaptionMessage.message; continue; }
    if (m.templateMessage?.hydratedTemplate?.hydratedContentMedia) {
      m = m.templateMessage.hydratedTemplate.hydratedContentMedia;
      continue;
    }
    break;
  }
  return m;
}

/** Human-readable chat label for view-once source (group name or DM number) */
export async function getChatLabel(sock, jid) {
  if (!jid) return "Unknown";
  try {
    if (isGroup(jid)) {
      const meta = await getCachedMeta(sock, jid).catch(() => null);
      if (meta?.subject) return `${meta.subject} (${jid})`;
      return `Group: ${jid}`;
    }
    const num = jidNumber(jid);
    return num ? `DM: +${num}` : `Chat: ${jid}`;
  } catch {
    return String(jid);
  }
}

/** Stream media via downloadContentFromMessage (Zain-style, more reliable for view-once) */
export async function streamToBuffer(mediaObj, type) {
  const stream = await downloadContentFromMessage(mediaObj, type);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  return buffer;
}

/** Open any view-once media (image / video / audio / sticker / document) → send payload
 *  Primary: downloadContentFromMessage (same as Zain antiviewonce)
 *  Fallback: downloadMediaMessage
 */
export async function openViewOnce(sock, sourceMsg) {
  const outer = sourceMsg.message || {};
  const vo = unwrapMessage(outer);
  const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
  const wrapped = { key: sourceMsg.key, message: vo };

  async function getBuf(mediaObj, type) {
    // Prefer Zain-style stream download (more reliable on view-once)
    try {
      const b = await streamToBuffer(mediaObj, type);
      if (b && b.length) return b;
    } catch (e) {
      console.warn("[viewonce] stream fail, fallback:", e.message || e);
    }
    try {
      const b = await downloadMediaMessage(wrapped, "buffer", {}, opts);
      if (b && b.length) return b;
    } catch (e2) {
      console.error("[viewonce] both download methods failed:", e2.message || e2);
    }
    return null;
  }

  if (vo.imageMessage) {
    const buf = await getBuf(vo.imageMessage, "image");
    if (!buf) return null;
    return { image: buf, caption: vo.imageMessage.caption || "" };
  }
  if (vo.videoMessage) {
    const buf = await getBuf(vo.videoMessage, "video");
    if (!buf) return null;
    const payload = { video: buf, caption: vo.videoMessage.caption || "" };
    if (vo.videoMessage.gifPlayback) payload.gifPlayback = true;
    return payload;
  }
  if (vo.audioMessage) {
    const buf = await getBuf(vo.audioMessage, "audio");
    if (!buf) return null;
    return {
      audio: buf,
      mimetype: vo.audioMessage.mimetype || "audio/ogg; codecs=opus",
      ptt: !!vo.audioMessage.ptt
    };
  }
  if (vo.stickerMessage) {
    const buf = await getBuf(vo.stickerMessage, "sticker");
    if (!buf) return null;
    return { sticker: buf };
  }
  if (vo.documentMessage) {
    const buf = await getBuf(vo.documentMessage, "document");
    if (!buf) return null;
    return {
      document: buf,
      mimetype: vo.documentMessage.mimetype || "application/octet-stream",
      fileName: vo.documentMessage.fileName || "file",
      caption: vo.documentMessage.caption || ""
    };
  }
  return null;
}


/**
 * Zain-style view-once media extraction.
 * Returns { mediaObj, type, ext, caption } or null.
 * Detects: viewOnceMessage / V2 / V2Extension + image/video/audio .viewOnce flag.
 */
export function extractViewOnceMedia(message) {
  if (!message) return null;
  const outer = message.ephemeralMessage?.message || message;
  const nested =
    outer.viewOnceMessageV2?.message ||
    outer.viewOnceMessageV2Extension?.message ||
    outer.viewOnceMessage?.message ||
    null;

  let mediaObj = null;
  let type = null;
  let ext = "bin";
  let caption = "";

  if (nested?.imageMessage) {
    mediaObj = nested.imageMessage; type = "image"; ext = "jpg"; caption = nested.imageMessage.caption || "";
  } else if (nested?.videoMessage) {
    mediaObj = nested.videoMessage; type = "video"; ext = "mp4"; caption = nested.videoMessage.caption || "";
  } else if (nested?.audioMessage) {
    mediaObj = nested.audioMessage; type = "audio"; ext = "ogg"; caption = "";
  } else if (outer.imageMessage?.viewOnce) {
    mediaObj = outer.imageMessage; type = "image"; ext = "jpg"; caption = outer.imageMessage.caption || "";
  } else if (outer.videoMessage?.viewOnce) {
    mediaObj = outer.videoMessage; type = "video"; ext = "mp4"; caption = outer.videoMessage.caption || "";
  } else if (outer.audioMessage?.viewOnce) {
    mediaObj = outer.audioMessage; type = "audio"; ext = "ogg"; caption = "";
  }

  if (!mediaObj || !type) return null;

  // Critical: empty mediaKey means WA never delivered the media bytes
  const mk = mediaObj.mediaKey;
  if (!mk || mk.length === 0) {
    console.log(`[ANTIVIEWONCE] view-once ${type} seen but mediaKey is EMPTY — WhatsApp did not deliver the media bytes to this linked device, cannot forward`);
    return null;
  }
  return { mediaObj, type, ext, caption };
}

/**
 * Early interceptor (Zain antiviewonce logic):
 * - Detect view-once on messages.upsert
 * - Stream-download media immediately
 * - If .antiviewonce / .viewone ON → forward to owner DM right away
 * - Always cache bytes in messageCache for reaction / anti-delete recovery
 */
/** WhatsApp "Read more" spacer — same trick as anti-delete (collapsed preview, tap to expand) */
export const VO_READ_MORE = "\n" + "\u200e".repeat(3500) + "\n";
/** "Private DM" or group name for view-once info messages */
export async function voFromLabel(sock, jid) {
  if (!String(jid || "").endsWith("@g.us")) return "Private DM";
  try {
    const meta = await sock.groupMetadata(jid);
    return meta?.subject || jid;
  } catch {
    return jid;
  }
}
export const voSeenIds = new Set();
export async function interceptViewOnce(sock, msg) {
  try {
    if (!msg?.message || msg.key?.fromMe) return;
    if (msg.key?.remoteJid === "status@broadcast") return;

    const extracted = extractViewOnceMedia(msg.message);
    if (!extracted) return;

    const { mediaObj, type, ext, caption } = extracted;
    const msgId = msg.key.id;
    if (!msgId) return;

    // Same message can arrive twice (notify + append / retry) — process once
    const voKey = mcKey(sock, msgId);
    if (voSeenIds.has(voKey)) return;
    voSeenIds.add(voKey);
    setTimeout(() => voSeenIds.delete(voKey), 10 * 60 * 1000);
    console.log(`[ANTIVIEWONCE] detected ${type} id=${msgId} from=${msg.key.participant || msg.key.remoteJid}`);

    // Stream download (same as Zain) — 3 tries, then downloadMediaMessage fallback
    let buffer = null;
    try {
      let lastErr = null;
      for (let attempt = 1; attempt <= 3 && !(buffer && buffer.length); attempt++) {
        try { buffer = await streamToBuffer(mediaObj, type); }
        catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 500 * attempt)); }
      }
      if (!buffer || !buffer.length) throw lastErr || new Error("empty buffer");
    } catch (e) {
      console.warn("[ANTIVIEWONCE] stream download failed:", e.message || e);
      // fallback
      try {
        const opts = { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage };
        const vo = unwrapMessage(msg.message || {});
        buffer = await downloadMediaMessage({ key: msg.key, message: vo }, "buffer", {}, opts);
      } catch (e2) {
        console.error("[ANTIVIEWONCE] both downloads failed:", e2.message || e2);
        return;
      }
    }
    if (!buffer || !buffer.length) {
      console.log("[ANTIVIEWONCE] empty buffer — skip");
      return;
    }

    // Persist to temp for recovery
    const tmpDir = path.join(process.cwd(), "temp", "viewonce");
    fs.mkdirSync(tmpDir, { recursive: true });
    const mediaPath = path.join(tmpDir, `${msgId}.${ext}`);
    try { fs.writeFileSync(mediaPath, buffer); } catch {}

    // Build sendable content
    let content = null;
    if (type === "image") content = { image: buffer, caption: caption || "" };
    else if (type === "video") content = { video: buffer, caption: caption || "" };
    else if (type === "audio") {
      content = {
        audio: buffer,
        mimetype: mediaObj.mimetype || "audio/ogg; codecs=opus",
        ptt: !!mediaObj.ptt
      };
    }

    // Cache always (for reaction open + anti-delete)
    messageCache.set(mcKey(sock, msgId), {
      msg,
      timestamp: Date.now(),
      isViewOnce: true,
      prebuilt: content,
      mediaPath,
      mediaType: type
    });
    if (messageCache.size > 1000) {
      const first = messageCache.keys().next().value;
      if (first) messageCache.delete(first);
    }

    // Config: viewonce.json { enabled, mode: "dm"|"here" }
    const voCfg = readJson(sf(sock, "viewonce.json"), { enabled: true, mode: "dm" });
    if (!voCfg.enabled || !content) {
      console.log(`[ANTIVIEWONCE] stored ${type} id=${msgId} (auto-forward OFF)`);
      return;
    }

    const jid = msg.key.remoteJid;
    const dest = voCfg.mode === "here" ? jid : privacyOwnerJid(sock);
    if (!dest) {
      console.warn("[ANTIVIEWONCE] no owner dest");
      return;
    }

    // Delay 5–7 seconds before displaying recovered view-once (any mode)
    await delay(5000 + Math.floor(Math.random() * 2001));

    const senderRaw = msg.key.participant || msg.key.remoteJid;
    const senderNum = jidNumber(senderRaw) || "?";
    const isGroup = String(jid || "").endsWith("@g.us");
    let groupName = "";
    if (isGroup) {
      try {
        const meta = await sock.groupMetadata(jid);
        groupName = meta?.subject || jid;
      } catch {
        groupName = jid;
      }
    }

    // Send media first (keep the sent message so the info can be a reply to it)
    const sentMedia = await sock.sendMessage(dest, content).catch((e) => {
      console.error("[ANTIVIEWONCE] send media error:", e.message || e);
      return null;
    });

    // Info message — replies to the forwarded media, collapsed behind "Read more"
    const timeStr = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });
    const fromLabel = isGroup ? groupName : "Private DM";
    let info =
      `*ANTIVIEWONCE Captured*` +
      VO_READ_MORE +
      `*Sender:* @${senderNum}\n` +
      `*From:* ${fromLabel}\n` +
      `*Time:* ${timeStr}`;
    if (caption) info += `\n*Caption:* ${caption}`;
    info += `\n\n> *Why you so serious*`;

    await sock.sendMessage(dest, {
      text: info,
      mentions: senderRaw ? [String(senderRaw).includes("@") ? senderRaw : `${senderNum}@s.whatsapp.net`] : []
    }, sentMedia ? { quoted: sentMedia } : undefined).catch(() => {});

    console.log(`[ANTIVIEWONCE] ✅ Forwarded ${type} from ${senderNum} → ${voCfg.mode}`);
  } catch (err) {
    if (!String(err?.message || "").includes("mediaKey") && !String(err?.message || "").includes("empty media")) {
      console.error("[ANTIVIEWONCE] interceptor error:", err.message || err);
    }
  }
}


/** Short / emoji aliases for vv2 — only when reply is on view-once */
export const VV2_ALIASES = new Set([
  "vv2", "rvo", "readvo", "reveal", "openvo",
  "👁️", "👀", "🔓", "📸", "🎥", "🖼️", "🕵️", "🔎"
]);


/** Resolve local menu image path (Joker-XD style). Prefer custom, then default assets. */
export function getMenuImagePath(sock) {
  // Per-session custom image first (sessions/<number>/data/menuimage.jpg), then the shared default.
  const own = sock ? sf(sock, "menuimage.jpg") : "";
  if (own && fs.existsSync(own) && fs.statSync(own).size > 0) return own;
  const def = path.join(process.cwd(), "assets", "menuimage.jpg");
  const defPng = path.join(process.cwd(), "assets", "menuimage.png");
  if (fs.existsSync(def) && fs.statSync(def).size > 0) return def;
  if (fs.existsSync(defPng) && fs.statSync(defPng).size > 0) return defPng;
  return null;
}

/** Send menu like Joker-XD: local image buffer + caption; text fallback */
export async function sendMenu(sock, msg, send) {
  const text = menuText(msg, sock);
  const imgPath = getMenuImagePath(sock);
  if (imgPath) {
    try {
      const buf = fs.readFileSync(imgPath);
      await sock.sendMessage(msg.key.remoteJid, { image: buf, caption: text }, { quoted: msg });
      return;
    } catch (e) {
      console.error("[menu-image]", e.message || e);
    }
  }
  // Optional: try stored Catbox URL once if local missing
  try {
    const imageUrl = readJson(sf(sock, "menu-image.json"), { url: "" }).url;
    if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
      const buf = await downloadUrlBuffer(imageUrl, 12000);
      await sock.sendMessage(msg.key.remoteJid, { image: buf, caption: text }, { quoted: msg });
      return;
    }
  } catch (e) {
    console.error("[menu-url]", e.message || e);
  }
  await send(text);
}
export async function getProfileImageBuffer(sock, jid) {
  // Robust PP fetch: try given jid, then PN form, then LID via onWhatsApp
  const candidates = [];
  const raw = String(jid || "");
  if (raw) candidates.push(raw);
  const num = jidNumber(raw);
  if (num) {
    candidates.push(`${num}@s.whatsapp.net`);
    candidates.push(`${num}@lid`);
  }
  const seen = new Set();
  for (const j of candidates) {
    if (!j || seen.has(j)) continue;
    seen.add(j);
    try {
      const url = await sock.profilePictureUrl(j, "image").catch(() => null);
      if (url) {
        const buf = await downloadUrlBuffer(url, 15000);
        if (buf && buf.length) return buf;
      }
    } catch {}
  }
  if (num) {
    try {
      const res = await sock.onWhatsApp(num).catch(() => []);
      const entry = Array.isArray(res) ? res[0] : null;
      const resolved = entry?.jid || entry?.lid;
      if (resolved && !seen.has(resolved)) {
        const url = await sock.profilePictureUrl(resolved, "image").catch(() => null);
        if (url) {
          const buf = await downloadUrlBuffer(url, 15000);
          if (buf && buf.length) return buf;
        }
      }
    } catch {}
  }
  return null;
}

// ==================== COMMANDS ====================
export async function requireGroupAdmin(sock, msg, send) {
  const jid = msg.key.remoteJid;
  if (!isGroup(jid)) {
    await send("❌ This command can only be used in groups.");
    return null;
  }
  const meta = await sock.groupMetadata(jid);
  const sender = msg.key.participant || msg.key.remoteJid;
  if (!isAdmin(meta, sender) && !isOwner(sock, msg)) {
    await send("❌ Group admins only.");
    return null;
  }
  return meta;
}

/** Per-session prefix (each paired bot keeps its own prefix on disk: sessions/{num}/data/prefix.json) */
export const _prefixCache = new Map();
export function getPrefix(sock) {
  const num = botNumberFromSock(sock) || "default";
  if (_prefixCache.has(num)) return _prefixCache.get(num);
  let p = process.env.PREFIX || ".";
  try {
    const c = readJson(sf(sock, "prefix.json"), null);
    if (c && typeof c.prefix === "string") p = c.prefix;
  } catch {}
  _prefixCache.set(num, p);
  return p;
}
export function setPrefix(sock, p) {
  const num = botNumberFromSock(sock) || "default";
  writeJson(sf(sock, "prefix.json"), { prefix: p });
  _prefixCache.set(num, p);
}
/** Session-scoped key for in-memory caches (so two bots in the same chat never share entries) */
export function mcKey(sock, id) { return `${botNumberFromSock(sock) || "default"}:${id}`; }

/** Active joker jobs that can be cancelled with .stop js|jt|ja */
export const activeJokerJobs = new Map(); // key: `${sessionKey}:${type}` → { stop: boolean }

export function getSessionKey(sock) {
  try {
    return sock?.user?.id?.split(":")[0] || sock?.authState?.creds?.me?.id?.split(":")[0] || "default";
  } catch {
    return "default";
  }
}

export function setJokerJob(sock, type, running) {
  const key = `${getSessionKey(sock)}:${type}`;
  if (running) activeJokerJobs.set(key, { stop: false });
  else activeJokerJobs.delete(key);
}

export function requestStopJoker(sock, type) {
  const key = `${getSessionKey(sock)}:${type}`;
  const job = activeJokerJobs.get(key);
  if (job) {
    job.stop = true;
    return true;
  }
  return false;
}

export function shouldStopJoker(sock, type) {
  const key = `${getSessionKey(sock)}:${type}`;
  return !!activeJokerJobs.get(key)?.stop;
}

export async function approveGroupRequests(sock, jid, requestedAmount = null) {
  if (typeof sock.groupRequestParticipantsList !== "function" || typeof sock.groupRequestParticipantsUpdate !== "function") {
    throw new Error("This Baileys build does not expose group join-request approval APIs.");
  }

  const meta = await sock.groupMetadata(jid);
  const currentMembers = Array.isArray(meta?.participants) ? meta.participants.length : 0;
  const initialPending = await sock.groupRequestParticipantsList(jid);
  const pendingBefore = Array.isArray(initialPending) ? initialPending.length : 0;
  const remainingSlots = Math.max(0, APPROVE_GROUP_LIMIT - currentMembers);

  if (requestedAmount !== null && (!Number.isInteger(requestedAmount) || requestedAmount < 1)) {
    throw new Error("Amount must be a positive whole number.");
  }

  let approved = 0;
  const target = requestedAmount === null ? Infinity : requestedAmount;

  // Refresh the pending list after every batch so .approve all continues
  // approving newly-visible requests until the group reaches the configured ceiling.
  while (approved < target) {
    const latest = await sock.groupRequestParticipantsList(jid);
    const pending = Array.isArray(latest) ? latest : [];
    if (!pending.length) break;

    const slotsLeft = Math.max(0, APPROVE_GROUP_LIMIT - (currentMembers + approved));
    if (slotsLeft <= 0) break;

    const take = Math.min(50, pending.length, slotsLeft, target - approved);
    const batch = pending.slice(0, take).map(x => x.jid || x.id).filter(Boolean);
    if (!batch.length) break;

    const result = await sock.groupRequestParticipantsUpdate(jid, batch, "approve");
    const success = Array.isArray(result)
      ? result.filter(r => String(r?.status || "200") === "200" && r?.jid).length
      : batch.length;
    approved += success;

    // Avoid looping forever if WhatsApp reports no successful approvals.
    if (success === 0) break;
  }

  const after = await sock.groupRequestParticipantsList(jid).catch(() => []);
  const pendingLeft = Array.isArray(after) ? after.length : Math.max(0, pendingBefore - approved);
  const finalMembers = Math.min(APPROVE_GROUP_LIMIT, currentMembers + approved);

  return {
    currentMembers,
    finalMembers,
    pendingBefore,
    approved,
    pendingLeft,
    full: finalMembers >= APPROVE_GROUP_LIMIT
  };
}
