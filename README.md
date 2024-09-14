## @xenocide/world-generator

_"Dear World, You are the best for Us!"_ - Artifexian  
TypeScript world generator for 4X like games in 3D space

> In heavy development mess xD
>
> For [CodeSandbox example](https://codesandbox.io/s/1c8gs), use git source with tag `prealpha_0.0.2-rc.1`, package.json example:
>
> ```json
> "dependencies": {
>   "xenocide-world-generator": "https://github.com/duchu-net/xenocide-world-generator@prealpha_0.0.2-rc.1",
> }
> ```
>
> ~~For now generator is developed as part of a private project (galaxy simulator with [nx](https://nx.dev/)),  
> so currently without plans to release as a separate bundle (but can be used as git submodule).~~

## @xenocide/world-generator available on NPM and with TS from 0.0.4!

![Image](./docs/22-10-30.png)

### Install

```bash
npm i @xenocide/world-generator@0.0.4
```

### Usage

```ts
const { GalaxyGenerator, GalaxyClass } = require('@xenocide/world-generator');
// or
import { GalaxyGenerator, GalaxyClass } from '@xenocide/world-generator';
```

Supports ESM and CommonJS modules.

New examples coming soon...

### Code

```js
import { GalaxyGenerator, GalaxyClass, PlanetGenerator } from '@xenocide/world-generator';

// Spiral shape
const world = new GalaxyGenerator(
  { id: 'demo', classification: GalaxyClass.Spiral },
  { seed: 123, spiral: { size: 500 } }
);
// Grid shape
const world = new GalaxyGenerator(
  { id: 'demo', classification: GalaxyClass.Grid },
  { seed: 123, grid: { size: 15, spacing: 5 } }
);

const systems = [];
for (const system of world.generateSystems()) {
  systems.push(system.path);

  for (const star of system.generateStars()) {
    // console.log('*** Star generated:', star.path, star.toModel());
  }

  /** don't generate too much for tests */
  if (systems.length <= 3) {
    for (const planet of system.generatePlanets()) {
      // console.log('*** Planet/Belt/Etc. generated:', planet.path, planet.toModel());
      if (planet instanceof PlanetGenerator) {
        for (const region of planet.generateSurface()) {
          // console.log('**** Regions generated:', region.path);
        }
      }
    }
  }
}

// Get Plain Object
const model = world.toModel();
```

### Inspired by

- [mainly] [Procedural Planet Generation](https://experilous.com/1/blog/post/procedural-planet-generation) by _Andy Gainey_
- [Star-Citizen-WebGL-Map](https://github.com/Leeft/Star-Citizen-WebGL-Map) by _Lianna Eeftinck_
- [Artifexian (YouTube)](https://www.youtube.com/user/Artifexian) by _Edgar Grunewald_
- [Procedural Generation For Dummies](http://martindevans.me/game-development/2016/01/14/Procedural-Generation-For-Dummies-Galaxies/) by _Martin Evans_
- [X game series](https://www.egosoft.com/games/x4/info_en.php) by Egosoft

#### Other links

- [4X games (Wikipedia)](https://en.wikipedia.org/wiki/4X)
- [Stellar classification (Wikipedia)](https://en.wikipedia.org/wiki/Stellar_classification)
- [Holdridge life zones (Wikipedia)](https://en.wikipedia.org/wiki/Holdridge_life_zones)
- [Planet IX](https://planetix.com/)
- [Prosperous Universe](https://prosperousuniverse.com/)
- [Astro Empires](https://www.astroempires.com/)

#### Old Examples

- [Generator - React client](https://codesandbox.io/s/1c8gs), [check on YouTube](https://www.youtube.com/channel/UCzGMc0qjJMu7PnH4ZdHni2w)
  ![Image](https://uploads.codesandbox.io/uploads/user/c3b8ed92-ed1d-4bff-8894-710d6c229664/aEDM-thumbnail.png)
- [Name generating - Markov Chains](https://codesandbox.io/s/h4vr6)
- [Population and Resources Market simulation - node.js subproject](https://codesandbox.io/s/m1vh74)

### todo

- [x] own tsconfig build, not from nx
