export class RectGameObject {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  /**
   * Draws the rectangle on the provided canvas context.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

/**
 * Defines the style properties for text rendering.
 *
 * @typedef {Object} TextStyle
 * @property {string} color - The color of the text (e.g., "#ff0000" for red).
 * @property {string} font - The font style (e.g., "20px Arial").
 */

export class TextGameObject {
  /**
   * @param {number} x - The x-coordinate of the text.
   * @param {number} y - The y-coordinate of the text.
   * @param {string} text - The text content to be displayed.
   * @param {TextStyle} style - The style configuration for the text.
   */
  constructor(x, y, text, style) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.style = style;
  }

  /**
   * Draws the rectangle on the provided canvas context.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    ctx.fillStyle = this.style.color;
    ctx.font = this.style.font;
    ctx.fillText(this.text, this.x, this.y);
  }
}

class GameObjectFactory {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Creates a rectangle game object and adds it to the scene.
   *
   * @param {number} x - The x-coordinate of the rectangle.
   * @param {number} y - The y-coordinate of the rectangle.
   * @param {number} width - The width of the rectangle.
   * @param {number} height - The height of the rectangle.
   * @param {number} hexNumberForColor - The color of the rectangle in hexadecimal format (e.g., 0xff0000 for red).
   * @returns {RectGameObject} The created rectangle game object.
   */
  rectangle(x, y, width, height, hexNumberForColor) {
    const color = "#" + hexNumberForColor.toString(16);
    const rect = new RectGameObject(x, y, width, height, color);
    this.scene.displayList.add(rect);
    return rect;
  }

  /**
   * Creates a text game object and adds it to the scene.
   *
   * @param {number} x - The x-coordinate of the text.
   * @param {number} y - The y-coordinate of the text.
   * @param {string} text - The text content to be displayed.
   * @param {TextStyle} style - The style configuration for the text (e.g., font size, color, etc.).
   * @returns {TextGameObject} The created text game object.
   */
  text(x, y, text, style) {
    const textGameObject = new TextGameObject(x, y, text, style);
    this.scene.displayList.add(textGameObject);
    return textGameObject;
  }
}

class DisplayList {
  constructor() {
    this.objects = [];
  }

  add(gameObject) {
    this.objects.push(gameObject);
  }

  /**
   * Renders all objects in the display list.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  renderAll(ctx) {
    for (const obj of this.objects) {
      obj.draw(ctx);
    }
  }
}

export class Scene {
  /**@type{string} */
  key;

  /**@type{DisplayList} */
  displayList;

  /**@type{GameObjectFactory} */
  add;

  /**@type{Game} */
  game;

  constructor(sceneConfig) {
    this.key = sceneConfig.key;
    this.displayList = new DisplayList();
    this.add = new GameObjectFactory(this);
  }

  /**
   * @param {Game} game
   */
  setGame(game) {
    this.game = game;
  }

  // Meant to be overwritten by user.
  // Runs once.
  create() {}

  destroy() {
    this.displayList = new DisplayList();
  }

  // Meant to be overwritten by user.
  // Runs every frame.
  update() {}
}

/**
 * @typedef {Object} GameConfig
 * @property {Scene[]} scenes - The scenes of the game.
 * @property {number} width - The width of the canvas.
 * @property {number} height - The height of the canvas.
 * @property {number} [fpsLimit=30] - The max fps the game will render at.
 * @property {string} [backgroundColor="#E1E9B7"] - The default background color to erase with every frame.
 * @property {HTMLElement | null} [parent] - The DOM element to append the canvas to (default: document.body)
 */

export class Game {
  /** @type{GameConfig} */
  config;

  /** @type{Scene | undefined} */
  currentScene;

  /** @type{Object<string, Scene>} */
  scenes;

  /** @type{HTMLCanvasElement} */
  canvas;

  /** @type{CanvasRenderingContext2D} */
  ctx;

  /** @type{number} */
  lastRenderTime;

  /** @type{number} */
  fpmsLimit;

  /**
   * @param {GameConfig} config - The game configuration object
   */
  constructor(config) {
    this.config = config;
    this.currentScene = config.scenes[0];
    this.scenes = {};
    this.lastRenderTime = 0;
    this.fpmsLimit = 1000 / (config.fpsLimit || 30);

    this.canvas = this.#createCanvas(config.width, config.height);
    this.ctx = /** @type {CanvasRenderingContext2D} */ (
      this.canvas.getContext("2d")
    );

    for (const scene of config.scenes) {
      scene.setGame(this);
      this.scenes[scene.key] = scene;
    }

    this.startScene(config.scenes[0].key);

    this.#raf();
  }

  /**
   * Creates a canvas element and appends it to the DOM.
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {HTMLCanvasElement} The created canvas element
   */
  #createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Append to specified parent or document body
    (this.config.parent || document.body).appendChild(canvas);

    return canvas;
  }

  /**
   * @param {number} timestamp
   * @returns {void}
   */
  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastRenderTime;

    if (deltaTime < this.fpmsLimit) {
      this.#raf();
      return;
    }
    this.lastRenderTime = timestamp;

    this.ctx.fillStyle = this.config.backgroundColor || "#E1E9B7";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.currentScene?.update();
    this.currentScene?.displayList.renderAll(this.ctx);

    this.#raf();
  }

  #raf() {
    requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }

  startScene(name) {
    this.currentScene?.destroy();
    this.currentScene = this.scenes[name];
    this.currentScene?.create();
  }
}
