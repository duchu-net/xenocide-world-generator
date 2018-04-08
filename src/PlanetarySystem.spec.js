import assert from 'assert'
import PlanetarySystem from './PlanetarySystem'

describe('PlanetarySystem', function() {
  const star = new PlanetarySystem()
  it('should create PlanetarySystem object', function() {
    assert.ok(star instanceof PlanetarySystem)
    // assert.equal(star, -1)
  })


  // it('should generate sun like star', (done) => {
  //   star.generate({ mass: 1 })
  //     .then(star => {
  //       assert.ok(Boolean(star.name))
  //       console.log(star);
  //       done()
  //     })
  // })
})
