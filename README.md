# 🃏 Joker-XD Protected Source

Yeh files **sirf official loader** ke saath chalti hain.

Agar aap is source ko seedha `node index.js` se chalaoge to protection check fail ho jayega aur process exit ho jayega.

## Upload kahan karna hai

In files ko is repo mein upload karo:

**https://github.com/echosonde69-afk/happymode**

Branch: `main`

## Structure

```
happymode/
├── index.js              ← protected entry
├── _protect.js           ← protection module (zaroori)
├── package.json
├── core/
│   ├── helpers.js
│   ├── events.js
│   └── dispatcher.js
├── routes/
│   └── pairing.js
├── joker-plugins/
│   └── ...
├── public/
├── data/
└── game-pages/
```

## Note

- `_protect.js` file delete mat karna
- Har major entry pe protection import maujood hai
- Loader ke baghair yeh source deploy nahi hoga
