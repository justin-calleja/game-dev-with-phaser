import { GameObjects, type Scene } from "phaser";
import {
    addCross,
    defaultNineSliceConfig,
    defaultTextStyle,
    // drawDebugRect,
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

    #scrollableContent: ScrollableContent;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        this.#scrollableContent = new ScrollableContent(scene, 0, 0, {
            globalX: x,
            globalY: y,
        });

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

        this.add([
            this.bgPanel,
            this.fgPanel,
            this.titleText,
            this.#scrollableContent,
        ]);
    }

    setTitleText(text: string) {
        this.titleText.setText(text);
    }

    setContent(contentList: ContentItem[]) {
        this.#scrollableContent.setContent(contentList);
        this.resize();
    }

    protected resize() {
        // drawDebugRect(this.scene, this.#boundingBox, this);
        this.add(
            addCross(
                this.scene,
                this.#scrollableContent.x,
                this.#scrollableContent.y,
                4,
                10,
                0xffffff,
            ),
        );

        this.scene.add
            .existing(addCross(this.scene, this.x, this.y, 4, 10, 0x000000))
            .setDepth(99);

        this.fgPanel.x = this.#scrollableContent.getViewportCenterX();
        this.fgPanel.y = this.#scrollableContent.getViewportCenterY();
        this.fgPanel.width = Math.max(
            this.#scrollableContent.getViewportWidth() + defaultMargin * 2,
            defaultMinWidth,
        );
        this.fgPanel.height =
            this.#scrollableContent.getViewportHeight() + defaultMargin * 2;

        this.bgPanel.x = this.#scrollableContent.getViewportCenterX();
        this.bgPanel.y = this.#scrollableContent.getViewportCenterY();
        this.bgPanel.width = this.fgPanel.width;
        this.bgPanel.height =
            this.fgPanel.height / 2 + defaultVisibleBgPanelHeight;

        this.titleText.x = this.#scrollableContent.getViewportCenterX();
        this.titleText.y =
            this.#scrollableContent.getViewportCenterY() -
            this.bgPanel.height +
            defaultTitleMarginTop;
    }
}
