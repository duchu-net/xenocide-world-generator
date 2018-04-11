import assert from 'assert'
import PlanetarySystem from './PlanetarySystem'

describe('PlanetarySystem', function() {
  const system = new PlanetarySystem()
  it('should create PlanetarySystem object', function() {
    assert.ok(system instanceof PlanetarySystem)
    // assert.equal(system, -1)
  })


  it('should generate random system', (done) => {
    system.generate()
      .then(system => {
        assert.ok(Boolean(system.name))
        console.log('>>', system);
        console.log('* stars mass', system.stars.map(s=>s.mass.toFixed(2)));
        console.log('* subsystems', system.system);
        done()
      })
  })
})
