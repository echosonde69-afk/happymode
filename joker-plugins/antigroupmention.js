// Joker plugin: antigroupmention  — commands: antigroupmention, agm
// (extracted from routes/pairing.js line 8213; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf } from "../core/helpers.js";

export default {
  name: "antigroupmention",
  aliases: ["antigroupmention","agm"],
  order: 8213,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["antigroupmention", "agm"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = parseAntiMode(args);
    const cfg = readJson(sf(sock, "agm.json"), {});
    if (!v) {
      await send(
        `📢 *ANTI GROUP MENTION*\n` +
        `Current: *${cfg[jid] || "off"}*\n\n` +
        `Acts only on group-status *mentions*.\n` +
        `For actual group status posts use \`.antigroupstatus\`.\n\n` +
        `📌 Usage: *.antigroupmention* / *.agm* warn|delete|kick|off`
      );
      return { __done: true, value: (true) };
    }
    const nv = setAntiCfg(sf(sock, "agm.json"), jid, v);
    await send(`📢 *ANTI GROUP MENTION*\n✅ Switched to *${nv}*`);
    return { __done: true, value: (true) };
  
  }
};
