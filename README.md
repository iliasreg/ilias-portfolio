# The Cut

Ilias Reguig’s Angular portfolio: a continuous, native-scroll field of expandable AWS-backed project fragments, a raster ASCII ribbon and diagonal difference cut. The frequency-matching interlude advances automatically; sound is optional and off by default. Reduced motion is respected, and browser effects release animation frames, observers, listeners and audio when the root is destroyed.

## Run

```sh
npm ci
npm start
```

Open http://localhost:4200/.

```sh
npm run build
npm run serve:ssr:portf
```

Production output is in `dist/portf/browser`; SSR output is in `dist/portf/server`. The existing deployment workflow is unchanged.

Projects are loaded by `PortfolioService` from `https://57ks7zsm79.execute-api.us-east-1.amazonaws.com/prod/projects`, including its JSON-string `body` envelope. There are no fallback/sample projects. Artwork is local in `src/assets/ribbon.png`; no shared prototype directory is needed at runtime.

## Checks

`npm run build` verifies Angular templates, TypeScript and SSR prerendering. This repository currently has no configured unit-test target (`npm test` cannot run a suite). In a browser, check native scrolling, every project’s details, keyboard focus, a 390px layout, reduced motion, and automatic frequency advancement with sound off/on.
