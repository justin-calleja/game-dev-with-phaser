import { Scene, GameObjects } from "phaser";
import { Button } from "../Button";
import { ButtonContainer } from "../ButtonContainer";
import { addCross, makeDraggable } from "../utils";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  button: Button;

  constructor() {
    super("MainMenu");
  }

  create() {
    console.log("MainMenu - create()");

    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    const button = new ButtonContainer(this, width, height);
    button.setText("Start")
    // this.add.existing(button);

    this.button = new Button(this, width, height);
    this.button.setText("Start 2 hello world");

    button.on("pointerdown", () => {
      button.setPosition(200, 300);
      button.setRotation(Phaser.Math.DegToRad(30));
      button.setScale(2);
    });

    const cross = addCross(this, button.x, button.y, 4)
    this.add.existing(cross);

    makeDraggable(this.button.textGO);

    // this.button.on("pointerdown", () => {
    //   // this.scene.start("Game");
    //   this.button.textGO.setFontFamily(
    //     this.button.textGO.style.fontFamily === "kenney-future"
    //       ? "kenney-future-narrow"
    //       : "kenney-future"
    //   );
    // });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  cleanup() {
    this.button.removeAllListeners();
  }
}
