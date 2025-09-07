import { Scene, GameObjects } from "phaser";
import { Stack } from "../objects/Stack";
import { panelGreyWithRedBorder, panelRed } from "../../asset-keys";
import { PrimaryButton, SecondaryButton } from "../objects/ButtonContainer";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  outerPanel: GameObjects.NineSlice;
  innerPanel: GameObjects.NineSlice;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const startGameBtn = new PrimaryButton(this, 0, 0);
    startGameBtn.setText("Start game", {
      color: "#ffffff",
    });

    const optionsBtn = new SecondaryButton(this, 0, 0);
    // secondaryButton.setText("Options", { fontFamily: "Bebas Neue" });
    optionsBtn.setText("Options");

    const creditsBtn = new SecondaryButton(this, 0, 0);
    creditsBtn.setText("Credits");

    const exitBtn = new SecondaryButton(this, 0, 0);
    exitBtn.setText("Exit");

    const stack = new Stack(this, [
      startGameBtn,
      optionsBtn,
      creditsBtn,
      exitBtn,
    ]);

    // stack.add(startGameBtn);
    // stack.add(optionsBtn);
    // stack.add(creditsBtn);
    // stack.add(exitBtn);

    // console.log("outside initialY:", optionsBtn.initialY);
    // stack.on("aligned", () => {
    //   startGameBtn.initialY = startGameBtn.y;
    //   optionsBtn.initialY = optionsBtn.y;
    //   creditsBtn.initialY = creditsBtn.y;
    //   exitBtn.initialY = exitBtn.y;

    //   console.log("initialY:", optionsBtn.initialY);
    // });
    // stack.align();

    const container = new Phaser.GameObjects.Container(
      this,
      centerX,
      centerY * 0.75,
    );

    // Get the stack bounds and add padding
    const stackBounds = stack.getBoundsRect();

    this.innerPanel = this.make.nineslice(
      {
        key: panelGreyWithRedBorder,
        leftWidth: 10,
        rightWidth: 10,
        topHeight: 10,
        bottomHeight: 10,
        width: stackBounds.width + 60,
        height: stackBounds.height + 60,
        x: stackBounds.centerX,
        y: stackBounds.centerY,
      },
      false
    );

    const titleText = this.make.text(
      {
        x: 0,
        y: this.innerPanel.getTopCenter().y - 22,
        text: "Game Title",
        style: {
          fontFamily: "Roboto",
          fontSize: 28,
          color: "#ffffff",
          fontStyle: "bold",
        },
      },
      false
    );
    titleText.setOrigin(0.5, 0.5);

    this.outerPanel = this.make.nineslice(
      {
        key: panelRed,
        leftWidth: 10,
        rightWidth: 10,
        topHeight: 10,
        bottomHeight: 10,
        width: this.innerPanel.width,
        height: this.innerPanel.height + titleText.height + 4,
        x: this.innerPanel.x,
        y: this.innerPanel.y - titleText.height - 4,
      },
      false
    );

    container.add([
      this.outerPanel,
      this.innerPanel,
      titleText,
      ...stack.getChildren(),
    ]);

    this.add.existing(container);

    // const graphicsRect = this.make.graphics({
    //   x: 0,
    //   y: 0,
    //   fillStyle: { color: 0x000000, alpha: 0.7 },
    // });
    // graphicsRect.fillRectShape(bounds);
  }
}
