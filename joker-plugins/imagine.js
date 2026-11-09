// Joker plugin: imagine  — commands: imagine, imagin, draw
// (extracted from routes/pairing.js line 9303; behaviour unchanged)
import { generateImageBuffer, readJson, sendMedia, sf } from "../core/helpers.js";

export default {
  name: "imagine",
  aliases: ["imagine","imagin","draw"],
  order: 9303,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["imagine", "imagin", "draw"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const q = args.join(" ").trim();
    if (!q) { await send("❌ Usage: .imagine <prompt>\nExample: .imagine a cat astronaut on the moon, cinematic lighting"); return { __done: true, value: (true) }; }
    try {
      await react("🎨");
      const enhanced = `${q}, highly detailed, sharp focus, professional photography, 8k uhd, cinematic lighting, masterpiece`;
      const botName = readJson(sf(sock, "bot-name.json"), { name: "" }).name || "Joker-XD";
      const buffer = await generateImageBuffer(enhanced);
      await sendMedia(sock, jid, "image", null, { buffer, caption: `🎨 *${q.slice(0, 100)}*\n🃏 ${botName}` }, msg);
    } catch (e) { await send(`❌ Imagine failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
