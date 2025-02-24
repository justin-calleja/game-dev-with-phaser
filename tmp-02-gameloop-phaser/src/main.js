import { BoxScene } from "./scenes/BoxScene";
import { TextScene } from "./scenes/TextScene";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  // type: Phaser.AUTO,
  type: Phaser.WEBGL, // Ensure WebGL is used!
  width: 800,
  height: 400,
  parent: "game-container",
  backgroundColor: "#e1e9b7",
  // scale: {
  //     mode: Phaser.Scale.FIT,
  //     autoCenter: Phaser.Scale.CENTER_BOTH
  // },
  scene: [BoxScene, TextScene],
};

export default new Phaser.Game(config);
