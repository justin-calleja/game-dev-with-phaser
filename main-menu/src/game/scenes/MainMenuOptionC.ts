import { Geom } from "phaser";
import { UiScene } from "phaser-pixui";
import { menuTheme } from "../theme";
import { computeMenuLayout, createPanelLayout } from "../objs/MenuLayout";

const GAP = 16;
const MARGIN = 40;
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;

const btnDefs: { text: string; style?: string }[] = [
	{ text: "Start game" },
	{ text: "Options", style: "secondary" },
	{ text: "Credits", style: "secondary" },
	{ text: "Something", style: "secondary" },
	{ text: "Quit", style: "secondary" },
];

/**
 * Option C: full pixui end-to-end, including Button with BitmapFont.
 * Uses a loop over btnDefs and the shared MenuLayout helper
 * to derive panel sizes automatically.
 */
export class MainMenuOptionC extends UiScene {
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
		const totalHeight =
			btnDefs.length * btnHeight + (btnDefs.length - 1) * GAP;
		const targetCenterY = cy - 100;

		const bounds = new Geom.Rectangle(
			cx - btnWidth / 2,
			targetCenterY - totalHeight / 2,
			btnWidth,
			totalHeight,
		);

		const layout = computeMenuLayout(bounds, GAME_HEIGHT, MARGIN);
		const panel = createPanelLayout(this, layout);

		this.insert.center.bitmapText({
			y: layout.titleY - cy,
			text: "Game title",
			font: "mana_roots",
			size: 16,
		});

		const btnStartY = -(totalHeight / 2) + btnHeight / 2;
		for (let i = 0; i < btnDefs.length; i++) {
			const def = btnDefs[i];
			panel.insert.center.button({
				y: btnStartY + i * (btnHeight + GAP),
				width: btnWidth,
				height: btnHeight,
				text: def.text,
				style: def.style,
				onClick: () => console.log(def.text),
			});
		}
	}
}

(MainMenuOptionC.prototype as any)._getCanvasWidth = () => GAME_WIDTH;
(MainMenuOptionC.prototype as any)._getCanvasHeight = () => GAME_HEIGHT;
