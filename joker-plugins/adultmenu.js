// Joker plugin: adultmenu  — commands: adultmenu, adult
// (extracted from routes/pairing.js line 9670; behaviour unchanged)
import { ADULT_MAX_AMOUNT, ADULT_MAX_IMAGES } from "../core/helpers.js";

export default {
  name: "adultmenu",
  aliases: ["adultmenu","adult"],
  order: 9670,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["adultmenu", "adult"].includes(cmd));
  },
  async run(__ctx) {
    const { send } = __ctx;
    const { aPrefix } = __ctx.locals;
    await send(
      `🔞 *ADULT MENU*\n\n` +
      `*Bulk video download* (limit ${ADULT_MAX_AMOUNT})\n` +
      `• ${aPrefix}xxdl <amount> <query> — xvideos\n` +
      `• ${aPrefix}xndl <amount> <query> — xnxx\n` +
      `• ${aPrefix}hentaidl <amount> <query> — hentai\n` +
      `   e.g. ${aPrefix}xxdl 50 Desi video\n` +
      `   The bot then asks: *1* Only videos • *2* Only documents • *3* Combo — reply with the number.\n` +
      `• ${aPrefix}stopdl — cancel a running download\n\n` +
      `*Pictures*\n` +
      `• ${aPrefix}node <amount> <query> — e.g. ${aPrefix}node 5 boobs (max ${ADULT_MAX_IMAGES})\n\n` +
      `*Search & pick*\n` +
      `• ${aPrefix}xxsearch <query> — search xvideos\n` +
      `• ${aPrefix}xnsearch <query> — search xnxx\n` +
      `• ${aPrefix}hentai <query> — search hentai\n` +
      `   Reply to the list with 1 / 1,3,4 / all to download.\n\n` +
      `*Single link*\n` +
      `• ${aPrefix}xxdl <xvideos link> • ${aPrefix}xndl <xnxx link> • ${aPrefix}hentaidl <link>\n\n` +
      `_Under 64 MB is sent as a video, bigger files as a document._`
    );
    return { __done: true, value: (true) };
  
  }
};
