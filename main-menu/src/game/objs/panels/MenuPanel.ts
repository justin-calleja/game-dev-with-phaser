import { GameObjects, Geom, type Scene } from "phaser";
import {
    addCross,
    defaultNineSliceConfig,
    defaultTextStyle,
    drawDebugRect,
    getCombinedBounds,
} from "../../../utils";
import { ScrollableContainer } from "../ScrollableContainer";

export interface ContentItem extends GameObjects.GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
}

// This is the amount by which the bgPanel sticks out over and above the fgPanel.
const defaultVisibleBgPanelHeight = 60;
const defaultMinWidth = 200;
const defaultMargin = 40;
const defaultTitleMarginTop = 36;
const defaultGap = 16;

export class MenuPanel extends GameObjects.Container {
    #boundingBox = new Geom.Rectangle();
    titleText: GameObjects.Text;
    bgPanel: GameObjects.NineSlice;
    fgPanel: GameObjects.NineSlice;

    contentList: ContentItem[];
    scrollable: ScrollableContainer;
    maxContentHeight = 300;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        this.contentList = [];
        this.scrollable = new ScrollableContainer(scene, this);

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
            this.scrollable.contentContainer,
            this.titleText,
        ]);
    }

    setTitleText(text: string) {
        this.titleText.setText(text);
    }

    setContent(contentList: ContentItem[]) {
        this.scrollable.destroyScrolling();
        this.contentList = contentList;
        this.scrollable.contentContainer.add(contentList);
    }

    protected repositionContent() {
        if (this.contentList.length === 0) {
            return;
        }

        Phaser.Actions.AlignTo(
            this.contentList,
            Phaser.Display.Align.BOTTOM_CENTER,
            0,
            defaultGap,
        );
    }

    protected resize() {
        getCombinedBounds(this.contentList, this.#boundingBox);
        drawDebugRect(this.scene, this.#boundingBox, this);

        const bbox = this.#boundingBox;
        const contentHeight = bbox.height;
        const needsScrolling = contentHeight > this.maxContentHeight;
        const visibleHeight = needsScrolling
            ? this.maxContentHeight
            : contentHeight;

        const fgWidth = Math.max(
            bbox.width + defaultMargin * 2,
            defaultMinWidth,
        );
        const fgHeight = visibleHeight + defaultMargin * 2;

        this.fgPanel.x = bbox.centerX;
        this.fgPanel.width = fgWidth;
        this.fgPanel.height = fgHeight;

        this.add(
            addCross(
                this.scene,
                this.fgPanel.x,
                this.fgPanel.y,
                // this.#boundingBox.centerX,
                // this.#boundingBox.centerY,
            ),
        );

        if (needsScrolling) {
            this.fgPanel.y = bbox.top + visibleHeight / 2;
        } else {
            this.fgPanel.y = bbox.centerY;
        }

        this.bgPanel.x = this.fgPanel.x;
        this.bgPanel.y = this.fgPanel.y;
        this.bgPanel.width = this.fgPanel.width;
        this.bgPanel.height =
            this.fgPanel.height / 2 + defaultVisibleBgPanelHeight;

        this.titleText.x = this.fgPanel.x;
        this.titleText.y =
            this.fgPanel.y - this.bgPanel.height + defaultTitleMarginTop;

        if (needsScrolling) {
            this.scrollable.enableScrolling(
                {
                    x: this.fgPanel.x,
                    y: this.fgPanel.y,
                    width: fgWidth - defaultMargin * 2,
                    height: visibleHeight,
                },
                contentHeight,
            );
            // Only needed if layers added after title is added (e.g. scrollbar rectangles) overlap in screen space:
            // this.bringToTop(this.titleText);
        }
    }

    resetScroll() {
        this.scrollable.resetScroll();
    }

    destroy(fromScene?: boolean) {
        this.scrollable.destroy();
        super.destroy(fromScene);
    }
}
