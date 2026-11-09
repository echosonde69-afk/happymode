// Joker plugin: list  — commands: list
// (extracted from routes/pairing.js line 5493; behaviour unchanged)
import { commandPrivileged, readJson, sf } from "../core/helpers.js";

export default {
  name: "list",
  aliases: ["list"],
  order: 5493,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd, args } = __ctx;
    return (cmd === "list" && String(args[0] || "").toLowerCase() === "ban");
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const list = readJson(sf(sock, "ban.json"), []);
    await send(list.length ? `🚫 *Banned Users*\n\n${list.map((n,i)=>`${i+1}. +${n}`).join("\n")}` : "✅ Ban list is empty.");
    return { __done: true, value: (true) };
  
  }
};
