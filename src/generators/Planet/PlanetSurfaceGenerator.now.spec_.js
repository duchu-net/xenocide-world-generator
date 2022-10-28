// import expect from 'expect'
import assert from 'assert'
import PlanetSurfaceGenerator from './PlanetSurfaceGenerator'
import Star from '../Star'


describe('PlanetSurfaceGenerator: model', () => {
  describe('PlanetSurface', () => {
    it ('should generate mesh', async () => {
      const planet = new PlanetSurfaceGenerator({
        // evolution: false,
        subtype: 'earth'
      })
      await planet.generatePlanetSurface()
      // console.log(Object.keys(planet.planet))
      // await planet.generatePlanetTerrain()
      // console.log(Object.keys(planet.planet))

      await planet.generatePlanetBiomes()
      console.log(planet.planet.topology.tiles.map(t => t.biome).reduce((prev, curr) => {
        if (prev[curr] != null) prev[curr] += 1
        else prev[curr] = 1
        return prev
      }, {}));

      assert.ok(typeof planet == 'object')
    }).timeout(5000)
  })
})
