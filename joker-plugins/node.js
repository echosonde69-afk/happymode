// Joker plugin: node  — commands: node
// (extracted from routes/pairing.js line 9769; behaviour unchanged)
import { ADULT_MAX_IMAGES, adultBlockedQuery, adultRunImages } from "../core/helpers.js";

export default {
  name: "node",
  aliases: ["node"],
  order: 9769,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "node");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const { aPrefix } = __ctx.locals;
    const a = [...args];
    let amount = 1;
    if (a.length && /^\d{1,3}$/.test(a[0])) amount = parseInt(a.shift(), 10);
    const q = a.join(" ").trim();
    if (!q || amount < 1) { await send(`❌ Usage: ${aPrefix}node <amount> <query>\nExample: ${aPrefix}node 5 boobs\n_Max ${ADULT_MAX_IMAGES} pictures._`); return { __done: true, value: (true) }; }
    if (adultBlockedQuery(q)) { await send("❌ That search term isn't allowed."); return { __done: true, value: (true) }; }
    if (amount > ADULT_MAX_IMAGES) { await send(`ℹ️ Limit is ${ADULT_MAX_IMAGES} pictures — sending ${ADULT_MAX_IMAGES}.`); amount = ADULT_MAX_IMAGES; }
    await react("🔍");
    await adultRunImages(sock, msg, jid, { query: q, amount, prefix: aPrefix });
    await react("✅");
    return { __done: true, value: (true) };
  
  }
};
