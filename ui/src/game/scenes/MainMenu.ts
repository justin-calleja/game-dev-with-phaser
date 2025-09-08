import { Scene, GameObjects } from "phaser";
import { MainMenuContainer } from "../objects/MainMenuContainer";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  mainMenuContainer: MainMenuContainer;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.mainMenuContainer = new MainMenuContainer(
      this,
      centerX,
      centerY * 0.75
    );

    this.add.existing(this.mainMenuContainer);

    this.mainMenuContainer.on("optionsBtnClicked", () => {
      console.log("optionsBtnClicked");
    });
  }
}
