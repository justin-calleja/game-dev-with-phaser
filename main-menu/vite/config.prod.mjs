import { processAssetsProd } from "pixel-tools";
import { defineConfig } from "vite";
import { assetsConfig } from "./assets.mjs";

export default defineConfig({
	base: "./",
	logLevel: "warning",
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					phaser: ["phaser"],
				},
			},
		},
		minify: "terser",
		terserOptions: {
			compress: {
				passes: 2,
			},
			mangle: true,
			format: {
				comments: false,
			},
		},
	},
	server: {
		port: 8080,
	},
	plugins: [processAssetsProd(assetsConfig)],
});
