import { Input, type GameObjects, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";
import { EventEmitter } from "./EventEmitter";

export type ButtonEvent = { name: "click" };

export class Button extends EventEmitter<ButtonEvent> {
	img: GameObjects.Image;

	constructor(public scene: Scene, public x: number, public y: number) {
		super();

		this.img = scene.add.image(x, y, defaultBtn);

		this.img.setInteractive();

		this.img.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
		this.img.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
		this.img.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
		this.img.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);

		scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
			console.log("Button >> shutdown");
			this.removeAllListeners();
		});
	}

	protected onPointerOver() {
		// console.log(">> onPointerOver");
		this.img.setTexture(hoverBtn);
	}

	protected onPointerOut() {
		// console.log(">> onPointerOut");
		this.img.setTexture(defaultBtn);
	}

	protected onPointerDown() {
		// console.log(">> onPointerDown");
		this.img.setTexture(pressedBtn);

		this.emit("click");
	}

	protected onPointerUp() {
		// console.log(">> onPointerUp");
		this.img.setTexture(hoverBtn);
	}
}
