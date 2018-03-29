import Generator from '../Generator'
import SYSTEM from './SystemConstants'
// import { SteppedAction, objects, randoms } from 'duchunet-utils'
import { PlanetGenerator } from '../Planet'
// import XorShift128 from './helpers/xor-shift128'


class SystemGenerator extends Generator {
  getDefaultProps() {
    return {
      model: {
        seed: null,
        name: null,
        // stars_type: null,
        // galaxy: null,
        size: null,
        radius: null,
        position: null,
        stars_count: null,
        planets_count: null,

        constelation_name: null,
        constelation_order: null,
        planets: null,
      },
      galaxy: {

      },
      generator: {
        // stars_types: SYSTEM.STARS_TYPES
        stars_distribution: SYSTEM.STARS_COUNT_DISTRIBUTION,
        planets_distribution: SYSTEM.PLANETS_COUNT_DISTRIBUTION,
      },
    }
  }

  constructor(props, random) {
    super(props)
    this.generatedModel = { }

    if (random != null) this.random = random
    else this.genSeed()
  }


  steppedGeneration(action) {
    return action
      .executeSubaction(action => action.provideResult(this.genName()), 1, 'generate system name')
      .getResult(res => { this.generatedModel.name = res })

      .executeSubaction(action => action.provideResult(this.genStarsCount()), 1, 'generate system stars count')
      .getResult(res => { this.generatedModel.stars_count = res })

      .executeSubaction(action => action.provideResult(this.genPlanetsCount()), 1, 'generate system planets count')
      .getResult(res => { this.generatedModel.planets_count = res })

      .executeSubaction(action => this.genPlanets(action), 15, 'generate system planets')
      .getResult(res => { this.generatedModel.planets = res })
  }


  genPlanets(action) {
    const { planets_count, name } = this.generatedModel
    const genPlanets = []

    let i = 0
    action
      .executeSubaction(action => {
        if (i >= planets_count) return

        // const planet = new PlanetGenerator({
        //   model: {
        //     system_order: i,
        //     orbit_zone: 'habit',
        //     system_name: name,
        //   }
        // }, this.random)
        //
        // action
        //   .executeSubaction(action => planet.generate(action))
        //   .getResult(res => genPlanets.push(res))

        ++i
        action.loop(i / planets_count)
      }, 1)
      .provideResult(genPlanets)
  }


  // PLANETS COUNT ==============================================================
  genPlanetsCount(overwriteModel = false) {
    const { planets_distribution } = this.props.generator
    const weighedList = this.generateWeighedList(planets_distribution)
    const rand = this.random.integerExclusive(0, weighedList.length)
    if (!overwriteModel && this.props.model.planets_count != null) return this.props.model.planets_count

    return parseInt(weighedList[rand])
  }


  // STARS COUNT ===============================================================
  genStarsCount(overwriteModel = false) {
    const { stars_distribution } = this.props.generator
    const weighedList = this.generateWeighedList(stars_distribution)
    const rand = this.random.integerExclusive(0, weighedList.length)
    if (!overwriteModel && this.props.model.stars_count != null) return this.props.model.stars_count

    return parseInt(weighedList[rand])
  }


  // NAME ======================================================================
  genName(overwriteModel = false) {
    const rand = this.random.integerExclusive(1000, 9999)
    if (!overwriteModel && this.props.model.name != null) return this.props.model.name

    const { constelation_name, constelation_order } = this.props.model
    switch (true) {
      case (constelation_name != null && constelation_order != null): return `${constelation_name}-${constelation_order}`
      case (constelation_order != null): return `unknown-${constelation_order}`
      default: return `unknown-${rand}`
    }
  }
}

export default SystemGenerator
