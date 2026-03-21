import { GameObjects, Geom, type Scene } from "phaser";
import {
    addCross,
    defaultNineSliceConfig,
    defaultTextStyle,
    // drawDebugRect,
    getCombinedBounds,
} from "../../../utils";
import { ContentItem, ScrollableContent } from "../ScrollableContent";

// This is the amount by which the bgPanel sticks out over and above the fgPanel.
const defaultVisibleBgPanelHeight = 60;
const defaultMinWidth = 200;
const defaultMargin = 40;
const defaultTitleMarginTop = 36;

export class MenuPanel extends GameObjects.Container {
    titleText: GameObjects.Text;
    bgPanel: GameObjects.NineSlice;
    fgPanel: GameObjects.NineSlice;

    scrollableContent: ScrollableContent;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        console.log("x: ", x, "y: ", y);

        // scene.add.existing
        // this.contentList = [];

        this.fgPanel = scene.make.nineslice(
            {
                ...defaultNineSliceConfig,
                key: "panel-grey-with-red-border",
                width: 400,
                height: 300,
            },
            false,
        );

        this.scrollableContent = new ScrollableContent({
            scene,
            maxHeight: 200,
            container: this,
            targetOfMask: this.fgPanel,
        });

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
        this.scrollableContent.setContent(contentList);
        // if (this.scrollableContent.mask) {
        //     this.add(this.scrollableContent.mask);
        // }
        // this.scrollableContent.abc();
        this.add(this.scrollableContent.contentList);
        this.#resize();
    }

    #resize() {
        this.fgPanel.x = this.scrollableContent.centerX;
        this.fgPanel.y = this.scrollableContent.centerY;
        this.fgPanel.width = Math.max(
            this.scrollableContent.width + defaultMargin * 2,
            defaultMinWidth,
        );
        this.fgPanel.height = this.scrollableContent.height + defaultMargin * 2;

        this.bgPanel.x = this.scrollableContent.centerX;
        this.bgPanel.y = this.scrollableContent.centerY;
        this.bgPanel.width = this.fgPanel.width;
        this.bgPanel.height =
            this.fgPanel.height / 2 + defaultVisibleBgPanelHeight;

        this.titleText.x = this.scrollableContent.centerX;
        this.titleText.y =
            this.scrollableContent.centerY -
            this.bgPanel.height +
            defaultTitleMarginTop;
    }
}
