/**
 * Joker-XD embedded HTML mini-games helper.
 * Uses the same richResponseMessage envelope as Zain XMD / Yorumi style in-chat games.
 * No external website or public game URL is used.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GAME_DIR = path.resolve(__dirname, "..", "game-pages");

/**
 * Builds the rich-response payload.
 * GAME_MODE=inline (default): HTML card is drawn directly inside the message.
 * GAME_MODE=embedded: old style (separate screen behind a button label).
 */
function buildData({ html, label, brand }) {
  const htmlSection = {
    __typename: "GenAIUnifiedResponseSection",
    view_model: {
      __typename: "GenAISingleLayoutViewModel",
      primitive: {
        __typename: "GenAIaeacdsnwHtmlPrimitive",
        payload: html,
        url: "https://example.com",
        trusted_sources: ["example.com"]
      }
    }
  };
  const status = (title, inProgress) => ({
    __typename: "GenAIUnifiedResponseSection",
    view_model: {
      __typename: "GenAISingleLayoutViewModel",
      primitive: {
        __typename: "GenAIBotProgressStatusPrimitive",
        title,
        is_in_progress: inProgress
      }
    }
  });
  const mode = (process.env.GAME_MODE || "inline").toLowerCase();
  if (mode === "embedded") {
    return {
      response_id: randomBytes(16).toString("hex"),
      sections: [status(label, true)],
      embedded_screens: [{
        title: brand,
        content: [{
          __typename: "FOAIDNixelButtonSheets",
          tabs: [{ id: "tab_0", tab_header: "JOKER XD", sections: [htmlSection], step_entries: [] }]
        }]
      }]
    };
  }
  return {
    response_id: randomBytes(16).toString("hex"),
    sections: [status(String(label || "GAME").toUpperCase(), false), htmlSection]
  };
}

// speed mode per game: dt = time-based rAF, frame = per-frame rAF, timer = setInterval, timeout = setTimeout
const SPEED_CFG = {
  "sonic.html": { speed: "dt" },
  "pesawat.html": { speed: "dt" },
  "flappy.html": { speed: "frame" },
  "dino.html": { speed: "frame" },
  "breakout.html": { speed: "frame" },
  "pong.html": { speed: "frame" },
  "stack.html": { speed: "frame" },
  "snake.html": { speed: "timer" },
  "tetris.html": { speed: "timer" },
  "whack.html": { speed: "timer", max: 1000 },
  "simon.html": { speed: "timeout", max: 1500 }
};

/** Adds sound + speaker button + speed select to a game page (runs before the game's own script). */
function injectExtras(html, gameFile) {
  try {
    const extras = fs.readFileSync(path.join(GAME_DIR, "_extras.js"), "utf8");
    const cfg = SPEED_CFG[gameFile] || {};
    const tag = `<script>window.__JK=${JSON.stringify(cfg)};</script><script>${extras}</script>`;
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => m + tag);
    return tag + html;
  } catch (e) {
    console.error("[Joker game] extras not injected:", e?.message || e);
    return html;
  }
}

export async function sendEmbeddedGame({ sock, jid, gameFile, title, brand = "JOKER XD ARCADE" }) {
  if (!sock || typeof sock.relayMessage !== "function") {
    throw new Error("This Baileys connection does not expose relayMessage().");
  }
  if (!jid) throw new Error("Missing chat JID.");

  const fullPath = path.join(GAME_DIR, gameFile);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Game file not found: ${gameFile}`);
  }
  let html = fs.readFileSync(fullPath, "utf8");
  if (!html.trim()) throw new Error(`Game page is empty: ${gameFile}`);
  html = injectExtras(html, gameFile);

  const data = buildData({ html, label: title, brand });
  const message = {
    messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
      botMetadata: {
        messageDisclaimerText: "",
        richResponseSourcesMetadata: {}
      }
    },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          unifiedResponse: {
            data: Buffer.from(JSON.stringify(data), "utf8").toString("base64")
          },
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: { botJid: "0@bot" },
            forwardOrigin: 4
          }
        }
      }
    }
  };

  const messageId = typeof sock.generateMessageTag === "function"
    ? await sock.generateMessageTag()
    : randomBytes(8).toString("hex");

  try {
    await sock.relayMessage(jid, message, { messageId });
  } catch (error) {
    throw new Error(`WhatsApp could not send the embedded ${title} game: ${error?.message || error}`);
  }
}

export async function runEmbeddedGame({ sock, jid, send, gameFile, title }) {
  try {
    await sendEmbeddedGame({ sock, jid, gameFile, title });
  } catch (error) {
    console.error(`[Joker game] ${title}:`, error?.message || error);
    await send(
      `⚠️ *${title} could not be opened inside this WhatsApp chat.*\n\n` +
      `This feature uses WhatsApp's embedded HTML message format, which is not available on every WhatsApp version/device.\n` +
      `Update WhatsApp and try again.\n\n_No external game link was created._`
    );
  }
}

/** Generic embedded HTML card sender */
export async function sendEmbeddedHtml({ sock, jid, html, title = "JOKER XD", buttonTitle = "OPEN" }) {
  if (!sock || typeof sock.relayMessage !== "function") {
    throw new Error("This Baileys connection does not expose relayMessage().");
  }
  if (!jid) throw new Error("Missing chat JID.");

  const data = buildData({ html, label: buttonTitle === "OPEN" ? title : buttonTitle, brand: title });
  const message = {
    messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
      botMetadata: {
        messageDisclaimerText: "",
        richResponseSourcesMetadata: {}
      }
    },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          unifiedResponse: {
            data: Buffer.from(JSON.stringify(data), "utf8").toString("base64")
          },
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: { botJid: "0@bot" },
            forwardOrigin: 4
          }
        }
      }
    }
  };

  const messageId = typeof sock.generateMessageTag === "function"
    ? await sock.generateMessageTag()
    : randomBytes(8).toString("hex");

  await sock.relayMessage(jid, message, { messageId });
}
