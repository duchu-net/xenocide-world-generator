import assert from 'assert'
import Random from '../utils/RandomObject'
import StarName from './StarName'
// import Grid from './Galaxies/Grid'

describe('StarName', () => {
  it('should export a class constructor function', () => {
    assert.equal(typeof StarName, 'function')
    assert.ok(new StarName() instanceof StarName)
  })

  it('should create StarName object', (done) => {
    StarName.Generate(new Random('1234')) // 5star
      .then(starSystem => {
        // console.log('$tarSystem', starSystem)
        assert.ok(starSystem)
        done()
      })
      .catch(err => { console.log('!', err); done(); })
  })

  it('should create 100 uniq star names', (done) => {
    StarName.GenerateCount(new Random('1234'), 100)
      .then(starSystem => {
        // console.log('$tarSystems', starSystem)
        assert.equal(100, starSystem.length)
        done()
      })
      .catch(err => { console.log('!', err); done(); })
  })
})
