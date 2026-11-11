// Locked & Obfuscated - settings.js
'use strict';
import { commandPrivileged } from "../core/helpers.js";
export default {
const _0x0fed0f=["YzJWMGRHbHVaM009","YzJWMGRHbHVadz09"];const _0x8dd141=_0x=>{try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return""}};
// Joker plugin: settings  — commands: settings, setting
// (extracted from routes/pairing.js line 7531; behaviour unchanged)

  name: _0x8dd141(_0x0fed0f[0]),
  aliases: [_0x8dd141(_0x0fed0f[0]),_0x8dd141(_0x0fed0f[1])],
  order: 7531,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return ([_0x8dd141(_0x0fed0f[0]), _0x8dd141(_0x0fed0f[1])].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, jid, send } = __ctx;
    const { settingsText } = __ctx.locals;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    await send(settingsText(sock, jid));
    return { __done: true, value: (true) };
  
  }
};
