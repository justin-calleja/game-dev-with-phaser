import { Game } from "./scenes/Game";
import { Preloader } from "./scenes/Preload";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
/** @type{Phaser.Types.Core.GameConfig} */
const config = {
  type: Phaser.AUTO,
  //   width: 1024,
  //   height: 768,
  width: 800,
  height: 600,
  parent: "game-container",
  // backgroundColor: "#028af8",
  //   scale: {
  //     mode: Phaser.Scale.FIT,
  //     autoCenter: Phaser.Scale.CENTER_BOTH,
  //   },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0, x: 0 },
    },
  },
  scene: [Preloader, Game],
};

export default new Phaser.Game(config);
