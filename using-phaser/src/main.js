import { Game, Scene } from "phaser";

class BoxScene extends Scene {
  player;

  playerSpeed = 1;

  constructor() {
    super({ key: "BoxScene" });
  }

  create() {
    this.player = this.add.rectangle(
      0,
      this.scale.height / 2,
      50,
      50,
      0xf96161
    );

    this.input.on("pointerdown", () => {
      this.scene.switch("TextScene");
    });
  }

  update(_time, deltaTime) {
    this.player.x += this.playerSpeed * deltaTime;
    if (this.player.x > this.scale.width) {
      this.player.x = -this.player.width;
    }
  }
}

class TextScene extends Scene {
  text;

  constructor() {
    super({ key: "TextScene" });
  }

  create() {
    this.text = this.add.text(20, 40, "hello world", {
      color: "black",
      font: "30px Arial",
    });

    this.input.on("pointerdown", () => {
      this.scene.switch("BoxScene");
    });
  }
}

export default new Game({
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  parent: "game-container",
  backgroundColor: "#E1E9B7",
  scene: [BoxScene, TextScene],
  fps: {
    limit: 30,
  },
});
