# 🃏 Joker-XD v2.9 Multi-Tenant

WhatsApp Multi-Device bot (Baileys fork with Group Status support) — one server, multiple accounts, **isolated settings per number**.

### Changes in this build (v2.9)
- Fixed `.channeljid` / `.chaneljid` and `.chjid` error handling
- Clear message when WhatsApp returns binary mex response (outdated query)
- Temporary solutions shown in error reply

### Changes in this build
- Added `.gstatus` / `.togroupstatus` / `.togstatus` (reply to image/video/text to post Group Status)
- Pairing, multi-session, and all previous features work the same way

## v2.3 — pairing code fix
- Uses the CURRENT WhatsApp Web version (auto-fetched; override with env `WA_VERSION=2,3000,XXXXXXXXXX`). Old fixed version = WhatsApp rejected the code.
- Baileys `requestPairingCode` now waits for WhatsApp's reply (before, a code was shown even when WhatsApp refused it).
- Old never-linked sockets/keys are cleaned on every new code request; a pairing socket that dies before linking no longer reconnects with a dead code.

## Multi-tenant
- Each paired number has its own folder: `sessions/<number>/auth` + `sessions/<number>/data`
- Owner of a session = that paired number (separate control)
- Settings isolated: mode, prefix, antilink, warns, sudo, ban, autoreact, welcome, etc.
- Server restart → sessions auto-restore from disk

## Limits (2GB RAM)
- Default max concurrent sessions: **5**
- Override: `MAX_SESSIONS=5` env

## Developer-only session commands
Only hardcoded developer (`923354853202` / LID) can use:
- `.sessions` — active + saved list
- `.stopsession <number>` — stop session (auth kept)
- `.startsession <number>` — restore saved session
- `.delsession <number>` — delete auth + data permanently

## Pairing
Open the portal → enter number → get pairing code  
Or: `GET /pair?number=923XXXXXXXXX`

## Run
```bash
OWNER_NUMBER=923xxxxxxxxx PREFIX=. PORT=3000 MAX_SESSIONS=5 npm start
```

## Notes
- Antilink / anti tools: single mode (warn | delete | kick | off) — modes do not stack
- Welcome message once per session (not on every reconnect)
- Download engine: multi-source (no yt-dlp)

## FFmpeg
Bot ships with **@ffmpeg-installer/ffmpeg** (bundled binary).  
No system install needed on most hosts. On first run you will see:
```
[ffmpeg] using: /path/to/node_modules/@ffmpeg-installer/.../ffmpeg
```
If conversion fails, install system ffmpeg as fallback:
```bash
# Debian/Ubuntu
sudo apt update && sudo apt install -y ffmpeg
```

## Antiviewonce fix (v0.01)
- Interceptor now runs for every `messages.upsert` type (not only `notify`) and de-duplicates by message id.
- 3 download retries + `downloadMediaMessage` fallback; detailed `[ANTIVIEWONCE]` console logs.
- Empty `mediaKey` is now logged instead of silently skipped.
- Socket fingerprint like Zain: Ubuntu/Chrome while pairing, Android/Chrome once registered.

## v0.02 — new info format + 🎭 reaction
- Auto antiviewonce: forwarded media is followed by a reply (quoted to the media) — `*ANTIVIEWONCE Captured*`, then "Read more" with Sender / From (Private DM or group name) / Time (+ caption), and `> *Why you so serious*`.
- React with 🎭 on a view-once (owner/sudo only): the bot opens it in the same chat and replies to it with `👁️ *View-once opened via reaction*` (Read more → From / Sender / React). Every other emoji works as before (silent copy to owner DM).

## v0.03 — antichannel + cleanup
- New `.antichannel warn|delete|kick|off` (aliases `.antichanel`, `.antich`): acts on posts forwarded from WhatsApp channels, channel invite cards and channel links sent in a group by non-admins. Same single-mode behaviour as `.antilink` (warn counts up to the warn limit, then kick). The bot must be a group admin. Included in `.rools` (all-anti) and the settings dashboard.
- All bot replies are now English only.
- Provider / API names are no longer shown to users (menu, usage hints, captions, errors, `.togstatus`).

## v0.04 — antichannel shows the channel name
- The antichannel warning now includes the original channel name (read from the forwarded post; if WhatsApp omits it, the bot looks it up by channel JID / invite link; falls back to "Unknown channel").

## v0.05 — session isolation hardening
- Group-metadata cache, delete queue and `.chaneljid` pending list are now keyed per session (bot number), so two bots in the same group never share them (bot-admin status was being mixed between bots).
- Fixed `.chaneljid` list selection (the pending key never matched, so replying with a number did nothing).
- `.setprefix` now says which bot number was changed and logs it; prefix, mode, warn limit, anti* settings, antidelete/antiedit/antiviewonce all live in `sessions/<number>/data/`.
- Defaults for every new session (king or child): antiviewonce ON → owner DM, antidelete ON → owner DM, antiedit ON → owner DM.

## v0.07 — owner isolation fix
- Fixed: replying to a message written by the king (or any owner/sudo/developer) used to make the replier an owner of that bot. The sender identity now comes only from the real sender of the message, never from the quoted message's author.
- Result: a child bot's owner can no longer control the king bot (and the other way round); every session is controlled only by its own paired number.

## v0.08 — per-session menu image
- Fixed: `.setmenuimage` saved one shared file (`assets/menuimage.jpg`), so changing it on one bot changed it on every bot. It is now stored per session (`sessions/<number>/data/menuimage.jpg`); the shared assets image is only a default when a session has none.
- Audited every other setting file, cache and pending-selection map: all other settings (prefix, mode, ban, warns, sudo, antilink, welcome, antiviewonce, antidelete, autoreact, etc.) were already stored/keyed per session.

## v0.09 — premium animated pairing page
- New `public/index.html`: twinkling star sky with sparkle stars and shooting stars, whole theme slowly shifts colour, nebula glow, glass card with rotating colour border, animated gradient title and button, per-character pairing code tiles with a 60s timer bar, cursor spotlight.
- Same `/pair?number=` API and behaviour (Enter key, copy code with fallback). Respects reduced-motion and pauses animation when the tab is hidden.

## v0.10 — Pinterest + bulk adult downloader

- `.pin <query>` → 1 Pinterest picture, `.pin 5 <query>` → 5 pictures (max 30), `.pin <pinterest link>` → that pin.
- `.xxdl <amount> <query>` (also `.xndl`, `.hentaidl`), e.g. `.xxdl 50 Desi video` (max 100). The bot asks:
  1 Only videos (under 64 MB, longer ones are skipped), 2 Only documents (over 64 MB, sent as documents), 3 Combo. Reply with the number.
- `.xxdl <link>` still downloads a single video (under 64 MB as video, bigger as document).
- `.stopdl` cancels a running bulk download.
- `.node <amount> <query>` sends pictures from xvideos/xnxx search results (max 30).
- Downloads are streamed to `temp/adult/` and deleted right after sending (fixes ENOSPC and the 99614720-byte limit error).

## v3.6 — Plugin architecture (Jokers plugins)

```
routes/pairing.js     -> ONLY pairing / sessions / web routes
core/helpers.js       -> shared helpers (config, permissions, channel resolver, anti-*)
core/events.js        -> WhatsApp event handling (messages, groups, anti hooks)
core/dispatcher.js    -> prefix parsing + pre-hooks, then calls the plugins
joker-plugins/*.js    -> ONE FILE PER COMMAND (menu.js, alive.js, ping.js, ...)
```

* **Upgrade a command:** replace its file in `joker-plugins/` (then `.reloadplugins`, or restart).
* **Add a command:** copy `joker-plugins/_template.js` to `joker-plugins/mycmd.js`, set `aliases` and write `run(ctx)`.
* **Remove a command:** delete its file.
* `.plugins` lists loaded plugins, `.reloadplugins` re-reads the folder (developer only).
* Files starting with `_` are internal (loader, shared locals, template).
* `order` decides who is checked first (lower = first). A plugin whose `run()` returns `true` stops the chain.

### New in 3.6
* `.antitag limit <2-100>|auto` — mass-tag threshold per group (admins/owner are exempt).
* `.hidetag <text>` edits your own command message into the text with a hidden mention-all (needs the command to be sent from the bot's own account, 15 min window). `.htmode edit|send` switches between edit and delete+send.
