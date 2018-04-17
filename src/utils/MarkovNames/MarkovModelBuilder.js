import MarkovModel from './MarkovModel'

class MarkovModelBuilder {
  _order = null;
  _startingStrings = new Map();
  _productions = new Map();

  // (int)
  constructor(order) {
    this._order = order;
  }

  TeachArray(examples) {
    examples.forEach(e => this.Teach(e))
    // for (const example of examples) this.Teach(example);
    return this;
  }

  Teach(example) {
    example = example.toLowerCase();

    //if the example is shorter than the order, just add a production that this example instantly leads to null
    if (example.length <= this._order) {
      MarkovModelBuilder.AddOrUpdateMap(this._startingStrings, example, 1, a => a+1)
      this.Increment(example, '');
      return this;
    }

    //Chomp string into "order" length parts, and the single letter which follows it
    for (let i=0; i<example.length-this._order+1; i++) {
      var key = example.substring(i, i+this._order).trim()
      if (i == 0)
        MarkovModelBuilder.AddOrUpdateMap(this._startingStrings, key, 1, a => a+1)
      var sub = i + this._order == example.length ? '' : example.substring(i + this._order, i+this._order+1).trim();
      this.Increment(key, sub);
    }

    return this;
  }

  toModel() {
    const startingStrings = new Map(this.Normalize(this._startingStrings))
    const productions = new Map([...this._productions.entries()].map(a => ([
      a[0],
      new Map(this.Normalize(a[1]))
    ])))

    return new MarkovModel(
      this._order,
      startingStrings,
      productions
    );
  }

  Normalize(stringCounts = []) {
    const total = [...(stringCounts.values ? stringCounts.values() : stringCounts)]
      .reduce((a, b) => a+b, 0)
    return [...stringCounts.entries()].map(([key, value]) => {
      return [key, value / total]
    })
  }

  Increment(key, value) {
    if (!this._productions.has(key)) {
      this._productions.set(key, new Map());
    }
    MarkovModelBuilder.AddOrUpdateMap(this._productions.get(key), value, 1, a => a+1)
  }

  static AddOrUpdateMap(map, key, value, update) {
    if (!map.has(key)) map.set(key, value)
    else map.set(key, update(map.get(key)))
  }
}

export default MarkovModelBuilder
