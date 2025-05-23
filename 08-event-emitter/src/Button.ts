import { Input, type GameObjects, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";
import { EventEmitter } from "./EventEmitter";

export type ButtonEvent =
  | { name: "clicked2"; counter: number }
  | { name: "clicked" };

export class Button extends EventEmitter<ButtonEvent> {
  img: GameObjects.Image;

  counter = 0;

  pressOffset = 0;

  constructor(public scene: Scene, public x: number, public y: number) {
    super();
    this.img = scene.add.image(x, y, defaultBtn);

    this.img.setInteractive();

    this.img.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
    this.img.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
    this.img.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
    this.img.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);

    scene.events.on("destroy", () => {
      console.log("Button >> destroy");
      this.destroy();
    });
  }

  protected onPointerDown() {
    console.log(">> onPointerDown");
    if (this.pressOffset > 0) {
      this.img.y += this.pressOffset;
    } else {
      this.img.setTexture(pressedBtn);
    }

    this.emit("clicked2", {
      counter: ++this.counter,
    });
  }

  protected onPointerOver() {
    console.log(">> onPointerOver");
    if (this.pressOffset > 0) {
      this.img.setTexture(pressedBtn);
    } else {
      this.img.setTexture(hoverBtn);
    }
  }

  protected onPointerOut() {
    console.log(">> onPointerOut");
    this.img.setTexture(defaultBtn);
  }

  protected onPointerUp() {
    console.log(">> onPointerUp");
    if (this.pressOffset > 0) {
      this.img.y -= this.pressOffset;
    } else {
      this.img.setTexture(hoverBtn);
    }
  }
}
