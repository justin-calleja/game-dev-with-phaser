import { GameObjects, Input, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";

export class Button extends GameObjects.Image {
  count = 0;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y, defaultBtn);

    this.setInteractive();

    this.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
    this.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
    this.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
    this.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
  }

  protected onPointerOver() {
    this.setTexture(hoverBtn);
  }

  protected onPointerOut() {
    this.setTexture(defaultBtn);
  }

  protected onPointerDown() {
    this.count++;
    if (this.count % 2 === 0) {
      this.emit("click-even");
    }

    this.setTexture(pressedBtn);
  }

  protected onPointerUp() {
    this.setTexture(hoverBtn);
  }
}
