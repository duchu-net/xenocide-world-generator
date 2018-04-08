import weighted from './weighted-random'
import assert from 'assert'

let randomCounter = 0;
const randomValues = [0,0.19,0.5,0.7,0.9];
const randomMock = function(values, reset) {
  if (typeof(values)=="undefined") values = randomValues;
  if (typeof(reset)=="undefined") reset = false;
  if (reset) randomCounter = 0;
  return values[randomCounter++];
}

describe('Weighted random', () => {
  const list = {
    item1: 1,
    item2: 1,
    item3: 4,
    item4: 2,
    item5: 2,
  }

  it('should export a Function', function () {
    assert.equal(typeof weighted, 'function')
  })

  it('should select random', () => {
    const drawn = weighted(list)
    console.log(drawn);

    // const drawn2 = weighted(list, { rand: randomMock })
    // console.log(drawn2);
    // const drawn3 = weighted(list, { rand: randomMock })
    // console.log(drawn3);

    // const drawn2 = weighted(list)
    // console.log(drawn2);
    // const drawn3 = weighted(list)
    // console.log(drawn3);
    // const drawn4 = weighted(list)
    // console.log(drawn4);
    // const drawn5 = weighted(list)
    // console.log(drawn5);
    // const drawn6 = weighted(list)
    // console.log(drawn6);

    assert.ok(drawn != null)
  })

  it('should return "item1"', function (){
    assert.equal('item1', weighted(list, { rand: randomMock }));
  });
  it('should return "item2"', function (){
    assert.equal('item2', weighted(list, { rand: randomMock }));
  });
  it('should return "item3"', function (){
    assert.equal('item3', weighted(list, { rand: randomMock }));
  });
  it('should return "item4"', function (){
    assert.equal('item4', weighted(list, { rand: randomMock }));
  });
  it('should return "item5"', function (){
    assert.equal('item5', weighted(list, { rand: randomMock }));
  });
})
