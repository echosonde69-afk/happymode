// Joker-XD Arcade launcher — all 20 single-player embedded games
import { runEmbeddedGame } from "./_richgame.js";

const GAMES = {
  sonic:     { file: "sonic.html",     title: "SONIC — Speed Runner" },
  pesawat:   { file: "pesawat.html",   title: "PESAWAT — Space Rush" },
  flappy:    { file: "flappy.html",    title: "FLAPPY BIRD" },
  dino:      { file: "dino.html",      title: "DINO RUN" },
  breakout:  { file: "breakout.html",  title: "BREAKOUT" },
  pong:      { file: "pong.html",      title: "PONG" },
  snake:     { file: "snake.html",     title: "SNAKE" },
  stack:     { file: "stack.html",     title: "STACK TOWER" },
  slot:      { file: "fruit-match.html", title: "FRUIT MATCH" },
  "2048":    { file: "2048.html",      title: "2048" },
  tetris:    { file: "tetris.html",    title: "TETRIS" },
  mines:     { file: "mines.html",     title: "MINESWEEPER" },
  slide:     { file: "slide.html",     title: "SLIDE PUZZLE" },
  lights:    { file: "lights.html",    title: "LIGHTS OUT" },
  simon:     { file: "simon.html",     title: "SIMON SAYS" },
  hangman:   { file: "hangman.html",   title: "HANGMAN" },
  quiz:      { file: "quiz.html",      title: "QUIZ TIME" },
  whack:     { file: "whack.html",     title: "WHACK-A-MOLE" },
  reaction:  { file: "reaction.html",  title: "REACTION TEST" },
  tapspeed:  { file: "tapspeed.html",  title: "TAP SPEED" }
};

const ALIASES = Object.keys(GAMES);

export default {
  name: "arcade",
  aliases: ALIASES,
  order: 1210,
  match(ctx) {
    return ALIASES.includes(ctx.cmd);
  },
  async run(ctx) {
    const { sock, jid, send, cmd, react } = ctx;
    const g = GAMES[cmd];
    if (!g) {
      await send("❌ Unknown game.");
      return true;
    }
    try {
      if (react) await react("🎮");
      await runEmbeddedGame({
        sock,
        jid,
        send,
        gameFile: g.file,
        title: g.title
      });
    } catch (e) {
      console.error("[arcade]", e?.message || e);
      await send(`❌ Failed to launch *${g.title}*\n${e?.message || e}`);
    }
    return true;
  }
};
