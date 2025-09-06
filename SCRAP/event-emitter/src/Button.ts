import { GameObjects, Input, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";
import { EventEmitter } from "./EventEmitter";

type Event = {
  "click-even": [];
  clicky: [boolean, { count: number }];
  pointerover: [];
  // "pointerover": [];
  // []: [];
  // string: any
  // [event: string | symbol]: any[];
};
// type X = typeof Input.Events.GAMEOBJECT_POINTER_OVER

export class Button extends GameObjects.Image implements EventEmitter<Event> {
  count = 0;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y, defaultBtn);

    this.setInteractive();

    // Use type assertion for Phaser's built-in events
    this.on("pointerover", this.onPointerOver, this);
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
      // this.emit("")
    }

    this.setTexture(pressedBtn);
  }

  protected onPointerUp() {
    this.setTexture(hoverBtn);
  }

  emit<K extends keyof Event>(event: K, ...args: Event[K]): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof Event>(
    event: K,
    fn: (...args: Event[K]) => void,
    context?: any
  ): this {
    return super.on(event, fn, context);
  }
}
