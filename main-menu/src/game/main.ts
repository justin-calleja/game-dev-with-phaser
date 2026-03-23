import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";

// Switch between Option A and Option C to compare:
// import { MainMenuOptionA as MainMenu } from "./scenes/MainMenuOptionA";
import { MainMenuOptionC as MainMenu } from "./scenes/MainMenuOptionC";

const config: Phaser.Types.Core.GameConfig = {
	type: AUTO,
	pixelArt: true,
	scale: {
		width: 1024,
		height: 768,
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	parent: "game-container",
	backgroundColor: "#33A5E7",
	scene: [Boot, MainMenu],
};

const StartGame = (parent: string) => {
	return new Game({ ...config, parent });
};

export default StartGame;
