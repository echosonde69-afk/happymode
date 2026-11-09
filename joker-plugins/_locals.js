// Block-scoped helpers that used to live inside executeCommand (they close over sock/msg/jid/send...).
// Plugins read them through __ctx.locals.
import { ADULT_MAX_AMOUNT, STICKER_PACK_AUTHOR, STICKER_PACK_NAME, adultAskMode, adultBlockedQuery, adultSendList, adultSendVideo, commandPrivileged, extractUrl, getAutoReactConfig, getMode, getPrefix, getWarnLimit, isAdmin, isGroup, isPrivileged, parseOnOff, readJson, saveAutoReactConfig, sf, writeJson } from "../core/helpers.js";

export function makeLocals(__ctx) {
  const { sock, msg, prefix, cmd, args, jid, send, react } = __ctx;
  const DEFAULT_WELCOME =
    "*🃏 Joker-XD welcome* {@username}\n\n" +
    "*Group:* {group}\n" +
    "*You're our {count}th member!*\n" +
    "*Join time:* {time}\n\n" +
    "Cause chaos its always fun\n\n> ©Joker-XD";

  const DEFAULT_GOODBYE =
    "*👋 Goodbye* 😪 {@username}\n\n" +
    "*Left at:* {time}\n" +
    "*We're now {count} members.*\n\n> ©Joker-XD";

  const WELCOME_HINT =
    `📝 *Set custom welcome*\n\n` +
    `Usage:\n.setwelcome your text here\n\n` +
    `*Placeholders (copy any):*\n` +
    `• {@username} — mention user\n` +
    `• {group} — group name\n` +
    `• {count} — current members\n` +
    `• {time} — join time\n\n` +
    `Example:\n.setwelcome Welcome {@username} to {group}! Members: {count}`;

  async function handlePresenceCommand(feature,label){
    if(!commandPrivileged(sock,msg,send)) return true;
    const sub=String(args[0]||"").toLowerCase(), value=parseOnOff(args[1]), cfg=getAutoReactConfig(sock), x=cfg[feature];
    if((sub==="dm"||sub==="chat")&&value!==null){x.dm=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} DM: *${value?"ON":"OFF"}*`);return true;}
    if(sub==="group"&&value!==null){
      if(!isGroup(jid)){await send(`❌ .${cmd} group on/off — use this in a group only.`);return true;}
      x.groups[jid]=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} this group: *${value?"ON":"OFF"}*`);return true;
    }
    if(sub==="all"&&value!==null){x.all=value;x.dm=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} ALL: *${value?"ON":"OFF"}*`);return true;}
    if(sub==="on"||sub==="off"){x.all=sub==="on";x.dm=x.all;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} ALL: *${x.all?"ON":"OFF"}*`);return true;}
    await send(`.${cmd} dm on/off | group on/off | all on/off`);return true;
  }

  function settingsText(sock, jid) {
    const prefixValue = getPrefix(sock);
    const prefixDisplay = prefixValue === "" ? "NONE" : prefixValue;
    const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || sock.user?.name || "Joker-XD";
    const ownerName = readJson(sf(sock, "owner-name.json"), { name: "Not Set" }).name || "Not Set";
    const mode = getMode(sock);

    const antiFiles = [
      ["ANTILINK", "antilink.json", "🔗"],
      ["ANTISTICKER", "antisticker.json", "🚫"],
      ["ANTIVOICE", "antivoice.json", "🎤"],
      ["ANTIPICTURE", "antipicture.json", "🖼️"],
      ["ANTIVIDEO", "antivideo.json", "🎬"],
      ["ANTITEXT", "antitext.json", "💬"],
      ["ANTITAG", "antitag.json", "🏷️"],
      ["AGM", "agm.json", "📢"],
      ["ANTIGROUPSTATUS", "antigroupstatus.json", "📱"],
      ["ANTICHANNEL", "antichannel.json", "📡"]
    ];
    const groupOnly = !isGroup(jid);
    const antiValues = antiFiles.map(([label, file]) => {
      const cfg = readJson(sf(sock, file), {});
      const raw = cfg[jid];
      const value = file === "antigroupstatus.json" && raw && typeof raw === "object"
        ? (raw.enabled ? String(raw.action || "warn") : "off")
        : String(raw || "off");
      return { label, value: groupOnly ? "GROUP" : value.toUpperCase() };
    });

    const antiTagMe = readJson(sf(sock, "antitagme.json"), { enabled: false, text: "I'm busy" });
    const warnLimit = getWarnLimit(sock);

    const react = getAutoReactConfig(sock);
    const reactGroup = isGroup(jid) ? (react.groups[jid] ? "ON" : "OFF") : "N/A";
    const recordGroup = isGroup(jid) ? (react.record.groups[jid] ? "ON" : "OFF") : "N/A";
    const typeGroup = isGroup(jid) ? (react.type.groups[jid] ? "ON" : "OFF") : "N/A";
    const recordTypeGroup = isGroup(jid) ? (react.recordtype.groups[jid] ? "ON" : "OFF") : "N/A";

    const viewOnce = readJson(sf(sock, "viewonce.json"), { enabled: true, mode: "dm" });
    const antiDelete = readJson(sf(sock, "antidelete.json"), { enabled: true, mode: "private" });
    const antiEdit = readJson(sf(sock, "antiedit.json"), { enabled: true, mode: "private" });

    // .rools/.rules/.allanti controls these eight anti modes together.
    const antiModeSet = antiValues.map(x => x.value).filter(v => v !== "GROUP");
    const combinedAnti = groupOnly ? "GROUP ONLY" :
      (antiModeSet.length && antiModeSet.every(v => v === antiModeSet[0]) ? antiModeSet[0] : "MIXED");

    // Always-online is maintained by the connected-session keep-alive.
    const alwaysOnline = sock?.__presenceInterval ? "ON" : "ON (SESSION)";
    const lastSeen = "WHATSAPP PRIVACY";

    const welcomeCfg = isGroup(jid) ? readJson(sf(sock, "welcome.json"), {})[jid] : null;
    const goodbyeCfg = isGroup(jid) ? readJson(sf(sock, "goodbye.json"), {})[jid] : null;
    const welcomeOn = welcomeCfg === true || (typeof welcomeCfg === "object" && welcomeCfg?.enabled);
    const goodbyeOn = goodbyeCfg === true || (typeof goodbyeCfg === "object" && goodbyeCfg?.enabled);
    const helloCfg = readJson(sf(sock, "hello.json"), { enabled: false });

    const lines = [
      "┏━ ⚙️ *JOKER-XD SETTINGS*",
      "┃",
      "┃ 🔗 *ANTILINK*       : " + antiValues[0].value,
      "┃ 🚫 *ANTISTICKER*    : " + antiValues[1].value,
      "┃ 🎤 *ANTIVOICE*      : " + antiValues[2].value,
      "┃ 🖼️ *ANTIPICTURE*    : " + antiValues[3].value,
      "┃ 🎬 *ANTIVIDEO*      : " + antiValues[4].value,
      "┃ 💬 *ANTITEXT*       : " + antiValues[5].value,
      "┃ 🏷️ *ANTITAG*        : " + antiValues[6].value,
      "┃ 📢 *AGM*            : " + antiValues[7].value,
      "┃ 📡 *ANTICHANNEL*    : " + antiValues[9].value,
      "┃ 🏷️ *ANTITAGME*      : " + (antiTagMe.enabled ? "ON" : "OFF"),
      "┃ ⚠️ *WARN LIMIT*     : " + warnLimit,
      "┃ 🔁 *ALL ANTI*       : " + combinedAnti,
      "┃",
      "┃ 👋 *WELCOME*        : " + (isGroup(jid) ? (welcomeOn ? "ON" : "OFF") : "GROUP ONLY"),
      "┃ 👋 *GOODBYE*        : " + (isGroup(jid) ? (goodbyeOn ? "ON" : "OFF") : "GROUP ONLY"),
      "┃ 💬 *HELLO REPLY*    : " + (helloCfg.enabled ? "ON" : "OFF"),
      "┃",
      "┃ 😊 *AUTOREACT*      : " + (react.enabled ? "ON" : "OFF"),
      "┃ 🌐 *REACT ALL*      : " + (react.all ? "ON" : "OFF"),
      "┃ 💬 *REACT DM*       : " + (react.dm ? "ON" : "OFF"),
      "┃ 👥 *REACT GROUP*    : " + reactGroup,
      "┃ ⚡ *REACT COMMAND*  : " + (react.command ? "ON" : "OFF"),
      "┃ 🎭 *SETREACT*       : " + String(react.reactMode || "defaults").toUpperCase(),
      "┃ 📱 *STATUS REACT*   : " + (react.status ? "ON" : "OFF"),
      "┃ 🎙️ *AUTORECORD*     : ALL=" + (react.record.all ? "ON" : "OFF") + " DM=" + (react.record.dm ? "ON" : "OFF") + " GROUP=" + recordGroup,
      "┃ ⌨️ *AUTOTYPE*       : ALL=" + (react.type.all ? "ON" : "OFF") + " DM=" + (react.type.dm ? "ON" : "OFF") + " GROUP=" + typeGroup,
      "┃ 🎙️ *RECORD+TYPE*    : ALL=" + (react.recordtype.all ? "ON" : "OFF") + " DM=" + (react.recordtype.dm ? "ON" : "OFF") + " GROUP=" + recordTypeGroup,
      "┃ 🟢 *ALWAYS ONLINE*  : " + alwaysOnline,
      "┃",
      "┃ 🗑️ *ANTIDELETE*     : " + (antiDelete.enabled ? "ON / " + String(antiDelete.mode || "private").toUpperCase() : "OFF"),
      "┃ ✏️ *ANTIEDIT*       : " + (antiEdit.enabled ? "ON / " + String(antiEdit.mode || "private").toUpperCase() : "OFF"),
      "┃ 👁️ *VIEW-ONCE AUTO* : " + (viewOnce.enabled ? "ON / " + String(viewOnce.mode || "dm").toUpperCase() : "OFF"),
      "┃ 🔐 *BOT MODE*       : " + String(mode).toUpperCase(),
      "┃",
      "┃ 🃏 *STICKER PACK*   : " + STICKER_PACK_NAME,
      "┃ ✍️ *STICKER AUTHOR* : " + STICKER_PACK_AUTHOR,
      "┃ 🤖 *BOT NAME*       : " + botName,
      "┃ 👑 *OWNER NAME*     : " + ownerName,
      "┃ 🔣 *PREFIX*         : " + prefixDisplay,
      "┃",
      "┃ 💡 Forgot prefix? Type: *What is my prefix*",
      "┃ 📍 *SCOPE*          : " + (isGroup(jid) ? "THIS GROUP" : "PRIVATE CHAT"),
      "┗━━━━━━━━━━━━━━━━"
    ];
    return lines.join("\n");
  }

  const xp = prefix || ".";

  const xtAdminOrOwner = async () => {
    if (isPrivileged(sock, msg)) return true;
    try {
      const meta = await sock.groupMetadata(jid);
      return isAdmin(meta, msg.key.participant || msg.key.remoteJid);
    } catch { return false; }
  };

  function parseAntiMode(args) {
    const a0 = String(args[0] || "").toLowerCase();
    const a1 = String(args[1] || "").toLowerCase();
    if (!a0) return null;
    if (a0 === "off" || a1 === "off") return "off";
    if (["warn", "delete", "kick"].includes(a0)) {
      if (a1 === "off") return "off";
      // on or missing second arg => enable that mode
      if (!a1 || a1 === "on") return a0;
      return a0;
    }
    if (a0 === "on") return "warn";
    return null;
  }

  function setAntiCfg(file, jid, mode) {
    const cfg = readJson(file, {});
    if (mode === "off") delete cfg[jid];
    else cfg[jid] = mode;  // overwrite any previous mode
    writeJson(file, cfg);
    return cfg[jid] || "off";
  }

  const aPrefix = getPrefix(sock) || ".";

  const adultSearchCmd = async (label, query, searchFn, site) => {
    if (adultBlockedQuery(query)) { await send("❌ That search term isn't allowed."); return; }
    try {
      await react("🔍");
      const list = await searchFn(query);
      if (!list.length) throw new Error("No results found");
      await adultSendList(sock, msg, jid, site, label, query, list);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.response?.status ? "Search unavailable (HTTP " + e.response.status + ")" : (e.message || e)}`);
    }
  };

  const adultDlCmd = async (url, site, name) => {
    try {
      await react("⬇️");
      await adultSendVideo(sock, jid, msg, url, site, name);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
  };

  const adultBulkCmd = async (label, site, urlRe, queryPrefix = "") => {
    const a = [...args];
    const link = extractUrl(a.join(" "));
    if (link) {
      if (!urlRe.test(link)) { await send(`❌ That link isn't supported by ${aPrefix}${cmd}`); return; }
      await adultDlCmd(link, /xnxx\.com/i.test(link) ? "xnxx" : "xvideos", label);
      return;
    }
    let amount = 1;
    if (a.length && /^\d{1,4}$/.test(a[0])) amount = parseInt(a.shift(), 10);
    const q = a.join(" ").trim();
    if (!q || amount < 1) {
      await send(`❌ Usage: ${aPrefix}${cmd} <amount> <query>\nExample: ${aPrefix}${cmd} 50 Desi video\n_Limit: ${ADULT_MAX_AMOUNT}_`);
      return;
    }
    if (adultBlockedQuery(q)) { await send("❌ That search term isn't allowed."); return; }
    if (amount > ADULT_MAX_AMOUNT) { await send(`ℹ️ Limit is ${ADULT_MAX_AMOUNT} — using ${ADULT_MAX_AMOUNT}.`); amount = ADULT_MAX_AMOUNT; }
    await adultAskMode(sock, msg, jid, { site, label, query: queryPrefix ? `${queryPrefix} ${q}` : q, amount, prefix: aPrefix });
  };
  return { DEFAULT_WELCOME, DEFAULT_GOODBYE, WELCOME_HINT, handlePresenceCommand, settingsText, xp, xtAdminOrOwner, parseAntiMode, setAntiCfg, aPrefix, adultSearchCmd, adultDlCmd, adultBulkCmd };
}
