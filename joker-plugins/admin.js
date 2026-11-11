// Locked & Obfuscated - admin.js
'use strict';
import { isAdmin, isGroup, isPrivileged, jidNumber } from "../core/helpers.js";
export default {
const _0xd29347=["WVdSdGFXND0=","WVdSdGFXNXo=","ZEdGbllXUnRhVzQ9","ZEdGbllXUnRhVzV6","NHAyTUlFZHliM1Z3SUc5dWJIa3U=","NHAyTUlFRmtiV2x1Y3lCdmJteDVMZz09","YzNWd1pYSmhaRzFwYmc9PQ==","NHAyTUlFNXZJR0ZrYldsdWN5Qm1iM1Z1WkM0PQ==","WEc1Y2JnPT0=","OEorUmtTQXFRV1J0YVc1ektseHU="];const _0x8acb90=_0x=>{try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return""}};
// Joker plugin: admin  — commands: admin, admins, tagadmin, tagadmins
// (extracted from routes/pairing.js line 7888; behaviour unchanged)

  name: _0x8acb90(_0xd29347[0]),
  aliases: [_0x8acb90(_0xd29347[0]),_0x8acb90(_0xd29347[1]),_0x8acb90(_0xd29347[2]),_0x8acb90(_0xd29347[3])],
  order: 7888,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return ([_0x8acb90(_0xd29347[0]), _0x8acb90(_0xd29347[1]), _0x8acb90(_0xd29347[2]), _0x8acb90(_0xd29347[3])].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send(_0x8acb90(_0xd29347[4])); return { __done: true, value: (true) }; }
    const meta = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!isAdmin(meta, sender) && !isPrivileged(sock, msg)) { await send(_0x8acb90(_0xd29347[5])); return { __done: true, value: (true) }; }
    const admins = meta.participants.filter(p => p.admin === _0x8acb90(_0xd29347[0]) || p.admin === _0x8acb90(_0xd29347[6])).map(p => p.id);
    if (!admins.length) { await send(_0x8acb90(_0xd29347[7])); return { __done: true, value: (true) }; }
    const extraText = args.join(" ").trim();
    const tagLine = admins.map(x => "@" + jidNumber(x)).join(" ");
    const body = (extraText ? extraText + _0x8acb90(_0xd29347[8]) : _0x8acb90(_0xd29347[9])) + tagLine;
    await sock.sendMessage(jid, { text: body, mentions: admins }, { quoted: msg });
    return { __done: true, value: (true) };
  
  }
};
