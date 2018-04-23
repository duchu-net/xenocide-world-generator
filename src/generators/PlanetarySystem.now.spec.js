import assert from 'assert'
import Random from '../utils/RandomObject'

import PlanetarySystem from './PlanetarySystem'
// import Grid from './Galaxies/Grid'

describe('PlanetarySystem', () => {
  it('should export a class constructor function', () => {
    assert.equal(typeof PlanetarySystem, 'function')
    assert.ok(new PlanetarySystem() instanceof PlanetarySystem)
  })

  it('should create PlanetarySystem object', (done) => {
    new PlanetarySystem()
      .Generate(new Random(5248964))
      .then(system => {
        // console.log('>>',system,'<<');
        // console.log('>>',system._subsystem,'<<');
        assert.ok(system)
        done()
      })
    // // PlanetarySystem.Generate(new Random(99)) // 1star
    // PlanetarySystem.Generate(new Random(998559)) // 5star
    // // PlanetarySystem.Generate(new Random(9985595)) // 3star
    // // PlanetarySystem.Generate(new Random(99855985)) // 2star
    //   .then(starSystem => {
    //     // console.log('$tarSystem', starSystem)
    //     // assert.ok(starSystem.statistics.star_systems > 0)
    //     assert.ok(starSystem)
    //     done()
    //   })
    //   .catch(err => { console.log('!', err); done(); })
  })
})
