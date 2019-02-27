import assert from 'assert'
import Random from '../utils/RandomObject'

import Galaxy from './Galaxy'
import System from './System'
import Grid from './Galaxies/Grid'
import Sphere from './Galaxies/Sphere'
import Spiral from './Galaxies/Spiral'

describe('Galaxy', () => {
  let galaxy = new Galaxy({ classification: 'grid' })
  it('should export a class constructor function', () => {
    assert.equal(typeof Galaxy, 'function')
    assert.ok(galaxy instanceof Galaxy)
  })
  it('should have initial values', () => {
    // assert.equal(typeof Galaxy, 'function')
    console.log('galaxy name', galaxy.name)
    assert.ok(galaxy.name != null)
    assert.ok(galaxy.code != null)
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
    let min = 500000
    let max = 0
    for (let system of galaxy.generateSystems()) {
      // console.log(system.temperature)
      if (min > system.temperature) min = system.temperature
      if (max < system.temperature) max = system.temperature
      assert.ok(system instanceof System)
      assert.ok(system.name != null)
    }
    console.log('temp: ', min, max)
    done()
  }).timeout(30000)

  it('should create a few star systems', () => {
    // const galaxy = new Galaxy().generateShape()
    // console.log(galaxy);
    console.log(galaxy.statistics)
    assert.ok(galaxy.statistics.star_systems > 0)
    // done()
  })
})
