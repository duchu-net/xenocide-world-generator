class XorShift128{
	constructor(x, y, z, w){
		this.x = (x ? x >>> 0 : 123456789)
		this.y = (y ? y >>> 0 : 362436069)
		this.z = (z ? z >>> 0 : 521288629)
		this.w = (w ? w >>> 0 : 88675123)
	}


	next(){
		var t = this.x ^ (this.x << 11) & 0x7FFFFFFF
		this.x = this.y
		this.y = this.z
		this.z = this.w
		this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8))
		return this.w
	}

	unit(){
		return this.next() / 0x80000000
	}

	unitInclusive(){
		return this.next() / 0x7FFFFFFF
	}

	integer(min, max){
		return this.integerExclusive(min, max + 1)
	}

	integerExclusive(min, max){
		min = Math.floor(min)
		max = Math.floor(max)
		return Math.floor(this.unit() * (max - min)) + min
	}

	real(min, max){
		return this.unit() * (max - min) + min
	}

	realInclusive(min, max){
		return this.unitInclusive() * (max - min) + min
	}

	reseed(x, y, z, w){
		this.x = (x ? x >>> 0 : 123456789)
		this.y = (y ? y >>> 0 : 362436069)
		this.z = (z ? z >>> 0 : 521288629)
		this.w = (w ? w >>> 0 : 88675123)
	}
}

export default XorShift128
