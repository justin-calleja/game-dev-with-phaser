import { UiScene } from "phaser-pixui";
import { menuTheme } from "../theme";

const ATLAS = "menu_ui";
const GAP = 16;

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

		const btnWidth = 190;
		const btnHeight = 49;
		const btnCount = 5;
		const totalBtnsHeight = btnCount * btnHeight + (btnCount - 1) * GAP;
		const margin = 40;
		const visibleBgPanelHeight = 60;

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

		const bgPanelHeight = fgPanelHeight / 2 + visibleBgPanelHeight;
		this.insert.center.bitmapText({
			y: panelOffsetY - bgPanelHeight / 2 + 36,
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
