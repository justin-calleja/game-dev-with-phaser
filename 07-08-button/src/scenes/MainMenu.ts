import { Scene, GameObjects } from "phaser";
import { Button } from "../Button";
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

    new Button(this, width, height);

    const checkbox = new Checkbox(this, width - 200, height);
    window.checkbox = checkbox;
  }
}
