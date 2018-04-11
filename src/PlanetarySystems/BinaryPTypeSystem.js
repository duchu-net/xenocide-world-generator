import ClassicSystem from './ClassicSystem'

class BinaryPTypeSystem extends ClassicSystem {
  stars_count = 2
  // shape = 'SP'

  generateStars() {
    const stars = ['star1', 'star2']
    this.setStars(stars)
  }
}

export default BinaryPTypeSystem
