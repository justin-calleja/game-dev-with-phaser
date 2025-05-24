import { Scene, GameObjects } from "phaser";

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

    this.logo = this.add.image(width, height, "logo");

    const hitArea = new Phaser.Geom.Rectangle(
      0,
      0,
      100,
      20,
    //   this.logo.displayWidth,
    //   this.logo.displayHeight
    );
    window.hitArea = hitArea;
    this.logo.setInteractive(
      hitArea,
      Phaser.Geom.Rectangle.Contains
    );
    // this.logo.setScale(2);

    window.scene = this;

    // this.logo.setInteractive({
    // //   cursor: "pointer",
    //   hitArea: new Phaser.Geom.Rectangle(0, 0, 100, 20),
    //   hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    // } as Phaser.Types.Input.InputConfiguration);

    this.input.enableDebug(this.logo);
    // @ts-ignore
    this.logo.input.hitAreaDebug.isFilled = true;
    // @ts-ignore
    this.logo.input.hitAreaDebug.fillAlpha = 0.5;
    // @ts-ignore
    this.logo.input.hitAreaDebug.fillColor = 0x00ff00;

    window.logo = this.logo;

    this.logo.on("pointerdown", () => {
      this.logo.setTint(0xff0000);
    });

    this.logo.on("pointerup", () => {
      this.logo.clearTint();
    });

    this.logo.on("pointerout", () => {
      this.logo.clearTint();
    });
  }
}
