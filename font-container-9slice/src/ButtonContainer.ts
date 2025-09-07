import { GameObjects, Input, type Scene } from "phaser";
import { defaultBtn, pressedBtn } from "./assetKeys";

export type SupportedEvents = {
  "click-even": [];
  pointerdown: [];
};

export class ButtonContainer extends Phaser.GameObjects.Container {
  imageGO: GameObjects.NineSlice;
  textGO: GameObjects.Text;

  yOffset = 2;
  initialY: number;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y);

    this.initialY = y;

    this.imageGO = scene.make.nineslice({
      x: 0,
      y: 0,
      key: defaultBtn,
      leftWidth: 10,
      rightWidth: 10,
      topHeight: 10,
      bottomHeight: 10,
      width: 500,
      height: 300,
    })

    this.textGO = new GameObjects.Text(scene, 0, 0, "", {
      fontFamily: "kenney-future",
      fontSize: 24,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.textGO.setOrigin(0.5, 0.6);

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
    this.imageGO.width = this.textGO.width + 40;
    this.imageGO.height = this.textGO.height + 40;
  }

  protected onPointerOver() {
    this.y += this.yOffset;
  }

  protected onPointerOut() {
    this.imageGO.setTexture(defaultBtn);
    this.y = this.initialY;
  }

  protected onPointerDown() {
    this.imageGO.setTexture(pressedBtn);
    this.y += this.yOffset;
  }

  protected onPointerUp() {
    this.imageGO.setTexture(defaultBtn);
    this.y -= this.yOffset;
  }
}
