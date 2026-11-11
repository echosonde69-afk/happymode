// Locked & Obfuscated - _locals.js
'use strict';
import { ADULT_MAX_AMOUNT, STICKER_PACK_AUTHOR, STICKER_PACK_NAME, adultAskMode, adultBlockedQuery, adultSendList, adultSendVideo, commandPrivileged, extractUrl, getAutoReactConfig, getMode, getPrefix, getWarnLimit, isAdmin, isGroup, isPrivileged, parseOnOff, readJson, saveAutoReactConfig, sf, writeJson } from "../core/helpers.js";
export function makeLocals(__ctx) {
const _0x0e9afe=["S3ZDZmc0OGdTbTlyWlhJdFdFUWdkMlZzWTI5dFpTb2dlMEIxYzJWeWJtRnRaWDFjYmx4dQ==","S2tkeWIzVndPaW9nZTJkeWIzVndmVnh1","S2xsdmRTZHlaU0J2ZFhJZ2UyTnZkVzUwZlhSb0lHMWxiV0psY2lFcVhHND0=","S2twdmFXNGdkR2x0WlRvcUlIdDBhVzFsZlZ4dVhHND0=","UTJGMWMyVWdZMmhoYjNNZ2FYUnpJR0ZzZDJGNWN5Qm1kVzVjYmx4dVBpRENxVXB2YTJWeUxWaEU=","S3ZDZmtZc2dSMjl2WkdKNVpTb2c4SitZcWlCN1FIVnpaWEp1WVcxbGZWeHVYRzQ9","S2t4bFpuUWdZWFE2S2lCN2RHbHRaWDFjYmc9PQ==","S2xkbEozSmxJRzV2ZHlCN1kyOTFiblI5SUcxbGJXSmxjbk11S2x4dVhHNCtJTUtwU205clpYSXRXRVE9","OEorVG5TQXFVMlYwSUdOMWMzUnZiU0IzWld4amIyMWxLbHh1WEc0PQ==","VlhOaFoyVTZYRzR1YzJWMGQyVnNZMjl0WlNCNWIzVnlJSFJsZUhRZ2FHVnlaVnh1WEc0PQ==","S2xCc1lXTmxhRzlzWkdWeWN5QW9ZMjl3ZVNCaGJua3BPaXBjYmc9PQ==","NG9DaUlIdEFkWE5sY201aGJXVjlJT0tBbENCdFpXNTBhVzl1SUhWelpYSmNiZz09","NG9DaUlIdG5jbTkxY0gwZzRvQ1VJR2R5YjNWd0lHNWhiV1ZjYmc9PQ==","NG9DaUlIdGpiM1Z1ZEgwZzRvQ1VJR04xY25KbGJuUWdiV1Z0WW1WeWMxeHU=","NG9DaUlIdDBhVzFsZlNEaWdKUWdhbTlwYmlCMGFXMWxYRzVjYmc9PQ==","UlhoaGJYQnNaVHBjYmk1elpYUjNaV3hqYjIxbElGZGxiR052YldVZ2UwQjFjMlZ5Ym1GdFpYMGdkRzhnZTJkeWIzVndmU0VnVFdWdFltVnljem9nZTJOdmRXNTBmUT09","WTJoaGRBPT0=","WjNKdmRYQT0=","WVd4cw==","YjJabQ==","VGs5T1JRPT0=","WW05MExXNWhiV1V1YW5OdmJnPT0=","U205clpYSXRXRVE9","YjNkdVpYSXRibUZ0WlM1cWMyOXU=","VG05MElGTmxkQT09","UVU1VVNVeEpUa3M9","WVc1MGFXeHBibXN1YW5OdmJnPT0=","UVU1VVNWTlVTVU5MUlZJPQ==","WVc1MGFYTjBhV05yWlhJdWFuTnZiZz09","UVU1VVNWWlBTVU5G","WVc1MGFYWnZhV05sTG1wemIyND0=","UVU1VVNWQkpRMVJWVWtVPQ==","WVc1MGFYQnBZM1IxY21VdWFuTnZiZz09","OEorV3ZPKzRqdz09","UVU1VVNWWkpSRVZQ","WVc1MGFYWnBaR1Z2TG1wemIyND0=","UVU1VVNWUkZXRlE9","WVc1MGFYUmxlSFF1YW5OdmJnPT0=","UVU1VVNWUkJSdz09","WVc1MGFYUmhaeTVxYzI5dQ==","OEorUHQrKzRqdz09","UVVkTg==","WVdkdExtcHpiMjQ9","UVU1VVNVZFNUMVZRVTFSQlZGVlQ=","WVc1MGFXZHliM1Z3YzNSaGRIVnpMbXB6YjI0PQ==","UVU1VVNVTklRVTVPUlV3PQ==","WVc1MGFXTm9ZVzV1Wld3dWFuTnZiZz09","YjJKcVpXTjA=","ZDJGeWJnPT0=","UjFKUFZWQT0=","WVc1MGFYUmhaMjFsTG1wemIyND0=","U1NkdElHSjFjM2s9","VDBaRw==","VGk5Qg==","ZG1sbGQyOXVZMlV1YW5OdmJnPT0=","WVc1MGFXUmxiR1YwWlM1cWMyOXU=","Y0hKcGRtRjBaUT09","WVc1MGFXVmthWFF1YW5OdmJnPT0=","UjFKUFZWQWdUMDVNV1E9PQ==","VFVsWVJVUT0=","VDA0Z0tGTkZVMU5KVDA0cA==","VjBoQlZGTkJVRkFnVUZKSlZrRkRXUT09","ZDJWc1kyOXRaUzVxYzI5dQ==","WjI5dlpHSjVaUzVxYzI5dQ==","YUdWc2JHOHVhbk52Ymc9PQ==","NHBTUDRwU0JJT0thbWUrNGp5QXFTazlMUlZJdFdFUWdVMFZVVkVsT1IxTXE=","NHBTRElQQ2ZsSmNnS2tGT1ZFbE1TVTVMS2lBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZtcXNnS2tGT1ZFbFRWRWxEUzBWU0tpQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZqcVFnS2tGT1ZFbFdUMGxEUlNvZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2Zscnp2dUk4Z0trRk9WRWxRU1VOVVZWSkZLaUFnSUNBNklBPT0=","NHBTRElQQ2ZqcXdnS2tGT1ZFbFdTVVJGVHlvZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrcXdnS2tGT1ZFbFVSVmhVS2lBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZqN2Z2dUk4Z0trRk9WRWxVUVVjcUlDQWdJQ0FnSUNBNklBPT0=","NHBTRElQQ2ZrNklnS2tGSFRTb2dJQ0FnSUNBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrNkVnS2tGT1ZFbERTRUZPVGtWTUtpQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZqN2Z2dUk4Z0trRk9WRWxVUVVkTlJTb2dJQ0FnSUNBNklBPT0=","NHBTRElPS2FvTys0anlBcVYwRlNUaUJNU1UxSlZDb2dJQ0FnSURvZw==","NHBTRElQQ2ZsSUVnS2tGTVRDQkJUbFJKS2lBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrWXNnS2xkRlRFTlBUVVVxSUNBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrWXNnS2tkUFQwUkNXVVVxSUNBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrcXdnS2toRlRFeFBJRkpGVUV4WktpQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZtSW9nS2tGVlZFOVNSVUZEVkNvZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZqSkFnS2xKRlFVTlVJRUZNVENvZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrcXdnS2xKRlFVTlVJRVJOS2lBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrYVVnS2xKRlFVTlVJRWRTVDFWUUtpQWdJQ0E2SUE9PQ==","NHBTRElPS2FvU0FxVWtWQlExUWdRMDlOVFVGT1JDb2dJRG9n","NHBTRElQQ2ZqcTBnS2xORlZGSkZRVU5VS2lBZ0lDQWdJQ0E2SUE9PQ==","WkdWbVlYVnNkSE09","NHBTRElQQ2ZrN0VnS2xOVVFWUlZVeUJTUlVGRFZDb2dJQ0E2SUE9PQ==","NHBTRElQQ2ZqcG52dUk4Z0trRlZWRTlTUlVOUFVrUXFJQ0FnSUNBNklFRk1URDA9","SUVSTlBRPT0=","SUVkU1QxVlFQUT09","NHBTRElPS01xTys0anlBcVFWVlVUMVJaVUVVcUlDQWdJQ0FnSURvZ1FVeE1QUT09","NHBTRElQQ2ZqcG52dUk4Z0tsSkZRMDlTUkN0VVdWQkZLaUFnSUNBNklFRk1URDA9","NHBTRElQQ2ZuNklnS2tGTVYwRlpVeUJQVGt4SlRrVXFJQ0E2SUE9PQ==","NHBTRElQQ2ZsNUh2dUk4Z0trRk9WRWxFUlV4RlZFVXFJQ0FnSUNBNklBPT0=","VDA0Z0x5QT0=","NHBTRElPS2NqKys0anlBcVFVNVVTVVZFU1ZRcUlDQWdJQ0FnSURvZw==","NHBTRElQQ2ZrWUh2dUk4Z0tsWkpSVmN0VDA1RFJTQkJWVlJQS2lBNklBPT0=","NHBTRElQQ2ZsSkFnS2tKUFZDQk5UMFJGS2lBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZnNDhnS2xOVVNVTkxSVklnVUVGRFN5b2dJQ0E2SUE9PQ==","NHBTRElPS2NqZSs0anlBcVUxUkpRMHRGVWlCQlZWUklUMUlxSURvZw==","NHBTRElQQ2ZwSllnS2tKUFZDQk9RVTFGS2lBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrWkVnS2s5WFRrVlNJRTVCVFVVcUlDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZsS01nS2xCU1JVWkpXQ29nSUNBZ0lDQWdJQ0E2SUE9PQ==","NHBTRElQQ2ZrcUVnUm05eVoyOTBJSEJ5WldacGVEOGdWSGx3WlRvZ0tsZG9ZWFFnYVhNZ2JYa2djSEpsWm1sNEtnPT0=","NHBTRElQQ2ZrNDBnS2xORFQxQkZLaUFnSUNBZ0lDQWdJQ0E2SUE9PQ==","VkVoSlV5QkhVazlWVUE9PQ==","VUZKSlZrRlVSU0JEU0VGVQ==","NHBTWDRwU0I0cFNCNHBTQjRwU0I0cFNCNHBTQjRwU0I0cFNCNHBTQjRwU0I0cFNCNHBTQjRwU0I0cFNCNHBTQjRwU0I=","WkdWc1pYUmw=","YTJsamF3PT0=","NHAyTUlGUm9ZWFFnYzJWaGNtTm9JSFJsY20wZ2FYTnVKM1FnWVd4c2IzZGxaQzQ9","VG04Z2NtVnpkV3gwY3lCbWIzVnVaQT09","ZUc1NGVBPT0=","ZUhacFpHVnZjdz09"];const _0x3092fd=_0x=>{try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return""}};
// Block-scoped helpers that used to live inside executeCommand (they close over sock/msg/jid/send...).
// Plugins read them through __ctx.locals.

  const { sock, msg, prefix, cmd, args, jid, send, react } = __ctx;
  const DEFAULT_WELCOME =
    _0x3092fd(_0x0e9afe[0]) +
    _0x3092fd(_0x0e9afe[1]) +
    _0x3092fd(_0x0e9afe[2]) +
    _0x3092fd(_0x0e9afe[3]) +
    _0x3092fd(_0x0e9afe[4]);

  const DEFAULT_GOODBYE =
    _0x3092fd(_0x0e9afe[5]) +
    _0x3092fd(_0x0e9afe[6]) +
    _0x3092fd(_0x0e9afe[7]);

  const WELCOME_HINT =
    _0x3092fd(_0x0e9afe[8]) +
    _0x3092fd(_0x0e9afe[9]) +
    _0x3092fd(_0x0e9afe[10]) +
    _0x3092fd(_0x0e9afe[11]) +
    _0x3092fd(_0x0e9afe[12]) +
    _0x3092fd(_0x0e9afe[13]) +
    _0x3092fd(_0x0e9afe[14]) +
    _0x3092fd(_0x0e9afe[15]);

  async function handlePresenceCommand(feature,label){
    if(!commandPrivileged(sock,msg,send)) return true;
    const sub=String(args[0]||"").toLowerCase(), value=parseOnOff(args[1]), cfg=getAutoReactConfig(sock), x=cfg[feature];
    if((sub==="dm"||sub===_0x3092fd(_0x0e9afe[16]))&&value!==null){x.dm=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} DM: *${value?"ON":"OFF"}*`);return true;}
    if(sub===_0x3092fd(_0x0e9afe[17])&&value!==null){
      if(!isGroup(jid)){await send(`❌ .${cmd} group on/off — use this in a group only.`);return true;}
      x.groups[jid]=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} this group: *${value?"ON":"OFF"}*`);return true;
    }
    if(sub===_0x3092fd(_0x0e9afe[18])&&value!==null){x.all=value;x.dm=value;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} ALL: *${value?"ON":"OFF"}*`);return true;}
    if(sub==="on"||sub===_0x3092fd(_0x0e9afe[19])){x.all=sub==="on";x.dm=x.all;saveAutoReactConfig(cfg, sock);await send(`✅ ${label} ALL: *${x.all?"ON":"OFF"}*`);return true;}
    await send(`.${cmd} dm on/off | group on/off | all on/off`);return true;
  }

  function settingsText(sock, jid) {
    const prefixValue = getPrefix(sock);
    const prefixDisplay = prefixValue === "" ? _0x3092fd(_0x0e9afe[20]) : prefixValue;
    const botName = readJson(sf(sock, _0x3092fd(_0x0e9afe[21])), { name: "" }).name || sock.user?.name || _0x3092fd(_0x0e9afe[22]);
    const ownerName = readJson(sf(sock, _0x3092fd(_0x0e9afe[23])), { name: _0x3092fd(_0x0e9afe[24]) }).name || _0x3092fd(_0x0e9afe[24]);
    const mode = getMode(sock);

    const antiFiles = [
      [_0x3092fd(_0x0e9afe[25]), _0x3092fd(_0x0e9afe[26]), "🔗"],
      [_0x3092fd(_0x0e9afe[27]), _0x3092fd(_0x0e9afe[28]), "🚫"],
      [_0x3092fd(_0x0e9afe[29]), _0x3092fd(_0x0e9afe[30]), "🎤"],
      [_0x3092fd(_0x0e9afe[31]), _0x3092fd(_0x0e9afe[32]), _0x3092fd(_0x0e9afe[33])],
      [_0x3092fd(_0x0e9afe[34]), _0x3092fd(_0x0e9afe[35]), "🎬"],
      [_0x3092fd(_0x0e9afe[36]), _0x3092fd(_0x0e9afe[37]), "💬"],
      [_0x3092fd(_0x0e9afe[38]), _0x3092fd(_0x0e9afe[39]), _0x3092fd(_0x0e9afe[40])],
      [_0x3092fd(_0x0e9afe[41]), _0x3092fd(_0x0e9afe[42]), "📢"],
      [_0x3092fd(_0x0e9afe[43]), _0x3092fd(_0x0e9afe[44]), "📱"],
      [_0x3092fd(_0x0e9afe[45]), _0x3092fd(_0x0e9afe[46]), "📡"]
    ];
    const groupOnly = !isGroup(jid);
    const antiValues = antiFiles.map(([label, file]) => {
      const cfg = readJson(sf(sock, file), {});
      const raw = cfg[jid];
      const value = file === _0x3092fd(_0x0e9afe[44]) && raw && typeof raw === _0x3092fd(_0x0e9afe[47])
        ? (raw.enabled ? String(raw.action || _0x3092fd(_0x0e9afe[48])) : _0x3092fd(_0x0e9afe[19]))
        : String(raw || _0x3092fd(_0x0e9afe[19]));
      return { label, value: groupOnly ? _0x3092fd(_0x0e9afe[49]) : value.toUpperCase() };
    });

    const antiTagMe = readJson(sf(sock, _0x3092fd(_0x0e9afe[50])), { enabled: false, text: _0x3092fd(_0x0e9afe[51]) });
    const warnLimit = getWarnLimit(sock);

    const react = getAutoReactConfig(sock);
    const reactGroup = isGroup(jid) ? (react.groups[jid] ? "ON" : _0x3092fd(_0x0e9afe[52])) : _0x3092fd(_0x0e9afe[53]);
    const recordGroup = isGroup(jid) ? (react.record.groups[jid] ? "ON" : _0x3092fd(_0x0e9afe[52])) : _0x3092fd(_0x0e9afe[53]);
    const typeGroup = isGroup(jid) ? (react.type.groups[jid] ? "ON" : _0x3092fd(_0x0e9afe[52])) : _0x3092fd(_0x0e9afe[53]);
    const recordTypeGroup = isGroup(jid) ? (react.recordtype.groups[jid] ? "ON" : _0x3092fd(_0x0e9afe[52])) : _0x3092fd(_0x0e9afe[53]);

    const viewOnce = readJson(sf(sock, _0x3092fd(_0x0e9afe[54])), { enabled: true, mode: "dm" });
    const antiDelete = readJson(sf(sock, _0x3092fd(_0x0e9afe[55])), { enabled: true, mode: _0x3092fd(_0x0e9afe[56]) });
    const antiEdit = readJson(sf(sock, _0x3092fd(_0x0e9afe[57])), { enabled: true, mode: _0x3092fd(_0x0e9afe[56]) });

    // .rools/.rules/.allanti controls these eight anti modes together.
    const antiModeSet = antiValues.map(x => x.value).filter(v => v !== _0x3092fd(_0x0e9afe[49]));
    const combinedAnti = groupOnly ? _0x3092fd(_0x0e9afe[58]) :
      (antiModeSet.length && antiModeSet.every(v => v === antiModeSet[0]) ? antiModeSet[0] : _0x3092fd(_0x0e9afe[59]));

    // Always-online is maintained by the connected-session keep-alive.
    const alwaysOnline = sock?.__presenceInterval ? "ON" : _0x3092fd(_0x0e9afe[60]);
    const lastSeen = _0x3092fd(_0x0e9afe[61]);

    const welcomeCfg = isGroup(jid) ? readJson(sf(sock, _0x3092fd(_0x0e9afe[62])), {})[jid] : null;
    const goodbyeCfg = isGroup(jid) ? readJson(sf(sock, _0x3092fd(_0x0e9afe[63])), {})[jid] : null;
    const welcomeOn = welcomeCfg === true || (typeof welcomeCfg === _0x3092fd(_0x0e9afe[47]) && welcomeCfg?.enabled);
    const goodbyeOn = goodbyeCfg === true || (typeof goodbyeCfg === _0x3092fd(_0x0e9afe[47]) && goodbyeCfg?.enabled);
    const helloCfg = readJson(sf(sock, _0x3092fd(_0x0e9afe[64])), { enabled: false });

    const lines = [
      _0x3092fd(_0x0e9afe[65]),
      "┃",
      _0x3092fd(_0x0e9afe[66]) + antiValues[0].value,
      _0x3092fd(_0x0e9afe[67]) + antiValues[1].value,
      _0x3092fd(_0x0e9afe[68]) + antiValues[2].value,
      _0x3092fd(_0x0e9afe[69]) + antiValues[3].value,
      _0x3092fd(_0x0e9afe[70]) + antiValues[4].value,
      _0x3092fd(_0x0e9afe[71]) + antiValues[5].value,
      _0x3092fd(_0x0e9afe[72]) + antiValues[6].value,
      _0x3092fd(_0x0e9afe[73]) + antiValues[7].value,
      _0x3092fd(_0x0e9afe[74]) + antiValues[9].value,
      _0x3092fd(_0x0e9afe[75]) + (antiTagMe.enabled ? "ON" : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[76]) + warnLimit,
      _0x3092fd(_0x0e9afe[77]) + combinedAnti,
      "┃",
      _0x3092fd(_0x0e9afe[78]) + (isGroup(jid) ? (welcomeOn ? "ON" : _0x3092fd(_0x0e9afe[52])) : _0x3092fd(_0x0e9afe[58])),
      _0x3092fd(_0x0e9afe[79]) + (isGroup(jid) ? (goodbyeOn ? "ON" : _0x3092fd(_0x0e9afe[52])) : _0x3092fd(_0x0e9afe[58])),
      _0x3092fd(_0x0e9afe[80]) + (helloCfg.enabled ? "ON" : _0x3092fd(_0x0e9afe[52])),
      "┃",
      _0x3092fd(_0x0e9afe[81]) + (react.enabled ? "ON" : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[82]) + (react.all ? "ON" : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[83]) + (react.dm ? "ON" : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[84]) + reactGroup,
      _0x3092fd(_0x0e9afe[85]) + (react.command ? "ON" : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[86]) + String(react.reactMode || _0x3092fd(_0x0e9afe[87])).toUpperCase(),
      _0x3092fd(_0x0e9afe[88]) + (react.status ? "ON" : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[89]) + (react.record.all ? "ON" : _0x3092fd(_0x0e9afe[52])) + _0x3092fd(_0x0e9afe[90]) + (react.record.dm ? "ON" : _0x3092fd(_0x0e9afe[52])) + _0x3092fd(_0x0e9afe[91]) + recordGroup,
      _0x3092fd(_0x0e9afe[92]) + (react.type.all ? "ON" : _0x3092fd(_0x0e9afe[52])) + _0x3092fd(_0x0e9afe[90]) + (react.type.dm ? "ON" : _0x3092fd(_0x0e9afe[52])) + _0x3092fd(_0x0e9afe[91]) + typeGroup,
      _0x3092fd(_0x0e9afe[93]) + (react.recordtype.all ? "ON" : _0x3092fd(_0x0e9afe[52])) + _0x3092fd(_0x0e9afe[90]) + (react.recordtype.dm ? "ON" : _0x3092fd(_0x0e9afe[52])) + _0x3092fd(_0x0e9afe[91]) + recordTypeGroup,
      _0x3092fd(_0x0e9afe[94]) + alwaysOnline,
      "┃",
      _0x3092fd(_0x0e9afe[95]) + (antiDelete.enabled ? _0x3092fd(_0x0e9afe[96]) + String(antiDelete.mode || _0x3092fd(_0x0e9afe[56])).toUpperCase() : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[97]) + (antiEdit.enabled ? _0x3092fd(_0x0e9afe[96]) + String(antiEdit.mode || _0x3092fd(_0x0e9afe[56])).toUpperCase() : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[98]) + (viewOnce.enabled ? _0x3092fd(_0x0e9afe[96]) + String(viewOnce.mode || "dm").toUpperCase() : _0x3092fd(_0x0e9afe[52])),
      _0x3092fd(_0x0e9afe[99]) + String(mode).toUpperCase(),
      "┃",
      _0x3092fd(_0x0e9afe[100]) + STICKER_PACK_NAME,
      _0x3092fd(_0x0e9afe[101]) + STICKER_PACK_AUTHOR,
      _0x3092fd(_0x0e9afe[102]) + botName,
      _0x3092fd(_0x0e9afe[103]) + ownerName,
      _0x3092fd(_0x0e9afe[104]) + prefixDisplay,
      "┃",
      _0x3092fd(_0x0e9afe[105]),
      _0x3092fd(_0x0e9afe[106]) + (isGroup(jid) ? _0x3092fd(_0x0e9afe[107]) : _0x3092fd(_0x0e9afe[108])),
      _0x3092fd(_0x0e9afe[109])
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
    if (a0 === _0x3092fd(_0x0e9afe[19]) || a1 === _0x3092fd(_0x0e9afe[19])) return _0x3092fd(_0x0e9afe[19]);
    if ([_0x3092fd(_0x0e9afe[48]), _0x3092fd(_0x0e9afe[110]), _0x3092fd(_0x0e9afe[111])].includes(a0)) {
      if (a1 === _0x3092fd(_0x0e9afe[19])) return _0x3092fd(_0x0e9afe[19]);
      // on or missing second arg => enable that mode
      if (!a1 || a1 === "on") return a0;
      return a0;
    }
    if (a0 === "on") return _0x3092fd(_0x0e9afe[48]);
    return null;
  }

  function setAntiCfg(file, jid, mode) {
    const cfg = readJson(file, {});
    if (mode === _0x3092fd(_0x0e9afe[19])) delete cfg[jid];
    else cfg[jid] = mode;  // overwrite any previous mode
    writeJson(file, cfg);
    return cfg[jid] || _0x3092fd(_0x0e9afe[19]);
  }

  const aPrefix = getPrefix(sock) || ".";

  const adultSearchCmd = async (label, query, searchFn, site) => {
    if (adultBlockedQuery(query)) { await send(_0x3092fd(_0x0e9afe[112])); return; }
    try {
      await react("🔍");
      const list = await searchFn(query);
      if (!list.length) throw new Error(_0x3092fd(_0x0e9afe[113]));
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
      await adultDlCmd(link, /xnxx\.com/i.test(link) ? _0x3092fd(_0x0e9afe[114]) : _0x3092fd(_0x0e9afe[115]), label);
      return;
    }
    let amount = 1;
    if (a.length && /^\d{1,4}$/.test(a[0])) amount = parseInt(a.shift(), 10);
    const q = a.join(" ").trim();
    if (!q || amount < 1) {
      await send(`❌ Usage: ${aPrefix}${cmd} <amount> <query>\nExample: ${aPrefix}${cmd} 50 Desi video\n_Limit: ${ADULT_MAX_AMOUNT}_`);
      return;
    }
    if (adultBlockedQuery(q)) { await send(_0x3092fd(_0x0e9afe[112])); return; }
    if (amount > ADULT_MAX_AMOUNT) { await send(`ℹ️ Limit is ${ADULT_MAX_AMOUNT} — using ${ADULT_MAX_AMOUNT}.`); amount = ADULT_MAX_AMOUNT; }
    await adultAskMode(sock, msg, jid, { site, label, query: queryPrefix ? `${queryPrefix} ${q}` : q, amount, prefix: aPrefix });
  };
  return { DEFAULT_WELCOME, DEFAULT_GOODBYE, WELCOME_HINT, handlePresenceCommand, settingsText, xp, xtAdminOrOwner, parseAntiMode, setAntiCfg, aPrefix, adultSearchCmd, adultDlCmd, adultBulkCmd };
}
