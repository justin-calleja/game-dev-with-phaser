import { GameObjects, Geom, type Scene } from "phaser";
import { drawDebugRect, getCombinedBounds } from "../../utils";

export interface ContentItem extends GameObjects.GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
}

const defaultGap = 16;

export class ScrollableContent extends GameObjects.Container {
    #contentList: ContentItem[] = [];
    #viewport = new Geom.Rectangle();
    #boundingBox = new Geom.Rectangle();

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
    }

    setContent(contentList: ContentItem[]) {
        this.#contentList = contentList;

        this.#repositionContent();

        getCombinedBounds(this.#contentList, this.#boundingBox);

        for (const item of this.#contentList) {
            item.x -= this.#boundingBox.centerX;
            item.y -= this.#boundingBox.centerY;
        }
        this.#boundingBox.centerX = 0;
        this.#boundingBox.centerY = 0;

        this.add(this.#contentList);

        this.width = this.#boundingBox.width;
        this.height = this.#boundingBox.height;

        drawDebugRect(this.scene, this.#boundingBox, this);
    }

    #repositionContent() {
        if (this.#contentList.length === 0) {
            return;
        }

        Phaser.Actions.AlignTo(
            this.#contentList,
            Phaser.Display.Align.BOTTOM_CENTER,
            0,
            defaultGap,
        );
    }

    getViewportWidth() {
        return this.#viewport.width;
    }

    getViewportHeight() {
        return this.#viewport.height;
    }
}
