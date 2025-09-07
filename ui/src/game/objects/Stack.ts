import { GameObjects, Scene } from "phaser";
import { GroupGameObject } from "../../event-emitters";
import type { ButtonContainer } from "./ButtonContainer";

const AlignTo = function (
  items: ButtonContainer[],
  position: number,
  defaultOffsetY: number,
  offsetYMap?: Record<number, number>
) {
  var target = items[0];

  for (var i = 1; i < items.length; i++) {
    var item = items[i];

    var offsetY = offsetYMap?.[i - 1] || defaultOffsetY;
    // var offsetY = defaultOffsetY;
    // item.
    Phaser.Display.Align.To.QuickSet(item, target, position, 0, offsetY);

    target = item;
  }

  return items;
};

export type SupportedEvents = {
  aligned: [];
};

export class Stack extends GroupGameObject<SupportedEvents, ButtonContainer> {
  private bounds: Phaser.Geom.Rectangle;

  constructor(public scene: Scene, children?: ButtonContainer[]) {
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
    this.bounds.setTo(
      firstChildBounds.x,
      firstChildBounds.y,
      firstChildBounds.width,
      firstChildBounds.height
    );

    // Merge each subsequent child's bounds into the main bounds
    for (let i = 1; i < children.length; i++) {
      const childBounds = children[i].getBounds();
      Phaser.Geom.Rectangle.Union(this.bounds, childBounds, this.bounds);
    }
  }

  align() {
    // Phaser.Actions.AlignTo(this.getChildren(), Phaser.Display.Align.BOTTOM_CENTER, 0, 4);
    // Phaser.Actions.AlignTo(
    AlignTo(this.getChildren(), Phaser.Display.Align.BOTTOM_CENTER, 4, { 0: 14 });
    // AlignTo(this.getChildren(), Phaser.Display.Align.BOTTOM_CENTER, 24);

    // Recalculate bounds after alignment
    this.updateBounds();

    this.getChildren().forEach((child) => {
      child.onAlign();
    });

    console.log("done aligning");

    this.emit("aligned");
  }

  getBounds(rect: Phaser.Geom.Rectangle) {
    // Copy the internal bounds to the provided rectangle
    rect.setTo(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height
    );
    return rect;
  }
}
