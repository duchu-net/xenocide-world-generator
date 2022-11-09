import { Tile } from './utils';

export class PlanetBiomeGenerator {
  static generatePlanetBiomes(tiles: Tile[], planetRadius: number) {
    for (let i = 0; i < tiles.length; ++i) {
      const tile = tiles[i];
      const elevation = Math.max(0, tile.elevation as number);
      const latitude = Math.abs(tile.position.y / planetRadius);
      const temperature = tile.temperature as number;
      const moisture = tile.moisture as number;

      if (elevation <= 0) {
        if (temperature > 0) {
          tile.biome = 'ocean';
        } else {
          tile.biome = 'oceanGlacier';
        }
      } else if (elevation < 0.6) {
        if (temperature > 0.75) {
          if (moisture < 0.25) {
            tile.biome = 'desert';
          } else {
            tile.biome = 'rainForest';
          }
        } else if (temperature > 0.5) {
          if (moisture < 0.25) {
            tile.biome = 'rocky';
          } else if (moisture < 0.5) {
            tile.biome = 'plains';
          } else {
            tile.biome = 'swamp';
          }
        } else if (temperature > 0) {
          if (moisture < 0.25) {
            tile.biome = 'plains';
          } else if (moisture < 0.5) {
            tile.biome = 'grassland';
          } else {
            tile.biome = 'deciduousForest';
          }
        } else {
          if (moisture < 0.25) {
            tile.biome = 'tundra';
          } else {
            tile.biome = 'landGlacier';
          }
        }
      } else if (elevation < 0.8) {
        if (temperature > 0) {
          if (moisture < 0.25) {
            tile.biome = 'tundra';
          } else {
            tile.biome = 'coniferForest';
          }
        } else {
          tile.biome = 'tundra';
        }
      } else {
        if (temperature > 0 || moisture < 0.25) {
          tile.biome = 'mountain';
        } else {
          tile.biome = 'snowyMountain';
        }
      }
    }
  }
}
