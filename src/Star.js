import CelestialBody from './CelestialBody'
import {
  SPECTRAL_CLASSIFICATION,
  SUN_TEMPERATURE,
  SUN_AGE,
} from './CONSTANTS'


class Star extends CelestialBody {
  body_type = 'star'

  name = null
  stellar_class = null
  mass = null // masa (SUN SCALE)
  diameter = null // średnica
  radius = null // promień
  luminosity = null // jasność (SUN SCALE)
  temperature = null // (SUN SCALE)
  temperature_k= null // (K) /int
  volume = null // objętość
  density = null // gęstość
  main_sequence_lifetime = null
  main_sequence_lifetime_y = null // (Y) /int
  circumference = null // obwód
  surface_area = null // powierzchnia
  frost_line = null // linia zmarźliny



  generate(args = {}) {
    const {
      stellar_class,
      mass,
      luminosity,
      diameter,
      radius,
      temperature,
      volume,
      density,
      main_sequence_lifetime,
      circumference,
      surface_area,
      frost_line,
    } = args

    // return Promise.resolve(this)
    return Promise.resolve()
      .then(() => {
        let matrice = null
        if (stellar_class != null && mass != null) {
          matrice = SPECTRAL_CLASSIFICATION.find(sc =>
            sc.class == stellar_class.toUpperCase() &&
            mass >= sc.min_sol_mass &&
            mass < sc.max_sol_mass)
          if (!matrice) throw { mass: 'not match with stellar classification' }
        } else if (mass != null && stellar_class == null) {
          matrice = SPECTRAL_CLASSIFICATION.find(sc =>
            mass >= sc.min_sol_mass &&
            mass < sc.max_sol_mass)
          if (!matrice) throw { mass: 'wrong mass scope' }
        }
        this.matrice = matrice

        this.name = 'abc'
        this.stellar_class = stellar_class != null ? stellar_class : this.generateStellarClassification()
        this.mass = mass != null ? mass : this.generateMass()

        this.luminosity = luminosity != null ? luminosity : this.calcLuminosity()
        // this.diameter = diameter != null ? diameter : this.calcDiameter()
        this.radius = radius != null ? radius : this.calcRadius()
        this.temperature = temperature != null ? temperature : this.calcTemperature()
        this.temperature_k = this.calcTemperatureInKelvin()
        this.volume = volume != null ? volume : this.calcVolume()
        this.density = density != null ? density : this.calcDensity()
        this.main_sequence_lifetime = main_sequence_lifetime != null ? main_sequence_lifetime : this.calcMainSequenceLifetime()
        this.main_sequence_lifetime_y = this.calcMainSequenceLifetimeInYears()
        this.circumference = circumference != null ? circumference : this.calcCircumference()
        this.surface_area = surface_area != null ? surface_area : this.calcSurfaceArea()
        this.frost_line = frost_line != null ? frost_line : this.calcFrostLine()
      })
      .then(() => this)
  }

  // FROST LINE
  calcFrostLine() {
    const { luminosity } = this.getValues('luminosity')
    return 4.85 * Math.sqrt(luminosity)
  }

  // SURFACE AREA
  calcSurfaceArea() {
    const { radius } = this.getValues('radius')
    return 4 * Math.PI * Math.pow(radius, 2)
  }

  // CIRCUMFERENCE
  calcCircumference() {
    const { radius } = this.getValues('radius')
    return 2 * Math.PI * radius
  }

  // LIFETIME
  calcMainSequenceLifetime() {
    const { mass, luminosity } = this.getValues('mass', 'luminosity')
    return mass / luminosity
  }
  calcMainSequenceLifetimeInYears() {
    const { main_sequence_lifetime } = this.getValues('main_sequence_lifetime')
    return parseInt(main_sequence_lifetime * SUN_AGE)
  }

  // DENSITY
  calcDensity() {
    const { mass, radius } = this.getValues('mass', 'radius')
    // return mass / (radius ^ 3)
    return mass / (4/3 * Math.PI * Math.pow(radius, 3))
  }

  // VOLUME
  calcVolume() {
    const { radius } = this.getValues('radius')
    // return radius ^ 3
    return 4/3 * Math.PI * Math.pow(radius, 3)
  }

  // // DIAMETER
  // calcDiameter() {
  //   const { mass } = this.getValues('mass')
  //   return Math.pow(mass, 0.74)
  // }

  // RADIUS
  calcRadius() {
    const { mass } = this.getValues('mass')

    let exponent = null
    switch (true) {
      case (mass > 1): exponent = 0.5; break
      default: exponent = 0.8; break
    }
    return Math.pow(mass, exponent)
  }

  // LUMINOSITY
  calcLuminosity() {
    const { mass } = this.getValues('mass')
    // SIMPLE VERSION
    // return Math.pow(mass, 3.5) // mass^3.5
    // MASS-LUMINOSITY RELATION https://en.wikipedia.org/wiki/Mass–luminosity_relation
    switch (true) {
      case (mass < 0.43): return 0.23 * Math.pow(mass, 2.3)
      case (mass < 2 && mass >= 0.43): return Math.pow(mass, 4)
      case (mass < 20 && mass >= 2): return 1.5 * Math.pow(mass, 3.5)
      case (mass >= 20): return 3200 * mass
    }
  }

  // TEMPERATURE
  calcTemperature() {
    const { luminosity, radius } = this.getValues('luminosity', 'radius')
    return Math.pow(luminosity / Math.pow(radius, 2), 1/4)
  }
  calcTemperatureInKelvin() {
    const { temperature } = this.getValues('temperature')
    return parseInt(temperature * SUN_TEMPERATURE)
  }

  // STELLAR CLASSIFICATION
  generateStellarClassification() {
    // IF MATRICE SET
    if (this.matrice) return this.matrice.class
    // OTHER WAY
    const random = Math.floor(Math.random() * SPECTRAL_CLASSIFICATION.length)
    return SPECTRAL_CLASSIFICATION[random].class
  }

  // MASS
  generateMass() {
    const star_matrice = this.getStarMatrice()
    return Math.random() * star_matrice.max_sol_mass + star_matrice.min_sol_mass
  }

  getStarMatrice() {
    if (this.stellar_class == null) throw { stellar_class: 'not set' }
    return SPECTRAL_CLASSIFICATION.find(sc => sc.class === this.stellar_class)
  }
}

export default Star
