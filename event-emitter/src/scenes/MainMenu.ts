import { Scene, GameObjects } from "phaser";
import { Button } from "../Button";
import { Checkbox2 } from "../Checkbox2";
import { Checkbox } from "../Checkbox";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    const button = new Button(this, width, height);
    window.button = button;

    this.add.existing(button);

    button.on("click-even", () => {
      console.log("... click even in MainMenu");
    });

    const checkbox = new Checkbox(this, width - 200, height);
    const checkbox2 = new Checkbox2(this, width - 280, height);
    window.checkbox2 = checkbox2;
  }
}
