import { Events, Input, type GameObjects, type Scene } from "phaser";
import { checkboxEmpty, checkboxTicked } from "./assetKeys";
import { EventEmitter } from "./EventEmitter";

// export type Event = { name: "is-sound-enabled"; isSoundEnabled: boolean };
export type Event = {
  "is-sound-enabled": [boolean];
  "lives-left": [number, { a: string; b: boolean }];
};

// export class Checkbox extends Events.EventEmitter {
export class Checkbox
  extends Events.EventEmitter
  implements EventEmitter<Event>
{
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
    // this.emit("is-sound-enabled", { isSoundEnabled: this.isChecked });
    // this.emit("is-sound-enabled", this.isChecked);
    this.emit("is-sound-enabled", true);
  }

  emit<K extends keyof Event>(event: K, ...args: Event[K]): boolean {
    return super.emit(event as string, ...args);
  }

  on<K extends keyof Event>(
    event: K,
    fn: (...args: Event[K]) => void,
    context?: any
  ): this {
    return super.on(event as string, fn, context);
  }
}
