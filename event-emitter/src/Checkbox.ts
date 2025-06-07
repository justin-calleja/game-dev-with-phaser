import { Input, type GameObjects, type Scene } from "phaser";
import { checkboxEmpty, checkboxTicked } from "./assetKeys";
import { EventEmitter } from "./event-emitters";

export type SupportedEvents = {
  "is-sound-enabled": [boolean];
  hello: [];
  world: [{ val1: number; val2: string }];
};

export class Checkbox extends EventEmitter<SupportedEvents> {
  img: GameObjects.Image;

  constructor(public scene: Scene, public x: number, public y: number) {
    super();

    this.img = scene.add.image(x, y, checkboxEmpty);

    this.img.setInteractive();

    this.img.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
  }

  public get isChecked(): boolean {
    return this.img.texture.key === checkboxTicked;
  }

  protected onPointerDown() {
    this.img.setTexture(
      this.img.texture.key === checkboxEmpty ? checkboxTicked : checkboxEmpty
    );

    this.emit("is-sound-enabled", this.isChecked);
  }
}
