## Env vars in vite

```ts
console.log("VITE_DEBUG:", import.meta.env.VITE_DEBUG);
console.log("no import DEBUG:", DEBUG);
```

```js
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd());
  //   const env = loadEnv(mode, process.cwd(), "");
  console.log("🚀 ~ defineConfig ~ env:", env);

  return {
    base: "./",
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            phaser: ["phaser"],
          },
        },
      },
    },
    server: {
      port: 8080,
    },
    define: {
      DEBUG: JSON.stringify(env.DEBUG || "info"),
    },
  };
});
```

files: - .env.development - .env.production - .env.vdev

```sh
pnpm dev --mode=vdev
```

### summary

When passing in `--mode=vdev`, the `.env.vdev` file is loaded such that, if it contains:

```txt
VITE_DEBUG='true'

DEBUG="!@#"
```

then in `vite/config.dev.mjs`, this:

```
  const env = loadEnv(mode, process.cwd());
  //   const env = loadEnv(mode, process.cwd(), "");
  console.log("🚀 ~ defineConfig ~ env:", env);
```

```
🚀 ~ defineConfig ~ env: { VITE_DEBUG: 'true' }
```

i.e. the `VITE_` prefixed env vars get picked up from the `.env.vdev`... and if `""` is passed in as 3rd arg... then everything in `.env.vdev` and the processe's current `env` vars get included in the `env` variable assiged from `loadEnv`... which can then be used to add to:

```js
    define: {
      DEBUG: JSON.stringify(env.DEBUG || "info"),
    },
```

By adding to the `define`, they (the env vars passed to `define`) become accessible as globals in your scripts running in the browser. What's missing then is using `DEBUG` in the code... and telling the code (TS srever) that `DEBUG` exists. If `DEBUG` does not get added by vite... the app crashes as soon as it finds it i.e. there's no way I found to check that it's `undefined` first.
To tell TS that `DEBUG` exits, you can add in `src/vite-env.d.ts`:

```ts
declare const DEBUG: string | undefined;
// But... giving it `undefined` ... you may be tempted to check.. when in fact... it will just error out
// if you even use DEBUG if it's not a string... so might as well:
declare const DEBUG: string;
```

... this becomes a problem in production if `DEBUG` is not also added to vite's prod config.
