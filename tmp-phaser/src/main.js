import { Scene, Game } from "phaser";

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

    this.input.once("pointerdown", () => {
      this.scene.start("TextScene");
    });
  }

  update(_time, deltaTime) {
    this.player.x += this.playerSpeed * deltaTime;
    if (this.player.x > this.scale.width) {
      this.player.x = -this.player.width;
    }
  }
}

class TextScene extends Phaser.Scene {
  text;

  constructor() {
    super({ key: "TextScene" });
  }

  create() {
    this.text = this.add.text(20, 40, "hello world", {
      color: "black",
      font: "30px Arial",
    });

    this.input.once("pointerdown", () => {
      this.scene.start("BoxScene");
    });
  }
}

// //  Find out more information about the Game Config at:
// //  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
// /**@type{Phaser.Types.Core.GameConfig} */
// const config = {
//   type: Phaser.AUTO,
//   width: 1024,
//   height: 768,
//   parent: "game-container",
//   backgroundColor: "#028af8",
//   scale: {
//     mode: Phaser.Scale.FIT,
//     autoCenter: Phaser.Scale.CENTER_BOTH,
//   },
//   scene: [Boot, Preloader, MainMenu, Game, GameOver],
//   //   banner: {
//   //     hidePhaser: true,
//   //   }
// };

const game = new Game({
  scene: [BoxScene, TextScene],
  width: 800,
  height: 400,
  backgroundColor: "#E1E9B7",
  parent: document.getElementById("game-container"),
  fps: {
    limit: 30,
  },
});

// export default new Phaser.Game(config);
