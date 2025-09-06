import { GameObjects, Input, type Scene } from "phaser";
import { defaultBtn, hoverBtn, pressedBtn } from "./assetKeys";

export type SupportedEvents = {
  "click-even": [];
  pointerdown: [];
};

export class ContainerButton extends GameObjects.Container {
  count = 0;
  buttonImage: GameObjects.Image;
  textGO: GameObjects.Text;

  constructor(public scene: Scene, public x: number, public y: number) {
    super(scene, x, y);

    // Create the button background image
    this.buttonImage = new GameObjects.Image(scene, 0, 0, defaultBtn);
    
    // Create the text object (positioned relative to container, not globally)
    this.textGO = new GameObjects.Text(scene, 0, 0, "", {
      fontFamily: "kenney-future",
      fontSize: 24,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.textGO.setOrigin(0.5, 0.6);

    // Add both objects to the container
    this.add([this.buttonImage, this.textGO]);

    // Set up interactivity on the container
    this.setSize(this.buttonImage.width, this.buttonImage.height);
    this.setInteractive();

    // Set up event handlers
    this.on(
      Input.Events.GAMEOBJECT_POINTER_OVER,
      this.onPointerOver,
      this
    );
    this.on(
      Input.Events.GAMEOBJECT_POINTER_OUT,
      this.onPointerOut,
      this
    );
    this.on(
      Input.Events.GAMEOBJECT_POINTER_DOWN,
      this.onPointerDown,
      this
    );
    this.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);

    // Add container to scene
    scene.add.existing(this);
  }

  public setText(text: string): void {
    this.textGO.setText(text);
  }

  // Custom emit method with type safety (similar to the original)
  public emit<K extends keyof SupportedEvents>(
    event: K,
    ...args: SupportedEvents[K]
  ): boolean {
    return super.emit(event as any, ...args);
  }

  // Custom on method with type safety (similar to the original)
  public on<K extends keyof SupportedEvents>(
    event: K,
    fn: (...args: SupportedEvents[K]) => void,
    context?: any
  ): this {
    return super.on(event as string, fn, context);
  }

  protected onPointerOver(): void {
    this.buttonImage.setTexture(hoverBtn);
  }

  protected onPointerOut(): void {
    this.buttonImage.setTexture(defaultBtn);
  }

  protected onPointerDown(): void {
    this.count++;
    if (this.count % 2 === 0) {
      this.emit("click-even");
    }

    this.buttonImage.setTexture(pressedBtn);
  }

  protected onPointerUp(): void {
    this.buttonImage.setTexture(hoverBtn);
  }
}
