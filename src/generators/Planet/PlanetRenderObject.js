import * as THREE from 'three'


class PlanetRenderObject {
  constructor() {

  }

  static BIOME_COLORS = [
    { biome: 'ocean', color: () => {}}
  ]

  static async TerranSurface(tiles, random) {
    var planetGeometry = new THREE.Geometry();
  	var terrainColors = [];
  	var plateColors = [];
  	var elevationColors = [];
  	var temperatureColors = [];
  	var moistureColors = [];

  	//$add player
  	var playerColors = [];
  	//

  	// var i = 0;
    for (let i=0; i<tiles.length; i++) {
      const tile = tiles[i]

      const colorDeviance = new THREE.Color(random.unit(), random.unit(), random.unit());
      let terrainColor

      if (tile.elevation <= 0){
        var normalizedElevation = Math.min(-tile.elevation, 1);
        if (tile.biome === "ocean")
          terrainColor = new THREE.Color(0x0066FF).lerp(new THREE.Color(0x0044BB), Math.min(-tile.elevation, 1)).lerp(colorDeviance, 0.10);
        else if (tile.biome === "oceanGlacier")
          terrainColor = new THREE.Color(0xDDEEFF).lerp(colorDeviance, 0.10);
        else
          terrainColor = new THREE.Color(0xFF00FF);
      } else if (tile.elevation < 0.6){
        var normalizedElevation = tile.elevation / 0.6;
        if (tile.biome === "desert")
          terrainColor = new THREE.Color(0xDDDD77).lerp(new THREE.Color(0xBBBB55), normalizedElevation).lerp(colorDeviance, 0.10);
        else if (tile.biome === "rainForest")
          terrainColor = new THREE.Color(0x44DD00).lerp(new THREE.Color(0x229900), normalizedElevation).lerp(colorDeviance, 0.20);
        else if (tile.biome === "rocky")
          terrainColor = new THREE.Color(0xAA9977).lerp(new THREE.Color(0x887755), normalizedElevation).lerp(colorDeviance, 0.15);
        else if (tile.biome === "plains")
          terrainColor = new THREE.Color(0x99BB44).lerp(new THREE.Color(0x667722), normalizedElevation).lerp(colorDeviance, 0.10);
        else if (tile.biome === "grassland")
          terrainColor = new THREE.Color(0x77CC44).lerp(new THREE.Color(0x448822), normalizedElevation).lerp(colorDeviance, 0.15);
        else if (tile.biome === "swamp")
          terrainColor = new THREE.Color(0x77AA44).lerp(new THREE.Color(0x446622), normalizedElevation).lerp(colorDeviance, 0.25);
        else if (tile.biome === "deciduousForest")
          terrainColor = new THREE.Color(0x33AA22).lerp(new THREE.Color(0x116600), normalizedElevation).lerp(colorDeviance, 0.10);
        else if (tile.biome === "tundra")
          terrainColor = new THREE.Color(0x9999AA).lerp(new THREE.Color(0x777788), normalizedElevation).lerp(colorDeviance, 0.15);
        else if (tile.biome === "landGlacier")
          terrainColor = new THREE.Color(0xDDEEFF).lerp(colorDeviance, 0.10);
        else
          terrainColor = new THREE.Color(0xFF00FF);
      } else if (tile.elevation < 0.8){
        var normalizedElevation = (tile.elevation - 0.6) / 0.2;
        if (tile.biome === "tundra")
          terrainColor = new THREE.Color(0x777788).lerp(new THREE.Color(0x666677), normalizedElevation).lerp(colorDeviance, 0.10);
        else if (tile.biome === "coniferForest")
          terrainColor = new THREE.Color(0x338822).lerp(new THREE.Color(0x116600), normalizedElevation).lerp(colorDeviance, 0.10);
        else if (tile.biome === "snow")
          terrainColor = new THREE.Color(0xEEEEEE).lerp(new THREE.Color(0xDDDDDD), normalizedElevation).lerp(colorDeviance, 0.10);
        else if (tile.biome === "mountain")
          terrainColor = new THREE.Color(0x555544).lerp(new THREE.Color(0x444433), normalizedElevation).lerp(colorDeviance, 0.05);
        else
          terrainColor = new THREE.Color(0xFF00FF);
      } else{
        var normalizedElevation = Math.min((tile.elevation - 0.8) / 0.5, 1);
        if (tile.biome === "mountain")
          terrainColor = new THREE.Color(0x444433).lerp(new THREE.Color(0x333322), normalizedElevation).lerp(colorDeviance, 0.05);
        else if (tile.biome === "snowyMountain")
          terrainColor = new THREE.Color(0xDDDDDD).lerp(new THREE.Color(0xFFFFFF), normalizedElevation).lerp(colorDeviance, 0.10);
        else
          terrainColor = new THREE.Color(0xFF00FF);
      }

      var plateColor = tile.plate.color.clone();

      var elevationColor;
      if (tile.elevation <= 0)
        elevationColor = new THREE.Color(0x224488).lerp(new THREE.Color(0xAADDFF), Math.max(0, Math.min((tile.elevation + 3 / 4) / (3 / 4), 1)));
      else if (tile.elevation < 0.75)
        elevationColor = new THREE.Color(0x997755).lerp(new THREE.Color(0x553311), Math.max(0, Math.min((tile.elevation) / (3 / 4), 1)));
      else
        elevationColor = new THREE.Color(0x553311).lerp(new THREE.Color(0x222222), Math.max(0, Math.min((tile.elevation - 3 / 4) / (1 / 2), 1)));

      var temperatureColor;
      if (tile.temperature <= 0)
        temperatureColor = new THREE.Color(0x0000FF).lerp(new THREE.Color(0xBBDDFF), Math.max(0, Math.min((tile.temperature + 2 / 3) / (2 / 3), 1)));
      else
        temperatureColor = new THREE.Color(0xFFFF00).lerp(new THREE.Color(0xFF0000), Math.max(0, Math.min((tile.temperature) / (3 / 3), 1)));

      var moistureColor = new THREE.Color(0xFFCC00).lerp(new THREE.Color(0x0066FF), Math.max(0, Math.min(tile.moisture, 1)));


      var baseIndex = planetGeometry.vertices.length;
      planetGeometry.vertices.push(tile.averagePosition);
      for (var j = 0; j < tile.corners.length; ++j){
        var cornerPosition = tile.corners[j].position;
        planetGeometry.vertices.push(cornerPosition);
        planetGeometry.vertices.push(tile.averagePosition.clone().sub(cornerPosition).multiplyScalar(0.05).add(cornerPosition));

        var i0 = j * 2;
        var i1 = ((j + 1) % tile.corners.length) * 2;
        this.buildTileWedge(planetGeometry.faces, baseIndex, i0, i1, tile.normal);
        this.buildTileWedgeColors(terrainColors, terrainColor, terrainColor.clone().multiplyScalar(0.5));
        this.buildTileWedgeColors(plateColors, plateColor, plateColor.clone().multiplyScalar(0.5));
        this.buildTileWedgeColors(elevationColors, elevationColor, elevationColor.clone().multiplyScalar(0.5));
        this.buildTileWedgeColors(temperatureColors, temperatureColor, temperatureColor.clone().multiplyScalar(0.5));
        this.buildTileWedgeColors(moistureColors, moistureColor, moistureColor.clone().multiplyScalar(0.5));
        //$add player
        // TODO
        //this.buildTileWedgeColors(playerColors, playerColor, playerColor.clone().multiplyScalar(0.5));
        //
        for (var k = planetGeometry.faces.length - 3; k < planetGeometry.faces.length; ++k)
          planetGeometry.faces[k].vertexColors = terrainColors[k];
      }
    }


  	planetGeometry.dynamic = true;
  	planetGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1000);
  	const planetMaterial = new THREE.MeshLambertMaterial({
			// color: new THREE.Color(0x000000),
			color: new THREE.Color(0xFFFFFF),
			// ambient: new THREE.Color(0xFFFFFF),
			// emissive: new THREE.Color(0xFFFFFF),
			vertexColors: THREE.VertexColors,
			// side: THREE.BackSide
			// side: THREE.DoubleSide
		});
  	const planetRenderObject = new THREE.Mesh(planetGeometry, planetMaterial);

  	const mapGeometry = new THREE.Geometry();
  	mapGeometry.dynamic = true;
  	const mapMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, });
  	const mapRenderObject = new THREE.Mesh(mapGeometry, mapMaterial);

  	return {
			geometry: planetGeometry,
			terrainColors: terrainColors,
			plateColors: plateColors,
			elevationColors: elevationColors,
			temperatureColors: temperatureColors,
			moistureColors: moistureColors,
			//$add player
			playerColors: playerColors,
			//
			material: planetMaterial,
			renderObject: planetRenderObject,
			mapGeometry: mapGeometry,
			mapMaterial: mapMaterial,
			mapRenderObject: mapRenderObject,
  	}
  }

  buildTileWedge(f, b, s, t, n){
    // Old three.js version
  	// f.push(new THREE.Face3(b + s + 2, b + t + 2, b, n));
  	// f.push(new THREE.Face3(b + s + 1, b + t + 1, b + t + 2, n));
  	// f.push(new THREE.Face3(b + s + 1, b + t + 2, b + s + 2, n));
		// WebGL's preferred counter-clockwise order
		f.push(new THREE.Face3(b + t + 2, b + s + 2, b, n));
  	f.push(new THREE.Face3(b + t + 1, b + s + 1, b + t + 2, n));
  	f.push(new THREE.Face3(b + t + 2, b + s + 1, b + s + 2, n));
  }
  buildTileWedgeColors(f, c, bc){
  	f.push([c, c, c]);
  	f.push([bc, bc, c]);
  	f.push([bc, c, c]);
  }
}

export default PlanetRenderObject
