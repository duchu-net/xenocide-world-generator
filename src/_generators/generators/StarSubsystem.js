// import Vector3 from '../utils/Vector3'
import { Vector3, Matrix4, Quaternion } from 'three-math'
import { STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from '../CONSTANTS'
import Star from './Star'

class StarSubsystem {
  children = []

  get children() { return this._children }
  set children(children) { this._children = children }
  Children(children) {
    this.children = children
    return this
  }
  CalculateOverall() {
    this.mass = this.children.reduce((prev, curr) => {
      return prev + curr.mass
    }, 0)
    return this
  }

  // constructor(children) {
  //
  // }

  static buildTree(array, start, end) {
    if (end-start > 1) {
        const mid = (start+end)>>1;
        const left = StarSubsystem.buildTree(array, start, mid);
        const right = StarSubsystem.buildTree(array, mid, end);
        return new StarSubsystem()
          .Children([left, right])
          .CalculateOverall()
    } else {
        return array[start]
    }
  }

  static async Generate(stars, random) {
    // if (stars.length > 1) {
    //   const chunkStarsCount = random.next(2)
    // }
    const sub = StarSubsystem.buildTree(stars, 0, stars.length)
    return sub
    // return new StarSubsystem()
    //   .Children(StarSubsystem.buildTree(stars, 0, stars.length))
  }
}

export default StarSubsystem
