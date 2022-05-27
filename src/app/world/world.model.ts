import { WorldTypeEnum } from './world-type.enum';

export interface World {
  type: WorldTypeEnum;
  size: number;
  squaresPerSide: number;
}
