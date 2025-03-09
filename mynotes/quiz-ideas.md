When using `requestAnimationFrame`, we do not decide when the callback runs - the browser does.
What can we do to prevent speed ups and slow downs in the frequency of `requestAnimationFrame` callback invocations from the browser?

a) Use deltaTime to move our game objects in the `update` method.

- incorrect
- In order to ensure a more consistent rate of `requestAnimationFrame` callback execution, we should implement frame limiting in our game loop.

b) Avoid using `requestAnimationFrame` as it does not allow us to specify when to run the supplied callback, and use `setInterval` instead.

- incorrect
- `requestAnimationFrame` is still a better alternative over `setInterval`. `setInterval` does not guarantee its callback function runs at the supplied interval and, moreover, unlike `requestAnimationFrame`, `setInterval` is not something the browser uses when it comes time for it to repaint the screen. This "running out of sync" with the browser's repaint cycle can lead to dropped frames - frames that aren't ready to render by the time it's time to render so they are skipped.

c) Add a little bit of code to implement frame limiting, such that we avoid rendering unless a certain amount of time has passed since the last game loop render.

- correct