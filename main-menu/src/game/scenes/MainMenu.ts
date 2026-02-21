import { Scene } from "phaser";
import { MainMenuContainer } from "../objs/MainMenuContainer";

export class MainMenu extends Scene {
	menuContainer: MainMenuContainer;

	constructor() {
		super("MainMenu");
	}

	create() {
		// Calculate center position
		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2;

		// Create main menu container
		this.menuContainer = new MainMenuContainer(this, centerX, centerY);
		this.add.existing(this.menuContainer);

		// Attach event handlers to buttons
		this.menuContainer.playButton.on("pointerup", this.onPlayClick, this);
		this.menuContainer.settingsButton.on(
			"pointerup",
			this.onSettingsClick,
			this,
		);
		this.menuContainer.quitButton.on("pointerup", this.onQuitClick, this);

		// Register cleanup on scene shutdown
		this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.menuContainer.cleanup();
		});
	}

	private onPlayClick() {
		console.log("Play clicked");
		// TODO: Transition to game scene
		// this.scene.start("Game");
	}

	private onSettingsClick() {
		console.log("Settings clicked");
		// TODO: Open settings menu
	}

	private onQuitClick() {
		console.log("Quit clicked");
		// TODO: Show quit confirmation or return to previous scene
	}
}
