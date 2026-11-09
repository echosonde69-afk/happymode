// Joker plugin: approve  — commands: approve, approverequests, approveall
// (extracted from routes/pairing.js line 7725; behaviour unchanged)
import { APPROVE_GROUP_LIMIT, approveGroupRequests, getPrefix, isGroup, requireGroupAdmin } from "../core/helpers.js";

export default {
  name: "approve",
  aliases: ["approve","approverequests","approveall"],
  order: 7725,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["approve", "approverequests", "approveall"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, args, jid, send } = __ctx;
    if (!isGroup(jid)) { await send("This command can only be used in a group."); return { __done: true, value: (true) }; }
    try {
      const meta = await requireGroupAdmin(sock, msg, send);
      if (!meta) return { __done: true, value: (true) };

      const mode = String(args[0] || "").toLowerCase();
      let amount = null;
      if (mode === "all" || mode === "approveall" || !mode) {
        amount = null;
      } else if (/^\d+$/.test(mode)) {
        amount = Number(mode);
        if (amount < 1) { await send("Amount must be at least 1."); return { __done: true, value: (true) }; }
      } else {
        await send(`Usage: ${getPrefix(sock)}approve all\nOr: ${getPrefix(sock)}approve <amount>`);
        return { __done: true, value: (true) };
      }

      const result = await approveGroupRequests(sock, jid, amount);
      if (result.pendingBefore === 0) {
        await send("There are no pending join requests.");
        return { __done: true, value: (true) };
      }

      if (result.full && result.pendingLeft > 0) {
        await send(
          `The group is full (${result.finalMembers}/${APPROVE_GROUP_LIMIT} members).\n` +
          `Approved: ${result.approved} request(s).\n` +
          `Pending requests remaining: ${result.pendingLeft}.`
        );
        return { __done: true, value: (true) };
      }

      await send(
        `Approval complete.\n` +
        `Approved: ${result.approved} request(s).\n` +
        `Group members: ${result.finalMembers}/${APPROVE_GROUP_LIMIT}.\n` +
        `Pending requests remaining: ${result.pendingLeft}.`
      );
    } catch (e) {
      await send(`Approval failed: ${e.message || e}`);
    }
    return { __done: true, value: (true) };
  
  }
};
