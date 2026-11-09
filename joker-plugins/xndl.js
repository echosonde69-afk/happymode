// Joker plugin: xndl  — commands: xndl
// (extracted from routes/pairing.js line 9759; behaviour unchanged)


export default {
  name: "xndl",
  aliases: ["xndl"],
  order: 9759,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "xndl");
  },
  async run(__ctx) {
    const { adultBulkCmd } = __ctx.locals;
 await adultBulkCmd("xnxx", "xnxx", /xnxx\.com/i); return { __done: true, value: (true) }; 
  }
};
