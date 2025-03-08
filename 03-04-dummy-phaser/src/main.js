import { Scene, Game } from "./dummy-phaser";
/** @typedef {import('./dummy-phaser').RectGameObject} RectGameObject */
/** @typedef {import('./dummy-phaser').TextGameObject} TextGameObject */

class BoxScene extends Scene {
  /** @type {RectGameObject} */
  player;

  playerSpeed = 10;

  constructor() {
    super({ key: "BoxScene" });
  }

  create() {
    this.player = this.add.rectangle(
      0,
      200,
      // this.game.config.height / 2,
      50,
      50,
      0xf96161
    );
  }

  update(_time, deltaTime) {
    // this.player.x += this.playerSpeed * deltaTime;
    this.player.x += this.playerSpeed;
    if (this.player.x > 800) {
      // if (this.player.x > this.game.config.width) {
      this.player.x = -this.player.width;
    }
  }
}

const game = new Game({
  scenes: [new BoxScene()],
  width: 800,
  height: 400,
  parent: document.getElementById("game-container"),
});
