import { Scene } from "phaser";
import { MenuPanel } from "../objs/panels";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image(
      "secondary-button-normal",
      "assets/grey/button_rectangle_depth_flat.png",
    );

    this.load.image(
      "primary-button-normal",
      "assets/red/button_rectangle_depth_gradient.png",
    );

    this.load.image(
      "panel-grey-with-red-border",
      "assets/red/button_rectangle_border.png",
    );
    this.load.image("red-panel", "assets/red/button_square_flat.png");
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const panel = new MenuPanel({
      x: centerX,
      y: centerY,
      width: 270,
      height: 400,
    });
  }
}
