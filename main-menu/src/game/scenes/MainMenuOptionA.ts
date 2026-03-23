import { UiScene } from "phaser-pixui";
import { menuTheme } from "../theme";
import { TextButton } from "../objs/TextButton";

const ATLAS = "menu_ui";
const GAP = 16;

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
			viewportConstraints: { width: 512, height: 384 },
		});
	}

	preload() {
		super.preload();
		this.load.setPath("");
		this.load.image("background", "assets/bg.png");
	}

	create() {
		super.create();

		const vw = this.viewport.width;
		const vh = this.viewport.height;
		const cx = Math.floor(vw / 2);
		const cy = Math.floor(vh / 2);

		const bg = this.add.image(cx, cy, "background");
		bg.setDisplaySize(vw, vh);

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

		const panelOffsetY = -40;

		this.insert.center.image({
			y: panelOffsetY - fgPanelHeight / 4 + visibleBgPanelHeight / 2,
			texture: ATLAS,
			frame: "bg_panel",
			width: fgPanelWidth,
			height: fgPanelHeight / 2 + visibleBgPanelHeight,
		});

		this.insert.center.frame({
			y: panelOffsetY,
			width: fgPanelWidth,
			height: fgPanelHeight,
		});

		const bgPanelHeight = fgPanelHeight / 2 + visibleBgPanelHeight;
		const titleY = cy + panelOffsetY - bgPanelHeight / 2 + titleMarginTop;
		const titleText = this.add.text(cx, titleY, "Game title", {
			fontFamily: "Arial Black",
			fontSize: 32,
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 4,
			align: "center",
		});
		titleText.setOrigin(0.5, 0.5);

		const startY =
			cy + panelOffsetY - totalBtnsHeight / 2 + btnHeight / 2;
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
