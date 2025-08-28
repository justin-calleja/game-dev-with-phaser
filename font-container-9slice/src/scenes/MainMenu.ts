import { Scene, GameObjects } from "phaser";
import { Button } from "../Button";

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

    this.button = new Button(this, width, height);
    this.add.existing(this.button);
    this.button.setText("Start");
    window.button = this.button;

    this.button.on("pointerdown", () => {
      this.button.setPosition(500, 400);
    });

    this.button.on("pointerdown", () => {
      // this.scene.start("Game");
      this.button.textGO.setFontFamily(
        this.button.textGO.style.fontFamily === "kenney-future"
          ? "kenney-future-narrow"
          : "kenney-future"
      );
    });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  cleanup() {
    this.button.removeAllListeners();
  }
}
