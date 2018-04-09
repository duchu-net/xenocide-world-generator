
class Group {
  seed = null

  randomSeed() {}
  randomName() {}

  getValues(...args) {
    const ret = {}
    args.map(a => {
      if (this[a] == null) throw { [a]: 'not set' }
      ret[a] = this[a]
    })
    return ret
  }
}

export default Group
