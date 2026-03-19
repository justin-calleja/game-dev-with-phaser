import { GameObjects, Input, type Scene } from "phaser";
import { MenuPanel } from "./MenuPanel";
import { SecondaryButton } from "../buttons";
import { defaultTextStyle } from "../../../utils";

const creditEntries: { text: string; isHeader: boolean }[] = [
    { text: "── Programming ──", isHeader: true },
    { text: "Justin Carter", isHeader: false },
    { text: "Alice Johnson", isHeader: false },
    { text: "Bob Smith", isHeader: false },
    { text: "── Art & Design ──", isHeader: true },
    { text: "Charlie Wilson", isHeader: false },
    { text: "Diana Taylor", isHeader: false },
    { text: "Eve Adams", isHeader: false },
    { text: "── Music ──", isHeader: true },
    { text: "Frank Anderson", isHeader: false },
    { text: "Grace Thomas", isHeader: false },
    { text: "── Sound Design ──", isHeader: true },
    { text: "Henry Jackson", isHeader: false },
    { text: "Iris White", isHeader: false },
    { text: "── Level Design ──", isHeader: true },
    { text: "Jack Harris", isHeader: false },
    { text: "Kate Martin", isHeader: false },
    { text: "── QA Testing ──", isHeader: true },
    { text: "Leo Garcia", isHeader: false },
    { text: "Mia Martinez", isHeader: false },
    { text: "Noah Robinson", isHeader: false },
    { text: "── Special Thanks ──", isHeader: true },
    { text: "The open source community", isHeader: false },
    { text: "All our beta testers", isHeader: false },
];

export class CreditsPanel extends MenuPanel {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        this.setTitleText("Credits");

        const items: (GameObjects.Text | SecondaryButton)[] = [];

        for (const entry of creditEntries) {
            const text = new GameObjects.Text(scene, 0, 0, entry.text, {
                ...defaultTextStyle,
                fontSize: entry.isHeader ? 20 : 16,
                strokeThickness: entry.isHeader ? 6 : 3,
                color: entry.isHeader ? "#ffe0e0" : "#ffffff",
            });
            text.setOrigin(0.5, 0.5);
            items.push(text);
        }

        const backBtn = new SecondaryButton(scene, 0, 0, "Back");
        backBtn.on(Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.emit("back");
        });
        items.push(backBtn);

        this.setContent(items);
        this.repositionContent();
        this.resize();

        this.setVisible(false);
    }
}
