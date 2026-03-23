# pixui Integration: Option A vs Option C

Two parallel MainMenu implementations are provided so you can compare different levels of pixui adoption.

## Switching between options

In `src/game/main.ts`, toggle the import:

```typescript
// Option A: pixui Frame for panels, GameObjects.Text buttons
import { MainMenuOptionA as MainMenu } from "./scenes/MainMenuOptionA";

// Option C: full pixui with BitmapFont
// import { MainMenuOptionC as MainMenu } from "./scenes/MainMenuOptionC";
```

---

## Option A: Frame-only + GameObjects.Text

**File:** `src/game/scenes/MainMenuOptionA.ts`

### What it uses from pixui

| Feature | Source |
|---------|--------|
| `UiScene` base class | Responsive viewport, theme loading, atlas preload |
| `this.insert.center.image(...)` | Background panel (nine-slice from atlas) |
| `this.insert.center.frame(...)` | Foreground panel (nine-slice frame with padding) |

### What it uses from plain Phaser

| Feature | Source |
|---------|--------|
| `GameObjects.Text` | Title text ("Game title") |
| `TextButton` (custom class) | Menu buttons with NineSlice + Text |
| `this.add.existing(...)` | Adding buttons to the scene display list |

### How the TextButton works

`TextButton` (in `src/game/objs/TextButton.ts`) is a `GameObjects.Container` holding:
- A `GameObjects.NineSlice` loaded from an atlas frame (auto-reads `scale9Borders`)
- A `GameObjects.Text` label using TTF font (Arial Black)
- Pointer events for hover (scale) and press (y-offset) effects

### Trade-offs

**Pros:**
- Scalable text -- TTF fonts look sharp at any resolution
- Familiar Phaser API for buttons and text
- No BitmapFont pipeline needed
- Full control over button behavior (hover effects, click handling)

**Cons:**
- Buttons are positioned manually (not part of pixui's layout tree)
- Must coordinate between pixui's insert-based layout and Phaser's manual positioning
- More code than full pixui approach

---

## Option C: Full pixui + BitmapFont

**File:** `src/game/scenes/MainMenuOptionC.ts`

### What it uses from pixui

| Feature | Source |
|---------|--------|
| `UiScene` base class | Everything from Option A |
| `this.insert.center.image(...)` | Background panel |
| `this.insert.center.frame(...)` | Foreground panel |
| `this.insert.center.bitmapText(...)` | Title text |
| `panel.insert.center.button(...)` | Menu buttons with BitmapFont labels |

### What it uses from plain Phaser

Only `this.add.image(...)` for the background -- everything else is pixui.

### Trade-offs

**Pros:**
- Fully declarative UI construction via the `insert` API
- Buttons are part of pixui's layout tree (responds to viewport changes)
- Cleaner code -- no manual positioning calculations
- Consistent pixel-art aesthetic with BitmapFont
- Built-in button states (up/down/hover/disabled) via theme

**Cons:**
- BitmapFont does not scale smoothly (fixed pixel size)
- Requires a font PNG + fontpack pipeline
- Button visual feedback depends on having separate atlas frames per state (up/down/hover/disabled); with single-image assets, all states look identical
- Less control over button hover/press effects (pixui handles them internally via frame switching)

---

## Recommendation

- **Use Option A** if you want scalable text, custom button effects, or are mixing pixel art with high-res UI elements.
- **Use Option C** if you're building a fully pixel-art game and want the cleanest declarative UI code with minimal manual layout.
- **Hybrid:** You can use pixui's `Frame` and `Image` for panel structure while adding your own interactive elements. The `insert` API is flexible enough to mix approaches.
