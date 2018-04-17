class MarkovModel {
  _order = null
  _startingStrings = new Map()
  _productions = new Map()

  constructor(order, startingStrings = new Map(), productions = new Map()) {
    this._order = order;
    this._startingStrings = startingStrings;
    this._productions = productions;
  }

  Generate(random) {
    let builder = "";
    let lastSelected = MarkovModel.WeightedRandom(random, this._startingStrings);

    do {
      //Extend string
      builder += lastSelected;
      if (builder.length < this._order) break;

      //Key to use to find next production
      var key = builder.substring(builder.length - this._order);

      //Find production rules for this key
      const prod = [];
      if (!this._productions.has(key)) break

      //Produce next expansion
      lastSelected = MarkovModel.WeightedRandom(random, this._productions.get(key));

    } while (lastSelected != '');
    return builder;
  }

  static WeightedRandom(random, _items = []) {
    var num = random.unit();
    const items = _items.set ? Array.from(_items.entries()) : _items
    for (let i=0; i<items.length; i++) {
      num -= items[i][1];
      if (num <= 0) return items[i][0];
    }
    throw new Error('InvalidOperationException');
  }
}

export default MarkovModel
