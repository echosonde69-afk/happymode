// Joker plugin: stop  — commands: stop, stopjs, stopjt, stopja, stopjokers, stopjokertag, stopjokerall, stopbom, stopba, stopbt
// (extracted from routes/pairing.js line 7069; behaviour unchanged)
import { isPrivileged, requestStopJoker } from "../core/helpers.js";

export default {
  name: "stop",
  aliases: ["stop","stopjs","stopjt","stopja","stopjokers","stopjokertag","stopjokerall","stopbom","stopba","stopbt"],
  order: 7069,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "stop" || ["stopjs", "stopjt", "stopja", "stopjokers", "stopjokertag", "stopjokerall", "stopbom", "stopba", "stopbt"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, send } = __ctx;
    if (!msg.key.fromMe && !isPrivileged(sock, msg)) {
      await send("❌ Owner only.");
      return { __done: true, value: (true) };
    }
    let target = null;
    if (cmd === "stopjs" || cmd === "stopjokers") target = "js";
    else if (cmd === "stopjt" || cmd === "stopjokertag") target = "jt";
    else if (cmd === "stopja" || cmd === "stopjokerall") target = "ja";
    else if (cmd === "stopbom") target = "bom";
    else if (cmd === "stopba") target = "ba";
    else if (cmd === "stopbt") target = "bt";
    else {
      const sub = (args[0] || "").toLowerCase();
      if (["js", "jokers", "s"].includes(sub)) target = "js";
      else if (["jt", "jokertag", "t", "joker"].includes(sub)) target = "jt";
      else if (["ja", "jokerall", "a"].includes(sub)) target = "ja";
      else if (["bom", "b"].includes(sub)) target = "bom";
      else if (["ba", "bomall"].includes(sub)) target = "ba";
      else if (["bt", "bomtag"].includes(sub)) target = "bt";
      else if (["all"].includes(sub)) {
        const stopped = [];
        for (const t of ["js", "jt", "ja", "bom", "ba", "bt"]) {
          if (requestStopJoker(sock, t)) stopped.push(t);
        }
        if (stopped.length) await send(`⏹ Stopped: ${stopped.join(", ").toUpperCase()}`);
        else await send("❌ No active joker/bom jobs to stop.");
        return { __done: true, value: (true) };
      } else {
        await send(
`*⏹ STOP*

Usage:
• .stop js   — stop .jokers
• .stop jt   — stop .jokertag
• .stop ja   — stop .jokerall
• .stop bom  — stop .bom
• .stop ba   — stop .bomall
• .stop bt   — stop .bomtag
• .stop all  — stop everything

Aliases: .stopjs .stopjt .stopja .stopbom .stopba .stopbt`
        );
        return { __done: true, value: (true) };
      }
    }
    if (requestStopJoker(sock, target)) {
      await send(`⏹ Stopping *${target.toUpperCase()}*… (current loop will end soon)`);
    } else {
      await send(`❌ No active *${target.toUpperCase()}* job running.`);
    }
    return { __done: true, value: (true) };
  
  }
};
