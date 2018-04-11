import assert from 'assert'
import ClassicSystem from './ClassicSystem'
import BinaryPTypeSystem from './BinaryPTypeSystem'
import BinarySTypeSystem from './BinarySTypeSystem'

describe('ClassicSystem', () => {
  const system = new ClassicSystem()
  it('should create ClassicSystem object', () => {
    assert.ok(system instanceof ClassicSystem)
    // assert.equal(system, -1)
  })
  it('should generate random single star system', (done) => {
    system.generate()
      .then(system => {
        assert.ok(Boolean(system.stars.length))
        console.log('>>', system);
        // console.log('* stars mass', system.stars.map(s=>s.mass.toFixed(2)));
        // console.log('* subsystems', system.system);
        done()
      })
  })


  const systemPType = new BinaryPTypeSystem()
  it('should create BinaryPTypeSystem object', () => {
    assert.ok(systemPType instanceof BinaryPTypeSystem)
    // assert.equal(systemPType, -1)
  })
  it('should generate random BinaryPTypeSystem', (done) => {
    systemPType.generate()
      .then(systemPType => {
        assert.ok(Boolean(systemPType.stars.length))
        console.log('>>', systemPType);
        // console.log('* stars mass', system.stars.map(s=>s.mass.toFixed(2)));
        // console.log('* subsystems', system.system);
        done()
      })
  })


  const systemSType = new BinarySTypeSystem()
  it('should create BinarySTypeSystem object', () => {
    assert.ok(systemSType instanceof BinarySTypeSystem)
    // assert.equal(systemSType, -1)
  })
  it('should generate random BinarySTypeSystem', (done) => {
    systemSType.generate()
      .then(systemSType => {
        assert.ok(Boolean(systemSType.stars.length))
        console.log('>>', systemSType);
        // console.log('* stars mass', system.stars.map(s=>s.mass.toFixed(2)));
        // console.log('* subsystems', system.system);
        done()
      })
  })
})
