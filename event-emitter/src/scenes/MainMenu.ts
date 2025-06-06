import { Scene, GameObjects } from "phaser";
import { Button } from "../Button";
// import { Checkbox2 } from "../Checkbox2";
import { Checkbox } from "../Checkbox";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  button: Button;
  checkbox: Checkbox;

  constructor() {
    super("MainMenu");
  }

  create() {
    console.log("MainMenu - create()")

    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    this.button = new Button(this, width, height);
    window.button = this.button;

    this.add.existing(this.button);

    this.button.on("click-even", () => {
      this.scene.start("Game");
    });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this)

    this.checkbox = new Checkbox(this, width - 200, height);
    window.checkbox = this.checkbox
    this.checkbox.on("is-sound-enabled", (isSoundEnabled) => {
      console.log(`isSoundEnabled is ${isSoundEnabled}`);
    });

    // const checkbox2 = new Checkbox2(this, width - 280, height);
    // window.checkbox2 = checkbox2;
  }

  cleanup() {
    this.button.removeAllListeners();
    this.checkbox.removeAllListeners();
  }
}
