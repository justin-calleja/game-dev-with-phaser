# Texture Atlas Pipeline

This project supports two approaches for packing UI assets into a texture atlas. Both produce the same output format: a `.png` spritesheet + a `.atlas` JSON descriptor with `scale9Borders` metadata for nine-slice support.

## Approach 1: pixel-tools (recommended)

[pixel-tools](https://github.com/skhoroshavin/pixel-tools) is a CLI + Vite plugin by the phaser-pixui author. It packs PNGs into the exact `.atlas` format pixui expects, with native nineslice and spritesheet support.

### Setup

```bash
pnpm add -D pixel-tools
```

### Configuration files

**`assets/ui.yaml`** -- atlas recipe defining each sprite, its source image, and nineslice regions:

```yaml
- name: fg_panel
  image: ui/button_rectangle_border.png
  nineslice: { x: 10, y: 10, w: 172, h: 44 }
- name: bg_panel
  image: ui/button_square_flat.png
  nineslice: { x: 10, y: 10, w: 44, h: 44 }
- name: primary_button
  image: ui/button_rectangle_depth_gradient.png
  nineslice: { x: 10, y: 10, w: 172, h: 44 }
- name: secondary_button
  image: ui/button_rectangle_depth_flat.png
  nineslice: { x: 10, y: 10, w: 172, h: 44 }
```

The `nineslice` field defines the scalable center region as `{ x, y, w, h }`:
- `x` = left border width
- `y` = top border height
- `w` = center (scalable) width
- `h` = center (scalable) height

**`vite/assets.mjs`** -- tells pixel-tools where to find sources and where to output:

```js
export const assetsConfig = {
  source_path: "assets",
  destination_path: "public/packed_assets",
  atlases: [{ source: "ui.yaml", target: "menu_ui" }],
  fonts: [{ source: "fonts.yaml" }],  // optional: for BitmapFont
};
```

**`vite/config.dev.mjs`** -- wire the Vite plugin:

```js
import { processAssetsDev } from "pixel-tools";
import { assetsConfig } from "./assets.mjs";

export default defineConfig({
  // ...
  plugins: [processAssetsDev(assetsConfig)],
});
```

Use `processAssetsProd` in `config.prod.mjs`.

### Running

Atlas packing runs automatically on every Vite dev/build. Output goes to `public/packed_assets/menu_ui.png` + `menu_ui.atlas`.

To run manually (outside Vite):

```bash
npx atlaspack assets/ui.yaml public/packed_assets/menu_ui
```

### Pros

- Automatic on every build, watches for asset changes in dev mode
- Native nineslice (`scale9Borders`) support in the YAML config
- Native spritesheet support (for button state variants, animations)
- Produces the exact JSON format phaser-pixui expects
- Also includes `fontpack` for BitmapFont generation

### Cons

- Ships Go binaries (~2.7MB per platform)
- Newer/smaller community compared to TexturePacker

---

## Approach 2: free-tex-packer-core

[free-tex-packer-core](https://www.npmjs.com/package/free-tex-packer-core) is a popular open-source Node.js texture packer (pure JS, no native binaries).

### Setup

```bash
pnpm add -D free-tex-packer-core
```

### Configuration

All configuration is in `scripts/pack-atlas.mjs`. The script:

1. Reads PNG files from `assets/ui/`
2. Packs them using free-tex-packer's `packAsync()` with the `Phaser3` exporter
3. Post-processes the output JSON to:
   - Convert from Phaser3's `{ textures: [{ frames: [...] }] }` format to pixui's `{ frames: [...], meta: {...} }` format
   - Inject `scale9Borders` metadata for each nine-slice entry

The nineslice data is defined as a lookup table inside the script since free-tex-packer has no concept of nine-slice borders.

### Running

```bash
pnpm build:atlas
# or: node scripts/pack-atlas.mjs
```

This is a one-shot command -- run it manually whenever assets change.

To integrate with Vite, you could write a small custom plugin (~30 lines) that calls `packAsync` in a `buildStart` hook and watches the `assets/ui/` directory for changes during dev.

### Pros

- Pure JavaScript, no native binaries
- Well-known community tool (free-tex-packer ecosystem)
- Full control over the output format

### Cons

- No native `scale9Borders` support (must be injected manually)
- No Vite plugin out of the box (must write your own)
- Must be run explicitly (not automatic)
- Phaser3 exporter output format needs conversion for pixui

---

## Output format

Both approaches produce the same output that phaser-pixui expects:

```json
{
  "meta": {
    "image": "menu_ui.png",
    "format": "RGBA8888",
    "size": { "w": 256, "h": 256 },
    "scale": "1"
  },
  "frames": [
    {
      "filename": "fg_panel",
      "frame": { "x": 0, "y": 128, "w": 192, "h": 64 },
      "scale9Borders": { "x": 10, "y": 10, "w": 172, "h": 44 }
    }
  ]
}
```

Key fields:
- `frames[].filename` -- the name used to reference this sprite in code and theme config
- `frames[].frame` -- position and size within the atlas PNG
- `frames[].scale9Borders` -- nine-slice center region; when present, pixui/Phaser automatically creates a NineSlice instead of a Sprite

## Asset source files

Original individual images are kept intact under `public/assets/` for reference. The atlas source copies live in `assets/ui/`. The generated atlas in `public/packed_assets/` is gitignored.
