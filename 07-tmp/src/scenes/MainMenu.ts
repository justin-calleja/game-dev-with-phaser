import { Scene, type GameObjects } from "phaser";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { BtnGO } from "../BtnGO";

import InGameLogger from "../logger/InGameLogger";
import Logger from "../logger/Logger";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  button: Button;
  btnGO: BtnGO;
  checkbox: Checkbox;

  private logger!: Logger;

  constructor() {
    super("MainMenu");
  }

  init() {
    this.logger = new Logger();
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    this.button = new Button(this, width, height);

    this.checkbox = new Checkbox(this, width - 200, height);

    this.button.on("click", () => {
      console.log("button clicked");
    });

    this.btnGO = new BtnGO(this, width, height + 100);
    this.add.existing(this.btnGO);

    this.btnGO.on("click", () => {
      this.scene.start("Game");
    });

    const color = 0xa52a2a;
    const outerStrength = 20;
    const innerStrength = 0;
    // const knockout = false;
    // const quality = 1;
    // const distance = 20;

    const effect = this.btnGO.postFX.addGlow(
      color,
      outerStrength,
      innerStrength
      // knockout,
      // quality,
      // distance,
    );

    // Create a pulsing glow effect
    this.tweens.add({
      targets: effect,
      outerStrength: { from: 10, to: 80 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    window.button = this.button;
    window.btnGO = this.btnGO;

    const { width : fullWidth, height: fullHeight } = this.scale;

    const textarea = this.add.dom(100, 50, "textarea", {
      width: fullWidth * 0.8,
      height: fullHeight * 0.7,
    });

    this.logger.add("in-game", new InGameLogger(textarea));

    this.logger.log("hello, world!");
  }
}
