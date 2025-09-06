import { Scene, GameObjects } from "phaser";
import { NineSliceDebugger } from "../NineSliceDebugger";

/**
 * Examples showing different ways to visualize nine-slice boundaries
 */
export class NineSliceExamples {
  
  /**
   * Example 1: Basic boundary visualization with lines only
   */
  static basicLineVisualization(scene: Scene, nineSlice: GameObjects.NineSlice) {
    const debugger = new NineSliceDebugger(scene);
    debugger.visualizeBoundaries(nineSlice, {
      showLines: true,
      colorSections: false,
      lineColor: 0xff0000,
      lineWidth: 2,
      logBoundaries: true
    });
    return debugger;
  }

  /**
   * Example 2: Colored sections for better understanding
   */
  static coloredSectionVisualization(scene: Scene, nineSlice: GameObjects.NineSlice) {
    const debugger = new NineSliceDebugger(scene);
    debugger.visualizeBoundaries(nineSlice, {
      showLines: false,
      colorSections: true,
      sectionAlpha: 0.5,
      logBoundaries: true
    });
    return debugger;
  }

  /**
   * Example 3: Complete visualization with both lines and colors
   */
  static completeVisualization(scene: Scene, nineSlice: GameObjects.NineSlice) {
    const debugger = new NineSliceDebugger(scene);
    debugger.visualizeBoundaries(nineSlice, {
      showLines: true,
      colorSections: true,
      lineColor: 0x00ff00,
      lineWidth: 3,
      sectionAlpha: 0.3,
      logBoundaries: true
    });
    return debugger;
  }

  /**
   * Example 4: Quick debug using static method
   */
  static quickDebug(nineSlice: GameObjects.NineSlice) {
    return NineSliceDebugger.debug(nineSlice, {
      showLines: true,
      colorSections: true,
      logBoundaries: true
    });
  }

  /**
   * Example 5: Create and debug a nine-slice in one go
   */
  static createAndDebugNineSlice(
    scene: Scene,
    x: number, y: number,
    texture: string, frame: string | number,
    width: number, height: number,
    leftWidth: number, rightWidth: number,
    topHeight: number, bottomHeight: number
  ) {
    // Create the nine-slice
    const nineSlice = scene.add.nineslice(
      x, y, texture, frame,
      width, height,
      leftWidth, rightWidth, topHeight, bottomHeight
    );

    // Debug it immediately
    const boundaries = NineSliceDebugger.debug(nineSlice, {
      showLines: true,
      colorSections: true,
      lineColor: 0xff00ff,
      lineWidth: 2,
      logBoundaries: true
    });

    return { nineSlice, boundaries };
  }

  /**
   * Example 6: Compare different nine-slice configurations
   */
  static compareConfigurations(scene: Scene, texture: string, frame: string | number) {
    const configs = [
      { x: 100, y: 100, leftWidth: 10, rightWidth: 10, topHeight: 10, bottomHeight: 10 },
      { x: 300, y: 100, leftWidth: 20, rightWidth: 15, topHeight: 5, bottomHeight: 25 },
      { x: 500, y: 100, leftWidth: 30, rightWidth: 5, topHeight: 20, bottomHeight: 5 },
    ];

    const colors = [0xff0000, 0x00ff00, 0x0000ff];
    const debuggers: NineSliceDebugger[] = [];

    configs.forEach((config, index) => {
      const nineSlice = scene.add.nineslice(
        config.x, config.y, texture, frame,
        150, 100,
        config.leftWidth, config.rightWidth, config.topHeight, config.bottomHeight
      );

      const debugger = new NineSliceDebugger(scene);
      debugger.visualizeBoundaries(nineSlice, {
        showLines: true,
        colorSections: false,
        lineColor: colors[index],
        lineWidth: 2,
        logBoundaries: false
      });

      debuggers.push(debugger);
    });

    return debuggers;
  }
}
