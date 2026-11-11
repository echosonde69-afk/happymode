// Protected & Obfuscated - index.js - Reverse engineering forbidden
'use strict';
import './_protect.js';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import pairing from "./routes/pairing.js";

const _0x8bc39607=["ZFc1allYVm5hSFJGZUdObGNIUnBiMjQ9","VzNWdVkyRjFaMmgwUlhoalpYQjBhVzl1WFE9PQ==","ZFc1b1lXNWtiR1ZrVW1WcVpXTjBhVzl1","VzNWdWFHRnVaR3hsWkZKbGFtVmpkR2x2YmwwPQ==","YUhSMGNITTZMeTloY0drdWFYQnBabmt1YjNKbg==","YUhSMGNITTZMeTloY0drMk5DNXBjR2xtZVM1dmNtYz0=","YUhSMGNITTZMeTlwWm1OdmJtWnBaeTV0WlM5cGNBPT0=","YUhSMGNITTZMeTlwWTJGdWFHRjZhWEF1WTI5dA==","YUhSMGNITTZMeTlwWkdWdWRDNXRaUT09","ZEdWNGRBPT0=","VlhObGNpMUJaMlZ1ZEE9PQ==","U205clpYSXRXRVE9","Y0hWaWJHbGo=","TDNCaGFYST0=","TDJobFlXeDBhQT09","U205clpYSXRXRVFnZGpJdU1DNHk=","YVc1a1pYZ3VhSFJ0YkE9PQ==","TUM0d0xqQXVNQT09","UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBRPT0=","SUNBZ0lDRHduNE9QSUVwUFMwVlNMVmhFSUhZeUxqQXVNaUFnUmtsT1FVdz0=","WEhneFlsc3pNbTFEYkdsamF5QnZiaUIwYUdVZ2JHbHVheUR3bjVhSDc3aVBJQ0R3bjVHRzhKK1B2Rng0TVdKYk1HMD0=","WEhneFlsczVNRzFVYVhBNklIbHZkU0JqWVc0Z2MyVjBJSFJvWlNCUVZVSk1TVU5mVlZKTUlHVnVkaUIyWVhKcFlXSnNaVng0TVdKYk1HMD0="];
const _0xcb1be1b5=function(_0x){try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return ""}};


var _0x207f46ff=function(){return _0x207f46ff;};var _0x8ee45d1a=[_0x207f46ff];
(function(_0xa,_0xb){var _0xc=function(_0xd){while(--_0xd){_0xa.push(_0xa.shift())};};_0xc(++_0xb)})(_0x8ee45d1a,0x1a3);

// ==================== JOKER-XD SOURCE PROTECTION ====================
// ====================================================================


process.on(_0xcb1be1b5(_0x8bc39607[0]), (e) => console.error(_0xcb1be1b5(_0x8bc39607[1]), e?.stack || e));
process.on(_0xcb1be1b5(_0x8bc39607[2]), (e) => console.error(_0xcb1be1b5(_0x8bc39607[3]), e?.stack || e));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 3000);

async function getPublicUrl() {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/$/, "");
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  if (process.env.KOYEB_APP_DOMAIN) return `https://${process.env.KOYEB_APP_DOMAIN}`;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;

  const ipServices = [
    _0xcb1be1b5(_0x8bc39607[4]),
    _0xcb1be1b5(_0x8bc39607[5]),
    _0xcb1be1b5(_0x8bc39607[6]),
    _0xcb1be1b5(_0x8bc39607[7]),
    _0xcb1be1b5(_0x8bc39607[8])
  ];

  for (const service of ipServices) {
    try {
      const res = await axios.get(service, {
        timeout: 5000,
        responseType: _0xcb1be1b5(_0x8bc39607[9]),
        headers: { _0xcb1be1b5(_0x8bc39607[10]): _0xcb1be1b5(_0x8bc39607[11]) }
      });
      const ip = String(res.data || "").trim();
      if (ip && /^[\d.:a-fA-F]+$/.test(ip) && ip.length >= 7) {
        return `http://${ip}:${PORT}`;
      }
    } catch (e) {}
  }
  return null;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, _0xcb1be1b5(_0x8bc39607[12]))));
app.use(_0xcb1be1b5(_0x8bc39607[13]), pairing);

app.get(_0xcb1be1b5(_0x8bc39607[14]), (_req, res) =>
  res.json({ ok: true, name: _0xcb1be1b5(_0x8bc39607[15]), port: PORT })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, _0xcb1be1b5(_0x8bc39607[12]), _0xcb1be1b5(_0x8bc39607[16])));
});

(async () => {
  const PUBLIC_URL = await getPublicUrl();

  app.listen(PORT, _0xcb1be1b5(_0x8bc39607[17]), () => {
    console.log("");
    console.log(_0xcb1be1b5(_0x8bc39607[18]));
    console.log(_0xcb1be1b5(_0x8bc39607[19]));
    console.log(_0xcb1be1b5(_0x8bc39607[18]));

    if (PUBLIC_URL) {
      console.log(`\x1b[33mPAIRING URL:\x1b[0m \x1b[36m${PUBLIC_URL}\x1b[0m`);
      console.log(_0xcb1be1b5(_0x8bc39607[20]));
    } else {
      console.log(`\x1b[33mPORT:\x1b[0m \x1b[36m${PORT}\x1b[0m`);
      console.log(`\x1b[33mPAIRING URL:\x1b[0m \x1b[36mhttp://YOUR-SERVER-IP:${PORT}\x1b[0m`);
      console.log("");
      console.log(_0xcb1be1b5(_0x8bc39607[21]));
    }
    console.log(_0xcb1be1b5(_0x8bc39607[18]));

    if (PUBLIC_URL) {
      setInterval(() => {
        axios.get(`${PUBLIC_URL}/health`, { timeout: 15000 }).catch(() => {});
      }, 4 * 60 * 1000);
    }
  });
})();
