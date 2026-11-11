// Protected & Obfuscated - _protect.js - Reverse engineering forbidden
'use strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
export function enforceProtection() {

const _0x6a736b8f=["WEhneFlsc3pNVzFiU205clpYSXRXRVFnVUhKdmRHVmpkR2x2YmwxY2VERmlXekJ0SUE9PQ==","VkdocGN5QnpiM1Z5WTJVZ1kyOWtaU0JqWVc1dWIzUWdjblZ1SUhOMFlXNWtZV3h2Ym1VdQ==","VlhObElIUm9aU0J2Wm1acFkybGhiQ0J3Y205MFpXTjBaV1FnYkc5aFpHVnlMZz09","TG1wdmEyVnlMWEoxYm5ScGJXVXVhbk52Ymc9PQ==","TG14dllXUmxjaTF0WVhKclpYST0=","ZFhSbU9BPT0=","VFdsemMybHVaeUJ2Wm1acFkybGhiQ0JzYjJGa1pYSWdjMmxuYm1GMGRYSmxMaUJUYjNWeVkyVWdhWE1nYkc5amEyVmtMZz09"];
const _0x12a0a061=function(_0x){try{return Buffer.from(Buffer.from(_0x,"base64").toString(),"base64").toString("utf8")}catch(e){return ""}};


var _0xb035c844=function(){return _0xb035c844;};var _0xa010c761=[_0xb035c844];
(function(_0xa,_0xb){var _0xc=function(_0xd){while(--_0xd){_0xa.push(_0xa.shift())};};_0xc(++_0xb)})(_0xa010c761,0x1a3);

/**
 * Joker-XD Source Protection
 * Without the official loader signature the process will exit.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function die(msg) {
  console.error(_0x12a0a061(_0x6a736b8f[0]) + msg);
  console.error(_0x12a0a061(_0x6a736b8f[1]));
  console.error(_0x12a0a061(_0x6a736b8f[2]));
  process.exit(1);
}

  const g = globalThis.__JOKER_PROTECTED__;
  if (g && g.active && g.sig && g.loader) return true;
  if (process.env.JOKER_LOADER_ACTIVE === '1' && process.env.JOKER_LOADER_SIG) return true;

  const markers = [
    path.join(__dirname, _0x12a0a061(_0x6a736b8f[3])),
    path.join(process.cwd(), _0x12a0a061(_0x6a736b8f[3])),
    path.join(process.cwd(), _0x12a0a061(_0x6a736b8f[4]))
  ];
  for (const m of markers) {
    try {
      if (fs.existsSync(m)) {
        const data = JSON.parse(fs.readFileSync(m, _0x12a0a061(_0x6a736b8f[5])));
        if (data && data.sig) return true;
      }
    } catch {}
  }
  die(_0x12a0a061(_0x6a736b8f[6]));
}

enforceProtection();
