// Joker plugin: user  — commands: user
// (extracted from routes/pairing.js line 5564; behaviour unchanged)
import { commandPrivileged, readJson, sf } from "../core/helpers.js";

export default {
  name: "user",
  aliases: ["user"],
  order: 5564,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "user");
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const list = readJson(sf(sock, "block.json"), []);
    await send(list.length ? `🚫 *Blocked Users*\n\n${list.map((n,i)=>`${i+1}. +${n}`).join("\n")}` : "✅ Block list is empty.");
    return { __done: true, value: (true) };
  
  }
};
