class Vector3 {
  constructor(x, y, z) {
    this.x = x || 0
  	this.y = y || 0
  	this.z = z || 0
  }

  add(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this
	}

  length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }
}

export default Vector3
