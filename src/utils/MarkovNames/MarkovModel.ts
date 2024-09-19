import { RandomObject } from '../random';

export class MarkovModel {
  constructor(
    public order: number,
    public startingStrings = new Map<string, number>(),
    public productions = new Map<string, Map<string, number>>()
  ) {}

  Generate(random: RandomObject) {
    let builder = '';
    let lastSelected = MarkovModel.WeightedRandom(random, this.startingStrings);

    do {
      //Extend string
      builder += lastSelected;
      if (builder.length < this.order) break;

      //Key to use to find next production
      const key = builder.substring(builder.length - this.order);

      //Find production rules for this key
      const prod = [];
      if (!this.productions.has(key)) break;

      //Produce next expansion
      lastSelected = MarkovModel.WeightedRandom(random, this.productions.get(key));
      // @ts-ignore
    } while (lastSelected != '');
    return builder;
  }

  static WeightedRandom(random: RandomObject, _items: Map<string, number> = new Map()) {
    let num = random.unit();
    const items = Array.from(_items.entries());
    for (let i = 0; i < items.length; i++) {
      num -= items[i][1];
      if (num <= 0) return items[i][0];
    }
    throw new Error('InvalidOperationException');
  }
}

export default MarkovModel;
