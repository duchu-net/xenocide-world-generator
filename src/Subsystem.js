
class Subsystem {
  seed = null
  type = null // one of ['SINGLE_STAR', 'BINARY_P_STAR']

  celestial_bodys = []

  setStars(stars) {
    this.celestial_bodys = [...stars, ...this.celestial_bodys]
  }
  

  getValues(...args) {
    const ret = {}
    args.map(a => {
      if (this[a] == null) throw { [a]: 'not set' }
      ret[a] = this[a]
    })
    return ret
  }
}

export default Subsystem
