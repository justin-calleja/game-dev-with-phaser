export class RectGameObject {
  /**
   * @param {number} x - The x-coordinate of the rectangle.
   * @param {number} y - The y-coordinate of the rectangle.
   * @param {number} width - The width of the rectangle.
   * @param {number} height - The height of the rectangle.
   * @param {string} color - The color of the rectangle in hexadecimal format (e.g., 0xff0000 for red).
   */
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
  /**
   *
   * @param {Scene} scene
   */
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

/**
 * @typedef {RectGameObject | TextGameObject} GameObject
 */

class DisplayList {
  /**@type{GameObject[]} */
  gameObjects;

  constructor() {
    this.gameObjects = [];
  }

  add(gameObject) {
    this.gameObjects.push(gameObject);
  }

  /**
   * Draws all objects in the display list.
   *
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  drawAll(ctx) {
    for (const obj of this.gameObjects) {
      obj.draw(ctx);
    }
  }
}

/**
 * @typedef {Object} SceneConfig
 * @property {string} key - A unique identifier for a given scene
 */

export class Scene {
  /**@type{string} */
  key;

  /**@type{GameObjectFactory} */
  add;

  /**@type{DisplayList} */
  displayList;

  /**
   * @param {SceneConfig} sceneConfig
   */
  constructor(sceneConfig) {
    this.key = sceneConfig.key;
    this.add = new GameObjectFactory(this);
    this.displayList = new DisplayList();
  }

  /**
   * Meant to be overwritten by user.
   * Runs once.
   */
  create() {}

  /**
   * Meant to be overwritten by user.
   * Runs every frame.
   *
   */
  update() {}
}

/**
 * @typedef {Object} GameConfig
 * @property {Scene[]} scenes - The scenes of the game.
 * @property {number} width - The width of the canvas.
 * @property {number} height - The height of the canvas.
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

  /** @type{string} */
  backgroundColor;

  /**
   * @param {GameConfig} config - The game configuration object
   */
  constructor(config) {
    this.config = config;
    this.backgroundColor = config.backgroundColor || "#E1E9B7";
    this.currentScene = config.scenes[0];
    this.scenes = {};

    this.canvas = this.#createCanvas(config.width, config.height);
    this.ctx =
      /** @type{CanvasRenderingContext2D} */
      (this.canvas.getContext("2d"));

    for (const scene of config.scenes) {
      this.scenes[scene.key] = scene;
    }

    this.startScene(this.currentScene.key);

    this.#raf();
  }

  #raf() {
    requestAnimationFrame((timestamp) => this.#gameLoop(timestamp));
  }

  startScene(key) {
    this.currentScene = this.scenes[key];
    this.currentScene?.create();
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

    (this.config.parent || document.body).appendChild(canvas);
    return canvas;
  }

  /**
   * @param {number} timestamp
   * @returns {void}
   */
  #gameLoop(timestamp) {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.currentScene?.update();
    this.currentScene?.displayList.drawAll(this.ctx);

    this.#raf();
  }
}
