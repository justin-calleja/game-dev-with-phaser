import { Geom, Scene, type Types } from "phaser";

export const addCross = (
    scene: Scene,
    x: number,
    y: number,
    width = 2,
    length = 10,
    color = 0xff0000,
) => {
    const graphics = scene.make.graphics();
    graphics.lineStyle(width, color);

    graphics.strokeLineShape(new Geom.Line(x - length, y, x + length, y));
    graphics.strokeLineShape(new Geom.Line(x, y - length, x, y + length));

    return graphics;
};

export const defaultNineSliceConfig = {
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
