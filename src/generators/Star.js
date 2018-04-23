import {
  SPECTRAL_CLASSIFICATION,
  SUN_TEMPERATURE,
  SUN_AGE,
 } from '../CONSTANTS'

class Star {
  body_type = 'STAR'

  // name = null
  // stellar_class = null
  _mass = null // masa (SUN SCALE)
  // diameter = null // średnica
  _luminosity = null // jasność (SUN SCALE)
  _radius = null // promień
  _temperature = null // (SUN SCALE)
  // temperature_k= null // (K) /int
  _volume = null // objętość
  // density = null // gęstość
  // main_sequence_lifetime = null
  // main_sequence_lifetime_y = null // (Y) /int
  // circumference = null // obwód
  // surface_area = null // powierzchnia
  // frost_line = null // linia zmarźliny
  _inner_limit = null
  _outer_limit = null

  // GETTERS & SETTERS =========================================================
  get mass() { return this._mass }
  set mass(mass) {
    this._mass = mass
  }
  get luminosity() {
    // if (this._luminosity == null)
    //   this.luminosity = Star.calcLuminosity(this.mass)
    return this._luminosity
  }
  set luminosity(lum) {
    this._luminosity = lum
  }
  get radius() { return this._radius }
  set radius(rad) { this._radius = rad }
  get temperature() { return this._temperature }
  set temperature(temp) { this._temperature = temp }
  get volume() { return this._volume }
  set volume(vol) { this._volume = vol }
  get density() { return this._density }
  set density(den) { this._density = den }
  get frost_line() { return this._frost_line }
  set frost_line(fl) { this._frost_line = fl }
  get main_sequence_lifetime() { return this._main_sequence_lifetime }
  set main_sequence_lifetime(msl) { this._main_sequence_lifetime = msl }
  get circumference() { return this._circumference }
  set circumference(cir) { this._circumference = cir }
  get surface_area() { return this._surface_area }
  set surface_area(sa) { this._surface_area = sa }
  get inner_limit() { return this._inner_limit }
  set inner_limit(il) { this._inner_limit = il }
  get outer_limit() { return this._outer_limit }
  set outer_limit(ol) { this._outer_limit = ol }
  // END GETTERS & SETTERS =====================================================

  constructor(mass) {
    this.mass = mass
    this.recalculate()
  }

  recalculate() {
    if (this.mass) {
      this.radius = Star.calcRadius(this.mass)
      this.volume = Star.calcVolume(this.radius)
      this.density = Star.calcDensity(this.mass, this.radius)
      this.luminosity = Star.calcLuminosity(this.mass)
      this.inner_limit = Star.calcInnerLimit(this.mass)
      this.outer_limit = Star.calcOuterLimit(this.mass)
      this.frost_line = Star.calcFrostLine(this.luminosity)
      this.temperature = Star.calcTemperature(this.luminosity, this.radius)
      this.surface_area = Star.calcSurfaceArea(this.radius)
      this.circumference = Star.calcCircumference(this.radius)
      this.main_sequence_lifetime = Star.calcMainSequenceLifetime(this.mass, this.luminosity)
      this.habitable_zone = Star.calcHabitableZone(this.luminosity)
      this.habitable_zone_start = Star.calcHabitableZoneStart(this.luminosity)
      this.habitable_zone_end = Star.calcHabitableZoneEnd(this.luminosity)
    }
  }



  generateMass(random) {
    const matrice = random.choice(SPECTRAL_CLASSIFICATION) //TODO
    const mass = random.real(matrice.min_sol_mass, matrice.max_sol_mass)
    return mass
  }

  Name(name) {
    this.name = name
    return this
  }
  MassOrder(order) {
    this.mass_order = order
    return this
  }

  Generate(random = this.random) {
    const genList = [
      ['mass', this.generateMass],
      // ['seed', this.generateSeed],
      // ['name', this.generateName],
      // ['position', this.generatePosition],
      // ['stars', (random) => [...this.generateStars(random)].sort((a, b) => a.mass < b.mass)],
      // [''],
      // ['subsystem', this.generateSubsystem],
    ]
    for (const [key, fun] of genList) {
      if (this[key] == null) this[key] = fun(random)
      // console.log(key, this[key]);
    }
    this.recalculate()
    return this
  }


  // STATICS ===================================================================
  // converters
  static solTemperatureToKelvin(temp = 1) {
    return parseInt(temp * SUN_TEMPERATURE)
  }
  static solLifetimeToYears(main_sequence_lifetime = 1) {
    return parseInt(main_sequence_lifetime * SUN_AGE)
  }


  static calcLuminosity(mass) {
    switch (true) {
      case (mass < 0.43): return 0.23 * Math.pow(mass, 2.3)
      case (mass < 2 && mass >= 0.43): return Math.pow(mass, 4)
      case (mass < 20 && mass >= 2): return 1.5 * Math.pow(mass, 3.5)
      case (mass >= 20): return 3200 * mass
    }
  }
  static calcRadius(mass) {
    const exponent = mass > 1 ? 0.5 : 0.8
    return Math.pow(mass, exponent)
  }
  static calcTemperature(luminosity, radius) {
    return Math.pow(luminosity / Math.pow(radius, 2), 1/4)
  }
  static calcVolume(radius) {
    return 4/3 * Math.PI * Math.pow(radius, 3)
  }
  static calcDensity(mass, radius) {
    return mass / (4/3 * Math.PI * Math.pow(radius, 3))
  }
  static calcFrostLine(luminosity) {
    return 4.85 * Math.sqrt(luminosity)
  }
  static calcMainSequenceLifetime(mass, luminosity) {
    return mass / luminosity
  }
  static calcCircumference(radius) {
    return 2 * Math.PI * radius
  }
  static calcSurfaceArea(radius) {
    return 4 * Math.PI * Math.pow(radius, 2)
  }
  static calcInnerLimit(mass) {
    return 0.1 * mass
  }
  static calcOuterLimit(mass) {
    return 40 * mass
  }
  static calcHabitableZone(luminosity) {
    return Math.sqrt(luminosity)
  }
  static calcHabitableZoneStart(luminosity) {
    return Math.sqrt(luminosity/1.1)
  }
  static calcHabitableZoneEnd(luminosity) {
    return Math.sqrt(luminosity/0.53)
  }
  static Generate(random) {
    const matrice = random.choice(SPECTRAL_CLASSIFICATION) //TODO
    const mass = random.real(matrice.min_sol_mass, matrice.max_sol_mass)
    // console.log(matrice);
    return new Star(mass)
  }
  // END STATICS ===============================================================
}

export default Star
