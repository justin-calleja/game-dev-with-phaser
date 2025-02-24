const canvas =
  /** @type {HTMLCanvasElement} */
  (document.getElementById("canvas"));

const ctx =
  /** @type {CanvasRenderingContext2D} */
  (canvas.getContext("2d"));

class RectGameObject {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// this.add.text(0, 0, 'Hello World', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
// this.add.text(0, 0, 'Hello World', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
class TextGameObject {
  constructor(x, y, text, style) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.style = style;
  }

  draw() {
    ctx.fillStyle = this.style.color;
    ctx.font = this.style.font;
    ctx.fillText(this.text, this.x, this.y);
  }
}

class GameObjectFactory {
  constructor(scene) {
    this.scene = scene;
  }

  // rectangle(x?: number, y?: number, width?: number, height?: number, fillColor?: number, fillAlpha?: number): Phaser.GameObjects.Rectangle;
  rectangle(x, y, width, height, hexNumberForColor) {
    if (!this.scene.displayList) {
      console.warn(
        "Cannot create a rectangle before scene finishies initialising"
      );
      return;
    }

    const color = "#" + hexNumberForColor.toString(16);
    const rect = new RectGameObject(x, y, width, height, color);
    this.scene.displayList.add(rect);
    return rect;
  }

  text(x, y, text, style) {
    if (!this.scene.displayList) {
      console.warn("Cannot create text before scene finishies initialising");
      return;
    }

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

  renderAll() {
    for (const obj of this.objects) {
      obj.render();
    }
  }
}

export class Scene {
  constructor(config) {
    this.key = config.key;
    this.displayList = new DisplayList();
    this.add = new GameObjectFactory(this);
  }

  // Meant to be overwritten by user.
  // Runs once.
  create() {
  }

  // Meant to be overwritten by user.
  // Runs every frame.
  update() {
    // this.displayList.renderAll();
  }
}

export class Game {
  constructor(config) {
    this.currentScene = config.scenes[0];

    this.scenes = {};
    for (const scene of config.scenes) {
      this.scenes[scene.key] = scene;
    }
  }

  switchScene(name) {
    this.currentScene = this.scenes[name];
    this.currentScene.create();
  }

  startScene(name) {
    this.currentScene = this.scenes[name];
    this.currentScene.create();
  }
}


const scene1 = {
  player: {
    x: 0,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 15,
  },

  update() {
    this.player.x += this.player.speed;
    if (this.player.x > canvas.width) {
      this.player.x = -this.player.width;
    }
  },

  render() {
    ctx.fillStyle = "#F96161";
    ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );
  },
};

const scene2 = {
  text: "hello world",

  update() {},

  render() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";

    ctx.fillText(this.text, 20, 40);
  },
};

const game = {
  currentScene: scene1,
};

canvas.addEventListener("click", () => {
  // @ts-ignore
  game.currentScene = game.currentScene === scene1 ? scene2 : scene1;
});

let lastTime = 0;
const fpsLimit = 1000 / 30;

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;

  if (deltaTime < fpsLimit) {
    return requestAnimationFrame(gameLoop);
  }
  lastTime = timestamp;

  ctx.fillStyle = "#E1E9B7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  game.currentScene.update();
  game.currentScene.render();

  requestAnimationFrame(gameLoop);
}

function main() {
  requestAnimationFrame(gameLoop);
}

main();
