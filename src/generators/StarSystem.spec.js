import assert from 'assert'
import Random from '../utils/RandomObject'

import StarSystem from './StarSystem'
// import Grid from './Galaxies/Grid'

describe('StarSystem', () => {
  it('should export a class constructor function', () => {
    assert.equal(typeof StarSystem, 'function')
    assert.ok(new StarSystem() instanceof StarSystem)
  })

  it('should create StarSystem object', (done) => {
    // StarSystem.Generate(new Random(99)) // 1star
    StarSystem.Generate(new Random(998559)) // 5star
    // StarSystem.Generate(new Random(9985595)) // 3star
    // StarSystem.Generate(new Random(99855985)) // 2star
      .then(starSystem => {
        // console.log('$tarSystem', starSystem)
        // assert.ok(starSystem.statistics.star_systems > 0)
        assert.ok(starSystem)
        done()
      })
      .catch(err => { console.log('!', err); done(); })
  })
})
