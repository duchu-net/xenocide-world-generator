import System from './System'

class ClassicSystem extends System {
  stars_count = 1

  generateStars() {
    const stars = ['star']
    this.setStars(stars)
  }
  generatePlanets() {
    const planets = ['planet1','planet2','planet3']
    this.setPlanets(planets)
  }
}

export default ClassicSystem
