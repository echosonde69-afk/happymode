// Joker plugin: alive  — commands: alive, runtime, uptime, up, a
// (extracted from routes/pairing.js line 7565; behaviour unchanged)
import { formatUptime, getMode, getPrefix, jidNumber, readJson, sf } from "../core/helpers.js";

export default {
  name: "alive",
  aliases: ["alive","runtime","uptime","up","a"],
  order: 7565,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["alive", "runtime", "uptime", "up", "a"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, send } = __ctx;
    const up = formatUptime(process.uptime() * 1000);
    const mode = getMode(sock);
    const botNum = jidNumber(sock.user?.id) || "?";
    const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || sock.user?.name || "Joker-XD";
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
