import { WorldSizeEnum } from './world-size.enum';

export type WorldSizes = Record<WorldSizeEnum, number>;

export const WORLD_SIZES = {
  [WorldSizeEnum.Small]: 10,
  [WorldSizeEnum.Medium]: 12,
  [WorldSizeEnum.Large]: 14,
};
