import assert from 'assert'
import Random from '../utils/RandomObject'
import Star from './Star'
// import Grid from './Galaxies/Grid'

describe('Star', () => {
  it('should export a class constructor function', () => {
    assert.equal(typeof Star, 'function')
    assert.ok(new Star() instanceof Star)
  })

  it('should create Star object', (done) => {
    new Star().GenerateAsync()
      .then(star => {
        console.log('star', star);
        done()
      })
    // Star.Generate(new Random('1234'))
    //   .then(starSystem => {
    //     // console.log('$tarSystem', starSystem)
    //     assert.ok(starSystem)
    //     done()
    //   })
    //   .catch(err => { console.log('!', err); done(); })
  })

  // it('should create 100 uniq star names', (done) => {
  //   Star.GenerateCount(new Random('1234'), 100)
  //     .then(starSystem => {
  //       // console.log('$tarSystems', starSystem)
  //       assert.equal(100, starSystem.length)
  //       done()
  //     })
  //     .catch(err => { console.log('!', err); done(); })
  // })
})
