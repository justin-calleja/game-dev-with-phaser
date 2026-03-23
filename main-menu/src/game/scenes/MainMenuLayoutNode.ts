import { Geom, Scene } from "phaser";
import { LayoutNode } from "../../ui/LayoutNode";
import { TextButton } from "../../ui/TextButton";
import { getCombinedBounds } from "../../utils";

const ATLAS = "menu_ui";
const GAP = 16;
const MARGIN = 40;
const NINE_SLICE_INSET = 10;
const VISIBLE_BG_PANEL_HEIGHT = 60;
const TITLE_MARGIN_TOP = 36;
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;

const btnDefs = [
  { text: "Start game", frame: "primary_button" },
  { text: "Options", frame: "secondary_button" },
  { text: "Credits", frame: "secondary_button" },
  { text: "Something", frame: "secondary_button" },
  { text: "Quit", frame: "secondary_button" },
];

/**
 * Main menu scene using the lightweight LayoutNode system.
 *
 * - Extends plain Phaser.Scene (no phaser-pixui / UiScene).
 * - Loads the texture atlas via standard Phaser atlas loader.
 * - Buttons are positioned with Phaser.Actions.AlignTo + getCombinedBounds,
 *   then sit flat on the scene's display list.
 * - Panels and title are managed by a LayoutNode tree for grouped
 *   positioning and future mask support.
 */
export class MainMenuLayoutNode extends Scene {
  private menuRoot!: LayoutNode;

  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image("background", "assets/bg.png");
    this.load.atlas(
      ATLAS,
      "packed_assets/menu_ui.png",
      "packed_assets/menu_ui.atlas",
    );
  }

  create() {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.add.image(cx, cy, "background");

    const btnWidth = 190;
    const btnHeight = 49;

    const buttons = btnDefs.map(
      (def) =>
        new TextButton(
          this,
          cx,
          0,
          def.text,
          ATLAS,
          def.frame,
          btnWidth,
          btnHeight,
        ),
    );

    Phaser.Actions.AlignTo(buttons, Phaser.Display.Align.BOTTOM_CENTER, 0, GAP);

    const bounds = getCombinedBounds(buttons, new Geom.Rectangle())!;

    for (const btn of buttons) {
      btn.y += cy - bounds.centerY;
    }

    bounds.centerY = cy;

    this.menuRoot = this.createPanelLayout(bounds, cx);
    this.menuRoot.update();

    for (const btn of buttons) {
      this.add.existing(btn);
    }
  }

  /**
   * Build the panel + title LayoutNode tree from the button content bounds.
   * Creates bg_panel, fg_panel, and title text as a single subtree.
   */
  private createPanelLayout(
    contentBounds: Geom.Rectangle,
    centerX: number,
  ): LayoutNode {
    const fgW = contentBounds.width + MARGIN * 2;
    const fgH = contentBounds.height + MARGIN * 2;
    const panelCenterY = contentBounds.centerY;
    const bgH = fgH / 2 + VISIBLE_BG_PANEL_HEIGHT;

    const root = new LayoutNode({
      x: centerX,
      y: panelCenterY,
      width: fgW,
      height: fgH,
    });

    const bgNineSlice = this.add.nineslice(
      0,
      0,
      ATLAS,
      "bg_panel",
      fgW,
      bgH,
      NINE_SLICE_INSET,
      NINE_SLICE_INSET,
      NINE_SLICE_INSET,
      NINE_SLICE_INSET,
    );
    const bgNode = new LayoutNode({
      x: 0,
      y: -bgH / 2,
      width: fgW,
      height: bgH,
    });
    bgNode.bind(bgNineSlice);
    root.addChild(bgNode);

    const fgNineSlice = this.add.nineslice(
      0,
      0,
      ATLAS,
      "fg_panel",
      fgW,
      fgH,
      NINE_SLICE_INSET,
      NINE_SLICE_INSET,
      NINE_SLICE_INSET,
      NINE_SLICE_INSET,
    );
    const fgNode = new LayoutNode({ x: 0, y: 0, width: fgW, height: fgH });
    fgNode.bind(fgNineSlice);
    root.addChild(fgNode);

    const titleText = this.add.text(0, 0, "Game title", {
      fontFamily: "Arial Black",
      fontSize: 32,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center",
    });
    titleText.setOrigin(0.5, 0.5);
    const titleNode = new LayoutNode({
      x: 0,
      y: -bgH + TITLE_MARGIN_TOP,
      width: 0,
      height: 0,
    });
    titleNode.bind(titleText);
    root.addChild(titleNode);

    return root;
  }
}
