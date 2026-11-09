// Joker plugin: pin  — commands: pin
// (extracted from routes/pairing.js line 9572; behaviour unchanged)
import { delay } from "@whiskeysockets/baileys";
import { PIN_MAX, extractUrl, getPrefix, pinFromUrl, pinGetImage, pinSearch } from "../core/helpers.js";

export default {
  name: "pin",
  aliases: ["pin"],
  order: 9572,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (cmd === "pin");
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send, react } = __ctx;
    const pp = getPrefix(sock) || ".";
    const a = [...args];
    const link = extractUrl(a.join(" "));
    if (link && /(pinterest\.|pin\.it)/i.test(link)) {
      try {
        await react("⬇️");
        const m = await pinFromUrl(link);
        if (m.video) await sock.sendMessage(jid, { video: { url: m.video }, caption: "📌 Pinterest\n🃏 Joker-XD" }, { quoted: msg });
        else if (m.image) {
          const buf = await pinGetImage(m.image);
          if (!buf) throw new Error("Could not download this pin");
          await sock.sendMessage(jid, { image: buf, caption: "📌 Pinterest\n🃏 Joker-XD" }, { quoted: msg });
        } else throw new Error("No media found in this pin");
        await react("✅");
      } catch (e) {
        await react("❌");
        await send(`❌ ${e.message || e}`);
      }
      return { __done: true, value: (true) };
    }
    let amount = 1;
    if (a.length && /^\d{1,3}$/.test(a[0])) amount = parseInt(a.shift(), 10);
    else if (a.length > 1 && /^[x*]\d{1,3}$/i.test(a[a.length - 1])) amount = parseInt(a.pop().slice(1), 10);
    const query = a.join(" ").trim();
    if (!query || amount < 1) {
      await send(`📌 *Pinterest pictures*\n\n• ${pp}pin girls profile picture — 1 picture\n• ${pp}pin 5 cat wallpaper — 5 pictures\n• ${pp}pin <pinterest link> — download that pin\n\n_Max ${PIN_MAX} pictures per request._`);
      return { __done: true, value: (true) };
    }
    if (amount > PIN_MAX) { await send(`ℹ️ Limit is ${PIN_MAX} pictures — sending ${PIN_MAX}.`); amount = PIN_MAX; }
    try {
      await react("🔍");
      const pool = await pinSearch(query);
      if (!pool.length) throw new Error("No pictures found for this search");
      const order = pool.slice(0, amount * 3 + 15).sort(() => Math.random() - 0.5);
      let done = 0;
      for (const u of order) {
        if (done >= amount) break;
        const buf = await pinGetImage(u);
        if (!buf) continue;
        await sock.sendMessage(jid, { image: buf, caption: amount > 1 ? `📌 ${done + 1}/${amount}` : "📌 Pinterest" }, { quoted: msg });
        done++;
        if (amount > 1) await delay(800);
      }
      if (!done) throw new Error("Could not download any picture, try again");
      if (done < amount) await send(`ℹ️ Only ${done}/${amount} pictures could be found.`);
      await react("✅");
    } catch (e) {
      await react("❌");
      await send(`❌ ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
