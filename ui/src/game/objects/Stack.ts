import { GameObjects, Scene } from "phaser";
import { GroupGameObject } from "../../event-emitters";

export type SupportedEvents = {
  aligned: [];
};

export class Stack extends GroupGameObject<SupportedEvents> {
  constructor(public scene: Scene, children?: GameObjects.Image[]) {
    super(scene, children);
    this.align();
  }

  addBtn(btn: GameObjects.Image) {
    this.add(btn);
    this.align();
  }

  align() {
    Phaser.Actions.AlignTo(
      this.getChildren(),
      Phaser.Display.Align.BOTTOM_RIGHT,
      0,
      14
    );

    console.log('done aligning');

    this.emit("aligned");

    // console.log("children's bounds:", this.getBounds().);
  }

  getBounds(rect: Phaser.Geom.Rectangle) {
    // let bounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);

    const children = this.getChildren();
    if (children.length === 0) {
      return rect;
    }

    // bounds.x = children[0].x;
    // bounds.y = children[0].y;
    // Start with the first child's bounds
    // let bounds = children[0].getBounds();
    
    // Merge each subsequent child's bounds into the main bounds
    for (let i = 0; i < children.length; i++) {
      const childBounds = children[i].getBounds();
      console.log("childBounds:", childBounds);
      Phaser.Geom.Rectangle.Union(rect, childBounds, rect);
    }

    return rect;
  }
}
