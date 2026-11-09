// Joker plugin: sessions  — commands: sessions, stopsession, startsession, delsession
// (extracted from routes/pairing.js line 5370; behaviour unchanged)
import fs from "fs";
import path from "path";
import { MAX_SESSIONS, SESSIONS_DIR, activeSessions, isDeveloper, listSessionNumbers } from "../core/helpers.js";
import { startSession } from "../routes/pairing.js";

export default {
  name: "sessions",
  aliases: ["sessions","stopsession","startsession","delsession"],
  order: 5370,
  legacy: true, // falls through to later plugins unless run() returns { __done }
  match(__ctx) {
    const { cmd } = __ctx;
    return (["sessions", "stopsession", "startsession", "delsession"].includes(cmd));
  },
  async run(__ctx) {
    const { sock, msg, cmd, args, send } = __ctx;
    if (!isDeveloper(sock, msg)) {
      await send("❌ Developer only.");
      return { __done: true, value: (true) };
    }

    if (cmd === "sessions") {
      const online = [...activeSessions.entries()].map(([num, s]) => {
        const up = s.startedAt ? Math.floor((Date.now() - s.startedAt) / 1000) : 0;
        const m = Math.floor(up / 60), sec = up % 60;
        return `• *${num}* — ${s.sock?.user ? "🟢 online" : "⚪ offline"} (${m}m ${sec}s)`;
      });
      const saved = listSessionNumbers().filter(n => !activeSessions.has(n));
      let text = `*🃏 Active Sessions* (${activeSessions.size}/${MAX_SESSIONS})\n\n`;
      text += online.length ? online.join("\n") : "_none online_";
      if (saved.length) {
        text += `\n\n*Saved (not running):*\n` + saved.map(n => `• ${n}`).join("\n");
      }
      text += `\n\n.stopsession <num>\n.startsession <num>\n.delsession <num>`;
      await send(text);
      return { __done: true, value: (true) };
    }

    const target = String(args[0] || "").replace(/\D/g, "");
    if (!target || target.length < 8) {
      await send(`❌ Usage: .${cmd} <number>\nExample: .${cmd} 923001234567`);
      return { __done: true, value: (true) };
    }

    if (cmd === "stopsession") {
      const entry = activeSessions.get(target);
      if (!entry?.sock) {
        await send(`❌ No active session for *${target}*`);
        return { __done: true, value: (true) };
      }
      try {
        if (entry.sock.__presenceInterval) clearInterval(entry.sock.__presenceInterval);
        try { entry.sock.ev.removeAllListeners(); } catch {}
        try { await entry.sock.end?.(undefined); } catch {}
        try { entry.sock.ws?.close?.(); } catch {}
      } catch (e) {
        console.error("[stopsession]", e.message);
      }
      activeSessions.delete(target);
      await send(`✅ Session *${target}* stopped.\nAuth saved — use .startsession ${target} to restore.`);
      return { __done: true, value: (true) };
    }

    if (cmd === "startsession") {
      if (activeSessions.has(target) && activeSessions.get(target)?.sock?.user) {
        await send(`✅ *${target}* is already online.`);
        return { __done: true, value: (true) };
      }
      if (!fs.existsSync(path.join(SESSIONS_DIR, target, "auth"))) {
        await send(`❌ No saved auth for *${target}*. Pair first via web.`);
        return { __done: true, value: (true) };
      }
      if (activeSessions.size >= MAX_SESSIONS && !activeSessions.has(target)) {
        await send(`❌ Session limit full (${MAX_SESSIONS}). Stop one first.`);
        return { __done: true, value: (true) };
      }
      await send(`⏳ Starting session *${target}*...`);
      try {
        await startSession(target, { isRestore: true });
        await send(`✅ Session *${target}* start requested. Wait a few seconds.`);
      } catch (e) {
        await send(`❌ Start failed: ${e.message || e}`);
      }
      return { __done: true, value: (true) };
    }

    if (cmd === "delsession") {
      // Stop if running
      const entry = activeSessions.get(target);
      if (entry?.sock) {
        try {
          if (entry.sock.__presenceInterval) clearInterval(entry.sock.__presenceInterval);
          try { entry.sock.ev.removeAllListeners(); } catch {}
          try { await entry.sock.end?.(undefined); } catch {}
          try { entry.sock.ws?.close?.(); } catch {}
        } catch {}
        activeSessions.delete(target);
      }
      const sessionRoot = path.join(SESSIONS_DIR, target);
      if (!fs.existsSync(sessionRoot)) {
        await send(`❌ No session folder for *${target}*`);
        return { __done: true, value: (true) };
      }
      try {
        fs.rmSync(sessionRoot, { recursive: true, force: true });
        await send(`🗑️ Session *${target}* deleted (auth + data).`);
      } catch (e) {
        await send(`❌ Delete failed: ${e.message || e}`);
      }
      return { __done: true, value: (true) };
    }
  
  }
};
