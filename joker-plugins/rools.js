// Joker plugin: rools  — commands: rools, rules, allanti
// (extracted from routes/pairing.js line 8858; behaviour unchanged)
import { commandPrivileged, isGroup, readJson, sf, writeJson } from "../core/helpers.js";

export default {
  name: "rools",
  aliases: ["rools","rules","allanti"],
  order: 8858,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["rools", "rules", "allanti"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    const { parseAntiMode, setAntiCfg } = __ctx.locals;
    if (!isGroup(jid)) { await send("❌ Group only."); return { __done: true, value: (true) }; }
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const v = parseAntiMode(args);
    if (!v) {
      await send("Usage: .rools warn on|off\n.rools kick on\n.rools delete on\n.rools off");
      return { __done: true, value: (true) };
    }
    const files = ["antilink.json","antisticker.json","antivoice.json","antipicture.json","antivideo.json","antitext.json","antitag.json","agm.json","antichannel.json"].map(f => sf(sock, f));
    for (const f of files) setAntiCfg(f, jid, v);
    const agsFile = sf(sock, "antigroupstatus.json");
    const agsCfg = readJson(agsFile, {});
    agsCfg[jid] = { enabled: v !== "off", action: v === "off" ? "warn" : v };
    writeJson(agsFile, agsCfg);
    await send(`✅ All anti tools → *${v}*`);
    return { __done: true, value: (true) };
  
  }
};
