// Joker plugin: currency  — commands: currency, exchange, curr
// (extracted from routes/pairing.js line 9131; behaviour unchanged)
import axios from "axios";

export default {
  name: "currency",
  aliases: ["currency","exchange","curr"],
  order: 9131,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["currency", "exchange", "curr"].includes(cmd));
  },
  async run(__ctx) {
    const { args, send } = __ctx;
    if (args.length < 3) { await send("❌ Usage: .currency 100 USD PKR"); return { __done: true, value: (true) }; }
    const amount = Number(args[0]) || 1;
    const from = args[1].toUpperCase();
    const to = args[2].toUpperCase();
    try {
      const r = await axios.get(`https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`, {
        timeout: 12000, validateStatus: () => true
      });
      if (r.data?.result !== "success") { await send("❌ Currency API error."); return { __done: true, value: (true) }; }
      const rate = r.data.rates?.[to];
      if (!rate) { await send(`❌ No rate for ${to}`); return { __done: true, value: (true) }; }
      await send(`💱 *${amount} ${from}* = *${(amount * rate).toFixed(4)} ${to}*\nRate: ${rate}`);
    } catch (e) { await send(`❌ ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
