// Copy this file to add a new command: joker-plugins/mycmd.js
// ctx has: sock, msg, jid, cmd, args, body, prefix, send(text), react(emoji), parts, isDev ...
// (helpers like isOwner/readJson/sf are imported from ../core/helpers.js)
export default {
  name: "mycmd",
  aliases: ["mycmd", "mc"],
  order: 5000,
  async run(ctx) {
    const { send } = ctx;
    await send("Hello from my new plugin ✅");
    return true; // handled
  }
};
