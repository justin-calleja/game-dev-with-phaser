import { GameObjects, Input, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";
import { ImageGameObject } from "./event-emitters";

export type SupportedEvents = {
  "click-even": [];
  pointerdown: [];
};

export class Button extends ImageGameObject<SupportedEvents> {
  count = 0;
  textGO: GameObjects.Text;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y, defaultBtn);

    this.setInteractive();

    this.on(
      Input.Events.GAMEOBJECT_POINTER_OVER as any,
      this.onPointerOver,
      this
    );
    this.on(
      Input.Events.GAMEOBJECT_POINTER_OUT as any,
      this.onPointerOut,
      this
    );
    this.on(
      Input.Events.GAMEOBJECT_POINTER_DOWN as any,
      this.onPointerDown,
      this
    );
    this.on(Input.Events.GAMEOBJECT_POINTER_UP as any, this.onPointerUp, this);
  }

  public setText(text: string) {
    this.textGO = this.scene.add.text(this.x, this.y, text, {
      fontFamily: "Arial Black",
      fontSize: 24,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
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
