import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  graphics: GameObjects.Graphics;

  constructor() {
    super("MainMenu");
  }

  // Helper method to visualize hit areas
  private visualizeRectHitArea(gameObject: GameObjects.GameObject, color: number = 0xff0000, alpha: number = 0.5) {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, alpha);
    window.go = gameObject;
    
    if (gameObject.input?.hitArea instanceof Phaser.Geom.Rectangle) {
      const hitArea = gameObject.input.hitArea;
      
      // Get the game object's position in world space
      const gameObjectX = gameObject.x;
      const gameObjectY = gameObject.y;
      
      // Convert hit area from local to world coordinates
      const worldX = gameObjectX + hitArea.x;
      const worldY = gameObjectY + hitArea.y;
      
      // Draw the hit area in world coordinates
      graphics.fillRect(
        worldX,
        worldY,
        hitArea.width,
        hitArea.height
      );

      // Optional: Draw a point at the game object's origin
      graphics.fillStyle(0x00ff00, 1); // Green dot
      graphics.fillCircle(gameObjectX, gameObjectY, 5);
    }
    
    return graphics;
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    const flat = this.add.image(width, height, "flat");
    const gloss = this.add.image(width, height + flat.height, "gloss").setOrigin(0);
    const gradient = this.add.image(
      width,
      height + flat.height * 2,
      "gradient"
    );

    // Create hit area in local coordinates (relative to gloss image)
    const hitArea = new Phaser.Geom.Rectangle(
      0, // x relative to gloss image
      0, // y relative to gloss image
      gloss.frame.realWidth / 2,
      gloss.frame.realHeight
    );

    // Create and configure graphics object
    // this.graphics = this.add.graphics();
    // this.graphics.fillStyle(0xff0000, 0.5); // Red color with 50% opacity
    // // this.graphics.fillRectShape(hitArea);
    // this.graphics.fillRect(
    //   gloss.x - gloss.frame.realWidth / 2, // Center the rectangle
    //   gloss.y - gloss.height / 2,
    //   hitArea.width,
    //   hitArea.height
    // );

    gloss.setInteractive(
      hitArea,
      //   {
      //     hitArea: hitArea,
      //   } as Phaser.Types.Input.InputConfiguration,
      Phaser.Geom.Rectangle.Contains
    );

    // Visualize the hit area using our helper
    this.visualizeRectHitArea(gloss);

    gloss.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
      () => {
        console.log(">> pointer down");
      },
      this
    );
  }
}
