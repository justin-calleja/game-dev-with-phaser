import { Display, GameObjects, Geom, Input, type Scene } from "phaser";
import { addCross, drawDebugRect, getCombinedBounds } from "../../utils";

export interface ScrollViewport {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ContentItem
    extends GameObjects.GameObject, GameObjects.Components.Mask {
    width: number;
    height: number;
    x: number;
    y: number;
}

const defaultGap = 16;

// If a container is provided, the container will take precedence over scene
// and content will be added to the container's display list (not the scene's).
export interface Props {
    maxHeight: number;
    scene: Scene;
    container?: GameObjects.Container;
    padding?: number;
    // targetOfMask: GameObjects.NineSlice;
    targetOfMask: GameObjects.Components.Mask;
    // globalX?: number;
    // globalY?: number;
}

export class ScrollableContent {
    readonly scene?: Scene;
    readonly container?: GameObjects.Container;

    contentList: ContentItem[];
    #boundingBox = new Geom.Rectangle();
    expandedBox = new Geom.Rectangle();
    #maskGraphics: GameObjects.Graphics | null = null;
    mask: Display.Masks.GeometryMask | null = null;
    #isScrollable = false;
    #maxScroll = 0;
    #scrollY = 0;
    #originalPositions: number[] = [];
    #props: Omit<Required<Props>, "container"> & Pick<Props, "container">;

    constructor(props: Props) {
        this.#props = {
            padding: 20,
            // globalX: 0,
            // globalY: 0,
            ...props,
        };
        // this.scene = scene;
        // this.parent = parent;
        // this.contentContainer = new GameObjects.Container(scene, 0, 0);

        // getCombinedBounds(this.contentList, this.#boundingBox);
    }

    get centerX() {
        // return this.#boundingBox.centerX;
        return this.expandedBox.centerX;
    }

    get centerY() {
        // return this.#boundingBox.centerY;
        return this.expandedBox.centerY;
    }

    get width() {
        // return this.#boundingBox.width;
        return this.expandedBox.width;
    }

    get height() {
        // return this.#boundingBox.height;
        return this.expandedBox.height;
    }

    enableScrolling() {
        const firstItem = this.contentList[0];

        // this.scene.add
        //     .existing(
        //         addCross(this.scene, firstItem.x, firstItem.y, 4, 10, 0x00ffff),
        //     )
        //     .setDepth(9);

        // Phaser.Display.Bounds.GetLeft/GetTop account for the object's originX/originY,
        // so they always return the true top-left corner regardless of the origin setting.
        // (e.g. originX=0.5 → left = x - width/2; originX=0 → left = x)
        const itemLeft = Phaser.Display.Bounds.GetLeft(firstItem);
        const itemTop = Phaser.Display.Bounds.GetTop(firstItem);
        console.log("itemLeft: ", itemLeft, "itemTop: ", itemTop);
        console.log("firstItem.x: ", firstItem.x, "firstItem.y: ", firstItem.y);
        console.log(
            "boundingBox.left: ",
            this.#boundingBox.left,
            "boundingBox.top: ",
            this.#boundingBox.top,
        );

        this.#maskGraphics = this.#props.scene.make.graphics(undefined, false);
        this.#maskGraphics.fillStyle(0xffffff);
        this.#maskGraphics.fillRect(
            // 0,
            // 0,
            this.#props.container
                ? this.#props.container.x + this.expandedBox.x
                : 0,
            this.#props.container
                ? this.#props.container.y + this.expandedBox.y
                : 0,
            // this.expandedBox.x,
            // this.expandedBox.y,
            this.expandedBox.width,
            this.expandedBox.height,
        );
        // this.#props.scene.add.existing(this.#maskGraphics);
        // if (this.#props.container) {
        //     this.#props.container.add(this.#maskGraphics);
        // }

        // this.#maskGraphics.x = this.expandedBox.x;
        // this.#maskGraphics.y = this.expandedBox.y;
        console.log(
            "this.expandedBox.x:.",
            this.expandedBox.x,
            "this.expandedBox.y",
            this.expandedBox.y,
        );
        console.log(
            "this.#maskGraphics.",
            this.#maskGraphics.x,
            "this.#maskGraphics.y",
            this.#maskGraphics.y,
            this.#maskGraphics,
        );
        console.log("this.#maskGraphic:", this.#maskGraphics);
        // this.mask = new Display.Masks.GeometryMask(
        //     this.#props.scene,
        //     this.#maskGraphics,
        // );
        this.mask = this.#maskGraphics.createGeometryMask();
        window.mask = this.mask;
        // this.mask
        for (const item of this.contentList) {
            console.log("item.x: ", item.x, "item.y: ", item.y);
            (item as unknown as GameObjects.Components.Mask).setMask(this.mask);
        }
        // limit rendering of contentContainer to the pixels that fall inside the mask shape
        // this.#props.targetOfMask.setMask(
        // );

        // this.scene.add.existing(
        //     addCross(
        //         this.scene,
        //         // this.#props.globalX + itemLeft,
        //         // this.#props.globalY + itemTop,
        //         this.#props.globalX + this.#boundingBox.left,
        //         this.#props.globalY + this.#boundingBox.top,
        //         4,
        //         10,
        //         0x0000ff,
        //     ).setDepth(9),
        // );

        // const maskX = this.parent.x + viewport.x - viewport.width / 2;
        // const maskY = this.parent.y + viewport.y - viewport.height / 2;

        // this.#maskGraphics = this.scene.make.graphics(undefined, false);
        // this.#maskGraphics.fillStyle(0xffffff);
        // this.#maskGraphics.fillRect(
        //     maskX,
        //     maskY,
        //     viewport.width,
        //     viewport.height,
        // );
        // limit rendering of contentContainer to the pixels that fall inside the mask shape
        // this.contentContainer.setMask(this.#maskGraphics.createGeometryMask());
    }

    // abc() {
    //     this.#maskGraphics = this.#props.scene.make.graphics(undefined, false);
    //     this.#maskGraphics.fillStyle(0xffffff);
    //     this.#maskGraphics.fillRect(
    //         // 0,
    //         // 0,
    //         this.#props.container
    //             ? this.#props.container.x + this.expandedBox.x
    //             : 0,
    //         this.#props.container
    //             ? this.#props.container.y + this.expandedBox.y
    //             : 0,
    //         // this.expandedBox.x,
    //         // this.expandedBox.y,
    //         this.expandedBox.width,
    //         this.expandedBox.height,
    //     );
    // }

    setContent(contentList: ContentItem[]) {
        this.contentList = contentList;
        this.#repositionContent();
        getCombinedBounds(this.contentList, this.#boundingBox);

        this.expandedBox.x = this.#boundingBox.x - this.#props.padding;
        this.expandedBox.y = this.#boundingBox.y - this.#props.padding;
        this.expandedBox.width =
            this.#boundingBox.width + this.#props.padding * 2;
        this.expandedBox.height = Math.min(
            this.#boundingBox.height + this.#props.padding,
            this.#props.maxHeight,
        );

        // World-space coords because geometry masks ignore container transforms
        const worldX = (this.#props.container?.x ?? 0) + this.expandedBox.x;
        const worldY = (this.#props.container?.y ?? 0) + this.expandedBox.y;

        this.#maskGraphics = this.#props.scene.make.graphics(undefined, false);
        this.#maskGraphics.fillStyle(0xffffff);
        this.#maskGraphics.fillRect(
            worldX,
            worldY,
            this.expandedBox.width,
            this.expandedBox.height,
        );

        this.mask = this.#maskGraphics.createGeometryMask();
        for (const item of this.contentList) {
            item.setMask(this.mask);
        }

        this.#originalPositions = this.contentList.map((item) => item.y);
        const totalContentHeight =
            this.#boundingBox.height + this.#props.padding * 2;
        const viewportHeight = this.expandedBox.height;
        this.#isScrollable = totalContentHeight > viewportHeight;
        this.#maxScroll = this.#isScrollable
            ? totalContentHeight - viewportHeight
            : 0;
        this.#scrollY = 0;

        if (this.#isScrollable) {
            this.#props.scene.input.on(
                "wheel",
                (
                    pointer: Input.Pointer,
                    _gameObjects: GameObjects.GameObject[],
                    _deltaX: number,
                    deltaY: number,
                ) => {
                    const containerX = this.#props.container?.x ?? 0;
                    const containerY = this.#props.container?.y ?? 0;
                    const worldX = containerX + this.expandedBox.x;
                    const worldY = containerY + this.expandedBox.y;
                    if (
                        pointer.x < worldX ||
                        pointer.x > worldX + this.expandedBox.width ||
                        pointer.y < worldY ||
                        pointer.y > worldY + this.expandedBox.height
                    ) {
                        return;
                    }
                    this.#scrollY = Phaser.Math.Clamp(
                        this.#scrollY + deltaY * 0.5,
                        0,
                        this.#maxScroll,
                    );
                    this.#applyScroll();
                },
            );
        }

        drawDebugRect(
            this.#props.scene,
            this.#boundingBox,
            this.#props.container,
            0x00ff00,
        );
        drawDebugRect(
            this.#props.scene,
            this.expandedBox,
            this.#props.container,
            0xbf40bf,
        );
        // = new Geom.Rectangle(
        //     this.#boundingBox.x - padding, // left edge further out
        //     this.#boundingBox.y - padding, // top edge further out
        //     this.#boundingBox.width + padding * 2, // right edge further out (compensates left shift too)
        //     Math.min(this.#boundingBox.height + padding, maxHeight), // bottom capped at 300 total height
        // );

        // this.enableScrolling();
    }

    #applyScroll() {
        for (let i = 0; i < this.contentList.length; i++) {
            this.contentList[i].y = this.#originalPositions[i] - this.#scrollY;
        }
    }

    #repositionContent() {
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

    /*
    #resize() {
        // drawDebugRect(this.scene, this.#boundingBox, this);
        // this.add(
        //     addCross(
        //         this.scene,
        //         this.#boundingBox.centerX,
        //         this.#boundingBox.centerY,
        //     ),
        // );

        // draw cross at this.x, this.y and another at this.x + this.fgPanel.width, this.y + this.fgPanel.height to verify that the mask is where we expect it to be
        // this.scene.add
        //     .existing(addCross(this.scene, this.x, this.y, 4, 10, 0x00ffff))
        //     .setDepth(9);
        // this.scene.add.existing(
        //     addCross(
        //         this.scene,
        //         this.x + this.fgPanel.x - this.fgPanel.width / 2,
        //         this.y + this.fgPanel.y - this.fgPanel.height / 2,
        //         4,
        //         10,
        //         0x0000ff,
        //     ).setDepth(9),
        // );

        // const maskX = this.x + this.fgPanel.x - this.fgPanel.width / 2;
        // const maskY = this.y + this.fgPanel.y - this.fgPanel.height / 2;

        // this.#maskGraphics = this.scene.make.graphics(undefined, false);
        // this.#maskGraphics.fillStyle(0xffffff);
        // this.#maskGraphics.fillRect(
        //     maskX,
        //     maskY,
        //     // this.fgPanel.x,
        //     // this.fgPanel.y,
        //     this.fgPanel.width,
        //     this.fgPanel.height,
        // );
        // console.log("this.x: ", this.x, "y: ", this.y);
        // console.log("this.fgPanel.x: ", this.fgPanel.x, "y: ", this.fgPanel.y);
        // // const maskX = this.parent.x + viewport.x - viewport.width / 2;
        // // const maskY = this.parent.y + viewport.y - viewport.height / 2;
        // // this.contentContainer.setMask(this.#maskGraphics.createGeometryMask());
        // this.fgPanel.setMask(this.#maskGraphics.createGeometryMask());

        // // this.scene.children.bringToTop(cross);
        // window.mask = this.#maskGraphics;
        // this.add(this.#maskGraphics);

        // this.scrollable.enableScrolling(
        //     {
        //         x: this.fgPanel.x,
        //         y: this.fgPanel.y,
        //         width: this.fgPanel.width,
        //         height: this.fgPanel.height - defaultMargin * 2,
        //     },
        //     -222,
        // );
    }
    */
}
