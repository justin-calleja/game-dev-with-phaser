import { Scene, GameObjects } from "phaser";
import { Button, ButtonEvents } from "../Button";
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

    const btn = new Button(this, width, height);
    window.btn = btn;
    btn.on("clicked2", ({ counter }) => {
      console.log("MainMenu >> btn clicked with counter", counter);
      // this.scene.pause();
    });

    // this.events.on("pause", () => {
    //   btn.off
    // });

    window.mainMenu = this;

    const checkbox = new Checkbox(this, width - 200, height);
    checkbox.on("checked", () => {
      btn.pressOffset = 2;
    });

    checkbox.on("unchecked", () => {
      btn.pressOffset = 0;
    });
  }
}
