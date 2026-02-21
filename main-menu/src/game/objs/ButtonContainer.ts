import { GameObjects, Input, type Scene } from "phaser";

export class ButtonContainer extends Phaser.GameObjects.Container {
	nineSlice: GameObjects.NineSlice;
	textGO: GameObjects.Text;
	initialY: number;
	yOffset = 2;
	assetKey: string;
	assetKeyPressed: string;

	constructor(
		scene: Scene,
		x: number,
		y: number,
		textContent: string,
		assetKey: string,
		assetKeyPressed: string,
	) {
		super(scene, x, y);
		this.initialY = y;
		this.assetKey = assetKey;
		this.assetKeyPressed = assetKeyPressed;

		// Create NineSlice background using GameObjectCreator (scene.make)
		this.nineSlice = scene.make.nineslice({
			x: 0,
			y: 0,
			key: assetKey,
			leftWidth: 10,
			rightWidth: 10,
			topHeight: 10,
			bottomHeight: 10,
			width: 190,
			height: 49,
		});

		// Create text label
		this.textGO = new GameObjects.Text(scene, 0, 0, textContent, {
			fontFamily: "Arial Black",
			fontSize: 24,
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 8,
			align: "center",
		});
		this.textGO.setOrigin(0.5, 0.5);

		// Add children to container
		this.add([this.nineSlice, this.textGO]);

		// Set container size for input hit area
		this.setSize(this.nineSlice.width, this.nineSlice.height);
		this.setInteractive();

		// Register pointer event handlers
		this.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
	}

	protected onPointerOver() {
		this.y += this.yOffset;
	}

	protected onPointerOut() {
		this.nineSlice.setTexture(this.assetKey);
		this.y = this.initialY;
	}

	protected onPointerDown() {
		this.nineSlice.setTexture(this.assetKeyPressed);
		this.y += this.yOffset;
	}

	protected onPointerUp() {
		this.nineSlice.setTexture(this.assetKey);
		this.y -= this.yOffset;
	}

	public setInitialY(y: number) {
		this.initialY = y;
	}
}
