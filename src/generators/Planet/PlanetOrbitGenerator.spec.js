// import expect from 'expect'
import assert from 'assert'
import PlanetOrbitGenerator from './PlanetOrbitGenerator'
import Star from '../Star'



describe('PlanetOrbitGenerator: model', () => {
  describe('PlanetOrbit asynchronous', () => {
    it ('should generate system orbit', async () => {
      // const star = new Star({ mass: 1 })
      const result = await PlanetOrbitGenerator.Generate({
        prefer_habitable: true,
        star: new Star({ mass: 1 }),
      })
      // console.log(result)
      console.log(result.orbits.map(o=>o.type))
      // console.log(result.topology)
      // console.log(result.planets_count)
      // console.log(result.toJson());
      // console.log(star.mass, star.ms_class, star.evolution);
      assert.ok(typeof result == 'object')
    }).timeout(1000)

    it ('should generate system orbit', async () => {
      // const star = new Star({ mass: 1 })
      const result = new PlanetOrbitGenerator({
        // topology: 'hot_jupiter_habitable_moon', //orbit topology
        // topology: 'classic',
        // seed: 12345,
        prefer_habitable: true,
        star: new Star({ mass: .4 }),
      })
      // console.log(result)
      // console.log(result.toJson());
      for (const orbit of result.generateOrbits()) {
        // console.log('orbit', orbit.type);
      }
      console.log(result.orbits.map(o=>o.type))
      // console.log(result.topology)
      // console.log(result.planets_count)
      // console.log(result.star.subtype, result.star.evolution)
      // console.log(result.orbits.map())
      // console.log(star.mass, star.ms_class, star.evolution);
      assert.ok(typeof result == 'object')
    }).timeout(1000)
  })

})
