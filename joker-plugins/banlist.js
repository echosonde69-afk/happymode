// Joker plugin: banlist  — commands: banlist, listban
// (extracted from routes/pairing.js line 5487; behaviour unchanged)
import { commandPrivileged, readJson, sf } from "../core/helpers.js";

export default {
  name: "banlist",
  aliases: ["banlist","listban"],
  order: 5487,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["banlist","listban"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const list = readJson(sf(sock, "ban.json"), []);
    await send(list.length ? `🚫 *Banned Users*\n\n${list.map((n,i)=>`${i+1}. +${n}`).join("\n")}` : "✅ Ban list is empty.");
    return { __done: true, value: (true) };
  
  }
};
