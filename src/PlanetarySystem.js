import weighted from './utils/weighted-random'
import Group from './Group'
import Star from './Star'
import {
  STAR_COUNT_DISTIBUTION_IN_SYSTEMS,
  STAR_COUNT_DISTIBUTION_IN_BINARY_SUBSYSTEMS,
  MIN_STARS_MASS_DIFFERENCE_IN_SYSTEM,
  PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM,
  PLANETS_COUNT_IN_BINARY_STAR_P_TYPE_SYSTEM,
  PLANETS_COUNT_IN_BINARY_STAR_S_TYPE_SYSTEM,
  PLANETARY_SYSTEMS_TYPES,
} from './CONSTANTS'

class PlanetSystem extends Group {
  name = null
  type = null
  system = [
    // { type: 'star' },
    // { type: 'planet' },
    // { type: 'planet' },
    // { type: 'planet' },
  ]
  stars = []
  stars_count = null

  generate() {
    return Promise.resolve()
      .then(() => {
        this.name = 'S abc123'
        this.stars_count = this.generateStarsCount()
      })
      .then(() => this.generateStars())
      .then(stars => {
        this.stars = stars
        this.system = this.generateSystem()
        this.type = this.getType()
        this.planet_count_distribution = this.getPlanetsCountDistribution()
      })
      .then(() => this)
  }

  getType(system = this.system) {
    switch (true) {
      case (this.isSingleStarSystem(system)): {
        return PLANETARY_SYSTEMS_TYPES.SINGLE_STAR
      }
      case (this.isBinaryStarPTypeSystem(system)): {
        return PLANETARY_SYSTEMS_TYPES.MULTIPLE_BINARY_P_TYPE_STAR
      }
      default: {
        return PLANETARY_SYSTEMS_TYPES.MULTIPLE_P_TYPE_STAR
      }
    }
  }

  getPlanetsCountDistribution() {
    const { type } = this.getValues(['type'])
    switch (type) {
      case (PLANETARY_SYSTEMS_TYPES.SINGLE_STAR): {
        // console.log('isSingleStarSystem');
        return PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM
      }
      case (PLANETARY_SYSTEMS_TYPES.MULTIPLE_BINARY_P_TYPE_STAR): {
        // console.log('isBinaryStarPTypeSystem');
        return PLANETS_COUNT_IN_BINARY_STAR_P_TYPE_SYSTEM
      }
      default: {
        // console.log('isBinaryStarSTypeSystem');
        return PLANETARY_SYSTEMS_TYPES.MULTIPLE_P_TYPE_STAR
      }
    }
    // return
  }
  isSingleStarSystem(system = this.system) {
    return system.length === 1 && system[0].filter(s => s === 'star').length === 1
  }
  isBinaryStarPTypeSystem(system = this.system) {
    return system.length === 1 && system[0].filter(s => s === 'star').length === 2
  }

  generateSystem() {
    const { stars_count } = this.getValues(['stars_count'])
    let system = []

    let usedStarsCount = 0
    while (usedStarsCount < stars_count) {
      const freeStars = stars_count - usedStarsCount //- stars_count
      const subsystemStarsCount = freeStars > 1 ? weighted(STAR_COUNT_DISTIBUTION_IN_BINARY_SUBSYSTEMS, { parse: parseInt }) : 1

      system.push(Array(subsystemStarsCount).fill('star'))

      usedStarsCount += subsystemStarsCount
      console.log('subsystemStarsCount', freeStars, subsystemStarsCount);
    }
    return system
  }

  generateSubsystem(args = {}) {
    const { stars_count } = args
  }

  generateStarsIterrationsCount = 0
  generateStars() {
    const { stars_count } = this.getValues(['stars_count'])
    this.generateStarsIterrationsCount++
    const stars = []

    let promise = Promise.resolve()
    for (let i = 0; i < stars_count; i++) {
      promise = promise.then((prevStar) => {
        const star = new Star()
        stars.push(star)

        // if (prevStar != null) return star.generate({ max_sol_mass: prevStar.mass })
        return star.generate()
      })
    }

    return promise
      .then(() => stars.sort((s1, s2) => s1.mass < s2.mass))
      .then((sorted) => {
        // console.log('@@ iterration', this.generateStarsIterrationsCount, sorted.map(s=>s.mass.toFixed(2)));
        // CHECK MASS DIFFERENCE IN SYSTEM STARS
        if (sorted.map(s => s.mass).reduce((prev, curr) =>
          prev === false
            ? false : prev - curr >= MIN_STARS_MASS_DIFFERENCE_IN_SYSTEM
              ? curr : false
        , Number.POSITIVE_INFINITY) === false) return this.generateStars() // GET ANOTHER CHANCE
        // ALL GOOD, FINISH
        return sorted
      })
  }

  generateStarsCount() {
    // const stars_count = Math.random()
    return weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS, { parse: parseInt })
  }
}

export default PlanetSystem

// system = [
//   'star',
//   ['star', 'planet', 'planet'],
//   'planet',
//   'planet',
// ]
