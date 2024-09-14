export var SystemZone;
(function (SystemZone) {
    SystemZone["Habitable"] = "habitable";
    SystemZone["Inner"] = "inner";
    SystemZone["Outer"] = "outer";
})(SystemZone || (SystemZone = {}));
export class OrbitPhysic {
    constructor() { }
    /**
     * @param centerMass center of mass mass
     * @param distance average distance from center of mass
     * @returns orbital period in EARTH_YEARS
     */
    static calcOrbitalPeriod(centerMass, distance) {
        return Math.sqrt(Math.pow(distance, 3) / centerMass);
    }
    /**
     * @param orbitalPeriod orbital period in EARTH_YEAR
     * @returns orbital period in EARTH_DAYS
     */
    static convertOrbitalPeriodToDays(orbitalPeriod) {
        return Math.floor(orbitalPeriod * this.EARTH_YEAR_IN_DAYS);
    }
    static calcZone(distance, physic) {
        switch (true) {
            case distance > physic.habitable_zone_inner && distance < physic.habitable_zone_outer:
                return SystemZone.Habitable;
            case distance < physic.frost_line:
                return SystemZone.Inner;
            case distance > physic.frost_line:
            default:
                return SystemZone.Outer;
        }
    }
    static sortByDistance(mx, my) {
        return mx.distance - my.distance;
    }
}
OrbitPhysic.EARTH_YEAR_IN_DAYS = 365;
