import { Input, GameObjects, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";

export class BtnGO extends GameObjects.Image {
	constructor(public scene: Scene, public x: number, public y: number) {
		super(scene, x, y, defaultBtn);

		this.setInteractive();

		this.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
		this.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
	}

	protected onPointerOver() {
		// console.log(">> onPointerOver");
		this.setTexture(hoverBtn);
	}

	protected onPointerOut() {
		// console.log(">> onPointerOut");
		this.setTexture(defaultBtn);
	}

	protected onPointerDown() {
		// console.log(">> onPointerDown");
		this.setTexture(pressedBtn);

		this.emit("click");
	}

	protected onPointerUp() {
		// console.log(">> onPointerUp");
		this.setTexture(hoverBtn);
	}
}
