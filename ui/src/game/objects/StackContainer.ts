import { Scene } from "phaser";

export class StackContainer extends Phaser.GameObjects.Container {
  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y);
  }

  align() {
    Phaser.Actions.AlignTo(
      this.getAll(),
      Phaser.Display.Align.BOTTOM_RIGHT,
      0,
      14
    );

    // Recalculate bounds after alignment
    // this.updateBounds();

    console.log('done aligning');

    this.emit("aligned");
  }

}