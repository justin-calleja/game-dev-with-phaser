import { Input, type GameObjects, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";

export class Button {
  img: GameObjects.Image;

  constructor(public scene: Scene, public x: number, public y: number) {
    this.img = scene.add.image(x, y, defaultBtn);

    this.img.setInteractive();

    this.img.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
    this.img.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
    this.img.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
    this.img.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
  }

  protected onPointerOver() {
    console.log(">> onPointerOver");
    this.img.setTexture(hoverBtn);
  }

  protected onPointerOut() {
    console.log(">> onPointerOut");
    this.img.setTexture(defaultBtn);
  }

  protected onPointerDown() {
    console.log(">> onPointerDown");
    this.img.setTexture(pressedBtn);
  }

  protected onPointerUp() {
    console.log(">> onPointerUp");
    this.img.setTexture(hoverBtn);
  }
}
