import Planet from './Planet'
var assert = require('assert');

describe('Planet', function() {
  const planet = new Planet()
  it('should create Planet object', function() {
    assert.ok(planet instanceof Planet)
    // assert.equal(planet, -1)
  })

  it('should generate random planet', (done) => {
    planet.generate()
      .then(planet => {
        assert.ok(Boolean(planet.name))
        done()
      })
  })

  // // describe('#indexOf()', function() {
  //   it('should return -1 when the value is not present', function() {
  //     assert.equal([1,2,3].indexOf(4), -1);
  //   });
  // // });
});
