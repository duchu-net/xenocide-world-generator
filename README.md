## xenocide-world-generator
in development xD


#### Demo
* [react example](https://github.com/duchu-net/xenocide-world-client)

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
// Planet
// TODO
```

#### Inspired by
* [mainly] [Procedural Planet Generation](https://experilous.com/1/blog/post/procedural-planet-generation) by _Andy Gainey_
* [Star-Citizen-WebGL-Map](https://github.com/Leeft/Star-Citizen-WebGL-Map) by _Lianna Eeftinck_
* [Procedural Generation For Dummies](http://martindevans.me/game-development/2016/01/14/Procedural-Generation-For-Dummies-Galaxies/) by _Martin Evans_

#### Other links
