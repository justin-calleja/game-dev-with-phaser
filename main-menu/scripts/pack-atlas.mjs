/**
 * Alternative atlas packing script using free-tex-packer-core.
 *
 * Usage: node scripts/pack-atlas.mjs
 *
 * Reads source PNGs from assets/ui/, packs them into a single atlas,
 * and outputs public/packed_assets/menu_ui.png + menu_ui.atlas (JSON).
 *
 * scale9Borders metadata is injected in a post-processing step since
 * free-tex-packer has no native nineslice concept.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { packAsync } from "free-tex-packer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS_DIR = join(ROOT, "assets", "ui");
const OUT_DIR = join(ROOT, "public", "packed_assets");

const entries = [
	{
		name: "fg_panel",
		file: "button_rectangle_border.png",
		scale9Borders: { x: 10, y: 10, w: 172, h: 44 },
	},
	{
		name: "bg_panel",
		file: "button_square_flat.png",
		scale9Borders: { x: 10, y: 10, w: 44, h: 44 },
	},
	{
		name: "primary_button",
		file: "button_rectangle_depth_gradient.png",
		scale9Borders: { x: 10, y: 10, w: 172, h: 44 },
	},
	{
		name: "secondary_button",
		file: "button_rectangle_depth_flat.png",
		scale9Borders: { x: 10, y: 10, w: 172, h: 44 },
	},
];

const images = entries.map((e) => ({
	path: e.name,
	contents: readFileSync(join(ASSETS_DIR, e.file)),
}));

const options = {
	textureName: "menu_ui",
	width: 512,
	height: 512,
	fixedSize: false,
	powerOfTwo: true,
	padding: 0,
	allowRotation: false,
	allowTrim: false,
	exporter: "Phaser3",
	packer: "OptimalPacker",
};

async function main() {
	const result = await packAsync(images, options);

	mkdirSync(OUT_DIR, { recursive: true });

	for (const item of result) {
		if (item.name.endsWith(".png")) {
			writeFileSync(join(OUT_DIR, item.name), item.buffer);
			console.log(`Wrote ${item.name}`);
		}

		if (item.name.endsWith(".json")) {
			const raw = JSON.parse(item.buffer.toString());

			// Phaser3 exporter outputs: { textures: [{ image, format, size, scale, frames: [...] }] }
			const texture = raw.textures?.[0];
			if (!texture) {
				console.error("No texture data found in packer output");
				process.exit(1);
			}

			const framesArr = (texture.frames || []).map((f) => {
				const entry = entries.find((e) => e.name === f.filename);
				const frameData = {
					filename: f.filename,
					frame: f.frame,
				};
				if (entry?.scale9Borders) {
					frameData.scale9Borders = entry.scale9Borders;
				}
				return frameData;
			});

			const outputAtlas = {
				meta: {
					image: "menu_ui.png",
					format: texture.format || "RGBA8888",
					size: texture.size || { w: 256, h: 256 },
					scale: String(texture.scale ?? "1"),
				},
				frames: framesArr,
			};

			const atlasPath = join(OUT_DIR, "menu_ui.atlas");
			writeFileSync(atlasPath, JSON.stringify(outputAtlas, null, 2));
			console.log(`Wrote menu_ui.atlas (with scale9Borders)`);
		}
	}
}

main().catch((err) => {
	console.error("Atlas packing failed:", err);
	process.exit(1);
});
