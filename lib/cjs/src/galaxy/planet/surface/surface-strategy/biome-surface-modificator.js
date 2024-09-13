"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiomeSurfaceModificator = void 0;
const three_1 = require("three");
const utils_1 = require("../../../../utils");
const surface_modificator_1 = require("./surface-modificator");
class EarthBiomeStrategy {
    constructor() {
        this.name = 'terrestial-earth';
    }
    generateBiomes(tiles, planetRadius, random) {
        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            const elevation = Math.max(0, tile.elevation);
            const temperature = tile.temperature;
            const moisture = tile.moisture;
            const colorDeviance = new three_1.Color(random.unit(), random.unit(), random.unit());
            let normalizedElevation = Math.min(-tile.elevation, 1);
            if (elevation <= 0) {
                if (temperature > 0) {
                    tile.biome = 'ocean';
                    tile.color = new three_1.Color(0x0066ff).lerp(new three_1.Color(0x0044bb), normalizedElevation).lerp(colorDeviance, 0.05);
                }
                else {
                    tile.biome = 'oceanGlacier';
                    tile.color = new three_1.Color(0xddeeff).lerp(colorDeviance, 0.1);
                }
            }
            else if (elevation < 0.6) {
                normalizedElevation = tile.elevation / 0.6;
                if (temperature > 0.75) {
                    if (moisture < 0.25) {
                        tile.biome = 'desert';
                        tile.color = new three_1.Color(0xdddd77).lerp(new three_1.Color(0xbbbb55), normalizedElevation).lerp(colorDeviance, 0.1);
                    }
                    else {
                        tile.biome = 'rainForest';
                        tile.color = new three_1.Color(0x44dd00).lerp(new three_1.Color(0x229900), normalizedElevation).lerp(colorDeviance, 0.2);
                    }
                }
                else if (temperature > 0.5) {
                    if (moisture < 0.25) {
                        tile.biome = 'rocky';
                        tile.color = new three_1.Color(0xaa9977).lerp(new three_1.Color(0x887755), normalizedElevation).lerp(colorDeviance, 0.15);
                    }
                    else if (moisture < 0.5) {
                        tile.biome = 'plains';
                        tile.color = new three_1.Color(0x99bb44).lerp(new three_1.Color(0x667722), normalizedElevation).lerp(colorDeviance, 0.1);
                    }
                    else {
                        tile.biome = 'swamp';
                        tile.color = new three_1.Color(0x77aa44).lerp(new three_1.Color(0x446622), normalizedElevation).lerp(colorDeviance, 0.25);
                    }
                }
                else if (temperature > 0) {
                    if (moisture < 0.25) {
                        tile.biome = 'plains';
                        tile.color = new three_1.Color(0x99bb44).lerp(new three_1.Color(0x667722), normalizedElevation).lerp(colorDeviance, 0.1);
                    }
                    else if (moisture < 0.5) {
                        tile.biome = 'grassland';
                        tile.color = new three_1.Color(0x77cc44).lerp(new three_1.Color(0x448822), normalizedElevation).lerp(colorDeviance, 0.15);
                    }
                    else {
                        tile.biome = 'deciduousForest';
                        tile.color = new three_1.Color(0x33aa22).lerp(new three_1.Color(0x116600), normalizedElevation).lerp(colorDeviance, 0.1);
                    }
                }
                else {
                    if (moisture < 0.25) {
                        tile.biome = 'tundra';
                        tile.color = new three_1.Color(0x9999aa).lerp(new three_1.Color(0x777788), normalizedElevation).lerp(colorDeviance, 0.15);
                    }
                    else {
                        tile.biome = 'landGlacier';
                        tile.color = new three_1.Color(0xddeeff).lerp(colorDeviance, 0.1);
                    }
                }
            }
            else if (elevation < 0.8) {
                normalizedElevation = (tile.elevation - 0.6) / 0.2;
                if (temperature > 0) {
                    if (moisture < 0.25) {
                        tile.biome = 'tundra';
                        tile.color = new three_1.Color(0x777788).lerp(new three_1.Color(0x666677), normalizedElevation).lerp(colorDeviance, 0.1);
                    }
                    else {
                        tile.biome = 'coniferForest';
                        tile.color = new three_1.Color(0x338822).lerp(new three_1.Color(0x116600), normalizedElevation).lerp(colorDeviance, 0.1);
                    }
                }
                else {
                    tile.biome = 'tundra';
                    tile.color = new three_1.Color('lightgreen');
                }
            }
            else {
                normalizedElevation = Math.min((tile.elevation - 0.8) / 0.5, 1);
                if (temperature > 0 || moisture < 0.25) {
                    tile.biome = 'mountain';
                    tile.color = new three_1.Color(0x444433).lerp(new three_1.Color(0x333322), normalizedElevation).lerp(colorDeviance, 0.05);
                }
                else {
                    tile.biome = 'snowyMountain';
                    tile.color = new three_1.Color(0xdddddd).lerp(new three_1.Color(0xffffff), normalizedElevation).lerp(colorDeviance, 0.1);
                }
            }
            tile.color.multiplyScalar(0.5);
        }
    }
}
function adjustRange(value, oldMin, oldMax, newMin, newMax) {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}
function add(accumulator, factor) {
    return accumulator + factor;
}
class GasGiantBiomeStrategy {
    constructor() {
        this.name = 'gas-giant';
    }
    generateBiomes(tiles, planetRadius, random) {
        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            const colorDeviance = new three_1.Color(random.unit(), random.unit(), random.unit());
            const colors = [
                [0.1, 0xc99039], // todo random factor
                [0.1, 0xb53b2f],
                [0.15, 0xebf3f6],
                [0.2, 0xd8ca9d],
                [0.3, 0xa59186],
            ];
            const spherical = new three_1.Spherical().setFromVector3(tile.position);
            let angle = (0, utils_1.sphericalPhiToPolarAngle)(spherical.phi);
            angle = angle > 90 ? 180 - angle : angle;
            /**
             * todo can be write with Polar from @shared (but for now generator should't have dependencies):
             * const polar = new Polar().setFromVector3(tile.position);
             * // convert [-90,90] to [0,90] from equator, with [0,180] angle
             * const angle = 90 - Math.abs(polar.latitude);
             */
            const normalizedAngle = adjustRange(angle, 0, 90, 0, colors.map((col) => col[0]).reduce(add, 0));
            let sum = 0;
            let index = 0;
            colors.reverse();
            while (index < colors.length) {
                const newSum = sum + colors[index][0];
                if (sum < normalizedAngle && normalizedAngle < newSum) {
                    tile.biome = `gas_${colors.length - index}`;
                    tile.color = new three_1.Color(colors[index][1]).lerp(colorDeviance, 0.1); //.multiplyScalar(colors[index][2] || 1);
                    break;
                }
                sum = newSum;
                index += 1;
            }
        }
    }
}
const carnelian = `#A81B18`;
const roseEbony = '#5A4548';
class LavaBiomeStrategy {
    constructor() {
        this.name = 'terran-lava';
    }
    generateBiomes(tiles, planetRadius, random) {
        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            const colorDeviance = new three_1.Color(random.unit(), random.unit(), random.unit());
            const elevation = Math.max(0, tile.elevation);
            if (elevation <= 0) {
                tile.biome = 'lava';
                tile.color = new three_1.Color(carnelian).lerp(colorDeviance, 0.03);
            }
            else {
                tile.biome = 'rocks';
                tile.color = new three_1.Color(roseEbony).lerp(new three_1.Color('silver').lerp(colorDeviance.multiplyScalar(0.2), 0.3), 0.05);
                // tile.color = new Color('black').lerp(new Color('silver').lerp(colorDeviance, 0.1), 0.025);
                // tile.color = new Color('saddlebrown').lerp(new Color('silver').lerp(colorDeviance, 0.7), 0.1);
                // tile.color = new Color('saddlebrown').lerp(colorDeviance, 0.05);
                // tile.color = new Color('black').lerp(colorDeviance, 0.01);
            }
        }
    }
}
const defaultOptions = {
    strategy: 'terrestial-earth',
};
class BiomeSurfaceModificator extends surface_modificator_1.SurfaceModificator {
    constructor(options) {
        super('biome-generator', Object.assign(Object.assign({}, defaultOptions), options));
        let strategy;
        switch (this.options.strategy) {
            case 'terrestial-earth':
                strategy = new EarthBiomeStrategy();
                break;
            case 'terrestial-lava':
                strategy = new LavaBiomeStrategy();
                break;
            case 'gas-giant':
                strategy = new GasGiantBiomeStrategy();
                break;
            default:
                strategy = new GasGiantBiomeStrategy();
        }
        this.strategy = strategy;
    }
    // generatePlanetBiomes(tiles: Tile[], planetRadius: number, random: RandomObject) {
    generate(planet, random, options) {
        this.strategy.generateBiomes(planet.topology.tiles, 1000, random);
    }
}
exports.BiomeSurfaceModificator = BiomeSurfaceModificator;
//# sourceMappingURL=biome-surface-modificator.js.map