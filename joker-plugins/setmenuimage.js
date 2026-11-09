// Joker plugin: setmenuimage  — commands: setmenuimage, setmenuimg
// (extracted from routes/pairing.js line 6255; behaviour unchanged)
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "fs";
import { commandPrivileged, getQuotedMsg, sf, uploadCatbox, writeJson } from "../core/helpers.js";

export default {
  name: "setmenuimage",
  aliases: ["setmenuimage","setmenuimg"],
  order: 6255,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["setmenuimage","setmenuimg"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, send } = __ctx;
    if (!commandPrivileged(sock, msg, send)) return { __done: true, value: (true) };
    const quoted = getQuotedMsg(msg);
    const imgMsg = quoted?.message?.imageMessage || quoted?.message?.viewOnceMessage?.message?.imageMessage || quoted?.message?.viewOnceMessageV2?.message?.imageMessage;
    if (!imgMsg) { await send("❌ Reply to an image with .setmenuimage"); return { __done: true, value: (true) }; }
    try {
      const srcMsg = { ...quoted, message: { imageMessage: imgMsg } };
      const buf = await downloadMediaMessage(srcMsg, "buffer", {}, { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage });
      if (!buf || !buf.length) throw new Error("Empty image buffer");
      // Saved inside THIS session's own data folder, so it never changes another bot's menu image
      const localPath = sf(sock, "menuimage.jpg");
      fs.writeFileSync(localPath, buf);
      // Optional catbox backup URL (non-blocking)
      let url = "";
      try { url = await uploadCatbox(buf, "menu.jpg"); writeJson(sf(sock, "menu-image.json"), { url }); } catch {}
      await send(`✅ Menu image updated (local).${url ? "\n" + url : ""}`);
    } catch (e) { await send(`❌ Menu image failed: ${e.message || e}`); }
    return { __done: true, value: (true) };
  
  }
};
