import { Scene, type GameObjects } from "phaser";

export class MainMenu2 extends Scene {
	background: GameObjects.Image;
	logo: GameObjects.Image;

	constructor() {
		super("MainMenu2");
	}

	create() {
		this.background = this.add.image(512, 384, "background");

		const width = this.scale.width / 2;
		const height = this.scale.height / 2;

		this.logo = this.add.image(width, height, "logo");

		// const x = this.add.rectangle(
		// 	width,
		// 	height,
		// 	this.logo.displayWidth / 2,
		// 	this.logo.displayHeight,
		// 	0xff0000,
		// 	1,
		// );

		// Create a rectangle hit area for the left third of the image
		const hitArea = new Phaser.Geom.Rectangle(
			0,
			0,
			this.logo.displayWidth / 2,
			this.logo.displayHeight,
		);

		this.logo.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

		// Enable debug visualization of the hit area
		this.input.enableDebug(this.logo);

		window.logo = this.logo;
		window.hitArea = hitArea;

		this.logo.on("pointerdown", () => {
			this.logo.setTint(0x00ff00);
		});

		this.logo.on("pointerup", () => {
			this.logo.clearTint();
		});

		this.logo.on("pointerout", () => {
			this.logo.clearTint();
		});
	}
}
