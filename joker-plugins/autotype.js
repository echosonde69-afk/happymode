// Joker plugin: autotype  — commands: autotype
// (extracted from routes/pairing.js line 7419; behaviour unchanged)


export default {
  name: "autotype",
  aliases: ["autotype"],
  order: 7419,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd==="autotype");
  },
  async run(__ctx) {
    const { handlePresenceCommand } = __ctx.locals;
return { __done: true, value: (await handlePresenceCommand("type","Auto-type")) };
  }
};
