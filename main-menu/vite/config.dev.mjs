import { processAssetsDev } from "pixel-tools";
import { defineConfig } from "vite";
import { assetsConfig } from "./assets.mjs";

export default defineConfig({
	base: "./",
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					phaser: ["phaser"],
				},
			},
		},
	},
	server: {
		port: 8080,
	},
	plugins: [processAssetsDev(assetsConfig)],
});
