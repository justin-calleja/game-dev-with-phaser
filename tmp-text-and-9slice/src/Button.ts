import { GameObjects, Input, Types, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";
import { ImageGameObject } from "./event-emitters";

export type SupportedEvents = {
  "click-even": [];
  drag: [Input.Pointer, number, number];
};

export class Button extends ImageGameObject<SupportedEvents> {
  count = 0;
  textGO: GameObjects.Text;
  offsetYOnPress = 2;
  originalY: number;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y, defaultBtn);

    this.originalY = y;

    this.setInteractive({
      draggable: true,
    } as Types.Input.InputConfiguration);

    // this.setInteractive();

    this.on("drag", (pointer, dragX, dragY) => {
      console.log("downTime:", pointer.downTime);
      this.x = dragX;
      this.y = dragY;
    });

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

  setText(text: string, config?: Types.GameObjects.Text.TextConfig) {
    if (this.textGO) {
      this.textGO.text = text;
      if (config?.style) {
        this.textGO.setStyle({
          ...this.textGO.style,
          ...config?.style,
        });
      }
      return;
    }

    // text(config: Phaser.Types.GameObjects.Text.TextConfig, addToScene?: boolean): Phaser.GameObjects.Text;
    this.textGO = this.scene.make.text({
      text,
      x: this.x,
      y: this.y - 8,
      add: false,
      origin: 0.5,
      ...config,
      style: {
        // fontFamily: "Arial Black",
        fontFamily: "kenny-future-narrow",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
        ...config?.style,
      },
    });
    window.textGO = this.textGO;
  }

  addToScene() {
    this.scene.add.existing(this);
    this.scene.add.existing(this.textGO);
  }

  protected originalTextY() {
    return this.originalY - 8;
  }

  protected onPointerOver() {
    this.setTexture(hoverBtn);
  }

  protected onPointerOut() {
    this.setTexture(defaultBtn);
    if (this.y !== this.originalY) {
      this.textGO.y = this.originalTextY();
      this.y = this.originalY;
    }
  }

  protected onPointerDown() {
    this.count++;
    if (this.count % 2 === 0) {
      this.emit("click-even");
    }

    this.textGO.y += this.offsetYOnPress;
    this.y += this.offsetYOnPress;
    this.setTexture(pressedBtn);
  }

  protected onPointerUp() {
    this.setTexture(hoverBtn);
    this.textGO.y = this.originalTextY();
    this.y = this.originalY;
  }
}
