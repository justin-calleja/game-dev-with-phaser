import { Scene, GameObjects } from "phaser";
// import { Button } from "../Button";
import { Btn } from "../Btn";
import { Checkbox } from "../Checkbox";

export class MainMenu extends Scene {
	background: GameObjects.Image;
	logo: GameObjects.Image;
	title: GameObjects.Text;

	constructor() {
		super("MainMenu");
	}

	create() {
		this.background = this.add.image(512, 384, "background");

		// const btn = new Button(
		//   this,
		//   this.cameras.main.centerX,
		//   this.cameras.main.centerY
		// );
		// // this.add.image(200, 200, "flat");

		// setInterval(() => {
		//   btn.showImage(btn.getNextImage());
		// }, 1000);

		const btn = new Btn(this, this.scale.width / 2, this.scale.height / 2);
		const checkbox = new Checkbox(this, this.scale.width / 2 - 200, this.scale.height / 2);
    window.checkbox = checkbox
	}
}
