import { GameObjects, type Scene } from "phaser";
import { defaultTextStyle } from "../../utils";

export interface ContentItem extends GameObjects.GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
}

export class MainMenuPanel extends GameObjects.Container {
    titleText: GameObjects.Text;
    bgPanel: GameObjects.NineSlice;
    fgPanel: GameObjects.NineSlice;

    contentList: ContentItem[];

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        this.contentList = [];

        this.titleText = new GameObjects.Text(scene, 0, 0, "", {
            ...defaultTextStyle,
            fontSize: 32,
            strokeThickness: 4,
        });
        this.titleText.setOrigin(0.5, 0.5);

        this.add([this.bgPanel, this.fgPanel, this.titleText]);
    }

    setTitleText(text: string) {
        this.titleText.setText(text);
    }

    setContent(contentList: ContentItem[]) {
        this.contentList = contentList;
        for (const item of this.contentList) {
            this.add(item);
        }
    }
}
