import { Scene, type GameObjects } from "phaser";

export class MainMenu3 extends Scene {
	background: GameObjects.Image;
	outerPane: GameObjects.NineSlice;
	innerPane: GameObjects.NineSlice;

	constructor() {
		super("MainMenu3");
	}

	create() {
		this.background = this.add.image(512, 384, "background");

		const width = this.scale.width / 2;
		const height = this.scale.height / 2;

		const uiContainer = this.add.container(width, height);

		// uiContainer.setO

		this.outerPane = this.add.nineslice(
			0,
			0,
			"outerPane",
			"__BASE",
			360,
			380,
			10,
			10,
			10,
			10,
		);
		this.outerPane.setOrigin(0.5, 0.5);
		uiContainer.add(this.outerPane);

		this.innerPane = this.add.nineslice(
			0,
			0,
			"innerPane",
			"__BASE",
			360,
			260,
			10,
			10,
			10,
			10,
		);
		// Start innerPane from bottom of outerPane
		this.innerPane.y = (this.outerPane.height - this.innerPane.height) / 2;

		// this.innerPane.setOrigin(0.5, 0.5);
		uiContainer.add(this.innerPane);

		window.uiContainer = uiContainer;

		// this.input.enableDebug(uiContainer);
	}
}
