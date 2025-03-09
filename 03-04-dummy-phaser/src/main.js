import { Scene, Game } from "./dummy-phaser";
/** @typedef {import('./dummy-phaser').RectGameObject} RectGameObject */
/** @typedef {import('./dummy-phaser').TextGameObject} TextGameObject */

class BoxScene extends Scene {
  /** @type {RectGameObject} */
  player;

  playerSpeed = 1;

  constructor() {
    super({ key: "BoxScene" });
  }

  create() {
    this.player = this.add.rectangle(
      0,
      this.game.config.height / 2,
      50,
      50,
      0xf96161
    );
  }

  update(_time, deltaTime) {
    this.player.x += this.playerSpeed * deltaTime;
    if (this.player.x > this.game.config.width) {
      this.player.x = -this.player.width;
    }
  }
}

class TextScene extends Scene {
  /**@type{TextGameObject} */
  text;

  constructor() {
    super({ key: "TextScene" });
  }

  create() {
    this.text = this.add.text(20, 40, "hello world", {
      color: "black",
      font: "30px Arial",
    });
  }
}

const game = new Game({
  scenes: [new BoxScene(), new TextScene()],
  width: 800,
  height: 400,
  parent: document.getElementById("game-container"),
});

game.canvas.addEventListener("click", () => {
  game.startScene(
    game.currentScene?.key === "BoxScene" ? "TextScene" : "BoxScene"
  );
});
