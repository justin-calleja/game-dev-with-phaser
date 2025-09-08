import type { GameObjects, Scene } from "phaser";
import { Stack } from "./Stack";
import { PrimaryButton, SecondaryButton } from "./ButtonContainer";
import { panelGreyWithRedBorder, panelRed } from "../../asset-keys";
import { ContainerGameObject } from "../../event-emitters";

export type SupportedEvents = {
  optionsBtnClicked: [];
};

export class MainMenuContainer extends ContainerGameObject<SupportedEvents> {
  outerPanel: GameObjects.NineSlice;
  innerPanel: GameObjects.NineSlice;

  titleText: GameObjects.Text;

  startGameBtn: PrimaryButton;
  optionsBtn: SecondaryButton;
  creditsBtn: SecondaryButton;
  quitBtn: SecondaryButton;

  stack: Stack;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y);

    this.startGameBtn = new PrimaryButton(scene, 0, 0);
    this.startGameBtn.setText("Start game", {
      color: "#ffffff",
    });

    this.optionsBtn = new SecondaryButton(scene, 0, 0);
    // secondaryButton.setText("Options", { fontFamily: "Bebas Neue" });
    this.optionsBtn.setText("Options");

    this.optionsBtn.on("pointerdown", () => {
        this.emit("optionsBtnClicked");
    });

    this.creditsBtn = new SecondaryButton(scene, 0, 0);
    this.creditsBtn.setText("Credits");

    this.quitBtn = new SecondaryButton(scene, 0, 0);
    this.quitBtn.setText("Quit");

    this.stack = new Stack(scene, [
      this.startGameBtn,
      this.optionsBtn,
      this.creditsBtn,
      this.quitBtn,
    ]);

    // this.stack.add(this.startGameBtn);
    // this.stack.add(this.optionsBtn);
    // this.stack.add(this.creditsBtn);
    // this.stack.add(this.exitBtn);

    // console.log("outside initialY:", optionsBtn.initialY);
    // stack.on("aligned", () => {
    //   startGameBtn.initialY = startGameBtn.y;
    //   optionsBtn.initialY = optionsBtn.y;
    //   creditsBtn.initialY = creditsBtn.y;
    //   exitBtn.initialY = exitBtn.y;

    //   console.log("initialY:", optionsBtn.initialY);
    // });
    // stack.align();

    // Get the stack bounds and add padding
    const stackBounds = this.stack.getBoundsRect();

    this.innerPanel = scene.make.nineslice(
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

    this.titleText = scene.make.text(
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
    this.titleText.setOrigin(0.5, 0.5);

    this.outerPanel = scene.make.nineslice(
      {
        key: panelRed,
        leftWidth: 10,
        rightWidth: 10,
        topHeight: 10,
        bottomHeight: 10,
        width: this.innerPanel.width,
        height: this.innerPanel.height + this.titleText.height + 4,
        x: this.innerPanel.x,
        y: this.innerPanel.y - this.titleText.height - 4,
      },
      false
    );

    this.add([
      this.outerPanel,
      this.innerPanel,
      this.titleText,
      ...this.stack.getChildren(),
    ]);

    // const graphicsRect = this.make.graphics({
    //   x: 0,
    //   y: 0,
    //   fillStyle: { color: 0x000000, alpha: 0.7 },
    // });
    // graphicsRect.fillRectShape(bounds);
  }
}
