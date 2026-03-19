import { Input, type Scene } from "phaser";
import { MenuPanel } from "./MenuPanel";
import { PrimaryButton, SecondaryButton } from "../buttons";

export class MainPanel extends MenuPanel {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        this.setTitleText("Game title");

        const btn1 = new PrimaryButton(scene, 0, 0, "Start game");
        const btn2 = new SecondaryButton(scene, 0, 0, "Options");
        const btn3 = new SecondaryButton(scene, 0, 0, "Credits");
        const btn5 = new SecondaryButton(scene, 0, 0, "Quit");
        const btns = [btn1, btn2, btn3, btn5];

        btn3.on(Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.emit("credits");
        });

        this.setContent(btns);
        this.repositionContent();
        this.resize();
    }
}
