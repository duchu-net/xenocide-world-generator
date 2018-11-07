// import { objects, random as randomUtils, SteppedAction } from 'duchunet-utils'
import * as objects from '../utils/objects'
import XorShift128 from '../utils/XorShift128'
import SteppedAction from '../utils/SteppedAction'


class Generator {
  getDefaultProps() {
    return {
      ...this.constructor.defaultProps,
      model: {},
    }
  }

  constructor(props = {}, random) {
    this.props = objects.assignDeep({}, this.getDefaultProps(), props)
    console.log(this.props);
    this.generatedModel = objects.assignDeep({}, this.getDefaultProps().model, props.model)

    this.multiple_factor = 10

    if (random != null) this.random = random
    // if (random == null) this.genSeed()
    // else this.random = random
  }

  genSeed() {
    const originalSeed = this.props.model.seed
    this.generatedModel.seed = originalSeed

		let seed = null
		if (typeof (originalSeed) === "number")
			seed = originalSeed
		else if (typeof (originalSeed) === "string")
			seed = objects.hashString(originalSeed)
		else {
      seed = Date.now()
      this.generatedModel.seed = seed
    }
    this.intSeed = seed
		this.random = new XorShift128(seed)
  }


  generate(action) {
    let selfExecute = false
    if (action == null) {
      selfExecute = true
      action = new SteppedAction()
    }


    action = this.steppedGeneration(action)
      .provideResult(() => this.generatedModel)

    if (selfExecute) return this.promiseFromStepped(action)
    return action
  }

  generateWeighedList(distributionMap) {
    const sizes = Object.keys(distributionMap)
    const weighed_list = [];

    sizes.forEach(size => {
      const multiples = distributionMap[size] * this.multiple_factor // .2 * 10 = 2 ;)
      for (let i = 0; i < multiples; i++) weighed_list.push(size)
    })
    return weighed_list;
  }

  getAlphabelArray() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    return alphabet
  }

  promiseFromStepped(action) {
    return new Promise((resolve, reject) => {
      action
        .finalize(result => resolve(result), 0)
        .execute()
    })
  }
}

export default Generator
