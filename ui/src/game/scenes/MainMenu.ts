import { Scene, GameObjects } from "phaser";
import { MainMenuContainer } from "../objects/MainMenuContainer";
import { RegistryDataManager } from "../../types";
import { StateMachine } from "../util/StateMachine";

type MMState = "quit-disabled" | "normal";

export class MainMenu extends Scene {
  declare registry: RegistryDataManager;

  background: GameObjects.Image;
  mainMenuContainer: MainMenuContainer;

  stateMachine: StateMachine<MMState>;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.stateMachine = new StateMachine(this, "MainMenuStateMachine");
    this.stateMachine
      .addState({ name: "normal", onEnter: this.onEnterNormal })
      .addState({
        name: "quit-disabled",
        onEnter: this.onEnterQuitDisabled,
        onExit: this.onExitQuitDisabled,
      });
    this.stateMachine.setState("normal");

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.mainMenuContainer = new MainMenuContainer(
      this,
      centerX,
      centerY * 0.75
    );

    this.add.existing(this.mainMenuContainer);

    this.mainMenuContainer.on("optionsBtnClicked", () => {
      const currentStateName = this.stateMachine.getCurrentStateName()
      if (!currentStateName) {
        this.stateMachine.setState("normal");
        return
      }

      if (currentStateName === "normal") {
        this.stateMachine.setState("quit-disabled");
        return
      }

      if (currentStateName === "quit-disabled") {
        this.stateMachine.setState("normal");
        return
      }

      // this.registry.toggle("isBgMusicEnabled");
      // console.log("isBgMusicEnabled:", this.registry.get("isBgMusicEnabled"));
    });
  }

  onEnterNormal() {
    console.log("on enter normal...");
  }

  onEnterQuitDisabled() {
    console.log("on enter quit-disabled...");
    // this.mainMenuContainer.quitBtn.dis
  }

  onExitQuitDisabled() {
    console.log("on exit quit-disabled...");
  }
}
