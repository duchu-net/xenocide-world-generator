import MarkovModel from './MarkovModel';

export class MarkovModelBuilder {
  private _startingStrings: Map<string, number>;
  private _productions: Map<string, Map<string, number>>;

  constructor(private _order: number) {
    this._startingStrings = new Map();
    this._productions = new Map();
  }

  TeachArray(examples: string[]) {
    examples.forEach((e) => this.Teach(e));
    // for (const example of examples) this.Teach(example);
    return this;
  }

  Teach(example: string) {
    example = example.toLowerCase();

    //if the example is shorter than the order, just add a production that this example instantly leads to null
    if (example.length <= this._order) {
      MarkovModelBuilder.AddOrUpdateMap(this._startingStrings, example, 1, (a) => a + 1);
      this.Increment(example, '');
      return this;
    }

    //Chomp string into "order" length parts, and the single letter which follows it
    for (let i = 0; i < example.length - this._order + 1; i++) {
      const key = example.substring(i, i + this._order).trim();
      if (i == 0) MarkovModelBuilder.AddOrUpdateMap(this._startingStrings, key, 1, (a) => a + 1);
      const sub =
        i + this._order == example.length ? '' : example.substring(i + this._order, i + this._order + 1).trim();
      this.Increment(key, sub);
    }

    return this;
  }

  toModel() {
    const normalized = this.Normalize(this._startingStrings);
    const startingStrings = new Map(normalized);
    const productions = new Map([...this._productions.entries()].map((a) => [a[0], new Map(this.Normalize(a[1]))]));

    return new MarkovModel(this._order, startingStrings, productions);
  }

  Normalize(stringCounts: Map<string, number> = new Map()) {
    /* fix: somehow Map.entries and Map.values not working with SB */
    const values = Array.from(stringCounts, ([key, value]) => value);
    const entries = Array.from(stringCounts, ([key, value]) => [key, value] as const);
    const total = values.reduce((a, b) => a + b, 0);
    return entries.map(([key, value]) => [key, value / total] as const);
  }

  Increment(key: string, value: string) {
    if (!this._productions.has(key)) this._productions.set(key, new Map());
    MarkovModelBuilder.AddOrUpdateMap(this._productions.get(key) as Map<string, number>, value, 1, (a) => a + 1);
  }

  static AddOrUpdateMap(map: Map<string, number>, key: string, value: number, update: (value: number) => number) {
    if (!map.has(key)) map.set(key, value);
    else map.set(key, update(map.get(key) as number));
  }
}
