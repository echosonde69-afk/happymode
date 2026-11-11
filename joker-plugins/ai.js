// Locked & Obfuscated - ai.js
'use strict';
import { askAI, getAiHistory, mcKey, pushAiHistory } from "../core/helpers.js";
export default {
const _0x659297=["WjNCMA==","WVhOcg==","NHAyTUlGVnpZV2RsT2lBdVlXa2dQSEYxWlhOMGFXOXVQZz09","ZFhObGNnPT0=","WVhOemFYTjBZVzUw"];const _0xd073af=_0x=>{try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return""}};
// Joker plugin: ai  — commands: ai, gpt, ask
// (extracted from routes/pairing.js line 9286; behaviour unchanged)

  name: "ai",
  aliases: ["ai",_0xd073af(_0x659297[0]),_0xd073af(_0x659297[1])],
  order: 9286,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["ai", _0xd073af(_0x659297[0]), _0xd073af(_0x659297[1])].includes(cmd));
  },
  async run(__ctx) {
    const { sock, args, jid, send, react } = __ctx;
    const q = args.join(" ").trim();
    if (!q) { await send(_0xd073af(_0x659297[2])); return { __done: true, value: (true) }; }
    try {
      await react("🧠");
      // Same chat memory as chatbot (last 24h, light)
      const history = getAiHistory(mcKey(sock, jid));
      const out = await askAI(q, history);
      pushAiHistory(mcKey(sock, jid), _0xd073af(_0x659297[3]), q);
      pushAiHistory(mcKey(sock, jid), _0xd073af(_0x659297[4]), out);
      await send(`🤖 *Joker-XD AI*\n\n${out}`);
    } catch (e) {
      await send(`❌ AI failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
