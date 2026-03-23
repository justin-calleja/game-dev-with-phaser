import { GameObjects, Input, type Scene } from "phaser";

const defaultTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
	fontFamily: "Arial Black",
	fontSize: 24,
	color: "#ffffff",
	stroke: "#000000",
	strokeThickness: 8,
	align: "center",
};

/**
 * A button backed by an atlas NineSlice frame + GameObjects.Text label.
 * Used in Option A where we want scalable TTF text instead of BitmapFont.
 */
export class TextButton extends GameObjects.Container {
	nineSlice: GameObjects.NineSlice;
	label: GameObjects.Text;
	private yOffset = 2;

	constructor(
		scene: Scene,
		x: number,
		y: number,
		text: string,
		atlas: string,
		frame: string,
		width = 190,
		height = 49,
	) {
		super(scene, x, y);

		this.nineSlice = scene.make.nineslice({
			key: atlas,
			frame,
			width,
			height,
		});

		this.label = new GameObjects.Text(scene, 0, 0, text, {
			...defaultTextStyle,
		});
		this.label.setOrigin(0.5, 0.5);

		this.add([this.nineSlice, this.label]);

		this.setSize(width, height);
		this.setInteractive();

		this.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
	}

	private onPointerOver() {
		this.nineSlice.setSize(
			this.nineSlice.width * 1.08,
			this.nineSlice.height * 1.08,
		);
		this.label.setScale(1.08);
	}

	private onPointerOut() {
		this.nineSlice.setSize(
			this.nineSlice.width / 1.08,
			this.nineSlice.height / 1.08,
		);
		this.label.setScale(1);
	}

	private onPointerDown() {
		this.y += this.yOffset;
	}

	private onPointerUp() {
		this.y -= this.yOffset;
	}
}
