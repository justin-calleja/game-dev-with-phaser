import { Geom, Scene } from "phaser";
import { LayoutNode } from "../../ui/LayoutNode";
import { TextButton } from "../../ui/TextButton";
import { computeMenuLayout, createPanelLayout } from "../../ui/MenuLayout";
import { getCombinedBounds } from "../../utils";

const ATLAS = "menu_ui";
const GAP = 16;
const MARGIN = 40;
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
					cy,
					def.text,
					ATLAS,
					def.frame,
					btnWidth,
					btnHeight,
				),
		);

		Phaser.Actions.AlignTo(
			buttons,
			Phaser.Display.Align.BOTTOM_CENTER,
			0,
			GAP,
		);

		const bounds = getCombinedBounds(buttons, new Geom.Rectangle())!;

		const targetCenterY = cy - 100;
		const dy = targetCenterY - bounds.centerY;

		for (const btn of buttons) {
			btn.y += dy;
		}

		getCombinedBounds(buttons, bounds);
		const layout = computeMenuLayout(bounds, GAME_HEIGHT, MARGIN);

		this.menuRoot = createPanelLayout(this, layout, cx);

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
			y: layout.titleY - layout.panelCenterY,
			width: 0,
			height: 0,
		});
		titleNode.bind(titleText);
		this.menuRoot.addChild(titleNode);

		this.menuRoot.update();

		for (const btn of buttons) {
			this.add.existing(btn);
		}
	}
}
