import assert from 'assert'
import Random from '../utils/RandomObject'

import Galaxy from './Galaxy'
import Grid from './Galaxies/Grid'
import Sphere from './Galaxies/Sphere'
import Spiral from './Galaxies/Spiral'

describe('Galaxy', () => {
  it('should export a class constructor function', () => {
    assert.equal(typeof Galaxy, 'function')
    assert.ok(new Galaxy() instanceof Galaxy)
  })

  // it('should create default Grid Galaxy object', (done) => {
  //   Galaxy.Generate()
  //     .then(galaxy => {
  //       console.log('Grid', galaxy.statistics, galaxy)
  //       assert.ok(galaxy.statistics.star_systems > 0)
  //       done()
  //     })
  //     .catch(err => console.log('!', err))
  // })
  //
  // // it('should create Grid Galaxy object', (done) => {
  // //   Galaxy.Generate(new Grid(15, 10), new Random(123))
  // //     .then(galaxy => {
  // //       console.log('Grid', galaxy.statistics, galaxy)
  // //       assert.ok(galaxy.statistics.star_systems > 0)
  // //       done()
  // //     })
  // //     .catch(err => console.log('!', err))
  // // })
  //
  // // it('should create Sphere Galaxy object', (done) => {
  // //   Galaxy.Generate(new Sphere(), new Random(999))
  // //     .then(galaxy => {
  // //       console.log('Sphere', galaxy.statistics)
  // //       assert.ok(galaxy.statistics.star_systems > 0)
  // //       done()
  // //     })
  // // })
  //
  // it('should create Spiral Galaxy object', (done) => {
  //   Galaxy.Generate(new Spiral(), new Random(999))
  //     .then(galaxy => {
  //       console.log('Spiral', galaxy.statistics)
  //       console.log('_',galaxy);
  //       assert.ok(galaxy.statistics.star_systems > 0)
  //       done()
  //     })
  // })

  it('should create default Grid Galaxy object', (done) => {
    // const galaxy = new Galaxy().generateShape()
    Promise.resolve(new Galaxy().build())
      // .then(galaxy => {
      //   for (let system of galaxy.generateSystems()) {
      //     console.log(system)
      //   }
      //   return galaxy
      // })
      .then(galaxy => {
        console.log(galaxy);
        console.log(galaxy.statistics);
        done()
      })
    // Galaxy.Generate()
    //   .then(galaxy => {
    //     console.log('Grid', galaxy.statistics, galaxy)
    //     assert.ok(galaxy.statistics.star_systems > 0)
    //     done()
    //   })
    //   .catch(err => console.log('!', err))
  })
})
