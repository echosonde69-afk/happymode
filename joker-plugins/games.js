// Joker-XD: .games / .gamelist / .arcade — list all in-chat games
export default {
  name: "games",
  aliases: ["games", "gamelist", "arcade"],
  order: 1200,
  async run(ctx) {
    const { send, prefix } = ctx;
    const p = prefix || ".";
    await send(
`🎮 *JOKER XD ARCADE — 20 GAMES*

*ACTION*
1. ${p}sonic — Speed Runner
2. ${p}pesawat — Space Rush
3. ${p}flappy — Flappy Bird
4. ${p}dino — Dino Run
5. ${p}breakout — Brick Breaker
6. ${p}pong — Pong vs Bot
7. ${p}snake — Snake
8. ${p}stack — Stack Tower

*PUZZLE & BRAIN*
9. ${p}slot — Fruit Match
10. ${p}2048 — 2048
11. ${p}tetris — Tetris
12. ${p}mines — Minesweeper
13. ${p}slide — Slide Puzzle
14. ${p}lights — Lights Out
15. ${p}simon — Simon Says
16. ${p}hangman — Hangman
17. ${p}quiz — Quiz Time

*SPEED*
18. ${p}whack — Whack-a-Mole
19. ${p}reaction — Reaction Test
20. ${p}tapspeed — Tap Speed

_Single-player games open as embedded WhatsApp messages when supported by your WhatsApp version._
_Powered by Joker-XD_`
    );
    return true;
  }
};
