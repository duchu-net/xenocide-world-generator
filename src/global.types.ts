export type GalaxyPath = `${string}`;

type SystemName = `${string}`;
export type SystemPath = `${GalaxyPath}/${SystemName}`;

type StarName = `${string}`;
export type StarPath = `${SystemPath}/s:${StarName}`;

export type BeltPath = `${SystemPath}/b:${SystemName}_${string}`;

export type PlanetPath = `${SystemPath}/p:${SystemName}_${string}`;

type RegionName = `${number}`;
export type RegionPath = `${PlanetPath}/r:${RegionName}`;
