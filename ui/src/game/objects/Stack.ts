import { GameObjects, Scene } from "phaser";
import { GroupGameObject } from "../../event-emitters";

export type SupportedEvents = {
  aligned: [];
};

export class Stack extends GroupGameObject<SupportedEvents> {
  private bounds: Phaser.Geom.Rectangle;

  constructor(public scene: Scene, children?: GameObjects.Image[]) {
    super(scene, children);
    this.bounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);
    this.align();
  }

  addBtn(btn: GameObjects.Image) {
    this.add(btn);
    this.align();
  }

  getBoundsRect(): Phaser.Geom.Rectangle {
    return this.bounds;
  }

  private updateBounds() {
    const children = this.getChildren();
    if (children.length === 0) {
      this.bounds.setTo(0, 0, 0, 0);
      return;
    }

    // Start with the first child's bounds
    const firstChildBounds = children[0].getBounds();
    this.bounds.setTo(firstChildBounds.x, firstChildBounds.y, firstChildBounds.width, firstChildBounds.height);
    
    // Merge each subsequent child's bounds into the main bounds
    for (let i = 1; i < children.length; i++) {
      const childBounds = children[i].getBounds();
      Phaser.Geom.Rectangle.Union(this.bounds, childBounds, this.bounds);
    }
  }

  align() {
    Phaser.Actions.AlignTo(
      this.getChildren(),
      Phaser.Display.Align.BOTTOM_CENTER,
      0,
      14
    );

    // Recalculate bounds after alignment
    this.updateBounds();

    console.log('done aligning');

    this.emit("aligned");
  }

  getBounds(rect: Phaser.Geom.Rectangle) {
    // Copy the internal bounds to the provided rectangle
    rect.setTo(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    return rect;
  }
}
