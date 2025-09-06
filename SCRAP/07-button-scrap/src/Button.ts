import type { GameObjects, Scene } from "phaser";

export class Button {
  defaultKey: string;
  hoverKey: string;
  pressKey: string;

  currentImg: GameObjects.Image;

  constructor(scene: Scene, x: number, y: number) {
    this.defaultKey = "gradient";
    this.hoverKey = "gloss";
    this.pressKey = "flat";

    this.currentImg = scene.add.image(x, y, this.defaultKey);
    
    // Create a hit area that matches the texture size
    const width = this.currentImg.width;
    const height = this.currentImg.height;
    window.currentImg = this.currentImg;
    console.log(x, y, this.currentImg.width, this.currentImg.height);
    
    // const hitArea = new Phaser.Geom.Rectangle(x, y, width, height);
    const hitArea = new Phaser.GameObjects.Zone(scene, x, y, width, height);
    scene.add.existing(hitArea);
    
    this.currentImg.setInteractive({
      hitArea,
      useHandCursor: true
    });

    this.currentImg.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,
      this.onPointerOver,
      this
    );
    this.currentImg.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_OUT,
      this.onPointerOut,
      this
    );
    this.currentImg.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
      this.onPointerDown,
      this
    );
    this.currentImg.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      this.onPointerUp,
      this
    );

    window.currentImg = this.currentImg;
  }

  public showImage(textureKey: string) {
    this.currentImg.setTexture(textureKey);
  }

  private onPointerOver() {
    if (this.currentImg.texture.key !== this.pressKey) {
      this.showImage(this.hoverKey);
    }
  }

  private onPointerOut() {
    if (this.currentImg.texture.key !== this.pressKey) {
      this.showImage(this.defaultKey);
    }
  }

  private onPointerDown() {
    this.showImage(this.pressKey);
  }

  private onPointerUp() {
    this.showImage(this.hoverKey);
  }
}
