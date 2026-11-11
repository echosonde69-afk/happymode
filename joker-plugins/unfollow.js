// Joker-XD (OWNER): channel unfollow manager
//   .unfollow ch            -> numbered list of all followed channels
//   .keep 1,2,6             -> keep these, unfollow all the others
//   .unfollow 2,3,6-9       -> unfollow only these
//   .unfollow all           -> unfollow every followed channel
//   .all unfollow           -> same as .unfollow all
import {
  chCacheSave,
  chDeepCollect,
  chFetchFollowed,
  chFindNameDeep,
  chErrText,
  chWithTimeout,
  commandPrivileged,
  jidNumber,
  mcKey
} from "../core/helpers.js";

// sender -> { channels: [{id,name}], expires }
const pending = new Map();
const TTL = 15 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function senderKey(sock, msg, jid) {
  const who = msg.key.fromMe ? sock.user?.id : (msg.key.participant || msg.key.remoteJid || jid);
  return mcKey(sock, jidNumber(who));
}

function label(c, i) {
  const raw = String(c.name || "").trim();
  const name = raw && !/^unknown channel$/i.test(raw) ? raw : `(name unavailable) …${String(c.id).replace(/@.*/, "").slice(-6)}`;
  return `${i + 1}. ${name}`;
}

// "1,2, 5-7" -> { nums:[1,2,5,6,7], bad:[...] }
function parseNumbers(text, max) {
  const nums = new Set();
  const bad = [];
  for (const tok of String(text || "").split(/[,\s]+/).filter(Boolean)) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(tok);
    if (!m) { bad.push(tok); continue; }
    let a = parseInt(m[1], 10);
    let b = m[2] ? parseInt(m[2], 10) : a;
    if (a > b) [a, b] = [b, a];
    if (a < 1 || b > max) { bad.push(tok); continue; }
    for (let n = a; n <= b; n++) nums.add(n);
  }
  return { nums: [...nums].sort((x, y) => x - y), bad };
}

const isUnknown = (n) => !String(n || "").trim() || /^unknown channel$/i.test(String(n).trim());

// Followed-list often comes without names -> look each one up by JID (5 at a time) and cache it.
async function fillNames(sock, list) {
  if (typeof sock.newsletterMetadata !== "function") return;
  const todo = list.filter((c) => isUnknown(c.name));
  let idx = 0;
  const worker = async () => {
    while (idx < todo.length) {
      const c = todo[idx++];
      try {
        const meta = await chWithTimeout(sock.newsletterMetadata("jid", c.id), 10000, "name lookup");
        const name = (chDeepCollect(meta)[0]?.name || chFindNameDeep(meta) || "").trim();
        if (name) {
          c.name = name;
          try { chCacheSave(sock, { jid: c.id, name, code: c.invite }); } catch {}
        }
      } catch {}
      await sleep(250);
    }
  };
  await Promise.all(Array.from({ length: Math.min(5, todo.length) }, worker));
}

async function loadList(sock, send, pp) {
  const res = await chFetchFollowed(sock);
  const list = (res.list || []).filter((c) => c && c.id);
  if (!list.length) {
    await send(res.liveOk
      ? "❌ This account follows no channels."
      : "❌ Could not read the followed-channel list right now. Try again in a moment.");
    return null;
  }
  if (list.some((c) => isUnknown(c.name))) {
    await send(`⏳ Reading channel names (${list.filter((c) => isUnknown(c.name)).length})… please wait`);
    await fillNames(sock, list);
  }
  list.sort((a, b) => {
    const ua = isUnknown(a.name), ub = isUnknown(b.name);
    if (ua !== ub) return ua ? 1 : -1; // unnamed ones go last
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  return { list, source: res.source };
}

async function unfollowMany(sock, send, targets) {
  await send(`⏳ Unfollowing ${targets.length} channel${targets.length > 1 ? "s" : ""}…`);
  let ok = 0;
  const failed = [];
  for (const c of targets) {
    try {
      await sock.newsletterUnfollow(c.id);
      ok++;
    } catch (e) {
      failed.push(`${String(c.name || c.id).slice(0, 40)} — ${chErrText(e)}`.slice(0, 120));
    }
    await sleep(1100);
  }
  let out = `✅ Unfollowed: ${ok}/${targets.length}`;
  if (failed.length) out += `\n\n❌ Failed (${failed.length}):\n${failed.map((f) => `• ${f}`).join("\n")}`;
  return out;
}

export default {
  name: "unfollow",
  aliases: ["unfollow", "keep", "all"],
  order: 1230,
  match(ctx) {
    const { cmd, args } = ctx;
    if (cmd === "unfollow" || cmd === "keep") return true;
    // ".all unfollow" only — never swallow other ".all" uses
    return cmd === "all" && String(args?.[0] || "").toLowerCase() === "unfollow";
  },
  async run(ctx) {
    const { sock, msg, jid, cmd, args, send, prefix } = ctx;
    if (!commandPrivileged(sock, msg, send)) return true;
    const pp = prefix || ".";
    const key = senderKey(sock, msg, jid);
    const word = String(args?.[0] || "").toLowerCase();

    try {
      // ---------- .unfollow ch  (list) ----------
      if (cmd === "unfollow" && (word === "ch" || word === "list" || word === "channels")) {
        const got = await loadList(sock, send, pp);
        if (!got) return true;
        pending.set(key, { channels: got.list.map((c) => ({ id: c.id, name: c.name })), expires: Date.now() + TTL });
        await send(
          `📣 *Followed Channels* (${got.list.length})\n\n${got.list.map(label).join("\n")}\n\n` +
          `Reply with:\n` +
          `• *${pp}keep 1,2,6* — keep these, unfollow the rest\n` +
          `• *${pp}unfollow 2,3,6-9* — unfollow only these\n` +
          `• *${pp}unfollow all* — unfollow everything`
        );
        return true;
      }

      // ---------- all ----------
      if ((cmd === "all" && word === "unfollow") || (cmd === "unfollow" && word === "all")) {
        const got = await loadList(sock, send, pp);
        if (!got) return true;
        pending.delete(key);
        await send(await unfollowMany(sock, send, got.list));
        return true;
      }

      // ---------- keep / unfollow <numbers> need the list ----------
      if (cmd === "keep" || cmd === "unfollow") {
        const nums = args.join(" ").trim();
        if (!nums) {
          await send(cmd === "keep"
            ? `Usage: *${pp}keep 1,2,6* (run *${pp}unfollow ch* first)`
            : `Usage:\n• *${pp}unfollow ch* — list channels\n• *${pp}unfollow 2,3,6* — unfollow these\n• *${pp}unfollow all* — unfollow everything`);
          return true;
        }
        const p = pending.get(key);
        if (!p || Date.now() > p.expires) {
          pending.delete(key);
          await send(`⚠️ No active list. Send *${pp}unfollow ch* first, then use the numbers.`);
          return true;
        }
        const { nums: picked, bad } = parseNumbers(nums, p.channels.length);
        if (bad.length || !picked.length) {
          await send(`❌ Invalid number${bad.length > 1 ? "s" : ""}: ${bad.join(", ") || nums}\nUse numbers between 1 and ${p.channels.length}.`);
          return true;
        }
        const pickedSet = new Set(picked);
        let targets;
        if (cmd === "keep") {
          targets = p.channels.filter((_, i) => !pickedSet.has(i + 1));
          if (!targets.length) { await send("✅ Nothing to unfollow — you kept every channel."); return true; }
          await send(`🔒 Keeping ${picked.length}, unfollowing ${targets.length}.`);
        } else {
          targets = p.channels.filter((_, i) => pickedSet.has(i + 1));
        }
        pending.delete(key); // numbers change after unfollowing, so ask for a fresh list next time
        const summary = await unfollowMany(sock, send, targets);
        await send(`${summary}\n\n_Send *${pp}unfollow ch* for the updated list._`);
        return true;
      }
    } catch (e) {
      console.error("[unfollow]", e?.message || e);
      await send(`❌ Failed: ${chErrText(e)}`);
    }
    return true;
  }
};
