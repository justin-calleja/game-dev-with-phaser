import { Scene, Game } from "./dummy-phaser";

// user defines BoxScene extending Scene

// user defines TextScene extending Scene

const game = new Game({
  scenes: [BoxScene, TextScene],
});
