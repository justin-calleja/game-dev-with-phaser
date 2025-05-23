import type { GameObjects, Scene } from "phaser";
import { Input } from "phaser";
import { emptyCheckbox, tickedCheckbox, tick } from "./assetKeys";

export class Checkbox {
	imgEmpty: GameObjects.Image;
	imgTicked: GameObjects.Image;
	img: GameObjects.Image;

	constructor(public scene: Scene, public x: number, public y: number) {
		this.imgEmpty = scene.add.image(x, y, emptyCheckbox);
		this.imgTicked = scene.add.image(x, y, tick);
		// this.img = scene.add.image(x, y, emptyCheckbox);

		this.imgTicked.setVisible(false);

		this.imgEmpty.setInteractive();
		// this.img.setInteractive();

		this.imgEmpty.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
		// this.img.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
	}

	public get isTicked() {
		return this.imgTicked.visible
		// return this.img.texture.key === tick;
	}

	protected onPointerDown() {
		console.log(">> onPointerDown");
		this.imgTicked.setVisible(!this.imgTicked.visible)
		// this.img.setTexture(
		// 	this.img.texture.key === tick ? emptyCheckbox : tick,
		// );
	}
}
