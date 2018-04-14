## xenocide-world-generator
_"Dear World, You are the best for Us!"_ - Artifexian  
JS (EcmaScript) world generator for 4X like games in 3D space  
`// in development mess xD`


#### Demo
* [react example (repository)](https://github.com/duchu-net/xenocide-world-client)

#### Example
```js
import { Star, Galaxy, Grid, Random } from 'xenocide-world-generator'
// Galaxy
const galaxy = Galaxy.Generate(new Grid(), new Random('seed123'))
console.log(galaxy)
// StarSystem
// TODO
// Single Star
const star = Star.Generate(new Random('seed123'))
console.log(star)
// Star with mass (in solar masses unit)
console.log(new Star(1.2))
// Planet
// TODO
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
