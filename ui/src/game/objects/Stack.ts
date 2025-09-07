import { GameObjects, Scene } from "phaser";
import { GroupGameObject } from "../../event-emitters";

export type SupportedEvents = {
  aligned: [];
};

export class Stack extends GroupGameObject<SupportedEvents> {
  constructor(public scene: Scene, children?: GameObjects.GameObject[]) {
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
      Phaser.Display.Align.BOTTOM_CENTER,
      0,
      14
    );

    console.log('done aligning');

    this.emit("aligned");
  }
}
