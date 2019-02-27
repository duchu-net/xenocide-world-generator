import Generator from '../Generator'
import PLANET from './PlanetConstants'
// import XorShift128 from './helpers/xor-shift128'


class PlanetGenerator extends Generator {
  getDefaultProps() {
    return {
      model: {
        system_name: null,

        orbit_pivot_angle: null,
        orbit_pivot_rotation: null,
        orbit_rotation_time: null,
        planet_pivot_angle: null,
        // planet_pivot_rotation: null,
        planet_rotation_time: null,

        seed: null,
        name: null,
        type: null,
        orbit_zone: null,
        system_order: null,

        heat_level: null,
        detail_level: null,
        moisture_level: null,
        distortion_level: null,

        plate_count: null,
        oceanic_rate: null,
        // orbit_angle: null,
        // rotation_time: null,
        // revolution_time: null,

        moons: null,
        moons_count: null,
      },
      system: { },
      generator: {
        planets_matrices: PLANET.PLANETS_MATRICES,
        types_distribution: PLANET.TYPES_DISTRIBUTION,
        // planets_distribution: PLANET.PLANETS_COUNT_DISTRIBUTION,
      },
    }
  }

  constructor(props, random) {
    super(props)

    if (random != null) this.random = random
    else this.genSeed()
  }


  steppedGeneration(action) {
    return action
      .executeSubaction(action => action.provideResult(this.genOrbitZone()), 1, 'generate planet orbit zone')
      .getResult(res => { this.generatedModel.orbit_zone = res })

      .executeSubaction(action => action.provideResult(this.genFromMinMax(-45, 45)), 1, 'generate planet orbit pivot angle')
      .getResult(res => { this.generatedModel.orbit_pivot_angle = res })
      .executeSubaction(action => action.provideResult(this.genFromMinMax(-90, 90)), 1, 'generate planet orbit pivot rotation')
      .getResult(res => { this.generatedModel.orbit_pivot_rotation = res })
      .executeSubaction(action => action.provideResult(this.genFromMinMax(150, 1000)), 1, 'generate planet orbit rotation time')
      .getResult(res => { this.generatedModel.orbit_rotation_time = res })
      .executeSubaction(action => action.provideResult(this.genFromMinMax(-90, 90)), 1, 'generate planet pivot andle')
      .getResult(res => { this.generatedModel.planet_pivot_angle = res })
      .executeSubaction(action => action.provideResult(this.genFromMinMax(10, 100)), 1, 'generate planet rotation time')
      .getResult(res => { this.generatedModel.planet_rotation_time = res })

      .executeSubaction(action => action.provideResult(this.genType()), 1, 'generate planet type')
      .getResult(res => { this.generatedModel.type = res })

      .executeSubaction(action => action.provideResult(this.genName()), 1, 'generate planet name')
      .getResult(res => { this.generatedModel.name = res })

      .executeSubaction(action => action.provideResult(this.genMoonsCount()), 1, 'generate planet moons count')
      .getResult(res => { this.generatedModel.moons_count = res })

      .executeSubaction(action => action.provideResult(this.genDetailLevel()), 1, 'generate planet detail level')
      .getResult(res => { this.generatedModel.detail_level = res })
//
      .executeSubaction(action => action.provideResult(this.genDistortionLevel()), 1, 'generate planet distortion level')
      .getResult(res => { this.generatedModel.distortion_level = res })

      .executeSubaction(action => action.provideResult(this.genHeatLevel()), 1, 'generate planet heat level')
      .getResult(res => { this.generatedModel.heat_level = res })

      .executeSubaction(action => action.provideResult(this.genMoistureLevel()), 1, 'generate planet moisture level')
      .getResult(res => { this.generatedModel.moisture_level = res })

      .executeSubaction(action => action.provideResult(this.genPlateCount()), 1, 'generate planet plate count')
      .getResult(res => { this.generatedModel.plate_count = res })

      .executeSubaction(action => action.provideResult(this.genOceanicRate()), 1, 'generate planet oceanic rate')
      .getResult(res => { this.generatedModel.oceanic_rate = res })

      // .executeSubaction(action => action.provideResult(this.genPlanets()), 1, 'generate system planets')
      // .getResult(res => { this.generatedModel.planets = res })
  }

  genFromMinMax(min, max) {
    const rand = this.random.integerExclusive(min, max)
    return rand
  }


  genOrbitZone(overwriteModel = false) {
    if (!overwriteModel && this.props.model.orbit_zone != null) return this.props.model.orbit_zone
    return 'habit'
  }
  genType(overwriteModel = false) {
    const { orbit_zone } = this.generatedModel
    const { planets_matrices, types_distribution } = this.props.generator

    const zonePlanetsTypes = planets_matrices.filter(p => p[orbit_zone])
    const typesDistribution = zonePlanetsTypes.reduce((o, k) => {
      o[k.type] = types_distribution[k.type]
      return o
    }, {})

    const weighedList = this.generateWeighedList(typesDistribution)
    // const planet_type = random.elementFromArray(weighed_list)
    const rand = this.random.integerExclusive(0, weighedList.length)
    if (!overwriteModel && this.props.model.type != null) return this.props.model.type

    return weighedList[rand]
  }


  getGenerationMatrice() {
    if (this.matrice) return this.matrice

    const { type } = this.generatedModel
    if (type == null) throw new Error('matrice needs generated type before')

    const { planets_matrices } = this.props.generator
    const matrice = planets_matrices.find(m => m.type === type)
    this.matrice = matrice
    return matrice
  }


  // PLATE COUNT ===============================================================
  genPlateCount(overwriteModel = false) {
    const matrice = this.getGenerationMatrice()
    const rand = this.random.integerExclusive(matrice.plate_count.min, matrice.plate_count.max)
    if (!overwriteModel && this.props.model.plate_count != null) return this.props.model.plate_count

    return parseInt(rand)
  }


  // OCEANIC RATE ==============================================================
  genOceanicRate(overwriteModel = false) {
    const matrice = this.getGenerationMatrice()
    const rand = this.random.integerExclusive(matrice.oceanic_rate.min, matrice.oceanic_rate.max)
    if (!overwriteModel && this.props.model.oceanic_rate != null) return this.props.model.oceanic_rate

    return parseInt(rand)
  }


  // DETAIL LEVEL ==============================================================
  genDetailLevel(overwriteModel = false) {
    const matrice = this.getGenerationMatrice()
    const rand = this.random.integerExclusive(matrice.detail_level.min, matrice.detail_level.max)
    if (!overwriteModel && this.props.model.detail_level != null) return this.props.model.detail_level

    return parseInt(rand)
  }


  // DISTORTION LEVEL ==========================================================
  genDistortionLevel(overwriteModel = false) {
    const matrice = this.getGenerationMatrice()
    const rand = this.random.integerExclusive(matrice.distortion_level.min, matrice.distortion_level.max)
    if (!overwriteModel && this.props.model.distortion_level != null) return this.props.model.distortion_level

    return parseInt(rand)
  }


  // HEAT LEVEL ==============================================================
  genHeatLevel(overwriteModel = false) {
    const matrice = this.getGenerationMatrice()
    const rand = this.random.integerExclusive(matrice.heat_level.min, matrice.heat_level.max)
    if (!overwriteModel && this.props.model.heat_level != null) return this.props.model.heat_level

    return parseInt(rand)
  }


  // MOISTURE LEVEL ==============================================================
  genMoistureLevel(overwriteModel = false) {
    const matrice = this.getGenerationMatrice()
    const rand = this.random.integerExclusive(matrice.moisture_level.min, matrice.moisture_level.max)
    if (!overwriteModel && this.props.model.moisture_level != null) return this.props.model.moisture_level

    return parseInt(rand)
  }


  // MOONS COUNT ===============================================================
  genMoonsCount(overwriteModel = false) {
    // const { planets_distribution } = this.props.generator
    // const weighedList = this.generateWeighedList(planets_distribution)
    // const rand = this.random.integerExclusive(0, weighedList.length)
    const rand = this.random.integerExclusive(0, 5)
    if (!overwriteModel && this.props.model.moons_count != null) return this.props.model.moons_count

    return parseInt(rand)
  }


  // NAME ======================================================================
  genName(overwriteModel = false) {
    const rand = this.random.integerExclusive(10000, 99999)
    if (!overwriteModel && this.props.model.name != null) return this.props.model.name

    const { system_name, system_order } = this.props.model
    switch (true) {
      case (system_name != null && system_order != null): return `${system_name} ${this.getAlphabelArray()[system_order]}`
      case (system_order != null): return `unknown ${this.getAlphabelArray()[system_order]}`
      default: return `unknown ${rand}`
    }
  }
}

export default PlanetGenerator
