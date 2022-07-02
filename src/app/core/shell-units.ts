import { ShellTypeEnum } from '../tank/shell/shell-type.enum';

export const SHELL_UNITS: Record<ShellTypeEnum, number> = {
  [ShellTypeEnum.Grenade]: 3,
  [ShellTypeEnum.Heavy]: 3,
  [ShellTypeEnum.Laser]: 3,
  [ShellTypeEnum.Light]: 1,
  [ShellTypeEnum.Medium]: 2,
  [ShellTypeEnum.Plasma]: 3,
  [ShellTypeEnum.Shotgun]: 3
};
