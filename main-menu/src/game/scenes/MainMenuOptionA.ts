import { Geom } from "phaser";
import { UiScene } from "phaser-pixui";
import { menuTheme } from "../theme";
import { TextButton } from "../objs/TextButton";
import { computeMenuLayout, createPanelLayout } from "../objs/MenuLayout";
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
 * Option A: pixui Frame for panel layout, GameObjects.Text buttons.
 * Uses Phaser.Actions.AlignTo + getCombinedBounds to position buttons
 * and derive panel sizes automatically.
 */
export class MainMenuOptionA extends UiScene {
	constructor() {
		super({
			key: "MainMenu",
			theme: menuTheme,
			viewportConstraints: {},
		});
	}

	preload() {
		super.preload();
		this.load.setPath("");
		this.load.image("background", "assets/bg.png");
	}

	create() {
		super.create();

		const cx = GAME_WIDTH / 2;
		const cy = GAME_HEIGHT / 2;

		this.add.image(cx, cy, "background");

		const btnWidth = 190;
		const btnHeight = 49;

		const buttons = btnDefs.map(
			(def) =>
				new TextButton(
					this,
					0,
					0,
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
		const dx = cx - bounds.centerX;
		const dy = targetCenterY - bounds.centerY;
		for (const btn of buttons) {
			btn.x += dx;
			btn.y += dy;
			this.add.existing(btn);
		}

		getCombinedBounds(buttons, bounds);
		const layout = computeMenuLayout(bounds, GAME_HEIGHT, MARGIN);
		createPanelLayout(this, layout);

		const titleText = this.add.text(cx, layout.titleY, "Game title", {
			fontFamily: "Arial Black",
			fontSize: 32,
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 4,
			align: "center",
		});
		titleText.setOrigin(0.5, 0.5);
	}
}

(MainMenuOptionA.prototype as any)._getCanvasWidth = () => GAME_WIDTH;
(MainMenuOptionA.prototype as any)._getCanvasHeight = () => GAME_HEIGHT;
