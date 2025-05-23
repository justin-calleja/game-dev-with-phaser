import { Input, type GameObjects, type Scene } from "phaser";
import { checkboxEmpty, checkboxTicked, tick } from "./assetKeys";
import { EventEmitter } from "./EventEmitter";

export type CheckboxEvent = { name: "checked" } | { name: "unchecked" };

export class Checkbox extends EventEmitter<CheckboxEvent> {
  // emptyImg: GameObjects.Image;
  // tickedImg: GameObjects.Image;
  img: GameObjects.Image;

  constructor(public scene: Scene, public x: number, public y: number) {
    super();
    // this.emptyImg = scene.add.image(x, y, checkboxEmpty);
    // this.tickedImg = scene.add.image(x, y, checkboxTicked);

    // this.tickedImg.setVisible(false);

    // this.emptyImg.setInteractive();

    // this.emptyImg.on(
    //   Input.Events.GAMEOBJECT_POINTER_DOWN,
    //   this.onPointerDown,
    //   this
    // );

    this.img = scene.add.image(x, y, checkboxEmpty);
    this.img.setInteractive();
    this.img.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);

    scene.events.on("destroy", () => {
      this.destroy();
    });
  }

  public get isTicked() {
    // return this.tickedImg.visible;
    return this.img.texture.key === checkboxTicked;
  }

  protected onPointerDown() {
    console.log(">> onPointerDown");
    // this.tickedImg.setVisible(!this.tickedImg.visible);
    this.img.setTexture(
      this.img.texture.key === checkboxEmpty ? checkboxTicked : checkboxEmpty
    );

    this.emit(this.isTicked ? "checked" : "unchecked");
  }
}
