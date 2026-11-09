// Joker plugin: stopdl  — commands: stopdl, adultstop
// (extracted from routes/pairing.js line 9694; behaviour unchanged)
import { adultJobs, mcKey } from "../core/helpers.js";

export default {
  name: "stopdl",
  aliases: ["stopdl","adultstop"],
  order: 9694,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "stopdl" || cmd === "adultstop");
  },
  async run(__ctx) {
    const { sock, jid, send } = __ctx;
    const job = adultJobs.get(mcKey(sock, jid));
    if (!job) { await send("ℹ️ No download is running in this chat."); return { __done: true, value: (true) }; }
    job.cancel = true;
    await send("🛑 Stopping after the current file...");
    return { __done: true, value: (true) };
  
  }
};
