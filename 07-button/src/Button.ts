import { GameObjects, Scene } from "phaser";

export class Button {
  x: number;
  y: number;

  defaultImage: GameObjects.Image;
  hoverImage: GameObjects.Image;
  pressImage: GameObjects.Image;
  currentImage: GameObjects.Image;

  constructor(scene: Scene, x: number, y: number) {
    this.x = x;
    this.y = y;

    this.defaultImage = scene.add.image(x, y, "flat");
    this.hoverImage = scene.add.image(x, y, "gloss");
    this.pressImage = scene.add.image(x, y, "gradient");
    this.currentImage = this.defaultImage;

    this.hoverImage.setVisible(false);
    this.pressImage.setVisible(false);
  }

  public showImage(image: GameObjects.Image) {
    this.currentImage.setVisible(false);
    image.setVisible(true);
    this.currentImage = image;
  }

  public getNextImage() {
    if (this.currentImage === this.defaultImage) return this.hoverImage;
    if (this.currentImage === this.hoverImage) return this.pressImage;
    if (this.currentImage === this.pressImage) return this.defaultImage;

    return this.currentImage;
  }
}
