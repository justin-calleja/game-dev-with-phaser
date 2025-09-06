# Nine-Slice Debug Visualization Guide

This guide explains how to visualize the boundaries of nine-slice objects in Phaser to better understand how the `leftWidth`, `rightWidth`, `topHeight`, and `bottomHeight` parameters affect the slicing.

## What are Nine-Slice Boundaries?

A nine-slice divides an image into 9 sections using 4 boundary lines:

- **Column A** (left boundary): Position = `x + leftWidth`
- **Column B** (right boundary): Position = `x + width - rightWidth`  
- **Row C** (top boundary): Position = `y + topHeight`
- **Row D** (bottom boundary): Position = `y + height - bottomHeight`

```
┌─────┬──────────┬─────┐
│  1  │    2     │  3  │ ← Row C (topHeight)
├─────┼──────────┼─────┤
│  4  │    5     │  6  │
├─────┼──────────┼─────┤
│  7  │    8     │  9  │ ← Row D (bottomHeight)
└─────┴──────────┴─────┘
↑                     ↑
Column A          Column B
(leftWidth)    (rightWidth)
```

## Using the NineSliceDebugger

### Basic Usage

```typescript
import { NineSliceDebugger } from "./NineSliceDebugger";

// Create your nine-slice
const nineSlice = this.add.nineslice(
  100, 100,           // x, y position
  "texture", 0,       // texture and frame
  200, 150,           // width, height
  20, 25, 15, 18      // leftWidth, rightWidth, topHeight, bottomHeight
);

// Debug it with lines only
const debugger = new NineSliceDebugger(this);
debugger.visualizeBoundaries(nineSlice, {
  showLines: true,
  lineColor: 0xff0000,  // red lines
  lineWidth: 2
});
```

### Advanced Visualization

```typescript
// Show both boundary lines and colored sections
debugger.visualizeBoundaries(nineSlice, {
  showLines: true,
  colorSections: true,
  lineColor: 0xff0000,
  lineWidth: 3,
  sectionAlpha: 0.4,
  logBoundaries: true  // Console log the calculations
});
```

### Quick Debug (Static Method)

```typescript
// One-liner for quick debugging
const boundaries = NineSliceDebugger.debug(nineSlice, {
  showLines: true,
  colorSections: true
});
```

## Debug Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showLines` | boolean | true | Draw red lines showing boundaries |
| `colorSections` | boolean | false | Color each of the 9 sections differently |
| `lineColor` | number | 0xff0000 | Color of boundary lines (hex) |
| `lineWidth` | number | 2 | Width of boundary lines |
| `logBoundaries` | boolean | true | Log boundary calculations to console |
| `sectionAlpha` | number | 0.3 | Transparency of colored sections |

## Interactive Demo

The MainMenu scene includes an interactive demo with:

- **Visual boundaries**: Red lines show Column A, B and Row C, D
- **Colored sections**: Each of the 9 areas has a different color
- **Console logging**: Boundary calculations are logged
- **SPACE key**: Toggle debug visualization
- **R key**: Randomize nine-slice dimensions

## Understanding the Console Output

When `logBoundaries: true`, you'll see output like:

```
Nine-Slice Debug Info
  Position: {x: 150, y: 200}
  Dimensions: {width: 300, height: 200}
  Slice widths: {leftWidth: 20, rightWidth: 25}
  Slice heights: {topHeight: 15, bottomHeight: 18}
  Boundaries: {
    columnA: 170,    // x + leftWidth
    columnB: 425,    // x + width - rightWidth
    rowC: 215,       // y + topHeight
    rowD: 382        // y + height - bottomHeight
  }
```

## Tips for Using Nine-Slice

1. **Corner sections** (1,3,7,9) never stretch - they maintain their original size
2. **Edge sections** (2,4,6,8) stretch in one direction only
3. **Center section** (5) stretches in both directions
4. Use the debugger to verify your slice dimensions create the desired effect
5. For 3-slice objects, set `topHeight` and `bottomHeight` to 0

## Common Issues

- **Overlapping boundaries**: If `leftWidth + rightWidth > width`, boundaries will overlap
- **Invalid dimensions**: Negative values or dimensions larger than the texture cause issues
- **Performance**: Remove debug visualizations in production builds

## Examples

See `src/examples/NineSliceExamples.ts` for more usage examples including:
- Basic line visualization
- Colored section visualization  
- Complete visualization
- Comparing different configurations
- Creating and debugging in one step
