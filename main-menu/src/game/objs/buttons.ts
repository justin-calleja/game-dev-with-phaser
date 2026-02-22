import { GameObjects, Input, type Scene } from "phaser";
import { defaultTextStyle } from "../../utils";

export class ButtonContainer extends Phaser.GameObjects.Container {
    nineSliceObj: GameObjects.NineSlice;
    textObj: GameObjects.Text;
    initialY: number;
    yOffset = 2;
    assetKey: string;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        text: string,
        assetKey: string,
    ) {
        super(scene, x, y);
        this.initialY = y;
        this.assetKey = assetKey;

        this.nineSliceObj = scene.make.nineslice({
            x: 0,
            y: 0,
            key: assetKey,
            leftWidth: 10,
            rightWidth: 10,
            topHeight: 10,
            bottomHeight: 10,
            width: 190,
            height: 49,
        });

        this.textObj = new GameObjects.Text(scene, 0, 0, text, {
            ...defaultTextStyle,
        });
        this.textObj.setOrigin(0.5, 0.5);

        this.add([this.nineSliceObj, this.textObj]);

        // Set container size so input hit area adjusts accoridngly
        this.setSize(this.nineSliceObj.width, this.nineSliceObj.height);
        this.setInteractive();

        this.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerOver, this);
        this.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerOut, this);
        this.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onPointerDown, this);
        this.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onPointerUp, this);
    }

    protected onPointerOver() {
        this.y += this.yOffset;
    }

    protected onPointerOut() {
        this.y = this.initialY;
    }

    protected onPointerDown() {
        this.y += this.yOffset;
    }

    protected onPointerUp() {
        this.y -= this.yOffset;
    }

    public setInitialY(y: number) {
        this.initialY = y;
    }
}

export class PrimaryButton extends ButtonContainer {
    constructor(scene: Scene, x: number, y: number, text: string) {
        super(scene, x, y, text, "primary-button-normal");
    }
}

export class SecondaryButton extends ButtonContainer {
    constructor(scene: Scene, x: number, y: number, text: string) {
        super(scene, x, y, text, "secondary-button-normal");
    }
}
