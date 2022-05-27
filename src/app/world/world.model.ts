import { WorldTypeEnum } from './world-type.enum';

export interface World {
  type: WorldTypeEnum;
  size: number;
  showBlastTrail: boolean;
  squaresPerSide: number;
}
