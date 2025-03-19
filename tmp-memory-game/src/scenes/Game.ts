import { assetPackKey } from "../utils";
import { Scene } from "./Scene";

export class Game extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	msg_text: Phaser.GameObjects.Text;

	constructor() {
		super("Game");
	}

	create() {
		const fadeDuration = this.getFromRegistry("fadeDuration");
		this.cameras.main.fadeIn(fadeDuration, 0, 0, 0);

		// this.add.sprite(400 + box1.displayWidth + 4, 300, assetPackKey, 1).setScale(2);
		const margin = 4;

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const sprite = this.make
					.sprite({ key: assetPackKey }, false)
					.setScale(2);

				sprite.setPosition(
					396 + sprite.displayWidth * j + margin,
					296 + sprite.displayHeight * i + margin,
				);

				this.add.existing(sprite);
			}

			// this.drawCross(396, 296);
			this.drawCross(400, 300);
		}
		// this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
		//     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
		//     stroke: '#000000', strokeThickness: 8,
		//     align: 'center'
		// });
		// this.msg_text.setOrigin(0.5);
	}

	drawCross(x: number, y: number, lineLength = 10, lineWidth = 1) {
		const graphics = this.add.graphics({
			lineStyle: { width: lineWidth, color: 0xff0000 },
		});

		// Draw horizontal line
		graphics.strokeLineShape(
			new Phaser.Geom.Line(x - lineLength, y, x + lineLength, y),
		);

		// Draw vertical line
		graphics.strokeLineShape(
			new Phaser.Geom.Line(x, y - lineLength, x, y + lineLength),
		);
	}
}
