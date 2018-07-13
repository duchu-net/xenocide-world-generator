import Star from './Star'

class PlanetarySubsystem {
  _average_separation = null
  _frost_line = null
  _inner_limit = null
  _outer_limit = null
  _barycentre = null
  _planets = []
  _mass = null
  _children = []
  _subtype = null
  _luminosity = null
  _planetable = null
  // SETTERS & GETTERS =========================================================
  set average_separation(average_separation) { this._average_separation = average_separation }
  get average_separation() { return this._average_separation }
  set frost_line(frost_line) { this._frost_line = frost_line }
  get frost_line() { return this._frost_line }
  set inner_limit(inner_limit) { this._inner_limit = inner_limit }
  get inner_limit() { return this._inner_limit }
  set outer_limit(outer_limit) { this._outer_limit = outer_limit }
  get outer_limit() { return this._outer_limit }
  set barycentre(barycentre) { this._barycentre = barycentre }
  get barycentre() { return this._barycentre }
  set planets(planets) { this._planets = planets }
  get planets() { return this._planets }
  set mass(mass) { this._mass = mass }
  get mass() { return this._mass }
  set children(children) { this._children = children }
  get children() { return this._children }
  set subtype(subtype) { this._subtype = subtype }
  get subtype() { return this._subtype }
  set luminosity(luminosity) { this._luminosity = luminosity }
  get luminosity() { return this._luminosity }
  set planetable(planetable) { this._planetable = planetable }
  get planetable() { return this._planetable }
  // END SETTERS & GETTERS =====================================================

  constructor(stars) {
  //   if (stars)
  //     this.system = PlanetarySubsystem.buildTree(stars, 0, stars.length)
  }

  generateName(random) {
    return 'abc123'
  }

  // FOR BINARY STAR: 0.15 - 6 AU (FOR HABITABLE GET EXTREME LOW VALUE)
  generateAverageSeparation(random) {
    // console.log('generateAverageSeparation');
    // // if (this.subtype == null) this.checkSubtype()
    // switch (this.subtype) {
    //   case ('BINARY_STAR'): return 1
    //   case ('SUBSYSTEM'): return 2
    //   default: throw new TypeError('subtype must be one of [...]')
    // }
  }



  recalculate() {
    this.subtype = PlanetarySubsystem.calcSubtype(this.children)
    this.planetable = PlanetarySubsystem.calcPlanetable(this.subtype, this.children)
    // console.log('subtype', this.subtype, this.children.length);
    const { children: [ch1, ch2] } = this
    this.mass = ch2 ? PlanetarySubsystem.calcMass(ch1.mass, ch2.mass) : ch1.mass
    this.inner_limit = ch2 ? PlanetarySubsystem.calcInnerLimit(this.mass) : ch1.inner_limit
    this.outer_limit = ch2 ? PlanetarySubsystem.calcOuterLimit(this.mass) : ch1.outer_limit
    this.luminosity = ch2 ? PlanetarySubsystem.calcLuminosity(ch1.luminosity, ch2.luminosity) : ch1.luminosity
    this.frost_line = ch2 ? PlanetarySubsystem.calcFrostLine(this.luminosity) : ch1.frost_line
  }

  static calcPlanetable(subtype, children) {
    switch (true) {
      case (subtype === 'SINGLE_STAR'):
      case (subtype === 'BINARY_STAR'):
      case (subtype === 'SUBSYSTEM' && children.every(c => c.subtype === 'SINGLE_STAR' || c.subtype === 'BINARY_STAR')):
        return true
      default: return false
    }
  }

  // checkSubtype() {
  //   const {children} = this
  //   if (children.length === 1) this.subtype = 'SINGLE_STAR'
  //   else if (children[0] instanceof Star && children[1] instanceof Star) this.subtype = 'BINARY_STAR'
  //   else if (children[0] instanceof Star || children[1] instanceof Star) this.subtype = 'SUBSYSTEM'
  // }

  Name(name) {
    this.name = name
    return this
  }
  Children(children) {
    this.children = children
    // this.checkSubtype()
    this.recalculate()
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
      ['average_separation', this.generateAverageSeparation],
      // ['position', this.generatePosition],
      // ['subsystems', this.generateSubsystem],
    ]
    for (const [key, fun] of genList) {
      if (this[key] == null) this[key] = fun(random)
      // console.log('subsystem', key, this[key]);
    }

    return this
  }


  // STATICS ===================================================================
  static calcSubtype(children) {
    // console.log('children', children);
    switch (true) {
      case (children.length === 1 && children[0].subtype !== 'SINGLE_STAR'): return 'SINGLE_STAR'
      case (children.length === 2 && children.every(c => c.body_type === 'STAR')): return 'BINARY_STAR'
      default: return 'SUBSYSTEM'
    }
  }
  static calcMass(massA, massB) {
    return massA + massB
  }
  static calcPrimaryBarycentre(average_separation = 1, massA = 2, massB = 1) {
    return average_separation * (massB / (massA + massB))
  }
  static calcSecondaryBarycentre(average_separation = 1, primary_barycentre = .3) {
    return average_separation - primary_barycentre
  }
  static calcFrostLine(luminosityA, luminosityB = 0) {
    // console.log('calcFrostLine', luminosityA, luminosityB);
    return 4.85 * Math.sqrt(luminosityA + luminosityB)
  }
  static calcInnerLimit(massA, massB = 0) {
    return Star.calcInnerLimit(massA + massB)
  }
  static calcOuterLimit(massA, massB = 0) {
    return Star.calcOuterLimit(massA + massB)
  }
  // TODO NOT SURE WITH THE FORMULA...
  static calcLuminosity(luminosityA, luminosityB = 0) {
    return luminosityA + luminosityB
  }

  static buildTree(array, start, end) {
    if (!Array.isArray(array)) throw new TypeError('array must be an Array type')
    if (start == null) start = 0
    if (end == null) end = array.length

    if (end-start > 1) {
      const mid = (start+end)>>1;
      // if (array.length === 1) return array[0]
      const left = PlanetarySubsystem.buildTree(array, start, mid);
      const right = PlanetarySubsystem.buildTree(array, mid, end);

      let leftSingle = null
      let rightSingle = null
      if (left.body_type === 'STAR' && right.body_type !== 'STAR')
        leftSingle = new PlanetarySubsystem()
          .Children([left])
      if (left.body_type !== 'STAR' && right.body_type === 'STAR')
        rightSingle = new PlanetarySubsystem()
          .Children([right])

      return new PlanetarySubsystem()
        .Children([leftSingle || left, rightSingle || right])
        // .CalculateOverall()
    } else {
      return array[start]
      // return new PlanetarySubsystem()
      //   .Children([array[start]])
    }
  }
  // END STATICS ===============================================================
}

export default PlanetarySubsystem
