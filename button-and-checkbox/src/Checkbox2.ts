import { Input, type GameObjects, type Scene } from "phaser";
import { checkboxEmpty, tick } from "./assetKeys";

export class Checkbox2 {
  checkboxEmptyImg: GameObjects.Image;
  tickImg: GameObjects.Image;

  constructor(public scene: Scene, public x: number, public y: number) {
    this.checkboxEmptyImg = scene.add.image(x, y, checkboxEmpty);
    this.tickImg = scene.add.image(x, y, tick);

    this.tickImg.setVisible(false);

    this.checkboxEmptyImg.setInteractive();

    this.checkboxEmptyImg.on(
      Input.Events.GAMEOBJECT_POINTER_DOWN,
      this.onPointerDown,
      this
    );
  }

  public get isChecked(): boolean {
    return this.tickImg.visible;
  }

  protected onPointerDown() {
    this.tickImg.setVisible(!this.tickImg.visible);
  }
}
