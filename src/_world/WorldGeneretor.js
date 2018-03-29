import Generator from '../generators/Generator'

const WORLD = {
  habitable_solar_masses: [0.5, 1.4], // can have terra like planet, but lifycycle is to short for evolution
  main_sequence_stars: [
    {
      class: 'O',
      fraction: 0.00003,
      solar_masses: [16, 50],
    },
    {
      class: 'B',
      fraction: 0.13,
      solar_masses: [2.1, 16],
    },
    {
      class: 'A',
      fraction: 0.6,
      solar_masses: [1.4, 2.1],
    },
    {
      class: 'F',
      fraction: 3,
      solar_masses: [1.04, 1.4],
    },
    {
      class: 'G',
      fraction: 7.6,
      solar_masses: [0.8, 1.04],
    },
    {
      class: 'K',
      fraction: 12.1,
      solar_masses: [0.45, 0.8],
    },
    {
      class: 'M',
      fraction: 76.45,
      solar_masses: [0.08, 0.45],
    },
  ]
}


class WorldGenerator extends Generator {
  // GENERATION ================================================================
  steppedGeneration(action) {
    return action
      // .executeSubaction(action => this.generationStep(action, () => this.genName()), 1, 'generate galaxy name')
      .executeSubaction(action => action.provideResult(this.genName()), 1, 'generate galaxy name')
      .getResult(res => { this.generatedModel.name = res })

      // // .executeSubaction(action => this.generationStep(action, () => this.genClassification()), 1, 'generate galaxy classification')
      // .executeSubaction(action => action.provideResult(this.genClassification()), 1, 'generate galaxy classification')
      // .getResult(res => { this.generatedModel.classification = res })
      //
      // // .executeSubaction(action => this.generationStep(action, () => this.genAge()), 1, 'generate galaxy age')
      // .executeSubaction(action => action.provideResult(this.genAge()), 1, 'generate galaxy age')
      // .getResult(res => { this.generatedModel.age = res })
      //
      // .executeSubaction(action => action.provideResult(this.genConstelationsCount()), 1, 'generate galaxy constelations count')
      // .getResult(res => { this.generatedModel.constelations_count = res })
      //
      // .executeSubaction(action => this.genConstelations(action), 2, 'generate galaxy constelations count')
      // .getResult(res => { this.generatedModel.constelations = res })
      //
      // .executeSubaction(action => this.genSystems(action), 15, 'generate galaxy systems')
      // .getResult(res => { this.generatedModel.systems = res })
  }
}

export default WorldGenerator
