// Joker plugin: autorecord  — commands: autorecord
// (extracted from routes/pairing.js line 7418; behaviour unchanged)


export default {
  name: "autorecord",
  aliases: ["autorecord"],
  order: 7418,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd==="autorecord");
  },
  async run(__ctx) {
    const { handlePresenceCommand } = __ctx.locals;
return { __done: true, value: (await handlePresenceCommand("record","Auto-record")) };
  }
};
