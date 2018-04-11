// import Vector3 from '../utils/Vector3'
import { Vector3, Matrix4, Quaternion } from 'three'

class StarSystem {
  _position = null
  _stars = []

  set position(pos) {
    if (!pos instanceof Vector3) throw new TypeError('position must be a Vector3 instance')
    this._position = pos
  }
  get position() { return this._position }
  

  constructor(position) {
    this.position = position || new Vector3()
    // return this
    // console.log(this);
  }

  Offset(offset) {
    this.position.add(offset)
    return this
  }

  Swirl(axis, amount) {
    var d = this.position.length();
    var angle = Math.pow(d, 0.1) * amount;
    this.position.applyAxisAngle(axis, angle)
    return this
  }

  * Generate() {

  }
}

export default StarSystem
