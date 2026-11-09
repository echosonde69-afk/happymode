// Joker plugin: hentaidl  — commands: hentaidl
// (extracted from routes/pairing.js line 9766; behaviour unchanged)


export default {
  name: "hentaidl",
  aliases: ["hentaidl"],
  order: 9766,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "hentaidl");
  },
  async run(__ctx) {
    const { adultBulkCmd } = __ctx.locals;
 await adultBulkCmd("Hentai", "xvideos", /(xvideos|xnxx)\.com/i, "hentai"); return { __done: true, value: (true) }; 
  }
};
