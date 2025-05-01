import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("logo", "logo.png");
    // for (let i = 0; i < 200; i++) {
    //   this.load.image(`logo${i}`, "logo.png");
    // }
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    const blackBox = this.add
      .rectangle(
        0,
        // 0,
        this.scale.height,
        this.scale.width,
        0,
        // this.scale.height,
        // this.scale.height * 2,
        0x0000000
      )
      .setOrigin(0);
    //   .setOrigin(0.5, 1);
    window.blackBox = blackBox;

    const duration = 200;

    this.tweens.add({
      targets: blackBox,
      duration,
      //   ease: Phaser.Math.Easing.Cubic.InOut,
      height: -this.scale.height,
      onComplete: () => {
        this.scene.start("Game");
      },
    });

    // this.scene.transition({
    //   target: "Game",
    //   duration,
    //   moveBelow: true,
    //   //   onUpdate: (progress: number) => {
    //   //     // console.log(blackBox.y)
    //   //     const value = progress * this.scale.height;
    //   //     console.log(
    //   //       "🚀 progress:",
    //   //       progress,
    //   //       "blackBox.y",
    //   //       blackBox.y,
    //   //       "value to increment by:",
    //   //       value
    //   //     );
    //   //     blackBox.height = -value;
    //   //   },
    // });

    // this.cameras.main.fadeOut(1000, 0, 0, 0, () => {
    //   // //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    //   this.scene.transition({
    //     target: "Game",
    //     duration: 1000,
    //     onStart: () => {
    //       console.log("🚀 ~ Preloader ~ create ~ this:", this);
    //     },
    //   });
    // });
  }
}
