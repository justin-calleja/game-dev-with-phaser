## Getting started

### 01-template-vite

```sh
degit phaserjs/template-vite ./hello-phaser

cd ./hello-phaser

rm package-lock.json && pnpm i

pnpm dev

# how to stop dev server

# how to remove tracking

# how to build and serve
```

### 02-gameloop

What is a game loop?

Implement a basic game loop using requestAnimationFrame.

```sh
degit justin-calleja/template-vite#with-pnpm-no-log ./game-dev-with-phaser/01-gameloop
```

### 03-04-dummy-phaser

Objectives:

- Client code should not care about (or even see) the canvas API. Not just the canvas API, rendering should be abstracted.
- Client should create game objects - the "framework" will render them. The "framework" should provide ways for these game objects to be created.

```js
import { Scene, Game } from "./dummy-phaser";

// user defines BoxScene extending Scene

// user defines TextScene extending Scene

const game = new Game({
  scenes: [BoxScene, TextScene],
});
```

- `GameObject`
    - Anything that needs to be updated or drawn on every frame.
- `GameObjectFactory`
    - Quick way of creating Game Objects and adding them to a Scene.
- `DisplayList`
    - Belongs to a Scene and maintains the list of GameObjects to render every frame.
- `Scene`
    - A base class which can be extended by users of framework. User defines `GameObject`s in `create` (which runs once) and updates them in `update` (which runs every frame).
- `Game`
    - The main controller for our game i.e. used to configure, bootstrap, start, and run our game.
