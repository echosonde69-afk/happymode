// Locked & Obfuscated - ban.js
'use strict';
import { commandPrivileged, readJson, sf, targetNumber, writeJson } from "../core/helpers.js";
export default {
const _0x94a0a9=["WW1GdQ==","NHAyTUlGSmxjR3g1SUhSdklHRWdkWE5sY2lCdmNpQndjbTkyYVdSbElHRWdiblZ0WW1WeUxnPT0=","WW1GdUxtcHpiMjQ9"];const _0x706532=_0x=>{try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return""}};
// Joker plugin: ban  — commands: ban
// (extracted from routes/pairing.js line 5469; behaviour unchanged)

  name: _0x706532(_0x94a0a9[0]),
  aliases: [_0x706532(_0x94a0a9[0])],
  order: 5469,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === _0x706532(_0x94a0a9[0]));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const n = targetNumber(msg, args);
    if (!n) { await send(_0x706532(_0x94a0a9[1])); return { __done: true, value: (true) }; }
    const list = readJson(sf(sock, _0x706532(_0x94a0a9[2])), []).map(String);
    if (!list.includes(n)) list.push(n);
    writeJson(sf(sock, _0x706532(_0x94a0a9[2])), list);
    await send(`🚫 Banned: +${n}`);
    return { __done: true, value: (true) };
  
  }
};
