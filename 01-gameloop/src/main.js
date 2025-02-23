const canvas =
  /** @type {HTMLCanvasElement} */
  (document.getElementById("canvas"));

const ctx =
  /** @type {CanvasRenderingContext2D} */
  (canvas.getContext("2d"));

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
}

canvas.addEventListener("click", () => {
    // @ts-ignore
    game.currentScene = game.currentScene === scene1 ? scene2 : scene1;
})

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
