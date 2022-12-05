export interface SystemModel {
  starColor?: string;
  habitable?: boolean;
  starRadius?: number;
  name?: string;
  position?: Vector3;
  temperature?: number;
  starsSeed?: number;
  planetsSeed?: number;

  stars?: StarModel[];
  orbits?: (PlanetModel | DebrisBeltModel | EmptyZoneModel)[];
  options?: {};
}
