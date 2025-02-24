import { Scene } from "phaser";

const fpsLimit = 1000 / 30;

// export class BoxScene3 extends Scene {
//   constructor() {
//     super("BoxScene");
//   }

//   create() {
//     this.input.manager.canvas.addEventListener("contextmenu", (event) => {
//       event.preventDefault();
//     });

//     this.player = this.add
//       .rectangle(0, this.game.config.height / 2, 50, 50, 0xf96161)
//       .setOrigin(0, 0);

//     this.movePlayer();
//   }

//   movePlayer() {
//     this.tweens.add({
//       targets: this.player,
//       x: this.cameras.main.width, // Move to the right edge of the screen
//       duration: 3000, // Move over 3 seconds
//       ease: "Linear", // Smooth, constant movement
//       onComplete: () => {
//         this.player.x = -50; // Reset position off-screen
//         this.movePlayer(); // Restart the tween
//       },
//     });
//   }
// }

// export class BoxSceneNope extends Phaser.Scene {
//   constructor() {
//     super("BoxScene");
//     this.smoothedDelta = 16.67; // Approximate value for 60 FPS
//   }

//   create() {
//     this.player = {
//       x: 0,
//       y: this.game.config.height / 2,
//       width: 50,
//       height: 50,
//       speed: 10, // Pixels per second
//     };

//     this.playerRect = this.add
//       .rectangle(
//         this.player.x,
//         this.player.y,
//         this.player.width,
//         this.player.height,
//         0xf96161
//       )
//       .setOrigin(0, 0);
//   }

//   update(time, delta) {
//     if (!this.player || !this.playerRect) return;

//     // Smooth out delta spikes using exponential moving average
//     this.smoothedDelta = Phaser.Math.Linear(this.smoothedDelta, delta, 0.1);

//     // Convert to frame-rate independent speed
//     let deltaSpeed = (this.player.speed * this.smoothedDelta) / 1000; // Convert to seconds

//     this.player.x += deltaSpeed;
//     if (this.player.x > this.cameras.main.width) {
//       this.player.x = -50;
//     }

//     this.playerRect.x = this.player.x;
//   }
// }

export class BoxScene extends Scene {
  /** @type{Phaser.GameObjects.Rectangle} */
  rect;

  constructor() {
    super("BoxScene");
    this.lastUpdateTime = 0;
  }

  create() {
    // this.input.manager.canvas.addEventListener("contextmenu", (event) => {
    //   event.preventDefault();
    // });
    
    this.player = {
      x: 0,
      y: +this.game.config.height / 2,
      width: 50,
      height: 50,
      speed: 5,
    };

    this.rect = this.add
      .rectangle(
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height,
        0xf96161
      )
      .setOrigin(0, 0);
  }

//   updateMeh(time, delta) {
//     if (!this.player || !this.rect) return;

//     // Cap delta to avoid sudden large jumps (e.g., when right-clicking)
//     const maxDelta = 50; // Equivalent to ~20 FPS minimum frame time
//     delta = Math.min(delta, maxDelta);

//     // Normalize speed to 60 FPS using capped delta
//     let deltaSpeed = (this.player.speed * delta) / 16.67;

//     this.player.x += deltaSpeed;
//     if (this.player.x > this.cameras.main.width) {
//       this.player.x = -50;
//     }

//     this.rect.x = this.player.x;
//   }

//   update2(_time, delta) {
//     if (!this.player) return;

//     // Use delta time to ensure smooth movement across different frame rates
//     let deltaSpeed = (this.player.speed * delta) / 16.67; // Normalize speed to 60 FPS

//     this.player.x += deltaSpeed;
//     if (this.player.x > this.cameras.main.width) {
//       this.player.x = -50;
//     }

//     this.rect.x = this.player.x;
//   }

  update(_time, deltaTime) {
    // this.lastUpdateTime += deltaTime
    if (!this.player) return;
    // console.log("deltaTime:", deltaTime, fpsLimit)
    // if (this.lastUpdateTime < fpsLimit) return;
    // this.lastUpdateTime = 0

    this.player.x += this.player.speed;
    if (this.player.x > this.cameras.main.width) {
      this.player.x = -50;
    }

    this.rect.x = this.player.x;
  }
}
