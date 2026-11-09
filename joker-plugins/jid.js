// Joker plugin: jid  — commands: jid
// (extracted from routes/pairing.js line 7124; behaviour unchanged)


export default {
  name: "jid",
  aliases: ["jid"],
  order: 7124,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "jid");
  },
  async run(__ctx) {
    const { jid, send } = __ctx;
    await send(`📌 Chat JID:\n${jid}`);
    return { __done: true, value: (true) };
  
  }
};
