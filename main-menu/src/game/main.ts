import { AUTO, Game, Scale } from "phaser";
import { Boot } from "./scenes/Boot";

// Switch between Option A and Option C to compare:
import { MainMenuOptionA as MainMenu } from "./scenes/MainMenuOptionA";
// import { MainMenuOptionC as MainMenu } from "./scenes/MainMenuOptionC";

const dpr = window.devicePixelRatio || 1;

const config: Phaser.Types.Core.GameConfig = {
	type: AUTO,
	pixelArt: true,
	scale: {
		mode: Scale.ScaleModes.NONE,
		width: window.innerWidth * dpr,
		height: window.innerHeight * dpr,
		zoom: 1 / dpr,
		autoCenter: Scale.CENTER_BOTH,
	},
	parent: "game-container",
	backgroundColor: "#33A5E7",
	scene: [Boot, MainMenu],
};

const StartGame = (parent: string) => {
	const game = new Game({ ...config, parent });
	window.addEventListener("resize", () =>
		game.scale.resize(window.innerWidth * dpr, window.innerHeight * dpr),
	);
	return game;
};

export default StartGame;
