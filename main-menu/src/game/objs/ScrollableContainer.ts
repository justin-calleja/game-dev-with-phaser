import { GameObjects, Geom, Input, type Scene } from "phaser";

export interface ScrollViewport {
    x: number;
    y: number;
    width: number;
    height: number;
}

const scrollbarWidth = 8;
const scrollbarMargin = 8;
const scrollStep = 40;
const trackColor = 0x000000;
const trackAlpha = 0.12;
const thumbColor = 0x666666;
const thumbAlpha = 0.5;
const thumbMinHeight = 24;
const thumbHitPadding = 12;

export class ScrollableContainer {
    readonly scene: Scene;
    readonly parent: GameObjects.Container;
    readonly contentContainer: GameObjects.Container;

    #isScrollable = false;
    #scrollY = 0;
    #maxScroll = 0;
    #viewport: ScrollViewport = { x: 0, y: 0, width: 0, height: 0 };

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

    constructor(scene: Scene, parent: GameObjects.Container) {
        this.scene = scene;
        this.parent = parent;
        this.contentContainer = new GameObjects.Container(scene, 0, 0);
    }

    get isScrollable(): boolean {
        return this.#isScrollable;
    }

    enableScrolling(viewport: ScrollViewport, contentHeight: number): void {
        this.destroyScrolling();

        this.#viewport = { ...viewport };
        this.#isScrollable = true;
        this.#maxScroll = contentHeight - viewport.height;
        this.#scrollY = 0;

        // Mask (world-space coordinates)
        const maskX = this.parent.x + viewport.x - viewport.width / 2;
        const maskY = this.parent.y + viewport.y - viewport.height / 2;

        this.#maskGraphics = this.scene.make.graphics(undefined, false);
        this.#maskGraphics.fillStyle(0xffffff);
        this.#maskGraphics.fillRect(
            maskX,
            maskY,
            viewport.width,
            viewport.height,
        );
        this.contentContainer.setMask(
            this.#maskGraphics.createGeometryMask(),
        );

        // Scrollbar track
        this.#trackX = viewport.x + viewport.width / 2 + scrollbarMargin;
        this.#trackY = viewport.y - viewport.height / 2;
        this.#trackHeight = viewport.height;

        this.#trackGraphics = new GameObjects.Graphics(this.scene);
        this.#trackGraphics.fillStyle(trackColor, trackAlpha);
        this.#trackGraphics.fillRoundedRect(
            this.#trackX,
            this.#trackY,
            scrollbarWidth,
            this.#trackHeight,
            scrollbarWidth / 2,
        );
        this.parent.add(this.#trackGraphics);

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
            (viewport.height / contentHeight) * this.#trackHeight,
        );

        this.#thumbGraphics = new GameObjects.Graphics(this.scene);
        this.parent.add(this.#thumbGraphics);
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

        // Scene-level listeners
        this.#boundOnWheel = this.onWheel.bind(this);
        this.#boundOnPointerMove = this.onPointerMove.bind(this);
        this.#boundOnPointerUp = this.onPointerUp.bind(this);

        this.scene.input.on("wheel", this.#boundOnWheel);
        this.scene.input.on("pointermove", this.#boundOnPointerMove);
        this.scene.input.on("pointerup", this.#boundOnPointerUp);
    }

    private drawThumb(): void {
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

    resetScroll(): void {
        if (this.#isScrollable) {
            this.setScrollY(0);
        }
    }

    private setScrollY(value: number): void {
        this.#scrollY = Phaser.Math.Clamp(value, 0, this.#maxScroll);
        this.contentContainer.y = -this.#scrollY;
        this.drawThumb();
    }

    // ── Input handlers ─────────────────────────────────────────

    private onWheel(
        pointer: Phaser.Input.Pointer,
        _currentlyOver: GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number,
    ): void {
        if (!this.#isScrollable || !this.parent.visible) return;

        const vp = this.#viewport;
        const left = this.parent.x + vp.x - vp.width / 2;
        const right = this.parent.x + vp.x + vp.width / 2;
        const top = this.parent.y + vp.y - vp.height / 2;
        const bottom = this.parent.y + vp.y + vp.height / 2;

        if (
            pointer.worldX >= left &&
            pointer.worldX <= right &&
            pointer.worldY >= top &&
            pointer.worldY <= bottom
        ) {
            const direction = deltaY > 0 ? 1 : -1;
            this.setScrollY(this.#scrollY + direction * scrollStep);
        }
    }

    private onThumbDragStart(pointer: Phaser.Input.Pointer): void {
        this.#isDragging = true;
        this.#dragStartY = pointer.worldY;
        this.#dragStartScrollY = this.#scrollY;
    }

    private onPointerMove(pointer: Phaser.Input.Pointer): void {
        if (!this.#isDragging) return;

        const deltaY = pointer.worldY - this.#dragStartY;
        const scrollRange = this.#trackHeight - this.#thumbHeight;
        if (scrollRange <= 0) return;

        const scrollDelta = (deltaY / scrollRange) * this.#maxScroll;
        this.setScrollY(this.#dragStartScrollY + scrollDelta);
    }

    private onPointerUp(): void {
        this.#isDragging = false;
    }

    private onTrackClick(pointer: Phaser.Input.Pointer): void {
        if (this.#isDragging) return;

        const localY = pointer.worldY - this.parent.y;
        const relativeY = localY - this.#trackY;
        const ratio = Phaser.Math.Clamp(
            relativeY / this.#trackHeight,
            0,
            1,
        );
        this.setScrollY(ratio * this.#maxScroll);
    }

    // ── Cleanup ────────────────────────────────────────────────

    destroyScrolling(): void {
        if (!this.#isScrollable) return;

        this.contentContainer.clearMask(true);
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
        this.contentContainer.y = 0;
    }

    destroy(): void {
        this.destroyScrolling();
        this.contentContainer.destroy();
    }
}
