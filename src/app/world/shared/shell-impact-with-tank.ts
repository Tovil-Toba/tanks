import { ShellTypeEnum } from '../../tank/shell/shell-type.enum';
import { TankIndex } from '../../tank/tank-index.model';

export interface ShellImpactWithTank {
  parentTankIndex: TankIndex;
  shellType: ShellTypeEnum;
  targetTankIndex: TankIndex;
}
