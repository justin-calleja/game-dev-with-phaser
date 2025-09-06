import { Scene, GameObjects } from "phaser";
// import { Button } from "../Button";
// import { Checkbox2 } from "../Checkbox2";
import { Checkbox } from "../Checkbox";
import { ButtonContainer } from "../ButtonContainer";
import { NineSliceDebugger } from "../NineSliceDebugger";
import { addCross } from "../utils";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  button: ButtonContainer;
  // button: Button;
  checkbox: Checkbox;
  nineSliceDebugger: NineSliceDebugger;
  demoNineSlice: GameObjects.NineSlice;

  constructor() {
    super("MainMenu");
  }

  create() {
    (window as any).mainMenu = this;

    console.log("MainMenu - create()");

    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    // this.button = new Button(this, width, height);
    this.button = new ButtonContainer(this, width, height);
    this.button.setText(
      "Start Game\nSo long this text wow"
      // { style: { fontSize: "32px" } }
    );

    // this.add.existing(this.button);
    (window as any).button = this.button;
    this.add.existing(this.button);

    const cross = addCross(this, this.button.x, this.button.y, 2);
    this.add.existing(cross);

    // this.button.imgGO.setScale(4, 3);

    // Create nine-slice debugger
    // this.nineSliceDebugger = new NineSliceDebugger(this);

    // Demo nine-slice with debugging
    // this.createNineSliceDemo();

    /*
    const container = new Phaser.GameObjects.Container(this, 300, 200);

    // Create banner sections with scaling applied individually
    const scale = 2;
    const leftSection = this.make.image({
      x: 0,
      y: 0,
      key: "tilemap",
      frame: 43
    }).setScale(scale);

    const middleSection = this.make.image({
      x: leftSection.x + leftSection.displayWidth, // Adjust spacing for scale
      y: 0,
      key: "tilemap",
      frame: 44
    }).setScale(scale);

    const rightSection = this.make.image({
      x: middleSection.x + middleSection.displayWidth, // Adjust spacing for scale
      y: 0,
      key: "tilemap",
      frame: 45
    }).setScale(scale);
    */

    // var nineSlice = this.add.nineslice(300, 300, "tile", frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight);

    // container.add([leftSection, middleSection, rightSection]);
    // container.setScale(2);
    // this.add.existing(container);

    // // Add subtle fabric movement animation
    // this.tweens.add({
    //   targets: leftSection,
    //   y: "+=3",
    //   duration: 2000,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: 'Sine.easeInOut'
    // });

    // this.tweens.add({
    //   targets: middleSection,
    //   y: "+=2",
    //   duration: 2200,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: 'Sine.easeInOut',
    //   delay: 300
    // });

    // this.tweens.add({
    //   targets: rightSection,
    //   y: "+=3",
    //   duration: 1800,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: 'Sine.easeInOut',
    //   delay: 600
    // });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);

    // this.checkbox = new Checkbox(this, width - 200, height);
    // window.checkbox = this.checkbox;
    // this.checkbox.on("is-sound-enabled", (isSoundEnabled) => {
    //   console.log(`isSoundEnabled is ${isSoundEnabled}`);
    // });
  }

  cleanup() {
    this.button.removeAllListeners();
    // this.checkbox.removeAllListeners();
    this.nineSliceDebugger?.destroy();
  }

  createNineSliceDemo() {
    // Create a nine-slice using the tilemap texture
    // You can adjust these values to see how the boundaries change
    const x = 150;
    const y = 200;
    const width = 300;
    const height = 200;
    const leftWidth = 20; // Column A width
    const rightWidth = 25; // Column B width
    const topHeight = 15; // Row C height
    const bottomHeight = 18; // Row D height

    this.demoNineSlice = this.add.nineslice(
      x,
      y,
      "tilemap",
      0, // Using frame 0 of tilemap
      width,
      height,
      leftWidth,
      rightWidth,
      topHeight,
      bottomHeight
    );

    // Make it visible with a slight tint
    this.demoNineSlice.setTint(0xcccccc);

    // Debug the nine-slice with both lines and colored sections
    this.nineSliceDebugger.visualizeBoundaries(this.demoNineSlice, {
      showLines: true,
      colorSections: true,
      lineColor: 0xff0000,
      lineWidth: 3,
      logBoundaries: true,
      sectionAlpha: 0.4,
    });

    // Add some interactive controls for demonstration
    this.addInteractiveControls();
  }

  addInteractiveControls() {
    // Add text instructions
    this.add.text(
      50,
      50,
      "Nine-Slice Debug Demo\n" +
        "Red lines show boundaries:\n" +
        "• Vertical lines = Columns A & B\n" +
        "• Horizontal lines = Rows C & D\n" +
        "• Colored sections show the 9 areas\n" +
        "Press SPACE to toggle debug\n" +
        "Press R to randomize dimensions",
      {
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 10 },
      }
    );

    // Add keyboard controls
    this.input.keyboard?.on("keydown-SPACE", () => {
      // Toggle debug visualization
      if (this.nineSliceDebugger) {
        this.nineSliceDebugger.clear();
        // Re-enable with different settings
        setTimeout(() => {
          this.nineSliceDebugger.visualizeBoundaries(this.demoNineSlice, {
            showLines: true,
            colorSections: false, // Toggle sections off
            lineColor: 0x00ff00, // Change to green
            lineWidth: 2,
          });
        }, 100);
      }
    });

    this.input.keyboard?.on("keydown-R", () => {
      // Randomize nine-slice dimensions
      const newLeftWidth = Math.floor(Math.random() * 30) + 10;
      const newRightWidth = Math.floor(Math.random() * 30) + 10;
      const newTopHeight = Math.floor(Math.random() * 25) + 5;
      const newBottomHeight = Math.floor(Math.random() * 25) + 5;

      // Recreate the nine-slice with new dimensions
      this.demoNineSlice.destroy();
      this.demoNineSlice = this.add.nineslice(
        150,
        200,
        "tilemap",
        0,
        300,
        200,
        newLeftWidth,
        newRightWidth,
        newTopHeight,
        newBottomHeight
      );
      this.demoNineSlice.setTint(0xcccccc);

      // Update debug visualization
      this.nineSliceDebugger.visualizeBoundaries(this.demoNineSlice, {
        showLines: true,
        colorSections: true,
        lineColor: 0xff0000,
        lineWidth: 3,
        logBoundaries: true,
      });
    });
  }
}
