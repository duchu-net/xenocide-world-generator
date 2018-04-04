import assert from 'assert'
import Star from './Star'

describe('Star', function() {
  const star = new Star()
  it('should create Star object', function() {
    assert.ok(star instanceof Star)
    // assert.equal(star, -1)
  })


  it('should generate sun like star', (done) => {
    star.generate({ mass: 1 })
      .then(star => {
        assert.ok(Boolean(star.name))
        console.log(star);
        done()
      })
  })

  it('should generate star based on mass', (done) => {
    star.generate({ mass: 1.2 })
      .then(star => {
        assert.ok(Boolean(star.name))
        console.log(star);
        done()
      })
  })

  it('should generate random star', (done) => {
    star.generate()
      .then(star => {
        assert.ok(Boolean(star.name))
        // console.log(star);
        done()
      })
  })

  // // describe('#indexOf()', function() {
  //   it('should return -1 when the value is not present', function() {
  //     assert.equal([1,2,3].indexOf(4), -1);
  //   });
  // // });
});
