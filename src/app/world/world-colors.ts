import { WorldTypeEnum } from './world-type.enum';

export type WorldColors = Record<WorldTypeEnum, string>;

export const WORLD_COLORS = {
  [WorldTypeEnum.A]: '#8f7a4f',
  [WorldTypeEnum.B]: '#5b7e20',
  [WorldTypeEnum.C]: '#775a4a',
};
