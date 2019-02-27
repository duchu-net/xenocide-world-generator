class ShapeStar {
  constructor(props = {}) {
    Object.assign(this, props)
  }

  Offset(offset) {
    this.position.add(offset)
    return this
  }

  Swirl(axis, amount) {
    var d = this.position.length()
    var angle = Math.pow(d, 0.1) * amount
    this.position.applyAxisAngle(axis, angle)
    return this
  }
}

export default ShapeStar
