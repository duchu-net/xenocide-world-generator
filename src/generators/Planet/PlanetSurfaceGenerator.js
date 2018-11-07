import Planet3DGenerator from '../../_generators/Planet/Planet3DGenerator'
import SteppedAction from '../../utils/SteppedAction'
import Random from '../../utils/RandomObject'


class PlanetSurfaceGenerator {
  generator = {
    subdivisions: 5,
    distortionLevel: 100,

    plateCount: 7,
    oceanicRate: 70 / 100,
    heatLevel: 1 / 100 + 1,
    moistureLevel: 1 / 100 + 1,
  }
  evolution = true
  planet = {}

  constructor(props = {}) {
    Object.assign(this, props)
  }

  async generate() {
    // await this.generatePlanet()
  }

  p3dg = new Planet3DGenerator()
  async generatePlanetSurface() {
    const { subdivisions, distortionLevel } = this.generator
    let distortionRate = null
		if (distortionLevel < 0.25)
			distortionRate = this.adjustRange(distortionLevel, 0.00, 0.25, 0.000, 0.040)
		else if (distortionLevel < 0.50)
			distortionRate = this.adjustRange(distortionLevel, 0.25, 0.50, 0.040, 0.050)
		else if (distortionLevel < 0.75)
			distortionRate = this.adjustRange(distortionLevel, 0.50, 0.75, 0.050, 0.075)
		else
			distortionRate = this.adjustRange(distortionLevel, 0.75, 1.00, 0.075, 0.150)

    const action = new SteppedAction((action) => {
      console.log('progress', action.getCurrentActionName(), (action.getProgress() * 100).toFixed(2) + '%')
    })
    let random = new Random(12345)

    return new Promise((resolve) => {
      const planet = this.planet
      action
        .executeSubaction((action) => {
          this.p3dg.generatePlanetMesh(subdivisions, distortionRate, random.random, action);
        }, 6, "Generating Mesh")
        .getResult((result) => {
          // resolve(result)
          planet.mesh = result
        })

        .executeSubaction((action) => {
          this.p3dg.generatePlanetTopology(planet.mesh, action);
        }, 1, "Generating Topology")
        .getResult( (result) => {
          planet.topology = result;
        })

        .executeSubaction((action) => {
          this.p3dg.generatePlanetPartition(planet.topology.tiles, action);
        }, 1, "Generating Spatial Partitions")
        .getResult((result) => {
          planet.partition = result
          resolve(planet)
        })
      action.execute()
    })
  }

  // async generatePlanetTerrain() {
  //   const { plateCount, oceanicRate, heatLevel, moistureLevel } = this.generator
  //   const action = new SteppedAction((action) => {
  //     console.log('progress', action.getCurrentActionName(), (action.getProgress() * 100).toFixed(2) + '%')
  //   })
  //   let random = (new Random(12345)).random
  //
  //   return new Promise((resolve) => {
  //     const planet = this.planet
  //     action
  //       .executeSubaction( (action) => {
  //         this.p3dg.generatePlanetTectonicPlates(planet.topology, plateCount, oceanicRate, random, action);
  //       }, 3, "Generating Tectonic Plates")
  //       .getResult( (result) => {
  //         planet.plates = result;
  //       })
  //       .executeSubaction( (action) => {
  //         this.p3dg.generatePlanetElevation(planet.topology, planet.plates, action);
  //       }, 4, "Generating Elevation")
  //       .executeSubaction( (action) => {
  //         this.p3dg.generatePlanetWeather(planet.topology, planet.partition, heatLevel, moistureLevel, random, action);
  //       }, 16, "Generating Weather")
  //       // .executeSubaction( (action) => {
  //       //   // this.p3dg.generatePlanetBiomes(planet.topology.tiles, 1000, action);
  //       //   // PlanetSurfaceGenerator.EarthPlanet(planet.topology.tiles, { evolution: false })
  //       //   // PlanetSurfaceGenerator.GasGiantPlanet(planet.topology.tiles, { evolution: false })
  //       //   // this.generatePlanetBiomes()
  //       // }, 1, "Generating Biomes")
  //       .getResult((result) => {
  //         // planet.mesh = result
  //         resolve(planet)
  //       })
  //     action.execute()
  //   })
  // }

  async generatePlanetBiomes() {
    const { subtype } = this
    // const TOPOLOGIES = PlanetSurfaceGenerator.PLANET_TOPOLOGIES
    const topology = PlanetSurfaceGenerator.getTopology(subtype)
    if (!topology) return

    const opts = {
      ...this.generator,
      p3dg: this.p3dg,
      evolution: this.evolution,
    }
    if (Array.isArray(topology.modyficators)) {
      // const tiles = this.planet.topology.tiles
      for (const mod of topology.modyficators) {
        await mod(this.planet, opts)
      }
    }
  }



  static PLANET_TOPOLOGIES = [
    { subtype: 'earth',      modyficators: [PlanetSurfaceGenerator.TerrestialPlanet, PlanetSurfaceGenerator.EarthPlanet] },
    { subtype: 'lava',       modyficators: [PlanetSurfaceGenerator.TerrestialPlanet, PlanetSurfaceGenerator.LavaPlanet] },
    { subtype: 'barren',     modyficators: [PlanetSurfaceGenerator.TerrestialPlanet, PlanetSurfaceGenerator.BarrenPlanet] },
    { subtype: 'gas_giant',  modyficators: [PlanetSurfaceGenerator.GasGiantPlanet] },
    { subtype: 'ice_giant',  modyficators: [PlanetSurfaceGenerator.IceGiantPlanet] },
  ]
  static getTopology(subtype) {
    return PlanetSurfaceGenerator.PLANET_TOPOLOGIES
      .find(item => item.subtype = subtype)
  }

  static async TerrestialPlanet(planet, props) {
    const {
      p3dg,
      plateCount,
      oceanicRate,
      heatLevel,
      moistureLevel
    } = props

    const action = new SteppedAction((action) => {
      console.log('progress', action.getCurrentActionName(), (action.getProgress() * 100).toFixed(2) + '%')
    })
    let random = (new Random(12345)).random

    return new Promise((resolve) => {
      action
        .executeSubaction( (action) => {
          p3dg.generatePlanetTectonicPlates(planet.topology, plateCount, oceanicRate, random, action);
        }, 3, "Generating Tectonic Plates")
        .getResult( (result) => {
          planet.plates = result;
        })
        .executeSubaction( (action) => {
          p3dg.generatePlanetElevation(planet.topology, planet.plates, action);
        }, 4, "Generating Elevation")
        .executeSubaction( (action) => {
          p3dg.generatePlanetWeather(planet.topology, planet.partition, heatLevel, moistureLevel, random, action);
        }, 16, "Generating Weather")
        // .executeSubaction( (action) => {
        //   // this.p3dg.generatePlanetBiomes(planet.topology.tiles, 1000, action);
        //   // PlanetSurfaceGenerator.EarthPlanet(planet.topology.tiles, { evolution: false })
        //   // PlanetSurfaceGenerator.GasGiantPlanet(planet.topology.tiles, { evolution: false })
        //   // this.generatePlanetBiomes()
        // }, 1, "Generating Biomes")
        .getResult((result) => {
          // planet.mesh = result
          resolve(planet)
        })
      action.execute()
    })
  }

  static async GasGiantPlanet(planet, props) {
    const tiles = planet.topology.tiles
    const {
      planetRadius = 1000,
    } = props

    for (let i=0; i<tiles.length; i++) {
      const tile = tiles[i]
  		const latitude = Math.abs(tile.position.y / planetRadius)

      if (latitude > .6) {
        tile.biome = 'ggs1'
      } else if (latitude > .2) {
        tile.biome = 'ggs2'
      } else {
        tile.biome = 'ggs3'
      }
    }
  }

  static async IceGiantPlanet(planet, props) {
    const tiles = planet.topology.tiles
    const {
      planetRadius = 1000,
    } = props

    for (let i=0; i<tiles.length; i++) {
      const tile = tiles[i]
  		const latitude = Math.abs(tile.position.y / planetRadius)

      if (latitude > .6) {
        tile.biome = 'igs1'
      } else if (latitude > .2) {
        tile.biome = 'igs2'
      } else {
        tile.biome = 'igs3'
      }
    }
  }

  static async LavaPlanet(planet, props) {
    const tiles = planet.topology.tiles
    const {
      planetRadius = 1000,
    } = props
    // TODO
  }

  static async BarrenPlanet(planet, props) {
    const tiles = planet.topology.tiles
    const {
      planetRadius = 1000,
    } = props
    // TODO
  }

  static async EarthPlanet(planet, props = {}) {
    const tiles = planet.topology.tiles
    const {
      planetRadius = 1000,
      evolution = true,
    } = props

    for (let i=0; i<tiles.length; i++) {
      const tile = tiles[i];
  		const elevation = Math.max(0, tile.elevation);
  		const latitude = Math.abs(tile.position.y / planetRadius);
  		const temperature = tile.temperature;
  		const moisture = tile.moisture;

      if (elevation <= 0){
  			if (temperature > 0){
  				tile.biome = "ocean";
  			} else{
  				tile.biome = "oceanGlacier";
  			}
  		} else if (elevation < 0.6){
  			if (temperature > 0.75){
  				if (moisture < 0.25 || !evolution){
  					tile.biome = "desert";
  				} else{
  					tile.biome = "rainForest";
  				}
  			} else if (temperature > 0.5){
  				if (moisture < 0.25 || !evolution){
  					tile.biome = "rocky";
  				} else if (moisture < 0.50){
  					tile.biome = "plains";
  				} else{
  					tile.biome = "swamp";
  				}
  			} else if (temperature > 0){
          if (!evolution) {
            tile.biome = 'rocky'
          } else if (moisture < 0.25){
  					tile.biome = "plains";
  				} else if (moisture < 0.50){
  					tile.biome = "grassland";
  				} else{
  					tile.biome = "deciduousForest";
  				}
  			} else{
  				if (moisture < 0.25 && evolution){
  					tile.biome = "tundra";
  				} else{
  					tile.biome = "landGlacier";
  				}
  			}
  		} else if (elevation < 0.8){
        if (!evolution) {
          tile.biome = 'rocky'
        } else if (temperature > 0){
  				if (moisture < 0.25){
  					tile.biome = "tundra";
  				} else{
  					tile.biome = "coniferForest";
  				}
  			} else{
  				tile.biome = "tundra";
  			}
  		} else{
  			if (temperature > 0 || moisture < 0.25){
  				tile.biome = "mountain";
  			} else{
  				tile.biome = "snowyMountain";
  			}
  		}
    }
  }


  adjustRange(value, oldMin, oldMax, newMin, newMax){
    return (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin;
  }


  static async Generate(random, opts) {
    const surface = new PlanetSurfaceGenerator()
  }
}

export default PlanetSurfaceGenerator
