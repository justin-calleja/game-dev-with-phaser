import { type GameObjects, Geom, Scene, type Types } from "phaser";

export const addCross = (
    scene: Scene,
    x: number,
    y: number,
    width = 4,
    length = 10,
    color = 0x00ff00,
) => {
    const graphics = scene.make.graphics();
    graphics.lineStyle(width, color);

    graphics.strokeLineShape(new Geom.Line(x - length, y, x + length, y));
    graphics.strokeLineShape(new Geom.Line(x, y - length, x, y + length));

    return graphics;
};

export const getCombinedBounds = (
    gameObjects: GameObjects.GameObject[],
    output: Geom.Rectangle = new Geom.Rectangle(),
): Geom.Rectangle | undefined => {
    if (gameObjects.length === 0) {
        return undefined;
    }

    let temp = new Geom.Rectangle();

    const [firstObj, ...rest] = gameObjects;
    Phaser.Display.Bounds.GetBounds(firstObj, output);

    for (const obj of rest) {
        Phaser.Display.Bounds.GetBounds(obj, temp);
        Phaser.Geom.Rectangle.Union(output, temp, output);
    }

    return output;
};

export const drawDebugRect = (
    scene: Scene,
    rect: Geom.Rectangle,
    container?: GameObjects.Container,
    color = 0x00ff00,
    alpha = 1,
    lineWidth = 4,
) => {
    const addToSceneDisplayList = container ? false : true;
    const graphics = scene.make.graphics(undefined, addToSceneDisplayList);
    graphics.lineStyle(lineWidth, color, alpha);
    graphics.strokeRectShape(rect);
    container?.add(graphics);
    return graphics;
};

export const defaultNineSliceConfig: Types.GameObjects.NineSlice.NineSliceConfig =
    {
        x: 0,
        y: 0,
        leftWidth: 10,
        rightWidth: 10,
        topHeight: 10,
        bottomHeight: 10,
    };

export const defaultTextStyle: Types.GameObjects.Text.TextStyle = {
    fontFamily: "Arial Black",
    fontSize: 24,
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 8,
    align: "center",
};
