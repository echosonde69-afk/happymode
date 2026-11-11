// Joker-XD .seeweb engine — turns a web page into ONE self-contained, view-only HTML string
// that can be sent through the embedded-HTML message (same way the mini-games are sent).
//   * scripts, iframes, forms, file inputs, downloads, event handlers and network access are removed
//   * CSS is inlined, a few images are shrunk and embedded as data: URIs
//   * the result is kept small (SEEWEB_MAX_KB, default 90 KB)
import dns from "node:dns";
import net from "node:net";
import http from "node:http";
import https from "node:https";

const UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";
const ALLOWED_PORTS = new Set(["", "80", "443", "8080", "8443"]);

// ---------------------------------------------------------------- safe network (SSRF protection)
export function isPrivateIp(ip) {
  ip = String(ip || "").toLowerCase();
  if (ip.startsWith("::ffff:") && net.isIPv4(ip.slice(7))) ip = ip.slice(7);
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) ||
      (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19));
  }
  if (net.isIPv6(ip)) {
    return ip === "::" || ip === "::1" || ip.startsWith("fc") || ip.startsWith("fd") ||
      ip.startsWith("fe8") || ip.startsWith("fe9") || ip.startsWith("fea") || ip.startsWith("feb");
  }
  return true;
}

function safeLookup(hostname, options, cb) {
  if (typeof options === "function") { cb = options; options = {}; }
  dns.lookup(hostname, { ...options, all: true }, (err, addrs) => {
    if (err) return cb(err);
    const ok = (addrs || []).filter((a) => !isPrivateIp(a.address));
    if (!ok.length) return cb(new Error("Blocked: address is private / local"));
    if (options && options.all) return cb(null, ok);
    cb(null, ok[0].address, ok[0].family);
  });
}

function checkUrl(u) {
  let url;
  try { url = new URL(u); } catch { throw new Error("Invalid link"); }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only http/https links");
  if (!ALLOWED_PORTS.has(url.port)) throw new Error("Port not allowed");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && isPrivateIp(host)) throw new Error("Blocked: private / local address");
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) throw new Error("Blocked: local address");
  return url;
}

const httpAgent = new http.Agent({ lookup: safeLookup, keepAlive: false });
const httpsAgent = new https.Agent({ lookup: safeLookup, keepAlive: false });

/** GET with manual redirects (each hop re-checked). Returns { buf, type, url } */
export async function safeGet(startUrl, { maxBytes = 2 * 1024 * 1024, timeout = 12000 } = {}) {
  const { default: axios } = await import("axios");
  let current = startUrl;
  for (let hop = 0; hop < 5; hop++) {
    const url = checkUrl(current);
    const res = await axios.get(url.href, {
      responseType: "arraybuffer",
      timeout,
      maxRedirects: 0,
      maxContentLength: maxBytes,
      maxBodyLength: maxBytes,
      httpAgent, httpsAgent,
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,text/css,image/*;q=0.8,*/*;q=0.5", "Accept-Language": "en-US,en;q=0.8" },
      validateStatus: (s) => s < 400
    });
    if (res.status >= 300 && res.status < 400 && res.headers.location) {
      current = new URL(res.headers.location, url).href;
      continue;
    }
    return { buf: Buffer.from(res.data), type: String(res.headers["content-type"] || ""), url: url.href };
  }
  throw new Error("Too many redirects");
}

function decodeText(buf, type) {
  const m = /charset=["']?([\w-]+)/i.exec(type || "") || /<meta[^>]+charset=["']?([\w-]+)/i.exec(buf.subarray(0, 2048).toString("latin1"));
  const label = (m && m[1]) || "utf-8";
  try { return new TextDecoder(label).decode(buf); } catch { return buf.toString("utf8"); }
}

export const defaultIO = {
  async text(url, maxBytes) {
    const r = await safeGet(url, { maxBytes });
    return { text: decodeText(r.buf, r.type), type: r.type, url: r.url };
  },
  async img(url) {
    const r = await safeGet(url, { maxBytes: 3 * 1024 * 1024, timeout: 8000 });
    const { default: sharp } = await import("sharp");
    const out = await sharp(r.buf, { failOn: "none" })
      .resize({ width: 480, withoutEnlargement: true })
      .jpeg({ quality: 50, mozjpeg: true })
      .toBuffer();
    return `data:image/jpeg;base64,${out.toString("base64")}`;
  }
};

// ---------------------------------------------------------------- html helpers
const ATTR_VAL = `("[^"]*"|'[^']*'|[^\\s>]+)`;
const unq = (v) => String(v || "").replace(/^["']|["']$/g, "");
function getAttr(tag, name) {
  const m = new RegExp(`\\s${name}\\s*=\\s*${ATTR_VAL}`, "i").exec(tag);
  return m ? unq(m[1]).replace(/&amp;/g, "&").trim() : "";
}
function absUrl(u, base) { try { return new URL(u, base).href; } catch { return ""; } }
const byteLen = (s) => Buffer.byteLength(s, "utf8");
const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function cleanCss(css) {
  return String(css || "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/@import[^;]*;/gi, "")
    .replace(/@font-face\s*\{[^}]*\}/gi, "")
    .replace(/url\(\s*(?!['"]?data:)[^)]*\)/gi, "none")
    .replace(/<\/style/gi, "<\\/style");
}
function capCss(css, max) {
  if (css.length <= max) return css;
  const cut = css.lastIndexOf("}", max);
  return css.slice(0, cut > 0 ? cut + 1 : max);
}

function stripActive(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|noscript|iframe|object|embed|template|svg|canvas|audio|video|picture|source|dialog)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|iframe|object|embed|source|track|input\b[^>]*type\s*=\s*["']?file)[^>]*>/gi, "")
    .replace(/<meta\b[^>]*http-equiv[^>]*>/gi, "")
    .replace(/<base\b[^>]*>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, (s) => `<style>${cleanCss(s.replace(/<\/?style[^>]*>/gi, ""))}</style>`)
    .replace(/<form\b/gi, "<div").replace(/<\/form\s*>/gi, "</div>")
    .replace(new RegExp(`\\son[a-z]+\\s*=\\s*${ATTR_VAL}`, "gi"), "")
    .replace(new RegExp(`\\s(download|ping|formaction|action|srcdoc|target)\\s*=\\s*${ATTR_VAL}`, "gi"), "")
    .replace(/\sdownload(?=[\s>\/])/gi, "")
    .replace(new RegExp(`\\shref\\s*=\\s*${ATTR_VAL}`, "gi"), "") // links are not clickable (view only)
    .replace(/<\/?(button)\b[^>]*>/gi, (t) => (t[1] === "/" ? "</span>" : "<span>"));
}

async function inlineImages(html, base, io, maxImages) {
  const tags = html.match(/<img\b[^>]*>/gi) || [];
  const map = new Map();
  let done = 0;
  for (const tag of tags) {
    if (map.has(tag)) continue;
    if (done >= maxImages) { map.set(tag, ""); continue; }
    let src = getAttr(tag, "src") || getAttr(tag, "data-src") || getAttr(tag, "data-original");
    if (!src) {
      const ss = getAttr(tag, "srcset") || getAttr(tag, "data-srcset");
      if (ss) src = ss.split(",")[0].trim().split(/\s+/)[0];
    }
    if (!src || src.startsWith("data:")) { map.set(tag, src ? tag : ""); continue; }
    const abs = absUrl(src, base);
    if (!abs || /\.(svg|gif|ico)(\?|$)/i.test(abs)) { map.set(tag, ""); continue; }
    try {
      const data = await io.img(abs);
      const alt = getAttr(tag, "alt");
      map.set(tag, `<img src="${data}" alt="${escHtml(alt)}" style="max-width:100%;height:auto">`);
      done++;
    } catch { map.set(tag, ""); }
  }
  return html.replace(/<img\b[^>]*>/gi, (t) => map.get(t) ?? "");
}

function wrapPage(bodyHtml, headExtra, title, host, note) {
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">`;
  const base = `<style>html,body{margin:0;padding:0}body{word-wrap:break-word;overflow-wrap:anywhere;font-family:system-ui,sans-serif;line-height:1.45}img{max-width:100%;height:auto}table{max-width:100%}pre{white-space:pre-wrap}` +
    `.jx-bar{position:sticky;top:0;z-index:99;background:#111;color:#fff;font:12px system-ui;padding:6px 10px;display:flex;justify-content:space-between;gap:8px}.jx-bar b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}</style>`;
  const bar = `<div class="jx-bar"><b>🌐 ${escHtml(host)}</b><span>view only${note ? " · " + escHtml(note) : ""}</span></div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${csp}<title>${escHtml(title)}</title>${base}${headExtra}</head><body>${bar}${bodyHtml}</body></html>`;
}

// ---------------------------------------------------------------- main
/**
 * @returns {Promise<{html:string, title:string, host:string, bytes:number, note:string}>}
 */
export async function renderPage(inputUrl, { io = defaultIO, maxKB = Number(process.env.SEEWEB_MAX_KB) || 90, maxImages = 6, maxCss = 3 } = {}) {
  const first = checkUrl(inputUrl);
  const page = await io.text(first.href, 2 * 1024 * 1024);
  if (page.type && !/html|xml|text\/plain/i.test(page.type)) throw new Error(`Not a web page (${page.type.split(";")[0] || "unknown type"})`);
  const baseUrl = page.url || first.href;
  const host = new URL(baseUrl).hostname;
  const raw = page.text;
  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(raw)?.[1] || host).replace(/&amp;/g, "&").replace(/\s+/g, " ").trim().slice(0, 120);

  // 1) stylesheets (from the ORIGINAL html, before <link> tags are stripped)
  let css = "";
  const links = (raw.match(/<link\b[^>]*>/gi) || []).filter((t) => /rel\s*=\s*["']?[^"'>]*stylesheet/i.test(t));
  for (const t of links.slice(0, maxCss)) {
    const href = absUrl(getAttr(t, "href"), baseUrl);
    if (!href) continue;
    try {
      const r = await io.text(href, 600 * 1024);
      css += capCss(cleanCss(r.text), 50 * 1024) + "\n";
    } catch { /* skip stylesheet */ }
  }

  // 2) body
  let bodyMatch = /<body[^>]*>([\s\S]*?)(<\/body>|$)/i.exec(raw);
  let body = stripActive(bodyMatch ? bodyMatch[1] : raw.replace(/<head[\s\S]*?<\/head>/i, ""));
  const bodyNoImg = body.replace(/<img\b[^>]*>/gi, "");
  const bodyWithImg = await inlineImages(body, baseUrl, io, maxImages);

  const limit = maxKB * 1024;
  const attempts = [
    { b: bodyWithImg, c: css, note: "" },
    { b: bodyNoImg, c: css, note: "no images" },
    { b: bodyNoImg, c: capCss(css, 20 * 1024), note: "no images" }
  ];
  for (const a of attempts) {
    const html = wrapPage(a.b, a.c ? `<style>${a.c}</style>` : "", title, host, a.note);
    if (byteLen(html) <= limit) return { html, title, host, bytes: byteLen(html), note: a.note };
  }
  // 3) still too big → cut the text (always at a tag boundary)
  const last = attempts[2];
  const overhead = byteLen(wrapPage("", last.c ? `<style>${last.c}</style>` : "", title, host, "shortened"));
  let room = Math.max(4000, limit - overhead - 200);
  let cut = last.b;
  while (byteLen(cut) > room) cut = cut.slice(0, Math.floor(cut.length * 0.9));
  const gt = cut.lastIndexOf(">");
  if (gt > 0) cut = cut.slice(0, gt + 1);
  const html = wrapPage(cut + `<p style="padding:8px;color:#888">… page shortened to fit WhatsApp</p>`, last.c ? `<style>${last.c}</style>` : "", title, host, "shortened");
  return { html, title, host, bytes: byteLen(html), note: "shortened" };
}
