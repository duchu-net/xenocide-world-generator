import assert from 'assert'
import Random from '../utils/RandomObject'

import System from './System'
// import Grid from './Galaxies/Grid'

describe('System', () => {
  it('should export a class constructor function', () => {
    assert.equal(typeof System, 'function')
    assert.ok(new System() instanceof System)
  })

  it('should create System object', async () => {
    const system = await new System({ seed: 153088705549 }).build()
    for (let star of system.generateStars()) {}
    for (let planet of system.generatePlanets()) {}

    //   await planet.build()
    console.log('* system', system)
    // // System.Generate(new Random(99)) // 1star
    // System.Generate(new Random(998559)) // 5star
    // // System.Generate(new Random(9985595)) // 3star
    // // System.Generate(new Random(99855985)) // 2star
    //   .then(System => {
    //     // console.log('$tarSystem', System)
    //     // assert.ok(System.statistics.star_systems > 0)
    //     assert.ok(System)
    //     done()
    //   })
    //   .catch(err => { console.log('!', err); done(); })
  }).timeout(5000)
})
