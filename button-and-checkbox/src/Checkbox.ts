import { Input, type GameObjects, type Scene } from "phaser";
import { checkboxEmpty, checkboxTicked } from "./assetKeys";

export class Checkbox {
  img: GameObjects.Image;

  constructor(public scene: Scene, public x: number, public y: number) {
    this.img = scene.add.image(x, y, checkboxEmpty);

    this.img.setInteractive();

    this.img.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
  }

  public get isChecked(): boolean {
    return this.img.texture.key === checkboxTicked;
  }

  protected onPointerDown() {
    console.log(">> onPointerDown");
    this.img.setTexture(
      this.img.texture.key === checkboxEmpty ? checkboxTicked : checkboxEmpty
    );
  }
}
