import { Grid } from "../Grid";
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

		const { width, height } = this.scale;

		const grid = new Grid<Phaser.GameObjects.Sprite>({
			margin: 12,
			size: 3,
			gameObjectCreator: () => {
				const sprite = this.make
					.sprite({ key: assetPackKey }, false)
					.setScale(4);

				return sprite;
			},
		});

		grid.forEachEl((sprite, rowIndex, columnIndex) => {
			// Calculate offsets
			const totalWidth = grid.getDisplayWidth();
			const totalHeight = grid.getDisplayHeight();
			const cellX =
				sprite.displayWidth * columnIndex + grid.margin * columnIndex;
			const cellY = sprite.displayHeight * rowIndex + grid.margin * rowIndex;

			// Position relative to the grid center
			sprite.setPosition(
				cellX - totalWidth / 2 + sprite.displayWidth / 2,
				cellY - totalHeight / 2 + sprite.displayHeight / 2,
			);
		});

		const centerX = width / 2;
		const centerY = height / 2;

		const container = this.add.container(centerX, centerY, grid.getEls());
		// window.container = container

		this.drawCross(container.x, container.y);
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
