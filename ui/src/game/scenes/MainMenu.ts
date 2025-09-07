import { Scene, GameObjects } from "phaser";
// import { mainMenu } from "../../asset-keys";
import { Stack } from "../objects/Stack";
import {
  panelGreyWithRedBorder,
  primaryButton as primaryButtonAssetKey,
  secondaryButton as secondaryButtonAssetKey,
} from "../../asset-keys";
import { ButtonContainer } from "../objects/ButtonContainer";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  outerPanel: GameObjects.Image;
  innerPanel: GameObjects.NineSlice;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const startGameBtn = new ButtonContainer(this, 0, 0, primaryButtonAssetKey);
    startGameBtn.setText("Start game", {
      color: "#ffffff",
    });

    const optionsBtn = new ButtonContainer(this, 0, 0, secondaryButtonAssetKey);
    // secondaryButton.setText("Options", { fontFamily: "Bebas Neue" });
    optionsBtn.setText("Options");

    const creditsBtn = new ButtonContainer(this, 0, 0, secondaryButtonAssetKey);
    creditsBtn.setText("Credits");

    // const stackContainer = new StackContainer(this, centerX, centerY);
    const stack = new Stack(this);

    stack.add(startGameBtn);
    stack.add(optionsBtn);
    stack.add(creditsBtn);

    console.log("outside initialY:", optionsBtn.initialY);

    stack.on("aligned", () => {
      startGameBtn.initialY = startGameBtn.y;
      optionsBtn.initialY = optionsBtn.y;
      //   creditsBtn.y += 24;
      creditsBtn.initialY = creditsBtn.y;

      console.log("initialY:", optionsBtn.initialY);
    });
    stack.align();

    const container = new Phaser.GameObjects.Container(
      this,
      centerX,
      //   centerY - centerY / 2
      centerY
    );

    // Get the stack bounds and add padding
    const stackBounds = stack.getBoundsRect();
    const padding = 20; // Add padding around the stack

    this.innerPanel = this.make.nineslice(
      {
        // x: stackBounds.x - padding / 2,
        // y: stackBounds.y - padding / 2,
        key: panelGreyWithRedBorder,
        leftWidth: 10,
        rightWidth: 10,
        topHeight: 10,
        bottomHeight: 10,
        width: stackBounds.width + padding,
        height: stackBounds.height + padding,
      },
      false
    );
    // this.innerPanel.setOrigin(0.5, 0);

    container.add([this.innerPanel, ...stack.getChildren()]);

    // stack.addBtn(this.make.image({ key: assetKeys.mainmenu.primaryButton }));
    // stack.addBtn(this.make.image({ key: assetKeys.mainmenu.secondaryButton }));
    // stack.addBtn(this.make.image({ key: assetKeys.mainmenu.secondaryButton }));

    // this.outerPanel = this.make.image({ key: panelRed }, false);

    this.add.existing(container);

    // container.add(this.innerPanel);
    // container.add(stack.getChildren());
    // stack.align();

    // const bounds = stack.getBoundsRect();
    // // const bounds = stack.getBounds(this.innerPanel.getBounds());
    // // this.graphics.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    // const graphicsRect = this.make.graphics({
    //   x: 0,
    //   y: 0,
    //   fillStyle: { color: 0x000000, alpha: 0.7 },
    // });
    // // rect.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    // graphicsRect.fillRectShape(bounds);
    // // bounds.
    // // this.innerPanel.setPosition(0, 0);
    // // stack.align();
    // // this.innerPanel.setOrigin(0);
    // this.innerPanel.setSize(bounds.width + 80, bounds.height + 20 );
    // this.innerPanel.setOrigin(0.5, 0.5);
    // // this.innerPanel.height = bounds.height + 800;
    // // this.innerPanel.setPosition(10, 20);
    // // console.log(
    // //   "innerPanel size:",
    // //   this.innerPanel.width,
    // //   this.innerPanel.height
    // // );

    // // container.add(graphicsRect)
    // this.add.existing(graphicsRect);

    // console.log("bounds:", bounds);
    // // container.add(stack.getChildren());

    // // Set innerPanel size and position to cover all stack children
    // // this.innerPanel.setPosition(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

    // /*
    // this.add.existing(stack.getChildren()[0]);
    // this.add.existing(stack.getChildren()[1]);
    // this.add.existing(stack.getChildren()[2]);
    // */

    // // this.innerPanel.setSize(bounds.width, bounds.height);
    // // this.add.existing(this.innerPanel);
    // // container.add(this.innerPanel);

    // // container.add([this.outerPanel, this.innerPanel, ...stack.getChildren()]);
    // // container.add(this.innerPanel);
  }
}
