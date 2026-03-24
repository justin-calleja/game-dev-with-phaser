import { GameObjects, Scene } from "phaser";
import { LayoutNode, LayoutNodeOpts } from "../../ui/LayoutNode";
import { PrimaryButton, SecondaryButton } from "../_deprecated/buttons";

export class MenuPanel extends LayoutNode {
  constructor(opts: LayoutNodeOpts) {
    super(opts);
  }

  setContent(content: GameObjects.GameObject[]) {}

  setTitleText(text: string) {}
}

export class MainPanel extends MenuPanel {
  constructor(scene: Scene, opts: LayoutNodeOpts) {
    super(opts);

    this.setTitleText("Game title");

    const btn1 = new PrimaryButton(scene, 0, 0, "Start game");
    const btn2 = new SecondaryButton(scene, 0, 0, "Options");
    const btn3 = new SecondaryButton(scene, 0, 0, "Credits");
    const btn4 = new SecondaryButton(scene, 0, 0, "Something");
    const btn5 = new SecondaryButton(scene, 0, 0, "Quit");
    const btns = [btn1, btn2, btn3, btn4, btn5];

    this.setContent(btns);
    // this.repositionContent();
    // this.resize();
  }
}
