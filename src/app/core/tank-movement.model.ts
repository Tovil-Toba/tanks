import { DirectionEnum } from '../shared/direction.enum';

export interface TankMovement {
  direction: DirectionEnum;
  canMove: boolean;
}
