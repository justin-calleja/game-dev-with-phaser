import { GameObjects, Input, type Scene } from "phaser";
import { clickB, primaryButton, secondaryButton } from "../../asset-keys";

export type SupportedEvents = {
  // pointerdown: [];
};

type AssetKeys = typeof primaryButton | typeof secondaryButton;

export class ButtonContainer extends Phaser.GameObjects.Container {
  imageGO: GameObjects.NineSlice;
  textGO: GameObjects.Text;

  yOffset = 2;
  initialY: number;

  constructor(
    public scene: Scene,
    public x: number,
    public y: number,
    public assetKeys: AssetKeys
  ) {
    super(scene, x, y);

    this.initialY = y;

    this.imageGO = scene.make.nineslice({
      x: 0,
      y: 0,
      key: assetKeys.normal,
      leftWidth: 10,
      rightWidth: 10,
      topHeight: 10,
      bottomHeight: 10,
      width: 192,
      height: 64,
    });

    this.textGO = new GameObjects.Text(scene, 0, 0, "", {
      // fontFamily: "kenney-future",
      fontFamily: "Roboto",
      fontStyle: "bold",
      // fontFamily: "Bebas Neue",
      fontSize: 24,
      // color: "#ffffff",
      color: "#000000",
      fixedWidth: 240,
      // stroke: "#000000",
      // strokeThickness: 8,
      align: "center",
    });
    this.textGO.setOrigin(0.5, 0.6);
    // this.imageGO.width = this.textGO.width + 40;

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

  public setText(
    text: string,
    style?: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    this.textGO.text = text;

    if (style) {
      this.textGO.setStyle({
        ...this.textGO.style,
        ...style,
      });
    }

    this.imageGO.width = this.textGO.width + 40;
    this.imageGO.height = this.textGO.height + 30;
  }

  onAlign() {
    this.initialY = this.y;
  }

  protected onPointerOver() {
    this.y += this.yOffset;
  }

  protected onPointerOut() {
    this.imageGO.setTexture(this.assetKeys.normal);
    this.y = this.initialY;
  }

  protected onPointerDown() {
    this.imageGO.setTexture(this.assetKeys.pressed);
    this.y += this.yOffset;
    this.scene.sound.play(clickB);
  }

  protected onPointerUp() {
    this.imageGO.setTexture(this.assetKeys.normal);
    this.y -= this.yOffset;
  }
}

export class PrimaryButton extends ButtonContainer {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, primaryButton);
  }

  public setText(text: string, style?: Phaser.Types.GameObjects.Text.TextStyle) {
    super.setText(text, style);
    this.imageGO.height += 14;
    this.height += 14;
  }
}

export class SecondaryButton extends ButtonContainer {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, secondaryButton);
  }
}