# @zainxmd/baileys

**ZainXMD Baileys** — WhatsApp Multi-Device library (Baileys fork)

## Fixes vs outlaw1 / lordmega Baileys

| Problem in outlaw1 | Fixed here |
|---|---|
| Video Play button hidden | Restored normal **Play** button |
| "View Channel" on bot videos | Removed |
| Channel auto-follow via media branding | Removed |

## Features kept

- `sock.rvo()` — Reveal View Once
- Android browser support for view-once media
- Group Status / Interactive messages / Album support
- All core Baileys multi-device APIs

## Install

```bash
npm install github:ZainXMD/baileys
```

Or alias as official name in your bot `package.json`:

```json
{
  "dependencies": {
    "@whiskeysockets/baileys": "github:ZainXMD/baileys"
  }
}
```

```js
import makeWASocket from '@whiskeysockets/baileys'
```

## Credits

- Base: [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)
- Upstream fork features: [LORDMEGA-MD/baileys](https://github.com/LORDMEGA-MD/baileys) / `@outlaw1/baileys`
- Modification (View Channel / branding removal): **ZainXMD**

## License

MIT
