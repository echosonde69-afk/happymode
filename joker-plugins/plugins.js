// Joker plugin: plugins — .plugins (list) / .reloadplugins (re-read the folder without restart)
import { isDeveloper } from "../core/helpers.js";
import { getPlugins, reloadPlugins } from "./_loader.js";

export default {
  name: "plugins",
  aliases: ["plugins", "reloadplugins", "pluginreload"],
  order: 100,
  async run(ctx) {
    const { sock, msg, cmd, send } = ctx;
    if (!isDeveloper(sock, msg)) { await send("❌ Developer only."); return true; }
    if (cmd === "plugins") {
      const list = await getPlugins();
      await send(`🧩 *Joker Plugins* (${list.length})\n\n${list.map((p) => `• ${p.file}`).join("\n")}`);
      return true;
    }
    const n = await reloadPlugins();
    await send(`✅ Plugins reloaded: *${n}* loaded.`);
    return true;
  }
};
