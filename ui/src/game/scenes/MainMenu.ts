import { Scene, GameObjects } from "phaser";
// import { mainMenu } from "../../asset-keys";
import { Stack } from "../objects/Stack";
import {
  primaryButton as primaryButtonAssetKey,
  secondaryButton as secondaryButtonAssetKey,
} from "../../asset-keys";
import { ButtonContainer } from "../objects/ButtonContainer";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  //   outerPanel: GameObjects.Image;
  //   innerPanel: GameObjects.Image;
  //   primaryButton: GameObjects.Image;
  //   secondaryButton: GameObjects.Image;

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
      fontStyle: "bold",
      //   stroke: "#ffffff",
      //   strokeThickness: 1,
    });

    const optionsBtn = new ButtonContainer(this, 0, 0, secondaryButtonAssetKey);
    // secondaryButton.setText("Options", { fontFamily: "Bebas Neue" });
    optionsBtn.setText("Options", { fontStyle: "bold" });

    const creditsBtn = new ButtonContainer(this, 0, 0, secondaryButtonAssetKey);
    // creditsBtn.setText("Credits\n give credit where\ncredit is due", { fontStyle: "bold" });
    creditsBtn.setText("Credits", { fontStyle: "bold" });

    const stack = new Stack(this, [
      startGameBtn,
      optionsBtn,
      creditsBtn,
      // this.make.image({ key: mainMenu.primaryButton }),
      // this.make.image({ key: mainMenu.secondaryButton }),
      // this.make.image({ key: mainMenu.secondaryButton }),
    ]);

    console.log("outside initialY:", optionsBtn.initialY);

    stack.on("aligned", () => {
      startGameBtn.initialY = startGameBtn.y;
      optionsBtn.initialY = optionsBtn.y;
    //   creditsBtn.y += 24;
      creditsBtn.initialY = creditsBtn.y;

      console.log("initialY:", optionsBtn.initialY);
    });
    stack.align();
    // stack.addBtn(this.make.image({ key: assetKeys.mainmenu.primaryButton }));
    // stack.addBtn(this.make.image({ key: assetKeys.mainmenu.secondaryButton }));
    // stack.addBtn(this.make.image({ key: assetKeys.mainmenu.secondaryButton }));

    const container = new Phaser.GameObjects.Container(
      this,
      centerX,
      centerY - centerY / 2
    );
    container.add(stack.getChildren());
    this.add.existing(container);

    // this.outerPanel = this.add.image(512, 384, assetKeys.mainmenu.outerPanel);
    // this.innerPanel = this.add.image(512, 384, assetKeys.mainmenu.outerPanel);
    // this.primaryButton = this.add.image(
    //   512,
    //   384,
    //   assetKeys.mainmenu.primaryButton
    // );
    // this.secondaryButton = this.add.image(
    //   512,
    //   384,
    //   assetKeys.mainmenu.secondaryButton
    // );
  }
}
