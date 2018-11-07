
class Generator {
  static defaultProps = {
    seed: null,
  }
  constructor(props = {}) {
    this.props = { ...this.constructor.defaultProps, ...props }
    this.model = {
      seed: null,
    }
  }

  getSeed() {
    const originalSeed = this.props.seed || this.model.seed
		let seed = null
		if (typeof (originalSeed) === "number")
			seed = originalSeed
		else if (typeof (originalSeed) === "string")
			seed = this.hashString(originalSeed)
		else
			seed = Date.now()
    return seed
		// const random = new XorShift128(seed)
  }

  hashString(s) {
    let hash = 0
    const length = s.length
    if (length === 0)
      return hash
    for (let i = 0; i < length; ++i) {
      const character = s.charCodeAt(1)
      hash = ((hash << 5) - hash) + character
      // hash = hash & hash
      hash |= 0
    }
    return hash
  }
}

export default Generator
