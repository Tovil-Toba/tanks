import { ExplosionTypeEnum } from './explosion/explosion-type.enum';
import { WorldTypeEnum } from './world-type.enum';

export interface World {
  collisionExplosionType: ExplosionTypeEnum;
  size: number;
  showBlastTrail: boolean;
  squaresPerSide: number;
  type: WorldTypeEnum;
}
