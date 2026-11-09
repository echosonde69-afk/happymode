// Joker plugin: setprefix  — commands: setprefix, prefix, changeprefix
// (extracted from routes/pairing.js line 7175; behaviour unchanged)
import { botNumberFromSock, getPrefix, isPrivileged, setPrefix } from "../core/helpers.js";

export default {
  name: "setprefix",
  aliases: ["setprefix","prefix","changeprefix"],
  order: 7175,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["setprefix", "prefix", "changeprefix"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!isPrivileged(sock, msg)) {
      await send("❌ Owner/Sudo only.");
      return { __done: true, value: (true) };
    }

    if (!args[0]) {
      await send(`*Current Prefix:* ${getPrefix(sock) === "" ? "none (no prefix)" : getPrefix(sock)}\n\n*Usage:*\n.setprefix .\n.setprefix !\n.setprefix none\n.setprefix (any symbol)`);
      return { __done: true, value: (true) };
    }

    const input = args[0];

    const _sn = botNumberFromSock(sock);
    if (input.toLowerCase() === "none") {
      setPrefix(sock, "");
      console.log(`[prefix] session ${_sn}: prefix removed`);
      await send(`✅ Prefix removed for this bot (*${_sn}*) only.\nCommands will now work without any prefix.\nExample: menu | ping | jokers`);
      return { __done: true, value: (true) };
    }

    setPrefix(sock, input);
    console.log(`[prefix] session ${_sn}: prefix -> ${input}`);
    await send(`✅ Prefix changed to *${input}* for this bot (*${_sn}*) only.`);
    return { __done: true, value: (true) };
  
  }
};
