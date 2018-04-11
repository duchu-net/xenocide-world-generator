import assert from 'assert'
import Subsystem from './Subsystem'

describe('Subsystem', function() {
  const subsystem = new Subsystem()
  it('should create Subsystem object', function() {
    assert.ok(subsystem instanceof Subsystem)
    // assert.equal(subsystem, -1)
  })


  // it('should generate random subsystem', (done) => {
  //   subsystem.generate()
  //     .then(subsystem => {
  //       assert.ok(Boolean(subsystem.celestial_bodys.length))
  //       console.log('>>', subsystem);
  //       console.log('* stars mass', subsystem.stars.map(s=>s.mass.toFixed(2)));
  //       console.log('* subsystems', subsystem.subsystem);
  //       done()
  //     })
  // })
})
