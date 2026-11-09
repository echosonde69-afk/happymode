// Joker plugin: autorecordtype  — commands: autorecordtype
// (extracted from routes/pairing.js line 7420; behaviour unchanged)


export default {
  name: "autorecordtype",
  aliases: ["autorecordtype"],
  order: 7420,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd==="autorecordtype");
  },
  async run(__ctx) {
    const { handlePresenceCommand } = __ctx.locals;
return { __done: true, value: (await handlePresenceCommand("recordtype","Auto-record + type")) };
  }
};
