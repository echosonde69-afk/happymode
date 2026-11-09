// Joker plugin: setmyprofilename  — commands: setmyprofilename, setpname, setprofilename, setname
// (extracted from routes/pairing.js line 5908; behaviour unchanged)
import { commandOwnerOnly } from "../core/helpers.js";

export default {
  name: "setmyprofilename",
  aliases: ["setmyprofilename","setpname","setprofilename","setname"],
  order: 5908,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["setmyprofilename", "setpname", "setprofilename", "setname"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, send } = __ctx;
    if (!commandOwnerOnly(sock, msg, send)) return { __done: true, value: (true) };
    const name = args.join(" ").trim();
    if (!name) {
      await send("❌ Usage: `.setpname Your Name`\nAlias: `.setmyprofilename`");
      return { __done: true, value: (true) };
    }
    if (name.length > 25) {
      await send("❌ Name too long (max 25 characters).");
      return { __done: true, value: (true) };
    }
    try {
      if (typeof sock.updateProfileName === "function") {
        await sock.updateProfileName(name);
      } else {
        throw new Error("updateProfileName not supported by this Baileys build");
      }
      await send(`✅ Profile name set to: *${name}*`);
    } catch (e) {
      await send(`❌ Failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
