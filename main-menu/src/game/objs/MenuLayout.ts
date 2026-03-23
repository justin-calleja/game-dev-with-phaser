import { Geom } from "phaser";
import type { Frame, UiScene } from "phaser-pixui";

const ATLAS = "menu_ui";
const VISIBLE_BG_PANEL_HEIGHT = 60;
const TITLE_MARGIN_TOP = 36;

export interface MenuLayoutResult {
	fgPanelWidth: number;
	fgPanelHeight: number;
	bgPanelHeight: number;
	/** insert.center y-offset for the fg_panel */
	panelOffsetY: number;
	/** insert.center y-offset for the bg_panel */
	bgPanelOffsetY: number;
	/** Absolute scene-y for the title text */
	titleY: number;
	/** Absolute scene-y for the content center */
	panelCenterY: number;
}

/**
 * Derive panel sizes and positions from the bounding box of the content
 * (buttons) that will live inside the foreground panel.
 */
export function computeMenuLayout(
	contentBounds: Geom.Rectangle,
	gameHeight: number,
	margin: number,
): MenuLayoutResult {
	const cy = gameHeight / 2;

	const fgPanelWidth = contentBounds.width + margin * 2;
	const fgPanelHeight = contentBounds.height + margin * 2;
	const panelCenterY = contentBounds.centerY;
	const panelOffsetY = panelCenterY - cy;

	const bgPanelHeight = fgPanelHeight / 2 + VISIBLE_BG_PANEL_HEIGHT;
	const bgPanelCenterY = panelCenterY - bgPanelHeight / 2;
	const bgPanelOffsetY = bgPanelCenterY - cy;

	const titleY = panelCenterY - bgPanelHeight + TITLE_MARGIN_TOP;

	return {
		fgPanelWidth,
		fgPanelHeight,
		bgPanelHeight,
		panelOffsetY,
		bgPanelOffsetY,
		titleY,
		panelCenterY,
	};
}

/**
 * Create the bg_panel image and fg_panel frame via pixui's insert API.
 * Returns the Frame so callers can attach children to it (Option C).
 */
export function createPanelLayout(
	scene: UiScene,
	layout: MenuLayoutResult,
): Frame {
	scene.insert.center.image({
		y: layout.bgPanelOffsetY,
		texture: ATLAS,
		frame: "bg_panel",
		width: layout.fgPanelWidth,
		height: layout.bgPanelHeight,
	});

	return scene.insert.center.frame({
		y: layout.panelOffsetY,
		width: layout.fgPanelWidth,
		height: layout.fgPanelHeight,
	});
}
