import { UiScene } from "phaser-pixui";
import { menuTheme } from "../theme";

const ATLAS = "menu_ui";
const GAP = 16;
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;

/**
 * Option C: full pixui end-to-end, including Button with BitmapFont.
 * All UI is built declaratively via the insert API.
 * Text uses BitmapFont (mana_roots) rather than GameObjects.Text.
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
		const btnCount = 5;
		const totalBtnsHeight = btnCount * btnHeight + (btnCount - 1) * GAP;
		const margin = 40;
		const visibleBgPanelHeight = 60;
		const titleMarginTop = 36;

		const fgPanelWidth = btnWidth + margin * 2;
		const fgPanelHeight = totalBtnsHeight + margin * 2;

		const panelCenterY = cy - 100;
		const panelOffsetY = panelCenterY - cy;

		const bgPanelHeight = fgPanelHeight / 2 + visibleBgPanelHeight;
		const bgPanelCenterY = panelCenterY - bgPanelHeight / 2;

		this.insert.center.image({
			y: bgPanelCenterY - cy,
			texture: ATLAS,
			frame: "bg_panel",
			width: fgPanelWidth,
			height: bgPanelHeight,
		});

		this.insert.center.bitmapText({
			y: panelCenterY - bgPanelHeight + titleMarginTop - cy,
			text: "Game title",
			font: "mana_roots",
			size: 16,
		});

		const panel = this.insert.center.frame({
			y: panelOffsetY,
			width: fgPanelWidth,
			height: fgPanelHeight,
		});

		const btnStartY = -(totalBtnsHeight / 2) + btnHeight / 2;

		panel.insert.center.button({
			y: btnStartY,
			width: btnWidth,
			height: btnHeight,
			text: "Start game",
			onClick: () => console.log("Start game"),
		});
		panel.insert.center.button({
			y: btnStartY + (btnHeight + GAP),
			width: btnWidth,
			height: btnHeight,
			text: "Options",
			style: "secondary",
			onClick: () => console.log("Options"),
		});
		panel.insert.center.button({
			y: btnStartY + 2 * (btnHeight + GAP),
			width: btnWidth,
			height: btnHeight,
			text: "Credits",
			style: "secondary",
			onClick: () => console.log("Credits"),
		});
		panel.insert.center.button({
			y: btnStartY + 3 * (btnHeight + GAP),
			width: btnWidth,
			height: btnHeight,
			text: "Something",
			style: "secondary",
			onClick: () => console.log("Something"),
		});
		panel.insert.center.button({
			y: btnStartY + 4 * (btnHeight + GAP),
			width: btnWidth,
			height: btnHeight,
			text: "Quit",
			style: "secondary",
			onClick: () => console.log("Quit"),
		});
	}
}

(MainMenuOptionC.prototype as any)._getCanvasWidth = () => GAME_WIDTH;
(MainMenuOptionC.prototype as any)._getCanvasHeight = () => GAME_HEIGHT;
