import { Scene } from "phaser";
import { MainMenuPanel } from "../objs/MainMenuPanel";

export class MainMenu extends Scene {
    panel: MainMenuPanel;

    constructor() {
        super("MainMenu");
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.panel = new MainMenuPanel(this, centerX, centerY);
        this.add.existing(this.panel);
    }
}
