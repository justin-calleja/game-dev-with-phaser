import type { Scene } from "phaser";
import { MenuPanel } from "./MenuPanel";
import { PrimaryButton, SecondaryButton } from "../buttons";

export class MainPanel extends MenuPanel {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        const btn1 = new PrimaryButton(scene, 0, 0, "Start game");
        const btn2 = new SecondaryButton(scene, 0, 0, "Options");
        const btn3 = new SecondaryButton(scene, 0, 0, "Credits");
        const btns = [btn1, btn2, btn3];

        this.setContent(btns);
        this.repositionContent();

        btn1.setInitialY(btn1.y);
        btn2.setInitialY(btn2.y);
        btn3.setInitialY(btn3.y);
    }
}
