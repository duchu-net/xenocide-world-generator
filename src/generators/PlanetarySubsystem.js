class PlanetarySubsystem {

  constructor(stars) {
    if (stars)
      this.system = PlanetarySubsystem.buildTree(stars, 0, stars.length)
  }

  generateName(random) {
    return 'abc123'
  }

  Children(children) {
    this.children = children
    return this
  }
  CalculateOverall() {
    this.mass = this.children.reduce((prev, curr) => {
      return prev + curr.mass
    }, 0)
    return this
  }

  Generate(random = this.random) {
    const genList = [
      // ['seed', this.generateSeed],
      ['name', this.generateName],
      // ['position', this.generatePosition],
      // ['subsystems', this.generateSubsystem],
    ]
    for (const [key, fun] of genList) {
      if (this[key] == null) this[key] = fun(random)
      console.log('subsystem', key, this[key]);
    }

    return this
  }

  static buildTree(array, start, end) {
    if (end-start > 1) {
      const mid = (start+end)>>1;
      const left = PlanetarySubsystem.buildTree(array, start, mid);
      const right = PlanetarySubsystem.buildTree(array, mid, end);
      return new PlanetarySubsystem()
      .Children([left, right])
      .CalculateOverall()
    } else {
      return array[start]
    }
  }
}

export default PlanetarySubsystem
