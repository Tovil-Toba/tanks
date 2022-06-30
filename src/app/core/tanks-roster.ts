import { ArmorTypeEnum } from '../tank/armor-type.enum';
import defaultSettings from './default-settings';
import { ExplosionTypeEnum } from '../world/explosion/explosion-type.enum';
import { FlashTypeEnum } from '../tank/flash/flash-type.enum';
import { GunTypeEnum } from '../tank/gun/gun-type.enum';
import { HullTypeEnum } from '../tank/hull/hull-type.enum';
import { ShellTypeEnum } from '../tank/shell/shell-type.enum';
import { ShellImpactTypeEnum } from '../tank/shell/shell-impact/shell-impact-type.enum';
import { TankColorEnum } from '../tank/tank-color.enum';
import { TanksRoster } from './tanks-roster.model';
import { TankTypeEnum } from '../tank/tank-type';
import { TrackTypeEnum } from '../tank/track/track-type.enum';
import { TurretTypeEnum } from '../tank/turret/turret-type.enum';

export const TANKS_ROSTER: TanksRoster = {
  1: {
    armor: ArmorTypeEnum.Heavy,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.One,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.One,
    shellType: ShellTypeEnum.Heavy,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed,
    speed: defaultSettings.tank.speed,
    turboMultiplier: defaultSettings.tank.turboMultiplier,
    trackType: TrackTypeEnum.One,
    turretType: TurretTypeEnum.One,
    type: TankTypeEnum.Heavy
  },
  2: {
    armor: ArmorTypeEnum.Heavy,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.Two,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.Two,
    shellType: ShellTypeEnum.Heavy,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed,
    speed: defaultSettings.tank.speed,
    turboMultiplier: defaultSettings.tank.turboMultiplier,
    trackType: TrackTypeEnum.Two,
    turretType: TurretTypeEnum.Two,
    type: TankTypeEnum.Heavy
  },
  3: {
    armor: ArmorTypeEnum.Medium,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.Three,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.Three,
    shellType: ShellTypeEnum.Medium,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed, // todo: скорость среднего выстрела
    speed: 1, // todo: скорость среднего танка
    turboMultiplier: defaultSettings.tank.turboMultiplier, // todo: ускорение среднего танка
    trackType: TrackTypeEnum.Three,
    turretType: TurretTypeEnum.Three,
    type: TankTypeEnum.Medium
  },
  4: {
    armor: ArmorTypeEnum.Light,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.Four,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.Four,
    shellType: ShellTypeEnum.Light,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed, // todo: скорость легкого выстрела
    speed: 1.25, // todo: скорость легкого танка
    turboMultiplier: defaultSettings.tank.turboMultiplier, // todo: ускорение легкого танка
    trackType: TrackTypeEnum.Four,
    turretType: TurretTypeEnum.Four,
    type: TankTypeEnum.Light
  },
  5: {
    armor: ArmorTypeEnum.Heavy,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.Five,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.Five,
    shellType: ShellTypeEnum.Heavy,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed,
    speed: defaultSettings.tank.speed,
    turboMultiplier: defaultSettings.tank.turboMultiplier,
    trackType: TrackTypeEnum.One,
    turretType: TurretTypeEnum.Five,
    type: TankTypeEnum.Heavy
  },
  6: {
    armor: ArmorTypeEnum.Heavy,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.Five, // Six - спаренная пушка
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.Six,
    shellType: ShellTypeEnum.Heavy,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed,
    speed: defaultSettings.tank.speed,
    turboMultiplier: defaultSettings.tank.turboMultiplier,
    trackType: TrackTypeEnum.Two,
    turretType: TurretTypeEnum.Six,
    type: TankTypeEnum.Heavy
  },
  7: {
    armor: ArmorTypeEnum.Medium,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.Seven,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.Seven,
    shellType: ShellTypeEnum.Medium,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed, // todo: скорость среднего выстрела
    speed: 1, // todo: скорость среднего танка
    turboMultiplier: defaultSettings.tank.turboMultiplier, // todo: ускорение среднего танка
    trackType: TrackTypeEnum.Three,
    turretType: TurretTypeEnum.Seven,
    type: TankTypeEnum.Medium
  },
  8: {
    armor: ArmorTypeEnum.Light,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.Eight,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.Eight,
    shellType: ShellTypeEnum.Light,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: defaultSettings.tank.shellSpeed, // todo: скорость легкого выстрела
    speed: 1.25, // todo: скорость легкого танка
    turboMultiplier: defaultSettings.tank.turboMultiplier, // todo: ускорение легкого танка
    trackType: TrackTypeEnum.Four,
    turretType: TurretTypeEnum.Eight,
    type: TankTypeEnum.Light
  },
};
