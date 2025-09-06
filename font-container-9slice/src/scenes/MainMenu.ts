import { Scene, GameObjects } from "phaser";
import { ButtonContainer } from "../ButtonContainer";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  button: ButtonContainer;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    this.button = new ButtonContainer(this, width, height);
    this.button.setText("Start hello world\nsdf sdf sf");
    this.add.existing(this.button);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  cleanup() {
    this.button.removeAllListeners();
  }
}
