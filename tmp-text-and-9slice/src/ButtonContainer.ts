import { GameObjects, Input, Types, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";
// import { addCross, makeDraggable } from "./utils";
// import { ImageGameObject } from "./event-emitters";

// export type SupportedEvents = {
//   "click-even": [];
// };

export class ButtonContainer extends GameObjects.Container {
  imgGO: GameObjects.Image;
  // imgGO: GameObjects.NineSlice;
  textGO: GameObjects.Text;

  offsetYOnPress = 2;
  originalY: number;

  cross: GameObjects.Graphics;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y);

    window.container = this;

    this.originalY = y;

    this.textGO = this.scene.make.text({
      text: "",
      x: 0,
      y: 0,
      // x: this.x,
      // y: this.originalTextY(),
      // add: false,
      origin: 0.5,
      style: {
        // fontFamily: "Arial Black",
        fontFamily: "kenny-future-narrow",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      },
    });
    this.textGO.setOrigin(0.5, 0.6);
    window.textGO = this.textGO;
    // this.textGO.x += 5;

    // makeDraggable(this.textGO);

    this.imgGO = scene.make.image({
      key: defaultBtn,
      x: 0,
      y: 0,
      add: false,
    });
    this.imgGO.setScale(2, 2);

    // scene.add.nineslice(0, 0, "tile", "__BASE", 360, 380, 10, 10, 10, 10);

    // this.imgGO = scene.make.nineslice({
    //   x: 0,
    //   y: 0,
    //   key: defaultBtn,
    //   leftWidth: 10,
    //   rightWidth: 10,
    //   topHeight: 10,
    //   bottomHeight: 10,

    //   width: 192 * 2,
    //   height: 64 * 2,
    //   // height: 24,
    // });

    this.add([this.imgGO, this.textGO]);

    // this.imgGO.setInteractive();
    this.setSize(this.imgGO.displayWidth, this.imgGO.displayHeight);
    this.setInteractive();

    this.on(
      Input.Events.GAMEOBJECT_POINTER_OVER,
      this.onPointerOver,
      this
    );
    this.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
    this.on(
      Input.Events.GAMEOBJECT_POINTER_DOWN,
      this.onPointerDown,
      this
    );
    this.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
  }

  setText(text: string, config?: Types.GameObjects.Text.TextConfig) {
    this.textGO.text = text;
    this.textGO.setStyle({
      ...this.textGO.style,
      ...config?.style,
    });
    
    // Force text to recalculate bounds and center properly
    // this.textGO.updateText();
    // this.textGO.setOrigin(0.5, 0.7);
  }

  // addToScene() {
  //   if (!this.cross) {
  //     // this.cross = addCross(this.scene, this.x, this.y, 4, 10);
  //     this.cross = addCross(this.scene, 0, 0, 4, 16);
  //     this.add(this.cross);
  //     // this.bringToTop(this.cross)
  //   }

  //   this.scene.add.existing(this);
  // }

  // protected originalTextY() {
  //   return -8;
  //   // return this.originalY - 8;
  // }

  protected onPointerOver() {
    // this.imgGO.setTexture(hoverBtn);
    this.y += 2;
  }

  protected onPointerOut() {
    this.imgGO.setTexture(defaultBtn);
    // this.imgGO.y = 0;
    this.y = this.originalY;
    // if (this.y !== this.originalY) {
    //   this.textGO.y = this.originalTextY();
    //   this.y = this.originalY;
    // }
  }

  protected onPointerDown() {
    // this.count++;
    // if (this.count % 2 === 0) {
    //   this.emit("click-even");
    // }

    // this.textGO.y += this.offsetYOnPress;
    // this.y += this.offsetYOnPress;
    this.imgGO.setTexture(pressedBtn);
    // this.imgGO.y += 2;
    this.y += 2;
  }

  protected onPointerUp() {
    this.imgGO.setTexture(defaultBtn);
    this.y -= 2;
    // this.imgGO.setTexture(hoverBtn);
    // this.imgGO.y = 0;
    // this.y = this.originalY;
    // this.textGO.y = this.originalTextY();
    // this.y = this.originalY;
  }
}
