import Star from './Star'
import Planet from './Planet'
import AsteroidBelt from './AsteroidBelt'

class CelestialObjectFactory {
  constructor(obj) {
    if (obj.type) throw 'CelestialObject must contain type value'
    switch (obj.type) {
      case 'STAR': return new Star(obj)
      case 'PLANET': return new Planet(obj)
      case 'ASTEROID_BELT': return new AsteroidBelt(obj)
    }
  }
}

export default CelestialObjectFactory
