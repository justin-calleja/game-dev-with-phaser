import { Scene } from "phaser";
import { MainPanel } from "../objs/panels/MainPanel";
import { addCross } from "../../utils";

export class MainMenu extends Scene {
    mainPanel: MainPanel;

    constructor() {
        super("MainMenu");
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.mainPanel = new MainPanel(this, centerX, centerY - 100);
        this.add.existing(this.mainPanel);
        // this.add.existing(addCross(this, this.mainPanel.x, this.mainPanel.y));
    }
}
