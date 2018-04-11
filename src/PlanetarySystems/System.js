import Subsystem from './Subsystem'

class System {
  stars_count = 1
  stars = []
  planets = []

  schema = null

  generate() {
    return Promise.resolve()
      .then(() => this.generateStars())
      .then(() => this.generatePlanets())
      .then(() => this)
      .catch(err => console.log('SYSTEM GENERATION ERROR', err))
  }

  generateStars() {}
  generatePlanets() {}

  setStars(stars) {
    if (!Array.isArray(stars)) throw new Error('stars must be an array')
    this.stars = stars
    this.fillBodies()
  }
  setPlanets(planets) {
    if (!Array.isArray(planets)) throw new Error('planets must be an array')
    this.planets = planets
    this.fillBodies()
  }
  fillBodies() {
    this.bodies = [...this.stars, ...this.planets]
    this.fillSchema()
  }

  fillSchema() {
    this.schema = new Subsystem(this.bodies)
  }
}

export default System
