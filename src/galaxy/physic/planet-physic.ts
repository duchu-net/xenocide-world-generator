export interface PlanetPhysicModel {
  mass: number;

  // ORBIT
  semi_major_axis: number; // (a) półoś wielka
  eccentricity: number; // (e, 0-1) ekscentryczność/mimośród
  inclination: number; // (i, DEG) nachylenie orbity
  longitude_of_the_ascending_node: number; // (Ω Omega, 0-360 DEG) długość węzła wstępującego
  argument_of_periapsis: number; // (ω, omega, 0-360 DEG)  argument perycentrum
  true_anomaly: number; // (θ theta, 0-360 DEG) anomalia prawdziwa
  orbital_period: number; // (P, EARTH YEAR) okres orbitalny/rok
  orbital_velocity: number; // (Vo, EARTH SPEED) prędkość orbitalna
}
