import { SquareTypeEnum } from './square-type.enum';
import { ExplosionTypeEnum } from '../explosion/explosion-type.enum';

export interface Square {
  bottom: number;
  explosionType?: ExplosionTypeEnum
  index: number;
  isDestroyable: boolean;
  isPassable: boolean; // для воды и для ежей
  left: number;
  right: number;
  speedMultiplier?: number;
  top: number;
  type: SquareTypeEnum;
}
