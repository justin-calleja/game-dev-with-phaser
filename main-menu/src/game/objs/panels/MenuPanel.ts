import { GameObjects, type Scene } from "phaser";
import { defaultNineSliceConfig, defaultTextStyle } from "../../../utils";

export interface ContentItem extends GameObjects.GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
}

// This is the amount by which the bgPanel sticks out over and above the fgPanel.
const defaultVisibleBgPanelHeight = 60;

export class MenuPanel extends GameObjects.Container {
    titleText: GameObjects.Text;
    bgPanel: GameObjects.NineSlice;
    fgPanel: GameObjects.NineSlice;

    contentList: ContentItem[];

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        this.contentList = [];

        this.fgPanel = scene.make.nineslice(
            {
                ...defaultNineSliceConfig,
                key: "panel-grey-with-red-border",
                width: 400,
                height: 300,
            },
            false,
        );

        this.bgPanel = scene.make.nineslice(
            {
                ...defaultNineSliceConfig,
                key: "red-panel",
                width: this.fgPanel.width,
                height: this.fgPanel.height / 2 + defaultVisibleBgPanelHeight,
            },
            false,
        );
        this.bgPanel.setOrigin(0.5, 1);

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
        this.add(contentList);
    }

    protected repositionContent() {
        if (this.contentList.length === 0) {
            return;
        }

        Phaser.Actions.AlignTo(
            this.contentList,
            Phaser.Display.Align.BOTTOM_CENTER,
            0,
            10,
        );
    }
}
