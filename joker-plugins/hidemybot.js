// Joker plugin: hidemybot  — commands: hidemybot, hidemy, hideme, hidebot
// (extracted from routes/pairing.js line 8111; behaviour unchanged)
import { commandPrivileged, getHideMyCfg, setHideMyCfg } from "../core/helpers.js";

export default {
  name: "hidemybot",
  aliases: ["hidemybot","hidemy","hideme","hidebot"],
  order: 8111,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["hidemybot", "hidemy", "hideme", "hidebot"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    const { xp } = __ctx.locals;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const a0 = String(args[0] || "").toLowerCase();
    const a1 = String(args[1] || "").toLowerCase();
    let cfg = getHideMyCfg(sock);
    if (a0 === "on") cfg = setHideMyCfg(sock, { enabled: true });
    else if (a0 === "off") cfg = setHideMyCfg(sock, { enabled: false });
    else if (a0 === "typing" && (a1 === "on" || a1 === "off")) cfg = setHideMyCfg(sock, { typing: a1 === "on" });
    await send(`🕵️ *HIDE MY BOT*\nStatus: *${cfg.enabled ? "ON" : "OFF"}*\n• Mobile-app style message IDs: ${cfg.enabled ? "✅" : "❌"}\n• Typing before replies: ${cfg.enabled && cfg.typing ? "✅" : "❌"}\n\nUsage:\n${xp}hidemybot on | off\n${xp}hidemybot typing on | off\n\nTips: use plain text replies (no buttons/lists) — those are bot-only.\nOther bots that check the device number or the group's member list can still see you.`);
    return { __done: true, value: (true) };
  
  }
};
