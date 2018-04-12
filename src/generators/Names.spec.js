// import Names Generator from './Names Generator'
import assert from 'assert'
import Random from '../utils/RandomObject'
import Names from './Names'


describe('Names Generator', () => {
  it('should create Names Generator object', (done) => {
    // const planet = new Names Generator()
    const name = Names.Generate(new Random(1))
    console.log('name',name);
    assert.ok(Boolean(name))
    done()
    // assert.ok(planet instanceof Names Generator)
    // assert.equal(planet, -1)
  })
});
