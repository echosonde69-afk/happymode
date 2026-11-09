import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import pairing from "./routes/pairing.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 3000);

// ==================== SMART PUBLIC URL + AUTO IP ====================
async function getPublicUrl() {
  // 1. User ne PUBLIC_URL set kiya ho to wahi use karo
  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL.replace(/\/$/, "");
  }

  // 2. Popular hosting platforms auto-detect
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  }
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  if (process.env.KOYEB_APP_DOMAIN) {
    return `https://${process.env.KOYEB_APP_DOMAIN}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }

  // 3. Auto Public IP Detection (Cypher-X style)
  const ipServices = [
    "https://api.ipify.org",
    "https://api64.ipify.org",
    "https://ifconfig.me/ip",
    "https://icanhazip.com",
    "https://ident.me"
  ];

  for (const service of ipServices) {
    try {
      const res = await axios.get(service, {
        timeout: 5000,
        responseType: "text",
        headers: { "User-Agent": "Joker-XD" }
      });
      const ip = String(res.data || "").trim();
      // Basic IP validation
      if (ip && /^[\d.:a-fA-F]+$/.test(ip) && ip.length >= 7) {
        return `http://${ip}:${PORT}`;
      }
    } catch (e) {
      // try next service
    }
  }

  // 4. Final fallback
  return null;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/pair", pairing);

app.get("/health", (_req, res) =>
  res.json({ ok: true, name: "Joker-XD v2.0.2", port: PORT })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server after detecting public URL
(async () => {
  const PUBLIC_URL = await getPublicUrl();

  app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("========================================");
    console.log("     🃏 JOKER-XD v2.0.2  FINAL");
    console.log("========================================");

    if (PUBLIC_URL) {
      console.log(`\x1b[33mPAIRING URL:\x1b[0m \x1b[36m${PUBLIC_URL}\x1b[0m`);
      console.log("\x1b[32mClick on the link 🖇️  👆🏼\x1b[0m");
    } else {
      console.log(`\x1b[33mPORT:\x1b[0m \x1b[36m${PORT}\x1b[0m`);
      console.log(`\x1b[33mPAIRING URL:\x1b[0m \x1b[36mhttp://YOUR-SERVER-IP:${PORT}\x1b[0m`);
      console.log("");
      console.log("\x1b[90mTip: you can set the PUBLIC_URL env variable\x1b[0m");
      console.log("\x1b[90mExample: PUBLIC_URL=http://fi6.bot-hosting.net:21425\x1b[0m");
    }

    console.log("========================================");
  });
})();
