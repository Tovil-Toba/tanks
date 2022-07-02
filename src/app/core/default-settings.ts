import { ArmorTypeEnum } from '../tank/armor-type.enum';
import { ExplosionTypeEnum } from '../world/explosion/explosion-type.enum';
import { FlashTypeEnum } from '../tank/flash/flash-type.enum';
import { GunTypeEnum } from '../tank/gun/gun-type.enum';
import { HullTypeEnum } from '../tank/hull/hull-type.enum';
import { Settings } from './settings.model';
import { ShellTypeEnum } from '../tank/shell/shell-type.enum';
import { ShellImpactTypeEnum } from '../tank/shell/shell-impact/shell-impact-type.enum';
import { TankColorEnum } from '../tank/tank-color.enum';
import { TankTypeEnum } from '../tank/tank-type';
import { TrackTypeEnum } from '../tank/track/track-type.enum';
import { TurretTypeEnum } from '../tank/turret/turret-type.enum';
import { WorldTypeEnum } from '../world/world-type.enum';

const settings: Settings = {
  controls: {
    down: ['KeyS', 'ArrowDown'],
    fire: ['Enter', 'Space'],
    left: ['KeyA', 'ArrowLeft'],
    pause: ['Escape', 'KeyP'],
    playerDisconnect: ['Backspace'],
    right: ['KeyD', 'ArrowRight'],
    turbo: ['ShiftLeft', 'ShiftRight'],
    up: ['KeyW', 'ArrowUp'],
  },
  fps: 60,
  interval: 100,
  isDebugMode: false,
  isPlayerActive: true,
  tank: {
    armorType: ArmorTypeEnum.Heavy,
    color: TankColorEnum.A,
    explosionType: ExplosionTypeEnum.A,
    flashType: FlashTypeEnum.A,
    gunColor: TankColorEnum.A,
    gunType: GunTypeEnum.One,
    hullColor: TankColorEnum.A,
    hullType: HullTypeEnum.One,
    shellType: ShellTypeEnum.Heavy,
    shellImpactType: ShellImpactTypeEnum.A,
    shellSpeed: 10,
    speed: 0.75, // 0.75 - тяжелый, 1 - средний, 1.25 - легкий. За единицу скорости принято количество миллисекунд в
                 // одном кадре. Т.е. при 30 кадрах в секунду скорость 1 будет преобразована в 1/30 = 0.033.
    turboMultiplier: 1.5,
    turretType: TurretTypeEnum.One,
    trackType: TrackTypeEnum.One,
    type: TankTypeEnum.Heavy
  },
  world: {
    isAssetsRandomRotationEnabled: true,
    collisionExplosionType: ExplosionTypeEnum.H,
    resetTimeout: 5, // 0 - не перезапускать мир
    size: 500,
    showBlastTrail: true,
    squaresPerSide: 10,
    startTimeout: 8,
    type: WorldTypeEnum.B
  }
};

export default settings;
