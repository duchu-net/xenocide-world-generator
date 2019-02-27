## xenocide-world-generator
_"Dear World, You are the best for Us!"_ - Artifexian  
JS (EcmaScript) world generator for 4X like games in 3D space  
`// in development mess xD`


#### Example
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
