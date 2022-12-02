export enum StarStellarClass {
  O = 'O',
  B = 'B',
  A = 'A',
  F = 'F',
  G = 'G',
  K = 'K',
  M = 'M',
  // Dwarf = 'Dwarf',
}

export interface StarPhysicModel {
  mass: number;
  color: string;
  radius: number;
  volume: number;
  density: number;
  subtype: string;
  stellar_class: StarStellarClass;
  // habitable: boolean;
  evolution: boolean;
  luminosity: number;
  inner_limit: number;
  outer_limit: number;
  frost_line: number;
  temperature: number;
  surface_area: number;
  circumference: number;
  main_sequence_lifetime: number;
  habitable_zone: number;
  habitable_zone_inner: number;
  habitable_zone_outer: number;
}

export interface StarStellarClassData {
  class: StarStellarClass;
  min_sol_mass: number;
  max_sol_mass: number;
  min_kelvin_temperature: number;
  max_kelvin_temperature: number;
  organisms_evolution: boolean;
}

export class StarPhysics {
  private constructor() {}

  static readonly SUN_AGE = 4.603e9; // 4603000000 YEARS
  static readonly SUN_TEMPERATURE = 5778; // (K)
  static readonly SPECTRAL_CLASSIFICATION: StarStellarClassData[] = [
    {
      class: StarStellarClass.O,
      max_sol_mass: 50,
      min_sol_mass: 16,
      max_kelvin_temperature: Number.MAX_SAFE_INTEGER,
      min_kelvin_temperature: 31000,
      organisms_evolution: false,
    },
    {
      class: StarStellarClass.B,
      max_sol_mass: 16,
      min_sol_mass: 2.1,
      max_kelvin_temperature: 31000,
      min_kelvin_temperature: 9750,
      organisms_evolution: false,
    },
    {
      class: StarStellarClass.A,
      max_sol_mass: 2.1,
      min_sol_mass: 1.4,
      max_kelvin_temperature: 9750,
      min_kelvin_temperature: 7100,
      organisms_evolution: false,
    },
    {
      class: StarStellarClass.F,
      max_sol_mass: 1.4,
      min_sol_mass: 1.04,
      max_kelvin_temperature: 7100,
      min_kelvin_temperature: 5950,
      organisms_evolution: true,
    },
    {
      class: StarStellarClass.G,
      max_sol_mass: 1.04,
      min_sol_mass: 0.8,
      max_kelvin_temperature: 5950,
      min_kelvin_temperature: 5250,
      organisms_evolution: true,
    },
    {
      class: StarStellarClass.K,
      max_sol_mass: 0.8,
      min_sol_mass: 0.45,
      max_kelvin_temperature: 5250,
      min_kelvin_temperature: 3950,
      organisms_evolution: true,
    },
    {
      class: StarStellarClass.M,
      max_sol_mass: 0.45,
      min_sol_mass: 0.08,
      max_kelvin_temperature: 3950,
      // min_kelvin_temperature: 2000, // todo proper value
      min_kelvin_temperature: 1000,
      organisms_evolution: false,
    },
    // TODO BROWN DWARF - 'often without planets' /wiki
    // {
    //   class: StarStellarClass.Dwarf,
    //   max_sol_mass: 0.08,
    //   min_sol_mass: 0.013,
    //   max_kelvin_temperature: 2000,
    //   min_kelvin_temperature: 1000,
    //   organisms_evolution: false,
    //   iluminosity: false,
    // }
  ];
  static readonly spectrallClasses = this.SPECTRAL_CLASSIFICATION.map((data) => data.class);
  static getSpectralByMass(mass: number) {
    return this.SPECTRAL_CLASSIFICATION.find(
      (data) => data.min_sol_mass <= mass && mass < data.max_sol_mass
    ) as StarStellarClassData;
  }
  static getSpectralByClass(stellarClass: string) {
    return this.SPECTRAL_CLASSIFICATION.find((data) => data.class === stellarClass) as StarStellarClassData;
  }
  static getSpectralByTemperature(temperature: number) {
    return this.SPECTRAL_CLASSIFICATION.find(
      (data) => data.min_kelvin_temperature <= temperature && temperature < data.max_kelvin_temperature
    ) as StarStellarClassData;
  }

  static calcLuminosity(mass: number) {
    switch (true) {
      case mass < 0.43:
        return 0.23 * Math.pow(mass, 2.3);
      case mass < 2 && mass >= 0.43:
        return Math.pow(mass, 4);
      case mass < 20 && mass >= 2:
        return 1.5 * Math.pow(mass, 3.5);
      case mass >= 20:
      default: // todo should be default?
        return 3200 * mass;
    }
  }
  static calcRadius(mass: number) {
    const exponent = mass > 1 ? 0.5 : 0.8;
    return Math.pow(mass, exponent);
  }
  static calcTemperature(luminosity: number, radius: number) {
    return Math.pow(luminosity / Math.pow(radius, 2), 1 / 4);
  }
  static calcColor(temperature: number) {
    const kelvins = this.solTemperatureToKelvin(temperature);
    return this.temperatureToColor(kelvins);
  }
  static calcVolume(radius: number) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3);
  }
  static calcDensity(mass: number, radius: number) {
    return mass / ((4 / 3) * Math.PI * Math.pow(radius, 3));
  }
  static calcFrostLine(luminosity: number) {
    return 4.85 * Math.sqrt(luminosity);
  }
  static calcMainSequenceLifetime(mass: number, luminosity: number) {
    return mass / luminosity;
  }
  static calcCircumference(radius: number) {
    return 2 * Math.PI * radius;
  }
  static calcSurfaceArea(radius: number) {
    return 4 * Math.PI * Math.pow(radius, 2);
  }
  static calcInnerLimit(mass: number) {
    let limit = 0.1 * mass;
    if (limit < 0.15) limit = 0.15;
    return limit;
  }
  static calcOuterLimit(mass: number) {
    return 40 * mass;
  }
  static calcHabitableZone(luminosity: number) {
    return Math.sqrt(luminosity);
  }
  static calcHabitableZoneStart(luminosity: number) {
    return Math.sqrt(luminosity / 1.1);
  }
  static calcHabitableZoneEnd(luminosity: number) {
    return Math.sqrt(luminosity / 0.53);
  }

  static solLifetimeToYears(mainSequenceLifetime: number) {
    return mainSequenceLifetime * this.SUN_AGE;
  }
  static solTemperatureToKelvin(temp = 1) {
    return temp * this.SUN_TEMPERATURE;
  }
  static temperatureToColor(kelvinTemperature: number) {
    // temperature *= 5778 // SUN TEMPERATURE IN KELVINS
    const closestTemp = closest(
      kelvinTemperature,
      TemperatureColors.map((e) => e[1])
    );
    const index = TemperatureColors.findIndex((c) => c[1] == closestTemp);
    return TemperatureColors[index][0];
  }
}

// --- Star Color utils --- //
const closest = (num: number, arr: number[]) => {
  let curr = arr[0];
  let diff = Math.abs(num - curr);
  arr.forEach((value) => {
    const newdiff = Math.abs(num - value);
    if (newdiff < diff) {
      diff = newdiff;
      curr = value;
    }
  });
  return curr;
};

const numberToHex = (num: number) => {
  const hex = num.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};
const rgbToHexColor = (r: number, g: number, b: number) => {
  return `#${numberToHex(r)}${numberToHex(g)}${numberToHex(b)}`;
};

const TemperatureColors = [
  [rgbToHexColor(155, 188, 255), 40000],
  [rgbToHexColor(155, 188, 255), 39500],
  [rgbToHexColor(155, 188, 255), 39000],
  [rgbToHexColor(155, 188, 255), 38500],
  [rgbToHexColor(156, 188, 255), 38000],
  [rgbToHexColor(156, 188, 255), 37500],
  [rgbToHexColor(156, 189, 255), 37000],
  [rgbToHexColor(156, 189, 255), 36500],
  [rgbToHexColor(156, 189, 255), 36000],
  [rgbToHexColor(157, 189, 255), 35500],
  [rgbToHexColor(157, 189, 255), 35000],
  [rgbToHexColor(157, 189, 255), 34500],
  [rgbToHexColor(157, 189, 255), 34000],
  [rgbToHexColor(157, 189, 255), 33500],
  [rgbToHexColor(158, 190, 255), 33000],
  [rgbToHexColor(158, 190, 255), 32500],
  [rgbToHexColor(158, 190, 255), 32000],
  [rgbToHexColor(158, 190, 255), 31500],
  [rgbToHexColor(159, 190, 255), 31000],
  [rgbToHexColor(159, 190, 255), 30500],
  [rgbToHexColor(159, 191, 255), 30000],
  [rgbToHexColor(159, 191, 255), 29500],
  [rgbToHexColor(160, 191, 255), 29000],
  [rgbToHexColor(160, 191, 255), 28500],
  [rgbToHexColor(160, 191, 255), 28000],
  [rgbToHexColor(161, 192, 255), 27500],
  [rgbToHexColor(161, 192, 255), 27000],
  [rgbToHexColor(161, 192, 255), 26500],
  [rgbToHexColor(162, 192, 255), 26000],
  [rgbToHexColor(162, 193, 255), 25500],
  [rgbToHexColor(163, 193, 255), 25000],
  [rgbToHexColor(163, 193, 255), 24500],
  [rgbToHexColor(163, 194, 255), 24000],
  [rgbToHexColor(164, 194, 255), 23500],
  [rgbToHexColor(164, 194, 255), 23000],
  [rgbToHexColor(165, 195, 255), 22500],
  [rgbToHexColor(166, 195, 255), 22000],
  [rgbToHexColor(166, 195, 255), 21500],
  [rgbToHexColor(167, 196, 255), 21000],
  [rgbToHexColor(168, 196, 255), 20500],
  [rgbToHexColor(168, 197, 255), 20000],
  [rgbToHexColor(169, 197, 255), 19500],
  [rgbToHexColor(170, 198, 255), 19000],
  [rgbToHexColor(171, 198, 255), 18500],
  [rgbToHexColor(172, 199, 255), 18000],
  [rgbToHexColor(173, 200, 255), 17500],
  [rgbToHexColor(174, 200, 255), 17000],
  [rgbToHexColor(175, 201, 255), 16500],
  [rgbToHexColor(176, 202, 255), 16000],
  [rgbToHexColor(177, 203, 255), 15500],
  [rgbToHexColor(179, 204, 255), 15000],
  [rgbToHexColor(180, 205, 255), 14500],
  [rgbToHexColor(182, 206, 255), 14000],
  [rgbToHexColor(184, 207, 255), 13500],
  [rgbToHexColor(186, 208, 255), 13000],
  [rgbToHexColor(188, 210, 255), 12500],
  [rgbToHexColor(191, 211, 255), 12000],
  [rgbToHexColor(193, 213, 255), 11500],
  [rgbToHexColor(196, 215, 255), 11000],
  [rgbToHexColor(200, 217, 255), 10500],
  [rgbToHexColor(204, 219, 255), 10000],
  [rgbToHexColor(208, 222, 255), 9500],
  [rgbToHexColor(214, 225, 255), 9000],
  [rgbToHexColor(220, 229, 255), 8500],
  [rgbToHexColor(227, 233, 255), 8000],
  [rgbToHexColor(235, 238, 255), 7500],
  [rgbToHexColor(245, 243, 255), 7000],
  [rgbToHexColor(255, 249, 253), 6500],
  [rgbToHexColor(255, 243, 239), 6000],
  [rgbToHexColor(255, 236, 224), 5500],
  [rgbToHexColor(255, 228, 206), 5000],
  [rgbToHexColor(255, 219, 186), 4500],
  [rgbToHexColor(255, 209, 163), 4000],
  [rgbToHexColor(255, 196, 137), 3500],
  [rgbToHexColor(255, 180, 107), 3000],
  [rgbToHexColor(255, 161, 72), 2500],
  [rgbToHexColor(255, 137, 18), 2000],
  [rgbToHexColor(255, 109, 0), 1500],
  [rgbToHexColor(255, 51, 0), 1000],
] as const;
