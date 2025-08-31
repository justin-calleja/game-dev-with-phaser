import { GameObjects, Input, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";

export type SupportedEvents = {
  "click-even": [];
  pointerdown: [];
};

export class ButtonContainer extends Phaser.GameObjects.Container {
  imageGO: GameObjects.Image;
  textGO: GameObjects.Text;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y);

    this.imageGO = new GameObjects.Image(scene, 0, 0, defaultBtn);
    window.imageGO = this.imageGO;

    this.textGO = new GameObjects.Text(scene, 0, 0, "", {
      fontFamily: "kenney-future",
      fontSize: 24,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.textGO.setOrigin(0.5, 0.6);
    window.textGO = this.textGO;

    this.add([this.imageGO, this.textGO]);
    
    this.setSize(this.imageGO.width, this.imageGO.height);
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
    this.textGO.text = text;
  }

  protected onPointerOver() {
    this.imageGO.setTexture(hoverBtn);
  }

  protected onPointerOut() {
    this.imageGO.setTexture(defaultBtn);
  }

  protected onPointerDown() {
    this.imageGO.setTexture(pressedBtn);
  }

  protected onPointerUp() {
    this.imageGO.setTexture(hoverBtn);
  }
}
