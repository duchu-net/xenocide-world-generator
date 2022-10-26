## xenocide-world-generator
_"Dear World, You are the best for Us!"_ - Artifexian  
JS (EcmaScript) world generator for 4X like games in 3D space  
`// in development mess xD`

#### Example
- [Generator - React client](https://codesandbox.io/s/1c8gs), [check on YouTube](https://www.youtube.com/channel/UCzGMc0qjJMu7PnH4ZdHni2w)
![Image](https://uploads.codesandbox.io/uploads/user/c3b8ed92-ed1d-4bff-8894-710d6c229664/aEDM-thumbnail.png)
- [Name generating - Markov Chains](https://codesandbox.io/s/h4vr6)
- [Population and Resources Market simulation - node.js subproject](https://codesandbox.io/s/m1vh74)

## Code
```js
const { Galaxy } = require('xenocide-world-generator')

// Random shape
// const galaxy = new Galaxy() 
// Grid shape with [size, spacing] 
const galaxy = new Galaxy({ classification: 'grid', buildData: { gridOptions: [100, 30] } }) 
// Spiral shape
// const galaxy = new Galaxy({ classification: 'spiral' }) 

console.log('*** Galaxy generated:', galaxy.name, galaxy.code)
for (let system of galaxy.generateSystems()) {
  // await system.build()
  console.log('** System generated:', system.name, system.code)
  for (let star of system.generateStars()) {
    console.log('* Star generated:', star.designation, star.code)
  }
  for (let planet of system.generatePlanets()) {
    console.log('* Planet generated:', planet.designation, planet.code)
  }
}
console.log(galaxy.statistics)
```

#### Inspired by
* [mainly] [Procedural Planet Generation](https://experilous.com/1/blog/post/procedural-planet-generation) by _Andy Gainey_
* [Star-Citizen-WebGL-Map](https://github.com/Leeft/Star-Citizen-WebGL-Map) by _Lianna Eeftinck_
* [Artifexian (YouTube)](https://www.youtube.com/user/Artifexian) by _Edgar Grunewald_
* [Procedural Generation For  Dummies](http://martindevans.me/game-development/2016/01/14/Procedural-Generation-For-Dummies-Galaxies/) by _Martin Evans_

#### Other links
* [4X games (Wikipedia)](https://en.wikipedia.org/wiki/4X)
* [Stellar classification (Wikipedia)](https://en.wikipedia.org/wiki/Stellar_classification)
* [Holdridge life zones (Wikipedia)](https://en.wikipedia.org/wiki/Holdridge_life_zones)


// todo
// own tsconfig not from nx