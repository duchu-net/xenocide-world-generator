import Generator from '../Generator'
import GALAXY from './GalaxyConstants'
import { SystemGenerator } from '../System'
// import XorShift128 from './helpers/xor-shift128'


class GalaxyGenerator extends Generator {
  getDefaultProps() {
    return {
      model: {
        age: null,
        seed: null,
        name: null,
        constelations: null,
        classification: null,
        constelations_count: null,
        position: null, // { x: 0, y: 0, z: 0 }
      },
      generator: {
        classifications: GALAXY.CLASSIFICATIONS_SHAPES,
        constelations: GALAXY.CONSTELATIONS_NAMES,
        ages: GALAXY.AGES_RANGES,
        constelation_systems_count: { min: 50, max: 250 },
      },
    }
  }


  constructor(props) {
    super(props)
    this.generatedModel = {
      position: { x: 0, y: 0, z: 0 },
    }
    this.random = null

    this.genSeed()
  }


  // GENERATION ================================================================
  steppedGeneration(action) {
    return action
      // .executeSubaction(action => this.generationStep(action, () => this.genName()), 1, 'generate galaxy name')
      .executeSubaction(action => action.provideResult(this.genName()), 1, 'generate galaxy name')
      .getResult(res => { this.generatedModel.name = res })

      // .executeSubaction(action => this.generationStep(action, () => this.genClassification()), 1, 'generate galaxy classification')
      .executeSubaction(action => action.provideResult(this.genClassification()), 1, 'generate galaxy classification')
      .getResult(res => { this.generatedModel.classification = res })

      // .executeSubaction(action => this.generationStep(action, () => this.genAge()), 1, 'generate galaxy age')
      .executeSubaction(action => action.provideResult(this.genAge()), 1, 'generate galaxy age')
      .getResult(res => { this.generatedModel.age = res })

      .executeSubaction(action => action.provideResult(this.genConstelationsCount()), 1, 'generate galaxy constelations count')
      .getResult(res => { this.generatedModel.constelations_count = res })

      .executeSubaction(action => this.genConstelations(action), 2, 'generate galaxy constelations count')
      .getResult(res => { this.generatedModel.constelations = res })

      .executeSubaction(action => this.genSystems(action), 15, 'generate galaxy systems')
      .getResult(res => { this.generatedModel.systems = res })
  }

  // generationStep = (action, execute) => {
  //   let result
  //   return action
  //     .executeSubaction(action => { result = execute() }, 1)
  //     .provideResult(result)
  // }


  // SYSTEMS ===================================================================
  genSystems(action) {
    const { constelations = [] } = this.generatedModel

    let systems = []

    let i = 0
    action
      .executeSubaction(action => {
        if (i >= constelations.length) return

        const constelation = constelations[i]
        action
          .executeSubaction(action => {
            this.genConstelationsSystems(action, constelation)
          })
          .getResult(res => systems = [ ...systems, ...res ])

        ++i
        action.loop(i / constelations.length)
      })
      .provideResult(() => systems)
  }

  genConstelationsSystems(action, constelation) {
    const systems = []
    let i = 0
    return action
      .executeSubaction(action => {
        if (i >= constelation.systems_count) return

        const system = new SystemGenerator({
          model: {
            // SEED ISN't usses because we pass this.random for generator
            // WRONG!
            // seed: `${i}_${constelation.seed}_${i}_${constelation.name}`,
            // GOOD! md5 give very different hashes for similar strings
            // seed: hashes.md5(`${constelation.seed}_${i}`),
            constelation_name: constelation.name,
            constelation_order: i,
          }
        }, this.random)

        action
          .executeSubaction(action => system.generate(action))
          .getResult(res => {
            // console.log(res);
            systems.push(res)
          })

        ++i
        action.loop(i / constelation.systems_count)
      })
      .provideResult(() => systems)
  }


  // CONSTELATIONS =============================================================
  genConstelations(action) {
    const { constelations_count } = this.generatedModel
    const { constelations, constelation_systems_count } = this.props.generator
    let genConstelations = []

    let availableConstelations = [ ...constelations ]

    let i = 0
    action
      .executeSubaction(action => {
        if (i >= constelations_count) return

        const nameRand = this.random.integerExclusive(0, availableConstelations.length)
        const name = availableConstelations[nameRand]
        const systemsCount = this.random.integerExclusive(constelation_systems_count.min, constelation_systems_count.max)

        genConstelations.push({
          name: name,
          is_generated: false,
          systems_count: systemsCount,
          // seed: `${name}_${systemsCount}`,
          // position: { x: 0, y: 0, z: 0 },
        })

        ++i
        availableConstelations.splice(nameRand, 1)
        action.loop(i / constelations_count)
      }, 1)
      .provideResult(genConstelations)
  }


  // CONSTELATIONS COUNT =======================================================
  genConstelationsCount(overwriteModel = false) {
    const { constelations } = this.props.generator
    // const rand = this.random.integerExclusive(constelations.length - 25, constelations.length)
    const rand = this.random.integerExclusive(25, constelations.length)
    if (!overwriteModel && this.props.model.constelations_count != null) return this.props.model.constelations_count

    return rand
  }


  // NAME ======================================================================
  genName(overwriteModel = false) {
    const rand = this.random.integerExclusive(0, 999)
    if (!overwriteModel && this.props.model.name != null) return this.props.model.name

    return `SG ${rand}`
  }


  // CLASSIFICATION ============================================================
  genClassification(overwriteModel = false) {
    const { classifications } = this.props.generator
    const rand = this.random.integerExclusive(0, classifications.length)
    if (!overwriteModel && this.props.model.classification != null) return this.props.model.classification

    return classifications[rand]
  }


  // AGE =======================================================================
  genAge(overwriteModel = false) {
    const { ages } = this.props.generator
    const rand = this.random.integerExclusive(0, ages.length)
    if (!overwriteModel && this.props.model.age != null) return this.props.model.age

    return ages[rand]
  }
}

export default GalaxyGenerator
