import { UiScene } from "phaser-pixui";
import { menuTheme } from "../theme";
import { TextButton } from "../objs/TextButton";

const ATLAS = "menu_ui";
const GAP = 16;
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;

/**
 * Option A: pixui Frame for panel layout, GameObjects.Text buttons.
 * Demonstrates using pixui's UiScene + Frame for the visual panel
 * while keeping plain Phaser GameObjects.Text for scalable TTF text.
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

		const btnDefs = [
			{ text: "Start game", frame: "primary_button" },
			{ text: "Options", frame: "secondary_button" },
			{ text: "Credits", frame: "secondary_button" },
			{ text: "Something", frame: "secondary_button" },
			{ text: "Quit", frame: "secondary_button" },
		];

		const btnWidth = 190;
		const btnHeight = 49;
		const totalBtnsHeight =
			btnDefs.length * btnHeight + (btnDefs.length - 1) * GAP;
		const margin = 40;
		const visibleBgPanelHeight = 60;
		const titleMarginTop = 36;

		const fgPanelWidth = btnWidth + margin * 2;
		const fgPanelHeight = totalBtnsHeight + margin * 2;

		const panelCenterY = cy - 100;
		const panelOffsetY = panelCenterY - cy;

		// bg_panel (solid red): bottom aligns with fgPanel center, extends upward.
		// Original used setOrigin(0.5, 1) at contentCenter — replicate by
		// computing the visual center of that rect for pixui's center-origin.
		const bgPanelHeight = fgPanelHeight / 2 + visibleBgPanelHeight;
		const bgPanelCenterY = panelCenterY - bgPanelHeight / 2;

		this.insert.center.image({
			y: bgPanelCenterY - cy,
			texture: ATLAS,
			frame: "bg_panel",
			width: fgPanelWidth,
			height: bgPanelHeight,
		});

		this.insert.center.frame({
			y: panelOffsetY,
			width: fgPanelWidth,
			height: fgPanelHeight,
		});

		const titleY = panelCenterY - bgPanelHeight + titleMarginTop;
		const titleText = this.add.text(cx, titleY, "Game title", {
			fontFamily: "Arial Black",
			fontSize: 32,
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 4,
			align: "center",
		});
		titleText.setOrigin(0.5, 0.5);

		const startY = panelCenterY - totalBtnsHeight / 2 + btnHeight / 2;
		for (let i = 0; i < btnDefs.length; i++) {
			const def = btnDefs[i];
			const btn = new TextButton(
				this,
				cx,
				startY + i * (btnHeight + GAP),
				def.text,
				ATLAS,
				def.frame,
				btnWidth,
				btnHeight,
			);
			this.add.existing(btn);
		}
	}
}

// pixui's ResponsiveScene computes viewport from window.innerWidth/Height,
// but we use Scale.FIT at a fixed 1024x768. Patch the prototype so the
// override is in place before the super() constructor chain runs.
(MainMenuOptionA.prototype as any)._getCanvasWidth = () => GAME_WIDTH;
(MainMenuOptionA.prototype as any)._getCanvasHeight = () => GAME_HEIGHT;
