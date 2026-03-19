import { Scene } from "phaser";
import { MainPanel } from "../objs/panels/MainPanel";
import { CreditsPanel } from "../objs/panels/CreditsPanel";

export class MainMenu extends Scene {
    mainPanel: MainPanel;
    creditsPanel: CreditsPanel;

    constructor() {
        super("MainMenu");
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.mainPanel = new MainPanel(this, centerX, centerY - 100);
        this.add.existing(this.mainPanel);

        this.creditsPanel = new CreditsPanel(this, centerX, centerY - 100);
        this.add.existing(this.creditsPanel);

        this.mainPanel.on("credits", () => {
            this.mainPanel.setVisible(false);
            this.creditsPanel.setVisible(true);
        });

        this.creditsPanel.on("back", () => {
            this.creditsPanel.resetScroll();
            this.creditsPanel.setVisible(false);
            this.mainPanel.setVisible(true);
        });
    }
}
