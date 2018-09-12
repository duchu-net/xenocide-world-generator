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

  // it('should generate 10 names', done => {
  //   const r = new Random(123);
  //   for (let i=0; i<10; i++) {
  //     // Console.WriteLine(StarName.Generate(r));
  //     console.log(Names.Generate(r))
  //   }
  //   assert.ok(true)
  // })
});
