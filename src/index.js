// var window = document.createWindow()
// var jsdom = require('jsdom')
//   , document = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>')
//   , window = document.createWindow();
import World from './generators/World'
import Galaxy from './generators/Galaxy'
// import System from './generators/PlanetarySystem'
import System from './generators/System'
import Grid from './generators/Galaxies/Grid'
import Spiral from './generators/Galaxies/Spiral'
import Star from './generators/Star'
import Planet from './generators/Planet'
import Random from './utils/RandomObject'
export { World, Galaxy, System, Grid, Spiral, Star, Planet, Random }

// import GalaxyGenerator from './generators/Galaxy/GalaxyGenerator'
// import WorldGenerator from './world/WorldGeneretor'
//
//
// export function generateNewWorld() {
//   let world = null
//   return Promise.resolve()
//     .then(() => {
//       world = new WorldGenerator({ stars_count: 1000 })
//       return world.generate()
//     })
//     .then(() => {
//       console.log(world);
//     })
// }
//
//
//
// export function generateNewGalaxie({ onUpdate }) {
//   const action = new SteppedAction()
//   action.progressUpdater = (p) => {
//     if (onUpdate) onUpdate(p)
//     console.log(p.getCurrentActionName(), (p.getProgress() * 100).toFixed(2) + '%')
//   }
//
//   const galaxy = new GalaxyGenerator({ model: { seed: 'dupa', name: 'echo' } })
//
//   action
//     .executeSubaction((action) => {
//       galaxy.generate(action)
//     }, 1)
//     .getResult((result) => {
//       console.log(result);
//       // console.log('generateGalaxy result', result)
//       const systems = result.systems.length
//       const planets = result.systems.map(s => s.planets_count).reduce((a,b)=>(a+b),0)
//       console.log('systems count', systems)
//       console.log('planets count', planets)
//       console.log('average planets per system', (planets / systems).toFixed(2))
//       // expect.objectContaining(result)
//     })
//
//     // FINALIZE ------------------------------------------------------------
//     .finalize((action) => {
//       // done()
//     }, 0)
//     .execute()
// }
//
//
// // module.exports = {
// //   generateNewGalaxie,
// // }
