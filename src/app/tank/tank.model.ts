import { ArmorTypeEnum } from './armor-type.enum';
import { ExplosionTypeEnum } from '../world/explosion/explosion-type.enum';
import { FlashTypeEnum } from './flash/flash-type.enum';
import { GunTypeEnum } from './gun/gun-type.enum';
import { HullTypeEnum } from './hull/hull-type.enum';
import { ShellTypeEnum } from './shell/shell-type.enum';
import { ShellImpactTypeEnum } from './shell/shell-impact/shell-impact-type.enum';
import { TankColorEnum } from './tank-color.enum';
import { TankTypeEnum } from './tank-type';
import { TrackTypeEnum } from './track/track-type.enum';
import { TurretTypeEnum } from './turret/turret-type.enum';

export interface Tank {
  armorType: ArmorTypeEnum; // todo: не нужно, достаточно type: TankTypeEnum
  color: TankColorEnum;
  explosionType: ExplosionTypeEnum;
  flashType: FlashTypeEnum;
  gunColor: TankColorEnum;
  gunType: GunTypeEnum;
  hullColor: TankColorEnum;
  hullType: HullTypeEnum;
  name?: string;
  shellType: ShellTypeEnum;
  shellImpactType: ShellImpactTypeEnum;
  shellSpeed: number;
  speed: number;
  turboMultiplier: number;
  trackType: TrackTypeEnum;
  turretType: TurretTypeEnum;
  type: TankTypeEnum;
}
