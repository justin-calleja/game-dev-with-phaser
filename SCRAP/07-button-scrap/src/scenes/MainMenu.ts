import { Scene, GameObjects } from "phaser";
import { Button } from "../Button";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const btn = new Button(this, 200, 200);
  }
}
