import { GameObjects, Geom, Scene, Types } from "phaser";

export const addCross = (
  scene: Scene,
  x: number,
  y: number,
  width = 2,
  length = 10,
  color = 0xff0000
) => {
  const graphics = scene.make.graphics();
  graphics.lineStyle(width, color);

  graphics.strokeLineShape(new Geom.Line(x - length, y, x + length, y));
  graphics.strokeLineShape(new Geom.Line(x, y - length, x, y + length));

  return graphics;
};

export const makeDraggable = (gameObject: GameObjects.GameObject & { x: number; y: number }) => {
  gameObject.setInteractive({
    draggable: true,
  } as Types.Input.InputConfiguration);

  gameObject.on(
    "drag",
    (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      console.log("dragX:", dragX, "dragY:", dragY);
      gameObject.x = dragX;
      gameObject.y = dragY;
    }
  );
};
