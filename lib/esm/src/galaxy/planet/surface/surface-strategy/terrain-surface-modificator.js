import { Color, Vector3 } from 'three';
import { Plate } from '../utils';
import { PlanetWeatherGenerator } from './planet-weather-modificator';
import { SurfaceModificator } from './surface-modificator';
function randomUnitVector(random) {
    const theta = random.real(0, Math.PI * 2);
    const phi = Math.acos(random.realInclusive(-1, 1));
    const sinPhi = Math.sin(phi);
    return new Vector3(Math.cos(theta) * sinPhi, Math.sin(theta) * sinPhi, Math.cos(phi));
}
const defaultOptions = {
    plateCount: 10,
    oceanicRate: 0.7,
    heatLevel: 1,
    moistureLevel: 1,
};
export class TerrainSurfaceModificator extends SurfaceModificator {
    constructor(options) {
        super('terrain-genarator', Object.assign(Object.assign({}, defaultOptions), options));
    }
    generate(planet, 
    // plateCount: number,
    // oceanicRate: number,
    // heatLevel: number,
    // moistureLevel: number,
    random, options) {
        const { plateCount, oceanicRate, heatLevel, moistureLevel } = Object.assign(Object.assign({}, this.options), options);
        // Generating Tectonic Plates
        planet.plates = this.generatePlanetTectonicPlates(planet.topology, plateCount, oceanicRate, random);
        // Generating Elevation
        this.generatePlanetElevation(planet.topology, planet.plates);
        // 'Generating Weather'
        const weather = new PlanetWeatherGenerator();
        weather.generatePlanetWeather(planet.topology, planet.partition, heatLevel, moistureLevel, random);
        // todo can be deleted - moved to surface
        // // 'Generating Biomes'
        // BiomeSurfaceModificator.generatePlanetBiomes(planet.topology.tiles, 1000, random);
    }
    generatePlanetTectonicPlates(topology, plateCount, oceanicRate, random) {
        const plates = [];
        const platelessTiles = [];
        const platelessTilePlates = [];
        // action.executeSubaction((action) => {
        let failedCount = 0;
        while (plates.length < plateCount && failedCount < 10000) {
            const index = plates.length;
            const corner = topology.corners[random.integerExclusive(0, topology.corners.length)];
            let adjacentToExistingPlate = false;
            for (let i = 0; i < corner.tiles.length; ++i) {
                if (corner.tiles[i].plate) {
                    adjacentToExistingPlate = true;
                    failedCount += 1;
                    break;
                }
            }
            if (adjacentToExistingPlate)
                continue;
            failedCount = 0;
            const oceanic = random.unit() < oceanicRate;
            const plate = new Plate(index, new Color(random.integer(0, 0xffffff)), randomUnitVector(random), random.realInclusive(-Math.PI / 30, Math.PI / 30), random.realInclusive(-Math.PI / 30, Math.PI / 30), oceanic ? random.realInclusive(-0.8, -0.3) : random.realInclusive(0.1, 0.5), oceanic, corner);
            plates.push(plate);
            for (let i = 0; i < corner.tiles.length; ++i) {
                corner.tiles[i].plate = plate;
                plate.tiles.push(corner.tiles[i]);
            }
            for (let i = 0; i < corner.tiles.length; ++i) {
                const tile = corner.tiles[i];
                for (let j = 0; j < tile.tiles.length; ++j) {
                    const adjacentTile = tile.tiles[j];
                    if (!adjacentTile.plate) {
                        platelessTiles.push(adjacentTile);
                        platelessTilePlates.push(plate);
                    }
                }
            }
        }
        while (platelessTiles.length > 0) {
            var tileIndex = Math.floor(Math.pow(random.unit(), 2) * platelessTiles.length);
            var tile = platelessTiles[tileIndex];
            var plate = platelessTilePlates[tileIndex];
            platelessTiles.splice(tileIndex, 1);
            platelessTilePlates.splice(tileIndex, 1);
            if (!tile.plate) {
                tile.plate = plate;
                plate.tiles.push(tile);
                for (let j = 0; j < tile.tiles.length; ++j) {
                    if (!tile.tiles[j].plate) {
                        platelessTiles.push(tile.tiles[j]);
                        platelessTilePlates.push(plate);
                    }
                }
            }
        }
        // action.executeSubaction(this.calculateCornerDistancesToPlateRoot.bind(null, plates));
        this.calculateCornerDistancesToPlateRoot(plates);
        // action.provideResult(plates);
        return plates;
    }
    calculateCornerDistancesToPlateRoot(plates) {
        const distanceCornerQueue = [];
        for (let i = 0; i < plates.length; ++i) {
            var corner = plates[i].root;
            corner.distanceToPlateRoot = 0;
            for (let j = 0; j < corner.corners.length; ++j) {
                distanceCornerQueue.push({ corner: corner.corners[j], distanceToPlateRoot: corner.borders[j].length() });
            }
        }
        const distanceCornerQueueSorter = function (left, right) {
            return left.distanceToPlateRoot - right.distanceToPlateRoot;
        };
        while (distanceCornerQueue.length !== 0) {
            const iEnd = distanceCornerQueue.length;
            for (let i = 0; i < iEnd; ++i) {
                const front = distanceCornerQueue[i];
                const corner = front.corner;
                const distanceToPlateRoot = front.distanceToPlateRoot;
                if (!corner.distanceToPlateRoot || corner.distanceToPlateRoot > distanceToPlateRoot) {
                    corner.distanceToPlateRoot = distanceToPlateRoot;
                    for (let j = 0; j < corner.corners.length; ++j) {
                        distanceCornerQueue.push({
                            corner: corner.corners[j],
                            distanceToPlateRoot: distanceToPlateRoot + corner.borders[j].length(),
                        });
                    }
                }
            }
            distanceCornerQueue.splice(0, iEnd);
            distanceCornerQueue.sort(distanceCornerQueueSorter);
        }
    }
    generatePlanetElevation(topology, plates) {
        const elevationBorderQueueSorter = (left, right) => left.distanceToPlateBoundary - right.distanceToPlateBoundary;
        this.identifyBoundaryBorders(topology.borders);
        const boundaryCorners = this.collectBoundaryCorners(topology.corners);
        const boundaryCornerInnerBorderIndexes = this.calculatePlateBoundaryStress(boundaryCorners);
        this.blurPlateBoundaryStress(boundaryCorners, 3, 0.4);
        const elevationBorderQueue = this.populateElevationBorderQueue(boundaryCorners, boundaryCornerInnerBorderIndexes);
        this.processElevationBorderQueue(elevationBorderQueue, elevationBorderQueueSorter);
        this.calculateTileAverageElevations(topology.tiles);
    }
    identifyBoundaryBorders(borders) {
        for (let i = 0; i < borders.length; ++i) {
            const border = borders[i];
            if (border.tiles[0].plate !== border.tiles[1].plate) {
                border.betweenPlates = true;
                border.corners[0].betweenPlates = true;
                border.corners[1].betweenPlates = true;
                border.tiles[0].plate.boundaryBorders.push(border);
                border.tiles[1].plate.boundaryBorders.push(border);
            }
        }
    }
    collectBoundaryCorners(corners) {
        const boundaryCorners = [];
        for (let j = 0; j < corners.length; ++j) {
            const corner = corners[j];
            if (corner.betweenPlates) {
                boundaryCorners.push(corner);
                corner.tiles[0].plate.boundaryCorners.push(corner);
                if (corner.tiles[1].plate !== corner.tiles[0].plate)
                    corner.tiles[1].plate.boundaryCorners.push(corner);
                if (corner.tiles[2].plate !== corner.tiles[0].plate && corner.tiles[2].plate !== corner.tiles[1].plate)
                    corner.tiles[2].plate.boundaryCorners.push(corner);
            }
        }
        return boundaryCorners;
    }
    calculatePlateBoundaryStress(boundaryCorners) {
        const boundaryCornerInnerBorderIndexes = new Array(boundaryCorners.length);
        for (let i = 0; i < boundaryCorners.length; ++i) {
            const corner = boundaryCorners[i];
            corner.distanceToPlateBoundary = 0;
            let innerBorder;
            let innerBorderIndex = 0;
            for (let j = 0; j < corner.borders.length; ++j) {
                const border = corner.borders[j];
                if (!border.betweenPlates) {
                    innerBorder = border;
                    innerBorderIndex = j;
                    break;
                }
            }
            if (innerBorder) {
                boundaryCornerInnerBorderIndexes[i] = innerBorderIndex;
                const outerBorder0 = corner.borders[(innerBorderIndex + 1) % corner.borders.length];
                const outerBorder1 = corner.borders[(innerBorderIndex + 2) % corner.borders.length];
                const farCorner0 = outerBorder0.oppositeCorner(corner);
                const farCorner1 = outerBorder1.oppositeCorner(corner);
                const plate0 = innerBorder.tiles[0].plate;
                const plate1 = (outerBorder0.tiles[0].plate !== plate0 ? outerBorder0.tiles[0].plate : outerBorder0.tiles[1].plate);
                const boundaryVector = farCorner0.vectorTo(farCorner1);
                const boundaryNormal = boundaryVector.clone().cross(corner.position);
                const stress = this.calculateStress(plate0.calculateMovement(corner.position), plate1.calculateMovement(corner.position), boundaryVector, boundaryNormal);
                corner.pressure = stress.pressure;
                corner.shear = stress.shear;
            }
            else {
                boundaryCornerInnerBorderIndexes[i] = null;
                const plate0 = corner.tiles[0].plate;
                const plate1 = corner.tiles[1].plate;
                const plate2 = corner.tiles[2].plate;
                const boundaryVector0 = corner.corners[0].vectorTo(corner);
                const boundaryVector1 = corner.corners[1].vectorTo(corner);
                const boundaryVector2 = corner.corners[2].vectorTo(corner);
                const boundaryNormal0 = boundaryVector0.clone().cross(corner.position);
                const boundaryNormal1 = boundaryVector1.clone().cross(corner.position);
                const boundaryNormal2 = boundaryVector2.clone().cross(corner.position);
                const stress0 = this.calculateStress(plate0.calculateMovement(corner.position), plate1.calculateMovement(corner.position), boundaryVector0, boundaryNormal0);
                const stress1 = this.calculateStress(plate1.calculateMovement(corner.position), plate2.calculateMovement(corner.position), boundaryVector1, boundaryNormal1);
                const stress2 = this.calculateStress(plate2.calculateMovement(corner.position), plate0.calculateMovement(corner.position), boundaryVector2, boundaryNormal2);
                corner.pressure = (stress0.pressure + stress1.pressure + stress2.pressure) / 3;
                corner.shear = (stress0.shear + stress1.shear + stress2.shear) / 3;
            }
        }
        // action.provideResult(boundaryCornerInnerBorderIndexes);
        return boundaryCornerInnerBorderIndexes;
    }
    calculateStress(movement0, movement1, boundaryVector, boundaryNormal) {
        const relativeMovement = movement0.clone().sub(movement1);
        const pressureVector = relativeMovement.clone().projectOnVector(boundaryNormal);
        let pressure = pressureVector.length();
        if (pressureVector.dot(boundaryNormal) > 0)
            pressure = -pressure;
        const shear = relativeMovement.clone().projectOnVector(boundaryVector).length();
        return { pressure: 2 / (1 + Math.exp(-pressure / 30)) - 1, shear: 2 / (1 + Math.exp(-shear / 30)) - 1 };
    }
    blurPlateBoundaryStress(boundaryCorners, stressBlurIterations, stressBlurCenterWeighting) {
        const newCornerPressure = new Array(boundaryCorners.length);
        const newCornerShear = new Array(boundaryCorners.length);
        for (let i = 0; i < stressBlurIterations; ++i) {
            for (let j = 0; j < boundaryCorners.length; ++j) {
                const corner = boundaryCorners[j];
                let averagePressure = 0;
                let averageShear = 0;
                let neighborCount = 0;
                for (let k = 0; k < corner.corners.length; ++k) {
                    const neighbor = corner.corners[k];
                    if (neighbor.betweenPlates) {
                        averagePressure += neighbor.pressure;
                        averageShear += neighbor.shear;
                        ++neighborCount;
                    }
                }
                newCornerPressure[j] =
                    corner.pressure * stressBlurCenterWeighting +
                        (averagePressure / neighborCount) * (1 - stressBlurCenterWeighting);
                newCornerShear[j] =
                    corner.shear * stressBlurCenterWeighting +
                        (averageShear / neighborCount) * (1 - stressBlurCenterWeighting);
            }
            for (let j = 0; j < boundaryCorners.length; ++j) {
                const corner = boundaryCorners[j];
                if (corner.betweenPlates) {
                    corner.pressure = newCornerPressure[j];
                    corner.shear = newCornerShear[j];
                }
            }
        }
    }
    populateElevationBorderQueue(boundaryCorners, boundaryCornerInnerBorderIndexes) {
        const elevationBorderQueue = [];
        for (let i = 0; i < boundaryCorners.length; ++i) {
            const corner = boundaryCorners[i];
            const innerBorderIndex = boundaryCornerInnerBorderIndexes[i];
            if (innerBorderIndex !== null) {
                const innerBorder = corner.borders[innerBorderIndex];
                const outerBorder0 = corner.borders[(innerBorderIndex + 1) % corner.borders.length];
                const plate0 = innerBorder.tiles[0].plate;
                const plate1 = (outerBorder0.tiles[0].plate !== plate0 ? outerBorder0.tiles[0].plate : outerBorder0.tiles[1].plate);
                let calculateElevation;
                if (corner.pressure > 0.3) {
                    corner.elevation = Math.max(plate0.elevation, plate1.elevation) + corner.pressure;
                    if (plate0.oceanic === plate1.oceanic)
                        calculateElevation = this.calculateCollidingElevation;
                    else if (plate0.oceanic)
                        calculateElevation = this.calculateSubductingElevation;
                    else
                        calculateElevation = this.calculateSuperductingElevation;
                }
                else if (corner.pressure < -0.3) {
                    corner.elevation = Math.max(plate0.elevation, plate1.elevation) - corner.pressure / 4;
                    calculateElevation = this.calculateDivergingElevation;
                }
                else if (corner.shear > 0.3) {
                    corner.elevation = Math.max(plate0.elevation, plate1.elevation) + corner.shear / 8;
                    calculateElevation = this.calculateShearingElevation;
                }
                else {
                    corner.elevation = (plate0.elevation + plate1.elevation) / 2;
                    calculateElevation = this.calculateDormantElevation;
                }
                const nextCorner = innerBorder.oppositeCorner(corner);
                if (!nextCorner.betweenPlates) {
                    elevationBorderQueue.push({
                        origin: {
                            corner,
                            calculateElevation,
                            plate: plate0,
                            shear: corner.shear,
                            pressure: corner.pressure,
                        },
                        corner,
                        nextCorner,
                        border: innerBorder,
                        distanceToPlateBoundary: innerBorder.length(),
                    });
                }
            }
            else {
                const plate0 = corner.tiles[0].plate;
                const plate1 = corner.tiles[1].plate;
                const plate2 = corner.tiles[2].plate;
                //elevation = 0;
                if (corner.pressure > 0.3) {
                    corner.elevation =
                        Math.max(plate0.elevation, plate1.elevation, plate2.elevation) + corner.pressure;
                }
                else if (corner.pressure < -0.3) {
                    corner.elevation =
                        Math.max(plate0.elevation, plate1.elevation, plate2.elevation) + corner.pressure / 4;
                }
                else if (corner.shear > 0.3) {
                    corner.elevation =
                        Math.max(plate0.elevation, plate1.elevation, plate2.elevation) + corner.shear / 8;
                }
                else {
                    corner.elevation = (plate0.elevation + plate1.elevation + plate2.elevation) / 3;
                }
            }
        }
        // action.provideResult(elevationBorderQueue);
        return elevationBorderQueue;
    }
    calculateCollidingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear) {
        var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
        if (t < 0.5) {
            t = t / 0.5;
            return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
        }
        else {
            return plateElevation;
        }
    }
    calculateSubductingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear) {
        var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
        return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
    }
    calculateSuperductingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear) {
        var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
        if (t < 0.2) {
            t = t / 0.2;
            return boundaryElevation + t * (plateElevation - boundaryElevation + pressure / 2);
        }
        else if (t < 0.5) {
            t = (t - 0.2) / 0.3;
            return plateElevation + (Math.pow(t - 1, 2) * pressure) / 2;
        }
        else {
            return plateElevation;
        }
    }
    calculateDivergingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear) {
        var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
        if (t < 0.3) {
            t = t / 0.3;
            return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
        }
        else {
            return plateElevation;
        }
    }
    calculateShearingElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear) {
        var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
        if (t < 0.2) {
            t = t / 0.2;
            return plateElevation + Math.pow(t - 1, 2) * (boundaryElevation - plateElevation);
        }
        else {
            return plateElevation;
        }
    }
    calculateDormantElevation(distanceToPlateBoundary, distanceToPlateRoot, boundaryElevation, plateElevation, pressure, shear) {
        var t = distanceToPlateBoundary / (distanceToPlateBoundary + distanceToPlateRoot);
        var elevationDifference = boundaryElevation - plateElevation;
        var a = 2 * elevationDifference;
        var b = -3 * elevationDifference;
        return t * t * elevationDifference * (2 * t - 3) + boundaryElevation;
    }
    processElevationBorderQueue(elevationBorderQueue, elevationBorderQueueSorter) {
        while (elevationBorderQueue.length !== 0) {
            // if (elevationBorderQueue.length === 0) return;
            const iEnd = elevationBorderQueue.length;
            for (let i = 0; i < iEnd; ++i) {
                const front = elevationBorderQueue[i];
                const corner = front.nextCorner;
                if (!corner.elevation) {
                    corner.distanceToPlateBoundary = front.distanceToPlateBoundary;
                    corner.elevation = front.origin.calculateElevation(corner.distanceToPlateBoundary, corner.distanceToPlateRoot, front.origin.corner.elevation, front.origin.plate.elevation, front.origin.pressure, front.origin.shear);
                    for (let j = 0; j < corner.borders.length; ++j) {
                        const border = corner.borders[j];
                        if (!border.betweenPlates) {
                            const nextCorner = corner.corners[j];
                            const distanceToPlateBoundary = corner.distanceToPlateBoundary + border.length();
                            if (!nextCorner.distanceToPlateBoundary || nextCorner.distanceToPlateBoundary > distanceToPlateBoundary) {
                                elevationBorderQueue.push({
                                    origin: front.origin,
                                    border: border,
                                    corner: corner,
                                    nextCorner: nextCorner,
                                    distanceToPlateBoundary: distanceToPlateBoundary,
                                });
                            }
                        }
                    }
                }
            }
            elevationBorderQueue.splice(0, iEnd);
            elevationBorderQueue.sort(elevationBorderQueueSorter);
        }
        // action.loop();
    }
    calculateTileAverageElevations(tiles) {
        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            let elevation = 0;
            for (let j = 0; j < tile.corners.length; ++j) {
                elevation += tile.corners[j].elevation;
            }
            tile.elevation = elevation / tile.corners.length;
            //console.log("calculateTileAverageElevations",tile.elevation);
        }
    }
}
//# sourceMappingURL=terrain-surface-modificator.js.map