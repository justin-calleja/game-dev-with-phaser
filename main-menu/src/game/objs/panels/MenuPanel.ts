import { GameObjects, Geom, Input, type Scene } from "phaser";
import {
    // addCross,
    defaultNineSliceConfig,
    defaultTextStyle,
    // drawDebugRect,
    getCombinedBounds,
} from "../../../utils";

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

const scrollbarWidth = 8;
const scrollbarMargin = 8;
const scrollStep = 40;
const trackColor = 0x000000;
const trackAlpha = 0.12;
const thumbColor = 0x666666;
const thumbAlpha = 0.5;
const thumbMinHeight = 24;
const thumbHitPadding = 12;

export class MenuPanel extends GameObjects.Container {
    #boundingBox = new Geom.Rectangle();
    titleText: GameObjects.Text;
    bgPanel: GameObjects.NineSlice;
    fgPanel: GameObjects.NineSlice;

    contentList: ContentItem[];
    scrollContainer: GameObjects.Container;
    maxContentHeight = 300;

    #isScrollable = false;
    #scrollY = 0;
    #maxScroll = 0;

    #maskGraphics: GameObjects.Graphics | null = null;
    #trackGraphics: GameObjects.Graphics | null = null;
    #thumbGraphics: GameObjects.Graphics | null = null;

    #trackX = 0;
    #trackY = 0;
    #trackHeight = 0;
    #thumbHeight = 0;

    #isDragging = false;
    #dragStartY = 0;
    #dragStartScrollY = 0;

    #boundOnWheel: ((...args: any[]) => void) | null = null;
    #boundOnPointerMove: ((...args: any[]) => void) | null = null;
    #boundOnPointerUp: ((...args: any[]) => void) | null = null;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);

        this.contentList = [];
        this.scrollContainer = new GameObjects.Container(scene, 0, 0);

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

        this.add([this.bgPanel, this.fgPanel, this.scrollContainer, this.titleText]);
    }

    setTitleText(text: string) {
        this.titleText.setText(text);
    }

    setContent(contentList: ContentItem[]) {
        this.destroyScrolling();
        this.contentList = contentList;
        this.scrollContainer.add(contentList);
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
        // drawDebugRect(this.scene, this.#boundingBox, this);
        // this.add(
        //     addCross(
        //         this.scene,
        //         this.#boundingBox.centerX,
        //         this.#boundingBox.centerY,
        //     ),
        // );

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
            this.fgPanel.y -
            this.bgPanel.height +
            defaultTitleMarginTop;

        if (needsScrolling) {
            this.setupScrolling(visibleHeight, contentHeight);
        }
    }

    // ── Scrolling ──────────────────────────────────────────────

    private setupScrolling(visibleHeight: number, contentHeight: number) {
        this.#isScrollable = true;
        this.#maxScroll = contentHeight - visibleHeight;
        this.#scrollY = 0;

        // Mask (world-space coordinates so it clips correctly)
        const maskX =
            this.x + this.fgPanel.x - this.fgPanel.width / 2 + defaultMargin;
        const maskY =
            this.y + this.fgPanel.y - this.fgPanel.height / 2 + defaultMargin;
        const maskW = this.fgPanel.width - defaultMargin * 2;

        this.#maskGraphics = this.scene.make.graphics(undefined, false);
        this.#maskGraphics.fillStyle(0xffffff);
        this.#maskGraphics.fillRect(maskX, maskY, maskW, visibleHeight);
        this.scrollContainer.setMask(
            this.#maskGraphics.createGeometryMask(),
        );

        // Scrollbar track
        this.#trackX =
            this.fgPanel.x +
            this.fgPanel.width / 2 -
            defaultMargin +
            scrollbarMargin;
        this.#trackY =
            this.fgPanel.y - this.fgPanel.height / 2 + defaultMargin;
        this.#trackHeight = visibleHeight;

        this.#trackGraphics = new GameObjects.Graphics(this.scene);
        this.#trackGraphics.fillStyle(trackColor, trackAlpha);
        this.#trackGraphics.fillRoundedRect(
            this.#trackX,
            this.#trackY,
            scrollbarWidth,
            this.#trackHeight,
            scrollbarWidth / 2,
        );
        this.add(this.#trackGraphics);

        this.#trackGraphics.setInteractive(
            new Geom.Rectangle(
                this.#trackX,
                this.#trackY,
                scrollbarWidth,
                this.#trackHeight,
            ),
            Geom.Rectangle.Contains,
        );
        this.#trackGraphics.on(
            Input.Events.GAMEOBJECT_POINTER_DOWN,
            this.onTrackClick,
            this,
        );

        // Scrollbar thumb
        this.#thumbHeight = Math.max(
            thumbMinHeight,
            (visibleHeight / contentHeight) * this.#trackHeight,
        );

        this.#thumbGraphics = new GameObjects.Graphics(this.scene);
        this.add(this.#thumbGraphics);
        this.drawThumb();

        this.#thumbGraphics.setInteractive({
            hitArea: new Geom.Rectangle(
                this.#trackX - thumbHitPadding,
                this.#trackY,
                scrollbarWidth + thumbHitPadding * 2,
                this.#thumbHeight,
            ),
            hitAreaCallback: Geom.Rectangle.Contains,
            useHandCursor: true,
        });
        this.#thumbGraphics.on(
            Input.Events.GAMEOBJECT_POINTER_DOWN,
            this.onThumbDragStart,
            this,
        );

        this.bringToTop(this.titleText);

        // Scene-level listeners
        this.#boundOnWheel = this.onWheel.bind(this);
        this.#boundOnPointerMove = this.onPointerMove.bind(this);
        this.#boundOnPointerUp = this.onPointerUp.bind(this);

        this.scene.input.on("wheel", this.#boundOnWheel);
        this.scene.input.on("pointermove", this.#boundOnPointerMove);
        this.scene.input.on("pointerup", this.#boundOnPointerUp);
    }

    private drawThumb() {
        if (!this.#thumbGraphics) return;
        this.#thumbGraphics.clear();
        this.#thumbGraphics.fillStyle(thumbColor, thumbAlpha);

        const ratio =
            this.#maxScroll > 0 ? this.#scrollY / this.#maxScroll : 0;
        const thumbY =
            this.#trackY +
            ratio * (this.#trackHeight - this.#thumbHeight);

        this.#thumbGraphics.fillRoundedRect(
            this.#trackX,
            thumbY,
            scrollbarWidth,
            this.#thumbHeight,
            scrollbarWidth / 2,
        );

        if (this.#thumbGraphics.input) {
            this.#thumbGraphics.input.hitArea.setTo(
                this.#trackX - thumbHitPadding,
                thumbY,
                scrollbarWidth + thumbHitPadding * 2,
                this.#thumbHeight,
            );
        }
    }

    resetScroll() {
        if (this.#isScrollable) {
            this.setScrollY(0);
        }
    }

    private setScrollY(value: number) {
        this.#scrollY = Phaser.Math.Clamp(value, 0, this.#maxScroll);
        this.scrollContainer.y = -this.#scrollY;
        this.drawThumb();
    }

    // ── Input handlers ─────────────────────────────────────────

    private onWheel(
        pointer: Phaser.Input.Pointer,
        _currentlyOver: GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number,
    ) {
        if (!this.#isScrollable || !this.visible) return;

        const panelLeft =
            this.x + this.fgPanel.x - this.fgPanel.width / 2;
        const panelRight =
            this.x + this.fgPanel.x + this.fgPanel.width / 2;
        const panelTop =
            this.y + this.fgPanel.y - this.fgPanel.height / 2;
        const panelBottom =
            this.y + this.fgPanel.y + this.fgPanel.height / 2;

        if (
            pointer.worldX >= panelLeft &&
            pointer.worldX <= panelRight &&
            pointer.worldY >= panelTop &&
            pointer.worldY <= panelBottom
        ) {
            const direction = deltaY > 0 ? 1 : -1;
            this.setScrollY(this.#scrollY + direction * scrollStep);
        }
    }

    private onThumbDragStart(pointer: Phaser.Input.Pointer) {
        this.#isDragging = true;
        this.#dragStartY = pointer.worldY;
        this.#dragStartScrollY = this.#scrollY;
    }

    private onPointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.#isDragging) return;

        const deltaY = pointer.worldY - this.#dragStartY;
        const scrollRange = this.#trackHeight - this.#thumbHeight;
        if (scrollRange <= 0) return;

        const scrollDelta = (deltaY / scrollRange) * this.#maxScroll;
        this.setScrollY(this.#dragStartScrollY + scrollDelta);
    }

    private onPointerUp() {
        this.#isDragging = false;
    }

    private onTrackClick(pointer: Phaser.Input.Pointer) {
        if (this.#isDragging) return;

        const localY = pointer.worldY - this.y;
        const relativeY = localY - this.#trackY;
        const ratio = Phaser.Math.Clamp(
            relativeY / this.#trackHeight,
            0,
            1,
        );
        this.setScrollY(ratio * this.#maxScroll);
    }

    // ── Cleanup ────────────────────────────────────────────────

    destroyScrolling() {
        if (!this.#isScrollable) return;

        // clearMask(true) destroys the GeometryMask which also destroys its Graphics
        this.scrollContainer.clearMask(true);
        this.#maskGraphics = null;

        if (this.#trackGraphics) {
            this.#trackGraphics.off(
                Input.Events.GAMEOBJECT_POINTER_DOWN,
                this.onTrackClick,
                this,
            );
            this.#trackGraphics.destroy();
            this.#trackGraphics = null;
        }

        if (this.#thumbGraphics) {
            this.#thumbGraphics.off(
                Input.Events.GAMEOBJECT_POINTER_DOWN,
                this.onThumbDragStart,
                this,
            );
            this.#thumbGraphics.destroy();
            this.#thumbGraphics = null;
        }

        if (this.#boundOnWheel) {
            this.scene.input.off("wheel", this.#boundOnWheel);
            this.#boundOnWheel = null;
        }
        if (this.#boundOnPointerMove) {
            this.scene.input.off("pointermove", this.#boundOnPointerMove);
            this.#boundOnPointerMove = null;
        }
        if (this.#boundOnPointerUp) {
            this.scene.input.off("pointerup", this.#boundOnPointerUp);
            this.#boundOnPointerUp = null;
        }

        this.#isScrollable = false;
        this.#scrollY = 0;
        this.#maxScroll = 0;
        this.scrollContainer.y = 0;
    }

    destroy(fromScene?: boolean) {
        this.destroyScrolling();
        super.destroy(fromScene);
    }
}
