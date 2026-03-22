import { Display, GameObjects, Geom, Input, type Scene } from "phaser";
import { addCross, drawDebugRect, getCombinedBounds } from "../../utils";

export interface ContentItem extends GameObjects.GameObject {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface Props {
    itemGap?: number;
    padding?: number;
    maxHeight?: number;
    globalX: number;
    globalY: number;
}

export class ScrollableContent extends GameObjects.Container {
    #contentList: ContentItem[] = [];
    #viewport = new Geom.Rectangle();
    #boundingBox = new Geom.Rectangle();
    #maskGraphics: GameObjects.Graphics;
    #maskGeometry: Display.Masks.GeometryMask;
    #props: Required<Props>;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        props: Props = { globalX: 0, globalY: 0 },
    ) {
        super(scene, x, y);
        this.#props = {
            itemGap: 20,
            padding: 20,
            maxHeight: 290,
            ...props,
        };
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

        this.#viewport.x = this.#boundingBox.x - this.#props.padding;
        this.#viewport.y = this.#boundingBox.y - this.#props.padding;
        this.#viewport.width =
            this.#boundingBox.width + this.#props.padding * 2;
        this.#viewport.height = Math.min(
            this.#boundingBox.height + this.#props.padding,
            this.#props.maxHeight,
        );

        this.add(this.#contentList);

        this.width = this.#boundingBox.width;
        this.height = this.#boundingBox.height;

        this.#maskGraphics = this.scene.make.graphics(undefined, false);
        this.#maskGraphics.fillStyle(0xffffff);
        this.#maskGraphics.fillRect(
            // this.#props.globalX,
            // this.#props.globalY,
            this.#props.globalX + this.#viewport.x,
            this.#props.globalY + this.#viewport.y,
            this.#viewport.width,
            this.#viewport.height,
        );
        this.#maskGeometry = this.#maskGraphics.createGeometryMask();
        // window.viewport = this.#viewport;
        // window.maskGeometry = this.#maskGeometry;
        // window.maskGraphics = this.#maskGraphics;
        // window.scrollableContent = this;
        // console.log("this.x", this.x);
        // console.log("this.y", this.y);
        this.setMask(this.#maskGeometry);

        const totalContentHeight =
            this.#boundingBox.height + this.#props.padding * 2;
        const viewportHeight = this.#viewport.height;
        // this.#isScrollable = totalContentHeight > viewportHeight;
        this.#maxScroll = totalContentHeight - viewportHeight;
        this.#scrollY = 0;

        drawDebugRect(this.scene, this.#boundingBox, this);
        drawDebugRect(this.scene, this.#viewport, undefined, 0xbf40bf);

        this.scene.input.on(
            "wheel",
            (
                pointer: Input.Pointer,
                _gameObjects: GameObjects.GameObject[],
                _deltaX: number,
                deltaY: number,
            ) => {
                // const containerX = this.#props.container?.x ?? 0;
                // const containerY = this.#props.container?.y ?? 0;
                // const worldX = containerX + this.expandedBox.x;
                // const worldY = containerY + this.expandedBox.y;

                const worldX = this.#props.globalX + this.#viewport.x;
                const worldY = this.#props.globalY + this.#viewport.y;
                if (
                    pointer.x < worldX ||
                    pointer.x > worldX + this.#viewport.width ||
                    pointer.y < worldY ||
                    pointer.y > worldY + this.#viewport.height
                ) {
                    return;
                }
                this.#scrollY = Phaser.Math.Clamp(
                    this.#scrollY + deltaY * 0.5,
                    0,
                    this.#maxScroll,
                );
                this.y = -this.#scrollY;
            },
        );
    }

    #maxScroll = 0;
    #scrollY = 0;

    #repositionContent() {
        if (this.#contentList.length === 0) {
            return;
        }

        Phaser.Actions.AlignTo(
            this.#contentList,
            Phaser.Display.Align.BOTTOM_CENTER,
            0,
            this.#props.itemGap,
        );
    }

    getViewportCenterX() {
        return this.#viewport.centerX;
    }

    getViewportCenterY() {
        return this.#viewport.centerY;
    }

    getViewportWidth() {
        return this.#viewport.width;
    }

    getViewportHeight() {
        return this.#viewport.height;
    }
}
