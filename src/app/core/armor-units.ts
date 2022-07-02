import { ArmorTypeEnum } from '../tank/armor-type.enum';

export const ARMOR_UNITS: Record<ArmorTypeEnum, number> = {
  [ArmorTypeEnum.Light]: 1,
  [ArmorTypeEnum.Medium]: 2,
  [ArmorTypeEnum.Heavy]: 3
};
