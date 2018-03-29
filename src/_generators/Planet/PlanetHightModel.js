import React from 'react'
import SphereModel from '../SphereModel'
import * as THREE from 'three'
import Planet3DGenerator from './Planet3DGenerator'
import Region from './Region'

import { hashString } from './helpers/functions'
import XorShift128 from './helpers/xor-shift128'

// const geometry = new THREE.SphereGeometry(this.getRadius() * this.scale, 16, 16);
// const sphere = new THREE.Mesh(geometry, this.material);

class PlanetHightModel extends SphereModel {
  static defaultProps = {
    planet: {
      from_star: 0,
    },
    scale: 1 / 1900,
    radius: 0.5,
  }
  state = {
    planet: null,
  }
  generator = null
  _tiles = []
  _vertices = []
  _faces = []

  constructor(props, context) {
    super(props, context)

    this.generator = new Planet3DGenerator()
    console.log('from_star', props.planet.from_star);

    const originalSeed = props.planet.seed
    let seed;
		if (typeof (originalSeed) === "number")
			seed = originalSeed;
		else if (typeof (originalSeed) === "string")
			seed = hashString(originalSeed);
		else
			seed = Date.now();
		this.random = new XorShift128(seed);

    // TODO
    // if (props.planet.from_star == 1)
    this.generator.generatePlanetAsynchronous()
      .then(planet => {
        // console.warn('------->>', pla)
        this.generateRenderData(planet)
        this.setState({ planet })
      })
  }

  generateRenderData(planet) {
    const { tiles } = planet.topology
    this._tiles = tiles

    const vertices = this._vertices = []
    const faces = this._faces = []
    const terrainColors = []

    tiles.forEach(tile => {
      const baseIndex = vertices.length
      vertices.push(tile.averagePosition)
      for (let j = 0; j < tile.corners.length; ++j) {
        const cornerPosition = tile.corners[j].position;
        vertices.push(cornerPosition);
        // vertices.push(tile.averagePosition.clone().sub(cornerPosition).multiplyScalar(0.1).add(cornerPosition));
        vertices.push(tile.averagePosition);

        var i0 = j * 2;
        var i1 = ((j + 1) % tile.corners.length) * 2;
        this.buildTileWedge(faces, baseIndex, i0, i1, tile.normal);

        const terrainColor = new THREE.Color(0xFF00FF)
        this.buildTileWedgeColors(terrainColors, terrainColor, terrainColor.clone().multiplyScalar(0.5))
        // this.buildTileWedgeColors(plateColors, plateColor, plateColor.clone().multiplyScalar(0.5));
        // this.buildTileWedgeColors(elevationColors, elevationColor, elevationColor.clone().multiplyScalar(0.5));
        // this.buildTileWedgeColors(temperatureColors, temperatureColor, temperatureColor.clone().multiplyScalar(0.5));
        // this.buildTileWedgeColors(moistureColors, moistureColor, moistureColor.clone().multiplyScalar(0.5));
        // console.log(terrainColors);
        for (let k = faces.length - 3; k < faces.length; ++k) {
          faces[k].vertexColors = terrainColors[k];
        }
      }
    })
  }

  getRadius() {
    return 0.4 // this.props.radius
  }
  getBiomeColor(biome, tile) {
    // const biomes = {
    //   ocean: [],
    //   oceanGlacier: [],
    //   desert: [],
    //   rainForest: [],
    //   rocky: [],
    //   plains: [],
    //   grassland: [],
    //   swamp: [],
    //   deciduousForest: [],
    //   tundra: [],
    //   landGlacier: [],
    //   tundra: [],
    //   landGlacier: [],
    //   coniferForest: [],
    //   snow: [],
    //   mountain: [],
    //   snowyMountain: [],
    // }
    const { random } = this
    const colorDeviance = new THREE.Color(random.unit(), random.unit(), random.unit())
    let terrainColor

		if (tile.elevation <= 0) {
			const normalizedElevation = Math.min(-tile.elevation, 1)
			if (tile.biome === "ocean")
				terrainColor = new THREE.Color(0x0066FF).lerp(new THREE.Color(0x0044BB), Math.min(-tile.elevation, 1)).lerp(colorDeviance, 0.10)
			else if (tile.biome === "oceanGlacier")
				terrainColor = new THREE.Color(0xDDEEFF).lerp(colorDeviance, 0.10)
			else
				terrainColor = new THREE.Color(0xFF00FF)
		} else if (tile.elevation < 0.6) {
			const normalizedElevation = tile.elevation / 0.6
			if (tile.biome === "desert")
				terrainColor = new THREE.Color(0xDDDD77).lerp(new THREE.Color(0xBBBB55), normalizedElevation).lerp(colorDeviance, 0.10)
			else if (tile.biome === "rainForest")
				terrainColor = new THREE.Color(0x44DD00).lerp(new THREE.Color(0x229900), normalizedElevation).lerp(colorDeviance, 0.20)
			else if (tile.biome === "rocky")
				terrainColor = new THREE.Color(0xAA9977).lerp(new THREE.Color(0x887755), normalizedElevation).lerp(colorDeviance, 0.15)
			else if (tile.biome === "plains")
				terrainColor = new THREE.Color(0x99BB44).lerp(new THREE.Color(0x667722), normalizedElevation).lerp(colorDeviance, 0.10)
			else if (tile.biome === "grassland")
				terrainColor = new THREE.Color(0x77CC44).lerp(new THREE.Color(0x448822), normalizedElevation).lerp(colorDeviance, 0.15)
			else if (tile.biome === "swamp")
				terrainColor = new THREE.Color(0x77AA44).lerp(new THREE.Color(0x446622), normalizedElevation).lerp(colorDeviance, 0.25)
			else if (tile.biome === "deciduousForest")
				terrainColor = new THREE.Color(0x33AA22).lerp(new THREE.Color(0x116600), normalizedElevation).lerp(colorDeviance, 0.10)
			else if (tile.biome === "tundra")
				terrainColor = new THREE.Color(0x9999AA).lerp(new THREE.Color(0x777788), normalizedElevation).lerp(colorDeviance, 0.15)
			else if (tile.biome === "landGlacier")
				terrainColor = new THREE.Color(0xDDEEFF).lerp(colorDeviance, 0.10)
			else
				terrainColor = new THREE.Color(0xFF00FF)
		} else if (tile.elevation < 0.8) {
			const normalizedElevation = (tile.elevation - 0.6) / 0.2
			if (tile.biome === "tundra")
				terrainColor = new THREE.Color(0x777788).lerp(new THREE.Color(0x666677), normalizedElevation).lerp(colorDeviance, 0.10)
			else if (tile.biome === "coniferForest")
				terrainColor = new THREE.Color(0x338822).lerp(new THREE.Color(0x116600), normalizedElevation).lerp(colorDeviance, 0.10)
			else if (tile.biome === "snow")
				terrainColor = new THREE.Color(0xEEEEEE).lerp(new THREE.Color(0xDDDDDD), normalizedElevation).lerp(colorDeviance, 0.10)
			else if (tile.biome === "mountain")
				terrainColor = new THREE.Color(0x555544).lerp(new THREE.Color(0x444433), normalizedElevation).lerp(colorDeviance, 0.05)
			else
				terrainColor = new THREE.Color(0xFF00FF)
		} else{
			const normalizedElevation = Math.min((tile.elevation - 0.8) / 0.5, 1)
			if (tile.biome === "mountain")
				terrainColor = new THREE.Color(0x444433).lerp(new THREE.Color(0x333322), normalizedElevation).lerp(colorDeviance, 0.05)
			else if (tile.biome === "snowyMountain")
				terrainColor = new THREE.Color(0xDDDDDD).lerp(new THREE.Color(0xFFFFFF), normalizedElevation).lerp(colorDeviance, 0.10)
			else
				terrainColor = new THREE.Color(0xFF00FF)
		}

    return terrainColor
  }

  renderRegions() {
    const { planet, scale } = this.props
    const tiles = this._tiles

    const newTiles = [tiles[0], tiles[1], tiles[2], tiles[1000], tiles[2000]]
    return (
      <object3D scale={this.getScaleVector()}>
        {newTiles.map((tile, i) => <Region tile={tile} key={`${planet.from_star}_region_${i}`} scale={scale} />)}
      </object3D>
    )
  }

  renderHightModel() {
    // const meshProps = { ...this.getMeshProps(), color: 0x00cc00 }
    const meshProps = {
      // color: new THREE.Color(0x0000ff),
      vertexColors: THREE.VertexColors,
      // opacity: .6,
      // ambient: new THREE.Color(0xFFFFFF),
      // side: THREE.BackSide,
    }
    const { scale } = this.props

    const vertices = this._vertices
    const faces = this._faces

    return (
      <mesh scale={this.getScaleVector()}>
        <geometry vertices={vertices} faces={faces} />
        <meshLambertMaterial {...meshProps}/>
      </mesh>
    )
  }

  getScaleVector() {
    const { scale } = this.props
    return new THREE.Vector3(scale, scale, scale)
  }

  buildTileWedge(f, b, s, t, n) {
    // COUNTER-CLOCKWISE FIX; Face3( a, b, c, normal, color, materialIndex )
  	f.push(new THREE.Face3(b + t + 2, b + s + 2, b, n))
  	f.push(new THREE.Face3(b + t + 1, b + s + 1, b + t + 2, n))
  	f.push(new THREE.Face3(b + t + 2, b + s + 1, b + s + 2, n))
  	// f.push(new THREE.Face3(b + s + 2, b + t + 2, b, n))
  	// f.push(new THREE.Face3(b + s + 1, b + t + 1, b + t + 2, n))
  	// f.push(new THREE.Face3(b + s + 1, b + t + 2, b + s + 2, n))
  }
  buildTileWedgeColors(f, c, bc) {
  	f.push([c, c, c]);
  	f.push([bc, bc, c]);
  	f.push([bc, c, c]);
  }

  render() {
    // console.error('render');
    const { planet } = this.state
    const sphereProps = this.getSphereProps()
    // sphereProps.radius = 1
    const meshProps = { ...this.getMeshProps(), color: 0xee0000 }

    return (
      <object3D>
        {planet
          ? this.renderHightModel()
          : (
            <mesh
              rotation={this.props.cubeRotation}
            >
              <sphereGeometry {...sphereProps} />
              <meshBasicMaterial {...meshProps}/>
            </mesh>
          )}
          {/* {this._tiles && this.renderRegions()} */}
      </object3D>
    )
  }
}

export default PlanetHightModel
