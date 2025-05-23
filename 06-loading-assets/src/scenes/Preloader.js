import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    // this.add.rectangle(512, 384, 20, 10).setStrokeStyle(1, 0xffffff);
    // this.add.rectangle(512, 384, 5, 20).setStrokeStyle(1, 0xff0000);

    //  A simple progress bar. This is the outline of the bar.
    const outlineBar = this.add
      .rectangle(512, 384, 468, 32)
      .setStrokeStyle(1, 0xffffff);
    this.addCross(outlineBar.x, outlineBar.y);
    console.log("outlineBar origin:", outlineBar.originX, outlineBar.originY);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
    console.log("bar origin:", bar.originX, bar.originY);
    this.addCross(bar.x, bar.y);
    const progress = 0.1;
    // bar.width = 4 + 460 * progress;
    bar.width = 8;
    window.theBar = bar
    // bar.width = 464
    // 512 - 230 = 282
    // 230 * 2 = 460

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    // this.load.on('progress', (progress) => {

    //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
    //     bar.width = 4 + (460 * progress);

    // });
  }

  addCross(x, y, width = 2, length = 10, color = 0xff0000) {
    const graphics = this.add.graphics();
    graphics.lineStyle(width, color);

    graphics.strokeLineShape(
      new Phaser.Geom.Line(x - length, y, x + length, y)
    );
    graphics.strokeLineShape(
      new Phaser.Geom.Line(x, y - length, x, y + length)
    );
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("logo", "logo.png");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    // this.scene.start('MainMenu');
  }
}
