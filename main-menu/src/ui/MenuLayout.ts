import { Geom, type Scene } from "phaser";
import { LayoutNode } from "./LayoutNode";

const ATLAS = "menu_ui";
const NINE_SLICE_INSET = 10;
const VISIBLE_BG_PANEL_HEIGHT = 60;
const TITLE_MARGIN_TOP = 36;

export interface MenuLayoutResult {
	fgPanelWidth: number;
	fgPanelHeight: number;
	bgPanelHeight: number;
	/** Absolute scene-Y of the foreground panel center. */
	panelCenterY: number;
	/** Absolute scene-Y of the background (header) panel center. */
	bgPanelCenterY: number;
	/** Absolute scene-Y for the title text. */
	titleY: number;
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
	const fgPanelWidth = contentBounds.width + margin * 2;
	const fgPanelHeight = contentBounds.height + margin * 2;
	const panelCenterY = contentBounds.centerY;

	const bgPanelHeight = fgPanelHeight / 2 + VISIBLE_BG_PANEL_HEIGHT;
	const bgPanelCenterY = panelCenterY - bgPanelHeight / 2;

	const titleY = panelCenterY - bgPanelHeight + TITLE_MARGIN_TOP;

	return {
		fgPanelWidth,
		fgPanelHeight,
		bgPanelHeight,
		panelCenterY,
		bgPanelCenterY,
		titleY,
	};
}

/**
 * Create the bg_panel and fg_panel NineSlice objects, wrap them in a
 * {@link LayoutNode} tree, and add them to the scene's display list.
 *
 * The returned root node is centred at `(centerX, layout.panelCenterY)`.
 * Children (bg and fg panels) are attached at the root's center anchor
 * with Y offsets derived from the layout result.
 *
 * Call `root.update()` after adding any extra children (e.g. title text)
 * to propagate world positions.
 */
export function createPanelLayout(
	scene: Scene,
	layout: MenuLayoutResult,
	centerX: number,
): LayoutNode {
	const root = new LayoutNode({
		x: centerX,
		y: layout.panelCenterY,
		width: layout.fgPanelWidth,
		height: layout.fgPanelHeight,
	});

	const bgNineSlice = scene.add.nineslice(
		0,
		0,
		ATLAS,
		"bg_panel",
		layout.fgPanelWidth,
		layout.bgPanelHeight,
		NINE_SLICE_INSET,
		NINE_SLICE_INSET,
		NINE_SLICE_INSET,
		NINE_SLICE_INSET,
	);
	const bgNode = new LayoutNode({
		x: 0,
		y: layout.bgPanelCenterY - layout.panelCenterY,
		width: layout.fgPanelWidth,
		height: layout.bgPanelHeight,
	});
	bgNode.bind(bgNineSlice);
	root.addChild(bgNode);

	const fgNineSlice = scene.add.nineslice(
		0,
		0,
		ATLAS,
		"fg_panel",
		layout.fgPanelWidth,
		layout.fgPanelHeight,
		NINE_SLICE_INSET,
		NINE_SLICE_INSET,
		NINE_SLICE_INSET,
		NINE_SLICE_INSET,
	);
	const fgNode = new LayoutNode({
		x: 0,
		y: 0,
		width: layout.fgPanelWidth,
		height: layout.fgPanelHeight,
	});
	fgNode.bind(fgNineSlice);
	root.addChild(fgNode);

	return root;
}
