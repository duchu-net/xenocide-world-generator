import { Vector3 } from 'three';

interface ProtostarModel {
  position: Vector3;
  temperature?: number;
  galaxy_size?: number;
}

export class Protostar {
  position: Vector3;
  temperature?: number;
  galaxy_size?: number;

  constructor(model: ProtostarModel) {
    this.position = model.position;
    this.temperature = model.temperature;
    this.galaxy_size = model.galaxy_size;
  }

  offset(offset: Vector3) {
    this.position.add(offset);
    return this;
  }

  swirl(axis: Vector3, amount: number) {
    var d = this.position.length();
    var angle = Math.pow(d, 0.1) * amount;
    this.position.applyAxisAngle(axis, angle);
    return this;
  }
}
