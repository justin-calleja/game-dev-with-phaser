import { Scene, GameObjects } from "phaser";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  private gameObjects: Array<{
    obj: GameObjects.Image;
    text: GameObjects.Text;
    listener: () => void;
  }> = [];
  private checkbox: Checkbox;
  private listenerCount = 0;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const width = this.scale.width / 2;
    const height = this.scale.height / 2;

    // Create button that will spawn game objects
    const btn = new Button(this, width, height);
    btn.on("clicked2", ({ counter }) => {
      console.log("MainMenu >> btn clicked with counter", counter);
      this.addGameObject(counter);
    });

    // Create checkbox that will affect all game objects
    this.checkbox = new Checkbox(this, width - 200, height);
    
    // Add debug text to show listener count
    const debugText = this.add.text(width, height + 100, "", {
      color: "#ffffff",
      fontSize: "16px"
    }).setOrigin(0.5);

    // Update debug text every frame
    this.events.on("update", () => {
      debugText.setText(`Active listeners: ${this.listenerCount}`);
    });

    // Add text to show instructions
    this.add.text(width, height - 100, "Click button to add objects\nClick checkbox to toggle alpha", {
      color: "#ffffff",
      fontSize: "24px",
      align: "center"
    }).setOrigin(0.5);
  }

  private addGameObject(index: number) {
    const x = 100 + (index * 100);
    const y = 200;
    
    // Create a new game object
    const obj = this.add.image(x, y, "logo");
    obj.setScale(0.5);
    
    // Add text to show object number
    const text = this.add.text(x, y + 50, `Obj ${index}`, {
      color: "#ffffff",
      fontSize: "16px"
    }).setOrigin(0.5);

    // Add a listener to the checkbox for this object
    const listener = () => {
      obj.setAlpha(this.checkbox.isTicked ? 0.5 : 1);
    };
    
    this.checkbox.on("checked", listener);
    this.checkbox.on("unchecked", listener);
    this.listenerCount += 2;

    // Store everything we need to clean up later
    this.gameObjects.push({ obj, text, listener });

    // After 5 objects, start removing the oldest ones
    if (this.gameObjects.length > 5) {
      const oldest = this.gameObjects.shift();
      if (oldest) {
        // Properly clean up all listeners
        this.checkbox.off("checked", oldest.listener);
        this.checkbox.off("unchecked", oldest.listener);
        this.listenerCount -= 2;
        
        // Now destroy the objects
        oldest.obj.destroy();
        oldest.text.destroy();
      }
    }
  }
}
