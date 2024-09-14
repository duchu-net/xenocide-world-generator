const SECONDS_IN_DAY = 86400;
const G = 6.6743e-11; // gravitational constant
const EARTH_MASS_IN_KG = 5.972e24; // Earth mass in kg
const AU_IN_M = 1.496e11; // Astronomical unit in meters
const EARTH_RADIUS = 6371;
const JUPITER_MASS_IN_EARTH_MASS = 317.83;
const JUPITER_RADIUS_IN_EARTH_RADIUS = 11.209;
const JUPITER_RADIUS = EARTH_RADIUS * JUPITER_RADIUS_IN_EARTH_RADIUS;
const HABITABLE_WORLD_DENSITY = [3, 8]; // h/cm3
const TERRAN_MASS_RANGE = [0.1, 10];
const PLANET_MASS = [0.1, 13 * JUPITER_MASS_IN_EARTH_MASS];
const PLANET_RADIUS = [0.5, 3 * JUPITER_RADIUS_IN_EARTH_RADIUS];
const PLANET_CLASSIFICATION = [
    {
        class: 'lava',
        subClass: 'terrestial',
        mass: [0.1, 2],
        radius: [0.5, 1.2],
        // gravity: [0.4, 1.6],
        // cmf: [0.3, 0.4],
        probability: 0.2,
        color: ['#FF5722'],
        when: (star, orbit) => orbit.distance < star.habitable_zone_inner * 0.7,
    },
    {
        /* rocky planet without surface water */
        class: 'rocky',
        subClass: 'terrestial',
        mass: [0.1, 10],
        radius: [0.5, 1.5],
        gravity: [0.4, 1.6],
        cmf: [0.3, 0.4],
        probability: 0.2,
        color: ['#9E9E9E'],
        when: () => true,
    },
    {
        /* earth like planet, with ocean and landmasses */
        class: 'terran',
        subClass: 'terrestial',
        mass: [0.1, 10],
        radius: [0.5, 1.5],
        gravity: [0.4, 1.6],
        cmf: [0.3, 0.4],
        probability: 1,
        color: ['#4CAF50'],
        // color: ['green'],
        when: (star, orbit) => orbit.distance > star.habitable_zone_inner && orbit.distance < star.habitable_zone_outer,
    },
    {
        /* ocean planet without core, or with very small = no resources available, no advanced life */
        class: 'coreless-watery',
        subClass: 'liquid',
        mass: [0.1, 10],
        radius: [0.5, 1.5],
        probability: 0.1,
        color: ['#2196F3'],
        when: (star, orbit) => orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line,
    },
    {
        /* ocean planet with core and islands */
        class: 'watery',
        subClass: 'terrestial',
        mass: [0.1, 10],
        radius: [0.5, 1.5],
        probability: 0.2,
        color: ['#00BCD4'],
        when: (star, orbit) => orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line,
    },
    {
        class: 'icy',
        subClass: 'terrestial',
        mass: [0.1, 10],
        radius: [0.5, 1.5],
        probability: 0.2,
        color: ['#03A9F4'],
        when: (star, orbit) => orbit.distance > star.frost_line,
    },
    {
        /* hot ice planet - enought big mass (and graviti) keeps ice under big pressure, don't allow melt even in 700K */
        class: 'hot-icy',
        subClass: 'terrestial',
        mass: [3, 10],
        radius: [0.5, 1.5],
        probability: 0.05,
        color: ['#E91E63'],
        when: (star, orbit) => orbit.distance < star.habitable_zone_inner * 0.5,
    },
    {
        /* iron reach and big core, form close to star, where asteroid has heavy elements */
        class: 'super_mercury',
        subClass: 'terrestial',
        mass: [1, 10],
        radius: [0.5, 1.5],
        probability: 0.05,
        color: ['#FFC107'],
        when: (star, orbit) => orbit.distance < star.habitable_zone_inner,
    },
    {
        class: 'puffy_giant',
        subClass: 'gas',
        mass: [1 * JUPITER_MASS_IN_EARTH_MASS, 2 * JUPITER_MASS_IN_EARTH_MASS],
        radius: [1 * JUPITER_RADIUS_IN_EARTH_RADIUS, 3 * JUPITER_RADIUS_IN_EARTH_RADIUS],
        probability: 0.1,
        color: ['#FF9800'],
        when: (star, orbit) => orbit.distance < star.frost_line * 0.5,
    },
    {
        class: 'jupiter', // jupiter like
        subClass: 'gas',
        mass: [10, 2 * JUPITER_MASS_IN_EARTH_MASS],
        radius: [0.9 * JUPITER_RADIUS_IN_EARTH_RADIUS, 1.5 * JUPITER_RADIUS_IN_EARTH_RADIUS],
        probability: 0.3,
        color: ['#FF5722'],
        when: (star, orbit) => orbit.distance > star.frost_line && orbit.distance < star.outer_limit * 0.7,
        // orbit.distance < star.frost_line + (star.outer_limit - star.frost_line) * 0.4,
    },
    {
        /* jupiter migrated from behind frost_line (todo: earth like planet with 2Me can be created after migration) */
        class: 'hot_jupiter',
        subClass: 'gas',
        mass: [1 * JUPITER_MASS_IN_EARTH_MASS, 2 * JUPITER_MASS_IN_EARTH_MASS],
        radius: [0.9 * JUPITER_RADIUS_IN_EARTH_RADIUS, 1.5 * JUPITER_RADIUS_IN_EARTH_RADIUS],
        probability: 0.05,
        color: ['#F44336'],
        when: (star, orbit) => orbit.distance > 0.04 && orbit.distance < 0.5,
    },
    {
        class: 'super_jupiter',
        subClass: 'gas',
        mass: [2 * JUPITER_MASS_IN_EARTH_MASS, 13 * JUPITER_MASS_IN_EARTH_MASS],
        radius: [0.8 * JUPITER_RADIUS_IN_EARTH_RADIUS, 1.2 * JUPITER_RADIUS_IN_EARTH_RADIUS],
        probability: 0.3,
        color: ['#9C27B0'],
        when: (star, orbit) => orbit.distance > star.frost_line + 1 && orbit.distance < star.frost_line + 2,
    },
    {
        class: 'gas_dwarf',
        subClass: 'gas',
        mass: [1, 20],
        radius: [2, 0.8 * JUPITER_RADIUS_IN_EARTH_RADIUS],
        probability: 0.2,
        color: ['#FFEB3B'],
        when: (star, orbit) => orbit.distance > star.outer_limit * 0.5,
    },
    {
        class: 'ice_giant', // neptune like, todo hot_neptune
        subClass: 'ice',
        mass: [10, 50],
        radius: [3, 0.6 * JUPITER_RADIUS_IN_EARTH_RADIUS],
        probability: 0.2,
        color: ['#673AB7'],
        when: (star, orbit) => orbit.distance > star.frost_line * 1.2,
    },
];
export class PlanetPhysic {
    constructor() { }
    // todo needs check
    /**
     * @param radius planet radius
     * @returns rotation period in EARTH DAYS // todo in hours?
     */
    static calcRotationalPeriod(mass, radius, distance) {
        // Convert mass from Earth masses to kg
        const massInKg = mass * EARTH_MASS_IN_KG;
        // Convert radius from Earth radii to meters
        const radiusInMeters = radius * (EARTH_RADIUS * 1000);
        // Convert distance from AU to meters
        const distanceInMeters = distance * AU_IN_M;
        const period = 2 * Math.PI * Math.sqrt(Math.pow(distanceInMeters, 3) / (G * massInKg));
        // Adjust for the planet's radius
        const circumference = 2 * Math.PI * radiusInMeters;
        const adjustedPeriod = period * (circumference / distanceInMeters);
        // console.log(period / SECONDS_IN_DAY, adjustedPeriod / SECONDS_IN_DAY);
        return adjustedPeriod / SECONDS_IN_DAY /* todo - probably return completle fictional values xD */ / 100;
    }
    static calcDensity(mass, cmf = 0.35) {
        if (mass > 0.6)
            return (5.51 * Math.pow(mass, 0.189)) / Math.pow(1.07 - 0.21 * cmf, 3);
        if ((5.51 * Math.pow(mass, 0.189)) / Math.pow(1.07 - 0.21 * cmf, 3) > 3.5 + 4.37 * cmf)
            return (5.51 * Math.pow(mass, 0.189)) / Math.pow(1.07 - 0.21 * cmf, 3);
        return 3.5 + 4.37 * cmf;
    }
    static calcRadius(mass, density) {
        return Math.pow(mass / (density / 5.51), 1 / 3);
    }
    static calcGravity(mass, radius) {
        return Math.pow(mass / radius, 2);
    }
    static getClass(planetClass) {
        return this.PLANET_CLASSIFICATION.find((matrice) => matrice.class === planetClass);
    }
    static getClassColor(planetClass) {
        var _a;
        return ((_a = this.getClass(planetClass)) === null || _a === void 0 ? void 0 : _a.color[0]) || 'white';
    }
}
/* (km) */
PlanetPhysic.EARTH_RADIUS = EARTH_RADIUS;
// static EARTH_MASS =
// static JUPITER_MASS =
PlanetPhysic.PLANET_MASS = PLANET_MASS;
PlanetPhysic.PLANET_RADIUS = PLANET_RADIUS;
PlanetPhysic.JUPITER_RADIUS = JUPITER_RADIUS;
PlanetPhysic.JUPITER_MASS_IN_EARTH_MASS = JUPITER_MASS_IN_EARTH_MASS;
PlanetPhysic.JUPITER_RADIUS_IN_EARTH_RADIUS = JUPITER_RADIUS_IN_EARTH_RADIUS;
PlanetPhysic.PLANET_CLASSIFICATION = PLANET_CLASSIFICATION;
