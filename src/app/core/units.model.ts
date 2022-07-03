import { ShellTypeEnum } from '../tank/shell/shell-type.enum';
import { TankTypeEnum } from '../tank/tank-type';

export type ShellDamageUnits = Record<ShellTypeEnum, number>;
export type ShellSpeedUnits = Record<ShellTypeEnum, number>;
export type TankArmorUnits = Record<TankTypeEnum, number>;
export type TankSpeedUnits = Record<TankTypeEnum, number>;

export interface Units {
  shellDamage: ShellDamageUnits;
  shellSpeed: ShellSpeedUnits;
  tankArmor: TankArmorUnits;
  tankSpeed: TankSpeedUnits;
}
