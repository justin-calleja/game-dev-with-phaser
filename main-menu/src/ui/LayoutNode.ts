import { Geom } from "phaser";

/**
 * Any object that can be positioned and shown/hidden by the layout system.
 * Phaser GameObjects satisfy this interface naturally.
 */
export interface Positionable {
	setPosition(x: number, y: number): unknown;
	setVisible(visible: boolean): unknown;
}

export interface LayoutNodeOpts {
	/** Local X offset from the parent's anchor point (default 0). For root nodes this is the world X. */
	x?: number;
	/** Local Y offset from the parent's anchor point (default 0). For root nodes this is the world Y. */
	y?: number;
	/** Width of this node's bounding box. */
	width: number;
	/** Height of this node's bounding box. */
	height: number;
	/** Horizontal origin within this box (0 = left, 0.5 = center, 1 = right). Default 0.5. */
	originX?: number;
	/** Vertical origin within this box (0 = top, 0.5 = center, 1 = bottom). Default 0.5. */
	originY?: number;
}

/**
 * A node in a virtual layout tree that provides relative parent-child
 * positioning while keeping all Phaser GameObjects flat on the scene's
 * display list.
 *
 * ### Why not Phaser Container?
 *
 * Phaser's Container applies local transforms to children, but masks
 * operate in world coordinates. Deep Container nesting makes computing
 * world positions for masks painful. LayoutNode avoids this: it computes
 * absolute world coordinates and syncs them to bound GameObjects directly.
 *
 * ### Usage
 *
 * ```ts
 * const root = new LayoutNode({ x: 512, y: 384, width: 270, height: 400 });
 *
 * const panel = new LayoutNode({ x: 0, y: 0, width: 270, height: 400 });
 * panel.bind(nineSlice);
 * root.addChild(panel);
 *
 * root.update();                // computes world positions, syncs GameObjects
 * root.visible = false;         // hides panel (and all descendants)
 * panel.getWorldRect();         // { x, y, width, height } in world coords
 * ```
 *
 * ### bind()
 *
 * Connects Phaser GameObjects to a node. On {@link update}, each bound
 * object receives `setPosition(worldX, worldY)`. On visibility change,
 * each receives `setVisible(effectiveVisible)`.
 *
 * - Zero bound objects: pure layout container (defines a region for children)
 * - One bound object: typical (e.g. a NineSlice panel)
 * - Multiple bound objects: objects that share the same center point
 *
 * `bind` does **not** add objects to a Phaser Container. They stay flat
 * on the scene's display list.
 */
export class LayoutNode {
	private _x: number;
	private _y: number;
	private _width: number;
	private _height: number;
	private _originX: number;
	private _originY: number;

	private _parent: LayoutNode | null = null;
	private _anchorX = 0.5;
	private _anchorY = 0.5;

	private _children: LayoutNode[] = [];
	private _bound: Positionable[] = [];

	private _visible = true;
	private _parentVisible = true;

	/** Computed absolute X after {@link update}. */
	worldX = 0;
	/** Computed absolute Y after {@link update}. */
	worldY = 0;

	constructor(opts: LayoutNodeOpts) {
		this._x = opts.x ?? 0;
		this._y = opts.y ?? 0;
		this._width = opts.width;
		this._height = opts.height;
		this._originX = opts.originX ?? 0.5;
		this._originY = opts.originY ?? 0.5;
	}

	/**
	 * Attach a child node. The child will be positioned relative to the
	 * anchor point on this node's bounding box.
	 *
	 * @param child  The child LayoutNode.
	 * @param anchorX  Horizontal attach point on this box (0 = left edge,
	 *                 0.5 = center, 1 = right edge). Default 0.5.
	 * @param anchorY  Vertical attach point on this box (0 = top edge,
	 *                 0.5 = center, 1 = bottom edge). Default 0.5.
	 */
	addChild(child: LayoutNode, anchorX = 0.5, anchorY = 0.5): this {
		child._parent = this;
		child._anchorX = anchorX;
		child._anchorY = anchorY;
		this._children.push(child);
		return this;
	}

	/** Detach a child node from this node's children list. */
	removeChild(child: LayoutNode): this {
		const idx = this._children.indexOf(child);
		if (idx >= 0) {
			this._children.splice(idx, 1);
			child._parent = null;
		}
		return this;
	}

	/**
	 * Bind one or more Phaser GameObjects (or any {@link Positionable}) to
	 * this node. Bound objects are synced on every {@link update} call and
	 * when {@link visible} changes.
	 *
	 * Objects remain on the scene's flat display list -- `bind` does **not**
	 * add them to a Phaser Container.
	 */
	bind(...objects: Positionable[]): this {
		this._bound.push(...objects);
		return this;
	}

	/**
	 * Recompute world positions for this node and all descendants, then sync
	 * every bound GameObject.
	 *
	 * - **Root nodes** (no parent): `worldX = localX`, `worldY = localY`.
	 * - **Child nodes**: world position is derived from the parent's world
	 *   position, bounding box, and this node's anchor + local offset.
	 *
	 * Always call this from the root of the tree so positions propagate
	 * top-down.
	 */
	update(): void {
		if (this._parent) {
			const p = this._parent;
			const ax = p.worldX + (this._anchorX - p._originX) * p._width;
			const ay = p.worldY + (this._anchorY - p._originY) * p._height;
			this.worldX = ax + this._x;
			this.worldY = ay + this._y;
		} else {
			this.worldX = this._x;
			this.worldY = this._y;
		}

		for (const obj of this._bound) {
			obj.setPosition(this.worldX, this.worldY);
		}

		for (const child of this._children) {
			child.update();
		}
	}

	/** Whether this node is locally visible. */
	get visible(): boolean {
		return this._visible;
	}

	/**
	 * Set local visibility. When false, this node and all descendants are
	 * hidden (bound GameObjects receive `setVisible(false)`).
	 */
	set visible(v: boolean) {
		if (this._visible === v) return;
		this._visible = v;
		this._syncVisible();
	}

	private _syncVisible(): void {
		const effective = this._visible && this._parentVisible;

		for (const obj of this._bound) {
			obj.setVisible(effective);
		}

		for (const child of this._children) {
			child._parentVisible = effective;
			child._syncVisible();
		}
	}

	/**
	 * Get this node's bounding box in world coordinates. Useful for
	 * positioning masks (GeometryMask or Filters.Mask) since masks
	 * operate in global/world space.
	 *
	 * @param out  Optional Rectangle to reuse. A new one is created if omitted.
	 */
	getWorldRect(out = new Geom.Rectangle()): Geom.Rectangle {
		const left = this.worldX - this._originX * this._width;
		const top = this.worldY - this._originY * this._height;
		out.setTo(left, top, this._width, this._height);
		return out;
	}

	/** Update the local offset (relative to parent anchor). */
	setPosition(x: number, y: number): this {
		this._x = x;
		this._y = y;
		return this;
	}

	/** Update the bounding box dimensions. */
	setSize(width: number, height: number): this {
		this._width = width;
		this._height = height;
		return this;
	}

	get width(): number {
		return this._width;
	}
	get height(): number {
		return this._height;
	}
}
