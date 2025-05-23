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

### 05-using-phaser

Re-implement what we built with "dummy-phaser" in Phaser.js.

### 06-loading-assets

- If a Scene has a `preload` method, it gets called before `create` and instructs Phaser to start the loader (plugin). See `SceneManager`'s `bootScene`.
- Assets "loaded" in `preload` are not actually loaded yet as `this.load` is asynchronous. Instead, of immediately loaded, assets are queued to be loaded by the loader plugin. On completion, the loader plugin fires an event and the Scene's `create` method gets called.
- Loaded assets are cached and available in all scenes.

### 07-practice-loading-assets

- `degit justin-calleja/template-vite-ts#v1 07-button`
- Download asset pack from kenny.nl:
  - https://www.kenney.nl/assets/ui-pack
- Copy over some images
- Render images separately

### 08-interactive-button

- how to make a game object interactive
- how to change an Image game object's texture
- how to listen and react to events on an interactive game object
- how to set and get a game object's visibility
