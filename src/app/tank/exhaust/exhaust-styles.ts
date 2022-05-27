import { HullTypeEnum } from '../hull/hull-type.enum';

export interface ExhaustStyle {
  offset: string;
  top: string;
}

export type ExhaustStyles = Record<HullTypeEnum, ExhaustStyle>;

export const EXHAUST_STYLES: ExhaustStyles = {
  [HullTypeEnum.One]: { offset: '6%', top: '45%' },
  [HullTypeEnum.Two]: { offset: '5%', top: '39%' },
  [HullTypeEnum.Three]: { offset: '6%', top: '44%' },
  [HullTypeEnum.Four]: { offset: '5%', top: '43%' },
  [HullTypeEnum.Five]: { offset: '7%', top: '45%' },
  [HullTypeEnum.Six]: { offset: '5%', top: '44%' },
  [HullTypeEnum.Seven]: { offset: '5%', top: '47%' },
  [HullTypeEnum.Eight]: { offset: '5%', top: '42%' },
};
