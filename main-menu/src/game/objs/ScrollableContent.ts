import { Display, GameObjects, Geom, Scene } from "phaser";
import { drawDebugRect, getCombinedBounds } from "../../utils";

export interface Props {
    itemGap?: number;
    padding?: number;
    maxHeight?: number;
}

export interface ContentItem extends GameObjects.GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
}

export class ScrollableContent {
    x: number;
    y: number;
    #container: GameObjects.Container;
    #props: Required<Props>;
    #scene: Scene;
    #viewport = new Geom.Rectangle();
    #boundingBox = new Geom.Rectangle();
    #maskGraphics: GameObjects.Graphics;
    #maskGeometry: Display.Masks.GeometryMask;

    constructor(scene: Scene, x: number, y: number, props: Props = {}) {
        this.x = x;
        this.y = y;
        this.#boundingBox.centerX = this.x;
        this.#boundingBox.centerY = this.y;

        this.#scene = scene;
        this.#props = {
            itemGap: 20,
            padding: 20,
            maxHeight: 290,
            ...props,
        };
        this.#container = scene.make.container({ x: this.x, y: this.y }, false);
    }

    getContainer() {
        return this.#container;
    }

    setContent(contentList: ContentItem[]) {
        console.log("setting content in ScrollableContent");
        this.#container.removeAll(true);
        this.#container.add(contentList);
        this.#scene.add.existing(this.#container);
        this.#repositionContent();

        console.log(
            "bounding box center before resize:",
            this.#boundingBox.centerX,
            this.#boundingBox.centerY,
        );
        getCombinedBounds(this.#container.getAll(), this.#boundingBox);
        console.log(
            "bounding box center after resize:",
            this.#boundingBox.centerX,
            this.#boundingBox.centerY,
        );
        this.#boundingBox.x = this.#container.getAt(0).
        this.#boundingBox.y = this.#container.getAt(0).y;
        // this.#boundingBox.centerX = this.x;
        // this.#boundingBox.centerY = this.y;
        // Phaser.Geom.Rectangle.CenterOn(this.#boundingBox, this.x, this.y);

        this.#scene.add
            .existing(drawDebugRect(this.#scene, this.#boundingBox))
            .setDepth(9999);
        this.#scene.add
            .existing(
                drawDebugRect(this.#scene, this.#viewport, undefined, 0xbf40bf),
            )
            .setDepth(9999);
    }

    #repositionContent() {
        if (this.#container.length === 0) {
            return;
        }

        Phaser.Actions.AlignTo(
            this.#container.getAll(),
            Phaser.Display.Align.BOTTOM_CENTER,
            0,
            this.#props.itemGap,
        );
    }
}
