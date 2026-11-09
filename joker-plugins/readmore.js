// Joker plugin: readmore  — commands: readmore, spoiler, rmore
// (extracted from routes/pairing.js line 9063; behaviour unchanged)


export default {
  name: "readmore",
  aliases: ["readmore","spoiler","rmore"],
  order: 9063,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["readmore", "spoiler", "rmore"].includes(cmd));
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    const text = args.join(" ").trim();
    if (!text) {
      await send(
        "❌ Usage: `.readmore hello, how are you`\n\n" +
        "Har *comma* ek Read more break hai.\n" +
        "Example: `.readmore Hy,,, nothing, how are you`"
      );
      return { __done: true, value: (true) };
    }
    // Comma = readmore break. Multiple commas = multiple breaks.
    // Also support | and . for backward compatibility if no comma.
    let parts;
    if (text.includes(",")) {
      parts = text.split(",");
    } else if (text.includes("|")) {
      parts = text.split("|");
    } else if (text.includes(".")) {
      const i = text.indexOf(".");
      parts = [text.slice(0, i), text.slice(i + 1)];
    } else {
      parts = [text];
    }
    const more = String.fromCharCode(8206).repeat(4001);
    const out = parts.map((p, i) => (i === 0 ? p : more + p)).join("");
    await send(out);
    return { __done: true, value: (true) };
  
  }
};
