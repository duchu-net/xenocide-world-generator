"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetWeatherGenerator = void 0;
const three_1 = require("three");
class PlanetWeatherGenerator {
    generatePlanetWeather(topology, partitions, heatLevel, moistureLevel, random) {
        const planetRadius = 1000;
        // 'Generating Air Currents'
        const whorls = this.generateAirCurrentWhorls(planetRadius, random);
        // 'Generating Air Currents'
        this.calculateAirCurrents(topology.corners, whorls, planetRadius);
        // 'Calculating Temperature'
        const { corners: activeHeatCorners, airHeat: totalHeat } = this.initializeAirHeat(topology.corners, heatLevel);
        let remainingHeat = totalHeat;
        let consumedHeat;
        do {
            consumedHeat = this.processAirHeat(activeHeatCorners);
            remainingHeat -= consumedHeat;
        } while (remainingHeat > 0 && consumedHeat >= 0.0001);
        this.calculateTemperature(topology.corners, topology.tiles, planetRadius);
        // 'Calculating Moisture'
        const { corners: activeMoistureCorners, airMoisture: totalMoisture } = this.initializeAirMoisture(topology.corners, moistureLevel);
        let remainingMoisture = totalMoisture;
        let consumedMoisture;
        do {
            consumedMoisture = this.processAirMoisture(activeMoistureCorners);
            remainingMoisture -= consumedMoisture;
        } while (remainingMoisture > 0 && consumedMoisture >= 0.0001);
        this.calculateMoisture(topology.corners, topology.tiles);
    }
    generateAirCurrentWhorls(planetRadius, random) {
        const whorls = [];
        let direction = random.integer(0, 1) ? 1 : -1;
        const layerCount = random.integer(4, 7);
        const circumference = Math.PI * 2 * planetRadius;
        const fullRevolution = Math.PI * 2;
        const baseWhorlRadius = circumference / (2 * (layerCount - 1));
        whorls.push({
            center: new three_1.Vector3(0, planetRadius, 0)
                .applyAxisAngle(new three_1.Vector3(1, 0, 0), random.realInclusive(0, fullRevolution / (2 * (layerCount + 4))))
                .applyAxisAngle(new three_1.Vector3(0, 1, 0), random.real(0, fullRevolution)),
            strength: random.realInclusive(fullRevolution / 36, fullRevolution / 24) * direction,
            radius: random.realInclusive(baseWhorlRadius * 0.8, baseWhorlRadius * 1.2),
        });
        for (let i = 1; i < layerCount - 1; ++i) {
            direction = -direction;
            const baseTilt = ((i / (layerCount - 1)) * fullRevolution) / 2;
            const layerWhorlCount = Math.ceil((Math.sin(baseTilt) * planetRadius * fullRevolution) / baseWhorlRadius);
            for (let j = 0; j < layerWhorlCount; ++j) {
                whorls.push({
                    center: new three_1.Vector3(0, planetRadius, 0)
                        .applyAxisAngle(new three_1.Vector3(1, 0, 0), random.realInclusive(0, fullRevolution / (2 * (layerCount + 4))))
                        .applyAxisAngle(new three_1.Vector3(0, 1, 0), random.real(0, fullRevolution))
                        .applyAxisAngle(new three_1.Vector3(1, 0, 0), baseTilt)
                        .applyAxisAngle(new three_1.Vector3(0, 1, 0), (fullRevolution * (j + (i % 2) / 2)) / layerWhorlCount),
                    strength: random.realInclusive(fullRevolution / 48, fullRevolution / 32) * direction,
                    radius: random.realInclusive(baseWhorlRadius * 0.8, baseWhorlRadius * 1.2),
                });
            }
        }
        direction = -direction;
        whorls.push({
            center: new three_1.Vector3(0, planetRadius, 0)
                .applyAxisAngle(new three_1.Vector3(1, 0, 0), random.realInclusive(0, fullRevolution / (2 * (layerCount + 4))))
                .applyAxisAngle(new three_1.Vector3(0, 1, 0), random.real(0, fullRevolution))
                .applyAxisAngle(new three_1.Vector3(1, 0, 0), fullRevolution / 2),
            strength: random.realInclusive(fullRevolution / 36, fullRevolution / 24) * direction,
            radius: random.realInclusive(baseWhorlRadius * 0.8, baseWhorlRadius * 1.2),
        });
        return whorls;
    }
    calculateAirCurrents(corners, whorls, planetRadius) {
        let i = 0;
        corners.forEach((corner) => {
            const airCurrent = new three_1.Vector3(0, 0, 0);
            let weight = 0;
            for (let j = 0; j < whorls.length; ++j) {
                const whorl = whorls[j];
                const angle = whorl.center.angleTo(corner.position);
                const distance = angle * planetRadius;
                if (distance < whorl.radius) {
                    const normalizedDistance = distance / whorl.radius;
                    const whorlWeight = 1 - normalizedDistance;
                    const whorlStrength = planetRadius * whorl.strength * whorlWeight * normalizedDistance;
                    const whorlCurrent = whorl.center.clone().cross(corner.position).setLength(whorlStrength);
                    airCurrent.add(whorlCurrent);
                    weight += whorlWeight;
                }
            }
            airCurrent.divideScalar(weight);
            corner.airCurrent = airCurrent;
            corner.airCurrentSpeed = airCurrent.length(); //kilometers per hour
            corner.airCurrentOutflows = new Array(corner.borders.length);
            const airCurrentDirection = airCurrent.clone().normalize();
            let outflowSum = 0;
            for (let j = 0; j < corner.corners.length; ++j) {
                const vector = corner.vectorTo(corner.corners[j]).normalize();
                const dot = vector.dot(airCurrentDirection);
                if (dot > 0) {
                    corner.airCurrentOutflows[j] = dot;
                    outflowSum += dot;
                }
                else {
                    corner.airCurrentOutflows[j] = 0;
                }
            }
            if (outflowSum > 0) {
                for (let j = 0; j < corner.borders.length; ++j) {
                    corner.airCurrentOutflows[j] /= outflowSum;
                }
            }
        });
    }
    initializeAirHeat(corners, heatLevel) {
        const activeCorners = [];
        let airHeat = 0;
        for (let i = 0; i < corners.length; ++i) {
            const corner = corners[i];
            corner.airHeat = corner.area * heatLevel;
            corner.newAirHeat = 0;
            corner.heat = 0;
            corner.heatAbsorption =
                (0.1 * corner.area) / Math.max(0.1, Math.min(corner.airCurrentSpeed, 1));
            if (corner.elevation <= 0) {
                corner.maxHeat = corner.area;
            }
            else {
                corner.maxHeat = corner.area;
                corner.heatAbsorption *= 2;
            }
            activeCorners.push(corner);
            airHeat += corner.airHeat;
        }
        // action.provideResult({ corners: activeCorners, airHeat: airHeat });
        return { corners: activeCorners, airHeat };
    }
    processAirHeat(activeCorners) {
        let consumedHeat = 0;
        const activeCornerCount = activeCorners.length;
        for (let i = 0; i < activeCornerCount; ++i) {
            const corner = activeCorners[i];
            if (corner.airHeat === 0)
                continue;
            let heatChange = Math.max(0, 
            // @ts-ignore
            Math.min(corner.airHeat, corner.heatAbsorption * (1 - corner.heat / corner.maxHeat)));
            // @ts-ignore
            corner.heat += heatChange;
            consumedHeat += heatChange;
            // @ts-ignore
            const heatLoss = corner.area * (corner.heat / corner.maxHeat) * 0.02;
            // @ts-ignore
            heatChange = Math.min(corner.airHeat, heatChange + heatLoss);
            // @ts-ignore
            const remainingCornerAirHeat = corner.airHeat - heatChange;
            corner.airHeat = 0;
            for (let j = 0; j < corner.corners.length; ++j) {
                // @ts-ignore
                const outflow = corner.airCurrentOutflows[j];
                if (outflow > 0) {
                    // @ts-ignore
                    corner.corners[j].newAirHeat += remainingCornerAirHeat * outflow;
                    activeCorners.push(corner.corners[j]);
                }
            }
        }
        activeCorners.splice(0, activeCornerCount);
        for (let i = 0; i < activeCorners.length; ++i) {
            const corner = activeCorners[i];
            corner.airHeat = corner.newAirHeat;
        }
        for (let i = 0; i < activeCorners.length; ++i) {
            activeCorners[i].newAirHeat = 0;
        }
        return consumedHeat;
    }
    calculateTemperature(corners, tiles, planetRadius) {
        for (let i = 0; i < corners.length; ++i) {
            const corner = corners[i];
            const latitudeEffect = Math.sqrt(1 - Math.abs(corner.position.y) / planetRadius);
            // @ts-ignore
            const elevationEffect = 1 - Math.pow(Math.max(0, Math.min(corner.elevation * 0.8, 1)), 2);
            // @ts-ignore
            const normalizedHeat = corner.heat / corner.area;
            corner.temperature = ((latitudeEffect * elevationEffect * 0.7 + normalizedHeat * 0.3) * 5) / 3 - 2 / 3;
            delete corner.airHeat;
            delete corner.newAirHeat;
            delete corner.heat;
            delete corner.maxHeat;
            delete corner.heatAbsorption;
        }
        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            tile.temperature = 0;
            for (let j = 0; j < tile.corners.length; ++j) {
                // @ts-ignore
                tile.temperature += tile.corners[j].temperature;
            }
            tile.temperature /= tile.corners.length;
        }
    }
    initializeAirMoisture(corners, moistureLevel) {
        const activeCorners = [];
        let airMoisture = 0;
        for (let i = 0; i < corners.length; ++i) {
            const corner = corners[i];
            corner.airMoisture =
                // @ts-ignore
                corner.elevation > 0
                    ? 0
                    : // @ts-ignore
                        corner.area * moistureLevel * Math.max(0, Math.min(0.5 + corner.temperature * 0.5, 1));
            corner.newAirMoisture = 0;
            corner.precipitation = 0;
            // @ts-ignore
            corner.precipitationRate = (0.0075 * corner.area) / Math.max(0.1, Math.min(corner.airCurrentSpeed, 1));
            // @ts-ignore
            corner.precipitationRate *= 1 + (1 - Math.max(0, Math.max(corner.temperature, 1))) * 0.1;
            // @ts-ignore
            if (corner.elevation > 0) {
                // @ts-ignore
                corner.precipitationRate *= 1 + corner.elevation * 0.5;
                // @ts-ignore
                corner.maxPrecipitation = corner.area * (0.25 + Math.max(0, Math.min(corner.elevation, 1)) * 0.25);
            }
            else {
                // @ts-ignore
                corner.maxPrecipitation = corner.area * 0.25;
            }
            activeCorners.push(corner);
            airMoisture += corner.airMoisture;
        }
        // action.provideResult({ corners: activeCorners, airMoisture: airMoisture });
        return { corners: activeCorners, airMoisture };
    }
    processAirMoisture(activeCorners) {
        let consumedMoisture = 0;
        const activeCornerCount = activeCorners.length;
        for (let i = 0; i < activeCornerCount; ++i) {
            const corner = activeCorners[i];
            if (corner.airMoisture === 0)
                continue;
            let moistureChange = Math.max(0, 
            // @ts-ignore
            Math.min(corner.airMoisture, corner.precipitationRate * (1 - corner.precipitation / corner.maxPrecipitation)));
            // @ts-ignore
            corner.precipitation += moistureChange;
            consumedMoisture += moistureChange;
            // @ts-ignore
            const moistureLoss = corner.area * (corner.precipitation / corner.maxPrecipitation) * 0.02;
            // @ts-ignore
            moistureChange = Math.min(corner.airMoisture, moistureChange + moistureLoss);
            // @ts-ignore
            const remainingCornerAirMoisture = corner.airMoisture - moistureChange;
            corner.airMoisture = 0;
            for (let j = 0; j < corner.corners.length; ++j) {
                // @ts-ignore
                const outflow = corner.airCurrentOutflows[j];
                if (outflow > 0) {
                    // @ts-ignore
                    corner.corners[j].newAirMoisture += remainingCornerAirMoisture * outflow;
                    activeCorners.push(corner.corners[j]);
                }
            }
        }
        activeCorners.splice(0, activeCornerCount);
        for (let i = 0; i < activeCorners.length; ++i) {
            const corner = activeCorners[i];
            corner.airMoisture = corner.newAirMoisture;
        }
        for (let i = 0; i < activeCorners.length; ++i) {
            activeCorners[i].newAirMoisture = 0;
        }
        return consumedMoisture;
    }
    calculateMoisture(corners, tiles) {
        for (let i = 0; i < corners.length; ++i) {
            const corner = corners[i];
            // @ts-ignore
            corner.moisture = corner.precipitation / corner.area / 0.5;
            delete corner.airMoisture;
            delete corner.newAirMoisture;
            delete corner.precipitation;
            delete corner.maxPrecipitation;
            delete corner.precipitationRate;
        }
        for (let i = 0; i < tiles.length; ++i) {
            const tile = tiles[i];
            tile.moisture = 0;
            for (let j = 0; j < tile.corners.length; ++j) {
                // @ts-ignore
                tile.moisture += tile.corners[j].moisture;
            }
            tile.moisture /= tile.corners.length;
        }
    }
}
exports.PlanetWeatherGenerator = PlanetWeatherGenerator;
//# sourceMappingURL=planet-weather-modificator.js.map