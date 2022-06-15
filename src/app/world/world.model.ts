import { ExplosionTypeEnum } from './explosion/explosion-type.enum';
import { WorldTypeEnum } from './world-type.enum';

export interface World {
  isAssetsRandomRotationEnabled: boolean;
  collisionExplosionType: ExplosionTypeEnum;
  resetTimeout: number;
  size: number;
  showBlastTrail: boolean;
  squaresPerSide: number;
  type: WorldTypeEnum;
}
