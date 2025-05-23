import { Scene, type GameObjects } from "phaser";
import { EventEmitter } from "../EventEmitter";

// Custom event emitter for our demo
class CustomEmitter extends EventEmitter<{ name: "custom" }> {}

export class EventDemo extends Scene {
	private gameObjects: GameObjects.Image[] = [];
	private customEmitter: CustomEmitter;
	// private listenerCount = 0;

	constructor() {
		super("EventDemo");
	}

	create() {
		// Create a custom event emitter
		this.customEmitter = new CustomEmitter();

		// Add debug text to show listener counts
		const debugText = this.add.text(16, 16, "", {
			color: "#ffffff",
			fontSize: "16px",
		});

		// Update debug text every frame
		this.events.on("update", () => {
			const gameObjectListeners = this.gameObjects.reduce(
				(count, obj) => count + obj.listenerCount("pointerdown"),
				0,
			);

			debugText.setText(
				[
					`Game Object Listeners: ${gameObjectListeners}`,
					`Custom Emitter Listeners: ${this.customEmitter.listenerCount("custom")}`,
					"",
					"Click to create objects",
					"Press SPACE to destroy oldest object",
				].join("\n"),
			);
		});

		// Create objects on click
		this.input.on("pointerdown", () => {
			this.createObject();
		});

		// Destroy oldest object on space
		this.input.keyboard.on("keydown-SPACE", () => {
			this.destroyOldestObject();
		});
	}

	private createObject() {
		// Create a new game object
		const obj = this.add.image(
			Phaser.Math.Between(100, 700),
			Phaser.Math.Between(100, 500),
			"logo",
		);
		obj.setScale(0.2);

		// Add a game object event listener (will be auto-cleaned up)
		obj.setInteractive();
		obj.on("pointerdown", () => {
			console.log("Game object clicked!");
		});

		// Add a custom event listener (won't be auto-cleaned up)
		// const customListener =
		this.customEmitter.on("custom", () => {
			console.log("Custom event received!");
		});
		// this.listenerCount++;

		// Store the object and its custom listener
		this.gameObjects.push(obj);
	}

	private destroyOldestObject() {
		if (this.gameObjects.length === 0) return;

		const obj = this.gameObjects.shift();
		if (obj) {
			// Just destroy the object - its game object listeners will be auto-cleaned up
			// but its custom listeners will remain!
			obj.destroy();

			// Note: We're NOT removing the custom listener!
			// This demonstrates the memory leak
		}
	}
}
