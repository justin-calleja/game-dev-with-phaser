import { GameObjects, type Scene } from "phaser";
import { ButtonContainer } from "./ButtonContainer";

export class MainMenuContainer extends Phaser.GameObjects.Container {
	backgroundPanel: GameObjects.NineSlice;
	titleText: GameObjects.Text;
	playButton: ButtonContainer;
	settingsButton: ButtonContainer;
	quitButton: ButtonContainer;

	constructor(scene: Scene, x: number, y: number) {
		super(scene, x, y);

		// Create background panel
		this.backgroundPanel = scene.make.nineslice({
			x: 0,
			y: -20,
			key: "red-panel",
			leftWidth: 10,
			rightWidth: 10,
			topHeight: 10,
			bottomHeight: 10,
			width: 450,
			height: 450,
		});

		// Create title text
		this.titleText = new GameObjects.Text(scene, 0, -150, "Jump reps", {
			fontFamily: "Arial Black",
			fontSize: 48,
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 8,
			align: "center",
		});
		this.titleText.setOrigin(0.5, 0.5);

		// Create buttons
		this.playButton = new ButtonContainer(
			scene,
			0,
			0,
			// -60,
			"Play",
			"primary-button-normal",
			"primary-button-normal", // No pressed variant loaded yet
		);

		this.settingsButton = new ButtonContainer(
			scene,
			0,
			0,
			"Settings",
			"secondary-button-normal",
			"secondary-button-pressed",
		);

		this.quitButton = new ButtonContainer(
			scene,
			0,
			0,
			// 60,
			"Quit",
			"secondary-button-normal",
			"secondary-button-pressed",
		);

        this.playButton.setPosition(0, -20);
		Phaser.Actions.AlignTo(
			[this.playButton, this.settingsButton, this.quitButton],
			Phaser.Display.Align.BOTTOM_CENTER,
			0,
			8,
		);

		this.playButton.setInitialY(this.playButton.y);
		this.settingsButton.setInitialY(this.settingsButton.y);
		this.quitButton.setInitialY(this.quitButton.y);

		window.playButton = this.playButton;
		window.settingsButton = this.settingsButton;
		window.quitButton = this.quitButton;

		// Add all children to container
		this.add([
			this.backgroundPanel,
			this.titleText,
			this.playButton,
			this.settingsButton,
			this.quitButton,
		]);

		// Set container size to background panel dimensions
		this.setSize(this.backgroundPanel.width, this.backgroundPanel.height);
	}

	cleanup() {
		this.playButton.removeAllListeners();
		this.settingsButton.removeAllListeners();
		this.quitButton.removeAllListeners();
	}
}
