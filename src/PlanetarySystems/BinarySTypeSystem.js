import System from './System'

class BinarySTypeSystem extends System {
  stars_count = 2
  stars = []
  planets = [[], []]

  generateStars() {
    const stars = ['star1', 'star2']
    this.setStars(stars)
  }
  generatePlanets() {
    const planets = ['planet1','planet2','planet3']
    this.setPlanets([[...planets], [...planets]])
  }

  fillBodies() {
    this.bodys = [
      [this.stars[0], ...this.planets[0]],
      [this.stars[1], ...this.planets[1]]
    ]
  }
}

export default BinarySTypeSystem
