import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    scale: {
        width: 1024,
        height: 768,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
        pixelArt: true,
    },
    parent: "game-container",
    backgroundColor: "#33A5E7",
    scene: [Boot, Preloader, MainMenu],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
