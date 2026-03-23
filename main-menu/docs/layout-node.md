# LayoutNode -- Lightweight Layout System

## What problem does it solve?

Phaser's `Container` applies local transforms to children, but **masks operate in world/global coordinates**. When you nest Containers (e.g. Panel > ScrollArea > List > ListItem), computing the world position for a mask rectangle requires walking up the chain via `getWorldTransformMatrix()`. This is tedious and error-prone.

LayoutNode solves this by maintaining a **virtual layout tree** separate from Phaser's display list:

- All Phaser GameObjects stay **flat on the scene's display list** -- no Container nesting.
- A tree of `LayoutNode`s tracks parent-child relationships and relative offsets.
- When `root.update()` is called, each node computes its **absolute world coordinates** and syncs them to bound GameObjects via `setPosition()`.
- Since every object already has its world position, **masks trivially work** -- just read `node.getWorldRect()`.

## Core concepts

### Nodes

A `LayoutNode` represents a rectangular region with a local position, size, and origin. Nodes form a tree: each has at most one parent and any number of children.

```ts
import { LayoutNode } from "../ui/LayoutNode";

const panel = new LayoutNode({
  x: 0,        // local offset from parent anchor (default 0)
  y: -50,      // local offset from parent anchor
  width: 270,  // bounding box width
  height: 400, // bounding box height
  originX: 0.5, // center-origin horizontal (default 0.5)
  originY: 0.5, // center-origin vertical (default 0.5)
});
```

For **root nodes** (no parent), `x` and `y` are the world position directly.

For **child nodes**, `x` and `y` are offsets from the parent's anchor point.

### Anchors

When you add a child, you specify where on the parent's bounding box the child attaches:

```ts
parent.addChild(child, 0.5, 0.5);  // attach at parent's center (default)
parent.addChild(child, 0, 0);      // attach at parent's top-left corner
parent.addChild(child, 1, 1);      // attach at parent's bottom-right corner
```

The anchor is a normalised coordinate on the parent's box (0 = left/top edge, 1 = right/bottom edge). The child's local `x, y` is then an offset from that anchor point.

### Origins

The origin determines which point of the node's own box is considered its "position". With the default `originX: 0.5, originY: 0.5`, the node's `worldX, worldY` is the center of its box.

### update()

Calling `root.update()` walks the tree top-down:

1. Root: `worldX = x`, `worldY = y`
2. Each child: `worldX = parentAnchorX + localX`, `worldY = parentAnchorY + localY`
3. Bound GameObjects receive `setPosition(worldX, worldY)`
4. Recurse to grandchildren

Always call from the root so positions propagate correctly.

## bind()

`bind()` connects Phaser GameObjects to a node. It does **not** add them to a Container or modify the display list in any way.

```ts
const nineSlice = scene.add.nineslice(0, 0, "atlas", "frame", 270, 400, 10, 10, 10, 10);
const node = new LayoutNode({ x: 0, y: 0, width: 270, height: 400 });
node.bind(nineSlice);
```

On every `update()`, bound objects get `setPosition(worldX, worldY)`.

On visibility change, bound objects get `setVisible(effectiveVisible)`.

### How many objects can be bound?

| Bound count | Use case |
|---|---|
| **Zero** | Pure layout container -- defines a region that children attach to |
| **One** | Typical -- e.g. a NineSlice panel or a Text object |
| **Multiple** | Objects that share the same center point (e.g. NineSlice background + Text label) |

### What bind does NOT do

- Does not add objects to a Phaser Container
- Does not change display list order
- Does not manage object creation or destruction
- Does not set origin on the bound object (you set origin yourself before binding)

## Visibility propagation

Setting `node.visible = false` hides the node and **all descendants**:

```ts
menuRoot.visible = false;  // hides panels, title, and everything below
menuRoot.visible = true;   // restores everything
```

Effective visibility is `selfVisible && parentVisible`. This replicates the cascading behaviour of Phaser's Container without the Container.

## When to use LayoutNode vs. flat objects

| Use LayoutNode when... | Use flat objects when... |
|---|---|
| You need relative parent-child positioning | Objects already have final world positions |
| You want grouped visibility (hide/show a subtree) | Objects are independent |
| You'll need a mask at a node's bounds later | No masking needed |
| Objects should move together (animation, dragging) | Objects are static |

**Example from the main menu:**

- **Panels and title** are LayoutNodes -- positioned relative to the content bounds, move/hide as a group.
- **Buttons are NOT LayoutNodes** -- positioned via `Phaser.Actions.AlignTo`, already at their final world coords. They *drive* the layout (their bounds determine panel size) but don't *participate* in the layout tree.

If you later need buttons to move with a parent (e.g. slide-in animation), bind each `TextButton` to a child LayoutNode of the panel.

## getWorldRect() and masks

`getWorldRect()` returns the node's bounding box in world coordinates:

```ts
const rect = scrollAreaNode.getWorldRect();
// rect = { x: 200, y: 100, width: 400, height: 300 }
```

This is directly usable for mask positioning:

```ts
// Canvas renderer -- GeometryMask
const maskGraphics = scene.make.graphics();
maskGraphics.fillRect(rect.x, rect.y, rect.width, rect.height);
const mask = new Phaser.Display.Masks.GeometryMask(scene, maskGraphics);
someObject.setMask(mask);

// WebGL renderer -- Filters.Mask
// Use the rect coordinates to position a mask GameObject
```

**Contrast with Container approach:** with nested Containers, you'd need to call `getWorldTransformMatrix()` on the Container, manually compute the world rect from the matrix, and update the mask whenever the Container hierarchy changes. With LayoutNode, `getWorldRect()` gives you the answer directly.

## Future: adding a scrollable area

When you're ready to build a scroll container on top of LayoutNode, here's the approach:

### Layout tree structure

```
scrollRoot (x, y, width, height)
  +-- viewport (x: 0, y: 0, same size as scrollRoot)
  |     +-- content (x: 0, y: scrollOffset, tall height)
  |           +-- item0 (y: 0)
  |           +-- item1 (y: itemHeight + gap)
  |           +-- item2 (y: 2 * (itemHeight + gap))
  |           ...
```

### Creating the mask

```ts
const viewportRect = viewport.getWorldRect();

// Option A: GeometryMask (Canvas)
const maskGfx = scene.make.graphics();
maskGfx.fillRect(viewportRect.x, viewportRect.y, viewportRect.width, viewportRect.height);
const geoMask = new Phaser.Display.Masks.GeometryMask(scene, maskGfx);

// Apply to every bound object in the content subtree
for (const item of contentItems) {
  item.gameObject.setMask(geoMask);
}
```

### Handling scroll input

```ts
scene.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
  scrollOffset = Phaser.Math.Clamp(
    scrollOffset - deltaY,
    -(contentTotalHeight - viewportRect.height),
    0,
  );
  content.setPosition(0, scrollOffset);
  scrollRoot.update();  // recomputes world positions for all items
});
```

The mask stays fixed (it's based on the viewport node which doesn't move). The content node's Y offset changes, moving all items up/down. After `update()`, each item's bound GameObjects are repositioned in world coordinates.

### Clipping strategy

| Renderer | Mask type | Notes |
|---|---|---|
| Canvas | `GeometryMask` with `Graphics.fillRect` | Simple, works well |
| WebGL | `Filters.Mask` via `FilterList.addMask` | Uses a `DynamicTexture` internally; set `viewTransform: 'world'` |

### Pseudocode

```ts
class ScrollArea {
  root: LayoutNode;
  viewport: LayoutNode;
  content: LayoutNode;
  scrollOffset = 0;

  constructor(scene: Scene, x: number, y: number, w: number, h: number) {
    this.root = new LayoutNode({ x, y, width: w, height: h });
    this.viewport = new LayoutNode({ x: 0, y: 0, width: w, height: h });
    this.content = new LayoutNode({ x: 0, y: 0, width: w, height: 0 });

    this.root.addChild(this.viewport);
    this.viewport.addChild(this.content);

    // Create mask from viewport world rect after initial update
    this.root.update();
    const rect = this.viewport.getWorldRect();
    // ... create and apply mask using rect ...
  }

  addItem(gameObject: Phaser.GameObjects.GameObject, height: number) {
    const node = new LayoutNode({ x: 0, y: this.content.height, width: this.viewport.width, height });
    node.bind(gameObject);
    this.content.addChild(node);
    this.content.setSize(this.content.width, this.content.height + height);
  }

  scroll(deltaY: number) {
    const maxScroll = Math.max(0, this.content.height - this.viewport.height);
    this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset + deltaY, -maxScroll, 0);
    this.content.setPosition(0, this.scrollOffset);
    this.root.update();
  }
}
```

This gives you a scrollable list where:
- Items are flat on the scene (no Container nesting)
- The mask is positioned trivially via `getWorldRect()`
- Scrolling just updates one Y offset and calls `update()`
