import { ExplosionTypeEnum } from './explosion/explosion-type.enum';
import { WorldTypeEnum } from './world-type.enum';

export interface World {
  isAssetsRandomRotationEnabled: boolean;
  isFullyDestroyableTanks: boolean;
  collisionExplosionType: ExplosionTypeEnum;
  resetTimeout: number;
  size: number;
  showBlastTrail: boolean;
  squaresPerSide: number;
  startTimeout: number;
  type: WorldTypeEnum;
}
