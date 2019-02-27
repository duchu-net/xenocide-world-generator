import assert from 'assert'
import Random from '../utils/RandomObject'

import Planet from './Planet'
// import Grid from './Galaxies/Grid'

describe('Planet', () => {
  it('should export a class constructor function', () => {
    assert.equal(typeof Planet, 'function')
    assert.ok(new Planet() instanceof Planet)
  })

  it('should create Planet object', (done) => {
    const planet = new Planet()
    for (let region of planet.generateRegions()) {
      console.log('region',region);
    }
    assert.ok(planet)
    done()
  })
})
