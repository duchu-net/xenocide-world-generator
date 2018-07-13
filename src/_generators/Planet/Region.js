import React from 'react'
import SphereModel from '../SphereModel'
import Model from '../Model'
import * as THREE from 'three-math'


class Region extends Model {
  static defaultProps = {
    region: {
    },
    tile: null,
    corners: [],
    radius: 0.5,
  }

  constructor(props) {
    super(props)
  }

  getBasicColor() {
    const { region } = this.props
    // console.log(region);
    return new THREE.Color(0x44DD00)
  }

  renderRegion() {
    const { tile } = this.props
    if (!tile) return

    const basicColor = this.getBasicColor()

    // const meshProps = { ...this.getMeshProps(), color: 0x00cc00 }
    const meshProps = {
      color: basicColor,
      // opacity: .6,
      // ambient: new THREE.Color(0xFFFFFF),
      vertexColors: THREE.VertexColors,
      // linewidth: 1,
      // side: THREE.BackSide,
    }

    const faces = []
    const vertices = []
    const baseIndex = vertices.length
    // vertices.push(tile.averagePosition)
    const terrainColors = []

    for (let j = 0; j < tile.corners.length; ++j) {
      const cornerPosition = tile.corners[j].position;
      vertices.push(cornerPosition);
      // vertices.push(tile.averagePosition.clone().sub(cornerPosition).multiplyScalar(0.1).add(cornerPosition));
      vertices.push(tile.averagePosition);

      var i0 = j * 2;
      var i1 = ((j + 1) % tile.corners.length) * 2;
      this.buildTileWedge(faces, baseIndex, i0, i1, tile.normal);

      const terrainColor = new THREE.Color(0x44DD00)
      this.buildTileWedgeColors(terrainColors, terrainColor, terrainColor.clone().multiplyScalar(0.5))
      // // this.buildTileWedgeColors(plateColors, plateColor, plateColor.clone().multiplyScalar(0.5));
      // // this.buildTileWedgeColors(elevationColors, elevationColor, elevationColor.clone().multiplyScalar(0.5));
      // // this.buildTileWedgeColors(temperatureColors, temperatureColor, temperatureColor.clone().multiplyScalar(0.5));
      // // this.buildTileWedgeColors(moistureColors, moistureColor, moistureColor.clone().multiplyScalar(0.5));
      for (let k = faces.length - 3; k < faces.length; ++k) {
        faces[k].vertexColors = terrainColors[k];
      }
    }
    // CLOSE GEOMETRY
    // vertices.push(tile.corners[0].position)

    return (
      <mesh>
        <geometry vertices={vertices} faces={faces} />
        <meshBasicMaterial {...meshProps}/>
      </mesh>
    )
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
  buildTileWedgeColors(f, c, bc){
  	f.push([c, c, c]);
  	f.push([bc, bc, c]);
  	f.push([bc, c, c]);
  }



  render() {
    const meshProps = {
      color: 0xee0000
    }
    const sphereProps = {

    }
    // console.log(this);

    return (
      <object3D>
        {this.renderRegion()}
        {/* <mesh>
          <sphereGeometry {...sphereProps} />
          <meshBasicMaterial {...meshProps}/>
        </mesh> */}
      </object3D>
    )
  }
}

export default Region
