import { HullTypeEnum } from '../hull/hull-type.enum';

export interface TrackStyle {
  height: string;
  offset: string;
  bottom: string;
}

export type TrackStyles = Record<HullTypeEnum, TrackStyle>;

export const TRACK_STYLES: TrackStyles = {
  [HullTypeEnum.One]: { height: '100%', offset: '15%', bottom: '0' },
  [HullTypeEnum.Two]: { height: '100%', offset: '15%', bottom: '0' },
  [HullTypeEnum.Three]: { height: '98%', offset: '22%', bottom: '3%' },
  [HullTypeEnum.Four]: { height: '83%', offset: '26%', bottom: '3%' },
  [HullTypeEnum.Five]: { height: '100%', offset: '16%', bottom: '0' },
  [HullTypeEnum.Six]: { height: '100%', offset: '16%', bottom: '0' },
  [HullTypeEnum.Seven]: { height: '100%', offset: '20%', bottom: '0' },
  [HullTypeEnum.Eight]: { height: '88%', offset: '25%', bottom: '6%' },
};
