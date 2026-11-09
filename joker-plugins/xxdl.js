// Joker plugin: xxdl  — commands: xxdl
// (extracted from routes/pairing.js line 9752; behaviour unchanged)


export default {
  name: "xxdl",
  aliases: ["xxdl"],
  order: 9752,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "xxdl");
  },
  async run(__ctx) {
    const { adultBulkCmd } = __ctx.locals;
 await adultBulkCmd("xvideos", "xvideos", /xvideos\.com/i); return { __done: true, value: (true) }; 
  }
};
