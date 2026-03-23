import type { ThemeConfig } from "phaser-pixui";

export const menuTheme: ThemeConfig = {
	resources: {
		basePath: "packed_assets",
		atlas: "menu_ui",
		fonts: {
			atlas: "fonts",
			names: ["mana_roots"],
		},
	},

	palette: {
		default: 0xffffff,
		light: 0xffffff,
		dark: 0x000000,
	},

	fontName: "mana_roots",
	fontSize: 16,
	fontTint: "light",

	button: {
		frameUp: "primary_button",
		frameDown: "secondary_button",
		frameHover: "primary_button",
		frameDisabled: "secondary_button",
		fontTint: "light",
		defaultWidth: 190,
		defaultHeight: 49,
		styles: {
			secondary: {
				frameUp: "secondary_button",
				frameDown: "secondary_button",
				frameHover: "primary_button",
				frameDisabled: "secondary_button",
				fontTint: "dark",
			},
		},
	},

	frame: {
		frame: "fg_panel",
		paddingX: 40,
		paddingY: 40,
		styles: {
			bg: {
				frame: "bg_panel",
				paddingX: 10,
				paddingY: 10,
			},
		},
	},

	progress: {
		frame: "fg_panel",
		bar: "fg_panel",
	},

	textArea: {},

	dialog: {
		frame: "fg_panel",
	},
};
