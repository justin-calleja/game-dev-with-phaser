import { GameObjects, Geom, Scene } from "phaser";

export interface NineSliceDebugOptions {
  /** Show boundary lines */
  showLines?: boolean;
  /** Color the different sections */
  colorSections?: boolean;
  /** Line color for boundaries (default: red) */
  lineColor?: number;
  /** Line width for boundaries (default: 2) */
  lineWidth?: number;
  /** Log boundary calculations to console */
  logBoundaries?: boolean;
  /** Alpha for section coloring (default: 0.3) */
  sectionAlpha?: number;
}

export class NineSliceDebugger {
  private debugGraphics: GameObjects.Graphics;
  private coloredSections: GameObjects.Rectangle[] = [];

  constructor(private scene: Scene) {
    this.debugGraphics = scene.add.graphics();
  }

  /**
   * Visualize nine-slice boundaries on a NineSlice game object
   */
  visualizeBoundaries(
    nineSlice: GameObjects.NineSlice,
    options: NineSliceDebugOptions = {}
  ) {
    const {
      showLines = true,
      colorSections = false,
      lineColor = 0xff0000,
      lineWidth = 2,
      logBoundaries = true,
      sectionAlpha = 0.3
    } = options;

    this.clear();

    // Get nine-slice properties
    const x = nineSlice.x - nineSlice.originX * nineSlice.width;
    const y = nineSlice.y - nineSlice.originY * nineSlice.height;
    const width = nineSlice.width;
    const height = nineSlice.height;
    
    // Get the slice dimensions
    const leftWidth = nineSlice.leftWidth;
    const rightWidth = nineSlice.rightWidth;
    const topHeight = nineSlice.topHeight;
    const bottomHeight = nineSlice.bottomHeight;

    // Calculate boundary positions
    const boundaries = this.calculateBoundaries(
      x, y, width, height,
      leftWidth, rightWidth, topHeight, bottomHeight
    );

    if (logBoundaries) {
      console.group('Nine-Slice Debug Info');
      console.log('Position:', { x, y });
      console.log('Dimensions:', { width, height });
      console.log('Slice widths:', { leftWidth, rightWidth });
      console.log('Slice heights:', { topHeight, bottomHeight });
      console.log('Boundaries:', boundaries);
      console.groupEnd();
    }

    if (showLines) {
      this.drawBoundaryLines(boundaries, lineColor, lineWidth);
    }

    if (colorSections) {
      this.colorSections(boundaries, sectionAlpha);
    }

    return boundaries;
  }

  /**
   * Calculate the boundary positions for nine-slice sections
   */
  private calculateBoundaries(
    x: number, y: number, width: number, height: number,
    leftWidth: number, rightWidth: number, topHeight: number, bottomHeight: number
  ) {
    // Vertical boundaries (columns A and B)
    const columnA = x + leftWidth;          // Left edge of middle column
    const columnB = x + width - rightWidth; // Right edge of middle column

    // Horizontal boundaries (rows C and D) 
    const rowC = y + topHeight;             // Top edge of middle row
    const rowD = y + height - bottomHeight; // Bottom edge of middle row

    return {
      // Boundary lines
      columnA,
      columnB,
      rowC,
      rowD,
      // Full dimensions for reference
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
      // Section dimensions
      sections: {
        topLeft: { x, y, width: leftWidth, height: topHeight },
        topCenter: { x: columnA, y, width: columnB - columnA, height: topHeight },
        topRight: { x: columnB, y, width: rightWidth, height: topHeight },
        
        middleLeft: { x, y: rowC, width: leftWidth, height: rowD - rowC },
        middleCenter: { x: columnA, y: rowC, width: columnB - columnA, height: rowD - rowC },
        middleRight: { x: columnB, y: rowC, width: rightWidth, height: rowD - rowC },
        
        bottomLeft: { x, y: rowD, width: leftWidth, height: bottomHeight },
        bottomCenter: { x: columnA, y: rowD, width: columnB - columnA, height: bottomHeight },
        bottomRight: { x: columnB, y: rowD, width: rightWidth, height: bottomHeight },
      }
    };
  }

  /**
   * Draw boundary lines to show nine-slice divisions
   */
  private drawBoundaryLines(boundaries: any, color: number, width: number) {
    this.debugGraphics.lineStyle(width, color);

    // Draw vertical lines (columns A and B)
    this.debugGraphics.strokeLineShape(
      new Geom.Line(boundaries.columnA, boundaries.top, boundaries.columnA, boundaries.bottom)
    );
    this.debugGraphics.strokeLineShape(
      new Geom.Line(boundaries.columnB, boundaries.top, boundaries.columnB, boundaries.bottom)
    );

    // Draw horizontal lines (rows C and D) - only if not a 3-slice
    if (boundaries.rowC !== boundaries.top) {
      this.debugGraphics.strokeLineShape(
        new Geom.Line(boundaries.left, boundaries.rowC, boundaries.right, boundaries.rowC)
      );
    }
    if (boundaries.rowD !== boundaries.bottom) {
      this.debugGraphics.strokeLineShape(
        new Geom.Line(boundaries.left, boundaries.rowD, boundaries.right, boundaries.rowD)
      );
    }
  }

  /**
   * Color each section of the nine-slice for visualization
   */
  private colorSections(boundaries: any, alpha: number) {
    const colors = [
      0xff0000, // red
      0x00ff00, // green  
      0x0000ff, // blue
      0xffff00, // yellow
      0xff00ff, // magenta
      0x00ffff, // cyan
      0xff8000, // orange
      0x8000ff, // purple
      0x80ff00, // lime
    ];

    const sectionNames = [
      'topLeft', 'topCenter', 'topRight',
      'middleLeft', 'middleCenter', 'middleRight', 
      'bottomLeft', 'bottomCenter', 'bottomRight'
    ];

    sectionNames.forEach((sectionName, index) => {
      const section = boundaries.sections[sectionName];
      if (section.width > 0 && section.height > 0) {
        const rect = this.scene.add.rectangle(
          section.x + section.width / 2,
          section.y + section.height / 2,
          section.width,
          section.height,
          colors[index],
          alpha
        );
        this.coloredSections.push(rect);
      }
    });
  }

  /**
   * Clear all debug visualizations
   */
  clear() {
    this.debugGraphics.clear();
    this.coloredSections.forEach(rect => rect.destroy());
    this.coloredSections = [];
  }

  /**
   * Destroy the debugger and clean up
   */
  destroy() {
    this.clear();
    this.debugGraphics.destroy();
  }

  /**
   * Static helper to quickly debug a nine-slice
   */
  static debug(
    nineSlice: GameObjects.NineSlice,
    options: NineSliceDebugOptions = {}
  ) {
    const debuggerInstance = new NineSliceDebugger(nineSlice.scene);
    return debuggerInstance.visualizeBoundaries(nineSlice, options);
  }
}
