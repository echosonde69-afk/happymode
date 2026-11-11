// Locked & Obfuscated - alive.js
'use strict';
import { formatUptime, getMode, getPrefix, jidNumber, readJson, sf } from "../core/helpers.js";
export default {
const _0xbbb651=["WVd4cGRtVT0=","Y25WdWRHbHRaUT09","ZFhCMGFXMWw=","WW05MExXNWhiV1V1YW5OdmJnPT0=","U205clpYSXRXRVE9"];const _0xb0fad1=_0x=>{try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return""}};
// Joker plugin: alive  — commands: alive, runtime, uptime, up, a
// (extracted from routes/pairing.js line 7565; behaviour unchanged)

  name: _0xb0fad1(_0xbbb651[0]),
  aliases: [_0xb0fad1(_0xbbb651[0]),_0xb0fad1(_0xbbb651[1]),_0xb0fad1(_0xbbb651[2]),"up","a"],
  order: 7565,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return ([_0xb0fad1(_0xbbb651[0]), _0xb0fad1(_0xbbb651[1]), _0xb0fad1(_0xbbb651[2]), "up", "a"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, send } = __ctx;
    const up = formatUptime(process.uptime() * 1000);
    const mode = getMode(sock);
    const botNum = jidNumber(sock.user?.id) || "?";
    const botName = readJson(sf(sock, _0xb0fad1(_0xbbb651[3])), { name: "" }).name || sock.user?.name || _0xb0fad1(_0xbbb651[4]);
    await send(
`*🃏 ${botName} v2.0.5 is Alive*

✦ Status   : Online ✅
✦ Uptime   : ${up}
✦ Mode     : ${mode}
✦ Prefix   : ${getPrefix(sock) === "" ? "none" : getPrefix(sock)}
✦ Bot      : +${botNum}
✦ Version  : v2.0.5`
    );
    return { __done: true, value: (true) };
  
  }
};
